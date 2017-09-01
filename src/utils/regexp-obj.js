const tagOpen = '{{';
const tagClose = '}}';

const vRegStr = '([$\\w.\\[\\]]+)';//变量正则字符串
const filterRegExp = new RegExp(`${vRegStr}(?:\\|${vRegStr}(?::(.*))?)?`);
const inputRegExp = /\s*("[^"]+"|[^,]+)\s*/g;

const tagRegExp = new RegExp(`${tagOpen}([^{}]*?)${tagClose}`, 'g');
const varRegExp = /[_A-Za-z][\w.]*/g;

function analyzeFilter(input) {
  if (!input) {
    return null;
  }
  let res = input.match(filterRegExp);
  if (!res) {
    return null;
  }
  let obj = {};
  obj.content = res && res[0];
  obj.variable = res && res[1];
  obj.filter = res && res[2];
  obj.args = [];
  if (res[3]) {
    obj.args = res[3].match(inputRegExp).map(item => (item || '').trim());
  }
  return obj;
}

// for include tag
const includeRegExp = new RegExp(`${tagOpen}include\\s+([\\w.\/]+)${tagClose}`, 'igm');

// for extend tag
const extendRegExp = new RegExp(`${tagOpen}extends\\s+([\\w.\/]+)${tagClose}`, 'igm');

// for block tag
const blockOpen = `${tagOpen}block\\s+(\\w+)${tagClose}`;
const blockClose = `${tagOpen}/block${tagClose}`;
const blockRegExp = new RegExp(`${blockOpen}(.*?)${blockClose}`, 'igm');

// for hack block
const hackOpen = `${tagOpen}hack${tagClose}`;
const hackClose = `${tagOpen}/hack${tagClose}`;
const hackBlockRegExp = new RegExp(`${hackOpen}((?:.|[\r\n])*?)${hackClose}`, 'igm');

export {
  filterRegExp,
  analyzeFilter,
  hackBlockRegExp,
  includeRegExp,
  extendRegExp,
  blockRegExp,
  tagRegExp,
  varRegExp
};
