import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("../api/client", () => ({ API_URL: "https://api.example.com", apiEnabled: true, authHeader: () => ({ Authorization: "Bearer t" }) }));

import { askGaia, readEvents, type GaiaEvent, type GaiaTurn } from "../rooted/gaia";

function streamOf(chunks: string[]): ReadableStream<Uint8Array> {
  const enc = new TextEncoder();
  return new ReadableStream({
    start(c) {
      for (const ch of chunks) c.enqueue(enc.encode(ch));
      c.close();
    },
  });
}

async function collect(gen: AsyncGenerator<GaiaEvent>): Promise<GaiaEvent[]> {
  const out: GaiaEvent[] = [];
  for await (const e of gen) out.push(e);
  return out;
}

afterEach(() => vi.unstubAllGlobals());

describe("reading GAIA's stream", () => {
  it("handles events split across chunks and skips bad lines", async () => {
    const evs = await collect(readEvents(streamOf(['data: {"type":"te', 'xt","text":"Hi"}\n\ndata: not json\n\n', 'data: {"type":"done"}\n\n'])));
    expect(evs).toEqual([{ type: "text", text: "Hi" }, { type: "done" }]);
  });
});

describe("asking GAIA", () => {
  it("sends recent turns starting with the person, plus a profile snapshot", async () => {
    let body: { messages: GaiaTurn[]; profile: Record<string, unknown> } | null = null;
    vi.stubGlobal("fetch", vi.fn(async (_url: string, init: RequestInit) => {
      body = JSON.parse(String(init.body));
      return new Response(streamOf(['data: {"type":"done"}\n\n']), { status: 200 });
    }));
    const turns: GaiaTurn[] = Array.from({ length: 25 }, (_, i) => ({ role: i % 2 ? "assistant" : "user", text: `m${i}` }));
    turns.push({ role: "assistant", text: "" });
    await collect(askGaia(turns.slice(0, 25)));
    expect(body!.messages.length).toBeLessThanOrEqual(20);
    expect(body!.messages[0].role).toBe("user");
    expect(body!.messages.at(-1)).toEqual({ role: "user", text: "m24" });
    expect(body!.profile).toHaveProperty("local_time");
  });

  it("explains limits and outages kindly", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("", { status: 429 })));
    expect((await collect(askGaia([{ role: "user", text: "hi" }])))[0]).toMatchObject({ type: "error", message: expect.stringContaining("limit") });
    vi.stubGlobal("fetch", vi.fn(async () => new Response("", { status: 500 })));
    expect((await collect(askGaia([{ role: "user", text: "hi" }])))[0]).toMatchObject({ type: "error" });
  });
});
