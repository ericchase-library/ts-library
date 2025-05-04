const ARRAY__UINT8__BYTE_TO_B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const ARRAY__UINT8__B64_TO_BYTE = new Map([...ARRAY__UINT8__BYTE_TO_B64].map((char, byte) => [char, byte]));
const ARRAY__UINT8__EMPTY = Uint8Array.from([]);
const MATH__FACTORIAL__CACHE = [BigInt(1), BigInt(1)];
const UTILITY__CRC32__TABLE = new Uint32Array(256);
const UTILITY__CRC32__MAGIC = new Uint32Array([3988292384]);
for (let i = 0;i < 256; i++) {
  UTILITY__CRC32__TABLE[i] = i;
  for (let k = 0;k < 8; k++) {
    if (UTILITY__CRC32__TABLE[i] >>> 0 & 1) {
      UTILITY__CRC32__TABLE[i] = UTILITY__CRC32__MAGIC[0] ^ UTILITY__CRC32__TABLE[i] >>> 1;
    } else {
      UTILITY__CRC32__TABLE[i] >>>= 1;
    }
  }
}

class ClassArrayUint8Group {
  arrays = new Array;
  byteLength = 0;
  add(bytes) {
    this.arrays.push(bytes);
    this.byteLength += bytes.byteLength;
    return this.byteLength;
  }
  get(count, offset = 0) {
    const out = new Uint8Array(count);
    let i_out = 0;
    if (offset === 0) {
      for (const bytes of this.arrays) {
        for (let i_bytes = 0;i_bytes < bytes.byteLength; i_bytes++) {
          out[i_out] = bytes[i_bytes];
          i_out++;
          if (i_out >= count) {
            return out;
          }
        }
      }
    } else {
      let i_total = 0;
      for (const bytes of this.arrays) {
        for (let i_bytes = 0;i_bytes < bytes.byteLength; i_bytes++) {
          i_total++;
          if (i_total >= offset) {
            out[i_out] = bytes[i_bytes];
            i_out++;
            if (i_out >= count) {
              return out;
            }
          }
        }
      }
    }
    return out;
  }
}

class ClassStreamUint8Reader {
  reader;
  done = false;
  i = 0;
  length = 0;
  value = ARRAY__UINT8__EMPTY;
  constructor(reader) {
    this.reader = reader;
  }
  async next() {
    const { done, value = ARRAY__UINT8__EMPTY } = await this.reader.read();
    if (this.done === done && this.value === value) {
      return { changed: false };
    }
    this.done = done;
    this.i = 0;
    this.length = value.length;
    this.value = value;
    return { changed: true };
  }
  releaseLock() {
    this.reader.releaseLock();
  }
}

class ClassUtilityCRC32 {
  $state = new Uint32Array([4294967295]);
  update(bytes) {
    for (let index = 0;index < bytes.length; index++) {
      this.$state[0] = UTILITY__CRC32__TABLE[(this.$state[0] ^ bytes[index]) & 255] ^ this.$state[0] >>> 8;
    }
  }
  get value() {
    return (this.$state[0] ^ 4294967295 >>> 0) >>> 0;
  }
}

