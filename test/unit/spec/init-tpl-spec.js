import initTpl from '../../../src/init-tpl';

describe('test init tpl spec', () => {
  it ('test string', () => {
    let tags = [{
      type: 'string',
      content: 'test'
    }];
    expect(initTpl(tags)).toEqual('var vtmpArr = [];\nvtmpArr.push(\'test\');\nreturn vtmpArr.join("");');
  });
  it ('test variable', () => {
    let tags = [{
      type: 'var',
      content: 'str'
    }];
    expect(initTpl(tags, ["str"])).toEqual('var vtmpArr = [];\nvtmpArr.push(typeof str === "number" ? str : (str || ""));\nreturn vtmpArr.join("");');
    let tags2 = [{
      type: 'var',
      content: 'timestamp|date_str'
    }];
    expect(initTpl(tags2)).toEqual('var vtmpArr = [];\nvtmpArr.push(this.date_str(timestamp));\nreturn vtmpArr.join("");');
    // console.log(initTpl(tags2))
    let tags3 = [{
      type: 'var',
      content: 'timestamp|date_str:1,"test",m,"info,info2"'
    }];
    expect(initTpl(tags3)).toEqual('var vtmpArr = [];\n(function(){var args=[1,"test",m,"info,info2"];args.unshift(timestamp);vtmpArr.push(this.date_str(args));}());\nreturn vtmpArr.join("");');
  });
  it('test if', () => {
    let tags = [{
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
    }];
    let res = [
      'var vtmpArr = [];',
      ';if (test === 1) {',
      'vtmpArr.push(\'yes\');',
      '} else {',
      'vtmpArr.push(\'no\');',
      '}',
      'return vtmpArr.join("");'
    ];
    expect(initTpl(tags)).toEqual(res.join('\n'));
  });
  it('test for', () => {
    let tags = [{
      type: 'for',
      content: 'var i = 0; i < 10; i ++'
    }, {
      type: 'var',
      content: 'arr[i]'
    }, {
      type: 'endfor'
    }];
    let res = [
      'var vtmpArr = [];',
      ';for (var i = 0; i < 10; i ++) {',
      'vtmpArr.push(typeof arr[i] === "number" ? arr[i] : (arr[i] || ""));',
      '}',
      'return vtmpArr.join("");'
    ];
    expect(initTpl(tags)).toEqual(res.join('\n'));
    // expect(initTpl(tags, ['test'])).toEqual(res2.join('\n'));
  });
});

