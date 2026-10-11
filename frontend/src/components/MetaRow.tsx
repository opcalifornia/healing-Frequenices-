import { Fragment } from "react";
import { metaParts } from "../format";
import type { Title } from "../types";

export function MetaRow({ title, extra }: { title: Title; extra?: string[] }) {
  const parts = [...metaParts(title), ...(extra ?? [])];
  return (
    <div className="meta-row">
      <span className="rating">{title.comingSoon ? "SOON" : "ALL"}</span>
      {parts.map((p) => (
        <Fragment key={p}>
          <span className="dot" />
          <span>{p}</span>
        </Fragment>
      ))}
    </div>
  );
}
