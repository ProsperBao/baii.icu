---
title: VueUse - Core - useEventListener
date: 2022-07-12 15:50:00
level: 1
levelTitle: VueUse
---

[[toc]]

## VueUse 用到的比较多的一个 hook

VueUse 大部分的 hook 都是对浏览器操作的一些封装，在使用的时候经常是只需要在使用该 hook 的组件运行时需要，当组件卸载之后就不需要了。

所以 VueUse 大部分 hook 都是基于 `useEventListener` 这一个 hook 拼装组合完成的。

## useEventListener

#### 传入参数方式

`useEventListener` 有5个函数的重写简单总结一下

```typescript
  /**
   * @param {string} event - 事件名称
   * @param {MaybeRef | document | window} target - 目标元素
   * @param {Event} listener - 处理事件
   * @param {InferEventTarget} options - 配置项
   */
  useEventListener(event, listener, options)
  useEventListener(target, event, listener, options)
```

参数的解析和确定:

![image.png](https://s2.loli.net/2022/07/12/lQ3B1W56teVUrIY.png)

简单说就是第一个参数如果不是字符串就不需要使用默认的 `target`, 默认的 `target` 在非服务器渲染下是指向 window

```typescript
  // package/core/useEventListener
  if (isString(args[0])) {
    [event, listener, options] = args
    target = defaultWindow
  }
  else {
    [target, event, listener, options] = args
  }
  // package/core/_configurable
  export const defaultWindow = /* #__PURE__ */ isClient ? window : undefined
```
#### 主体逻辑

如果并没有传入 `target` 同时第一个参数也不是字符串则直接返回一个空函数，中断后续执行

1. 首先会声明一个用来保存解除事件绑定的临时变量，之后在解除绑定的时候把临时变量设置为空释放当前函数占用的内存
  ```typescript
    let cleanup = noop
    ...
      cleanup = () => {
        el.removeEventListener(event, listener, options)
        cleanup = noop
      }
    ...
  ```

2. 对 `target` 使用 `watch` 监听，当 `target` 改变时则会引起事件的重新绑定，并解除之前的绑定
  ```typescript
    const stopWatch = watch(
      () => unrefElement(target as unknown as MaybeElementRef),
      (el) => {
        cleanup()
        if (!el)
          return

        el.addEventListener(event, listener, options)

        cleanup = () => {
          el.removeEventListener(event, listener, options)
          cleanup = noop
        }
      },
      { immediate: true, flush: 'post' },
    )
  ```

3. 在当前活跃的 effect 作用域上注册作用域关闭事件，以用来停止绑定和释放内存
  ```typescript
    const stop = () => {
      stopWatch()
      cleanup()
    }

    tryOnScopeDispose(stop)
  ```
4. 最后返回一个手动停止函数

- 在 `watch` 中有使用到 `unrefElement`
  - target 有可能是 dom 也可能是 ref 包装过的
  - `unrefElement` 可以保证拿到的一定是原始值
- `tryOnScopeDispose` 中则是向当前活跃的 effect 作用域上注册 `onScopeDispose` 作用域关闭事件
