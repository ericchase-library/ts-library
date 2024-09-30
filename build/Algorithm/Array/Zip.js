export function* Zip(...b) {
  function g(a) {
    const h = [];
    let d = 0;
    while (d < a.length) {
      const e = a[d].next();
      if ('done' in e && e.done) {
        f++;
        a[d] = l;
      }
      h.push('value' in e ? e.value : undefined);
      d++;
    }
    return h;
  }
  let f = 0;
  const l = {
    next(...a) {
      return { value: undefined };
    },
    [Symbol.iterator]() {
      return this;
    },
  };
  const c = b.map((a) => {
    if (a !== null && a !== undefined) {
      if (Symbol.iterator in a) {
        const i = a[Symbol.iterator]();
        if (i !== null && i !== undefined) {
          if ('next' in i) {
            return i;
          }
        }
      }
    }
    f++;
    return l;
  });
  let k = g(c);
  while (f < c.length) {
    yield k;
    k = g(c);
  }
}
