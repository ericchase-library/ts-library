export async function Core_Promise_Call_And_Count_Fulfilled_Async(promises: Promise<any>[]): Promise<number> {
  let count = 0;
  for (const { status } of await Promise.allSettled(promises)) {
    if (status === 'fulfilled') {
      count++;
    }
  }
  return count;
}
