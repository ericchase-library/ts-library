import { Core_String_Split_Lines } from './Core_String_Split_Lines.js';

// Credit to ChatGPT
function Clone_Error(error: any, extra_message_lines?: string): any | Error {
  if (!(error instanceof Error)) {
    if (!(error instanceof Object)) {
      return new Error(error + '\n' + extra_message_lines);
    }
    if (error.message !== null && error.message !== undefined) {
      error.message = error.message + '\n' + extra_message_lines;
    } else {
      error.message = extra_message_lines;
    }
    return error;
  }

  // Create a new instance using the original error's constructor and message
  const clone = new (error.constructor as new (message?: string) => Error)(error.message + '\n' + extra_message_lines);
  // Get all own property keys (string and symbol), including non-enumerable
  const keys = Reflect.ownKeys(error);
  for (const key of keys) {
    // Avoid re-defining 'message' since it was passed to constructor
    if (key === 'message') continue;
    const desc = Object.getOwnPropertyDescriptor(error, key);
    if (desc) {
      // Define the property on cloned error preserving descriptor
      Object.defineProperty(clone, key, desc);
    }
  }
  return clone;
}

function Create_Call_Stack(stack = ''): string {
  stack ??= '';
  const lines = Core_String_Split_Lines(stack);
  if (lines[0].trim() === 'Error') {
    lines[0] = 'Call Stack:';
  }
  return lines.join('\n');
}

/**
 * Async functions have a tendency to lose call stack information. This function
 * attempts to create a meaningful call stack at a target location for potential
 * async errors.
 */
export async function Core_Error_Fix_Call_Stack_Async<T>(stack: string | undefined, promise: Promise<T>): Promise<T> {
  try {
    return await promise;
  } catch (error: any) {
    throw Clone_Error(error, Create_Call_Stack(stack));
  }
}
