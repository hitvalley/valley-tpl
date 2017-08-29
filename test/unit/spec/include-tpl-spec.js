import includeTpl from '../../../src/utils/include-tpl';
import {
  writeTestFile,
  removeTestFile,
  getConfig
} from './file';

const config = getConfig();

describe('test include tpl', () => {
  beforeAll(() => {
    writeTestFile('test_include', '{{include test_inner}} <p>{{test}}</p>');
    writeTestFile('test_inner', '<h1>inner</h1>');
  });
  it('include', () => {
    includeTpl('test_include', config).then(res => {
      expect(res).toEqual('<h1>inner</h1> <p>{{test}}</p>')
      removeTestFile('test_include');
      removeTestFile('test_inner');
    });
  });
});
