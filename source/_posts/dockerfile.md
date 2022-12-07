---
title: dockerfile
date: 2022-12-06 21:19:41
icon: icon-docker
background: bg-[#e44230]
label: dokcer
tags:
    - container
    - virtual
    - dockerfile
categories:
    - 云原生
intro:  这是 [Dockerfile](https://docs.docker.com/engine/reference/builder/) 的快速参考备忘单。
---


Dockerfile 示例
---------------

###  示例 {.col-span-2 .row-span-3}
#### 来源基础镜像
```yaml
FROM debian:jessie
```
#### 元数据标签
```yaml
LABEL version="1.0"
LABEL Language="python"
```

#### 安装包
```yaml

ENV DEBIAN_FRONTEND=noninteractive             # 设置环境变量

# 安装软件包
RUN sed -i -e 's#deb.debian.org#mirrors.aliyun.com#g' \
           -e 's#security.debian.org#mirrors.aliyun.com#g' \
           -e 's#ftp.debian.org#mirrors.aliyun.com#g' \
           /etc/apt/sources.list \   # 设置软件源
    && apt-get update \
    && apt-get install -y --no-install-recommends python git \
    && apt-get clean \               # 安装完，记得清理
    && rm -rf /var/lib/apt/lists/*
```
#### 设置时区
```yaml
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
```
#### 拷贝文件
```yaml
COPY sourcefile.txt /app
COPY sourcefile.txt config.ini /app/           # 拷贝多个文件
COPY dir1 /app                                 # 拷贝目录
```
#### 添加用户
```yaml
RUN useradd nonroot -u 1001 -s /bin/bash
USER nonroot
```
#### 挂载目录

```yaml
VOLUME ["/data"]
```
#### 开放端口
```yaml
EXPOSE 80/tcp 443/tcp
```
#### 启动命令
```yaml
ENTRYPOINT [ "script.sh", "param1", "param2"]
```

###  golang 多阶段
```yaml
# 编译
FROM golang:1.16
WORKDIR /go/src/github.com/alexellis/href-counter/
RUN go get -d -v golang.org/x/net/html  
COPY app.go ./
RUN CGO_ENABLED=0 go build -a -installsuffix cgo -o app .

# 运行
FROM alpine:latest  
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=0 /go/src/github.com/alexellis/href-counter/app ./
CMD ["./app"]
```
### vue 多阶段
```yaml
# 编译
FROM node:14.15.0-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 运行
FROM nginx:stable-perl as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY --from=build-stage /app/nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### java 多阶段
```yaml
# 编译
FROM maven:3.5.0-jdk-8-alpine AS builder
ADD ./pom.xml pom.xml
ADD ./src src/
RUN mvn clean package

# 运行
From openjdk:8-jre-alpine
COPY --from=builder target/my-app-1.0-SNAPSHOT.jar my-app-1.0-SNAPSHOT.jar
EXPOSE 8080
CMD ["java", "-jar", "my-app-1.0-SNAPSHOT.jar"]
```

Dockerfile 指令参数
---------------

### 主要命令 {.col-span-2}
命令 | 说明
:- | -
`FROM image` | 构建的基础镜像
`LABEL ` | 设置元数据
`COPY [--chown=<user>:<group>] <src>... <dest>` | 将上下文中的路径复制到位置 `dest` 的容器中
`ADD [--chown=<user>:<group>] <src>... <dest>` | 与 `COPY` 相同，但解压缩存档并接受 http url
`RUN <command>` | 在容器内运行任意命令
`USER <user>[:<group>]` | 设置默认用户名
`WORKDIR /path/to/workdir` | 设置默认工作目录
`CMD command param1 param2` | 设置默认命令
`ENTRYPOINT command param1 param2` | 设置启动脚本
`ENV <key>=<value> ...` | 设置环境变量
`EXPOSE <port> [<port>/<protocol>...]` | 运行时侦听指定的网络端口


.dockerignore 文件
---------------

###  示例 {.col-span-2}

```
# 注释说明
*/temp*
*/*/temp*
temp?
```

| :-                            | -                                                            |
| :---------------------------- | ------------------------------------------------------------ |
| `# comment`                   | 忽略                                                         |
| `*/temp*`                     | 在根的任何直接子目录中<br />排除名称以 `temp` 开头的文件和目录 |
| `*/*/temp*`                   | 从根以下两级的任何子目录中<br />排除以 `temp` 开头的文件和目录 |
| `temp?`                       | 排除根目录中名称为<br /> `temp` 的单字符扩展名的文件和目录   |
| <!--rehype:class=auto-wrap--> |                                                              |

如果此文件存在，排除与其中的模式匹配的文件和目录，有利于避免 `ADD` 或 `COPY` 将敏感文件添加到镜像中。匹配是使用 Go 的 [filepath.Match](https://golang.org/pkg/path/filepath#Match) 规则完成的。


Docker BuildKit
---------------

### 示例 {.col-span-2}

```yaml
# syntax=docker/dockerfile:1
FROM node:alpine as builder

WORKDIR /app

COPY package.json /app/

# 使用缓存
RUN --mount=type=cache,target=/app/node_modules,id=my_app_npm_module,sharing=locked \
    --mount=type=cache,target=/root/.npm,id=npm_cache \
        npm i --registry=https://registry.npm.taobao.org

COPY src /app/src

RUN --mount=type=cache,target=/app/node_modules,id=my_app_npm_module,sharing=locked \
        npm run build

FROM nginx:alpine

RUN --mount=type=cache,target=/tmp/dist,from=builder,source=/app/dist \
    mkdir -p /app/dist && cp -r /tmp/dist/* /app/dist
```

### 编译运行

```bash
DOCKER_BUILDKIT=1 docker build .

docker buildx build \ 
   -t myusername/hello . \
   --push
```