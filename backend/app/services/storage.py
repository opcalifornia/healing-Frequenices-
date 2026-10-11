"""Hosted media seam (Cloudflare R2, S3-compatible).

Titles may later carry a `media` field, e.g. {"audio": "episodes/x.m4a",
"video": "episodes/x/master.m3u8"}. The API hands out short-lived signed URLs
so the bucket stays private. Requires `pip install boto3` and R2_* settings.
"""

from __future__ import annotations

from typing import Any

from ..config import get_settings


class StorageNotConfigured(RuntimeError):
    pass


def _client() -> Any:
    s = get_settings()
    if not s.r2_enabled:
        raise StorageNotConfigured("R2 is not configured")
    import boto3  # type: ignore[import-not-found]  # installed when hosted media launches

    return boto3.client(
        "s3",
        endpoint_url=f"https://{s.r2_account_id}.r2.cloudflarestorage.com",
        aws_access_key_id=s.r2_access_key_id,
        aws_secret_access_key=s.r2_secret_access_key,
        region_name="auto",
    )


def signed_url(key: str, expires: int = 3600) -> str:
    s = get_settings()
    if s.r2_public_base_url:
        return f"{s.r2_public_base_url.rstrip('/')}/{key}"
    return _client().generate_presigned_url("get_object", Params={"Bucket": s.r2_bucket, "Key": key}, ExpiresIn=expires)
