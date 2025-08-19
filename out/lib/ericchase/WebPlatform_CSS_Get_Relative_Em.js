export function WebPlatform_CSS_Get_Relative_Em(em, root = document.documentElement) {
  const font_size_in_px = Number.parseInt(getComputedStyle(root).fontSize);
  return (font_size_in_px / 16) * em;
}
