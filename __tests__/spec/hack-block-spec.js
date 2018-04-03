import hackBlock from '../../src/hack-block';

test('test hack', () => {
  let hackObj = {};
  let tpl = '<script>\n{{browser}}\nvar a = 1;\nconsole.log(a);\n{{/browser}}\n</script>\n<script>{{browser}}console.log("test");{{/browser}}</script>';
  let res = hackBlock(tpl, hackObj);
  let html = [
    '<script>',
    '<<HACK_MARK_0>>',
    '</script>',
    '<script><<HACK_MARK_1>></script>'
  ];
  let hackResObj = {
    '<<HACK_MARK_0>>': '\nvar a = 1;\nconsole.log(a);\n',
    '<<HACK_MARK_1>>': 'console.log("test");'
  };
  expect(res).toBe(html.join('\n'));
  expect(hackObj).toEqual(hackResObj);
});


