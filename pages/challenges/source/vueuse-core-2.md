---
title: VueUse - Core - useColorMode
date: 2022-07-12 16:50:00
category: source
---

[[toc]]

## useColorMode/useDark 不同主题模式的切换

现在很多网站暗色/亮色模式，都是标配，也就衍生出了这个模式切换的 hook。

`useDark` 是基于 `useColorMode` 的二次封装 所以只要阅读 `useColorMode` 即可

## useColorMode

#### 传入参数方式

主要传入一个配置对象，所有的配置都是可选的，如果不传入，默认使用默认配置

```typescript
export interface UseColorModeOptions<T extends string = BasicColorSchema> extends StorageOptions<T | BasicColorSchema> {
  selector?: string // 应用于的目标元素的CSS选择器 默认 -> html
  attribute?: string // 应用目标元素的HTML属性 默认 -> class
  modes?: Partial<Record<T | BasicColorSchema, string>> // 向属性添加值时的前缀
  // 用于处理更新的自定义处理程序。指定后，将覆盖默认行为 默认 -> undefined
  onChanged?: (mode: T | BasicColorSchema, defaultHandler:((mode: T | BasicColorSchema) => void)) => void
  storageRef?: Ref<T | BasicColorSchema> // 自定义存储 ref
  storageKey?: string | null // 自定义存储键 默认 -> 'vueuse-color-scheme'
  storage?: StorageLike// 自定义存储
  emitAuto?: boolean // 当设置为'true'时，首选模式不会转换为'light'或'dark' 默认 -> false
}
```

#### 主体逻辑

1. 首先从传入的 `options` 解构并初始化默认值

```typescript
const {
  selector = 'html',
  attribute = 'class',
  window = defaultWindow,
  storage,
  storageKey = 'vueuse-color-scheme',
  listenToStorageChanges = true,
  storageRef,
  emitAuto,
} = options
```

2. 根据传入的 `options.modes` 和默认的 modes 合并

```typescript
const modes = {
  auto: '',
  light: 'light',
  dark: 'dark',
  ...options.modes || {},
} as Record<BasicColorSchema | T, string>
```

3. 根据浏览器或者个人配置是否首选黑暗模式

```typescript
const preferredDark = usePreferredDark({ window })
const preferredMode = computed(() => preferredDark.value ? 'dark' : 'light')
```

4. 判断是否使用持久化缓存模式配置，首选是使用用户传入的类缓存仓库，如果没传则看是否清空了缓存 key，如果清空了则使用临时 ref 不进行缓存，如果没有更改则使用默认的配置，`listenToStorageChanges` 监听缓存修改同步更改状态

```typescript
const store = storageRef || (storageKey == null
  ? ref('auto') as Ref<T | BasicColorSchema>
  : useStorage<T | BasicColorSchema>(storageKey, 'auto', storage, { window, listenToStorageChanges }))
```

5. 保存当前模式并返回，在默认情况下如果当前模式是 `auto` 则是读取用户的首选浏览器首选配置，如果启用了 `emitAuto` 则 auto 模式失效

```typescript
const state = computed<T | BasicColorSchema>({
  get() {
    return store.value === 'auto' && !emitAuto
      ? preferredMode.value
      : store.value
  },
  set(v) {
    store.value = v
  },
})
```

6. 为了兼容服务端渲染所以需要确认是否在 `__vueuse_ssr_handlers__` 中已经存在过，如果存在则直接调用已经存储的方法

```typescript
  const updateHTMLAttrs = getSSRHandler(
  'updateHTMLAttrs',
  (selector, attribute, value) => {
    ...
  })
```

7. 启动一个监听器，根据是否传入了 `options.onChanged` 来确认是否覆盖默认触发行为，如果传入了，则提供当前修改后的模式以及默认触发行为

```typescript
function defaultOnChanged(mode: T | BasicColorSchema) {
  const resolvedMode = mode === 'auto' ? preferredMode.value : mode
  updateHTMLAttrs(selector, attribute, modes[resolvedMode] ?? resolvedMode)
}

function onChanged(mode: T | BasicColorSchema) {
  if (options.onChanged)
    options.onChanged(mode, defaultOnChanged)
  else
    defaultOnChanged(mode)
}

watch(state, onChanged, { flush: 'post', immediate: true })
```

8. 默认触发行为，则是根据是否修改了设置属性来触发对应的行为，如果值是默认的 `class` 则会相对应的添加以及删除类名，如果设置了别的属性则直接设置相对应的属性

```typescript
const el = window?.document.querySelector(selector)
if (!el)
  return

if (attribute === 'class') {
  const current = value.split(/\s/g)
  Object.values(modes)
    .flatMap(i => (i || '').split(/\s/g))
    .filter(Boolean)
    .forEach((v) => {
      if (current.includes(v))
        el.classList.add(v)
      else
        el.classList.remove(v)
    })
}
else {
  el.setAttribute(attribute, value)
}
```

9. 尝试在组件 `onMounted` 的时候初始化 hook 功能

- Q: 为什么是尝试呢？
- A: 因为在有些情况下不存在组件生命周期，则需要在 DOM 成功挂载之后才能进行处理
