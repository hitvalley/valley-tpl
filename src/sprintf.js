// valley sprintf
var rStr = /%s/g;
var rDStr = /%(\d+)\$s/g;

function sprintf() {
  if (arguments.length < 2) {
    throw 'Too few arguments';
  }
  var tpl = arguments[0];
  var args, arg;
  var res;
  if (typeof arguments[1] === 'array') {
    args = arguments[1];
  } else {
    args = Array.prototype.slice.call(arguments, 1);
  }
  if (args.length <= 0) {
    throw 'Too few arguments';
  }
  res = tpl.replace(rDStr, function($0, $1){
    var index = $1 - 1;
    if (args[index]) {
      return args[index];
    } else {
      throw 'Too few arguments';
    }
  });
  var arr = res.match(rStr) || [];
  if (args.length === 1) {
    return res.replace(rStr, args[0]);
  } else if (arr.length > args.length) {
      throw 'Too few arguments';
  }
  return res.replace(/%s/g, function(){
    return args.shift();
  });
}

Valley.sprintf = sprintf;