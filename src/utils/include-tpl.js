import {
  includeRegExp
} from './regexp-obj';
import getContent from './content-in-node';

async function includeTpl(tplName, config) {
  let content = await getContent(tplName, config);
  let contentObj = {};
  let keys = [];
  let jobs = [];
  let includeRes;
  while (includeRes = includeRegExp.exec(content)) {
    keys.push(includeRes[1]);
    jobs.push(getContent(includeRes[1], config));
  }
  await Promise.all(jobs).then(contentRes => {
    contentRes.forEach((res, index) => {
      contentObj[keys[index]] = res;
    });
  });
  return content.replace(includeRegExp, function($0, $1){
    return contentObj[$1] || '';
  });
}

export default includeTpl;
