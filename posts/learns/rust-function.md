---
title: Rust 函数
date: 2022-09-12 15:58:00
lang: zh-CN
duration: 3min
description: Rust 函数
type: learns
---

[[toc]]

## Rust 函数定义

Rust 代码中的函数和变量名使用 snake case 规范风格。在 snake case 中，所有字母都是小写并使用下划线分隔单词。

### 参数

通过关键字 `fn` 后面跟着函数名和一对圆括号来定义函数。

参数是特殊变量，是函数签名的一部分。当函数拥有参数（形参）时，可以为这些参数提供具体的值（实参）。

在函数签名中，必须 声明每个参数的类型。

```rust
fn main() {
  another_function(5);
}

fn another_function(x: i32) {
  println!("The value of x is: {}", x);
}
```
### 语句和表达式

语句是执行一些操作但不返回值的指令。表达式计算并产生一个值。

```rust
fn main() {
  let y = { // 临时作用域
    let x = 3;// 执行一些操作但不返回值的指令
    x + 1 // 计算并产生一个值
  };

  println!("The value of y is: {}", y);
}
```

### 返回值

在 Rust 中，在函数的圆括号后面使用箭头 `->`，后面跟着返回值的类型。

在 Rust 中，函数的返回值等同于函数体最后一个表达式的值。使用 return 关键字和指定值，可从函数中提前返回；但大部分函数隐式的返回最后的表达式。

```rust
fn main() {
  let x = 5;

  let y = {
    let x = 3;
    x + 1
  };

  println!("The value of y is: {}", y);

  let z = five();
  println!("The value of z is: {}", z);
}

fn five() -> i32 {
  5
}
```
