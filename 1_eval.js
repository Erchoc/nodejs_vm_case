'use strict';

// 外部函数定义
function sub(a, b) {
  return a - b;
}

// JS代码
const code = '2 + 3';
const code_complex = `
function add(a, b) {
  return a + b;
}
sub(2, 2);
`;

// 执行 JS 代码
const res = eval(code_complex);

// 输出执行结果
console.log(res);

/**
 * 这种做法有什么弊端? 运行效率慢、安全隐患大。
 *
 * 1、eval 中执行的代码可以访问上下文中的局部变量和全局变量。 
 * 2、eval 和 with 一样，在运行时修改或创建了词法作用域，从而导致 v8 引擎无法在编译期对其优化，所以代码运行效率不高。
 **/
