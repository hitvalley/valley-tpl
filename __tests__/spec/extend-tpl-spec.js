import extendTpl from '../../src/utils/extend-tpl';
import {
writeTestFile,
removeTestFile,
getConfig
} from './file';
const config = getConfig();

beforeAll(() => {
  writeTestFile('test_layout', '<h1>header</h1>{{block content}}{{/block}}');
  writeTestFile('test_main', '{{extends test_layout}}{{block content}}<p>content</p>{{/block}}');
  writeTestFile('test_layout_2', '<h1>header2</h1>{{block content}}{{/block}}{{include test_footer}}');
  writeTestFile('test_main_2', '{{extends test_layout_2}}{{block content}}<p>content</p>{{include test_in}}{{/block}}');
  writeTestFile('test_in', '<div>inner</div>');
  writeTestFile('test_footer', '<footer></footer>');
});
test('extend', () => {
  extendTpl('test_main', config).then(res => {
    expect(res).toEqual('<h1>header</h1><p>content</p>');
    removeTestFile(['test_layout', 'test_main']);
  });
});
test('with include', () => {
  extendTpl('test_main_2', config).then(res => {
    // console.log(res);
    expect(res).toEqual('<h1>header2</h1><p>content</p><div>inner</div><footer></footer>');
    removeTestFile(['test_layout_2', 'test_main_2', 'test_in', 'test_footer']);
  });
});


