export function Core_String_GetLeftMarginSize(text) {
  let i = 0;
  for (;i < text.length; i++) {
    if (text[i] !== " ") {
      break;
    }
  }
  return i;
}
