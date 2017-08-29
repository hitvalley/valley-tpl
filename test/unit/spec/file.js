import fs from 'fs';
import { join } from 'path';

const config = {
  encoding: 'utf-8',
  viewPath: __dirname,
  extension: 'tpl',
  withExtend: true,
  scope: {},
  inBrowser: (function() {
    return this !== undefined && this === this.window;
  }())
};

export function writeTestFile(filename, data) {
  fs.writeFileSync(join(config.viewPath, `${filename}.${config.extension}`), data, {
    encoding: config.encoding
  });
}

export function removeTestFile(files) {
  files = typeof files === 'string' ? [files] : files;
  files.forEach(filename => {
    fs.unlinkSync(join(config.viewPath, `${filename}.${config.extension}`));
  });
}

export function getConfig() {
  return config;
};

