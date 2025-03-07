import { describe, expect, test } from 'bun:test';

import { UpdateMarkerManager } from './Utility/UpdateMarker.js';

describe('Private API', () => {
  describe('Utility', () => {
    describe(UpdateMarkerManager.name, () => {
      const manager = new UpdateMarkerManager();
      test('$marks', () => {
        expect('$marks' in manager).toBeTrue();
      });
    });
  });
});
