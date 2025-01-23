---
title: String to Union
date: 2022-3-31 12:08:46
category: typescript-challenge>middle
---

[[toc]]

[题目来源(type-challenges)](https://github.com/type-challenges/type-challenges/blob/master/questions/531-medium-string-to-union/README.md)

### 问题
实现字符串到联合类型。输入字符串参数。输出应该是输入字母的并集

例如
```typescript
type Test = '123';
type Result1 = StringToUnion<Test>; // "1" | "2" | "3"
type Result2 =StringToUnion<"coronavirus"> // "c" | "o" | "r" | "o" | "n" | "a" | "v" | "i" | "r" | "u" | "s">>
```

### 解答
```typescript
type StringToUnion<T extends string> = 
  T extends `${infer F}${infer Rest}`
    ? Rest extends ""
      ? F
      : StringToUnion<Rest> | F
    : never
```

### 拆分
1. 通过不断拆分字符串，直到字符串为空
2. 每次都返回拆分字符串的首字符和当前的结果组成并集
