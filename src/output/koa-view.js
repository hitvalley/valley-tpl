import vtpl from './node-plus';

let defaultConfig = {
  extension: 'tpl',
  encoding: 'utf-8'
};

export default function middlewareViews(viewPath, config) {
  let conf = Object.assign({}, defaultConfig, config, {
    viewPath: viewPath
  });
  vtpl.setConfig(conf);
  return function *view(next) {
    this.render = function *(tpl, data, filters) {
      try {
        let tplContent = yield vtpl.prepareTpl(tpl);
        data = Object.assign({}, data || {}, this.state || {});
        let html = vtpl(tplContent, data, filters || {});
        this.type = 'html';
        this.body = html;
      } catch(e) {
        throw e;
      }
    };
    yield next;
  }
}

