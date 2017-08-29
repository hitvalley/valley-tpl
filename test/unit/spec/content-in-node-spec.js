import fs from 'fs';
import { join } from 'path';
import getContent from '../../../src/utils/content-in-node';
import {
  getConfig,
  writeTestFile,
  removeTestFile
} from './file';

const config = getConfig();

describe('test getContent in node env', () => {
  beforeAll(() => {
    writeTestFile('demo1', '<p>{{test}}</p>');
  });
  it('test getContent', () => {
    getContent('demo1', config).then(res => expect(res).toEqual('<p>{{test}}</p>'));
  });
  afterAll(() => {
    removeTestFile('demo1');
  });
});
