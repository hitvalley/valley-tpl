import sprintf from './utils/sprintf';
import {
  analyzeFilter,
  tagRegExp,
  varRegExp,
  getVariableList
} from './utils/regexp-obj';

const stringTpl = 'vtmpArr.push(\'%s\');';
const variableTpl = 'vtmpArr.push(typeof %s === "number" ? %s : (%s || ""));';
const variableTpl2 = '(function(scope){vtmpArr.push(scope.%s(%s));}(self));';
const variableTpl3 = '(function(scope){var args=[%s];args.unshift(%s);vtmpArr.push(scope.%s.apply(scope, args));}(self));';

const varBlackList = 'break case catch continue default delete do else finally for function if in instanceof new return switch this throw try typeof var void while with abstract boolean byte char class const debugger double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile'.split(' ');
const checkObj = {
  'eq': '==',
  'ne': '!=',
  'neq': '!=',
  'gt': '>',
  'gte': '>=',
  'ge': '>=',
  'lt': '<',
  'lte': '<=',
  'le': '<=',
  'is even': '%2 == 0',
  'is odd': '%2 == 1',
  'is not even': '%2 != 0',
  'is not odd': '%2 != 1',
  'and': '&&',
  'or': '||',
  'not': '!',
  'mod': '%',
};

const vRegStr = '[$\\w]+';//变量正则字符串
const iRegStr = '("[^"]+"|[^,]+)';//输入正则字符串
// const filterRegExp = new RegExp(`${vRegStr}\|${vRegStr}(?:\\:${iRegStr}(?:,${iRegStr}))?`);

function replaceJudgement(str) {
  let keyRegExp = new RegExp(Object.keys(checkObj).join('\\s+|\\s+'), 'ig');
  return str.replace(keyRegExp, function($0){
    return checkObj[$0];
  });
}

function isBlackVariable(key) {
  return varBlackList.indexOf(key) >= 0;
}

export default function initTplFunc(tags, keys) {
  let tpls = ['var vtmpArr = [];'];
  let buffer = keys || [];
  tags.forEach(tag => {
    let content = (tag.content || '').trim();
    let res;
    switch (tag.type) {
    case 'string':
      tpls.push(sprintf(stringTpl, tag.content.replace(/[\r\n]+/g, '\\n').replace(/'/g, "\\'")));
      break;
    case 'var':
      let filterObj = analyzeFilter(content);
      if (!filterObj.filter) {
        tpls.push(sprintf(variableTpl, content));
      } else if (filterObj.args.length <= 0) {
        tpls.push(sprintf(variableTpl2, filterObj.filter, filterObj.variable));
      } else {
        let str = sprintf(variableTpl3, filterObj.args.join(','), filterObj.variable, filterObj.filter);
        tpls.push(str);
      }
      break;
    case 'if':
    case 'for':
    case 'elseif':
      getVariableList(content).forEach(function(str){
        if (buffer.indexOf(str) < 0) {
          tpls.push(`;if (${str} === undefined) { var ${str}; }`);
          buffer.push(str);
        }
      });
      if (!content.match(/^\(.*\)$/)) {
        content = `(${content})`;
      }
      if (tag.type === 'elseif') {
        tpls.push(`} else if ${content} {`);
      } else {
        tpls.push(`;${tag.type} ${content} {`);
      }
      break;
    case 'else':
      tpls.push('} else {');
      break;
    case 'endif':
    case 'endfor':
      tpls.push('}');
      break;
    case 'each':
      // each语法: {{each list as value, key}}
      let tmps = content.split(/\s+as\s+/);
      if (tmps.length < 2) {
        throw 'each缺少输入参数';
      }
      let eachName = tmps[0];
      let eachInput = tmps[1].split(',');
      let eachValue = (eachInput[0] || '').trim();
      let eachKey = (eachInput[1] || '').trim();
      // let forArr = `${tmps[0]}.forEach(function(${tmps[1]}){`;
      let forObj;
      if (eachKey) {
        forObj = `Object.keys(${eachName}).forEach(function(${eachKey}){var ${eachValue} = ${eachName}[${eachKey}];`;
      } else {
        forObj = `Object.values(${eachName}).forEach(function(${eachValue}){`;
      }
      tpls.push(forObj);
      break;
    case 'endeach':
      tpls.push('});');
      break;
    case 'js':
      tpls.push(`;${content};`);
      break;
    }
  });
  tpls.push('return vtmpArr.join("");');
  return tpls;
}
