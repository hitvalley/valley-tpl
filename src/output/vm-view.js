import vtpl from './node';
import datestr from '../plugins/datestr';
import htmlspecialchars from '../plugins/htmlspecialchars';

import ValleyModule from 'valley-module';

vtpl.register('datestr', datestr);
vtpl.register('htmlspecialchars', htmlspecialchars);

let defaultConfig = {
  extension: 'tpl',
  encoding: 'utf-8'
}

class RenderModule extends ValleyModule {
  constructor(input) {
    input = input || {};
    let conf = Object.assign({}, defaultConfig, {
      viewPath: input.viewPath || './'
    });
    vtpl.setConfig(conf);
  }
  prepare() {
    this.use('prepareRender', async next => {
      this.context.register = vtpl.register;
      this.context.render = async (tpl, data, scope) => {
        let tplContent = await vtpl.prepareTpl(tpl).catch(e => {
          throw e;
        });
        let html = vtpl(tplContent, data || {}, scope || {});
        return html;
      };
      this.render = this.render || this.context.render;
      this.register = this.register || this.context.register;
      await next();
    });
  }
}

// export default function prepareRender(app, gscope) {
  // app.use('prepareRender', async next => {
    // app.context.register = app.register = vtpl.register;
    // app.context.render = app.render = (tpl, data, scope) => {
      // let html = vtpl(tpl, data, Object.assign({}, gscope, scope));
      // return html;
    // };
  // });
// }
export default RenderModule;
