---
title: 升级架构和迭代工具库
date: 2023-06-16 18:00:00
lang: zh
duration: 6min
description: 升级架构和迭代工具库
---

[[toc]]

## 需求背景
在公司整体前端技术架构和项目落后技术升级迭代的时候，急需引入和升级现有项目加速开发效率和开发体验。

## 遇到的问题
1. Vue2 TLS
2. 构建工具效率
3. 重复轮子

## 思考方案

### Vue2 TLS
这个问题其实很好解决，升级 Vue3 就完事了<br/>
但是实际上没有那么简单，需要考虑的东西太多了，比如：

- 组件库兼容
- 路由兼容
- 状态管理兼容
- vue2/vue3 兼容
- 等等

整体需要考虑的兼容问题实在太多了，最后决定使用 iframe 和 MicroApp 的方式来解决这个问题。<br/>
整体将 vue2 的代码形成一个 monorepo 的子项目，然后使用 iframe 和 MicroApp 接管<br/>

但是在实际的应用过程中发现了问题，比如：
- 蹭依赖
- 开发效率

#### 使用微前端升级项目
- 蹭依赖的问题直接由 pnpm 限制强制装全
- 开发效率就是要分情况了
  - vite2/3 -> vite4 主要升级的就是首次加载非常慢的问题
  - webpack -> vite4 因为主要为了提高开发体验和开发效率

#### 接下来就是考虑vue2/vue3的兼容问题了
目前的决定是使用 iframe 和 MicroApp 接管路由，把 vue2 的代码形成一个 monorepo 的子项目，所有新的功能和迭代都迁移到 vue3 的子项目，每次迭代酌情考虑迁移 vue2 的代码到 vue3 的子项目中。

- 首先就是 iframe 的项目使用一个全局的自定义路由作为中间件中转接管所有原来的路由
- MicroApp 直接使用设置基础路由让 MicroApp 的路由接管所有路由

这样直接避免了 `状态管理兼容` 和 `组件库兼容` 一些 API 和编译器的细节 的不兼容问题。

接下来就是一个弹窗两个系统都需要用，这个时候就需要考虑 `vue2/vue3 兼容` 的问题了。因为不可能每次都开发两个组件，那如果更多系统要用呢？<br/>

所以就决定创建一个统一的工具库



### 构建工具库
构建工具库的目标如下
1. 公共组件库 vue2/vue3 兼容
2. 公共工具库 vue2/vue3 兼容
3. 抽离 Ts 公共类型定义
4. 统一规范检查工具

#### 公共组件库 vue2/vue3 兼容
解决兼容的方案有以下几个:
1. Vue2/Vue3 两套代码 + 统一 hook
2. vue2/vue3 一套代码 + 不同的编译器
3. web component

针对每个方案我都进行了尝试
> Vue2/Vue3 两套代码 + 统一 hook
根据首先写出 vue3 的模板代码，然后 hook 使用 vue-demi 抹平 api 差距，接下来把 vue3 的模板代码微调成 vue2 的代码，然后交给不同的编译器编译打包

可以用，但是很多 Api 用的非常难受，并且开发时间也很长，不推荐使用，要求 volar 的支持和 ts 完备，总会在奇奇怪怪的地方报错，并且很难解决

> vue2/vue3 一套代码 + 不同的编译器
写一套代码使用 vue-demi 抹平 api 差距，交给不同的编译器打包

如上

> web component
直接 vue3 梭哈，不需要考虑兼容问题，直接 3.2 往上就可以了，vue 内部已经完全帮忙处理好了

但是有个问题 v-model 支持的问题 web component 的自定义事件和正常的组建的事件是不一样的值是在 CustomEvent 的 detail 中，所以需要自己处理一下

所以我选择了 web component 的方案，虽然有点麻烦，但是都可以解决的，vue2 我选择直接写一个 v-ce-model 来代替 v-model 的双向绑定，vue3 可以直接使用 [白三物语](https://github.com/baiwusanyu-c/unplugin-vue-ce) 大佬的库就可以了，虽然可能有破坏性改动，但是整体来说只要能用并且内部尽可能使用默认配置，问题一般不大，出问题直接固定版本完事了。但是！！但是！！但是！！我这里选择 web component 只是为了解决 2 和 3 的兼容问题，vue3 的代码还是 vue 3 的代码，不需要包裹 defineCustomElement 直接导出就可以使用

#### 组件库构建
整体前端已经升级到 pnpm 管理项目了，所以直接用 monorepo 拆分不同的包，带一个整体导出就可以了。

```bash
.
├── package.json
├── pnpm-workspace.yaml
├── packages
│   ├── components      # webcomponent 和 vue3 组件
│   ├── docs            # 文档
│   ├── hooks           # vue-demi 构建的公用 hooks
│   ├── utils           # 一些 Ts 公共类型定义 和一些公共的业务方法或者工具方法
│   ├── plugin          # 一些打包构建工具的插件 (v-ce-model就是在这个目录) 并且还有一些其他的插件
│   ├── norm            # 公共规范配置 Eslint Husky 等
│   ├── core            # 整体导出
```

#### 组件库使用的一些工具
- components -> vue-tsc + vite
- docs -> vitepress
- hooks -> unbuild
- utils -> unbuild
- plugin -> unbuild
- norm 导出配置就完事了
- core -> unbuild
