export function* Zip(...b) {
  function g(a) {
    const h = [];
    let d = 0;
    for (; d < a.length; ) {
      const e = a[d].next();
      'done' in e && e.done && (a[d] = (++f, l));
      h.push('value' in e ? e.value : undefined);
      ++d;
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
  let c = b
    .map((a) => a ?? (++f, l))
    .map((a) => (Symbol.iterator in a ? a : (++f, l)))
    .map((a) => a[Symbol.iterator]() ?? (++f, l))
    .map((a) => ('next' in a ? a : (++f, l)));
  let k = g(c);
  for (; f < c.length; ) yield k, (k = g(c));
}
