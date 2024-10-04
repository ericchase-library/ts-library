import { describe, expect, test } from 'bun:test';
import { UpdateMarker, UpdateMarkerManager } from './UpdateMarker.js';

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
    expect(manager.extra).toBeUndefined();
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

describe(`${UpdateMarker.name} with Extra`, () => {
  const manager = new UpdateMarkerManager<{ counter: number }>();
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

describe(`${UpdateMarkerManager.name} with Extra`, () => {
  const manager = new UpdateMarkerManager<{ counter: number }>({ counter: 0 });
  test('{ counter: number = 0 }', () => {
    expect(manager.$marks.size).toBe(0);
    expect(manager.extra).toEqual({ counter: 0 });
  });
  test('increment counter', () => {
    manager.extra.counter++;
    expect(manager.extra).toEqual({ counter: 1 });
  });
  test("methods don't alter counter", () => {
    expect(manager.extra).toEqual({ counter: 1 });
    const marker = manager.getNewMarker();
    expect(manager.extra).toEqual({ counter: 1 });
    manager.resetMarker(marker);
    expect(manager.extra).toEqual({ counter: 1 });
    manager.updateMarkers();
    expect(manager.extra).toEqual({ counter: 1 });
    marker.reset();
    expect(manager.extra).toEqual({ counter: 1 });
  });
});
