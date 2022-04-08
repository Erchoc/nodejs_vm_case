# NodeJS 脚本动态执行方案

插件开发等场景通常会开放一些能力，允许用户自定义，扩展平台功能。

但我们又希望自定义的功能收到一些限制，不能无休止的申请资源和权限。

---

eval 实现在 1_eval.js，new Function 实现在 2_function.js 文件中。

这两种方式都狠不安全，原因在代码文件中有写，所以一般是不建议使用的。

首先推荐官方 vm 虚拟机模块: 3_vm.js，优点是官方模块较为稳定，通过 v8 编译执行，性能损失较少。

但 vm 不适合用于上下文隔离环境，对于开放程度较高或对外应用，优先考虑使用 vm2 社区模块 4_vm2.js

社区较为活跃，更新维护频率高，市场使用和反馈都较为不错；安全上仍有缺陷，且依旧缺乏线程隔离能力。

如果 vm2 还不满足您的需要，那你们团队八成是能力也很不错了，可以参考 safeify 源码进行二次开发哦。

如果团队能力一般但确实有线程级隔离需求，也可以直接使用 5_safeify.js 示例代码。



