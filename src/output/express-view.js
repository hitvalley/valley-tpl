import vtpl from './node-plus';

let defaultConfig = {
  extension: 'tpl',
  encoding: 'utf-8',
  viewPath: 'views'
};

function renderFile(tpl, options, callback) {
  let settings = (options || {}).settings;
  let extension = settings['view extension'] || settings['view engine'] || defaultConfig.extension;
  let encoding = settings['view encoding'] || defaultConfig.encoding;
  let viewPath = settings.views || defaultConfig.viewPath;
  let config = {
    extension,
    encoding,
    viewPath
  };
  let filters = options.__filters || {};
  delete options.settings;
  delete options.__filters;
  let extensionRegExp = new RegExp(`\.${settings['view engine']}$`, 'i');
  vtpl.prepareTpl(tpl.replace(extensionRegExp, ''), config).then(tplContent => {
    let html = vtpl(tplContent, options || {}, filters);
    callback(null, html);
  }).catch(err => callback(err));
}

let __express = renderFile;

export default {
  __express,
  renderFile
};
