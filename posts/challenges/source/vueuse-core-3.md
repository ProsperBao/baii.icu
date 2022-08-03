---
title: VueUse - Core - useStorage
date: 2022-08-03 14:18:00
level: 1
levelTitle: VueUse
---

[[toc]]

## useStorage 响应式数据存储

在 VueUse 中，使用频率非常高的一个 `api`，可以传入一个 `StorageLike` 类存储的对象，可以实现数据响应式存储。

比如直接传入 `SessionStorage`、`LocalStorage` 等，或者自己实现一个 `StorageLike` 对象。

可以直接通过自定义类存储对象，实现 `IndexDB`、`服务器缓存同步` 等数据响应式存储。

## useStorage 的类存储对象

在 `StorageLike` 的类型定义文件中，可以看到还有其他的类型定义。

```typescript
export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}
```

比如 `StorageLikeAsync` 异步的类存储对象，这个就是可以实现服务器缓存同步的类型定义。

```typescript
export interface StorageLikeAsync {
  getItem(key: string): Awaitable<string | null>
  setItem(key: string, value: string): Awaitable<void>
  removeItem(key: string): Awaitable<void>
}
```

还有 `SSRHandlersMap` 用于服务器渲染，实现 `SSR` 的类型定义。

```typescript
export interface SSRHandlersMap {
  getDefaultStorage: () => StorageLike | undefined
  getDefaultStorageAsync: () => StorageLikeAsync | undefined
  updateHTMLAttrs: (selector: string, attribute: string, value: string) => void
}
```

`getDefaultStorage`、`getDefaultStorageAsync` 用于存储服务器上处理好之后序列化的类存储。

`updateHTMLAttrs` 则是用于处理颜色模式切换。

## 执行逻辑
1. 首先拿到传入的参数配置 `key`、`defaults`、`storageAsync`、`options`。
  ```typescript
  key: string, // 存储的 key
  defaults: MaybeComputedRef<T>, // 默认的值，可以是一个ref，也可以是一个常量值。
  storage: StorageLike | undefined, // 存储的对象，如果没有传入，则使用默认的。 默认则是 `LocalStorage`。
  options: UseStorageOptions<T> = {}, // 其他配置项
  ```
2. 初始化数据，根据 options 是否传入 `shallow` 字段，来决定是浅响应。
  ```typescript
  const data = (shallow ? shallowRef : ref)(defaults) as RemovableRef<T>
  ```
  因为 `shallow`、`ref` 的特性并不会二次包裹。
3. 如果没有传入类存储，则表示有可能是服务端渲染，需要从 ssr 中拿去服务端上定义好的存储并加载
  ```typescript
    if (!storage) {
      try {
        storage = getSSRHandler('getDefaultStorage', () => defaultWindow?.localStorage)()
      }
      catch (e) {
        onError(e)
      }
    }
  ```
  - 如果加载失败则直接返回响应式数据，并不会同步缓存
4. 获取初始化数据类型，根据初始化数据类型加载序列化反序列化
  ```typescript
    const rawInit: T = resolveUnref(defaults)
    const type = guessSerializerType<T>(rawInit)
    const serializer = options.serializer ?? StorageSerializers[type]
  ```
  - 通过 `guessSerializerType` 拿取默认值的类型
  - 如果没有传入自定义的序列化和反序列化函数则从默认的序列化和反序列化函数中拿取
5. 使用 [可暂停的 watch](/challenges/source/vueuse-shared-1) 来防止间隔时间短多次触发变更，在数据读取中暂停数据变更以及保存
  - 默认 `watch` 触发时间为 `pre`
  - 默认深层监听
  - 默认情况下 `eventFilter` 为空，即使用默认的 `bypassFilter`。
  - 每次数据变更的时候直接使用 `write` 更新缓存数据。
6. 第一初始化的时候直接读取一次缓存数据
7. 如果有设置 `listenToStorageChanges` 决定是否监听浏览器的类存储变更
