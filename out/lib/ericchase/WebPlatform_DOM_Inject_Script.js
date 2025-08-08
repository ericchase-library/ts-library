export function WebPlatform_DOM_Inject_Script(code, setup_fn) {
  const script = document.createElement("script");
  setup_fn?.(script);
  script.textContent = code;
  document.body.appendChild(script);
  return script;
}
