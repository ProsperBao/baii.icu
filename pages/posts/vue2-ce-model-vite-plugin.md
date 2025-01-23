---
title: unplugin-ce-model-vue2 支持vue2的v-model
date: 2023-06-30 15:00:00
lang: zh
duration: 10min
description: unplugin-ce-model-vue2 支持vue2的v-model
---

[[toc]]

## 背景故事
在前一篇文章 [升级架构和迭代工具库](./upgrade-technology) 中提到，同时兼容 vue2/vue3 是最后决定使用了 webcomponent。
其中就涉及到了 `v-model` 的问题，在 vue2 中如何在 vue3 包装出来的 webcomponent 使用 `v-model`。

vue2 中的 `v-model` 不适合 webcomponent 因为 webcomponent 实际上的触发事件是一个 `CustomEvent` 与 vue2 中双向绑定的事件不兼容。
所以就有了以下的插件

### 开发插件
因为有了工具库，所以选择将 unplugin-ce-model-vue2 作为工具库携带的插件开发。

为了以后的扩展性选择使用，也看到了插件命名，所以选择使用了 `unplugin` 这个库，这个库提供了兼容多个打包工具的输出，我很喜欢 unxxx 这个系列的插件，都非常好用 `unplugin` `unbuild` `uncomponent` 等等。

首先就是要确定怎么修改，因为只是作为简单的过度插件，并且不影响原有的 `v-model` 所以就准备另起一个名字叫做 `v-ce-model` 专门用来支持 webcomponent 的 `v-model`。然后确定 vue2 的支持版本是 vue2.7，就准备在 vue 模板编译 sfc 之后的形成了一个 js 文件最后进行修改，直接将指令变更为 `属性+事件` 的方式。

### 开发思路
因为一些 vite 和 unplugin 的插件看了不少代码所以对一些工具库还是有了解的直接梭哈。

- `magic-string` 用来修改代码，并且生成 sourcemap
- `estree-walker-ts` 用来遍历 ast
- `@babel/parser` 用来解析 js 代码

接下来就是确定 `v-ce-model` 生效的范围了

1. 在 `transformInclude` 钩子中确定一定要是 `.vue` 文件
2. 文件中包含编译之后的指令 `ce-model`
3. 确定文件时 sfc 编译
4. 确定 render vnode 函数 `_c`
5. 确定指令集，收集指令 `value` 是 `ce-model` 指令，拿出来之后将指令删除
6. 确认原先是否有 attr 和 on 这两个属性，如果有就将之合并进去
7. 确认原先没有 attr 和 on 这两个属性，就创建一个

在收集指令 `value` 是 `ce-model` 指令的时候在没有默认跟 vue3 一样使用 `model-value`

以下为实验代码

```typescript
import { createUnplugin } from 'unplugin'
import MagicString from 'magic-string'
import { walk } from 'estree-walker-ts'
import { parse as babelParse } from '@babel/parser'
import { EnterNode, LeaveParent, enter } from './walk'
export {
  viteVueCEVModel,
  rollupVueCEVModel,
  webpackVueCEVModel,
  esbuildVueCEVModel
} from '@unplugin-vue-ce/v-model'

const unplugin = createUnplugin(() => {
  return {
    name: `unplugin-ce-model-v2`,
    enforce: 'post',
    transformInclude(id: string) {
      return id.includes('.vue')
    },
    async transform(code: string, id: string) {
      if (!code.includes('ce-model')) {
        return
      }
      const mgcStr = new MagicString(code)

      const ast = babelParse(mgcStr.toString(), { sourceType: 'module' })

      const _walk = walk as any
      _walk(ast, {
        enter(node: EnterNode, parent: LeaveParent) {
          enter(mgcStr, node, parent)
        },
        leave(node: EnterNode, parent: LeaveParent) {
          enter(mgcStr, node, parent, 'leave')
        },
      })

      return {
        code: mgcStr.toString(),
        get map() {
          return mgcStr.generateMap({
            source: id,
            includeContent: true,
            hires: true,
          })
        },
      }
    },
  }
})

export const viteVueCEVModelV2 = unplugin.vite
export const rollupVueCEVModelV2 = unplugin.rollup
export const webpackVueCEVModelV2 = unplugin.webpack
export const esbuildVueCEVModelV2 = unplugin.esbuild
```


