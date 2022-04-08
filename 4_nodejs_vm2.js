const fs = require('fs');
const { VM, NodeVM, VMScript } = require('vm2');

// 测试使用第三方模块
const vmm = new NodeVM({
  require: {
    builtin: ['fs', 'path'], // 不要暴露太多
    external: true,
    root: './'
  }
});
vmm.run(`
  const axios = require('axios');
  console.log(axios);
`, 'vm.js');

// 共享虚拟机
const vm = new VM({ timeout: 50, require: { external: true, root: './' } });
console.log("虚拟机实例：", vm);
vm.run(new VMScript('new Promise(() => {})')); // 永不停止

// code = 路由; file = 插件
// const code = 'while(true) {}';
const code = 'let a = 1;\nlet b = 2; a+b';
const code_complex = `
function add(a, b) {
  return a + b;
}
add(2, 2); // vm 代码不需要 return
`;
const file = `${__dirname}/plugin.js`;

// 将待编译的 JS 代码装载到 VM 对象上
const codeScript = new VMScript(code);

const fileScript = new VMScript(fs.readFileSync(file), file);
console.log("文本脚本：", codeScript);
console.log("文件脚本：", fileScript);

// 通过 vm 可以多次执行 VM 对象
const codeRes = vm.run(codeScript);
const fileRes = vm.run(fileScript);
console.log("运行文本脚本：", codeRes);
console.log("运行文件脚本：", fileRes);

/**
 * vm2 相比 vm 又好在哪儿呢? 
 *
 * 1、上下文隔离更加彻底，但异步超时、资源限制、进程共享方面还不够安全。
 * 2、允许动态导入 Nodejs 社区模块，但 remote_path_import 方式暂不支持。
 * 3、vm2 新增的特性功能较多，社区更新维护频繁，可以作为此类方案的第一选择。
 * 
 * 如果业务场景需要隔离更加彻底的方案，可以通过 Docker 方式来做，还能跨语言实现。
 * 那如果不想使用 Docker 这类资源占用高的方案呢? Node 领域可以试试 safeify 这个库。
 **/


