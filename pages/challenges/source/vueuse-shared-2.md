---
title: VueUse - Shared - filters
date: 2022-08-03 10:06:00
category: source
---

[[toc]]

## filters VueUse的事件过滤系统

[事件过滤器](https://vueuse.org/guide/config.html#event-filters) 是 `vueuse` 中提供的一个特性，用于控制触发回调的时机。

始于 [使用事件过滤器提升扩展性与可组合性](https://github.com/vueuse/vueuse/issues/192) 这个 issue 意指提供一个全局统一的事件触发控制器，

## filters 内部包含的事件过滤器

### createFilterWrapper

为传入的回调函数创建一个过滤器，并返回一个包装器。

只需要对外返回一个调用时机，把触发时机交给外部。

在大部分默认情况下 `filter` 参数都默认是 `bypassFilter`

```typescript
export function createFilterWrapper<T extends FunctionArgs>(filter: EventFilter, fn: T) {
  function wrapper(this: any, ...args: any[]) {
    filter(() => fn.apply(this, args), { fn, thisArg: this, args })
  }

  return wrapper as any as T
}

export const bypassFilter: EventFilter = (invoke) => {
  return invoke()
}
```

### debounceFilter

防抖，每次至少间隔 `ms` 毫秒后才触发回调。

用于 `filter` 参数，传入即可实现

### throttleFilter

节流，每隔 `ms` 毫秒触发一次回调。

用于 `filter` 参数，传入即可实现

### pausableFilter

可暂停的过滤器，可以主动暂停

用于 `filter` 参数，传入即可实现

[VueUse - Shared - watchPausable](/challenges/source/vueuse-shared-1) 就是使用 `pausableFilter` 实现的。
