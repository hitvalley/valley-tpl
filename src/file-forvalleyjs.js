Valley.getTplContent = function(tplId, tplPath) {
  if (this.tplObj[tplId]) {
    return Promise.resolve(this.tplObj[tplId]);
  }
  var viewPath = tplPath || this._config.viewPath;
  var viewExt = this._config.viewExt || '.html';
  var viewUrl = viewPath + tplId + viewExt;
  return this.getFileContent(viewUrl).then(function(template){
    Valley.tplObj[tplId] = template;
    return template;
  });
};

