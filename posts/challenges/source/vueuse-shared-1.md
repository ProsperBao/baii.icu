---
title: VueUse - Shared - watchPausable
date: 2022-07-12 16:50:00
level: 1
levelTitle: VueUse
---

[[toc]]

## watchPausable 可暂停的监听器

`watch` 可暂停版本，可以控制执行回调的时机。

在需要限制触发时机或者触发频率的时候很有用

## watchPausable

#### 传入参数方式

```typescript
/**
 * @param {any} source - 需要监听的目标
 * @param {Function} cb - 回调函数
 * @param {InferEventTarget} options - 配置项
 */

watchPausable(
  source: any,
  cb: any,
  options: WatchWithFilterOptions<Immediate> = {},
)
```
#### 主体逻辑
1. 通过一个可暂停的事件过滤器来实现暂停时跳过触发的效果
```typescript
const { eventFilter, pause, resume, isActive } = pausableFilter(filter)
```
2. 通过包装 `watch` 实现过滤器监听触发功能
```typescript
const stop = watchWithFilter(
  source,
  cb,
  {
    ...watchOptions,
    eventFilter,
  },
)
```

#### 涉及到的事件过滤器

[事件过滤器](https://vueuse.org/guide/config.html#event-filters) 是 `vueuse` 中提供的一个特性，用于控制触发回调的时机。

##### pausableFilter

可以用于暂停某些事件的回调执行，内部是用激活标识来控制是否执行回调的。

```typescript
export function pausableFilter(extendFilter: EventFilter = bypassFilter): Pausable & { eventFilter: EventFilter } {
  const isActive = ref(true)

  function pause() {
    isActive.value = false
  }
  function resume() {
    isActive.value = true
  }

  const eventFilter: EventFilter = (...args) => {
    if (isActive.value)
      extendFilter(...args)
  }

  return { isActive, pause, resume, eventFilter }
}

```

##### watchWithFilter

可用于控制 `watch` 的触发时机，内部默认是用 `eventFilter` 来控制触发的时机。

```typescript
export function watchWithFilter<Immediate extends Readonly<boolean> = false>(
  source: any,
  cb: any,
  options: WatchWithFilterOptions<Immediate> = {},
): WatchStopHandle {
  const {
    eventFilter = bypassFilter,
    ...watchOptions
  } = options

  return watch(
    source,
    createFilterWrapper(
      eventFilter,
      cb,
    ),
    watchOptions,
  )
}

```
