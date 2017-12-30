import extend from '../../src/utils/extend';

test('extend', () => {
  expect(extend({}, {a: 1, b: 2}, {b: 3, c: 5})).toEqual({a:1, b:3, c:5});
});


