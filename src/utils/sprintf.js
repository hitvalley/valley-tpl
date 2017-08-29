import {
  type
} from './type';

const strRegExp = /%s/g;
const dstrRegExp = /%(\d+)\$s/g;

export default function sprintf() {
  if (arguments.length < 2) {
    throw 'Too few arguments';
  }
  var tpl = arguments[0];
  var args, res, arr;
  if (type(arguments[1]) === 'array') {
    args = arguments[1];
  } else {
    args = Array.prototype.slice.call(arguments, 1);
  }
  if (args.length <= 0) {
    throw 'Too few arguments';
  }
  res = tpl.replace(dstrRegExp, function($0, $1){
    var index = $1 - 1;
    if (args[index]) {
      return args[index];
    } else {
      throw 'Tow few arguments';
    }
  });
  arr = res.match(strRegExp) || [];
  if (args.length === 1) {
    return res.replace(strRegExp, args[0]);
  } else if (arr.length > args.length) {
    throw 'Too few arguments';
  }
  return res.replace(/%s/g, function(){
    return args.shift();
  });
}

