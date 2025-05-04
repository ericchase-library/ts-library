import { Core } from '../../src/lib/ericchase/core.js';
import { NODE_PATH, NodePlatform } from '../../src/lib/ericchase/platform-node.js';

const LoggerOptions: {
  ceremony: boolean;
  console: boolean;
  list: Set<string>;
  listmode: 'allow' | 'block';
} = {
  ceremony: true,
  console: true,
  list: new Set(),
  listmode: 'block',
};

enum Kind {
  Err = 0,
  Log = 1,
}

export class ClassLogger {
  constructor(
    readonly uuid: string,
    readonly channel: string,
    readonly name: string,
  ) {}
  error(...items: any[]) {
    if (items[0] instanceof Error) {
      addlog(Kind.Err, this, items.slice(1), items[0]);
    } else {
      addlog(Kind.Err, this, items);
    }
  }
  errorNotEmpty(...items: any[]) {
    if (items[0] instanceof Error) {
      addlog(Kind.Err, this, items.slice(1), items[0]);
    } else {
      for (const item of items) {
        if (Array.isArray(item) && item.length === 0) continue;
        if (ArrayBuffer.isView(item) && item.byteLength === 0) continue;
        if (typeof item === 'string' && item.length === 0) continue;
        addlog(Kind.Err, this, items);
        break;
      }
    }
  }
  log(...items: any[]) {
    addlog(Kind.Log, this, items);
  }
  logNotEmpty(...items: any[]) {
    for (const item of items) {
      if (Array.isArray(item) && item.length === 0) continue;
      if (ArrayBuffer.isView(item) && item.byteLength === 0) continue;
      if (typeof item === 'string' && item.length === 0) continue;
      addlog(Kind.Log, this, items);
      break;
    }
  }

  newChannel(): ClassLogger {
    return new ClassLogger(this.uuid, getNextChannel(this.uuid), this.name);
  }
}

let buffer: BufferItem[] = [];
let timeout: ReturnType<typeof setTimeout> | undefined;
const output_set = new Set<string>();

const name_to_buffer = new Map<string, string[]>();
const name_to_logger = new Map<string, ClassLogger>();
const name_to_uuid = new Map<string, string>();
const uuid_to_channel = new Map<string, number>();
const uuid_to_name = new Map<string, string>();

interface BufferItem {
  date: number;
  kind: 0 | 1; // Kind.Err | Kind.Log
  uuid: string;
  channel: string;
  items: any[];
  error?: Error;
}

