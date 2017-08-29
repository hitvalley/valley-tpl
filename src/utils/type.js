let class2type = {};
let toString = class2type.toString;
let getProto = Object.getPrototypeOf;
let hasOwn = class2type.hasOwnProperty;
let fnToString = hasOwn.toString;
let ObjectFunctionString = fnToString.call( Object );

"Boolean Number String Function Array Date RegExp Object Error Symbol".split(" ").forEach(function(type){
  class2type["[object " + type + "]"] = type.toLowerCase();
});

export function type(obj) {
  if (obj == null) {
    return obj + "";
  }
  return typeof obj === "object" || typeof obj === "function" ?
      class2type[ toString.call(obj) ] || "object" : typeof obj;
}

export function isFunction(input) {
  return type(input) === 'function';
}

export function isPlainObject(input) {
  let proto;
  let Ctor;

  if ( !obj || toString.call( obj ) !== "[object Object]" ) {
    return false;
  }

  proto = getProto( obj );

  if ( !proto ) {
    return true;
  }

  Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
  return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
}
