const escapeHash = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2f;'
};

const escapeRegExp = new RegExp('[&<>"\']', 'igm')

export default function htmlspecialchars(str) {
  return typeof str === 'string' ? str.replace(escapeRegExp, $0 => escapeHash[$0]) : str;
}