let unprocessedlogcount = 0;
function addlog(kind: BufferItem['kind'], logger: ClassLogger, items: BufferItem['items'], error?: Error) {
  unprocessedlogcount++;
  buffer.push({ date: Date.now(), kind, uuid: logger.uuid, channel: logger.channel, items, error });
  setTimer();
}
function getUuid(name: string): string {
  return Core.Map.GetOrDefault(name_to_uuid, name, () => {
    const uuid = (name_to_uuid.size + 1).toString().padStart(2, '0');
    uuid_to_name.set(uuid, name);
    return uuid;
  });
}
function getNextChannel(uuid: string): string {
  const channel = (uuid_to_channel.get(uuid) ?? 0) + 1;
  uuid_to_channel.set(uuid, channel);
  return channel.toString().padStart(2, '0');
}
function isLoggerEnabled(name: string) {
  if (LoggerOptions.listmode === 'allow') {
    return LoggerOptions.list.has(name);
  }
  return !LoggerOptions.list.has(name);
}
async function processBuffer() {
  const default_buffer = Core.Map.GetOrDefault(name_to_buffer, 'default', () => []);
  const temp_buffer = buffer;
  buffer = [];
  for (const { date, kind, uuid, channel, items, error } of temp_buffer) {
    unprocessedlogcount--;
    const name = uuid_to_name.get(uuid) ?? 'default';
    const name_buffer = Core.Map.GetOrDefault(name_to_buffer, name, () => []);
    if (isLoggerEnabled(name) === false) {
      continue;
    }
    const datestring = formatDate(new Date(date));
    if (kind === Kind.Err) {
      for (const line of Core.String.RemoveWhiteSpaceOnlyLinesFromTopAndBottom(items.join(' '))) {
        const text = `${datestring} |${uuid}.${channel}| (${name}) <ERROR> ${line}`;
        if (LoggerOptions.console === true) {
          if (LoggerOptions.ceremony === true) {
            Core.Console.Error(text);
          } else {
            Core.Console.Error(`<ERROR> ${line}`);
          }
        }
        default_buffer.push(text);
        name_buffer.push(text);
      }
      if (error !== undefined) {
        Core.Console.Error(error);
        default_buffer.push(error.toString());
        name_buffer.push(error.toString());
      }
    } else {
      for (const line of Core.String.RemoveWhiteSpaceOnlyLinesFromTopAndBottom(items.join(' '))) {
        const text = `${datestring} |${uuid}.${channel}| (${name}) ${line}`;
        if (LoggerOptions.console === true) {
          if (LoggerOptions.ceremony === true) {
            Core.Console.Log(text);
          } else {
            Core.Console.Log(line);
          }
        }
        default_buffer.push(text);
        name_buffer.push(text);
      }
    }
  }
  for (const path of output_set) {
    for (const [name, lines] of name_to_buffer) {
      if (lines.length > 0) {
        await NodePlatform.File.Async_AppendText(NODE_PATH.resolve(path, `${name}.log`), `${lines.join('\n')}\n`);
        name_to_buffer.set(name, []);
      }
    }
  }
}
let task: Promise<void> | undefined = undefined;
function setTimer() {
  timeout ??= setTimeout(() => {
    timeout = undefined;
    task = processBuffer();
  }, 50);
}

export const DefaultLogger = Logger();

export function Logger(name = 'default'): ClassLogger {
  return Core.Map.GetOrDefault(name_to_logger, name, () => new ClassLogger(getUuid(name), '00', name));
}

/** Important: don't forget to await this! */
export async function AddLoggerOutputDirectory(path: string) {
  DefaultLogger.log(`Add Logger Output Directory: "${path}"`);
  path = NODE_PATH.resolve(path, 'logs');
  if (output_set.has(path) === false) {
    output_set.add(path);
    await NodePlatform.Directory.Async_Create(path);
  }
}

export function SetLoggerOptions(options: { ceremony?: boolean; console?: boolean; list?: string[]; listmode?: 'allow' | 'block' }) {
  if (options.ceremony !== undefined) LoggerOptions.ceremony = options.ceremony;
  if (options.console !== undefined) LoggerOptions.console = options.console;
  if (options.list !== undefined) LoggerOptions.list = new Set(options.list);
  if (options.listmode !== undefined) LoggerOptions.listmode = options.listmode;
}

export async function WaitForLogger() {
  if (unprocessedlogcount > 0) {
    await new Promise<void>((resolve, reject) => {
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

function formatDate(date: Date) {
  // biome-ignore lint/style/useSingleVarDeclarator: performance
  let y = date.getFullYear(),
    m = date.getMonth() + 1,
    d = date.getDate(),
    hh = date.getHours(),
    mm = date.getMinutes(),
    ss = date.getSeconds(),
    ap = hh < 12 ? 'AM' : 'PM';
  hh = hh % 12 || 12; // Convert to 12-hour format, ensuring 12 instead of 0
  // biome-ignore lint/style/useTemplate: performance
  return y + '-' + (m < 10 ? '0' : '') + m + '-' + (d < 10 ? '0' : '') + d + ' ' + (hh < 10 ? '0' : '') + hh + ':' + (mm < 10 ? '0' : '') + mm + ':' + (ss < 10 ? '0' : '') + ss + ' ' + ap;
}

process.on('beforeExit', async (code) => {
  await WaitForLogger();
  if (unprocessedlogcount > 0) {
    Core.Console.Error('Unprocessed Logs:', unprocessedlogcount);
  }
});
