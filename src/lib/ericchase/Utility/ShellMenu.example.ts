import { KEYS, Shell } from 'src/lib/ericchase/Platform/Shell.js';
import { AddStdInListener, StartStdInRawModeReader } from 'src/lib/ericchase/Platform/StdinReader.js';
import { ShellMenu } from 'src/lib/ericchase/Utility/ShellMenu.js';

const menu = new ShellMenu({
  menu: {
    name: 'Start', // won't ever be displayed in terminal, but still required
    label: 'Do you want to continue?',
    items: [
      {
        name: 'Continue',
        label: 'Choose your item:',
        items: [
          {
            name: 'Item 1',
            items: [
              { name: '1 - Item A' }, //
              { name: '1 - Item B' },
              { name: '1 - Item C' },
              { name: '1 - Item D' },
              { name: '1 - Item E' },
            ],
          },
          {
            name: 'Item 2',
            items: [
              { name: '2 - Item A' }, //
              { name: '2 - Item B' },
              { name: '2 - Item C' },
              { name: '2 - Item D' },
              { name: '2 - Item E' },
            ],
          },
          {
            name: 'Item 3',
            items: [
              { name: '3 - Item A' }, //
              { name: '3 - Item B' },
              { name: '3 - Item C' },
              { name: '3 - Item D' },
              { name: '3 - Item E' },
            ],
          },
        ],
      },
      {
        name: 'Quit',
        action: () => {
          process.exit();
        },
      },
    ],
  },
});

AddStdInListener(async (bytes, text, removeSelf) => {
  if (text === KEYS.SIGINT) {
    process.exit();
  }
});

AddStdInListener(async (bytes, text, removeSelf) => {
  switch (text) {
    case KEYS.ARROWS.UP:
      menu.previousItem();
      break;
    case KEYS.ARROWS.DOWN:
      menu.nextItem();
      break;
    case ' ':
    case KEYS.CR:
    case KEYS.LF:
      await menu.selectItem();
      break;
    case KEYS.ESC:
      await menu.previousMenu();
      break;
  }
});

StartStdInRawModeReader();
Shell.HideCursor();
