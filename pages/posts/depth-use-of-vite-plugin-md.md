---
title: 在 Markdown 中使用 script setup
date: 2022-06-30 15:53:00
lang: zh
duration: 10min
description: vite-plugin-md 在 Markdown 中使用 script setup
---

[[toc]]

## 缘由

在 `vite-plugin-md` 迭代中 `0.13 -> 0.14` 版本，有数个功能使用方法改变或者失效

详情 

[Failed to use Vue component in markdown](https://github.com/antfu/vite-plugin-md/issues/90) 

和 

[Cannot use &lt;script lang= "ts" setup&gt; in markdown](https://github.com/antfu/vite-plugin-md/issues/91)


## 如何查找到错误原因以及如何发现新的使用方法的

### 查找错误原因

在发现第一个问题之后我检查了 `inspect` 里的内容，发现是大小写转换出现问题。

接下来我查看了 `antfu` 的博客，但是我发现使用的命名确实没有问题，我就觉得可能是版本问题。

当我返回到 `0.13` 的时候，并没有大小写转换这个问题。

可以认为是在迭代 `0.14` 的版本出现了问题，所以我选择锁定以来版本并打开了一个 issue 。

在接下来 issue 的讨论中 [yankeeinlondon](https://github.com/yankeeinlondon) 这位老哥，也是为我解答了一些疑惑。

这位老哥认为目前组件使用的命名规范是不符合 `HTMl5` 的标签命名规范的所以加了一个转换组件大小写。

但是这样子和 `Vue` 开发者们比较熟悉的命名冲突了，所以导致了这样一个 bug。

但是不能强制使用 `Vue` 的命名规范，所以这个老哥迭代了一个转换，以支持 `Vue` 的命名规范。

### 发现新大陆

发现了一个 bug 之后我对 `vite-plugin-md` 的兴趣就更浓郁了。我 fork 了一个仓库。

然后深入的看了一下 `vite-plugin-md` 的代码，然后我发现 test 目录下的一个比较特殊的目录。

然后我发现 `vite-plugin-md` 居然可以直接在里面写 `script setup`，我立马动手尝试。

但是我发现，这个测试用例好像被跳过了，最初应该是可以通过的，然后我使用了一下。

嗯，确实没有效果，会报错，我认为这不是 antfu 最初的想法，我又提价了一个 issue ，说明了这个问题。

后续证明，确实这个是一个 bug，在修复之后可以使用了，我便写下这篇文章。

## 新的使用方式

可以直接在 markdown 里面像写 vue 组件一样，可以写复数的 `template` `script` `style`。

比如这样：

<template>
  <div>
    <button border rd p-x-2 @click="add">++</button> 计数:<span> {{ count }}</span>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const count = ref(0)

const add = () => {
  count.value++
}
</script>

```typescript
<template>
  <div>
    <button border rd p-x-2 @click="add">++</button> 计数:<span> {{ count }}</span>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const count = ref(0)

const add = () => {
  count.value++
}
</script>

```

还可以这样


<template>
  <div>
    <button border rd p-x-2 @click="toggleLocales">切换语言</button> {{ t('button.about') }}
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

const { t, availableLocales, locale } = useI18n()
const toggleLocales = () => {
  const locales = availableLocales
  locale.value = locales[(locales.indexOf(locale.value) + 1) % locales.length]
}
</script>

```typescript
<template>
  <div>
    <button border rd @click="toggleLocales">切换语言</button> {{ t('button.about') }}
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

const { t, availableLocales, locale } = useI18n()
const toggleLocales = () => {
  const locales = availableLocales
  locale.value = locales[(locales.indexOf(locale.value) + 1) % locales.length]
}
</script>
```


## 遗憾

但是有点遗憾 `vite-plugin-md` 不会通过 `auto-import` 所以用到的函数都必须自己导入。
