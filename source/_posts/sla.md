---
title: SLA
icon: icon-style
background: bg-green-400
tags:
    - sre
    - sla
    - network
categories:
  - SRE
date: 2022-12-13 19:34:03
intro: SLA是Service-Level Agreement的缩写，也就是服务等级协议，指的是系统服务提供者（Provider）对客户（Customer）的一个服务承诺，也可以理解为服务提供者和客户之间签订的协议或者合约，是具有法律效力的，不能随便承诺。同时SLA也是衡量一个系统是否健康的常见方法。
---

## 常见衡量指标  {.cols-2}

### 可用性(Availability) 

系统可用性SLA，9越多代表全年服务可用时间越长服务更可靠，停机时间越短，反之亦然。

```
可用性 = 可用时长 / (可用时长+不可用时长)
```
下面以看一组数据，对可用性有一些直观认识

| 可用性级别 | 每年不可用时间 | 每季度不可用时间 | 每30天不可用时间 |
| :--------- | :------------- | :--------------- | :--------------- |
| 90%        | 36,5 days      | 9 days           | 3 days           |
| 95%        | 18,25 days     | 4,5 days         | 1,5 days         |
| 99%        | 3,65 days      | 21,6 hours       | 7,2 hours        |
| 99,5%      | 1,83 days      | 2,16 hours       | 3,6 hours        |
| 99,9%      | 8,76 hours     | 10,8 hours       | 43,2 minutes     |
| 99,95%     | 4,38 hours     | 1,08 hours       | 21,6 minutes     |
| 99,99%     | 52,6 minutes   | 12,96 minutes    | 4,32 minutes     |
| 99,999%    | 5,26 minutes   | 1,30 minutes     | 25,9 seconds     |
{.show-header}

可用性不确定性因素比较多，比如硬件故障，软件故障，自然灾害等等这些因素都会影响系统可用性。
对于许多系统而言，四个 9 的可用性（99.99％ Availability，或每年约 50多分钟的系统中断时间）即可以被认为是高可用性（High availability）。

### 准确性( Accuracy)

准确性指的是我们所设计系统服务中，是否允许某些数据不准确或者是丢失的。如果允许这样的错误发生，用户可以接受的概率是多少？该怎么衡量，不同系统或平可能会不同的指标去定义准确性。很多时候会以 **错误率（Error Rate）** 来定义这一项SLA。

常见指标: `错误率`

```
错误率 = 系统内部产生错误的有效数量 / 期间有效的请求数量
```
示例：

- Google Cloud Platform: 每个月系统的错误率超过 5% 的时间要少于 0.1%，以每分钟为单位来计算。
- AWS：以每 5 分钟为单位，错误率不会超过 0.1%。

### 系统容量(Capacity)

在数据处理中，系统容量通常指的是系统能够支持的预期负载的数量是多少，一般会以每秒的请求数为单位来表示。

常见指标: `QPS （Queries Per Second）` `RPS（Requests Per Second）` `TPS（Transaction Per Second）`

```
QPS = 请求数 / 时间（秒） 每秒查询率 
RPS = 并发数 / 时间（秒） 单位时间内处理的请求数
TPS = 事务数 / 时间（秒） 每秒处理事务数
```

示例：
- Twitter 系统可以响应 30 万的 QPS 来读取 Twitter Timelines

### 延迟(Latency)

延迟指的是系统在收到用户请求响应这个请求的之间的时间间隔。

常见指标：

| 指标  | 备注                                                         |
| :--------- | :------------- |
| p95        | 100请求里面有95个请求的响应时间会少于1秒，剩下的5个请求大于1秒|
| p99        | 100请求里面有99个请求的响应时间会少于1秒，剩下的1个请求大于1秒 |
| p999        | 1000请求里面有999个请求的响应时间会少于1秒，剩下的1个请求大于1秒 |
| p9999        | 10000请求里面有9990个请求的响应时间会少于1秒，剩下的1个请求大于1秒 |

## 更多资源
- [阿里云-云服务器 ECS服务等级协议](http://terms.aliyun.com/legal-agreement/terms/suit_bu1_ali_cloud/suit_bu1_ali_cloud201909241949_62160.html)