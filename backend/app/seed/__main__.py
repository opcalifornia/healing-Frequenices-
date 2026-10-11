"""Seed MongoDB and/or export the catalog JSON bundled with the front end.

    python -m app.seed                 # upsert all content into MongoDB
    python -m app.seed export [--out PATH]
    python -m app.seed check           # validate content only
"""

from __future__ import annotations

import argparse
import asyncio
import json
from pathlib import Path

from .articles import ARTICLES
from .build import SECTIONS, build_titles, resolve_catalog
from .validate import validate

DEFAULT_OUT = Path(__file__).resolve().parents[3] / "frontend" / "src" / "data" / "catalog.json"


def export(out: Path) -> None:
    titles = build_titles()
    validate(titles)
    catalog = resolve_catalog(titles)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(catalog, indent=1, ensure_ascii=False) + "\n")
    sessions = sum(1 for t in titles if t["kind"] != "show")
    shows = sum(1 for t in titles if t["kind"] == "show")
    print(f"Exported {sessions} sessions, {shows} shows, {len(ARTICLES)} articles -> {out}")


async def seed_db() -> None:
    from ..db import get_database
    from ..services.catalog import seed_catalog

    titles = build_titles()
    validate(titles)
    db = get_database()
    counts = await seed_catalog(db, titles, SECTIONS, ARTICLES)
    print(f"Seeded MongoDB: {counts}")


def main() -> None:
    parser = argparse.ArgumentParser(prog="python -m app.seed")
    sub = parser.add_subparsers(dest="cmd")
    ex = sub.add_parser("export", help="write catalog JSON for the front end")
    ex.add_argument("--out", type=Path, default=DEFAULT_OUT)
    sub.add_parser("check", help="validate content")
    args = parser.parse_args()

    if args.cmd == "export":
        export(args.out)
    elif args.cmd == "check":
        titles = build_titles()
        validate(titles)
        print(f"OK: {len(titles)} titles valid")
    else:
        asyncio.run(seed_db())


if __name__ == "__main__":
    main()
