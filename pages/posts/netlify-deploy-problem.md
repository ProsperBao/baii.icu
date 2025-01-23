---
title: 在使用 Netlify 部署时遇到的问题
date: 2022-08-29 15:59:00
lang: zh
duration: 5min
description: 在使用 Netlify 部署时遇到的几个问题
---

[[toc]]

## 如何遇到的问题

最开始我想法做一个 `profile card` 类似的东西。

![ProsperBao](https://github-readme-stats.vercel.app/api?username=ProsperBao&show_icons=true)

就这个东西，很多人的 `profile` 花里胡哨的，所以我想能不能把我最近搞得一个娱乐项目提供一个这个东西。

说干就干，然后就开始了一通操作。

### 过程

最开始我是用 [canvas](https://github.com/Automattic/node-canvas) 这个库来写图片生成。

在本地开发的时候一切正常，除了是黑白的其他都没问题，想这先部署上去再说。

然后就报错了 [issues-1779](https://github.com/Automattic/node-canvas/issues/1779)。

原因是因为缺少环境变量，所以我把环境变量加上了，然后就可以了。

但是有一个问题，图片是黑白的，在本地我引入字体文件，彩色是没问题，但是到了 Netlify 上，由于是相对路径，又因为 nuxt 打包之后的运行环境隔离。

导致没有办法读取到字体文件。做了各种各样的尝试，遂放弃。

接下来我尝试 `fabricjs` 生成SVG图片。

本地可以生成，但是到服务器，超过云函数 50MB 的上限，直接报错。

最后我想到了 `jsdom` 在 node 环境尽可能的还原浏览器的 api。

最后我成功了，但是还有点问题。

### 第一个问题 Netlify 缺少环境变量

在 [issues-1779](https://github.com/Automattic/node-canvas/issues/1779) 中。

有老哥已经发现了云部署的问题，所以咱排除问题的速度直接加速。

最开始我尝试的是模仿 Next 在 Nuxt 的配置文件顶部加上了环境变量注入。

[issuecomment](https://github.com/Automattic/node-canvas/issues/1779#issuecomment-895885846)很可惜，失败了。

接下来我看到了我翻 issue 的时候忽视掉的一个老哥的评论，这个老哥也是 Netlify 部署，所以我尝试了一下他的方法，直接在后台设置环境变量。问题直接完美解决。

[issuecomment](https://github.com/Automattic/node-canvas/issues/1779#issuecomment-863510938)

### 第二个问题 `fabricjs` 超过云函数 50MB 的上限

这个问题奇奇怪怪，看 google 的大佬们的说法是

云函数用到了某个 lambda 函数的限制，最大 50MB。

所以直接放弃了 `fabricjs` 这个库

### 第三个问题 `jsdom` 中包含模拟 canvas 的 api 所以需要和问题一一样配置环境变量

`jsdom` 这个库主要是用来模仿 dom 操作来操作生成 Svg。

但是没有使用到 Canvas 这个 api，但是 `jsdom` 又依赖到了。

部署上去之后还是和问题一一个错误，所以也得配置环境变量。

### 终极解决方案

直接用字符串生成 svg
