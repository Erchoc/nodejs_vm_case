'use strict';

// 外部函数定义
function sub(a, b) {
  return a - b;
}

// JS代码
const code = 'return a + b + c';
const code_complex = `
function add(a, b) {
  return a + b;
}
return add(2, 2); // new Function 需要又返回值
`;

// 执行 JS 代码: 无参 && 带参
const res = new Function(code_complex)();
const fn = new Function('a', 'b', 'c', code);

// 输出执行结果
console.log('无参结果: ', res);
console.log('带参结果: ', fn(10, 20, 30));
console.log(new Function('console.log(2)')()); // 允许使用全局变量

/**
 * 这种做法优劣在哪? 
 *
 * 1、解决了 eval 代码能访问上下文变量的安全性问题
 * 2、eval 和 new Function 在执行效率无法比较，根浏览器和具体字符内容有关
 * 3、硬要选一个则推荐使用 new Function，配合 ES6 Proxy 和 iframe 加强安全性
 **/


function evalute(code, sandbox) {
  sandbox = sandbox || Object.create(null);
  const fn = new Function('sandbox', `
    with(sandbox) { ${code} } // 我也不知道为啥要这样写
  `);
  const proxy = new Proxy(sandbox, {
    has(target, key) {
      // 防止脚本使用上层作用域功能(部分JS功能将不可用)
      return true;
    }
  });
  return fn(proxy);
}

console.log(evalute('1 + 2')); // 3
// evalute('console.log(3)'); // global.console.log、window.console.log 将不可用


