const cache = [BigInt(1), BigInt(1)];
export function Factorial(n: number): bigint {
  if (!(n in cache)) {
    let fact = cache[cache.length - 1];
    for (let i = cache.length; i < n; i++) {
      fact *= BigInt(i);
      cache[i] = fact;
    }
    cache[n] = fact * BigInt(n);
  }
  return cache[n];
}
