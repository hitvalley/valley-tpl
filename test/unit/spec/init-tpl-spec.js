import initTpl from '../../../src/init-tpl';

describe('test init tpl spec', () => {
  it ('test string', () => {
    let tags = [{
      type: 'string',
      content: 'test'
    }];
    let res = [
      'var vtmpArr = [];',
      'vtmpArr.push(\'test\');',
      'return vtmpArr.join("");'
    ];
    expect(initTpl(tags)).toEqual(res);
  });
  it ('test variable', () => {
    let res;
    let tags = [{
      type: 'var',
      content: 'str'
    }];
    res = [
      'var vtmpArr = [];',
      'vtmpArr.push(typeof str === "number" ? str : (str || ""));',
      'return vtmpArr.join("");'
    ];
    expect(initTpl(tags, ["str"])).toEqual(res);
    let tags2 = [{
      type: 'var',
      content: 'timestamp|date_str'
    }];
    res = [
      'var vtmpArr = [];',
      'vtmpArr.push(this.date_str(timestamp));',
      'return vtmpArr.join("");'
    ];
    expect(initTpl(tags2)).toEqual(res);
    // console.log(initTpl(tags2))
    let tags3 = [{
      type: 'var',
      content: 'timestamp|date_str:1,"test",m,"info,info2"'
    }];
    res = [
      'var vtmpArr = [];',
      '(function(scope){var args=[1,"test",m,"info,info2"];args.unshift(timestamp);vtmpArr.push(scope.date_str.apply(scope, args));}(this));',
      'return vtmpArr.join("");'
    ];
    expect(initTpl(tags3)).toEqual(res);
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
    expect(initTpl(tags)).toEqual(res);
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
    expect(initTpl(tags)).toEqual(res);
  });
  it('test for obj', () => {
    let tags = [{
      type: 'for',
      content: 'var i in obj'
    }, {
      type: 'var',
      content: 'obj[i].key'
    }, {
      type: 'var',
      content: 'obj[i].value'
    }, {
      type: 'endfor'
    }];
    let res = [
      'var vtmpArr = [];',
      ';for (var i in obj) {',
      'vtmpArr.push(typeof obj[i].key === "number" ? obj[i].key : (obj[i].key || ""));',
      'vtmpArr.push(typeof obj[i].value === "number" ? obj[i].value : (obj[i].value || ""));',
      '}',
      'return vtmpArr.join("");'
    ];
    expect(initTpl(tags)).toEqual(res);
  });
});

