import vtpl from '../index';
import datestr from '../plugins/datestr';
import htmlspecialchars from '../plugins/htmlspecialchars';

vtpl.register('datestr', datestr);
vtpl.register('htmlspecialchars', htmlspecialchars);

class RenderModule extends ValleyModule {
  prepare() {
    this.use('prepareRender', async next => {
      this.context.registerv = vtpl.register;
      this.context.render = (tpl, data, scope) => {
        let html = vtpl(tpl, data, scope);
        return html;
      };
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
