export class Class_NodePlatform_Error extends Error {
  path;
  syscall;
  errno;
  code;
  original;
  get message() {
    return this.code + ': NODE PLATFORM ERROR (ORIGINAL ERROR BELOW)';
  }
}
export function NodePlatform_Error(original) {
  const error = new Class_NodePlatform_Error();
  error.path = original.path;
  error.syscall = original.syscall;
  error.errno = original.errno;
  error.code = original.code;
  error.original = original;
  error.stack = original.stack;
  return error;
}
export async function Async_NodePlatform_Error_Wrapped_Call(error, promise) {
  try {
    return await promise;
  } catch (original) {
    throw NodePlatform_Error(original);
  }
}
