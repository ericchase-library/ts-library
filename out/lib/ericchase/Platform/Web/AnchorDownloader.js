export function anchor_downloader(data, filename) {
  const a = document.createElement("a");
  a.setAttribute("href", data);
  a.setAttribute("download", filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
export function SaveBlob(blob, filename) {
  anchor_downloader(URL.createObjectURL(blob), filename);
}
export function SaveUrl(url, filename) {
  anchor_downloader(url, filename);
}
export function SaveBuffer(buffer, filename) {
  SaveBlob(new Blob([buffer], { type: "application/octet-stream;charset=utf-8" }), filename);
}
export function SaveJSON(json, filename) {
  SaveBlob(new Blob([json], { type: "application/json;charset=utf-8" }), filename);
}
export function SaveText(text, filename) {
  SaveBlob(new Blob([text], { type: "text/plain;charset=utf-8" }), filename);
}
