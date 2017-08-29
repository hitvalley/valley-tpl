import {
  analyzeFilter,
  includeRegExp
} from '../../../src/utils/regexp-obj';

describe('test expreg spec', () => {
  it('test filter', () => {
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
  it('test include', () => {
    expect(includeRegExp.test('{{include test.tpl}}')).toBe(true);
  });
});
