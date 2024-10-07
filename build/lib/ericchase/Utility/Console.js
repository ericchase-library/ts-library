import { UpdateMarkerManager } from './UpdateMarker.js';
const marker_manager = new UpdateMarkerManager();
let newline_count = 0;
export function GetConsoleMarker() {
  return marker_manager.getNewMarker();
}
export function ConsoleError(...items) {
  console['error'](...items);
  newline_count = 0;
  marker_manager.updateMarkers();
}
export function ConsoleErrorWithDate(...items) {
  console['error'](`[${new Date().toLocaleTimeString()}]`, ...items);
  newline_count = 0;
  marker_manager.updateMarkers();
}
export function ConsoleLog(...items) {
  console['log'](...items);
  newline_count = 0;
  marker_manager.updateMarkers();
}
export function ConsoleLogWithDate(...items) {
  console['log'](`[${new Date().toLocaleTimeString()}]`, ...items);
  newline_count = 0;
  marker_manager.updateMarkers();
}
export function ConsoleNewline(ensure_count = 1) {
  for (let i = newline_count; i < ensure_count; i++) {
    console['log']();
    newline_count++;
  }
  marker_manager.updateMarkers();
}
export function ConsoleLogToLines(items) {
  if (typeof items === 'string') {
    ConsoleLog(items);
  } else {
    for (const item of items) {
      ConsoleLog(item);
    }
  }
}
export function ConsoleErrorToLines(items) {
  if (typeof items === 'string') {
    ConsoleError(items);
  } else {
    for (const item of items) {
      ConsoleError(item);
    }
  }
}
