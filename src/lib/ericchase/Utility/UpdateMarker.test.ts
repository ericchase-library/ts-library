import { describe, expect, test } from 'bun:test';
import { DataSetMarker, DataSetMarkerManager, UpdateMarker, UpdateMarkerManager } from 'src/lib/ericchase/Utility/UpdateMarker.js';

describe(UpdateMarker.name, () => {
  const manager = new UpdateMarkerManager();
  const marker = manager.getNewMarker();
  test('constructor', () => {
    expect(marker.updated).toBeFalse();
    expect(marker.$manager).toBe(manager);
  });
  test(marker.reset.name, () => {
    expect(marker.updated).toBeFalse();
    manager.updateMarkers();
    expect(marker.updated).toBeTrue();
    marker.reset();
    expect(marker.updated).toBeFalse();
  });
});

describe(UpdateMarkerManager.name, () => {
  const manager = new UpdateMarkerManager();
  test('constructor', () => {
    expect(manager.$marks.size).toBe(0);
  });
  test(manager.getNewMarker.name, () => {
    expect(manager.getNewMarker()).toEqual(new UpdateMarker(manager));
  });
  test(manager.resetMarker.name, () => {
    const marker = manager.getNewMarker();
    expect(marker.updated).toBeFalse();
    manager.updateMarkers();
    manager.resetMarker(marker);
    expect(marker.updated).toBeFalse();
  });
  test(manager.updateMarkers.name, () => {
    const marker = manager.getNewMarker();
    expect(marker.updated).toBeFalse();
    manager.updateMarkers();
    expect(marker.updated).toBeTrue();
  });
});

describe(DataSetMarker.name, () => {
  const manager = new DataSetMarkerManager<string>();
  const marker = manager.getNewMarker();
  test('constructor', () => {
    expect(marker.dataset).toBeEmpty();
    expect(marker.$manager).toBe(manager);
  });
  test(marker.reset.name, () => {
    expect(marker.dataset).toBeEmpty();
    manager.updateMarkers('a');
    expect(marker.dataset.size).toBe(1);
    expect(marker.dataset).toContain('a');
    marker.reset();
    expect(marker.dataset).toBeEmpty();
  });
});

describe(DataSetMarkerManager.name, () => {
  const manager = new DataSetMarkerManager<string>();
  test('constructor', () => {
    expect(manager.$marks.size).toBe(0);
  });
  test(manager.getNewMarker.name, () => {
    expect(manager.getNewMarker()).toEqual(new DataSetMarker(manager));
  });
  test(manager.resetMarker.name, () => {
    const marker = manager.getNewMarker();
    expect(marker.dataset).toBeEmpty();
    manager.updateMarkers('a');
    expect(marker.dataset.size).toBe(1);
    expect(marker.dataset).toContain('a');
    marker.reset();
    expect(marker.dataset).toBeEmpty();
  });
  test(manager.updateMarkers.name, () => {
    const marker = manager.getNewMarker();
    expect(marker.dataset).toBeEmpty();
    manager.updateMarkers('a');
    expect(marker.dataset.size).toBe(1);
    expect(marker.dataset).toContain('a');
  });
});
