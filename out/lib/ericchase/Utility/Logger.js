import { Path } from "../Platform/FilePath.js";
import { Map_GetOrDefault } from "./Map.js";
import { RemoveWhiteSpaceOnlyLinesFromTopAndBottom } from "./String.js";
const LoggerOptions = {
  ceremony: true,
  console: true,
  list: new Set,
  listmode: "block"
};
var Kind;
((Kind) => {
  Kind[Kind["Err"] = 0] = "Err";
  Kind[Kind["Log"] = 1] = "Log";
})(Kind ||= {});

class CLogger {
  uuid;
  channel;
  name;
  constructor(uuid, channel, name) {
    this.uuid = uuid;
    this.channel = channel;
    this.name = name;
  }
  error(...items) {
    addlog(0 /* Err */, this, items);
  }
  errorNotEmpty(...items) {
    for (const item of items) {
      if (Array.isArray(item) && item.length === 0)
        continue;
      if (ArrayBuffer.isView(item) && item.byteLength === 0)
        continue;
      if (typeof item === "string" && item.length === 0)
        continue;
      addlog(0 /* Err */, this, items);
      break;
    }
  }
  log(...items) {
    addlog(1 /* Log */, this, items);
  }
  logNotEmpty(...items) {
    for (const item of items) {
      if (Array.isArray(item) && item.length === 0)
        continue;
      if (ArrayBuffer.isView(item) && item.byteLength === 0)
        continue;
      if (typeof item === "string" && item.length === 0)
        continue;
      addlog(1 /* Log */, this, items);
      break;
    }
  }
  newChannel() {
    return new CLogger(this.uuid, getNextChannel(this.uuid), this.name);
  }
}
let buffer = [];
let timeout;
const output_map = new Map;
const name_to_buffer = new Map;
const name_to_logger = new Map;
const name_to_uuid = new Map;
const uuid_to_channel = new Map;
const uuid_to_name = new Map;
let unprocessedlogcount = 0;
function addlog(kind, logger, items) {
  unprocessedlogcount++;
  buffer.push({ date: Date.now(), kind, uuid: logger.uuid, channel: logger.channel, items });
  setTimer();
}
function getUuid(name) {
  return Map_GetOrDefault(name_to_uuid, name, () => {
    const uuid = (name_to_uuid.size + 1).toString().padStart(2, "0");
    uuid_to_name.set(uuid, name);
    return uuid;
  });
}
function getNextChannel(uuid) {
  const channel = (uuid_to_channel.get(uuid) ?? 0) + 1;
  uuid_to_channel.set(uuid, channel);
  return channel.toString().padStart(2, "0");
}
function isLoggerEnabled(name) {
  if (LoggerOptions.listmode === "allow") {
    return LoggerOptions.list.has(name);
  }
  return !LoggerOptions.list.has(name);
}
async function processBuffer() {
  const default_buffer = Map_GetOrDefault(name_to_buffer, "default", () => []);
  const temp_buffer = buffer;
  buffer = [];
  for (const { date, kind, uuid, channel, items } of temp_buffer) {
    unprocessedlogcount--;
    const name = uuid_to_name.get(uuid) ?? "default";
    const name_buffer = Map_GetOrDefault(name_to_buffer, name, () => []);
    if (isLoggerEnabled(name) === false) {
      continue;
    }
    const datestring = formatDate(new Date(date));
    if (kind === 0 /* Err */) {
      for (const line of RemoveWhiteSpaceOnlyLinesFromTopAndBottom(items.join(" "))) {
        const text = `${datestring} |${uuid}.${channel}| (${name}) <ERROR> ${line}`;
        if (LoggerOptions.console === true) {
          if (LoggerOptions.ceremony === true) {
            console["error"](text);
          } else {
            console["error"](`<ERROR> ${line}`);
          }
        }
        default_buffer.push(text);
        name_buffer.push(text);
      }
    } else {
      for (const line of RemoveWhiteSpaceOnlyLinesFromTopAndBottom(items.join(" "))) {
        const text = `${datestring} |${uuid}.${channel}| (${name}) ${line}`;
        if (LoggerOptions.console === true) {
          if (LoggerOptions.ceremony === true) {
            console["log"](text);
          } else {
            console["log"](line);
          }
        }
        default_buffer.push(text);
        name_buffer.push(text);
      }
    }
  }
  for (const [path, platform] of output_map) {
    for (const [name, lines] of name_to_buffer) {
      if (lines.length > 0) {
        await platform.File.appendText(Path(path, `${name}.log`), `${lines.join(`
`)}
`);
        name_to_buffer.set(name, []);
      }
    }
  }
}
let task = undefined;
function setTimer() {
  timeout ??= setTimeout(() => {
    timeout = undefined;
    task = processBuffer();
  }, 50);
}
export const DefaultLogger = Logger();
export function Logger(name = "default") {
  return Map_GetOrDefault(name_to_logger, name, () => new CLogger(getUuid(name), "00", name));
}
export async function AddLoggerOutputDirectory(path, platform) {
  DefaultLogger.log(`Add Logger Output Directory: "${Path(path).raw}"`);
  path = Path(path, "logs");
  if (output_map.has(path) === false) {
    output_map.set(path, platform);
    await platform.Directory.create(path);
  }
}
export function SetLoggerOptions(options) {
  if (options.ceremony !== undefined)
    LoggerOptions.ceremony = options.ceremony;
  if (options.console !== undefined)
    LoggerOptions.console = options.console;
  if (options.list !== undefined)
    LoggerOptions.list = new Set(options.list);
  if (options.listmode !== undefined)
    LoggerOptions.listmode = options.listmode;
}
export async function WaitForLogger() {
  if (unprocessedlogcount > 0) {
    await new Promise((resolve, reject) => {
      let id = setInterval(() => {
        if (unprocessedlogcount > 0) {
          setTimer();
        } else {
          clearInterval(id);
          resolve();
        }
      }, 250);
    });
    await task;
  }
}
function formatDate(date) {
  let y = date.getFullYear(), m = date.getMonth() + 1, d = date.getDate(), hh = date.getHours(), mm = date.getMinutes(), ss = date.getSeconds(), ap = hh < 12 ? "AM" : "PM";
  hh = hh % 12 || 12;
  return y + "-" + (m < 10 ? "0" : "") + m + "-" + (d < 10 ? "0" : "") + d + " " + (hh < 10 ? "0" : "") + hh + ":" + (mm < 10 ? "0" : "") + mm + ":" + (ss < 10 ? "0" : "") + ss + " " + ap;
}
process.on("beforeExit", async (code) => {
  await WaitForLogger();
  if (unprocessedlogcount > 0) {
    console["error"]("Unprocessed Logs:", unprocessedlogcount);
  }
});
