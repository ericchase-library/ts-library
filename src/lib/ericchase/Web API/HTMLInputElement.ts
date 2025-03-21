import { HasProperty } from 'src/lib/ericchase/Utility/Guard.js';
import { IsDeviceMobile } from 'src/lib/ericchase/Web API/Device.js';

export function Compat_HTMLInputElement(input?: HTMLInputElement) {
  return {
    get webkitEntries(): HTMLInputElement['webkitEntries'] | undefined {
      return HasProperty(input, 'webkitEntries') ? input.webkitEntries : undefined;
    },
    get webkitdirectory(): HTMLInputElement['webkitdirectory'] | undefined {
      return HasProperty(input, 'webkitdirectory') ? input.webkitdirectory : undefined;
    },
  };
}

export function IsWebkitDirectorySupported(): boolean {
  return IsDeviceMobile() ? false : true;
}
