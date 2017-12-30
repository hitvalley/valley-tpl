import prepareTplTpl from '../../src/prepare-tpl';
import {
writeTestFile,
removeTestFile,
getConfig
} from './file';
const config = getConfig();

beforeAll(() => {
  writeTestFile('prepare1', 'prepare1');
  writeTestFile('vt_layout', '<h1>{{header}}</h1>{{block content}}{{/block}}{{include vt_footer}}');
  writeTestFile('vt_main', '{{extends vt_layout}}{{block content}}<p>{{content}}</p>{{include vt_auth}}{{/block}}');
  writeTestFile('vt_auth', '<div>{{auth}}</div>');
  writeTestFile('vt_footer', '<footer>{{date}}</footer>');
});
test('prepare single', () => {
  prepareTplTpl('prepare1', config).then(res => {
    expect(res).toEqual('prepare1');
    removeTestFile(['prepare1']);
  });
});
test('prepare extend & include', () => {
  prepareTplTpl('vt_main', config).then(res => {
    // let res = '<script>\n{{hack}}\nvar a = 1;\nconsole.log(a);\n{{/hack}}\n</script>';
    let html = '<h1>{{header}}</h1><p>{{content}}</p><div>{{auth}}</div><footer>{{date}}</footer>';
    expect(res).toEqual(html);
    removeTestFile(['vt_layout', 'vt_main', 'vt_auth', 'vt_footer']);
  });
});


