"""Plain ASGI middleware: security headers and a request body size cap."""

from __future__ import annotations

from typing import Any, Awaitable, Callable

Scope = dict[str, Any]
Message = dict[str, Any]
Receive = Callable[[], Awaitable[Message]]
Send = Callable[[Message], Awaitable[None]]
ASGIApp = Callable[[Scope, Receive, Send], Awaitable[None]]

#: Paths whose responses carry account or health data and must never be stored by a cache.
NO_STORE_PREFIXES = ("/api/profiles", "/api/me", "/api/auth")


class SecurityHeadersMiddleware:
    def __init__(self, app: ASGIApp, *, hsts: bool = False) -> None:
        self.app = app
        self.hsts = hsts

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return
        path: str = scope.get("path", "")
        no_store = path.startswith(NO_STORE_PREFIXES)

        async def send_with_headers(message: Message) -> None:
            if message["type"] == "http.response.start":
                headers = list(message.get("headers", []))
                present = {k.lower() for k, _ in headers}

                def add(name: bytes, value: bytes, *, override: bool = False) -> None:
                    nonlocal headers
                    if override:
                        headers = [(k, v) for k, v in headers if k.lower() != name]
                    elif name in present:
                        return
                    headers.append((name, value))

                add(b"x-content-type-options", b"nosniff")
                # Calendar feed tokens live in URLs; never leak them via Referer.
                add(b"referrer-policy", b"no-referrer")
                add(b"x-frame-options", b"DENY")
                if self.hsts:
                    add(b"strict-transport-security", b"max-age=31536000; includeSubDomains")
                if no_store:
                    add(b"cache-control", b"no-store", override=True)
                    add(b"pragma", b"no-cache")
                message = {**message, "headers": headers}
            await send(message)

        await self.app(scope, receive, send_with_headers)


class BodySizeLimitMiddleware:
    """Reject request bodies larger than `max_bytes` with 413, before any parsing.

    Checks Content-Length up front and also counts streamed (chunked) bodies,
    buffering at most `max_bytes` before handing the body to the app.
    """

    def __init__(self, app: ASGIApp, *, max_bytes: int) -> None:
        self.app = app
        self.max_bytes = max_bytes

    async def _reject(self, send: Send) -> None:
        body = b'{"detail":"Request body too large"}'
        await send({
            "type": "http.response.start",
            "status": 413,
            "headers": [(b"content-type", b"application/json"), (b"content-length", str(len(body)).encode())],
        })
        await send({"type": "http.response.body", "body": body})

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return
        for k, v in scope.get("headers", []):
            if k == b"content-length":
                try:
                    if int(v) > self.max_bytes:
                        await self._reject(send)
                        return
                except ValueError:
                    pass

        chunks: list[bytes] = []
        size = 0
        while True:
            message = await receive()
            if message["type"] != "http.request":
                # Client went away; let the app see it.
                buffered = [message]
                break
            chunk = message.get("body", b"")
            size += len(chunk)
            if size > self.max_bytes:
                await self._reject(send)
                return
            chunks.append(chunk)
            if not message.get("more_body", False):
                buffered = [{"type": "http.request", "body": b"".join(chunks), "more_body": False}]
                break

        async def replay() -> Message:
            if buffered:
                return buffered.pop(0)
            return await receive()

        await self.app(scope, replay, send)
