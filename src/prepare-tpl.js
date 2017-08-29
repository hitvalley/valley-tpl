import getContent from './utils/extend-tpl';

export default async function prepareTpl(tplName, config) {
  let res = await getContent(tplName, config);
  return res;
}

