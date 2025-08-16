import { Core_Console_Error } from "../ericchase/Core_Console_Error.js";
import { SERVERHOST } from "./constants.js";
let socket = undefined;
function cleanup() {
  if (socket) {
    socket.onclose = () => {};
    socket.onerror = () => {};
    socket.onmessage = () => {};
    socket = undefined;
  }
}
function startup(serverhost) {
  try {
    socket = new WebSocket("ws://" + serverhost);
    if (socket !== undefined) {
      socket.onclose = () => cleanup();
      socket.onerror = () => cleanup();
      socket.onmessage = (event) => {
        if (event.data === "reload") {
          socket?.close();
          setTimeout(() => async_reloadOnServerRestart(serverhost), 100);
        }
      };
    }
  } catch (error) {
    Core_Console_Error(error);
  }
}
async function async_reloadOnServerRestart(serverhost) {
  try {
    await fetch(serverhost);
    window.location.reload();
  } catch {
    setTimeout(() => async_reloadOnServerRestart(serverhost), 100);
  }
}
export function EnableHotReload(serverhost) {
  startup(serverhost ?? SERVERHOST);
}
