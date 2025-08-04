export function WebPlatform_DOM_Inject_Script(code) {
  const script = document.createElement("script");
  script.textContent = code;
  document.body.appendChild(script);
  return script;
}
