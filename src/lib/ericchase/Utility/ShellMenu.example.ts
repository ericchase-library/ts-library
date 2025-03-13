import { StdinRawModeReader } from 'src/lib/ericchase/Platform/Node/Process.js';
import { KEYS, Shell } from 'src/lib/ericchase/Platform/Node/Shell.js';
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

const stdin = new StdinRawModeReader();
stdin.addHandler((text) => {
  if (text === KEYS.SIGINT) {
    process.exit();
  }
});
await stdin.start();

stdin.addHandler(async (text) => {
  switch (text) {
    case KEYS.ARROWS.UP:
      menu.previousItem();
      break;
    case KEYS.ARROWS.DOWN:
      menu.nextItem();
      break;
    case ' ':
    case '\r':
    case '\n':
      await menu.selectItem();
      break;
    case KEYS.ESC:
      await menu.previousMenu();
      break;
  }
});

Shell.HideCursor();
