'use strict';

const fs = require('fs');
const { Script, createContext } = require('vm');

const code = 'let a = 1;\nlet b = 2; a+b';
const code_complex = `
function add(a, b) {
  return author + "=" + a + b;
}
add(2, 2); // vm 代码不需要 return
`;

// 将待编译的 JS 代码装载到 VM 对象上
const codeScript = new Script(code);
//const codeScript = new Script("while(true){}");
const fileScript = new Script(code_complex);
console.log("无参脚本：", codeScript);
console.log("带参脚本：", fileScript);

// 创建无参 && 带参执行上下文
const ctx1 = new createContext();
const ctx2 = new createContext({ author: 'longye' });

// 在上下文中执行编译后的 JS 代码
const codeRes = codeScript.runInContext(ctx1, { timeout: 50 });
const fileRes = fileScript.runInContext(ctx2);
console.log("运行无参脚本：", codeRes);
console.log("运行带参脚本：", fileRes);

/**
 * 这种方式的优劣又如何呢?
 *
 * 1、毕竟是官方推荐，使用 v8 虚拟机环境编译，效率当然是可以的。
 * 2、带参数的方式可以用来给上下文注入工具函数，还能设置同步执行的超时时间。
 * 3、runInContext 隔离不彻底，很容易通过 constructor 逃逸出去，影响宿主环境。 
 * 4、同样可以通过 ES6 Proxy 拦截 sandbox 为空的情况，但还是无法完全避免逃逸。
 **/


