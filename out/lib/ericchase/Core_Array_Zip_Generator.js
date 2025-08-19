export function* Core_Array_Zip_Generator(...iterables) {
  let mock_count = 0;
  const mock_iterable = {
    next() {
      return { value: undefined, done: false };
    },
    [Symbol.iterator]() {
      return this;
    },
  };
  function process_iterators(iterators) {
    const values = [];
    for (let index = 0; index < iterators.length; index++) {
      const next = iterators[index].next();
      if ('done' in next && next.done === true) {
        mock_count++;
        iterators[index] = mock_iterable;
        values[index] = undefined;
      } else {
        values[index] = 'value' in next ? next.value : undefined;
      }
    }
    return values;
  }
  const iterators = [];
  for (const iterable of iterables) {
    try {
      iterators.push(iterable[Symbol.iterator]());
    } catch (error) {
      mock_count++;
      iterators.push(mock_iterable[Symbol.iterator]());
    }
  }
  let values = process_iterators(iterators);
  while (mock_count < iterators.length) {
    yield values;
    values = process_iterators(iterators);
  }
}
