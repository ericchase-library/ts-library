export function InjectScript(code) {
  if (document) {
    const script = document.createElement("script");
    script.textContent = code;
    document.body.appendChild(script);
    return script;
  }
}
