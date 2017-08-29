import getContentNode from './content-in-node';

var getContent = getContentNode;

export default async function getContent(tplName, config) {
  if (config.inBrowser) {
    return Promise.resolve(document.getElementById(tplName).innerHTML);
  } else {
    return await getContentNode(tplName, config);
  }
}
