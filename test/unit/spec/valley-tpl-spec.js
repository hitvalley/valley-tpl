import vtpl from '../../../src/index';
import prepareTpl from '../../../src/prepare-tpl';
import getContent from '../../../src/utils/content-in-node';
import {
  writeTestFile,
  removeTestFile,
  getConfig
} from './file';

const config = getConfig();


let mark = 0;
function removeAll() {
  mark >= 2 && removeTestFile(['vt_layout', 'vt_main', 'vt_auth', 'vt_footer']);
}

describe('test valley tpl', () => {
  beforeAll(() => {
    writeTestFile('vt_layout', '<h1>{{header}}</h1>{{block content}}{{/block}}{{include vt_footer}}');
    writeTestFile('vt_main', '{{extends vt_layout}}{{block content}}<p>{{content}}</p>{{include vt_auth}}{{/block}}');
    writeTestFile('vt_auth', '<div>{{auth}}</div>');
    writeTestFile('vt_footer', '<footer>{{date}}</footer>');
  });
  it('content', () => {
    let tpl = 'vt_main';
    let d = new Date('Tue Aug 29 2017 10:10:42 GMT+0800 (CST)');
    prepareTpl(tpl, config).then(content => {
      let html = vtpl(content, {
        header: 'test',
        content: 'test for valley tpl',
        auth: 'gty',
        date: d
      }, {});
      let res = '<h1>test</h1><p>test for valley tpl</p><div>gty</div><footer>Tue Aug 29 2017 10:10:42 GMT+0800 (CST)</footer>';
      expect(html).toEqual(res);
      removeTestFile(['vt_layout', 'vt_main', 'vt_auth', 'vt_footer']);
    });
  });
//  it('with func', () => {
//    let tpl = 'vt_main_2';
//    prepareTpl(tpl, config).then(content => {
//      vtpl.register({
//        dateStr: function(date) {
//          return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
//        }
//      });
//      let d = new Date('Tue Aug 29 2017 10:10:42 GMT+0800 (CST)');
//      let html = vtpl(content, {
//        header: 'test',
//        content: 'test for valley tpl',
//        auth: 'gty',
//        date: d
//      }, {});
//      console.log(html);
//    });
//  });
});
