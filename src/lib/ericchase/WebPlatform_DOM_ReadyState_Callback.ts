export function WebPlatform_DOM_ReadyState_Callback(config: Config) {
  function DOMContentLoaded() {
    removeEventListener('DOMContentLoaded', DOMContentLoaded);
    config.DOMContentLoaded?.();
  }
  function load() {
    removeEventListener('load', load);
    config.load?.();
  }
  switch (document.readyState) {
    case 'loading':
      if (config.DOMContentLoaded !== undefined) {
        addEventListener('DOMContentLoaded', DOMContentLoaded);
      }
      if (config.load !== undefined) {
        addEventListener('load', load);
      }
      break;
    case 'interactive':
      config.DOMContentLoaded?.();
      if (config.load !== undefined) {
        addEventListener('load', load);
      }
      break;
    case 'complete':
      config.DOMContentLoaded?.();
      config.load?.();
      break;
  }
}
interface Config {
  DOMContentLoaded?: () => void;
  load?: () => void;
}
