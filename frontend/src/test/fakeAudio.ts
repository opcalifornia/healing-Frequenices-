/* Minimal Web Audio stand-in that records the graph so tests can inspect routing. */

export class FakeParam {
  value: number;
  events: Array<{ type: string; value: number; time: number }> = [];
  inputs: FakeNode[] = [];
  constructor(v = 0) {
    this.value = v;
  }
  setValueAtTime(value: number, time: number) {
    this.events.push({ type: "set", value, time });
    return this;
  }
  linearRampToValueAtTime(value: number, time: number) {
    this.events.push({ type: "ramp", value, time });
    this.value = value; // jump to the target: tests read end states
    return this;
  }
  cancelScheduledValues() {
    return this;
  }
  /** Final scheduled value. */
  get target() {
    return this.events.length ? this.events[this.events.length - 1].value : this.value;
  }
}

export interface Connection {
  to: FakeNode | FakeParam;
  output: number;
  input: number;
}

export class FakeNode {
  connections: Connection[] = [];
  constructor(public kind: string, public ctx: FakeContext) {
    ctx.nodes.push(this);
  }
  connect(to: FakeNode | FakeParam, output = 0, input = 0) {
    this.connections.push({ to, output, input });
    if (to instanceof FakeParam) to.inputs.push(this);
    return to;
  }
  disconnect() {
    this.connections = [];
  }
}

export class FakeOscillator extends FakeNode {
  type = "sine";
  frequency = new FakeParam(440);
  started = false;
  stopped = false;
  constructor(ctx: FakeContext) {
    super("oscillator", ctx);
  }
  start() {
    this.started = true;
  }
  stop() {
    this.stopped = true;
  }
}

export class FakeGain extends FakeNode {
  gain = new FakeParam(1);
  constructor(ctx: FakeContext) {
    super("gain", ctx);
  }
}

export class FakeContext {
  nodes: FakeNode[] = [];
  currentTime = 0;
  sampleRate = 8000;
  state = "running";
  destination = new FakeNode("destination", this);
  createOscillator() {
    return new FakeOscillator(this);
  }
  createGain() {
    return new FakeGain(this);
  }
  createChannelMerger(n: number) {
    const m = new FakeNode("merger", this) as FakeNode & { numberOfInputs: number };
    m.numberOfInputs = n;
    return m;
  }
  createBiquadFilter() {
    return Object.assign(new FakeNode("biquad", this), { type: "lowpass", frequency: new FakeParam(350) });
  }
  createBuffer(channels: number, length: number, sampleRate: number) {
    const data = Array.from({ length: channels }, () => new Float32Array(length));
    return { numberOfChannels: channels, length, sampleRate, duration: length / sampleRate, getChannelData: (c: number) => data[c] };
  }
  createBufferSource() {
    return Object.assign(new FakeNode("buffer", this), { buffer: null, loop: false, loopStart: 0, loopEnd: 0, start() {}, stop() {} });
  }
  resume() {
    return Promise.resolve();
  }
  suspend() {
    return Promise.resolve();
  }
}
