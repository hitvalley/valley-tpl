if (module && module.exports) {
  var fs = require('fs');
  Valley.getFileContent = function(path) {
    return new Promise(function(resolve, reject){
      fs.readFile(path, 'utf8', function(err, data){
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
} else {
  Valley.getFileContent = function(path) {
    return new Promise(function(resolve, reject){
      fetch(path, {
        headers: {
          "Content-Type": "text/html"
        }
      }).then(function(res){
        return res.text();
      });
    });
  };
}

Valley.getTplContent = function(tplId, tplPath) {
  if (this.tplObj[tplId]) {
    return Promise.resolve(this.tplObj[tplId]);
  }
  var tplPath = this.tplPath || tplPath || '';
  var tplUrl = tplPath + tplId;
  return this.getFileContent(tplUrl).then(function(template){
    Valley.tplObj[tplId] = template;
    return template;
  });
};

