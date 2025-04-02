export function InjectScript(code: string) {
  const script = document.createElement('script');
  script.textContent = code;
  document.body.appendChild(script);
  return script;
}
