import { useState } from "react";
import { Sheet, useToast } from "./ui";
import { Icon } from "../components/Icon";
import { inviteLink, inviteMessage } from "./invite";
import { useActiveProfile, useUser } from "../store/user";

/** "Invite a friend": a personal link that opens a welcome page for that program. */
export function InviteButton({ programId, programTitle, label = "Invite a friend", className = "btn btn--secondary btn--small" }: { programId?: string; programTitle?: string; label?: string; className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className={className} onClick={() => setOpen(true)}><Icon name="user" size={16} /> {label}</button>
      <InviteSheet open={open} onClose={() => setOpen(false)} programId={programId} programTitle={programTitle} />
    </>
  );
}

export function InviteSheet({ open, onClose, programId, programTitle }: { open: boolean; onClose(): void; programId?: string; programTitle?: string }) {
  const profile = useActiveProfile();
  const refCode = useUser((s) => s.account?.refCode) ?? undefined;
  // Default profile names ("Listener", "Guest") aren't real names, so start blank for those.
  const realName = profile && !["listener", "guest"].includes(profile.name.toLowerCase()) ? profile.name : "";
  const [withName, setWithName] = useState(!!realName);
  const [name, setName] = useState(realName);
  const toast = useToast();
  const link = inviteLink({ p: programId, from: withName && name.trim() ? name.trim() : undefined, ref: refCode });
  const message = inviteMessage(programTitle, link);

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Join me on Rooted", text: message.replace(link, "").trim(), url: link });
        return;
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
      }
    }
    await copy();
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      toast.show("Invite copied. Paste it anywhere");
    } catch {
      toast.show("Press and hold the link to copy it");
    }
  };

  return (
    <Sheet open={open} onClose={onClose} label="Invite a friend">
      <div className="invite">
        <h2>{programTitle ? `Do ${programTitle} together` : "Invite a friend to Rooted"}</h2>
        <p className="invite__hint">Habits stick better with company. Your friend gets a welcome page and can start in seconds, free.</p>
        <label className="invite__toggle">
          <input type="checkbox" checked={withName} onChange={(e) => setWithName(e.target.checked)} />
          <span>Show my first name on the invite</span>
        </label>
        {withName && (
          <label className="invite__field">
            <span>Name they'll see</span>
            <input value={name} maxLength={24} onChange={(e) => setName(e.target.value)} />
          </label>
        )}
        <div className="invite__preview" aria-label="Message preview">{message}</div>
        <div className="invite__actions">
          <button className="btn btn--primary" onClick={() => void share()}><Icon name="sparkle" size={18} /> Send invite</button>
          <button className="btn btn--secondary" onClick={() => void copy()}><Icon name="plus" size={18} /> Copy</button>
          <a className="btn btn--secondary" href={`sms:?&body=${encodeURIComponent(message)}`}><Icon name="message" size={18} /> Text</a>
        </div>
        <p className="invite__hint">The link includes only the program{withName ? " and your first name" : ""}. Nothing about your health or progress.</p>
      </div>
      {toast.node}
    </Sheet>
  );
}
