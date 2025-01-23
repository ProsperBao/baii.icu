---
title: Exclude
date: 2022-03-20 14:55:00
category: typescript-challenge>easy
---

[[toc]]

[题目来源(type-challenges)](https://github.com/type-challenges/type-challenges/blob/master/questions/18-easy-tuple-length/README.zh-CN.md)
### 问题
实现内置的 `Exclude <T，U>` 类型，但不能直接使用它本身。
>从联合类型T中排除U的类型成员，来构造一个新的类型。

### 解答

```typescript
type MyExclude<T, U> = T extends U ? never : T
```

### 拆分
1. 注意是联合类型，从联合类型 `T` 中排除 `U` 的类型成员，来构造一个新的类型
2. `T extends U` 如果 `T` 是 `U` 的子集则返回 `never`，否则返回 `T`
3. 联合类型会自动分发类型
4. `type T = Exclude<1 | 2, 1 | 3> // -> 2`
5. 4自动分发后的类型等于 (1 extends 1 | 3 ? never : 1) | (2 extends 1 | 3 ? never : 2)
