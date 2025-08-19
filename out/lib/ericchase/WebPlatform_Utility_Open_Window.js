export function WebPlatform_Utility_Open_Window(url, cb_load, cb_unload) {
  const proxy = window.open(url, '_blank');
  if (proxy) {
    if (cb_load) {
      proxy.addEventListener('load', (event) => {
        cb_load(proxy, event);
      });
    }
    if (cb_unload) {
      proxy.addEventListener('unload', (event) => {
        cb_unload(proxy, event);
      });
    }
  }
}
