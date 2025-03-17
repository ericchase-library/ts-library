export function Defer() {
  let resolve = (value) => {};
  let reject = (reason) => {};
  return {
    promise: new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    }),
    resolve,
    reject
  };
}
