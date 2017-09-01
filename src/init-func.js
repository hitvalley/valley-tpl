function initScope() {
  let scopes = ['var $scope = {};'];
  scopes.push('$scope.now = Date.now();');
  return scopes;
}

function replaceHack(content, hackObj) {
  let hackRegExp = new RegExp(`<<HACK_MARK_\\d+>>`, 'g');
  content = content.replace(hackRegExp, $0 => {
    return hackObj[$0].replace(/[\r\n]/g, '\\n')
  });
  return content;
}

export default function initFunction(tags, keys, hackObj) {
  let scopes = initScope();
  let farr = scopes.concat(tags);
  let funstr = farr.join('\n');
  funstr = replaceHack(funstr, hackObj);
  funstr = `try { ${funstr} } catch(e) { console.error(e); }`;
  try {
    return new Function(keys, funstr);
  } catch(e) {
    console.error(e);
  }
}
