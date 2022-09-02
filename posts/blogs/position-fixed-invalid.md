---
title: position:fixed 定位失效
date: 2022-09-02 09:52:00
lang: zh-CN
duration: 6min
description: position:fixed 定位失效
---

[[toc]]

position:fixed 在日常的页面布局中非常常用, 在许多布局中起到了关键的作用。它的作用是: 

position:fixed 的元素将相对于屏幕视口（viewport）的位置来指定其位置。并且元素的位置在屏幕滚动时不会改变。

但是, 在许多特定的场合, 指定了 position:fixed 的元素却无法相对于屏幕视口进行定位。

## 失效的 position:fixed

在许多情况下, position:fixed 将会失效。

(MDN)[https://developer.mozilla.org/zh-CN/docs/Web/CSS/position] 用一句话概括了这种情况: 

当元素祖先的 transform 属性非 none 时, 容器由视口改为该祖先。
通俗的讲就是指定了 position:fixed 的元素, 如果其祖先元素存在非 none 的 transform 值 , 那么该元素将相对于设定了 transform 的祖先元素进行定位。

那么, 为什么会发生这种情况呢？

这个问题, 就牵涉到了 Stacking Context , 也就是堆叠上下文的概念了。解释上面的问题分为两步: 

任何非 none 的 transform 值都会导致一个堆叠上下文和包含块的创建。

由于堆叠上下文的创建, 该元素会影响其子元素的固定定位。设置了 position:fixed 的子元素将不会基于 viewport 定位, 而是基于这个父元素。

## 创建堆叠上下文的方式

如何触发一个元素形成 堆叠上下文
方法如下(参考自 (MDN)[https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context]):

- 根元素 (HTML)
- z-index 值不为 "auto"的 绝对/相对定位
- 一个 z-index 值不为 "auto"的 flex 项目 (flex item), 即: 父元素 display: flex|inline-flex
- opacity 属性值小于 1 的元素（参考 the specification for opacity）
- transform 属性值不为 "none"的元素
- mix-blend-mode 属性值不为 "normal"的元素
- filter值不为 "none" 的元素
- perspective值不为 "none" 的元素, 
- isolation 属性被设置为 "isolate"的元素
- position: fixed
- 在 will-change 中指定了任意 CSS 属性, 即便你没有直接指定这些属性的值
- -webkit-overflow-scrolling 属性被设置 "touch"的元素
- backdrop-filter 值不为 "none" 的元素

## position:fixed 失效的最终原因

并不是所有能够生成层叠上下文的元素都会使得 position:fixed 失效, 但也不止 transform 会使 position:fixed 失效。

所以, MDN 关于 position:fixed 的补充描述不够完善。下述 7 种方式目前都会使得 position:fixed 定位的基准元素改变(本文重点): 

- ransform 属性值不为 none 的元素
- 设置了 transform-style: preserve-3d 的元素
- erspective 值不为 none 的元素
- 在 will-change 中指定了任意 CSS 属性
- 设置了 contain: paint
- ilter值不为 none 的元素
- ackdrop-filter 值不为 none的元素

### 兼容性问题

每个浏览器都有不同的兼容问题，需要针对每个浏览器做兼容。

