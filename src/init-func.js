export default function initFunction(funstr, keys, hackObj) {
  funstr = `try { ${funstr} } catch(e) { console.error(e); }`;
  try {
    return new Function(keys, funstr);
  } catch(e) {
    console.error(funstr);
    console.error(e);
  }
}
