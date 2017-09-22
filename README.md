# ValleyTpl
JavaScript Template Engine For ValleyJS

当前版本：0.1

ValleyTpl是一款Javascript的模板引擎，是以 StringBased 方式实现的。因此，该引擎目前可以在 Browser 和 NodeJS 两个终端执行。

问题：但对于 MVVM 的支持较难。因此，后续改进方向将是：在客户端采用 DomBased 方式实现，以支持 MVVM，而在服务器端采用 StringBased 方式实现。

## 使用

### 初始化

  npm i

### Browser

生成valleytpl.js

  npm run build-plus

ValleyTpl引入

  <script src="dist/valleytpl.js"></script>

调用

  vtpl(tpl, data);

### NodeJS

生成vtpl-node.js

  npm run build-plus-node

引用

  const vtpl = require('./dist/vtpl-node.js');

调用

  vtpl(tpl, data);// 返回值为promise

## API

变量打印

  {{name}}

if ... else if ... else

  {{if a === 1}}
     ...
  {{elseif b === 1}}
     ...
  {{else}}
    ...
  {{/if}}
