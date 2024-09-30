import { ArraySplit } from '../../Algorithm/Array.js';
import { ConsoleError } from '../../Utility/Console.js';
import { Split, SplitMultipleSpaces } from '../../Utility/String.js';
function createCodeMap(table) {
  const map = {};
  for (const [name, code] of ArraySplit(Split(table.trim(), '|', true), 3)) {
    map[name.trim()] = SplitMultipleSpaces(code, true)[0];
  }
  return map;
}
const GeneralASCIICodes = createCodeMap(`
| BEL | \x07 | Terminal bell
| BS  |  | Backspace
| HT  | 	 | Horizontal TAB
| LF  | 
 | Linefeed (newline)
| VT  |  | Vertical TAB
| FF  |  | Formfeed (also: New page NP)
| CR  | \r | Carriage return
| ESC | \x1B | Escape character
| DEL |  | Delete character
`);
const ESC = GeneralASCIICodes.ESC;
const CSI = `${ESC}[`;
const DCS = `${ESC}P`;
const OSC = `${ESC}]`;
export const KEYS = {
  SIGINT: '\x03',
  ESC,
  CSI,
  DCS,
  OSC,
  ARROWS: {
    DOWN: '\x1B[B',
    LEFT: '\x1B[D',
    RIGHT: '\x1B[C',
    UP: '\x1B[A',
  },
};
export const Shell = {
  EraseLine() {
    process.stdout.write(`${CSI}2K`);
  },
  HideCursor() {
    process.stdout.write(`${CSI}?25l`);
    if (exit_trapped === false) {
      SetupExitTrapForCursor();
    }
  },
  MoveCursorDown(count = 0, to_start = false) {
    if (to_start === true) {
      process.stdout.write(`${CSI}${count}E`);
    } else {
      process.stdout.write(`${CSI}${count}B`);
    }
  },
  MoveCursorLeft(count = 0) {
    process.stdout.write(`${CSI}${count}D`);
  },
  MoveCursorRight(count = 0) {
    process.stdout.write(`${CSI}${count}C`);
  },
  MoveCursorStart() {
    process.stdout.write('\r');
  },
  MoveCursorToColumn(count = 0) {
    process.stdout.write(`${CSI}${count}G`);
  },
  MoveCursorUp(count = 0, to_start = false) {
    if (to_start === true) {
      process.stdout.write(`${CSI}${count}F`);
    } else {
      process.stdout.write(`${CSI}${count}A`);
    }
  },
  ShowCursor() {
    process.stdout.write(`${CSI}?25h`);
  },
};
let exit_trapped = false;
function listenerUncaughtException(error, origin) {
  Shell.ShowCursor();
  if (process.listeners('uncaughtException').length === 1) {
    ConsoleError(error);
    process.exit();
  }
}
function SetupExitTrapForCursor() {
  exit_trapped = true;
  process.on('exit', Shell.ShowCursor);
  process.on('SIGINT', Shell.ShowCursor);
  process.on('uncaughtException', () => listenerUncaughtException);
}
