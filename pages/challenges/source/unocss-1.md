---
title: UnoCss
date: 2023-06-12 15:50:00
category: source
---

[[toc]]

## UnoCss 的核心逻辑

根据内置的正则表达式对文件内的所有文本进行提取，提取之后形成一个集合，通过内置+配置的静态动态规则，筛选出匹配的并且生成一个完整的css。

## UnoCss 的核心之一 extractor-arbitrary-variants

核心就是通过核心则三个正则表达式提取出可能的所有文本然后形成集合返回，传递给下一个处理器。

```typescript
export const quotedArbitraryValuesRE = /(?:[\w&:[\]-]|\[\S[^\s=]*=\S+\])+\[\\?['"]?\S+?['"]\]\]?[\w:-]*/g
// key=value 等等
export const arbitraryPropertyRE = /\[(\\\W|[\w-])+:[^\s:]*?("\S+?"|'\S+?'|`\S+?`|[^\s:]+?)[^\s:]*?\)?\]/g
// key:value 等等
const arbitraryPropertyCandidateRE = /^\[(\\\W|[\w-])+:['"]?\S+?['"]?\]$/
// key:value key 等等
```

`extractor-arbitrary-variants` 是默认的提取器，如果配置不同的处理器 `pug` `svelte` 能够提取不同的文本

## UnoCss 的核心之二 preset-mini

内置了非常多的动态处理规则和配置，从 `extractor-arbitrary-variants` 拿到匹配的文本之后就会通过静态动态规则进行分析处理
针对不同的 css 属性，提供了非常多的简写，可以通过不同的 `preset` 进行更多配置，比如支持 `wind` `rem-to-px` 等等

## UnoCss 的功能之一 preset-icons

主要提供了纯 css 的样式图标，并且支持非常多的开源库图标

## UnoCss 的功能之一 preset-typography

提供了一系列的文本预设，可以添加不同的文本排版类型

## UnoCss 的功能之一 preset-web-fonts

只需提供字体名称，即可使用来自Google Fonts和FontShare的网络字体。
但是不建议使用 Google Fonts 因为打包报错的频率非常高

## UnoCss 的功能之一 preset-tagify

允许直接在 html 文本中使用样式标签
