const DefaultTPL = 'Y-M-D H:I:S';

export default function datestr(tpl, timestamp) {
  if (arguments.length === 0) {
    tpl = DefaultTPL;
  }
  if (typeof tpl === 'number') {
    timestamp = tpl;
    tpl = DefaultTPL;
  }
  let date;
  if (!timestamp) {
    date = new Date();
  } else if (timestamp.toString().length === 10) {
    date = new Date(timestamp * 1000);
  } else {
    date = new Date(timestamp);
  }
  tpl = tpl || DefaultTPL;
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();
  let obj = {
    'Y': date.getFullYear(),
    'y': date.getYear(),
    'M': month < 10 ? ('0' + month) : month,
    'm': month,
    'D': day < 10 ? ('0' + day) : day,
    'd': day,
    'H': hour < 10 ? ('0' + hour) : hour,
    'h': hour,
    'I': minute < 10 ? ('0' + minute) : minute,
    'i': minute,
    'S': second < 10 ? ('0' + second) : second,
    's': second
  };
  return tpl.replace(/[YMDHISymdhis]/g, $0 => obj[$0]);
}
