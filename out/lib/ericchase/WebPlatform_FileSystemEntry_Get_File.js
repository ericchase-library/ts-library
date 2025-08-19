export function Async_WebPlatform_FileSystemEntry_Get_File(entry) {
  return new Promise((resolve, reject) => {
    entry.file(
      (file) => {
        resolve(file);
      },
      (error) => {
        reject(error);
      },
    );
  });
}
