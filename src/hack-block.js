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
