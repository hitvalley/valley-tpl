import sprintf from '../../src/utils/sprintf';

test('normal', () => {
  expect(sprintf('%s is a coder', 'gty')).toEqual('gty is a coder');
});
test('array input', () => {
  expect(sprintf('i can write %2$s, %1$s, %3$s', 'js', 'html', 'css')).toEqual('i can write html, js, css');
});
test('array input 2', () => {
  expect(sprintf('i can write %2$s, %1$s, %3$s', ['js', 'html', 'css'])).toEqual('i can write html, js, css');
});
test('replace with %s', () => {
  expect(sprintf('i like %s, %s is cute', 'dog')).toEqual('i like dog, dog is cute');
});


