const fs = require('fs');
const axios = require('axios');
const { Safeify } = require('safeify');

/**
 * https://zhuanlan.zhihu.com/p/35992886
 *
 * vm2 方案已经相对成熟稳定了，但业务需求复杂多变，有些人就是想要轻量化的进程级隔离。
 * 我们可以考虑将 vm2 执行代码逻辑，放在一个线程池中运行；执行超时直接 kill 进程即可。
 * 那么就需要维护进程池逻辑、进程间 IPC 通讯、cGroup 对 CPU 和 Memory 的分配限制功能。
 **/

const safeVM = new Safeify({
  timeout: 50,          // 超时时间，默认 50ms
  asyncTimeout: 100,    // 包含异步操作的超时时间，默认 500ms
  quantity: 6,          // 沙箱进程数量，默认同 CPU 核数
  memoryQuota: 2,       // 沙箱最大能使用的内存（单位 mb），默认 500mb
  cpuQuota: 0.1,        // 沙箱的 cpu 资源配额（百分比），默认 50%
});

const context = {
  a: 1, 
  b: 2,
  add(a, b) {
    return a + b;
  }
};

const rpcInjectContext = {
  fs,
  axios,
  get() { return axios }
};


async function init() {

  // 也是需要 return 的
  const r1 = await safeVM.run(`return 1 + 3`);
  // 还能在上下文携带数据
  const r2 = await safeVM.run(`return add(a,b)`, context);
  // 读取文件执行
  const r3 = await safeVM.run(fs.readFileSync('./return_plugin.js'), context);
  // 上下文注入内容(有缺陷)
  const r4 = await safeVM.run(`return fs`, rpcInjectContext);
  // 执行超时
  // const r5 = await safeVM.run(`return new Promise(() => {})`, context);
 
  console.log(r1, r2, r3, r4);
  safeVM.destroy();
}

init().catch(err => {
  console.log('发生错误:', err)
});

