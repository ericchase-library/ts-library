export function SERVERHOST() {
  const CheckENV = () => {
    try {
      return process.env.SERVERHOST;
    } catch {}
  };
  const CheckCurrentScript = () => {
    try {
      return new URL(document.currentScript.src).host;
    } catch {}
  };
  const CheckMetaUrl = () => {
    try {
      return new URL(import.meta.url).host;
    } catch {}
  };
  const CheckError = () => {
    try {
      return new URL(new Error().fileName).host;
    } catch {}
  };
  return CheckENV() ?? CheckCurrentScript() ?? CheckMetaUrl() ?? CheckError() ?? window.location.host;
}
