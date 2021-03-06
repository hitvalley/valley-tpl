import {
analyzeFilter,
includeRegExp,
getVariableList
} from '../../src/utils/regexp-obj';

test('test filter', () => {
  expect(analyzeFilter(' ')).toEqual(null);
  expect(analyzeFilter('$yesterday')).toEqual({
    content: '$yesterday',
    variable: '$yesterday',
    filter: undefined,
    args: []
  });
  expect(analyzeFilter('$yesterday|date_formate')).toEqual({
    content: '$yesterday|date_formate',
    variable: '$yesterday',
    filter: 'date_formate',
    args: []
  });
  expect(analyzeFilter('$yesterday|date_format:"%A, %B %e, %Y"')).toEqual({
    content: '$yesterday|date_format:"%A, %B %e, %Y"',
    variable: '$yesterday',
    filter: 'date_format',
    args: ['"%A, %B %e, %Y"']
  });
  expect(analyzeFilter('$yesterday|date_format:"%A, %B %e, %Y",$a.b')).toEqual({
    content: '$yesterday|date_format:"%A, %B %e, %Y",$a.b',
    variable: '$yesterday',
    filter: 'date_format',
    args: ['"%A, %B %e, %Y"', '$a.b']
  });
  expect(analyzeFilter('$yesterday|date_format:"%A, %B %e, %Y", $a.b,"mm,dd"')).toEqual({
    content: '$yesterday|date_format:"%A, %B %e, %Y", $a.b,"mm,dd"',
    variable: '$yesterday',
    filter: 'date_format',
    args: ['"%A, %B %e, %Y"', '$a.b', '"mm,dd"']
  });
});
test('test include', () => {
  expect(includeRegExp.test('{{include test.tpl}}')).toBe(true);
});
test('test variable check', () => {
  var check1 = 'a === 1';
  expect(getVariableList(check1)).toEqual(['a']);
  var check2 = 'a > b && m % 2 === 1 && !c || mmm';
  expect(getVariableList(check2)).toEqual(['a', 'b', 'm', 'c', 'mmm']);
  var check3 = 'list as name,index';
  expect(getVariableList(check3)).toEqual(['list', 'name', 'index']);
  var check4 = 'var i = 0; i < obj.list.length; i ++';
  expect(getVariableList(check4)).toEqual(['i', 'i', 'obj', 'i']);
  var check5 = 'm === \'b\' && n !== "b"';
  expect(getVariableList(check5)).toEqual(['m', 'n']);
});


