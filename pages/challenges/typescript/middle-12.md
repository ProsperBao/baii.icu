---
title: Trim
date: 2022-3-29 11:22:12
category: typescript-challenge>middle
---

[[toc]]

[题目来源(type-challenges)]()

### 问题
实现一个 `Trim<T>` 接收一个字符串，并去除两端空格，返回一个新的字符串。

例如：
```typescript
type trimed = Trim<'  Hello World  '> // 输出是 'Hello World'
```

### 解答
```typescript
type Trim<S extends string> = S extends `${' '| '\n'|'\t'}${infer L}`
  ? Trim<L>
  : S extends `${infer R}${' '| '\n'|'\t'}`
    ? Trim<R>
    : S
```

### 拆分
1. 和 [TrimLeft](/challenges/type/middle-11) 类似
