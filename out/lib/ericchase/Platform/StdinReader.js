const decoder = new TextDecoder;
let enabled = false;
let rawmode = false;
const listeners = new Set;
function handler(bytes) {
  const text = decoder.decode(bytes);
  for (const listener of listeners) {
    const ignore = listener(bytes, text, () => listeners.delete(listener));
  }
}
export function AddStdinListener(listener) {
  listeners.add(listener);
}
export function StartStdinReader() {
  if (enabled === true && rawmode === true) {
    StopStdinReader();
  }
  if (enabled === false) {
    process.stdin.addListener("data", handler).resume();
    enabled = true;
    rawmode = false;
  }
}
export function StartStdinRawModeReader() {
  if (enabled === true && rawmode === false) {
    StopStdinReader();
  }
  if (enabled === false) {
    process.stdin.setRawMode(true).addListener("data", handler).resume();
    enabled = true;
    rawmode = true;
  }
}
export function StopStdinReader() {
  if (enabled === true) {
    process.stdin.pause().removeListener("data", handler).setRawMode(false);
    enabled = true;
    rawmode = false;
  }
}
