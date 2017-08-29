import vtpl from './index';
import prepareTpl from './prepare-tpl';

vtpl.config = {
  encoding: 'utf-8',
  viewPath: __dirname,
  extension: 'tpl',
  withExtend: true,
  inBrowser: (function() {
    return this !== undefined && this === this.window;
  }())
};

// 设置配置
vtpl.setConfig = function(conf) {
  let self = this;
  Object.keys(self.config).forEach(key => {
    if (conf[key]) {
      self.config[key] = typeof conf[key] === 'object' ? extend({}, self.config[key], conf[key]) : conf[key];
    }
  });
};


vtpl.prepareTpl = function(tplName){
  return prepareTpl(tplName, this.config);
};

export default vtpl;
