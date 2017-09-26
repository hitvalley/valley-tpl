import fs from 'fs';
import { join } from 'path';

export default function getContent(tplName, config) {
  let encoding = config.encoding || 'utf-8';
  let viewPath = config.viewPath || __dirname;
  let extension = config.extension || 'tpl';

  return new Promise(function(resolve, reject){
    let viewName = `${tplName}.${extension}`;
    if (viewName.indexOf('/') !== 0) {
      viewName = join(viewPath, viewName);
    }
    fs.readFile(viewName, {
      encoding: encoding,
      flag: 'r'
    }, (err, data) => {
      err ? reject(err) : resolve(data);
    });
  });
}

