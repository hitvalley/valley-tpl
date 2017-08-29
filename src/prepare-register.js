export function register(fname, func) {
  let scope = this.scope || (function(){
    return this;
  }());
  scope[fname] = func;
}

export function unregister(fname) {
  let scope = this.scope || (function(){
    return this;
  }());
  scope[fname] = undefined;
}

