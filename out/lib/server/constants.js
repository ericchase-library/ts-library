export const SERVERHOST = CheckENV() ?? CheckCurrentScript() ?? CheckMetaUrl() ?? CheckError() ?? window.location.host;
function CheckENV() {
  try {
    return process.env.SERVERHOST;
  } catch {}
}
function CheckCurrentScript() {
  try {
    return new URL(document.currentScript.src).host;
  } catch {}
}
function CheckMetaUrl() {
  try {
    return new URL(import.meta.url).host;
  } catch {}
}
function CheckError() {
  try {
    return new URL(new Error().fileName).host;
  } catch {}
}
