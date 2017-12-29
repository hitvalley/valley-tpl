(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.RenderModule = factory());
}(this, (function () { 'use strict';

/**
 * 去掉注释
 *    行注释：*** -> //
 *    块注释：{* ... *}
 *    input: tpl
 *    output: 去掉注释的tpl
 */
function removeComments(tpl) {
  if (!tpl) {
    return '';
  }
  return tpl.split(/[\r\n]+/g).map(line => line.replace(/\*\*\*.*$/, '')).join('\n').replace(/\{\*(.|[\r\n])*?\*\}/, '').trim();
}

const tagOpen = '{{';
const tagClose = '}}';

const vRegStr = '([$\\w.\\[\\]]+)';//变量正则字符串
const filterRegExp = new RegExp(`${vRegStr}(?:\\|${vRegStr}(?::(.*))?)?`);
const inputRegExp = /\s*("[^"]+"|[^,]+)\s*/g;

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

// for hack block
const hackOpen = `${tagOpen}hack${tagClose}`;
const hackClose = `${tagOpen}/hack${tagClose}`;
const hackBlockRegExp = new RegExp(`${hackOpen}((?:.|[\r\n])*?)${hackClose}`, 'igm');

const judgeWords = '[\\+\\-\\*\\\/%!\\?\\|\\^&~<>=,\\(\\)\\[\\];]+';
const stopWords = 'break|case|catch|continue|default|delete|do|else|finally|for|function|if|in|instanceof|new|return|switch|this|throw|try|typeof|var|void|while|with|abstract|boolean|byte|char|class|const|debugger|double|enum|export|extends|final|float|goto|implements|import|int|interface|long|native|package|private|protected|public|short|static|super|synchronized|throws|transient|volatile|as|each|let|const';
const stopwordRegExp = new RegExp(`\\s*\\b(?:${stopWords})\\b\\s*|\\s*${judgeWords}\\s*`, 'ig');
function getVariableList(content) {
  // console.log(content, content.split(stopwordRegExp))
  return content.split(stopwordRegExp).filter(item => item && !item.match(/^\d+$/) && !item.match(/^['"].*['"]$/)).map(item => item.split(/\./g)[0]);
}

function hackBlock(content, hackObj) {
  let res;
  let mark = 0;
  return content.replace(hackBlockRegExp, function($0, $1){
    let key = `<<HACK_MARK_${mark}>>`;
    hackObj[key] = $1;
    mark ++;
    return key;
  });
}

const tagRegExp$1 = /\{\{([^{}]*?)\}\}/g;

function analyzeTag(tpl) {
  let res;
  let str;
  let start = 0;
  let mark = 0;
  let content;
  let tagInfo;
  let tagName;
  let tagArr;
  let tags = [];
  let tagObj = {};
  while (res = tagRegExp$1.exec(tpl)) {
    start = res.index;
    content = res[0];
    tagInfo = res[1];
    if (mark < start) {
      str = tpl.substring(mark, start);
      str && tags.push({
        type: 'string',
        content: str
      });
    }
    if (tagInfo) {
      tagArr = tagInfo.split(/\s+/);
      tagName = tagArr.shift();
      switch (tagName) {
      case 'if':
        tagObj = {
          type: 'if',
          content: tagArr.join(' ')
        };
        break;
      case 'elseif':
      case 'elif':
        tagObj = {
          type: 'elseif',
          content: tagArr.join(' ')
        };
        break;
      case 'else':
        tagObj = {
          type: 'else'
        };
        break;
      case '/if':
        tagObj = {
          type: 'endif'
        };
        break;
      case 'for':
      case 'each':
        tagObj = {
          type: tagName,
          content: tagArr.join(' ')
        };
        break;
      case '/each':
        tagObj = {
          type: 'endeach'
        };
        break;
      case '/for':
        tagObj = {
          type: 'endfor'
        };
        break;
      case 'js':
        tagObj = {
          type: 'js',
          content: tagArr.join(' ')
        };
        break;
      default:
        tagObj = {
          type: 'var',
          content: tagInfo //{{}}包裹的部分都是变量
        };
      }
      tags.push(tagObj);
    }
    mark = start + content.length;
  }
  if (mark < tpl.length) {
    tags.push({
      type: 'string',
      content: tpl.substring(mark)
    });
  }
  return tags;
}

let class2type = {};
let toString = class2type.toString;
let getProto = Object.getPrototypeOf;
let hasOwn = class2type.hasOwnProperty;
let fnToString = hasOwn.toString;
let ObjectFunctionString = fnToString.call( Object );

"Boolean Number String Function Array Date RegExp Object Error Symbol".split(" ").forEach(function(type){
  class2type["[object " + type + "]"] = type.toLowerCase();
});

function type(obj) {
  if (obj == null) {
    return obj + "";
  }
  return typeof obj === "object" || typeof obj === "function" ?
      class2type[ toString.call(obj) ] || "object" : typeof obj;
}

function isFunction(input) {
  return type(input) === 'function';
}

function isPlainObject(input) {
  let proto;
  let Ctor;

  if ( !obj || toString.call( obj ) !== "[object Object]" ) {
    return false;
  }

  proto = getProto( obj );

  if ( !proto ) {
    return true;
  }

  Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
  return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
}

const strRegExp = /%s/g;
const dstrRegExp = /%(\d+)\$s/g;

function sprintf() {
  if (arguments.length < 2) {
    throw 'Too few arguments';
  }
  var tpl = arguments[0];
  var args, res, arr;
  if (type(arguments[1]) === 'array') {
    args = arguments[1];
  } else {
    args = Array.prototype.slice.call(arguments, 1);
  }
  if (args.length <= 0) {
    throw 'Too few arguments';
  }
  res = tpl.replace(dstrRegExp, function($0, $1){
    var index = $1 - 1;
    if (args[index]) {
      return args[index];
    } else {
      throw 'Tow few arguments';
    }
  });
  arr = res.match(strRegExp) || [];
  if (args.length === 1) {
    return res.replace(strRegExp, args[0]);
  } else if (arr.length > args.length) {
    throw 'Too few arguments';
  }
  return res.replace(/%s/g, function(){
    return args.shift();
  });
}

const stringTpl = 'vtmpArr.push(\'%s\');';
const variableTpl = 'vtmpArr.push(typeof %s === "number" ? %s : (%s || ""));';
const variableTpl2 = '(function(scope){vtmpArr.push(scope.%s(%s));}(self));';
const variableTpl3 = '(function(scope){var args=[%s];args.unshift(%s);vtmpArr.push(scope.%s.apply(scope, args));}(self));';

const varBlackList = 'break case catch continue default delete do else finally for function if in instanceof new return switch this throw try typeof var void while with abstract boolean byte char class const debugger double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile'.split(' ');
function initTplFunc(tags) {
  let tpls = ['var vtmpArr = [];'];
  let buffer = [];
  // tpls.push('var __args_match_res = arguments.callee.toString().match(/function\s+.*?\((.*?)\)/);');
  // tpls.push('var __vargs = (__args_match_res && __args_match_res[0] || "").split(/\s*,\s*/);');
  tags.forEach(tag => {
    let content = (tag.content || '').trim();
    let res;
    switch (tag.type) {
    case 'string':
      tpls.push(sprintf(stringTpl, tag.content.replace(/[\r\n]+/g, '\\n').replace(/'/g, "\\'")));
      break;
    case 'var':
      let filterObj = analyzeFilter(content);
      let localVariable = (filterObj.variable || '').split(/[\.\[\]]/)[0];
      if (buffer.indexOf(localVariable) < 0) {
        tpls.unshift(`var ${localVariable} = ${localVariable};`);
        buffer.push(localVariable);
      }
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
          // tpls.unshift(`;if (${str} === undefined) { var ${str}; }`);
          tpls.unshift(`var ${str} = ${str};`);
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
    // case 'js':
      // tpls.push(`;${content};`);
      // break;
    }
  });
  tpls.push('return vtmpArr.join("");');
  return tpls;
}

function replaceHack$1(content, hackObj) {
  let hackRegExp = new RegExp(`<<HACK_MARK_\\d+>>`, 'g');
  content = content.replace(hackRegExp, $0 => {
    return hackObj[$0].replace(/[\r\n]/g, '\\n').replace(/'/g, "\\'");
  });
  return content;
}

function initScope() {
  let scopes = ['var $scope = {};'];
  scopes.push('$scope.now = Date.now();');
  scopes.push('var self = this;');
  return scopes;
}

function initFuncStr(tags, hackObj) {
  let scopes = initScope();
  let farr = scopes.concat(tags);
  let funstr = farr.join('\n');
  funstr = replaceHack$1(funstr, hackObj);
  return funstr;
}

function initFunction(funstr, keys, hackObj) {
  funstr = `try { ${funstr} } catch(e) { console.error(e); }`;
  try {
    return new Function(keys, funstr);
  } catch(e) {
    console.error(funstr);
    console.error(e);
  }
}

function extend() {
  var options, name, src, copy, copyIsArray, clone,
      target = arguments[ 0 ] || {},
      i = 1,
      length = arguments.length,
      deep = false;

  if ( typeof target === "boolean" ) {
    deep = target;

    target = arguments[ i ] || {};
    i++;
  }

  if ( typeof target !== "object" && !isFunction( target ) ) {
    target = {};
  }

  if ( i === length ) {
    target = this;
    i--;
  }

  for ( ; i < length; i++ ) {

    if ( ( options = arguments[ i ] ) != null ) {

      for ( name in options ) {
        src = target[ name ];
        copy = options[ name ];

        if ( target === copy ) {
          continue;
        }

        if ( deep && copy && ( isPlainObject( copy ) ||
          ( copyIsArray = Array.isArray( copy ) ) ) ) {

          if ( copyIsArray ) {
            copyIsArray = false;
            clone = src && Array.isArray( src ) ? src : [];

          } else {
            clone = src && isPlainObject( src ) ? src : {};
          }

          target[ name ] = extend( deep, clone, copy );

        // Don't bring in undefined values
        } else if ( copy !== undefined ) {
          target[ name ] = copy;
        }
      }
    }
  }

  // Return the modified object
  return target;
}

let cacheObj = {};

function ValleyTpl(tpl, data, scope) {
  let res;

  if (cacheObj[tpl] && ValleyTpl.useCache) {
    // 命中缓存
    res = cacheObj[tpl];
  } else {
    // 去掉注释
    res = removeComments(tpl);

    // 挂起页面中不需要解析的块
    let hackObj = {};
    res = hackBlock(res, hackObj);

    // 解析标签
    res = analyzeTag(res);

    // 生成模板语言
    res = initTplFunc(res);

    // 生成模板函数
    res = initFuncStr(res, hackObj);

    if (ValleyTpl.useCache) {
      cacheObj[tpl] = res;
    }
  }

  if (!data) {
    return res;
  }

  let keys = Object.keys(data);
  let values = Object.values(data);

  scope = scope ? extend({}, ValleyTpl.scope, scope) : ValleyTpl.scope;

  // 生成模板函数
  res = initFunction(res, keys);

  // 执行模板函数
  res = res.apply(scope, values);

  return res;
}

ValleyTpl.scope = {};
ValleyTpl.useCache = true;

// 注册函数到全局范围
ValleyTpl.register = function(fname, func) {
  this.scope[fname] = func;
};

// 取消全局注册的函数
ValleyTpl.unregister = function(fname) {
  delete this.scope[fname];
};

const DefaultTPL = 'Y-M-D H:I:S';

function datestr(timestamp, tpl) {
  let date;
  if (typeof timestamp === 'string' && isNaN(timestamp)) {
    tpl = timestamp;
    timestamp = new Date();
  }
  if (!timestamp) {
    date = new Date();
  } else if (timestamp.toString().length === 10) {
    date = new Date(timestamp * 1000);
  } else {
    date = new Date(timestamp);
  }
  tpl = tpl || DefaultTPL;
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();
  let obj = {
    'Y': date.getFullYear(),
    'y': date.getYear(),
    'M': month < 10 ? ('0' + month) : month,
    'm': month,
    'D': day < 10 ? ('0' + day) : day,
    'd': day,
    'H': hour < 10 ? ('0' + hour) : hour,
    'h': hour,
    'I': minute < 10 ? ('0' + minute) : minute,
    'i': minute,
    'S': second < 10 ? ('0' + second) : second,
    's': second
  };
  return tpl.replace(/[YMDHISymdhis]/g, $0 => obj[$0]);
}

const escapeHash = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2f;'
};

const escapeRegExp = new RegExp('[&<>"\']', 'igm');

function htmlspecialchars(str) {
  return typeof str === 'string' ? str.replace(escapeRegExp, $0 => escapeHash[$0]) : str;
}

ValleyTpl.register('datestr', datestr);
ValleyTpl.register('htmlspecialchars', htmlspecialchars);

class RenderModule extends ValleyModule {
  prepare() {
    this.use('prepareRender', async next => {
      this.context.registerv = ValleyTpl.register;
      this.context.render = (tpl, data, scope) => {
        let html = ValleyTpl(tpl, data, scope);
        return html;
      };
      await next();
    });
  }
}

return RenderModule;

})));
