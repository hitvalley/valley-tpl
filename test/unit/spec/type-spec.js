import {
  type,
  isFunction,
  isPlainObject
} from '../../../src/utils/type';

describe('test type', () => {
  it('boolean', () => {
    expect(type(true)).toBe('boolean');
  });
  it('boolean', () => {
    expect(type(false)).toBe('boolean');
  });
  it('number', () => {
    expect(type(123)).toBe('number');
  });
  it('string', () => {
    expect(type('abc')).toBe('string');
  });
  it('function', () => {
    function f1() {}
    expect(type(f1)).toBe('function');
    expect(isFunction(f1)).toBe(true);
  });
  it('array', () => {
    expect(type([1, 2, 3])).toBe('array');
  });
  it('date', () => {
    expect(type(new Date)).toBe('date');
  });
  it('regexp', () => {
    expect(type(/abc/)).toBe('regexp');
  });
  it('object', () => {
    expect(type({a:1})).toBe('object');
  });
  it('error', () => {
    expect(type(new Error())).toBe('error');
  });
  it('symbol', () => {
    expect(type(Symbol('1'))).toBe('symbol');
  });
});
