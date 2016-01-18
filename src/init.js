function getIncludeList(templateContent) {
  var includeList = [];
  var res;
  var rPluginTpl = /\{(?:include|require)\s+([^{}]+)\}/g;
  while (res = rPluginTpl.exec(templateContent)) {
    if (!res[1]) {
      continue;
    }
    var arr = res[1].split(/\s+/g);
    arr[0] && includeList.push(arr[0]);
  }
  return includeList;
}


Valley.initTplObj = function(mainTid) {
  var self = this;
  return this.getTplContent(mainTid).then(function(template){
    var includeList = getIncludeList(template);
    var jobs = [];
    includeList.forEach(function(includeId, index){
      if (!self.tplObj[includeId]) {
        jobs.push(self.getTplContent(includeId));
      }
    });
    return Promise.all(jobs).then(function(){
      return self.tplObj;
    });
  });
}

