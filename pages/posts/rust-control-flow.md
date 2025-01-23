---
title: Rust 控制流
date: 2022-09-13 14:35:00
lang: zh-CN
duration: 10min
description: Rust 控制流
type: learns
---

[[toc]]

## 控制流

根据条件执行/重复某些代码。


## if 表达式

在 Rust 中，`if` 的条件必须是一个显示的 `bool` 类型。Rust 并不会自动尝试将非布尔类型转换为布尔类型。

```rust
fn main() {
    let number = 3;

    if number {
    // ^^^^^^ expected `bool`, found integer
        println!("number was three");
    }
}
```

必须显示的使用表达式来获取一个 `bool` 类型的值。


```rust
fn main() {
    let number = 3;

    if number != 0 {
        println!("number was something other than zero");
    }
}
```

## else/else if

和大部分语言一样，都有 `else` 和 `else if` 语句。但是在 `else if` 数量较多的情况下会显得代码杂乱无章。

Rust 提供了一个模式匹配的方式来解决这个问题。

## 在 let 语句中使用 if

在 Rust 中 `if` 是一个表达式，可以直接在 `let` 赋值中使用。类似于三元表达式。

在表达式中返回的两个类型必须一致，否则无法通过编译。

```rust
fn main() {
    let condition = true;

    let number = if condition { 5 } else { "six" };

    println!("The value of number is: {number}");
}
```

## 循环

Rust 中提供了三种循环方式：`loop`、`while` 和 `for`。

### loop

除非手动停止/跳出循环，否则会一直执行下去

```rust
fn main() {
    loop {
        println!("again!");
    }
}
```

`loop` 可以当作一个表达式赋值给变量，但是中断 `loop` 只能使用 `break`, 使用 `return` 会中断当前函数执行，也不可以直接写一个表达式。

`continue` 可以和大部分语言一样，跳过当前循环，继续下一次循环。

```rust
fn main() {
    let mut counter = 0;

    let result = loop {
        counter += 1;

        if counter == 10 {
            break counter * 2; // OK
            counter * 2; // unreachable statement
            return counter * 2; // expected `()`, found integer -> main函数需要一个空元组表达式，但是获取到了数字类型
        }
    };

    println!("The result is {result}");
}
```

### 循环标签

可以在 `loop` 标签前为标签打上一个标签接着可以在 `break` 和 `continue` 后面跟上循环标签来控制循环。

以单引号开头冒号结尾 `'loop_flag:` 。

```rust
fn main() {
    let mut count = 0;
    'counting_up: loop {
        println!("count = {count}");
        let mut remaining = 10;
        
        'counting_down: loop {
            if remaining == 6 {
                break;
            }
            
            if remaining == 8 {
                remaining -= 1;
                continue;
            }

            if count == 2 {
                break 'counting_up;
            }
            
            println!("remaining = {remaining}");
            remaining -= 1;
        }

        count += 1;
    }
    println!("End count = {count}");
}
```

### while

`while` 可以使用 `loop` 来完成，但是会多一些不必要的代码，所以 Rust 有内置的 `while` 循环。

使用方式和大部分程序一样为 `true` 就继续循环否则就跳出循环。

在内部也可以使用 `break` 和 `continue` 来控制循环。循环标签也是通用的。

`while` 不可以和 `loop` 一样使用 `value break`。

```rust
fn main() {
    let mut number = 3;

    while number != 0 {
        println!("{}!", number);

        number -= 1;
    }

    println!("LIFTOFF!!!");
}
```

```rust
fn main() {
    let mut count = 0;
    let test = while count < 10 {
        if count == 5 {
            break 20;
         // ^^^^^^^^ can only break with a value inside `loop` or breakable block
         // help: use `break` on its own without a value inside this `while` loop
        }
        count += 1;
    };
    
    println!("count: {count}");
}
```

### for

可以直接通过 `while` 来实现，但是没有必要，除了多了一些不必要的代码，没什么好处，Rust 也内置了 `for`。

可以直接用来遍历集合中的元素

```rust
fn main() {
    let a = [10, 20, 30, 40, 50];

    for element in a {
        println!("the value is: {element}");
    }
}
```

可以用 `rang` 生成一个元素集合然后来遍历

```rust
fn main() {
    for number in (1..4).rev() {
        println!("{number}!");
    }
    println!("LIFTOFF!!!");
}

```
