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
export function Core_Array_AreEqual(array, other) {
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
export function Core_Array_BinarySearch_ExactMatch(array, target, isOrdered = (a, b) => a < b) {
  let [begin, end] = Core_Array_GetEndpoints(array);
  let middle = Core_Math_GetMidpoint(begin, end);
  while (begin < end) {
    if (isOrdered(target, array[middle])) {
      end = middle;
    } else {
      begin = middle + 1;
    }
    middle = Core_Math_GetMidpoint(begin, end);
  }
  if (isOrdered(array[middle - 1], target) === false) {
    return middle - 1;
  }
  return -1;
}
export function Core_Array_BinarySearch_InsertionIndex(array, target, isOrdered = (a, b) => a < b) {
  let [begin, end] = Core_Array_GetEndpoints(array);
  let middle = Core_Math_GetMidpoint(begin, end);
  while (begin < end) {
    if (isOrdered(target, array[middle])) {
      end = middle;
    } else {
      begin = middle + 1;
    }
    middle = Core_Math_GetMidpoint(begin, end);
  }
  return middle - 1;
}
export function* Core_Array_Gen_BufferToBytes(buffer) {
  const view = new DataView(buffer);
  for (let i = 0;i < view.byteLength; i++) {
    yield view.getUint8(i) >>> 0;
  }
}
export function* Core_Array_Gen_Chunks(array, count) {
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
export function* Core_Array_Gen_SlidingWindow(array, count) {
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
export function* Core_Array_Gen_Zip(...iterables) {
  let mock_count = 0;
  const mock_iterable = {
    next() {
      return { value: undefined, done: false };
    },
    [Symbol.iterator]() {
      return this;
    }
  };
  function process_iterators(iterators) {
    const values = [];
    for (let index = 0;index < iterators.length; index++) {
      const next = iterators[index].next();
      if ("done" in next && next.done === true) {
        mock_count++;
        iterators[index] = mock_iterable;
        values[index] = undefined;
      } else {
        values[index] = "value" in next ? next.value : undefined;
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
export function Core_Array_GetEndpoints(array) {
  if (!Array.isArray(array) || array.length < 1) {
    return [-1, -1];
  }
  return [0, array.length];
}
export function Core_Array_Shuffle(items, in_place = true) {
  const last = items.length - 1;
  for (let i = 0;i < items.length; i++) {
    let random = Math.floor(Math.random() * last);
    [items[last], items[random]] = [items[random], items[last]];
  }
  return items;
}
export function Core_Array_Split(array, count) {
  return [...Core_Array_Gen_Chunks(array, count)].map((chunk) => chunk.slice);
}
export function Core_Array_Uint32_ToHex(uint) {
  return Core_Array_Uint8_ToHex(Core_Array_Uint8_FromUint32(uint));
}
export function Core_Array_Uint8_Class_Group() {
  return new ClassArrayUint8Group;
}
export function Core_Array_Uint8_Concat(arrays) {
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
export function Core_Array_Uint8_Copy(bytes, count, offset = 0) {
  return bytes.slice(offset, offset + count);
}
export function Core_Array_Uint8_FromBase64(b64_str) {
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
export function Core_Array_Uint8_FromString(from) {
  return new TextEncoder().encode(from);
}
export function Core_Array_Uint8_FromUint32(from) {
  const u8s = new Uint8Array(4);
  const view = new DataView(u8s.buffer);
  view.setUint32(0, from >>> 0, false);
  return u8s;
}
export function Core_Array_Uint8_Split(bytes, count) {
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
export function Core_Array_Uint8_Take(bytes, count) {
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
export function Core_Array_Uint8_TakeEnd(bytes, count) {
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
export function Core_Array_Uint8_ToASCII(bytes) {
  let ascii = "";
  for (const byte of bytes) {
    ascii += String.fromCharCode(byte >>> 0);
  }
  return ascii;
}
export function Core_Array_Uint8_ToBase64(u8_bytes) {
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
export function Core_Array_Uint8_ToDecimal(bytes) {
  const decimal = new Array(bytes.byteLength);
  for (let i = 0;i < bytes.byteLength; i += 1) {
    decimal[i] = (bytes[i] >>> 0).toString(10);
  }
  return decimal;
}
export function Core_Array_Uint8_ToHex(bytes) {
  const hex = new Array(bytes.byteLength);
  for (let i = 0;i < bytes.byteLength; i += 1) {
    hex[i] = (bytes[i] >>> 0).toString(16).padStart(2, "0");
  }
  return hex;
}
export function Core_Array_Uint8_ToLines(bytes) {
  return Core_String_SplitLines(Core_Array_Uint8_ToString(bytes));
}
export function Core_Array_Uint8_ToString(bytes) {
  return new TextDecoder().decode(bytes);
}
export function Core_Assert_BigInt(value) {
  if (typeof value !== "bigint") {
    throw new Error(`Assertion Failed: typeof value(${value}) should equal bigint`);
  }
  return true;
}
export function Core_Assert_Boolean(value) {
  if (typeof value !== "boolean") {
    throw new Error(`Assertion Failed: typeof value(${value}) should equal boolean`);
  }
  return true;
}
export function Core_Assert_Equal(value1, value2) {
  if (value1 !== value2) {
    throw new Error(`Assertion Failed: value1(${value1}) should equal value2(${value2})`);
  }
  return true;
}
export function Core_Assert_Function(value) {
  if (typeof value !== "function") {
    throw new Error(`Assertion Failed: typeof value(${value}) should equal function`);
  }
  return true;
}
export function Core_Assert_NotEqual(value1, value2) {
  if (value1 === value2) {
    throw new Error(`Assertion Failed: value1(${value1}) should not equal value2(${value2})`);
  }
  return true;
}
export function Core_Assert_Number(value) {
  if (typeof value !== "number") {
    throw new Error(`Assertion Failed: typeof value(${value}) should equal number`);
  }
  return true;
}
export function Core_Assert_Object(value) {
  if (typeof value !== "object") {
    throw new Error(`Assertion Failed: typeof value(${value}) should equal object`);
  }
  return true;
}
export function Core_Assert_String(value) {
  if (typeof value !== "string") {
    throw new Error(`Assertion Failed: typeof value(${value}) should equal string`);
  }
  return true;
}
export function Core_Assert_Symbol(value) {
  if (typeof value !== "symbol") {
    throw new Error(`Assertion Failed: typeof value(${value}) should equal symbol`);
  }
  return true;
}
export function Core_Assert_Undefined(value) {
  if (typeof value !== "undefined") {
    throw new Error(`Assertion Failed: typeof value(${value}) should equal undefined`);
  }
  return true;
}
export function Core_Console_Error(...items) {
  console["error"](...items);
}
export function Core_Console_ErrorWithDate(...items) {
  console["error"](`[${new Date().toLocaleString()}]`, ...items);
}
export function Core_Console_Log(...items) {
  console["log"](...items);
}
export function Core_Console_LogWithDate(...items) {
  console["log"](`[${new Date().toLocaleString()}]`, ...items);
}
export function Core_JSON_Analyze(obj) {
  if (Array.isArray(obj)) {
    for (const item of obj) {
      Core_JSON_Analyze(item);
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
      Core_JSON_Analyze(obj[key]);
    }
  }
  return { source: obj, type: "object" };
}
export function Core_JSON_Merge(...sources) {
  if (sources.length === 0)
    return null;
  if (sources.length === 1)
    return Core_JSON_Analyze(sources[0]).source;
  const head = Core_JSON_Analyze(sources[0]);
  for (const source of sources.slice(1)) {
    if (Core_JSON_Analyze(source).type !== head.type) {
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
        const { type: r_type } = Core_JSON_Analyze(result[key]);
        const { type: s_type } = Core_JSON_Analyze(source[key]);
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
  return Core_JSON_Analyze(sources[sources.length - 1]).source;
}
export function Core_JSON_ParseRawString(str) {
  return JSON.parse(`"${str}"`);
}
export function Core_Map_GetOrDefault(map, key, newValue) {
  if (map.has(key)) {
    return map.get(key);
  }
  const value = newValue();
  map.set(key, value);
  return value;
}
export function Core_Math_Factorial(n) {
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
export function* Core_Math_Gen_CartesianProduct(array_a, array_b) {
  for (let i = 0;i < array_a.length; i++) {
    for (let j = 0;j < array_b.length; j++) {
      yield [array_a[i], array_b[j]];
    }
  }
}
export function* Core_Math_Gen_NCartesianProducts(...arrays) {
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
export function* Core_Math_Gen_NChooseRCombinations(choices, r, repetitions = false) {
  const count = Core_Math_nCr(choices.length, r, repetitions);
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
export function* Core_Math_Gen_NChooseRPermutations(choices, r, repetitions = false) {
  const count = Core_Math_nPr(choices.length, r, repetitions);
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
export function Core_Math_GetMidpoint(a, b) {
  return (b - a) % 2 === 0 ? (a + b) / 2 : (a + b - 1) / 2;
}
export function Core_Math_nCr(n, r, repetitions = false) {
  if (repetitions === true) {
    return Core_Math_Factorial(n + r - 1) / (Core_Math_Factorial(r) * Core_Math_Factorial(n - 1));
  }
  return Core_Math_Factorial(n) / (Core_Math_Factorial(r) * Core_Math_Factorial(n - r));
}
export function Core_Math_nPr(n, r, repetitions = false) {
  if (repetitions === true) {
    return BigInt(n) ** BigInt(r);
  }
  return Core_Math_Factorial(n) / Core_Math_Factorial(n - r);
}
export async function Core_Promise_Async_CountFulfilled(promises) {
  let count = 0;
  for (const { status } of await Promise.allSettled(promises)) {
    if (status === "fulfilled") {
      count++;
    }
  }
  return count;
}
export async function Core_Promise_Async_CountRejected(promises) {
  let count = 0;
  for (const { status } of await Promise.allSettled(promises)) {
    if (status === "rejected") {
      count++;
    }
  }
  return count;
}
export function Core_Promise_CallAndOrphan(asyncfn) {
  Core_Promise_Orphan(asyncfn());
}
export function Core_Promise_Orphan(promise) {}
export async function* Core_Stream_AsyncGen_ReadChunks(stream) {
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
export async function Core_Stream_Uint8_Async_Compare(stream1, stream2) {
  const one = Core_Stream_Uint8_Class_Reader(stream1.getReader());
  const two = Core_Stream_Uint8_Class_Reader(stream2.getReader());
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
export async function Core_Stream_Uint8_Async_ReadAll(stream) {
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
    return Core_Array_Uint8_Concat(chunks);
  } finally {
    reader.releaseLock();
  }
}
export async function Core_Stream_Uint8_Async_ReadLines(stream, callback) {
  for await (const lines of Core_Stream_Uint8_AsyncGen_ReadLines(stream)) {
    for (const line of lines) {
      if (await callback(line) === false) {
        return;
      }
    }
  }
}
export async function Core_Stream_Uint8_Async_ReadSome(stream, count) {
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
    return Core_Array_Uint8_Take(Core_Array_Uint8_Concat(chunks), count)[0];
  } finally {
    reader.releaseLock();
  }
}
export async function* Core_Stream_Uint8_AsyncGen_ReadLines(stream) {
  const textDecoderStream = new TextDecoderStream;
  const textDecoderReader = textDecoderStream.readable.getReader();
  const textDecoderWriter = textDecoderStream.writable.getWriter();
  const readable = new ReadableStream({
    async pull(controller) {
      const { done, value } = await textDecoderReader.read();
      if (done !== true) {
        controller.enqueue(value);
      } else {
        controller.close();
      }
    }
  });
  const writable = new WritableStream({
    async close() {
      await textDecoderWriter.close();
    },
    async write(chunk) {
      await textDecoderWriter.write(chunk.slice());
    }
  });
  const reader = stream.pipeThrough({ readable, writable }).getReader();
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
      const lines = Core_String_SplitLines(buffer + value);
      buffer = lines[lines.length - 1] ?? "";
      yield lines.slice(0, -1);
    }
  } finally {
    reader.releaseLock();
  }
}
export function Core_Stream_Uint8_Class_Reader(reader) {
  return new ClassStreamUint8Reader(reader);
}
export function Core_String_GetLeftMarginSize(text) {
  let i = 0;
  for (;i < text.length; i++) {
    if (text[i] !== " ") {
      break;
    }
  }
  return i;
}
export function Core_String_LineIsOnlyWhiteSpace(line) {
  return /^\s*$/.test(line);
}
export function Core_String_RemoveWhiteSpaceOnlyLines(text) {
  const lines = Core_String_SplitLines(text);
  return lines.filter((line) => !Core_String_LineIsOnlyWhiteSpace(line));
}
export function Core_String_RemoveWhiteSpaceOnlyLinesFromTopAndBottom(text) {
  const lines = Core_String_SplitLines(text);
  return lines.slice(lines.findIndex((line) => Core_String_LineIsOnlyWhiteSpace(line) === false), 1 + lines.findLastIndex((line) => Core_String_LineIsOnlyWhiteSpace(line) === false));
}
export function Core_String_Split(text, delimiter, remove_empty_items = false) {
  const items = text.split(delimiter);
  return remove_empty_items === false ? items : items.filter((item) => item.length > 0);
}
export function Core_String_SplitLines(text, remove_empty_items = false) {
  return Core_String_Split(text, /\r?\n/, remove_empty_items);
}
export function Core_String_SplitMultipleSpaces(text, remove_empty_items = false) {
  return Core_String_Split(text, / +/, remove_empty_items);
}
export function Core_String_SplitMultipleWhiteSpace(text, remove_empty_items = false) {
  return Core_String_Split(text, /\s+/, remove_empty_items);
}
export function Core_String_ToSnakeCase(text) {
  return text.toLowerCase().replace(/ /g, "-");
}
export function Core_String_TrimLines(lines) {
  return lines.map((line) => line.trim());
}
export function Core_Utility_Class_Defer() {
  return new ClassUtilityDefer;
}
export function Core_Utility_Async_Sleep(duration_ms) {
  return new Promise((resolve) => setTimeout(resolve, duration_ms));
}
export function Core_Utility_Class_CRC32() {
  return new ClassUtilityCRC32;
}
export function Core_Utility_CRC32(bytes) {
  const crc = new Uint32Array([4294967295]);
  for (let index = 0;index < bytes.length; index++) {
    crc[0] = UTILITY__CRC32__TABLE[(crc[0] ^ bytes[index]) & 255] ^ crc[0] >>> 8;
  }
  return (crc[0] ^ 4294967295 >>> 0) >>> 0;
}
export function Core_Utility_Debounce(fn, delay_ms) {
  let defer = Core_Utility_Class_Defer();
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
      defer = Core_Utility_Class_Defer();
    }, delay_ms);
    return defer.promise;
  };
}
export function Core_Utility_DecodeBytes(buffer) {
  return new TextDecoder().decode(buffer);
}
export function Core_Utility_EncodeText(text) {
  return new TextEncoder().encode(text);
}
export function Core_Utility_ImmediateDebounce(fn, delay_ms) {
  let defer = Core_Utility_Class_Defer();
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
      defer = Core_Utility_Class_Defer();
    }, delay_ms);
    return defer.promise;
  };
}
