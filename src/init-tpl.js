import sprintf from './utils/sprintf';
import {
  analyzeFilter,
  tagRegExp,
  varRegExp
} from './utils/regexp-obj';

const stringTpl = 'vtmpArr.push(\'%s\');';
const variableTpl = 'vtmpArr.push(typeof %s === "number" ? %s : (%s || ""));';
const variableTpl2 = 'vtmpArr.push(this.%s(%s));';
const variableTpl3 = '(function(){var args=[%s];args.unshift(%s);vtmpArr.push(this.%s(args));}());';

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
  let keyRegExp = new RegExp(Object.keys(checkObj).join('|'), 'ig');
  return str.replace(keyRegExp, function($0){
    return checkObj[$0];
  });
}

function isBlackVariable(key) {
  return varBlackList.indexOf(key) >= 0;
}

export default function initTplFunc(tags) {
  let tpls = ['var vtmpArr = [];'];
  tags.forEach(tag => {
    let content = (tag.content || '').trim();
    let res;
    switch (tag.type) {
    case 'string':
      tpls.push(sprintf(stringTpl, tag.content.replace(/[\r\n]+/g, ' ')));
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
      if (!content.match(/^\(.*\)$/)) {
        content = `(${content})`;
      }
      content = replaceJudgement(content);
      res = content.match(varRegExp);
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
    case 'js':
      tpls.push(`;${content};`);
      break;
    }
  });
  tpls.push('return vtmpArr.join("");');
  return tpls.join('\n');
}
