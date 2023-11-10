---
title: 可用性
background: bg-green-400
tags:
    - sre
    - sla
    - slo
    - sli
    - network
categories:
  - SRE
date: 2022-12-13 19:34:03
intro: 在现代软件开发中，系统和服务往往需要保证高可用性、高性能和稳定性等方面的要求。这些要求可以通过使用 SLI、SLO 和 SLA 指标来度量和管理。在服务水平管理中，SLI 表示服务的关键指标。SLO 则是对于客户需求的回应，确保服务满足其性能期望。而 SLA 则是一种合同或协议，以确保服务提供商履行服务承诺，并对违约行为进行赔偿。
---

## 服务水平  {.cols-3}

### 服务等级指标(Service-Level Indicator, SLI)

Google Cloud 的服务水准指标(Service-Level Indicator, SLI) 是用来衡量服务的使用情况的量化指标，类似对服务的健康状态设定效能衡量。

对于服务系统，通常采用以下 SLI：
- **可用性**反映服务可用时间所占的比例。它通常根据格式正确的成功请求来定义，例如 99%。
- **延迟时间**反映特定百分比的请求可以完成的速度。它通常用除第 50 百分位以外的百分位来定义，例如，第 99 百分位为 300 ms。
- **质量**反映特定响应的好坏程度。质量的定义通常是特定于服务的，用于指明对请求的响应内容与理想响应内容的差异程度。它可以用二进制数表示（好或差），也可以用 0% 到 100% 来表示。

对于数据处理系统，通常采用以下 SLI：
- **覆盖率**反映已处理的数据比例，例如 99.9%。
- **正确率**反映被视为正确的响应所占的比例，例如 99.99%。
- **新鲜度**反映源数据或汇总响应的新鲜程度，通常情况下新鲜度越高越好，例如 20 分钟。
- **吞吐量**反映正在处理的数据量，例如 500 MiB/秒甚至 1000 RPS。

对于存储系统，通常采用以下 SLI：

- **耐用性**反映写入系统的数据将来被检索的可能性，例如 99.9999%。任何数据永久丢失事件都会降低耐用性指标。
- **吞吐量**和**延迟时间**（如前所述）。

### 服务等级目标(Service-Level Objective, SLO)

SLO（服务级别目标）是 SLA 中关于特定指标（如正常运行时间或响应时间）的协议。

测量了SLI 之后，我们要为系统可用性设定一个更精确的目标，重点是要与一段时间做挂勾来衡量服务期望状态、目标范围，我们把这个命名为系统的服务水准目标(Service-Level Objective , SLO)。

SLO 是由以下三种元素组成：SLI、一段时间区间、目标（通常以百分比呈现）。

SLO 示例：
- 在一个月之中，99.9% 的请求延迟有在300ms 内

### 服务等级协议(Service-Level Agreement, SLA)

SLA（服务级别协议）是提供商和客户之间关于可衡量指标（如正常运行时间、响应能力和责任）的协议。 

这些协议通常由公司的新业务和法律团队起草，它们代表了您对客户做出的承诺，以及您未能履行这些承诺的后果。通常，后果包括经济处罚、服务积分或许可证延期。


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
- [可靠性](https://cloud.google.com/architecture/framework/reliability?hl=zh-cn)
- [服务水平目标](https://sre.google/sre-book/service-level-objectives/)
- [阿里云-云服务器 ECS服务等级协议](http://terms.aliyun.com/legal-agreement/terms/suit_bu1_ali_cloud/suit_bu1_ali_cloud201909241949_62160.html)