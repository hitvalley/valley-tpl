# valleytpl
JavaScript Template Engine For ValleyJS

# 语法
## 变量输出 - {xxx}
例子: <h1>{test}</h1> -> <h1>Hello world</h1> // var test = 'Hello world';
## IF - {if (expr)} ... {/if}
支持if/elseif/else if/else
## for - {for (expr1;expr2;expr3)}{/for}
## JS原生代码 - {js xxx}
## 嵌入模板 - {include file1 ...}
## 嵌入代码 - {require file1 ...}
