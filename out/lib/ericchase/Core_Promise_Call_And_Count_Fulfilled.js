export async function Async_Core_Promise_Call_And_Count_Fulfilled(promises) {
  let count = 0;
  for (const { status } of await Promise.allSettled(promises)) {
    if (status === 'fulfilled') {
      count++;
    }
  }
  return count;
}
