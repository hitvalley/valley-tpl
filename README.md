# ValleyTpl

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

变量

	{{name}} // 变量输出
	{{name|filter}} // 过滤器
	{{name|filter:1,"a"}} // 含有输入的过滤器，name为filter的第一个输入值

增加过滤器

	vtpl.register('functionName', function)

删除过滤器

	vtpl.unregister('functionName')

已有过滤器
	htmlspecialchars // 将特殊字符转换为 HTML 实体
	datestr // 根据要求提供时间展示

判断：if ... else if ... else

	{{if a === 1}}
	  ...
	{{elseif b === 1}}
	  ...
	{{else}}
	  ...
	{{/if}}

循环：for

	{{for i = 0; i < list.length; i ++}}
	  ...
	{{/for}}

循环：each

	{{each list as item , index}}
	  ...
	{{/each}}

不执行代码片段：hack

所有被hack包裹的片段将不执行，方便在一个模板中同时写浏览器模板和服务器模板

	{{hack}}
	  ...
	{{/hack}}

模板的继承：extends/block //类似于smarty的继承

	{{extends parent}}
	  ...
	{{block block_name}}{{/block}}

	{{block block_name}}
	 ...
	{{/block}}

## 近期计划

1. 加入对于Express的支持插件
2. 加入对于Koa的支持插件
