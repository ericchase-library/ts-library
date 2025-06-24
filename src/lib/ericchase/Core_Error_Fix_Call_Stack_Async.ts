import { Core_String_SplitLines } from './Core_String_SplitLines.js';

function Clean_Call_Stack(stack = ''): string {
  const lines = Core_String_SplitLines(stack ?? '');
  if (lines[0].trim() === 'Error') {
    lines[0] = 'Fixed Call Stack:';
  }
  return lines.join('\n');
}

export async function Core_Error_Fix_Call_Stack_Async<T>(stack: string | undefined, promise: Promise<T>): Promise<T> {
  try {
    return await promise;
  } catch (async_error: any) {
    if (typeof async_error === 'object') {
      const error = new Error(`${async_error.message}\n${Clean_Call_Stack(stack ?? '')}`);
      for (const key in async_error) {
        Object.defineProperty(error, key, { value: async_error[key] });
      }
      throw error;
    }
    throw new Error(`${async_error}\n${Clean_Call_Stack(stack ?? '')}`);
  }
}
