import hackBlock from '../../src/hack-block';

test('test hack', () => {
  let hackObj = {};
  let tpl = '<script>\n{{hack}}\nvar a = 1;\nconsole.log(a);\n{{/hack}}\n</script>\n<script>{{hack}}console.log("test");{{/hack}}</script>';
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


