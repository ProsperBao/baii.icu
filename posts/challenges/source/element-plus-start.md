---
title: ElementPlus - 整体的项目结构
date: 2022-09-26 12:00:00
level: 1
levelTitle: ElementPlus
---

[[toc]]

## 项目目录结构
组件库有大量的 Cli 自动化和配置文档生成，所以较为复杂

现在大部分工具库都使用 `monorepo`，来拆分功能，分割不同的包，分开发布，这样可以更好的管理和维护

使用的是 `pnpm` 来管理 `monorepo`。

着重看 `packages` 里的包。

ElementPlus
├─.circleci         # Circle CI 自动化部署工具
├─.github           # Github 配置文件，包括 issue 和 pr 模板以及提交自动化测试流
├─.husky            # Git 钩子
├─.vscode           # VSCode 配置文件
├─breakings         # 用于记录 breaking change
├─docs              # vitepress 生成配置
├─internal          # 内部工具，构建流程
├─play              # playground 测试项目
├─scripts           # 构建脚本
├─ssr-testing       # 服务端渲染测试
├─typings           # 一些类型定义
├─packages          # ⚠️⚠️⚠️⚠️⚠️⚠️⚠️ 包含所有功能包的目录 ⚠️⚠️⚠️⚠️⚠️⚠️⚠️ 
│   ├─components    # 组件集合
│   ├─constants     # 一些公用常量
│   ├─directives    # 指令集合
│   ├─element-plus  # 对外暴露的包
│   ├─hooks         # hooks 集合
│   ├─locale        # 国际化
│   ├─test-utils    # 测试工具
│   ├─theme-chalk   # 样式
│   ├─tokens        # 组件 props
│   └─utils         # 工具函数
```
