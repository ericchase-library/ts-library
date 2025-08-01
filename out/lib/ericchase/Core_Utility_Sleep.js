export function Async_Core_Utility_Sleep(duration_ms) {
  return new Promise((resolve) => setTimeout(() => {
    resolve();
  }, duration_ms));
}
