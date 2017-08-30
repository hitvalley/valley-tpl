import vtpl from '../../../src/index';

describe('test valley tpl', () => {
  it('content', () => {
    let d = new Date('Tue Aug 29 2017 10:10:42 GMT+0800 (CST)');
    let tpl = '<h1>{{header}}</h1><p>{{content}}</p><div>{{auth}}</div><footer>{{date}}</footer>';
    let html = vtpl(tpl, {
      header: 'test',
      content: 'test for valley tpl',
      auth: 'gty',
      date: d
    }, {});
    let res = '<h1>test</h1><p>test for valley tpl</p><div>gty</div><footer>Tue Aug 29 2017 10:10:42 GMT+0800 (CST)</footer>';
    expect(html).toBe(res);
  });
  it('with func', () => {
    let tpl = '<h1>{{header}}</h1><p>{{content}}</p><div>{{auth}}</div><footer>{{date|dateStr}}</footer>';
    vtpl.register('dateStr', function(date) {
      return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    });
    let d = new Date('Tue Aug 29 2017 10:10:42 GMT+0800 (CST)');
    let html = vtpl(tpl, {
      header: 'test',
      content: 'test for valley tpl',
      auth: 'gty',
      date: d
    }, {});
    let res = '<h1>test</h1><p>test for valley tpl</p><div>gty</div><footer>2017-8-29</footer>';
    expect(html).toBe(res);
  });
  it('test hack block', () => {
    let tpl = [
      '<h1>{{info}}</h1>',
      '<div>{{content}}</div>',
      '<script>',
      '{{hack}}',
      'console.log("{{info}}");',
      'console.log("{{content}}")',
      '{{/hack}}',
      '</script>'
    ].join('\n');
    let html = vtpl(tpl, {
      info: 'test hack',
      content: 'hack block ready'
    });
    console.log(html + '|');
    let res = [
      '<h1>test hack</h1> <div>hack block ready</div> <script> ',
      'console.log("{{info}}");',
      'console.log("{{content}}")',
      '</script>'
    ];
    console.log(res + '|');
    expect(html).toEqual(res);
  });
});
