import {
type,
isFunction,
isPlainObject
} from '../../src/utils/type';

test('boolean', () => {
  expect(type(true)).toBe('boolean');
});
test('boolean', () => {
  expect(type(false)).toBe('boolean');
});
test('number', () => {
  expect(type(123)).toBe('number');
});
test('string', () => {
  expect(type('abc')).toBe('string');
});
test('function', () => {
  function f1() {}
  expect(type(f1)).toBe('function');
  expect(isFunction(f1)).toBe(true);
});
test('array', () => {
  expect(type([1, 2, 3])).toBe('array');
});
test('date', () => {
  expect(type(new Date)).toBe('date');
});
test('regexp', () => {
  expect(type(/abc/)).toBe('regexp');
});
test('object', () => {
  expect(type({a:1})).toBe('object');
});
test('error', () => {
  expect(type(new Error())).toBe('error');
});
test('symbol', () => {
  expect(type(Symbol('1'))).toBe('symbol');
});


