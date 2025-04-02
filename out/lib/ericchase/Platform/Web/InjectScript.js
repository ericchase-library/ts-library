export function InjectScript(code) {
  const script = document.createElement("script");
  script.textContent = code;
  document.body.appendChild(script);
  return script;
}
