export async function Core_Promise_CallAndCountFulfilled_Async(promises: Promise<any>[]): Promise<number> {
  let count = 0;
  for (const { status } of await Promise.allSettled(promises)) {
    if (status === 'fulfilled') {
      count++;
    }
  }
  return count;
}
