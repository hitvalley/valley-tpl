var fs = require('fs');
var util = require('util');

var rInclude = /\{include\s+([^{}]+)\}/g;
var rRequire = /\{require\s+([^{}]+)\}/g;
var rIncludeFile = /file=('|")([^'"]+)\1/;
var rValue = /^("|')([^'"]+)\1$/;
var rComment = /\{\/\*([\r\n]|.)*?\*\/\}/;

var stringTpl = 'vtmpArr.push(\'%s\');';
var variableTpl = 'vtmpArr.push(%s);';
var assignTpl = 'var %s = vtmpInput.%s;';

function format(tpl) {
  var args = arguments;
  var index = 1;
  return tpl.replace(/%s/g, function(){
    return args[index ++];
  });
}

/**
 * 用于读取tpl文件
 */
function getTplContent(templateUrl) {
  return new Promise(function(resolve, reject){
    fs.readFile(templateUrl, {
      'encoding': 'utf8',
      'flag': 'r'
    }, function(err, data){
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

/**
 * 将模板放入obj中，达到一次读取，多次使用的目的
 */
function initTplObj(template) {
  var obj = {};
  return getTplContent(template).then(function(tpl){
    obj[template] = tpl;
    var includeList = getIncludeList(tpl);
    var promiseList = [];
    includeList.forEach(function(includeTpl, index){
      if (!obj[includeTpl]) {
        var promise = getTplContent(includeTpl).then(function(tpl){
          obj[includeTpl] = tpl;
          return obj;
        });
        promiseList.push(promise);
      }
    });
    return Promise.all(promiseList).then(function(){
      return obj;
    });
  });
}

/**
 * 根据{include}标签获得引入的标签名
 */
function getIncludeTplName(includeStr) {
  var includeRes = includeStr.match(rIncludeFile);
  return includeRes && includeRes[2];
}

/**
 * 获得模板中include的文件列表
 */
function getIncludeList(content){
  var includeList = [];
  var res;
  var rPluginTpl = /\{(?:include|require)\s+([^{}]+)\}/g;
  while (res = rPluginTpl.exec(content)) {
    if (!res[1]) {
      continue;
    }
    var arr = res[1].split(/\s+/g);
    arr[0] && includeList.push(arr[0]);
  }
  return includeList;
}

function tplToFuncStr(template, tplObj) {
  var template = tplObj[template]
                    .replace(rComment, '')
                    .replace(rRequire, function($0, $1){
                      return tplObj[$1];
                    })
                    .replace(/[\r\n]+/g, ' ');
  var res,
      start = 0,
      mark = 0,
      tags = [],
      str,
      content,
      rTag = /\{([^{}]+)\}/g,
      tagInfo,
      tags = ['var vtmpArr = [];'],
      funcStr;
  var iarr, itid, itpl, itmp, idata, iarr, ifunstr;
  while(res = rTag.exec(template)) {
    start = res.index;
    content = res[0];
    tagInfo = res[1];
    if (mark < res.index) {
      str = template.substring(mark, start);
      if (str.trim()) {
        tags.push(format(stringTpl, str));
      }
    }
    if (tagInfo) {
      tagArr = tagInfo.split(/\s+/g);
      switch(tagArr[0]) {
      case 'include':
        iarr = tagInfo.replace(/include\s+/, '').split(/\s+/g);
        itid = iarr.shift();
        ifunstr = tplToFuncStr(itid, tplObj);
        idata = iarr;
        itmp = '';
        iarr = [];
        idata.forEach(function(item){
          var arr = item.split('=');
          if (arr.length >= 2) {
            var key = arr[0];
            iarr.push(key + ':' + arr[1]);
            itmp += format(assignTpl, key, key);
          }
        });
        itpl = 'var vtmpFunc = function(vtmpInput){'
             +   itmp
             +   'var vtmpFunc = ' + ifunstr
             +   ';return vtmpFunc.call(this);'
             + '};'
             + 'vtmpArr.push(vtmpFunc.call(this, Object.assign(vtmpInput, {' + iarr.join(',') + '})));';
        tags.push(itpl);
        break;
      case 'if':
      case 'for':
        tags.push(tagInfo + '{');
        break;
      case 'else':
        tags.push('}' + tagInfo + '{');
        break;
      case 'elseif':
        tags.push('} else if ' + tagInfo.replace(/elseif/, '') + '{');
        break;
      case '/if':
      case '/for':
        tags.push('}');
        break;
      case 'js':
        tags.push(tagInfo.replace(/js /, '') + ';');
        break;
      default:
        tags.push(format(variableTpl, tagInfo));
      }
    }
    mark = start + content.length;
  }
  if (mark < template.length) {
    tags.push(format(stringTpl, template.substring(mark)));
  }
  tags.push('return vtmpArr.join("");');
  return 'function(){' + tags.join('\n') + '}';
}

function runTplAsFunction(funcStr, data, scope, returnString) {
  var funcList = [];
  Object.keys(data).forEach(function(key){
    funcList.push(format(assignTpl, key, key));
  });
  funcList.push('var vtmpFunction = ' + funcStr);
  funcList.push(';return vtmpFunction.call(this);');
  var func = new Function('vtmpInput', funcList.join(''));
  return returnString ? func : func.call(scope, data);
}

/**
 * 模板引擎
 */
function tpl(mainTid, data, tplObj, scope) {
  var template = tplObj[mainTid];
  var funcStr = tplToFuncStr(mainTid, tplObj);
  var html = runTplAsFunction(funcStr, data, scope);
  return html;
}

function vtpl(template, data, scope) {
  var scope = scope || global;
  return initTplObj(template).then(function(tplObj){
    var html = tpl(template, data, tplObj, scope);
    return html;
  });
}

module.exports = vtpl;
