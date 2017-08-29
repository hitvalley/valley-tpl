export default function initFunction(funstr, keys) {
  return new Function(keys, funstr);
}
