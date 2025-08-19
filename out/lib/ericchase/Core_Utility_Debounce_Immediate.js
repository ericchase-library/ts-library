import { Core_Promise_Deferred_Class } from './Core_Promise_Deferred_Class.js';
import { Core_Promise_Orphan } from './Core_Promise_Orphan.js';
export function Core_Utility_Debounce_Immediate(fn, delay_ms) {
  let deferred = Core_Promise_Deferred_Class();
  let timeout = undefined;
  async function async_callback(...args) {
    try {
      await fn(...args);
      deferred.resolve();
    } catch (error) {
      deferred.reject(error);
    }
  }
  return (...args) => {
    if (timeout === undefined) {
      Core_Promise_Orphan(async_callback(...args));
    }
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      deferred = Core_Promise_Deferred_Class();
      timeout = undefined;
    }, delay_ms);
    return deferred.promise;
  };
}
