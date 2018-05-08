const tagRegExp = /\{\{([^{}]*?)\}\}/g;

/**
  tag info
    {{ variable }}
    {{if judgement}} ... {{elseif/elif judgement}} ... {{else}} ... {{/if}}
    {{each list as value, key}} ... {{/each}}
    {{for (let i = 0; i < list.length; i++)}} ... {{/for}}
    {{ set variable value }}
    {{ new variable value }}
*/

export default function analyzeTag(tpl) {
  let res;
  let str;
  let start = 0;
  let mark = 0;
  let content;
  let tagInfo;
  let tagName;
  let tagArr;
  let tags = [];
  let tagObj = {};
  while (res = tagRegExp.exec(tpl)) {
    start = res.index;
    content = res[0];
    tagInfo = res[1];
    if (mark < start) {
      str = tpl.substring(mark, start);
      str && tags.push({
        type: 'string',
        content: str
      });
    }
    if (tagInfo) {
      tagArr = tagInfo.split(/\s+/);
      tagName = tagArr.shift();
      switch (tagName) {
      case 'if':
        tagObj = {
          type: 'if',
          content: tagArr.join(' ')
          // content: tagArr
        };
        break;
      case 'elseif':
      case 'elif':
        tagObj = {
          type: 'elseif',
          content: tagArr.join(' ')
          // content: tagArr
        };
        break;
      case 'else':
        tagObj = {
          type: 'else'
        };
        break;
      case '/if':
        tagObj = {
          type: 'endif'
        };
        break;
      case 'for':
      case 'each':
        tagObj = {
          type: tagName,
          content: tagArr.join(' ')
          // content: tagArr
        };
        break;
      case '/each':
        tagObj = {
          type: 'endeach'
        };
        break;
      case '/for':
        tagObj = {
          type: 'endfor'
        };
        break;
      case 'set':
        tagObj = {
          type: 'set',
          content: tagArr.join(' ')
        };
        break;
      // case 'new':
      //   tagObj = {
      //     type: 'new',
      //     content: tagArr
      //   };
      //   break;
      case 'debug':
        break;
      // case 'debug':
      //   tagObj = {
      //     type: 'debug',
      //     content: tagInfo || '$data'
      //   };
      //   break;
      // case 'js':
      //   tagObj = {
      //     type: 'js',
      //     content: tagArr.join(' ')
      //   };
      //   break;
      default:
        tagObj = {
          type: 'var',
          content: tagInfo //{{}}包裹的部分都是变量
        };
      }
      tags.push(tagObj);
    }
    mark = start + content.length;
  }
  if (mark < tpl.length) {
    tags.push({
      type: 'string',
      content: tpl.substring(mark)
    });
  }
  return tags;
}
