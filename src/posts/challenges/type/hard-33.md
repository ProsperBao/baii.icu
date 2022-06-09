---
title: Object Key Paths
date: 2022-5-31 10:52:41
level: 3
levelTitle: Hard
---

[[toc]]

[题目来源(type-challenges)](https://github.com/type-challenges/type-challenges/blob/main/questions/07258-hard-object-key-paths/README.md)

### 问题

实现一个 [_.get](https://lodash.com/docs/4.17.15#get) 拿到所有索引的路径

```typescript
const ref = {
  count: 1,
  person: {
    name: 'cattchen',
    age: 22,
    books: ['book1', 'book2'],
    pets: [
      {
        type: 'cat',
      },
    ],
  },
}
ObjectKeyPaths<{ name: string; age: number }> // 'name' | 'age'
ObjectKeyPaths<{
  refCount: number
  person: { name: string; age: number }
}>,
// 'refCount' | 'person' | 'person.name' | 'person.age'
ObjectKeyPaths<typeof ref> // 'count'
ObjectKeyPaths<typeof ref> // 'person'
ObjectKeyPaths<typeof ref> // 'person.name'
ObjectKeyPaths<typeof ref> // 'person.age'
ObjectKeyPaths<typeof ref> // 'person.books'
ObjectKeyPaths<typeof ref> // 'person.pets'
ObjectKeyPaths<typeof ref> // 'person.books.0'
ObjectKeyPaths<typeof ref> // 'person.books.1'
ObjectKeyPaths<typeof ref> // 'person.books[0]'
ObjectKeyPaths<typeof ref> // 'person.books.[0]'
ObjectKeyPaths<typeof ref> // 'person.pets.0.type'
ObjectKeyPaths<typeof ref> // person.notExist -> never
```

### 解答

```typescript
type IsNumber<T> = T extends number ? `[${T}]` | `.[${T}]` : never

type ObjectKeyPaths<
  T extends object,
  Flag extends boolean = false,
  K extends keyof T = keyof T
> = K extends string | number
? (Flag extends true ? `.${K}` | IsNumber<K>: `${K}`) | 
  (
    T[K] extends Record<string, any>
      ? `${Flag extends true ? `.${K}` | IsNumber<K> : `${K}`}${ObjectKeyPaths<T[K], true>}`
      : never
  )
: never;
```

### 拆分

- 判断当前索引是否为字符串或数字
- 如果不是则返回 `never`
- 如果是则根据是否是第一层返回不同的结果的 `key`
- 并且联合上 `K` 索引的值
- 如果是对象则继续递归联合
