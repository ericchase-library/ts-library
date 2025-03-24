export function DiscardError(fn) {
  try {
    return fn();
  } catch (_) {}
  return;
}
