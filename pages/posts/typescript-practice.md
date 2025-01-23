---
title: Typescript 综合
date: 2022-6-06 14:25:08
lang: zh-CN
duration: 10min
description: Typescript 综合
type: learns
---

[[toc]]

类型编程的意义：需要动态生成类型的场景，必然要用类型编程做一些运算。有的场景下可以不用类型编程，但是用了能够有更精确的类型提示和检查。

### ParseQueryString

```typescript
type ParseParam<Param extends string> =
  Param extends `${infer Key}=${infer Value}`
    ? {
        [K in Key]: Value
      }
    : Record<string, unknown>

type MergeValues<One, Other> = One extends Other
  ? One
  : Other extends unknown[]
    ? [One, ...Other]
    : [One, Other]

type MergeParams<
  OneParam extends Record<string, unknown>,
  OtherParam extends Record<string, unknown>,
> = {
  readonly [Key in
  | keyof OneParam
  | keyof OtherParam]: Key extends keyof OneParam
    ? Key extends keyof OtherParam
      ? MergeValues<OneParam[Key], OtherParam[Key]>
      : OneParam[Key]
    : Key extends keyof OtherParam
      ? OtherParam[Key]
      : never
}

type ParseQueryString<Str extends string> =
  Str extends `${infer Param}&${infer Rest}`
    ? MergeParams<ParseParam<Param>, ParseQueryString<Rest>>
    : ParseParam<Str>

function parseQueryString<Str extends string>(
  queryStr: Str,
): ParseQueryString<Str> {
  if (!queryStr || !queryStr.length)
    return {} as any

  const queryObj = {} as any
  const items = queryStr.split('&')
  items.forEach((item) => {
    const [key, value] = item.split('=')
    if (queryObj[key]) {
      if (Array.isArray(queryObj[key]))
        queryObj[key].push(value)

      else
        queryObj[key] = [queryObj[key], value]

    }
    else {
      queryObj[key] = value
    }
  })
  return queryObj
}

const res = parseQueryString('a=1&b=2&c=3')

res.a // 获得类型提示
```

### Promise.all

```typescript
interface PromiseConstructor {
  all<T extends readonly unknown[] | []>(
    values: T,
  ): Promise<{
    -readonly [P in keyof T]: Awaited<T[P]>
  }>

  race<T extends readonly unknown[] | []>(
    values: T,
  ): Promise<Awaited<T[number]>>
}
```

T 的类型约束是 `unknown[] | []` 的原因是为了正确处理 `as const` 。

### Currying

柯里化

```typescript
type CurriedFunc<Args, R> = Args extends [infer F, ...infer Rest]
  ? (arg: F) => CurriedFunc<Rest, R>
  : R

declare function currying<F>(
  fn: F,
): F extends (...args: infer Args) => infer R ? CurriedFunc<Args, R> : never
```

### KebabCase2CamelCase

```typescript
type KebabCase2CamelCase<S extends string> =
  S extends `${infer F}-${infer Rest}`
    ? `${F}${KebabCase2CamelCase<Capitalize<Rest>>}`
    : S

// 尾递归
type KebabCase2CamelCase<
  S extends string,
  Res extends string = '',
> = S extends `${infer F}-${infer Rest}`
  ? KebabCase2CamelCase<Capitalize<Rest>, `${Res}${F}`>
  : `${Res}${S}`
```

### CamelCase2KebabCase

```typescript
type CamelCase2KebabCase<S extends string> = S extends `${infer F}${infer Rest}`
  ? `${F extends Lowercase<F>
    ? F
    : `-${Lowercase<F>}`}${CamelCase2KebabCase<Rest>}`
  : S

// 尾递归
type CamelCase2KebabCase<
  S extends string,
  Res extends string = '',
> = S extends `${infer F}${infer Rest}`
  ? CamelCase2KebabCase<
      Rest,
      `${Res}${F extends Lowercase<F> ? F : `-${Lowercase<F>}`}`
    >
  : Res
```

