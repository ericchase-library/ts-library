export function ToRelativePx(px, root = document.documentElement) {
  const fontSizePx = Number.parseInt(getComputedStyle(root).fontSize);
  return fontSizePx / 16 * px;
}
export function ToAdjustedEm(em, root = document.documentElement) {
  const fontSizePx = Number.parseInt(getComputedStyle(root).fontSize);
  return 16 / fontSizePx * em;
}
export function ToRelativeEm(em, root = document.documentElement) {
  const fontSizePx = Number.parseInt(getComputedStyle(root).fontSize);
  return fontSizePx / 16 * em;
}
