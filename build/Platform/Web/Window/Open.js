export function OpenWindow(url, onLoad, onUnload) {
  const proxy = window.open(url, '_blank');
  if (proxy) {
    if (onLoad) {
      proxy.addEventListener('load', (event) => {
        onLoad(proxy, event);
      });
    }
    if (onUnload) {
      proxy.addEventListener('unload', (event) => {
        onUnload(proxy, event);
      });
    }
  }
}
