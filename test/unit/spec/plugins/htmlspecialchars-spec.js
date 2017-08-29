import htmlspecialchars from '../../../../src/plugins/htmlspecialchars';

describe('test htmlspecialchars', () => {
  it('normal', () => {
    let str = '<div>"abc" & \'def\'</div>';
    let res = htmlspecialchars(str);
    expect(res).toBe('&lt;div&gt;&quot;abc&quot; &amp; &#x27;def&#x27;&lt;/div&gt;');
  });
});
