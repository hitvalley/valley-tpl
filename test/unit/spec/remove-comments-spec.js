import removeComments from '../../../src/remove-comments';

let tpl1 = '***comments\n\
test = 1';
let tpl2 = '{*block comments\n\
add by gty\
block comments end*}\
test = 1';
let tpl3 = '{*block comments\n\
add by gty\
block comments end*}\
test = 1***comment info';

describe('test remove comments', () => {
  it ('remove line comments', () => {
    expect(removeComments(tpl1)).toEqual('test = 1');
  });
  it ('remove block comments', () => {
    expect(removeComments(tpl2)).toEqual('test = 1');
  });
  it ('remove all comments', () => {
    expect(removeComments(tpl3)).toEqual('test = 1');
  });
});
