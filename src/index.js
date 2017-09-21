import removeComments from './remove-comments';
import hackBlock from './hack-block';
import analyzeTag from './analyze-tag';
import initTpl from './init-tpl';
import initFunc from './init-func';
import extend from './utils/extend';

function ValleyTpl(tpl, data, scope) {
  let res;
  let keys = Object.keys(data);
  let values = Object.values(data);

  scope = scope ? extend({}, ValleyTpl.scope, scope) : ValleyTpl.scope;

  // 去掉注释
  res = removeComments(tpl);

  // 挂起页面中不需要解析的块
  let hackObj = {};
  res = hackBlock(res, hackObj);

  // 解析标签
  res = analyzeTag(res);

  // 生成模板语言
  res = initTpl(res, keys);

  // 生成模板函数
  res = initFunc(res, keys, hackObj);

  // 执行模板函数
  res = res.apply(scope, values);
  return res;
}

ValleyTpl.scope = {};

// 注册函数到全局范围
ValleyTpl.register = function(fname, func) {
  this.scope[fname] = func;
};

// 取消全局注册的函数
ValleyTpl.unregister = function(fname) {
  delete this.scope[fname];
};

export default ValleyTpl;
