export function ConsumeEvent(e) {
  e.preventDefault();
  e.stopImmediatePropagation();
  e.stopPropagation();
}
