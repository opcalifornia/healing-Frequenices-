type Saver = { save(o: { filename: string; data: string }): Promise<unknown> };
type ClaudeHost = { use?(n: string): Promise<Saver | null> };

/** Save a generated text file. Inside the claude.ai preview, it goes through the viewer's download prompt. */
export async function saveTextFile(name: string, text: string, type = "text/plain") {
  const host = (window as unknown as { claude?: ClaudeHost }).claude;
  if (host?.use) {
    const saver = await host.use("downloads").catch(() => null);
    if (saver) {
      await saver.save({ filename: name, data: text }).catch(() => undefined);
      return;
    }
  }
  const url = URL.createObjectURL(new Blob([text], { type: `${type};charset=utf-8` }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
