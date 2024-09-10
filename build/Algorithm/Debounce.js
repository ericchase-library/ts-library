export function Debounce(callback, delay) {
  let timer = undefined;
  let calling = false;
  return function () {
    if (calling === false) {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        if (calling === false) {
          calling = true;
          clearTimeout(timer);
          await callback();
          clearTimeout(timer);
          calling = false;
        }
      }, delay);
    }
  };
}
