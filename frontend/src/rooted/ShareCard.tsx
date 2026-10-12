import { useEffect, useRef, useState } from "react";
import { Sheet, useToast } from "./ui";
import { Icon } from "../components/Icon";
import { canvasToBlob, drawCard, type CardData, type CardFormat } from "./shareCard";

/** A button that opens a share sheet with a live preview of the card. */
export function ShareButton({ data, label = "Share", className = "btn btn--secondary btn--small", allowStress = false }: { data: CardData; label?: string; className?: string; allowStress?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className={className} onClick={() => setOpen(true)}><Icon name="sparkle" size={16} /> {label}</button>
      <ShareSheet open={open} onClose={() => setOpen(false)} data={data} allowStress={allowStress} />
    </>
  );
}

export function ShareSheet({ open, onClose, data, allowStress }: { open: boolean; onClose(): void; data: CardData; allowStress: boolean }) {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const [format, setFormat] = useState<CardFormat>("post");
  const [showStress, setShowStress] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const toast = useToast();
  const card: CardData = data.kind === "week" && !(allowStress && showStress) ? { ...data, stressDrop: undefined } : data;
  const key = JSON.stringify([card, format]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const c = (canvas.current ??= document.createElement("canvas"));
    void drawCard(c, card, format).then(() => !cancelled && setUrl(c.toDataURL("image/png")));
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, key]);

  const fileName = data.kind === "week" ? "rooted-my-week.png" : `rooted-${data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
  const caption = data.kind === "week" ? `My week with Rooted: ${data.minutes} minutes of small, proven habits. 🌱` : `Just finished ${data.title} on Rooted. 🌱`;

  const share = async () => {
    if (!canvas.current) return;
    const blob = await canvasToBlob(canvas.current);
    if (!blob) return;
    const file = new File([blob], fileName, { type: "image/png" });
    const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
    if (nav.share && nav.canShare?.({ files: [file] })) {
      try {
        await nav.share({ files: [file], text: caption });
        return;
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
      }
    }
    download(blob);
  };

  const download = (blob?: Blob) => {
    const go = (b: Blob) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(b);
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      toast.show("Image saved");
    };
    if (blob) go(blob);
    else if (canvas.current) void canvasToBlob(canvas.current).then((b) => b && go(b));
  };

  return (
    <Sheet open={open} onClose={onClose} label="Share card">
      <div className="share">
        <h2>Share your progress</h2>
        <p className="share__hint">Made on your device. Nothing is posted unless you choose to share it.</p>
        <div className={`share__preview share__preview--${format}`}>
          {url ? <img src={url} alt={caption} /> : <span className="share__loading">Drawing…</span>}
        </div>
        <div className="share__opts" role="group" aria-label="Card shape">
          <button className={`chip ${format === "post" ? "is-on" : ""}`} aria-pressed={format === "post"} onClick={() => setFormat("post")}>Post (4:5)</button>
          <button className={`chip ${format === "story" ? "is-on" : ""}`} aria-pressed={format === "story"} onClick={() => setFormat("story")}>Story (9:16)</button>
        </div>
        {allowStress && data.kind === "week" && data.stressDrop !== undefined && data.stressDrop > 0 && (
          <label className="share__toggle">
            <input type="checkbox" checked={showStress} onChange={(e) => setShowStress(e.target.checked)} />
            <span>Include my average stress drop</span>
          </label>
        )}
        <div className="share__actions">
          <button className="btn btn--primary" onClick={() => void share()} disabled={!url}><Icon name="sparkle" size={18} /> Share</button>
          <button className="btn btn--secondary" onClick={() => download()} disabled={!url}><Icon name="plus" size={18} /> Save image</button>
        </div>
        <p className="share__hint">On a phone, you can also press and hold the image to save it.</p>
      </div>
      {toast.node}
    </Sheet>
  );
}
