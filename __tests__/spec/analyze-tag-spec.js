import analyzeTag from '../../src/analyze-tag';

test('test string', () => {
  let tpl = 'test';
  expect(analyzeTag(tpl)).toEqual([{
    type: 'string',
    content: 'test'
  }]);
});
test('test variable', () => {
  let tpl = '{{str}}';
  expect(analyzeTag(tpl)).toEqual([{
    type: 'var',
    content: 'str'
  }]);
});
test('test if', () => {
  let tpl = '{{if test === 1}}yes{{else}}no{{/if}}';
  expect(analyzeTag(tpl)).toEqual([{
    type: 'if',
    content: 'test === 1'
  }, {
    type: 'string',
    content: 'yes'
  }, {
    type: 'else'
  }, {
    type: 'string',
    content: 'no'
  }, {
    type: 'endif'
  }]);
});
test('test for', () => {
  let tpl = '{{for var i = 0; i < 10; i ++}}{{arr[i]}}{{/for}}';
  let res = [{
    type: 'for',
    content: 'var i = 0; i < 10; i ++'
  }, {
    type: 'var',
    content: 'arr[i]'
  }, {
    type: 'endfor'
  }]
  expect(analyzeTag(tpl)).toEqual(res);
});
test('test for obj', () => {
  let tpl = '{{for var i in obj}}{{obj[i]}}{{/for}}';
  let res = [{
    type: 'for',
    content: 'var i in obj'
  }, {
    type: 'var',
    content: 'obj[i]'
  }, {
    type: 'endfor'
  }]
  expect(analyzeTag(tpl)).toEqual(res);
});


