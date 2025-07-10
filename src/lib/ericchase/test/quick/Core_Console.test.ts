import { expect, test } from 'bun:test';
import { Core_Console_Error } from '../../Core_Console_Error.js';
import { Core_Console_Error_With_Date } from '../../Core_Console_Error_With_Date.js';
import { Core_Console_Log } from '../../Core_Console_Log.js';
import { Core_Console_Log_With_Date } from '../../Core_Console_Log_With_Date.js';

test(Core_Console_Error.name, () => {
  expect(Core_Console_Error('Test Error')).toBeEmpty();
});
test(Core_Console_Error_With_Date.name, () => {
  expect(Core_Console_Error_With_Date('Test ErrorWithDate')).toBeEmpty();
});
test(Core_Console_Log.name, () => {
  expect(Core_Console_Log('Test Log')).toBeEmpty();
});
test(Core_Console_Log_With_Date.name, () => {
  expect(Core_Console_Log_With_Date('Test LogWithDate')).toBeEmpty();
});