class ClassUtilityDefer {
  promise;
  resolve;
  reject;
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
    if (this.resolve === undefined || this.reject === undefined) {
      throw new Error(`${ClassUtilityDefer.name}'s constructor failed to setup promise functions.`);
    }
  }
}
function* array__gen_buffertobytes(buffer) {
  const view = new DataView(buffer);
  for (let i = 0;i < view.byteLength; i++) {
    yield view.getUint8(i) >>> 0;
  }
}
function* array__gen_chunks(array, count) {
  if (count > array.length) {
    yield { begin: 0, end: array.length, slice: array.slice() };
  } else if (count > 0) {
    let i = count;
    for (;i < array.length; i += count) {
      yield { begin: i - count, end: i, slice: array.slice(i - count, i) };
    }
    yield { begin: i - count, end: array.length, slice: array.slice(i - count) };
  } else {
    yield { begin: 0, end: 0, slice: [] };
  }
}
function* array__gen_slidingwindow(array, count) {
  if (count > 0) {
    if (count < array.length) {
      let i = count;
      for (;i < array.length; i++) {
        yield { begin: i - count, end: i, slice: array.slice(i - count, i) };
      }
      yield { begin: i - count, end: array.length, slice: array.slice(i - count) };
    } else {
      yield { begin: 0, end: array.length, slice: array.slice() };
    }
  }
}
function* array__gen_zip(...iterables) {
  let mock_count = 0;
  const mock_iterable = {
    next() {
      return { value: undefined, done: true };
    },
    [Symbol.iterator]() {
      return this;
    }
  };
  function process_iterators(iterators) {
    const values = [];
    for (let index = 0;index < iterators.length; index++) {
      const next = iterators[index].next();
      if ("done" in next && next.done) {
        mock_count++;
        iterators[index] = mock_iterable;
      }
      values[index] = "value" in next ? next.value : undefined;
    }
    return values;
  }
  const iterators = iterables.map((iterable) => {
    if (iterable != null && typeof iterable[Symbol.iterator] === "function") {
      const iterator = iterable[Symbol.iterator]();
      if (iterator && "next" in iterator) {
        return iterator;
      }
    }
    mock_count++;
    return mock_iterable;
  });
  let values = process_iterators(iterators);
  while (mock_count < iterators.length) {
    yield values;
    values = process_iterators(iterators);
  }
}
function array__areequal(array, other) {
  if (array.length !== other.length) {
    return false;
  }
  for (let i = 0;i < array.length; i++) {
    if (array[i] !== other[i]) {
      return false;
    }
  }
  return true;
}
function array__getendpoints(array) {
  if (!Array.isArray(array) || array.length < 1) {
    return [-1, -1];
  }
  return [0, array.length];
}
function array__shuffle(items, in_place = true) {
  const last = items.length - 1;
  for (let i = 0;i < items.length; i++) {
    let random = Math.floor(Math.random() * last);
    [items[last], items[random]] = [items[random], items[last]];
  }
  return items;
}
function array__split(array, count) {
  return [...array__gen_chunks(array, count)].map((chunk) => chunk.slice);
}
function array__binarysearch__exactmatch(array, target, isOrdered = (a, b) => a < b) {
  let [begin, end] = Core.Array.GetEndpoints(array);
  let middle = Core.Math.GetMidpoint(begin, end);
  while (begin < end) {
    if (isOrdered(target, array[middle])) {
      end = middle;
    } else {
      begin = middle + 1;
    }
    middle = Core.Math.GetMidpoint(begin, end);
  }
  if (isOrdered(array[middle - 1], target) === false) {
    return middle - 1;
  }
  return -1;
}
function array__binarysearch__insertionorder(array, target, isOrdered = (a, b) => a < b) {
  let [begin, end] = Core.Array.GetEndpoints(array);
  let middle = Core.Math.GetMidpoint(begin, end);
  while (begin < end) {
    if (isOrdered(target, array[middle])) {
      end = middle;
    } else {
      begin = middle + 1;
    }
    middle = Core.Math.GetMidpoint(begin, end);
  }
  return middle - 1;
}
function array__uint8__class_group() {
  return new ClassArrayUint8Group;
}
function array__uint8__concat(arrays) {
  let totalLength = 0;
  for (const array of arrays) {
    totalLength += array.length;
  }
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const array of arrays) {
    result.set(array, offset);
    offset += array.length;
  }
  return result;
}
function array__uint8__copy(bytes, count, offset = 0) {
  return bytes.slice(offset, offset + count);
}
function array__uint8__frombase64(b64_str) {
  if (b64_str.length % 4 === 0) {
    const b64_padding = (b64_str[b64_str.length - 1] === "=" ? 1 : 0) + (b64_str[b64_str.length - 2] === "=" ? 1 : 0);
    const b64_bytes = new Uint8Array(b64_str.length - b64_padding);
    for (let i = 0;i < b64_bytes.byteLength; ++i) {
      b64_bytes[i] = ARRAY__UINT8__B64_TO_BYTE.get(b64_str[i]) ?? 0;
    }
    const u8_out = new Uint8Array(b64_str.length / 4 * 3 - b64_padding);
    let u8_offset = 0;
    let b64_index = 0;
    while (b64_index + 4 <= b64_bytes.length) {
      for (const byte of new Uint8Array([
        (63 & b64_bytes[b64_index]) << 2 | (48 & b64_bytes[b64_index + 1]) >> 4,
        (15 & b64_bytes[b64_index + 1]) << 4 | (60 & b64_bytes[b64_index + 2]) >> 2,
        (3 & b64_bytes[b64_index + 2]) << 6 | 63 & b64_bytes[b64_index + 3]
      ])) {
        u8_out[u8_offset] = byte;
        ++u8_offset;
      }
      b64_index += 4;
    }
    switch (u8_out.length - u8_offset) {
      case 2: {
        for (const byte of new Uint8Array([
          (63 & b64_bytes[b64_index]) << 2 | (48 & b64_bytes[b64_index + 1]) >> 4,
          (15 & b64_bytes[b64_index + 1]) << 4 | (60 & b64_bytes[b64_index + 2]) >> 2
        ])) {
          u8_out[u8_offset] = byte;
          ++u8_offset;
        }
        break;
      }
      case 1: {
        for (const byte of new Uint8Array([
          (63 & b64_bytes[b64_index]) << 2 | (48 & b64_bytes[b64_index + 1]) >> 4
        ])) {
          u8_out[u8_offset] = byte;
          ++u8_offset;
        }
        break;
      }
    }
    return u8_out;
  }
  return new Uint8Array(0);
}
function array__uint8__fromstring(from) {
  return new TextEncoder().encode(from);
}
function array__uint8__fromuint32(from) {
  const u8s = new Uint8Array(4);
  const view = new DataView(u8s.buffer);
  view.setUint32(0, from >>> 0, false);
  return u8s;
}
function array__uint8__split(bytes, count) {
  if (count > bytes.byteLength) {
    return [bytes.slice()];
  }
  if (count > 0) {
    const parts = [];
    for (let i = 0;i < bytes.length; i += count) {
      parts.push(bytes.slice(i, i + count));
    }
    return parts;
  }
  return [bytes.slice()];
}
function array__uint8__take(bytes, count) {
  if (count > bytes.byteLength) {
    return [bytes.slice(), new Uint8Array];
  }
  if (count > 0) {
    const chunkA = bytes.slice(0, count);
    const chunkB = bytes.slice(count);
    return [chunkA, chunkB];
  }
  return [new Uint8Array, bytes.slice()];
}
function array__uint8__takeend(bytes, count) {
  if (count > bytes.byteLength) {
    return [bytes.slice(), new Uint8Array];
  }
  if (count > 0) {
    const chunkA = bytes.slice(bytes.byteLength - count);
    const chunkB = bytes.slice(0, bytes.byteLength - count);
    return [chunkA, chunkB];
  }
  return [new Uint8Array, bytes.slice()];
}
function array__uint8__toascii(bytes) {
  let ascii = "";
  for (const byte of bytes) {
    ascii += String.fromCharCode(byte >>> 0);
  }
  return ascii;
}
function array__uint8__tobase64(u8_bytes) {
  let b64_out = "";
  let u8_index = 0;
  while (u8_index + 3 <= u8_bytes.length) {
    for (const byte of new Uint8Array([
      (252 & u8_bytes[u8_index]) >> 2 | 0,
      (3 & u8_bytes[u8_index]) << 4 | (240 & u8_bytes[u8_index + 1]) >> 4,
      (15 & u8_bytes[u8_index + 1]) << 2 | (192 & u8_bytes[u8_index + 2]) >> 6,
      63 & u8_bytes[u8_index + 2] | 0
    ])) {
      b64_out += ARRAY__UINT8__BYTE_TO_B64[byte];
    }
    u8_index += 3;
  }
  switch (u8_bytes.length - u8_index) {
    case 2: {
      for (const byte of new Uint8Array([
        (252 & u8_bytes[u8_index]) >> 2 | 0,
        (3 & u8_bytes[u8_index]) << 4 | (240 & u8_bytes[u8_index + 1]) >> 4,
        (15 & u8_bytes[u8_index + 1]) << 2 | 0
      ])) {
        b64_out += ARRAY__UINT8__BYTE_TO_B64[byte];
      }
      b64_out += "=";
      break;
    }
    case 1: {
      for (const byte of new Uint8Array([
        (252 & u8_bytes[u8_index]) >> 2 | 0,
        (3 & u8_bytes[u8_index]) << 4 | 0
      ])) {
        b64_out += ARRAY__UINT8__BYTE_TO_B64[byte];
      }
      b64_out += "==";
      break;
    }
  }
  return b64_out;
}
function array__uint8__todecimal(bytes) {
  const decimal = new Array(bytes.byteLength);
  for (let i = 0;i < bytes.byteLength; i += 1) {
    decimal[i] = (bytes[i] >>> 0).toString(10);
  }
  return decimal;
}
function array__uint8__tohex(bytes) {
  const hex = new Array(bytes.byteLength);
  for (let i = 0;i < bytes.byteLength; i += 1) {
    hex[i] = (bytes[i] >>> 0).toString(16).padStart(2, "0");
  }
  return hex;
}
function array__uint8__tolines(bytes) {
  return string__splitlines(array__uint8__tostring(bytes));
}
function array__uint8__tostring(bytes) {
  return new TextDecoder().decode(bytes);
}
function array__uint32__tohex(uint) {
  return array__uint8__tohex(array__uint8__fromuint32(uint));
}
function assert__equal(value1, value2) {
  if (value1 !== value2) {
    throw new Error(`Assertion Failed: value1(${value1}) should equal value2(${value2})`);
  }
}
function assert__notequal(value1, value2) {
  if (value1 === value2) {
    throw new Error(`Assertion Failed: value1(${value1}) should not equal value2(${value2})`);
  }
}
function assert__bigint(value) {
  if (typeof value !== "bigint") {
    throw new Error(`Assertion Failed: typeof value(${value}) should equal bigint`);
  }
  return true;
}
function assert__boolean(value) {
  if (typeof value !== "boolean") {
    throw new Error(`Assertion Failed: typeof value(${value}) should equal boolean`);
  }
  return true;
}
function assert__function(value) {
  if (typeof value !== "function") {
    throw new Error(`Assertion Failed: typeof value(${value}) should equal function`);
  }
  return true;
}
function assert__number(value) {
  if (typeof value !== "number") {
    throw new Error(`Assertion Failed: typeof value(${value}) should equal number`);
  }
  return true;
}
function assert__object(value) {
  if (typeof value !== "object") {
    throw new Error(`Assertion Failed: typeof value(${value}) should equal object`);
  }
  return true;
}
function assert__string(value) {
  if (typeof value !== "string") {
    throw new Error(`Assertion Failed: typeof value(${value}) should equal string`);
  }
  return true;
}
function assert__symbol(value) {
  if (typeof value !== "symbol") {
    throw new Error(`Assertion Failed: typeof value(${value}) should equal symbol`);
  }
  return true;
}
function assert__undefined(value) {
  if (typeof value !== "undefined") {
    throw new Error(`Assertion Failed: typeof value(${value}) should equal undefined`);
  }
  return true;
}
function console__error(...items) {
  console["error"](...items);
}
function console__errorwithdate(...items) {
  console["error"](`[${new Date().toLocaleString()}]`, ...items);
}
function console__log(...items) {
  console["log"](...items);
}
function console__logwithdate(...items) {
  console["log"](`[${new Date().toLocaleString()}]`, ...items);
}
function json__analyze(obj) {
  if (Array.isArray(obj)) {
    for (const item of obj) {
      json__analyze(item);
    }
    return { source: obj, type: "array" };
  }
  if (obj === null || typeof obj === "string" || typeof obj === "number" || typeof obj === "boolean") {
    return { source: obj, type: "primitive" };
  }
  if (obj === undefined || typeof obj === "bigint" || typeof obj === "symbol" || typeof obj === "undefined" || typeof obj === "function") {
    throw TypeError("Invalid");
  }
  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      json__analyze(obj[key]);
    }
  }
  return { source: obj, type: "object" };
}
function json__merge(...sources) {
  if (sources.length === 0)
    return null;
  if (sources.length === 1)
    return json__analyze(sources[0]).source;
  const head = json__analyze(sources[0]);
  for (const source of sources.slice(1)) {
    if (json__analyze(source).type !== head.type) {
      throw TypeError("Cannot merge JSON strings of different types. Every JSON string must be all arrays, all objects, or all primitives.");
    }
  }
  if (head.type === "array") {
    const result = [];
    for (const source of sources) {
      result.push(...source);
    }
    return result;
  }
  if (head.type === "object") {
    let mergeinto = function(result, source) {
      for (const key in source) {
        if (Object.hasOwn(result, key) === false) {
          result[key] = {};
        }
        const { type: r_type } = json__analyze(result[key]);
        const { type: s_type } = json__analyze(source[key]);
        if (r_type === "object" && s_type === "object") {
          mergeinto(result[key], source[key]);
        } else if (r_type === "array" && s_type === "array") {
          result[key] = [...result[key], ...source[key]];
        } else {
          result[key] = source[key];
        }
      }
      return result;
    };
    const result = {};
    for (const source of sources) {
      mergeinto(result, source);
    }
    return result;
  }
  return json__analyze(sources[sources.length - 1]).source;
}
function json__parserawstring(str) {
  return JSON.parse(`"${str}"`);
}
function map__guard(map, key, value) {
  return map.has(key);
}
function map__getordefault(map, key, newValue) {
  let value = map.get(key);
  if (!map__guard(map, key, value)) {
    value = newValue();
    map.set(key, value);
  }
  return value;
}
function* math__gen_cartesianproduct(array_a, array_b) {
  for (let i = 0;i < array_a.length; i++) {
    for (let j = 0;j < array_b.length; j++) {
      yield [array_a[i], array_b[j]];
    }
  }
}
function* math__gen_ncartesianproducts(...arrays) {
  const count = arrays.reduce((product, arr) => product * BigInt(arr.length), 1n);
  const out = arrays.map((arr) => arr[0]);
  const indices = new Array(arrays.length).fill(0);
  const lengths = arrays.map((arr) => arr.length);
  for (let c = 0n;c < count; c++) {
    yield out.slice();
    let i = arrays.length - 1;
    for (let j = 0;j < arrays.length; j++, i--) {
      indices[i]++;
      if (indices[i] < lengths[i]) {
        out[i] = arrays[i][indices[i]];
        break;
      }
      indices[i] = 0;
      out[i] = arrays[i][0];
    }
  }
}
function* math__gen_nchoosercombinations(choices, r, repetitions = false) {
  const count = math__ncr(choices.length, r, repetitions);
  if (repetitions === true) {
    const out = new Array(r).fill(choices[0]);
    const indices = new Array(r).fill(0);
    for (let c = typeof count === "bigint" ? 0n : 0;c < count; c++) {
      yield out.slice();
      let i = r - 1;
      for (let j = 0;j < r; j++, i--) {
        indices[i]++;
        if (indices[i] < choices.length) {
          out[i] = choices[indices[i]];
          break;
        }
      }
      for (i++;i < r; i++) {
        indices[i] = indices[i - 1];
        out[i] = choices[indices[i]];
      }
    }
  } else {
    const out = choices.slice(0, r);
    const indices = [...out.keys()];
    for (let c = typeof count === "bigint" ? 0n : 0;c < count; c++) {
      yield out.slice();
      let i = r - 1;
      for (let j = 0;j < r; j++, i--) {
        indices[i]++;
        if (indices[i] < choices.length - j) {
          out[i] = choices[indices[i]];
          break;
        }
      }
      for (i++;i < r; i++) {
        indices[i] = indices[i - 1] + 1;
        out[i] = choices[indices[i]];
      }
    }
  }
}
function* math__gen_nchooserpermutations(choices, r, repetitions = false) {
  const count = math__npr(choices.length, r, repetitions);
  if (repetitions === true) {
    const out = new Array(r).fill(choices[0]);
    const indices = new Array(r).fill(0);
    for (let c = typeof count === "bigint" ? 0n : 0;c < count; c++) {
      yield out.slice();
      let i = r - 1;
      for (let j = 0;j < r; j++, i--) {
        indices[i]++;
        if (indices[i] < choices.length) {
          out[i] = choices[indices[i]];
          break;
        }
        indices[i] = 0;
        out[i] = choices[0];
      }
    }
  } else {
    const out = choices.slice(0, r);
    const indices = [...out.keys()];
    const imap = new Array(choices.length).fill(0);
    for (let i = 0;i < r; i++) {
      imap[i] = 1;
    }
    for (let c = typeof count === "bigint" ? 0n : 0;c < count; c++) {
      yield out.slice();
      let i = r - 1;
      for (let j = 0;j < r; j++, i--) {
        imap[indices[i]] = 0;
        indices[i]++;
        while (imap[indices[i]] === 1) {
          indices[i]++;
        }
        if (indices[i] < choices.length) {
          imap[indices[i]] = 1;
          out[i] = choices[indices[i]];
          break;
        }
      }
      for (;i < r; i++) {
        if (indices[i] < choices.length) {
          continue;
        }
        indices[i] = 0;
        while (imap[indices[i]] === 1) {
          indices[i]++;
        }
        imap[indices[i]] = 1;
        out[i] = choices[indices[i]];
      }
    }
  }
}
function math__ncr(n, r, repetitions = false) {
  if (repetitions === true) {
    return math__factorial(n + r - 1) / (math__factorial(r) * math__factorial(n - 1));
  }
  return math__factorial(n) / (math__factorial(r) * math__factorial(n - r));
}
function math__npr(n, r, repetitions = false) {
  if (repetitions === true) {
    return BigInt(n) ** BigInt(r);
  }
  return math__factorial(n) / math__factorial(n - r);
}
function math__factorial(n) {
  if (!(n in MATH__FACTORIAL__CACHE)) {
    let fact = MATH__FACTORIAL__CACHE[MATH__FACTORIAL__CACHE.length - 1];
    for (let i = MATH__FACTORIAL__CACHE.length;i < n; i++) {
      fact *= BigInt(i);
      MATH__FACTORIAL__CACHE[i] = fact;
    }
    MATH__FACTORIAL__CACHE[n] = fact * BigInt(n);
  }
  return MATH__FACTORIAL__CACHE[n];
}
function math__getmidpoint(a, b) {
  return (b - a) % 2 === 0 ? (a + b) / 2 : (a + b - 1) / 2;
}
async function promise__async_countfulfilled(promises) {
  let count = 0;
  for (const { status } of await Promise.allSettled(promises)) {
    if (status === "fulfilled") {
      count++;
    }
  }
  return count;
}
async function promise__async_countrejected(promises) {
  let count = 0;
  for (const { status } of await Promise.allSettled(promises)) {
    if (status === "rejected") {
      count++;
    }
  }
  return count;
}
function promise__callandorphan(asyncfn) {
  promise__orphan(asyncfn());
}
function promise__orphan(promise) {}
async function* stream__asyncgen_readchunks(stream) {
  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        return;
      }
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}
async function* stream__asyncgen_readlines(stream) {
  const reader = stream.pipeThrough(new TextDecoderStream).getReader();
  try {
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        if (buffer.length > 0) {
          yield [buffer];
        }
        return;
      }
      const lines = string__splitlines(buffer + value);
      buffer = lines[lines.length - 1] ?? "";
      yield lines.slice(0, -1);
    }
  } finally {
    reader.releaseLock();
  }
}
async function stream__uint8__async_compare(stream1, stream2) {
  const one = stream__uint8__class_reader(stream1.getReader());
  const two = stream__uint8__class_reader(stream2.getReader());
  try {
    while (true) {
      let changed = false;
      if (one.done === false && one.i >= one.length) {
        if ((await one.next()).changed === true) {
          changed = true;
        }
      }
      if (two.done === false && two.i >= two.length) {
        if ((await two.next()).changed === true) {
          changed = true;
        }
      }
      if (one.done && two.done) {
        return true;
      }
      if (one.done !== two.done || changed === false) {
        return false;
      }
      while (one.i < one.length && two.i < two.length) {
        if (one.value[one.i] !== two.value[two.i]) {
          return false;
        }
        one.i++;
        two.i++;
      }
    }
  } finally {
    one.releaseLock();
    two.releaseLock();
  }
}
async function stream__uint8__async_readall(stream) {
  const reader = stream.getReader();
  try {
    const chunks = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      chunks.push(value);
    }
    return array__uint8__concat(chunks);
  } finally {
    reader.releaseLock();
  }
}
async function stream__uint8__async_readlines(stream, callback) {
  for await (const lines of stream__asyncgen_readlines(stream)) {
    for (const line of lines) {
      if (await callback(line) === false) {
        return;
      }
    }
  }
}
async function stream__uint8__async_readsome(stream, count) {
  if (count < 1) {
    return ARRAY__UINT8__EMPTY;
  }
  const reader = stream.getReader();
  try {
    const chunks = [];
    let size_read = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      chunks.push(value);
      size_read += value.byteLength;
      if (size_read >= count) {
        break;
      }
    }
    return array__uint8__take(array__uint8__concat(chunks), count)[0];
  } finally {
    reader.releaseLock();
  }
}
function stream__uint8__class_reader(reader) {
  return new ClassStreamUint8Reader(reader);
}
function string__getleftmarginsize(text) {
  let i = 0;
  for (;i < text.length; i++) {
    if (text[i] !== " ") {
      break;
    }
  }
  return i;
}
function string__lineisonlywhitespace(line) {
  return /^\s*$/.test(line);
}
function string__removewhitespaceonlylines(text) {
  const lines = string__splitlines(text);
  return lines.filter((line) => !string__lineisonlywhitespace(line));
}
function string__removewhitespaceonlylinesfromtopandbottom(text) {
  const lines = string__splitlines(text);
  return lines.slice(lines.findIndex((line) => string__lineisonlywhitespace(line) === false), 1 + lines.findLastIndex((line) => string__lineisonlywhitespace(line) === false));
}
function string__split(text, delimiter, remove_empty_items = false) {
  const items = text.split(delimiter);
  return remove_empty_items === false ? items : items.filter((item) => item.length > 0);
}
function string__splitlines(text, remove_empty_items = false) {
  return string__split(text, /\r?\n/, remove_empty_items);
}
function string__splitmultiplespaces(text, remove_empty_items = false) {
  return string__split(text, / +/, remove_empty_items);
}
function string__splitmultiplewhitespace(text, remove_empty_items = false) {
  return string__split(text, /\s+/, remove_empty_items);
}
function string__tosnakecase(text) {
  return text.toLowerCase().replace(/ /g, "-");
}
function string__trimlines(lines) {
  return lines.map((line) => line.trim());
}
function utility__async_sleep(duration_ms) {
  return new Promise((resolve) => setTimeout(resolve, duration_ms));
}
function utility__decodebytes(buffer) {
  return new TextDecoder().decode(buffer);
}
function utility__encodetext(text) {
  return new TextEncoder().encode(text);
}
function utility__class_crc32() {
  return new ClassUtilityCRC32;
}
function utility__crc32(bytes) {
  const crc = new Uint32Array([4294967295]);
  for (let index = 0;index < bytes.length; index++) {
    crc[0] = UTILITY__CRC32__TABLE[(crc[0] ^ bytes[index]) & 255] ^ crc[0] >>> 8;
  }
  return (crc[0] ^ 4294967295 >>> 0) >>> 0;
}
function utility__debounce(fn, delay_ms) {
  let defer = utility__class_defer();
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      try {
        await fn(...args);
        defer.resolve();
      } catch (error) {
        defer.reject(error);
      }
      defer = utility__class_defer();
    }, delay_ms);
    return defer.promise;
  };
}
function utility__immediatedebounce(fn, delay_ms) {
  let defer = utility__class_defer();
  let timeout;
  return (...args) => {
    if (timeout === undefined) {
      (async () => {
        await fn(...args);
        defer.resolve();
      })().catch((error) => {
        defer.reject(error);
      });
    }
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = undefined;
      defer = utility__class_defer();
    }, delay_ms);
    return defer.promise;
  };
}
function utility__class_defer() {
  return new ClassUtilityDefer;
}
export var Core;
((Core) => {
  let Array;
  ((Array) => {
    let BinarySearch;
    ((BinarySearch) => {
      BinarySearch.ExactMatch = array__binarysearch__exactmatch;
      BinarySearch.InsertionIndex = array__binarysearch__insertionorder;
    })(BinarySearch = Array.BinarySearch ||= {});
    let Uint8;
    ((Uint8) => {
      Uint8.Class_Group = array__uint8__class_group;
      Uint8.Concat = array__uint8__concat;
      Uint8.Copy = array__uint8__copy;
      Uint8.FromBase64 = array__uint8__frombase64;
      Uint8.FromString = array__uint8__fromstring;
      Uint8.FromUint32 = array__uint8__fromuint32;
      Uint8.Split = array__uint8__split;
      Uint8.Take = array__uint8__take;
      Uint8.TakeEnd = array__uint8__takeend;
      Uint8.ToASCII = array__uint8__toascii;
      Uint8.ToBase64 = array__uint8__tobase64;
      Uint8.ToDecimal = array__uint8__todecimal;
      Uint8.ToHex = array__uint8__tohex;
      Uint8.ToLines = array__uint8__tolines;
      Uint8.ToString = array__uint8__tostring;
    })(Uint8 = Array.Uint8 ||= {});
    let Uint32;
    ((Uint32) => {
      Uint32.ToHex = array__uint32__tohex;
    })(Uint32 = Array.Uint32 ||= {});
    Array.Gen_BufferToBytes = array__gen_buffertobytes;
    Array.Gen_Chunks = array__gen_chunks;
    Array.Gen_SlidingWindow = array__gen_slidingwindow;
    Array.Gen_Zip = array__gen_zip;
    Array.AreEqual = array__areequal;
    Array.GetEndpoints = array__getendpoints;
    Array.Shuffle = array__shuffle;
    Array.Split = array__split;
  })(Array = Core.Array ||= {});
  let Assert;
  ((Assert) => {
    Assert.Equal = assert__equal;
    Assert.NotEqual = assert__notequal;
    Assert.BigInt = assert__bigint;
    Assert.Boolean = assert__boolean;
    Assert.Function = assert__function;
    Assert.Number = assert__number;
    Assert.Object = assert__object;
    Assert.String = assert__string;
    Assert.Symbol = assert__symbol;
    Assert.Undefined = assert__undefined;
  })(Assert = Core.Assert ||= {});
  let Console;
  ((Console) => {
    Console.Error = console__error;
    Console.ErrorWithDate = console__errorwithdate;
    Console.Log = console__log;
    Console.LogWithDate = console__logwithdate;
  })(Console = Core.Console ||= {});
  let JSON;
  ((JSON) => {
    JSON.Analyze = json__analyze;
    JSON.Merge = json__merge;
    JSON.ParseRawString = json__parserawstring;
  })(JSON = Core.JSON ||= {});
  let Map;
  ((Map) => {
    Map.Guard = map__guard;
    Map.GetOrDefault = map__getordefault;
  })(Map = Core.Map ||= {});
  let Math;
  ((Math) => {
    Math.Gen_CartesianProduct = math__gen_cartesianproduct;
    Math.Gen_NCartesianProducts = math__gen_ncartesianproducts;
    Math.Gen_NChooseRCombinations = math__gen_nchoosercombinations;
    Math.Gen_NChooseRPermutations = math__gen_nchooserpermutations;
    Math.nCr = math__ncr;
    Math.nPr = math__npr;
    Math.Factorial = math__factorial;
    Math.GetMidpoint = math__getmidpoint;
  })(Math = Core.Math ||= {});
  let Promise;
  ((Promise) => {
    Promise.Async_CountFulfilled = promise__async_countfulfilled;
    Promise.Async_CountRejected = promise__async_countrejected;
    Promise.CallAndOrphan = promise__callandorphan;
    Promise.Orphan = promise__orphan;
  })(Promise = Core.Promise ||= {});
  let Stream;
  ((Stream) => {
    let Uint8;
    ((Uint8) => {
      Uint8.Async_Compare = stream__uint8__async_compare;
      Uint8.Async_ReadAll = stream__uint8__async_readall;
      Uint8.Async_ReadLines = stream__uint8__async_readlines;
      Uint8.Async_ReadSome = stream__uint8__async_readsome;
      Uint8.Class_Reader = stream__uint8__class_reader;
    })(Uint8 = Stream.Uint8 ||= {});
    Stream.AsyncGen_ReadChunks = stream__asyncgen_readchunks;
    Stream.AsyncGen_ReadLines = stream__asyncgen_readlines;
  })(Stream = Core.Stream ||= {});
  let String;
  ((String) => {
    String.GetLeftMarginSize = string__getleftmarginsize;
    String.LineIsOnlyWhiteSpace = string__lineisonlywhitespace;
    String.RemoveWhiteSpaceOnlyLines = string__removewhitespaceonlylines;
    String.RemoveWhiteSpaceOnlyLinesFromTopAndBottom = string__removewhitespaceonlylinesfromtopandbottom;
    String.Split = string__split;
    String.SplitLines = string__splitlines;
    String.SplitMultipleSpaces = string__splitmultiplespaces;
    String.SplitMultipleWhiteSpace = string__splitmultiplewhitespace;
    String.ToSnakeCase = string__tosnakecase;
    String.TrimLines = string__trimlines;
  })(String = Core.String ||= {});
  let Utility;
  ((Utility) => {
    Utility.Async_Sleep = utility__async_sleep;
    Utility.Class_CRC32 = utility__class_crc32;
    Utility.Class_Defer = utility__class_defer;
    Utility.CRC32 = utility__crc32;
    Utility.DecodeBytes = utility__decodebytes;
    Utility.EncodeText = utility__encodetext;
    Utility.Debounce = utility__debounce;
    Utility.ImmediateDebounce = utility__immediatedebounce;
  })(Utility = Core.Utility ||= {});
})(Core ||= {});
