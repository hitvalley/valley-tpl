import analyzeTag from '../../../src/analyze-tag';

describe('test analyze tag spec', () => {
  it('test string', () => {
    let tpl = 'test';
    expect(analyzeTag(tpl)).toEqual([{
      type: 'string',
      content: 'test'
    }]);
  });
  it('test variable', () => {
    let tpl = '{{str}}';
    expect(analyzeTag(tpl)).toEqual([{
      type: 'var',
      content: 'str'
    }]);
  });
  it('test if', () => {
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
  it('test for', () => {
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
});

