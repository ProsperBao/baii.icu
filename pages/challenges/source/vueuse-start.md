---
title: VueUse - 整体的项目结构以及入口
date: 2022-07-12 09:50:00
category: source
---

[[toc]]

## 项目目录结构

和大部分项目一样，根目录是一些配置文件和文档之类的，就跳过，着重查看下面的目录结构。

`Vueuse` 使用的是根据模块的功能拆成不同的包，每个包都可以看作是一个独立项目，使用的是 `pnpm` 来管理 `monorepo`。

着重看 `packages` 里的包。

```
VueUse
├─meta              # 用来存放生成文档后顶部右边的导航栏的数据
├─packages          # ⚠️⚠️⚠️⚠️⚠️⚠️⚠️ 包含所有功能包的目录 ⚠️⚠️⚠️⚠️⚠️⚠️⚠️
│   ├─.test         # vitest 测试用例
│   ├─.vitepress    # vitepress 用来生成文档的配置
│   ├─components    # @vueuse/components 从 core 的 hook 中抽离出来的组件合集
│   ├─core          # 核心功能的 hook
│   ├─electron      # electron 独有的 hook
│   ├─firebase      # firebase 独有的 hook
│   ├─guide         # vueuse 的使用引导
│   ├─integrations  # 第三方插件的 hook
│   ├─metadata      # 用来存放生成文档后顶部右边的导航栏的数据
│   ├─nuxt          # nuxt 独有的 hook
│   ├─public        # 一些公用的资源
│   ├─router        # vue-router 独有的 hook
│   ├─rxjs          # rxjs 独有的 hook
│   └─shared        # 公用的 hook 一些内部的公用函数
├─playgrounds       # nuxt 和 vite 的测试项目
└─scripts           # 一些打包时候用到的生成代码
```

## 项目的入口

可以注意到安装 `VueUse` 的时候并不是使用

```bash
npm i vueuse
```

这个命令安装的，而是

```bash
npm i @vueuse/core
```

所以相当于说是通过安装不同的扩展包实现不同的功能。

## 核心功能

核心功能是 `vueuse/core` 和 `vueuse/shared`。

一个包含所有不依赖第三方库的 hook，一个则是被依赖的公共函数的集合。

`vueuse/core` 则是收集了日常比较常用的 hook，包括一些社区贡献的 hook。

`vueuse/shared` 是对 `vue` 中提供组合式函数进行再次封装或者扩展。
