---
title: tcpdump
icon: icon-style
background: bg-green-200
tags:
    - tcpdump
    - network
categories:
    - 命令
date: 2023-02-16 19:37:53
intro: |
    使用 [TCPDump](https://www.tcpdump.org) 可以将网络中传送的数据包完全截获下来提供分析。
---


入门
--------

### 安装

```bash
# Debian
apt-get install tcpdump
# Ubuntu
apt-get install tcpdump
# Alpine
apk add tcpdump
# Arch Linux
pacman -S tcpdump
# Kali Linux
apt-get install tcpdump
# CentOS
yum install tcpdump
# Fedora
dnf install tcpdump
# OS X
brew install tcpdump
# Raspbian
apt-get install tcpdump
```


### 用法 {.col-span-2}

```shell
tcpdump [options] [proto] [direction] [type]

- options 可选参数
- proto 类过滤器：根据协议进行过滤，可识别的关键词有: tcp, udp, icmp, ip, ip6, arp, rarp, ether, wlan, fddi, tr, decnet
- type 类过滤器：可识别的关键词有：host, net, port, portrange。
- direction 类过滤器：根据数据流向进行过滤，可识别的关键字有：src, dst，同时你可以使用逻辑运算符进行组合，比如 src or dst
```

#### 示例

| 示例 | 描述 |
|-------|-------|
| tcpdump -i ens33                     | 指定网卡接口 |
| tcpdump host 192.168.10.100          | 指定 host ip 进行过滤 |
| tcpdump port 80 or 8088              | 指定端口过滤 |
| tcpdump tcp port 22                  | 指定端口和协议过滤 |
| tcpdump -nnSX port 443               | 过滤 https 协议 |
| tcpdump port 80 -w capture_file      | 保存过滤内容 |
| tcpdump -r capture_file              | 读取PCAP文件 |
<!--rehype:className=show-header-->



tcpdump 的输出
--------

### 输出信息  {.col-span-2}


```shell
22:30:00.301945 IP 172.20.1.1.15605 > 172.20.1.2.5920: Flags [P.], seq 49:97, ack 102048, win 4723, length 48
```

- 第一列：时分秒毫秒 `22:30:00.301945`
- 第二列：网络协议 `IP`
- 第三列：发送方的ip地址+端口号，其中 `172.20.1.1` 是 ip，而 `15605` 是端口号
- 第四列：箭头 `>`， 表示数据流向
- 第五列：接收方的ip地址+端口号，其中 `172.20.2.2` 是 ip，而 `5920` 是端口号
- 第六列：冒号 `:`
- 第七列：数据包内容，包括 `Flags` 标识符，`seq` 号，`ack` 号，`win` 窗口，数据长度 `length`，其中 `[P.]` 表示 `PUSH` 标志位为 1，更多标识符见下面

### Flags 标识符

- [S] : SYN（开始连接）
- [P] : PSH（推送数据）
- [F] : FIN（结束连接）
- [R] : RST（重置连接）
- [.] : 没有 Flag （意思是除上面四种类型外的其他情况，有可能是 ACK 也有可能是 URG）


可选参数 options {.cols-2}
--------

### 设置不解析域名提升速度

- -n： 不把ip转化成域名，直接显示 ip，避免执行 DNS lookups 的过程，速度会快很多
- -nn：不把协议和端口号转化成名字，速度也会快很多。
- -N： 不打印出host 的域名部分.。比如,，如果设置了此选现，tcpdump 将会打印'nic' 而不是 'nic.ddn.mil'.

### 输入输出

- -w: 参数后接一个以 .pcap 后缀命令的文件名，就可以将 tcpdump 抓到的数据保存到文件中
- -r: 从文件中读取数据

### 控制内容的输出

- -v：  产生详细的输出. 比如包的TTL，id标识，数据包长度，以及IP包的一些选项。同时它还会打开一些附加的包完整性检测，比如对IP或ICMP包头部的校验和。
- -vv： 产生比-v更详细的输出. 比如NFS回应包中的附加域将会被打印, SMB数据包也会被完全解码。（摘自网络，目前我还未使用过）
- -vvv：产生比-vv更详细的输出。比如 telent 时所使用的SB, SE 选项将会被打印, 如果telnet同时使用的是图形界面，其相应的图形选项将会以16进制的方式打印出来（摘自网络，目前我还未使用过）

### 控制时间的显示
- -t：   在每行的输出中不输出时间
- -tt：  在每行的输出中会输出时间戳
- -ttt： 输出每两行打印的时间间隔(以毫秒为单位)
- -tttt：在每行打印的时间戳之前添加日期的打印（此种选项，输出的时间最直观）

### 显示数据包的头部 {.row-span-2}

- `-x`：以16进制的形式打印每个包的头部数据（但不包括数据链路层的头部）
- `-xx`：以16进制的形式打印每个包的头部数据（包括数据链路层的头部）
- `-X`：以16进制和 ASCII码形式打印出每个包的数据(但不包括连接层的头部)，这在分析一些新协议的数据包很方便。
- `-XX`：以16进制和 ASCII码形式打印出每个包的数据(包括连接层的头部)，这在分析一些新协议的数据包很方便。

### 指定网卡

- `-i`：指定要过滤的网卡接口，如果要查看所有网卡，可以 `-i any`

### 过滤特定流向的数据包

- `-Q`： 选择是入方向还是出方向的数据包，可选项有：`in`, `out`, `inout`，也可以使用 --direction=[direction] 这种写法


### 对输出内容进行控制的参数

- `-D` : 显示所有可用网络接口的列表
- `-e` : 每行的打印输出中将包括数据包的数据链路层头部信息
- `-E` : 揭秘IPSEC数据
- `-L` ：列出指定网络接口所支持的数据链路层的类型后退出
- `-Z`：后接用户名，在抓包时会受到权限的限制。如果以root用户启动tcpdump，tcpdump将会有超级用户权限。
- `-d`：打印出易读的包匹配码
- `-dd`：以C语言的形式打印出包匹配码.
- `-ddd`：以十进制数的形式打印出包匹配码


### 其他常用的一些参数

- `-A`：以ASCII码方式显示每一个数据包(不显示链路层头部信息). 在抓取包含网页数据的数据包时, 可方便查看数据
- `-l` : 基于行的输出，便于你保存查看，或者交给其它工具分析
- `-q` : 简洁地打印输出。即打印很少的协议相关信息, 从而输出行都比较简短.
- `-c` : 捕获 count 个包 tcpdump 就退出
- `-s` : tcpdump 默认只会截取前 `96` 字节的内容，要想截取所有的报文内容，可以使用 `-s number`， `number` 就是你要截取的报文字节数，如果是 0 的话，表示截取报文全部内容。
- `-S` : 使用绝对序列号，而不是相对序列号
- `-C`：file-size，tcpdump 在把原始数据包直接保存到文件中之前, 检查此文件大小是否超过file-size. 如果超过了, 将关闭此文件,另创一个文件继续用于原始数据包的记录. 新创建的文件名与-w 选项指定的文件名一致, 但文件名后多了一个数字.该数字会从1开始随着新创建文件的增多而增加. file-size的单位是百万字节(nt: 这里指1,000,000个字节,并非1,048,576个字节, 后者是以1024字节为1k, 1024k字节为1M计算所得, 即1M=1024 ＊ 1024 ＝ 1,048,576)
- `-F`：使用file 文件作为过滤条件表达式的输入, 此时命令行上的输入将被忽略.

过滤规则组合
--------

### 逻辑运算符
- and：所有的条件都需要满足，也可以表示为 `&&`
- or：只要有一个条件满足就可以，也可以表示为 `||`
- not：取反，也可以使用 `!`



### 条件判断

- `=`：判断二者相等
- `==`：判断二者相等
- `!=`：判断二者不相等

### 关键字

- if：表示网卡接口名
- proc：表示进程名
- pid：表示进程 id
- svc：表示 service class
- dir：表示方向，in 和 out
- eproc：表示 effective process name
- epid：表示 effective process ID


### 示例  {.col-span-3}

```shell
$ tcpdump src 10.5.2.3 and dst port 3389
$ tcpdump 'src 10.0.2.4 and (dst port 3389 or 22)'
$ tcpdump "( if=en0 and proc =nc ) || (if != en0 and dir=in)"
```


常用过滤规则
--------
### 基于IP地址过滤

```shell
$ tcpdump host 192.168.10.100

# 根据源ip进行过滤
$ tcpdump -i eth2 src 192.168.10.100

# 根据目标ip进行过滤
$ tcpdump -i eth2 dst 192.168.10.200
```

### 基于端口进行过滤 {.row-span-2}

```shell
$ tcpdump port 8088

# 根据源端口进行过滤
$ tcpdump src port 8088

# 根据目标端口进行过滤
$ tcpdump dst port 8088

# 两个端口
$ tcpdump port 80 or port 8088
$ tcpdump port 80 or 8088

# 端口范围
$ tcpdump portrange 8000-8080
$ tcpdump src portrange 8000-8080
$ tcpdump dst portrange 8000-8080

# 常见协议的默认端口
$ tcpdump tcp port http
```


### 基于协议进行过滤 {.row-span-2}

```shell
$ tcpdump icmp

# ipv4的tcp包
$ tcpdump 'ip && tcp'
$ tcpdump 'ip proto tcp'
$ tcpdump ip proto 6
$ tcpdump 'ip protochain tcp'
$ tcpdump ip protochain 6

# ipv6的tcp包
$ tcpdump 'ip6 && tcp'
$ tcpdump 'ip6 proto tcp'
$ tcpdump ip6 proto 6
$ tcpdump 'ip6 protochain tcp'
$ tcpdump ip6 protochain 6

```

protocol 可选值：ip, ip6, arp, rarp, atalk, aarp, decnet, sca, lat, mopdl, moprc, iso, stp, ipx, or netbeui

### 基于网段进行过滤

```shell
$ tcpdump net 192.168.10.0/24

# 根据源网段进行过滤
$ tcpdump src net 192.168

# 根据目标网段进行过滤
$ tcpdump dst net 192.168
```


特殊过滤规则
--------

### tcpflags 进行过滤  {.row-span-2}


```shell
# 使用数字表示偏移量
$ tcpdump -i eth0 "tcp[13] & 2 != 0" 
# 使用别名常量表示偏移量
$ tcpdump -i eth0 "tcp[tcpflags] & tcp-syn != 0"

# 混合写法
$ tcpdump -i eth0 "tcp[tcpflags] & 2 != 0" 
$ tcpdump -i eth0 "tcp[13] & tcp-syn != 0" 

# 多种类型
$ tcpdump -i eth0 'tcp[13] == 2 or tcp[13] == 16'
$ tcpdump -i eth0 'tcp[tcpflags] == tcp-syn or tcp[tcpflags] == tcp-ack'
$ tcpdump -i eth0 "tcp[tcpflags] & (tcp-syn|tcp-ack) != 0" 

# 18（syn+ack） = 2（syn） + 16（ack）
$ tcpdump -i eth0 'tcp[13] = 18'
$ tcpdump -i eth0 'tcp[tcpflags] = 18'
```
TCP 别名常量 tcp-fin, tcp-syn, tcp-rst, tcp-push, tcp-ack, tcp-urg  分别代表 1，2，4，8，16，32，64


### 过滤通过指定网关的数据包

```shell
$ tcpdump gateway [host]
```



### 基于包大小进行过滤

```shell
$ tcpdump less 32 
$ tcpdump greater 64 
$ tcpdump <= 128
```

### 根据 mac 地址进行过滤

```shell
# 其中 ehost 是记录在 /etc/ethers 里的 name
$ tcpdump ether host [
ehost]
$ tcpdump ether dst [ehost]
$ tcpdump ether src [ehost]
```

### 过滤广播/多播数据包

```shell
$ tcpdump ether broadcast
$ tcpdump ether multicast

$ tcpdump ip broadcast
$ tcpdump ip multicast

$ tcpdump ip6 multicast
```

### 协议规则

```shell
# SSH Connections
$ tcpdump 'tcp[(tcp[12]>>2):4] = 0x5353482D'

# DNS
$ tcpdump -vvAs0 port 53

# FTP
$ tcpdump -vvAs0 port ftp or ftp-data

# NTP
$ tcpdump -vvAs0 port 123

# 明文密码
$ tcpdump port http or port ftp or port smtp or port imap or port pop3 or port telnet -lA | egrep -i -B5 'pass=|pwd=|log=|login=|user=|username=|pw=|passw=|passwd= |password=|pass:|user:|username:|password:|login:|pass |user '

```

### 过滤 http   {.col-span-2}

```shell
# 提取 HTTP 的 User-Agent
$ tcpdump -nn -A -s1500 -l | grep "User-Agent:"
$ tcpdump -nn -A -s1500 -l | egrep -i 'User-Agent:|Host:'

# 抓取 HTTP GET 
$ tcpdump -s 0 -A -vv 'tcp[((tcp[12:1] & 0xf0) >> 2):4] = 0x47455420'
$ tcpdump -vvAls0 | grep 'GET'

# 抓取 HTTP POST 
$ tcpdump -s 0 -A -vv 'tcp[((tcp[12:1] & 0xf0) >> 2):4] = 0x504f5354'
$ tcpdump -vvAls0 | grep 'POST'

# 提取 HTTP POST 请求中的密码
$ tcpdump -s 0 -A -n -l | egrep -i "POST /|pwd=|passwd=|password=|Host:"

# 提取 Set-Cookie（服务端的 Cookie）和 Cookie（客户端的 Cookie）：
tcpdump -nn -A -s0 -l | egrep -i 'Set-Cookie|Host:|Cookie:'


# 抓取 80 端口的 HTTP 有效数据包，排除 TCP 连接建立过程的数据包（SYN / FIN / ACK）：
$ tcpdump 'tcp port 80 and (((ip[2:2] - ((ip[0]&0xf)<<2)) - ((tcp[12]&0xf0)>>2)) != 0)'

```



## 更多资源 {.cols-1}

- [MAN INFO](https://www.tcpdump.org/manpages/tcpdump.1.html) _(tcpdump.org)_