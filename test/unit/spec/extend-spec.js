import extend from '../../../src/utils/extend';

describe('test extend function', () => {
  it('extend', () => {
    expect(extend({}, {a: 1, b: 2}, {b: 3, c: 5})).toEqual({a:1, b:3, c:5});
  });
});
