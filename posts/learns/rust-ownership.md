---
title: Rust 所有权
date: 2022-09-14 10:52:00
lang: zh-CN
duration: 15min
description: Rust 所有权
type: learns
---

[[toc]]

## Rust 所有权

### 所有权规则
1. Rust 中的每一个值都有一个 *所有者*。
2. 值在任一时刻有且只有一个 *所有者*。
3. 当 *所有者* （变量）离开作用域，这个值将被丢弃。

### 变量作用域
1. 当变量 *进入作用域* 时，它就是有效的。
2. 这一直持续到它 *离开作用域* 为止。

```rust
{ // s 在这里无效, 它尚未声明
  let s = "hello";   // 从此处起，s 是有效的
  // 使用 s
} // 此作用域已结束，s 不再有效
```

部分变量是否有效与作用域的关系跟其他编程语言是类似的。String 类型就是一个不一样的例子。


### 内存与分配

在常见有 *垃圾回收* 的语言当中会记录并清除不再使用的内存，而在 Rust 中，则采取了变量离开作用于后会被自动释放的方式。

```rust
fn main() {
  let s = "hello"; // s 是有效的
} // 此作用域已结束，s 不再有效
```

Rust 会在作用域结束之后自动调用 `drop` 函数来释放内存。

#### 移动

在 Rust 中一个变量分配给另一个变量时，第一个变量将不再有效。这种行为被称为 *移动*，标量类型（存储在栈上的数据类型除外）。

但是在其他大部分语言中，第一个变量并不会失效，第二个变量只变成浅拷贝的状态。

```rust
fn main() {
  let s1 = String::from("hello");
  let s2 = s1; // s1 被移动到 s2，s1 不再有效
  println!("{}, world!", s1);
}
```

变量在离开作用域时会被自动释放，所以 `s1`、`s2` 都会被释放，所以会一起尝试释放 `二次释放`。

在编译中，这种行为 Rust 的编译器不会允许，会报出错误，Rust 禁止无效引用。

#### 克隆

如果想要复制一个变量，可以使用 `clone` 方法。

```rust
fn main() {
  let s1 = String::from("hello");
  let s2 = s1.clone();
  println!("s1 = {}, s2 = {}", s1, s2);
}
```

在栈上的值无需克隆，因为它们的大小是已知的，所以在编译时就可以确定大小，所以在栈上的值是完全拷贝的。

可以使用 `Copy trait` 特殊类型注解来实现一个方法，使旧的变量在将其赋值给其他变量后仍然可用。

Rust 不允许自身或其任何部分实现了 `Drop trait` 的类型使用 `Copy trait`。

如果对其值离开作用域时需要特殊处理的类型使用 Copy 注解，将会出现一个编译时错误。

任何一组简单标量值的组合都可以实现 Copy，任何不需要分配内存或某种形式资源的类型都可以实现 Copy 。如下是一些 Copy 的类型：

- 所有整数类型，比如 u32。
- 布尔类型，bool，它的值是 true 和 false。
- 所有浮点数类型，比如 f64。
- 字符类型，char。
- 元组，当且仅当其包含的类型也都实现 Copy 的时候。比如，(i32, i32) 实现了 Copy，但 (i32, String) 就没有。

### 所有权与函数

将值传递给函数与给变量赋值的原理相似。向函数传递值可能会移动或者复制，就像赋值语句一样。

```rust
fn main() {
    let s = String::from("hello");  // s 进入作用域
    takes_ownership(s);             // s 的值移动到函数里 ...
                                    // ... 所以到这里不再有效
    let x = 5;                      // x 进入作用域
    makes_copy(x);                  // x 应该移动函数里，
                                    // 但 i32 是 Copy 的，
                                    // 所以在后面可继续使用 x
} // 这里, x 先移出了作用域，然后是 s。但因为 s 的值已被移走，

  // 没有特殊之处
fn takes_ownership(some_string: String) { // some_string 进入作用域
    println!("{}", some_string);
} // 这里，some_string 移出作用域并调用 `drop` 方法。
  // 占用的内存被释放

fn makes_copy(some_integer: i32) { // some_integer 进入作用域
    println!("{}", some_integer);
} // 这里，some_integer 移出作用域。没有特殊之处
```
当尝试在调用 `takes_ownership` 后使用 `s` 时，Rust 会抛出一个编译时错误。

### 返回值与作用域

返回值也可以转移所有权

```rust
fn main() {
    let s1 = gives_ownership();         // gives_ownership 将返回值
                                        // 转移给 s1
    let s2 = String::from("hello");     // s2 进入作用域

    let s3 = takes_and_gives_back(s2);  // s2 被移动到
                                        // takes_and_gives_back 中,
                                        // 它也将返回值移给 s3
} // 这里, s3 移出作用域并被丢弃。s2 也移出作用域，但已被移走，
  // 所以什么也不会发生。s1 离开作用域并被丢弃

fn gives_ownership() -> String {             // gives_ownership 会将
                                             // 返回值移动给
                                             // 调用它的函数
    let some_string = String::from("yours"); // some_string 进入作用域.

    some_string                              // 返回 some_string 
                                             // 并移出给调用的函数
}

// takes_and_gives_back 将传入字符串并返回该值
fn takes_and_gives_back(a_string: String) -> String { // a_string 进入作用域
    a_string  // 返回 a_string 并移出给调用的函数
}
```
