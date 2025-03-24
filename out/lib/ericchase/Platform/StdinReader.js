import { Orphan } from "../Utility/Promise.js";
const decoder = new TextDecoder;
let enabled = false;
let rawmode = false;
const listeners = new Set;
function handler(bytes) {
  const text = decoder.decode(bytes);
  for (const listener of listeners) {
    Orphan(listener(bytes, text, () => listeners.delete(listener)));
  }
}
function SwitchToLineReader() {
  if (enabled === true && rawmode === true) {
    StopStdInReader();
  }
  if (enabled === false) {
    process.stdin.addListener("data", handler).resume();
    enabled = true;
    rawmode = false;
  }
}
function SwitchToRawModeReader() {
  if (enabled === true && rawmode === false) {
    StopStdInReader();
  }
  if (enabled === false) {
    process.stdin.setRawMode(true).addListener("data", handler).resume();
    enabled = true;
    rawmode = true;
  }
}
function StopReader() {
  if (enabled === true) {
    process.stdin.pause().removeListener("data", handler).setRawMode(false);
    enabled = true;
    rawmode = false;
  }
}
export function AddStdInListener(listener) {
  listeners.add(listener);
}
const locks = new Set;
export function GetStdInReaderLock() {
  const release = () => {
    locks.delete(release);
    if (locks.size === 0) {
      StopReader();
    }
  };
  locks.add(release);
  return release;
}
export function StartStdInReader() {
  SwitchToLineReader();
}
export function StartStdInRawModeReader() {
  SwitchToRawModeReader();
}
export function StopStdInReader() {
  if (locks.size === 0) {
    StopReader();
  }
}
