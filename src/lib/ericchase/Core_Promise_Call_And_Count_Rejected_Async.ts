export async function Core_Promise_Call_And_Count_Rejected_Async(promises: Promise<any>[]): Promise<number> {
  let count = 0;
  for (const { status } of await Promise.allSettled(promises)) {
    if (status === 'rejected') {
      count++;
    }
  }
  return count;
}