```typescript
// walk.ts
import type { MagicStringBase } from 'magic-string-ast'
import type { FunctionExpression, CallExpression, Identifier, VariableDeclarator, ObjectExpression, ArrayExpression, ObjectProperty, StringLiteral } from '@babel/types'

export type CeModels = Record<string, string>[]

function isSfcRender(node: FunctionExpression, parent: VariableDeclarator) {
  return node.type === "FunctionExpression" && (<Identifier>parent.id)?.name === "_sfc_render"
}

export function isVNodeProperty(node: ObjectExpression, parent: CallExpression) {
  return node.type === 'ObjectExpression'
    && (<CallExpression>parent).type === 'CallExpression'
    && (<Identifier>parent.callee)?.name === ' '
}

function isDirective(node: ArrayExpression, parent: ObjectProperty) {
  return node.type === "ArrayExpression"
    && parent.type === 'ObjectProperty'
    && (<Identifier>parent.key)?.name === 'directives'
}

function isCeModel(node: ObjectExpression) {
  return node.properties.some((p) =>
    (<Identifier>(<ObjectProperty>p).key)?.name === 'name' &&
    (<StringLiteral>(<ObjectProperty>p).value).value === 'ce-model'
  )
}

function collectCeModel(node: ArrayExpression) {
  const ceModel: Record<string, string>[] = []
  const elements = <ObjectExpression[]>node.elements
  elements
    .filter(n => isCeModel(n))
    .forEach((n) => {
      const obj: Record<string, any> = {}
      n.properties.forEach((p) => {
        const key = (<Identifier>(<ObjectProperty>p).key)?.name
        if (key === 'value') {
          return
        }
        const value = (<StringLiteral>(<ObjectProperty>p).value).value
        if (key === 'expression') {
          obj[key] = `_setup.${value}`
        } else {
          obj[key] = value
        }
      })
      obj._start = n.start
      obj._end = n.end
      ceModel.push(obj)
    })
  return ceModel.map(i => ({
    ...i,
    arg: i.arg ?? 'model-value',
  }))
}

function isAttrs(node: ObjectProperty) {
  return node.type === 'ObjectProperty' && (<Identifier>node.key)?.name === 'attrs'
}

function isEmits(node: ObjectProperty) {
  return node.type === 'ObjectProperty' && (<Identifier>node.key)?.name === 'on'
}

function formateAttrs(ceModels: CeModels) {
  return ceModels.map(i => `"${i.arg}":${i.expression}`).join(',')
}

function formateEmits(ceModels: CeModels) {
  // ce-model only receive first value
  // if you want to receive all values, you need manual bind event
  return ceModels.map(i => `"update:${i.arg}":function(e){${i.expression}=e.detail[0]}`).join(',')
}


let isVueSfcRender = false
let isVuePropertyRange = false
let vNodeCeModels: CeModels = []
let hasAttrs = false
let hasEmits = false

export type EnterNode = FunctionExpression | ObjectExpression | ArrayExpression | ObjectProperty
export type LeaveParent = VariableDeclarator | CallExpression | ObjectProperty

export function enter(
  mgcStr: MagicStringBase,
  node: EnterNode,
  parent: LeaveParent,
  type: 'enter' | 'leave' = 'enter'
) {
  if (isSfcRender(<FunctionExpression>node, <VariableDeclarator>parent)) {
    isVueSfcRender = type === 'enter'
  }

  if (isVueSfcRender && isVNodeProperty(<ObjectExpression>node, <CallExpression>parent)) {
    if (type === 'enter') {
      isVuePropertyRange = true
    } else {
      // have ce-model
      if (vNodeCeModels.length) {
        // don't have, insert
        // if it was originally present, it will not be processed here
        !hasAttrs && mgcStr.appendLeft(node.end! - 1, `,attrs:{${formateAttrs(vNodeCeModels)}}`)
        !hasEmits && mgcStr.appendLeft(node.end! - 1, `,on:{${formateEmits(vNodeCeModels)}}`)
      }
      // leave node must reset
      vNodeCeModels = []
      hasAttrs = false
      hasEmits = false
      isVuePropertyRange = false
    }
  }

  if (isVuePropertyRange && isDirective(<ArrayExpression>node, <ObjectProperty>parent)) {
    if (type === 'enter') {
      vNodeCeModels = collectCeModel(<ArrayExpression>node)
    } else {
      // remove directives
      // TODO: If the original instruction exists when AST is deleted, it will cause [,xxx]
      // TODO: If the instruction is empty after removal, it will be eliminated
      vNodeCeModels.forEach((i) => mgcStr.remove(+i._start, +i._end))
    }
  }

  if (isVuePropertyRange && isAttrs(<ObjectProperty>node)) {
    if (type === 'enter') {
      hasAttrs = true
    } else {
      vNodeCeModels.length && mgcStr.appendLeft(node.end! - 1, `,${formateAttrs(vNodeCeModels)}`)
    }
  }

  if (isVuePropertyRange && isEmits(<ObjectProperty>node)) {
    if (type === 'enter') {
      hasEmits = true
    } else {
      vNodeCeModels.length && mgcStr.appendLeft(node.end! - 1, `,${formateEmits(vNodeCeModels)}`)
    }
  }
}
```


```typescript
// playground/v2/vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import Inspect from 'vite-plugin-inspect'
import Inspector from 'vite-plugin-vue-inspector'
import { viteVueCEVModelV2 } from '../../packages/utils/index'

export default defineConfig({
  plugins: [
    vue(),
    viteVueCEVModelV2(),
    Inspect(),
    Inspector({ toggleButtonVisibility: 'never' }),
  ]
})

```

```typescript
// playground/v2/src/main.ts
import Vue from 'vue'
import App from './App.vue'
import { register } from '@loveuse/components'

register()

new Vue({
  render: h => h(App),
}).$mount('#app')
```

```vue
<script setup>
import { ref, watch } from 'vue'
const value = ref('1111')

function a() {
  value.value = '2222'
}
</script>

<template>
  <div>
    <l-success-button v-ce-model="value" v-ce-model:test="value" /> || {{ value }}
    <button @click="a">
      111
    </button>
  </div>
</template>
```
