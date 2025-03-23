import { describe, expect, test } from 'bun:test';
import { JSONAnalyze } from './Analyze.js';

describe(JSONAnalyze.name, () => {
  test('Primitives', () => {
    expect(JSONAnalyze(null)).toEqual({ source: null, type: 'primitive' });
    expect(JSONAnalyze(true)).toEqual({ source: true, type: 'primitive' });
    expect(JSONAnalyze(false)).toEqual({ source: false, type: 'primitive' });
    expect(JSONAnalyze(1)).toEqual({ source: 1, type: 'primitive' });
    expect(JSONAnalyze('a')).toEqual({ source: 'a', type: 'primitive' });
  });
  test('Invalid primitives throw.', () => {
    expect(() => JSONAnalyze(() => {})).toThrow();
    expect(() => JSONAnalyze(BigInt(0))).toThrow();
    expect(() => JSONAnalyze(Symbol('foo'))).toThrow();
    expect(() => JSONAnalyze(undefined)).toThrow();
  });
  test('Arrays', () => {
    expect(JSONAnalyze([])).toEqual({ source: [], type: 'array' });
    expect(JSONAnalyze([null])).toEqual({ source: [null], type: 'array' });
    expect(JSONAnalyze([1, 2, 3])).toEqual({ source: [1, 2, 3], type: 'array' });
    expect(JSONAnalyze(['a', 'b', 'c'])).toEqual({ source: ['a', 'b', 'c'], type: 'array' });
  });
  test('Arrays containing invalid primitives throw.', () => {
    expect(() => JSONAnalyze([() => {}])).toThrow();
    expect(() => JSONAnalyze([BigInt(0)])).toThrow();
    expect(() => JSONAnalyze([Symbol('foo')])).toThrow();
    expect(() => JSONAnalyze([undefined])).toThrow();
  });
  test('Arrays containing nested arrays containing invalid primitives throw.', () => {
    expect(() => JSONAnalyze([[() => {}]])).toThrow();
    expect(() => JSONAnalyze([[BigInt(0)]])).toThrow();
    expect(() => JSONAnalyze([[Symbol('foo')]])).toThrow();
    expect(() => JSONAnalyze([[undefined]])).toThrow();
  });
  test('Arrays containing objects containing invalid primitives throw.', () => {
    expect(() => JSONAnalyze([{ a: () => {} }])).toThrow();
    expect(() => JSONAnalyze([{ a: BigInt(0) }])).toThrow();
    expect(() => JSONAnalyze([{ a: Symbol('foo') }])).toThrow();
    expect(() => JSONAnalyze([{ a: undefined }])).toThrow();
  });
  describe('Objects', () => {
    expect(JSONAnalyze({ a: 1, b: 2 })).toEqual({ source: { a: 1, b: 2 }, type: 'object' });
    expect(JSONAnalyze({ val: 1, arr: [1, 2, 3], obj: { val: 1, arr: [1, 2, 3] } })).toEqual({ source: { val: 1, arr: [1, 2, 3], obj: { val: 1, arr: [1, 2, 3] } }, type: 'object' });
  });
  test('Objects containing invalid primitives throw.', () => {
    expect(() => JSONAnalyze({ a: () => {} })).toThrow();
    expect(() => JSONAnalyze({ a: BigInt(0) })).toThrow();
    expect(() => JSONAnalyze({ a: Symbol('foo') })).toThrow();
    expect(() => JSONAnalyze({ a: undefined })).toThrow();
  });
  test('Objects containing objects containing invalid primitives throw.', () => {
    expect(() => JSONAnalyze({ a: { a: () => {} } })).toThrow();
    expect(() => JSONAnalyze({ a: { a: BigInt(0) } })).toThrow();
    expect(() => JSONAnalyze({ a: { a: Symbol('foo') } })).toThrow();
    expect(() => JSONAnalyze({ a: { a: undefined } })).toThrow();
  });
  test('Recursive invalid primitive test.', () => {
    expect(() => JSONAnalyze({ a: [{ a: () => {} }] })).toThrow();
    expect(() => JSONAnalyze({ a: [{ a: [BigInt(0)] }] })).toThrow();
    expect(() => JSONAnalyze({ a: [{ a: { a: Symbol('foo') } }] })).toThrow();
    expect(() => JSONAnalyze({ a: [{ a: undefined }] })).toThrow();
    expect(() => JSONAnalyze([{ a: () => {} }])).toThrow();
    expect(() => JSONAnalyze([{ a: [BigInt(0)] }])).toThrow();
    expect(() => JSONAnalyze([{ a: { a: Symbol('foo') } }])).toThrow();
    expect(() => JSONAnalyze([{ a: undefined }])).toThrow();
  });
});
