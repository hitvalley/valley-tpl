/**
 * 去掉注释
 *    行注释：*** -> //
 *    块注释：{* ... *}
 *    input: tpl
 *    output: 去掉注释的tpl
 */
export default function removeComments(tpl) {
  if (!tpl) {
    return '';
  }
  // return tpl.split(/[\r\n]+/g).map(line => line.replace(/\*\*\*.*$/, '')).join('\n').replace(/\{\*(.|[\r\n])*?\*\}/, '').trim();
  return tpl.replace(/\*\*\*.*?(?:[\r\n]+|$)/g, '').replace(/\{\*(.|[\r\n])*?\*\}/g, '').trim();
}

