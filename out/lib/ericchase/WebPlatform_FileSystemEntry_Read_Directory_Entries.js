export async function Async_WebPlatform_FileSystemEntry_Read_Directory_Entries(entry) {
  const reader = entry.createReader();
  const allentries = [];
  let done = false;
  while (done === false) {
    const entries = await new Promise((resolve, reject) => {
      reader.readEntries((entries) => {
        resolve(entries);
      }, (error) => {
        reject(error);
      });
    });
    if (entries.length === 0) {
      break;
    }
    allentries.push(...entries);
  }
  return allentries;
}
