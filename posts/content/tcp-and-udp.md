---
title: UDP & TCP
date: 2022-05-20 15:00:00
lang: zh-CN
duration: 5min
description: UDP & TCP 的差异和区别。
---

[[toc]]

## UDP

- 面向无连接，无需三次握手
UDP 是一种面向无链接的传输层协议，不会对链接产生控制

- 有单播，多播，广播的功能
不仅支持一对一，也支持一对多，多对多的方式

- 以报文方式传输
应用层交下来的报文，既不合并，也不拆分，而是保留这些报文的边界

- 不可靠性
收到什么数据就传递什么数据，并且也不会备份数据，会导致丢包

- 实时性高
应用于实时应用：视频会议，直播，游戏等，效率高

- 头部开销小，传输数据高效
UDP 的头部开销小，只有八字节，相比 TCP 的至少二十字节要少得多


# TCP

- 面向连接，需要三次握手
TCP 是一种面向连接的传输层协议，需要三次握手，才能建立连接
发送数据前必须在两端建立连接

- 仅支持单播传输
只能支持点对点的数据传输

- 面向字节流
以字节流方式进行传输

- 可靠传输
为了保证传输的可靠，会给每个包一个序号，同时序号也保证了传送到接收端的包的按序接收。接收端对已成功收到的字节发回一个相应的确认(ACK)；如果发送端实体在合理的往返时延(RTT)内未收到确认，那么对应的数据（丢失）将会被重传。

- TCP如何保证可靠性？
1. 差错控制
   校验（在TCP首部会包含校验和）、确认应答（ACK应答）、重传（超时重传、快重传） 三种方法
2. 流量控制 （避免多次发送）
   窗口控制
3. 拥塞控制 (避免和消除网络拥塞) 
  - 快恢复
  - 快重传 （一直重传，会造成网络更加拥堵）
  - 拥塞避免
  - 慢启动 指数增长阶段称为慢启动。

- 提供拥塞控制
当网络出现拥塞的时候，TCP能够减小向网络注入数据的速率和数量，缓解拥塞

- TCP提供全双工
允许通信双方的应用程序在任何时候都能发送数据，因为连接的两端都设有缓存，用来临时存放双向通信的数据。
   