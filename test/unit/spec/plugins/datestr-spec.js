import datestr from '../../../../src/plugins/datestr';

describe('test datestr', () => {
  it('normal', () => {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = month > 9 ? month : `0${month}`;
    let d = date.getDate();
    d = d > 9 ? d : `0${d}`;
    expect(datestr('Y-M-D')).toEqual(`${year}-${month}-${d}`);
  });
  it('no input', () => {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let d = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    month = month > 9 ? month : `0${month}`;
    d = d > 9 ? d : `0${d}`;
    hour = hour > 9 ? hour : `0${hour}`;
    minute = minute > 9 ? minute : `0${minute}`;
    second = second > 9 ? second : `0${second}`;
    expect(datestr()).toEqual(`${year}-${month}-${d} ${hour}:${minute}:${second}`);
  });
});
