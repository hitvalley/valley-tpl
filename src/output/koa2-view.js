import vtpl from './node-plus';

let defaultConfig = {
  extension: 'tpl',
  encoding: 'utf-8'
}

export default function viewMiddleware(viewPath, config) {
  let conf = Object.assign({}, defaultConfig, config, {
    viewPath: viewPath
  });
  vtpl.setConfig(conf);
  return async (ctx, next) => {
    if (ctx.render) {
      return await next();
    }
    ctx.render = async (tpl, data, filters) => {
      let tplContent = await vtpl.prepareTpl(tpl).catch(e => {
        throw e;
      });
      try {
        data = Object.assign({}, data || {}, ctx.state || {});
        let html = vtpl(tplContent, data, filters || {});
        ctx.type = 'text/html'
        ctx.body = html;
      } catch(e) {
        throw e;
      }
    };
    return await next();
  };
};

