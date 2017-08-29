import {
  extendRegExp,
  blockRegExp
} from './regexp-obj';
import getContent from './include-tpl';

async function extendTpl(tplName, config) {
  let content = await getContent(tplName, config);
  let extendObj = {};
  let extendFile;
  let extendRes = extendRegExp.exec(content);
  if (extendRes && extendRes[1]) {
    extendFile = extendRes[1];
    content = content.replace(extendRegExp, '');
    let res;
    while (res = blockRegExp.exec(content)) {
      let key = res[1];
      let inner = res[2];
      extendObj[key] = inner || '';
    }
    let extendContent = await getContent(extendFile, config);
    content = extendContent.replace(blockRegExp, function($0, $1, $2){
      return extendObj[$1] || $2;
    });
  }
  return content;
}

export default extendTpl;

