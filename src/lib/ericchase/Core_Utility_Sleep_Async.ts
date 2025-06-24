export function Core_Utility_Sleep_Async(duration_ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, duration_ms));
}
