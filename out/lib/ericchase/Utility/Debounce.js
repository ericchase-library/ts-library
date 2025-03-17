import { Defer } from "src/lib/ericchase/Utility/Defer.js";
export function Debounce(fn, delay_ms) {
  let deferred = Defer();
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      try {
        await fn(...args);
        deferred.resolve();
      } catch (error) {
        deferred.reject(error);
      }
      deferred = Defer();
    }, delay_ms);
    return deferred.promise;
  };
}
export function ImmediateDebounce(fn, delay_ms) {
  let deferred = Defer();
  let timeout;
  return (...args) => {
    if (timeout === undefined) {
      (async () => {
        await fn(...args);
        deferred.resolve();
      })().catch((error) => {
        deferred.reject(error);
      });
    }
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = undefined;
      deferred = Defer();
    }, delay_ms);
    return deferred.promise;
  };
}
export const LeadingEdgeDebounce = ImmediateDebounce;
