export function WebPlatform_CSS_Get_Adjusted_Em(em, root = document.documentElement) {
  const font_size_in_px = Number.parseInt(getComputedStyle(root).fontSize);
  return 16 / font_size_in_px * em;
}
