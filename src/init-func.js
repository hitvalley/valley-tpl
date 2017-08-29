function initScope() {
  let scopes = ['var $scope = {};'];
  scopes.push('$scope.now = Date.now()');
  return scopes;
}

export default function initFunction(tags, keys) {
  let scopes = initScope();
  let farr = scopes.concat(tags);
  let funstr = farr.join('\n');
  return new Function(keys, funstr);
}
