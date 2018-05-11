var vtpl = (function () {
'use strict';

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
  // return tpl.split(/[\r\n]+/g).map(line => line.replace(/\*\*\*.*$/, '')).join('\n').replace(/\{\*(.|[\r\n])*?\*\}/, '').trim();
  return tpl.replace(/\*\*\*.*?(?:[\r\n]+|$)/g, '').replace(/\{\*(.|[\r\n])*?\*\}/g, '').trim();
}

var tagOpen = '{{';
var tagClose = '}}';

var vRegStr = '([$\\w.\\[\\]]+)'; //变量正则字符串
var filterRegExp = new RegExp(vRegStr + '(?:\\|' + vRegStr + '(?::(.*))?)?');
var inputRegExp = /\s*("[^"]+"|[^,]+)\s*/g;

function analyzeFilter(input) {
  if (!input) {
    return null;
  }
  var res = input.match(filterRegExp);
  if (!res) {
    return null;
  }
  var obj = {};
  obj.content = res && res[0];
  obj.variable = res && res[1];
  obj.filter = res && res[2];
  obj.args = [];
  if (res[3]) {
    obj.args = res[3].match(inputRegExp).map(function (item) {
      return (item || '').trim();
    });
  }
  return obj;
}

// for hack block
var hackOpen = tagOpen + 'hack' + tagClose;
var hackClose = tagOpen + '/hack' + tagClose;
var hackBlockRegExp = new RegExp(hackOpen + '((?:.|[\r\n])*?)' + hackClose, 'igm');

var judgeWords = '[\\+\\-\\*\\\/%!\\?\\|\\^&~<>=,\\(\\)\\[\\];]+';
var stopWords = 'break|case|catch|continue|default|delete|do|else|finally|for|function|if|in|instanceof|new|return|switch|this|throw|try|typeof|var|void|while|with|abstract|boolean|byte|char|class|const|debugger|double|enum|export|extends|final|float|goto|implements|import|int|interface|long|native|package|private|protected|public|short|static|super|synchronized|throws|transient|volatile|as|each|let|const';
var stopwordRegExp = new RegExp('\\s*\\b(?:' + stopWords + ')\\b\\s*|\\s*' + judgeWords + '\\s*', 'ig');
function getVariableList(content) {
  // console.log(content, content.split(stopwordRegExp))
  return content.split(stopwordRegExp).filter(function (item) {
    return item && !item.match(/^\d+$/) && !item.match(/^['"].*['"]$/) && !item.match(/^\.+$/);
  }).map(function (item) {
    return item.replace(/^\.+|\.+$/, '').split(/\./g)[0];
  });
}

function hackBlock(content, hackObj) {
  var mark = 0;
  return content.replace(hackBlockRegExp, function ($0, $1) {
    var key = '<<HACK_MARK_' + mark + '>>';
    hackObj[key] = $1;
    mark++;
    return key;
  });
}

var tagRegExp$1 = /\{\{([^{}]*?)\}\}/g;

/**
  tag info
    {{ variable }}
    {{if judgement}} ... {{elseif/elif judgement}} ... {{else}} ... {{/if}}
    {{each list as value, key}} ... {{/each}}
    {{for (let i = 0; i < list.length; i++)}} ... {{/for}}
    {{ set variable value }}
    {{ new variable value }}
*/

function analyzeTag(tpl) {
  var res = void 0;
  var str = void 0;
  var start = 0;
  var mark = 0;
  var content = void 0;
  var tagInfo = void 0;
  var tagName = void 0;
  var tagArr = void 0;
  var tags = [];
  var tagObj = {};
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
            // content: tagArr
          };
          break;
        case 'elseif':
        case 'elif':
          tagObj = {
            type: 'elseif',
            content: tagArr.join(' ')
            // content: tagArr
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
            // content: tagArr
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
        case 'set':
          tagObj = {
            type: 'set',
            content: tagArr.join(' ')
          };
          break;
        // case 'new':
        //   tagObj = {
        //     type: 'new',
        //     content: tagArr
        //   };
        //   break;
        case 'debug':
          break;
        // case 'debug':
        //   tagObj = {
        //     type: 'debug',
        //     content: tagInfo || '$data'
        //   };
        //   break;
        // case 'js':
        //   tagObj = {
        //     type: 'js',
        //     content: tagArr.join(' ')
        //   };
        //   break;
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

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var class2type = {};
var toString = class2type.toString;
var getProto = Object.getPrototypeOf;
var hasOwn = class2type.hasOwnProperty;
var fnToString = hasOwn.toString;
var ObjectFunctionString = fnToString.call(Object);

"Boolean Number String Function Array Date RegExp Object Error Symbol".split(" ").forEach(function (type) {
  class2type["[object " + type + "]"] = type.toLowerCase();
});

function type(obj) {
  if (obj == null) {
    return obj + "";
  }
  return (typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
}

function isFunction(input) {
  return type(input) === 'function';
}

function isPlainObject(input) {
  var proto = void 0;
  var Ctor = void 0;

  if (!obj || toString.call(obj) !== "[object Object]") {
    return false;
  }

  proto = getProto(obj);

  if (!proto) {
    return true;
  }

  Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
  return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
}

var strRegExp = /%s/g;
var dstrRegExp = /%(\d+)\$s/g;

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
  res = tpl.replace(dstrRegExp, function ($0, $1) {
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
  return res.replace(/%s/g, function () {
    return args.shift();
  });
}

var stringTpl = 'vtmpArr.push(\'%s\');';
var variableTpl = 'vtmpArr.push(typeof %s === "number" ? %s : (%s || ""));';
var variableTpl2 = '(function(scope){vtmpArr.push(scope.%s(%s));}(self));';
var variableTpl3 = '(function(scope){var args=[%s];args.unshift(%s);vtmpArr.push(scope.%s.apply(scope, args));}(self));';

var varBlackList = 'break case catch continue default delete do else finally for function if in instanceof new return switch this throw try typeof var void while with abstract boolean byte char class const debugger double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile'.split(' ');
function initTplFunc(tags) {
  var tpls = ['var vtmpArr = [];'];
  var buffer = [];
  // tpls.push('var __args_match_res = arguments.callee.toString().match(/function\s+.*?\((.*?)\)/);');
  // tpls.push('var __vargs = (__args_match_res && __args_match_res[0] || "").split(/\s*,\s*/);');
  tags.forEach(function (tag) {
    var content = (tag.content || '').trim();
    switch (tag.type) {
      case 'string':
        tpls.push(sprintf(stringTpl, tag.content.replace(/[\r\n]+/g, '\\n').replace(/'/g, "\\'")));
        break;
      case 'var':
        var filterObj = analyzeFilter(content);
        var localVariable = (filterObj.variable || '').split(/[\.\[\]]/)[0];
        if (buffer.indexOf(localVariable) < 0) {
          tpls.unshift('var ' + localVariable + ' = ' + localVariable + ';');
          buffer.push(localVariable);
        }
        if (!filterObj.filter) {
          tpls.push(sprintf(variableTpl, content));
        } else if (filterObj.args.length <= 0) {
          tpls.push(sprintf(variableTpl2, filterObj.filter, filterObj.variable));
        } else {
          var str = sprintf(variableTpl3, filterObj.args.join(','), filterObj.variable, filterObj.filter);
          tpls.push(str);
        }
        break;
      case 'if':
      case 'for':
      case 'elseif':
        getVariableList(content).forEach(function (str) {
          if (buffer.indexOf(str) < 0) {
            // tpls.unshift(`;if (${str} === undefined) { var ${str}; }`);
            tpls.unshift('var ' + str + ' = ' + str + ';');
            buffer.push(str);
          }
        });
        if (!content.match(/^\(.*\)$/)) {
          content = '(' + content + ')';
        }
        if (tag.type === 'elseif') {
          tpls.push('} else if ' + content + ' {');
        } else {
          tpls.push(';' + tag.type + ' ' + content + ' {');
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
        var tmps = content.split(/\s+as\s+/);
        if (tmps.length < 2) {
          throw '[each] 缺少输入参数';
        }
        var eachName = tmps[0];
        var eachInput = tmps[1].split(',');
        var eachValue = (eachInput[0] || '').trim();
        var eachKey = (eachInput[1] || '').trim();
        // let forArr = `${tmps[0]}.forEach(function(${tmps[1]}){`;
        var forObj = void 0;
        if (eachKey) {
          forObj = 'Object.keys(' + eachName + ').forEach(function(' + eachKey + '){var ' + eachValue + ' = ' + eachName + '[' + eachKey + '];';
        } else {
          forObj = 'Object.values(' + eachName + ').forEach(function(' + eachValue + '){';
        }
        tpls.push(forObj);
        break;
      case 'endeach':
        tpls.push('});');
        break;
      case 'set':
        // set variable
        var sets = content.split(/\s+/);
        var varStr = void 0;
        if (sets.length < 2) {
          throw '[set] 缺少输入参数';
        }
        if (sets[0].indexOf('#') === 0) {
          varStr = sets[0].replace(/^#/, '');
          tpls.push('var ' + varStr + ';');
        } else {
          varStr = sets[0];
          if (buffer.indexOf(varStr) < 0) {
            tpls.unshift('var ' + varStr + ';');
            buffer.push(varStr);
          }
        }
        tpls.push(varStr + ' = ' + sets[1] + ';');
        break;
      // case 'debug':
      //   tpls.push(`;window.${content} = arguments;`);
      //   break;
      // case 'js':
      //   tpls.push(`;${content};`);
      //   break;
    }
  });
  tpls.push('return vtmpArr.join("");');
  return tpls;
}

function replaceHack$1(content, hackObj) {
  var hackRegExp = new RegExp('<<HACK_MARK_\\d+>>', 'g');
  content = content.replace(hackRegExp, function ($0) {
    return hackObj[$0].replace(/[\r\n]/g, '\\n').replace(/'/g, "\\'");
  });
  return content;
}

function initScope() {
  var scopes = ['var $scope = {};'];
  scopes.push('$scope.now = Date.now();');
  scopes.push('var self = this;');
  return scopes;
}

function initFuncStr(tags, hackObj) {
  var scopes = initScope();
  var farr = scopes.concat(tags);
  var funstr = farr.join('\n');
  funstr = replaceHack$1(funstr, hackObj);
  return funstr;
}

function initFunction(funstr, keys, hackObj) {
  funstr = "try { " + funstr + " } catch(e) { console.error(e); }";
  try {
    return new Function(keys, funstr);
  } catch (e) {
    console.error(funstr);
    console.error(e);
  }
}

function extend() {
  var options,
      name,
      src,
      copy,
      copyIsArray,
      clone,
      target = arguments[0] || {},
      i = 1,
      length = arguments.length,
      deep = false;

  if (typeof target === "boolean") {
    deep = target;

    target = arguments[i] || {};
    i++;
  }

  if ((typeof target === "undefined" ? "undefined" : _typeof(target)) !== "object" && !isFunction(target)) {
    target = {};
  }

  if (i === length) {
    target = this;
    i--;
  }

  for (; i < length; i++) {

    if ((options = arguments[i]) != null) {

      for (name in options) {
        src = target[name];
        copy = options[name];

        if (target === copy) {
          continue;
        }

        if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {

          if (copyIsArray) {
            copyIsArray = false;
            clone = src && Array.isArray(src) ? src : [];
          } else {
            clone = src && isPlainObject(src) ? src : {};
          }

          target[name] = extend(deep, clone, copy);

          // Don't bring in undefined values
        } else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }

  // Return the modified object
  return target;
}

var cacheObj = {};

function ValleyTpl(tpl, data, scope) {
  var res = void 0;

  if (cacheObj[tpl] && ValleyTpl.useCache) {
    // 命中缓存
    res = cacheObj[tpl];
  } else {
    // 去掉注释
    res = removeComments(tpl);

    // 挂起页面中不需要解析的块
    var hackObj = {};
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

  var keys = Object.keys(data);
  var values = Object.values(data);

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
ValleyTpl.register = function (fname, func) {
  this.scope[fname] = func;
};

// 取消全局注册的函数
ValleyTpl.unregister = function (fname) {
  delete this.scope[fname];
};

var DefaultTPL = 'Y-M-D H:I:S';

function datestr(timestamp, tpl) {
  var date = void 0;
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
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  var obj = {
    'Y': date.getFullYear(),
    'y': date.getYear(),
    'M': month < 10 ? '0' + month : month,
    'm': month,
    'D': day < 10 ? '0' + day : day,
    'd': day,
    'H': hour < 10 ? '0' + hour : hour,
    'h': hour,
    'I': minute < 10 ? '0' + minute : minute,
    'i': minute,
    'S': second < 10 ? '0' + second : second,
    's': second
  };
  return tpl.replace(/[YMDHISymdhis]/g, function ($0) {
    return obj[$0];
  });
}

var escapeHash = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2f;'
};

var escapeRegExp = new RegExp('[&<>"\']', 'igm');

function htmlspecialchars(str) {
  return typeof str === 'string' ? str.replace(escapeRegExp, function ($0) {
    return escapeHash[$0];
  }) : str;
}

ValleyTpl.register('datestr', datestr);
ValleyTpl.register('htmlspecialchars', htmlspecialchars);

return ValleyTpl;

}());