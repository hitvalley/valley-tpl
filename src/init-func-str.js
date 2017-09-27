function replaceHack(content, hackObj) {
  let hackRegExp = new RegExp(`<<HACK_MARK_\\d+>>`, 'g');
  content = content.replace(hackRegExp, $0 => {
    return hackObj[$0].replace(/[\r\n]/g, '\\n').replace(/'/g, "\\'");
  });
  return content;
}

function initScope() {
  let scopes = ['var $scope = {};'];
  scopes.push('$scope.now = Date.now();');
  scopes.push('var self = this;');
  return scopes;
}

export default function initFuncStr(tags, hackObj) {
  let scopes = initScope();
  let farr = scopes.concat(tags);
  let funstr = farr.join('\n');
  funstr = replaceHack(funstr, hackObj);
  return funstr;
}
