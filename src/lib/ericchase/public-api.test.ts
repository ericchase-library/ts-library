import { describe, expect, test } from 'bun:test';
import { AssertBigint, AssertBoolean, AssertEqual, AssertFunction, AssertNotEqual, AssertNumber, AssertObject, AssertString, AssertSymbol, AssertUndefined } from './Utility/Assert.js';
import { ConsoleError, ConsoleErrorToLines, ConsoleErrorWithDate, ConsoleLog, ConsoleLogToLines, ConsoleLogWithDate, ConsoleNewline, GetConsoleMarker } from './Utility/Console.js';
import { Debounce, ImmediateDebounce } from './Utility/Debounce.js';
import { HasMethod, HasProperty } from './Utility/Guard.js';
import { DataSetMarker, DataSetMarkerManager, UpdateMarker, UpdateMarkerManager } from './Utility/UpdateMarker.js';

import * as debounce_js from './Utility/Debounce.js';

describe('Public API', () => {
  describe('Utility', () => {
    describe('Assert.ts', () => {
      test('AssertEqual', () => {
        expect(AssertEqual.name).toBe('AssertEqual');
      });
      test('AssertNotEqual', () => {
        expect(AssertNotEqual.name).toBe('AssertNotEqual');
      });
      test('AssertBigint', () => {
        expect(AssertBigint.name).toBe('AssertBigint');
      });
      test('AssertBoolean', () => {
        expect(AssertBoolean.name).toBe('AssertBoolean');
      });
      test('AssertFunction', () => {
        expect(AssertFunction.name).toBe('AssertFunction');
      });
      test('AssertNumber', () => {
        expect(AssertNumber.name).toBe('AssertNumber');
      });
      test('AssertObject', () => {
        expect(AssertObject.name).toBe('AssertObject');
      });
      test('AssertString', () => {
        expect(AssertString.name).toBe('AssertString');
      });
      test('AssertSymbol', () => {
        expect(AssertSymbol.name).toBe('AssertSymbol');
      });
      test('AssertUndefined', () => {
        expect(AssertUndefined.name).toBe('AssertUndefined');
      });
    });
    describe('Console.ts', () => {
      test('GetConsoleMarker', () => {
        expect(GetConsoleMarker.name).toBe('GetConsoleMarker');
      });
      test('ConsoleError', () => {
        expect(ConsoleError.name).toBe('ConsoleError');
      });
      test('ConsoleErrorWithDate', () => {
        expect(ConsoleErrorWithDate.name).toBe('ConsoleErrorWithDate');
      });
      test('ConsoleLog', () => {
        expect(ConsoleLog.name).toBe('ConsoleLog');
      });
      test('ConsoleLogWithDate', () => {
        expect(ConsoleLogWithDate.name).toBe('ConsoleLogWithDate');
      });
      test('ConsoleNewline', () => {
        expect(ConsoleNewline.name).toBe('ConsoleNewline');
      });
      test('ConsoleLogToLines', () => {
        expect(ConsoleLogToLines.name).toBe('ConsoleLogToLines');
      });
      test('ConsoleErrorToLines', () => {
        expect(ConsoleErrorToLines.name).toBe('ConsoleErrorToLines');
      });
    });
    describe('Debounce.ts', () => {
      test('Debounce', () => {
        expect(Debounce.name).toBe('Debounce');
      });
      test('ImmediateDebounce', () => {
        expect(ImmediateDebounce.name).toBe('ImmediateDebounce');
      });
      test('LeadingEdgeDebounce', () => {
        expect('LeadingEdgeDebounce' in debounce_js).toBeTrue();
      });
    });
    describe('Guard.ts', () => {
      test('HasMethod', () => {
        expect(HasMethod.name).toBe('HasMethod');
      });
      test('HasProperty', () => {
        expect(HasProperty.name).toBe('HasProperty');
      });
    });
    describe('UpdateMarker.ts', () => {
      describe(UpdateMarker.name, () => {
        const manager = new UpdateMarkerManager();
        const marker = manager.getNewMarker();
        test('UpdateMarker (class)', () => {
          expect(UpdateMarker.name).toBe('UpdateMarker');
        });
        test('reset', () => {
          expect(marker.reset.name).toBe('reset');
        });
        test('updated', () => {
          expect('updated' in marker).toBeTrue();
        });
      });
      describe(UpdateMarkerManager.name, () => {
        const manager = new UpdateMarkerManager();
        test('UpdateMarkerManager (class)', () => {
          expect(UpdateMarkerManager.name).toBe('UpdateMarkerManager');
        });
        test('getNewMarker', () => {
          expect(manager.getNewMarker.name).toBe('getNewMarker');
        });
        test('resetMarker', () => {
          expect(manager.resetMarker.name).toBe('resetMarker');
        });
        test('updateMarkers', () => {
          expect(manager.updateMarkers.name).toBe('updateMarkers');
        });
      });
      describe(DataSetMarker.name, () => {
        const manager = new DataSetMarkerManager();
        const marker = manager.getNewMarker();
        test('DataSetMarker (class)', () => {
          expect(DataSetMarker.name).toBe('DataSetMarker');
        });
        test('dataset', () => {
          expect('dataset' in marker).toBeTrue();
        });
        test('reset', () => {
          expect(marker.reset.name).toBe('reset');
        });
      });
      describe(DataSetMarkerManager.name, () => {
        const manager = new DataSetMarkerManager();
        test('DataSetMarkerManager (class)', () => {
          expect(DataSetMarkerManager.name).toBe('DataSetMarkerManager');
        });
        test('getNewMarker', () => {
          expect(manager.getNewMarker.name).toBe('getNewMarker');
        });
        test('resetMarker', () => {
          expect(manager.resetMarker.name).toBe('resetMarker');
        });
        test('updateMarkers', () => {
          expect(manager.updateMarkers.name).toBe('updateMarkers');
        });
      });
    });
  });
});
