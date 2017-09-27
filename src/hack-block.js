import {
  hackBlockRegExp
} from './utils/regexp-obj';

export default function hackBlock(content, hackObj) {
  let res;
  let mark = 0;
  return content.replace(hackBlockRegExp, function($0, $1){
    let key = `<<HACK_MARK_${mark}>>`;
    hackObj[key] = $1;
    mark ++;
    return key;
  });
}

function replaceHack(tags, hackObj) {
  let hackRegExp = new RegExp(`<<HACK_MARK_\\d+>>`, 'g');
  content = content.replace(hackRegExp, $0 => {
    return hackObj[$0].replace(/[\r\n]/g, '\\n').replace(/'/g, "\\'");
  });
  return content;
}

