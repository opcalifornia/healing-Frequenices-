"""Small in-process sliding-window rate limiter.

State lives in this process's memory, which is right for a single API
instance (the current Render/Railway setup). If the API is ever scaled to
several instances or workers, each one keeps its own counters, so the
effective limit becomes N times higher. At that point move the counters to a
shared store (for example Redis with a sorted set per key, or a Mongo
collection with a TTL index) behind the same `hit`/`blocked` interface.
"""

from __future__ import annotations

import math
import threading
import time
from collections import deque
from typing import Callable

from fastapi import HTTPException, Request, status


class SlidingWindowLimiter:
    """Allow at most `limit` events per `window` seconds for each key."""

    def __init__(self, limit: int, window: float, *, max_keys: int = 50_000, clock: Callable[[], float] = time.monotonic) -> None:
        self.limit = limit
        self.window = window
        self.max_keys = max_keys
        self._clock = clock
        self._hits: dict[str, deque[float]] = {}
        self._lock = threading.Lock()

    def _trim(self, q: deque[float], now: float) -> None:
        while q and q[0] <= now - self.window:
            q.popleft()

    def _retry_after(self, q: deque[float], now: float) -> int:
        return max(1, math.ceil(q[0] + self.window - now))

    def blocked(self, key: str) -> int | None:
        """Seconds until `key` may try again, or None if it is under the limit. Records nothing."""
        with self._lock:
            q = self._hits.get(key)
            if not q:
                return None
            now = self._clock()
            self._trim(q, now)
            return self._retry_after(q, now) if len(q) >= self.limit else None

    def hit(self, key: str) -> int | None:
        """Record one event for `key`. Returns seconds to wait if the key is over the limit (the event is not counted)."""
        with self._lock:
            now = self._clock()
            q = self._hits.get(key)
            if q is None:
                if len(self._hits) >= self.max_keys:
                    self._evict(now)
                q = self._hits[key] = deque()
            self._trim(q, now)
            if len(q) >= self.limit:
                return self._retry_after(q, now)
            q.append(now)
            return None

    def reset(self, key: str) -> None:
        with self._lock:
            self._hits.pop(key, None)

    def _evict(self, now: float) -> None:
        # Bound memory: drop expired keys, and if that is not enough, the oldest half.
        for k in [k for k, q in self._hits.items() if not q or q[-1] <= now - self.window]:
            del self._hits[k]
        if len(self._hits) >= self.max_keys:
            oldest = sorted(self._hits, key=lambda k: self._hits[k][-1])[: len(self._hits) // 2]
            for k in oldest:
                del self._hits[k]


def too_many(retry_after: int) -> HTTPException:
    return HTTPException(status.HTTP_429_TOO_MANY_REQUESTS, "Too many attempts. Please wait and try again.", headers={"Retry-After": str(retry_after)})


def client_ip(request: Request) -> str:
    """The caller's IP address.

    `X-Forwarded-For` is only honoured when TRUST_PROXY is on, because anyone
    can send that header. With it on, the right-most entry is used: that is the
    address the nearest proxy (Render/Railway's load balancer) actually saw;
    entries to its left are whatever the client claimed.
    """
    if getattr(request.app.state, "trust_proxy", False):
        xff = request.headers.get("x-forwarded-for", "")
        hops = [h.strip() for h in xff.split(",") if h.strip()]
        if hops:
            return hops[-1]
    return request.client.host if request.client else "unknown"