### chunk

将数组或元组中的元素按照指定的长度进行分组。

```typescript
type Chunk<
  Arr extends unknown[],
  Len extends number,
  Curr extends unknown[] = [],
  Res extends unknown[][] = [],
> = Arr extends [infer F, ...infer R]
  ? Curr['length'] extends Len
    ? Chunk<R, Len, [F], [...Res, Curr]>
    : Chunk<R, Len, [...Curr, F], Res>
  : [...Res, Curr]
```

### Tuple2NestedObject

```typescript
type Tuple2NestedObject<T, V> = T extends [infer F, ...infer R]
  ? {
      [P in F as P extends keyof any ? P : never]: Tuple2NestedObject<R, V>
    }
  : V
```

### PartialObjectPropByKeys

```typescript
type PartialObjectPropByKeys<
  Obj extends Record<string, unknown>,
  Key extends keyof any,
> = Partial<Pick<Obj, Extract<keyof Obj, Key>>> & Omit<Obj, Key>
```

### 函数重载

```typescript
// 第一种
declare function func(name: string): string
declare function func(name: number): number

// 第二种
interface Func {
  (name: string): string
  (name: number): number
}

// 第三种
type Func = ((name: string) => string) & ((name: number) => number)
```

### UnionToTuple

```typescript
type UnionToIntersection<T> = (
  T extends T ? (arg: T) => unknown : never
) extends (arg: infer R) => unknown
  ? R
  : never

type UnionToTuple<T> = UnionToIntersection<
  T extends any ? () => T : never
> extends () => infer R
  ? [...UnionToTuple<Exclude<T, R>>, R]
  : []

// 尾递归
type UnionToTuple<T, Res extends unknown[] = []> = UnionToIntersection<
  T extends any ? () => T : never
> extends () => infer R
  ? UnionToTuple<Exclude<T, R>, [R, ...Res]>
  : Res
```

说明：

1. 提取重载函数的返回值类型，始终返回最后一个重载的返回值类型
1. 已实现 `UnionToIntersection`
1. 提取 union 的每一种类型转为提取返回值为对应类型的函数的重载
1. 用 `Exclude` 将提取出的类型在下一次计算中剔除

### join

```typescript
declare function join<Delimiter extends string>(
  delimiter: Delimiter,
): <Items extends string[]>(...args: Items) => JoinType<Items, Delimiter>

type JoinType<
  Items extends unknown[],
  Delimiter extends string,
  Res extends string = '',
> = Items extends [infer F, ...infer R]
  ? JoinType<R, Delimiter, `${Res}${Delimiter}${F & string}`>
  : RemoveFirstDelimiter<Res>

type RemoveFirstDelimiter<S extends string> = S extends `${string}${infer R}`
  ? R
  : S

const res = join('-')('guang', 'and', 'dong') // let res: "guang-and-dong"
```

### DeepCamelize

```typescript
type DeepCamelize<Obj extends Record<string, any>> = Obj extends unknown[]
  ? CamelizeArr<Obj>
  : {
      [Key in keyof Obj as Key extends `${infer First}_${infer Rest}`
        ? `${First}${Capitalize<Rest>}`
        : Key]: DeepCamelize<Obj[Key]>
    }

type CamelizeArr<Arr> = Arr extends [infer First, ...infer Rest]
  ? [DeepCamelize<First>, ...CamelizeArr<Rest>]
  : []
```

### Defaultize

实现这样一个高级类型，对 A、B 两个索引类型做合并，如果是只有 A 中有的不变，如果是 A、B 都有的就变为可选，只有 B 中有的也变为可选。

```typescript
type Defaultize<A, B> = Pick<A, Exclude<keyof A, keyof B>> &
Partial<Pick<A, Extract<keyof A, keyof B>>> &
Partial<Pick<B, Exclude<keyof B, keyof A>>>

type Defaultize<A, B> = Omit<A, keyof B> & Partial<B>
```
