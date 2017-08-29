import prepareTplTpl from '../../../src/prepare-tpl';
import {
  writeTestFile,
  removeTestFile,
  getConfig
} from './file';

const config = getConfig();

describe('test prepareTpl tpl', () => {
  beforeAll(() => {
    writeTestFile('prepare1', 'prepare1');
  });
  it('prepare single', () => {
    prepareTplTpl('prepare1', config).then(res => {
      expect(res).toEqual('prepare1');
      removeTestFile(['prepare1']);
    });
  });
});
