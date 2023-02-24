---
title: Dockerfile
date: 2022-12-06 21:19:41
background: bg-[#58aee9]
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

### python {.col-span-2 .row-span-2}
```yaml
FROM python:3.6-alpine3.8

# Add non-changing settings at the top to profit from docker layer caching
ENV FLASK_APP=logapp.py \
    PYTHONUNBUFFERED=TRUE
RUN addgroup -g 1000 -S flask && \
    adduser -u 1000 -S flask -G flask

WORKDIR /home/flask/app/web

# Skips pip install if requirements hasn't changed
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy app files
COPY *.py /home/flask/app/web

# Make the app run under non-root user & fix permissions
# WORKDIR sets root:root :(
RUN chown -R flask:flask /home/flask
USER flask

CMD ["gunicorn", "-b", ":8000", "-w", "1", "--access-logfile", "-", "--error-logfile", "-", "flask_frontend:app"]
```

### 下载文件和解压

```yaml
RUN set -eux; \
	\
	curl -fL -o /openjdk.tgz "$JAVA_URL"; \
	echo "$JAVA_SHA256 */openjdk.tgz" | sha256sum -c -; \
	mkdir -p "$JAVA_HOME"; \
	tar --extract --file /openjdk.tgz --directory "$JAVA_HOME" --strip-components 1; \
	rm /openjdk.tgz;
```

### 安装清理

```yaml
# centos
RUN yum clean all

# debian
RUN apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false; \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /tmp/* /var/tmp/*

# alpine
RUN apk add --no-cache python3 \
     && rm -rf /var/cache/apk/*
```

### metadata
```yaml
ARG GIT_COMMIT=unknown
ARG GIT_BRANCH=unknown
ARG GIT_TAG=unknown
ARG BUILD_TIME=unknown

# metadata
# https://github.com/opencontainers/image-spec/blob/master/annotations.md
LABEL maintainer="DevOps Team <devops@company.com>" \
      org.opencontainers.image.title="Company Inc. File Downloader" \
      org.opencontainers.image.description="Offers Basic Auth protected downloads of container files." \
      org.opencontainers.image.vendor="Company Inc." \
      org.opencontainers.image.created="$BUILD_TIME" \
      org.opencontainers.image.revision="$GIT_COMMIT" \
      org.opencontainers.image.version="$GIT_TAG"
```

### gosu
```yaml
ENV GOSU_VERSION 1.10
RUN set -x \
    && wget -O /usr/local/bin/gosu "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$(dpkg --print-architecture)" \
    && wget -O /usr/local/bin/gosu.asc "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$(dpkg --print-architecture).asc" \
    && export GNUPGHOME="$(mktemp -d)" \
    && gpg --batch --keyserver ha.pool.sks-keyservers.net --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4 \
    && gpg --batch --verify /usr/local/bin/gosu.asc /usr/local/bin/gosu \
    && { command -v gpgconf && gpgconf --kill all || :; } \
    && rm -r "$GNUPGHOME" /usr/local/bin/gosu.asc \
    && chmod +x /usr/local/bin/gosu \
    && gosu nobody true
```

### tini
```yaml
RUN set -x \
    && export TINI_VERSION=0.14.0 \
    && apt-get update && apt-get install -y --no-install-recommends wget && rm -rf /var/lib/apt/lists/* \
    && wget -O /usr/local/bin/tini "https://github.com/krallin/tini/releases/download/v$TINI_VERSION/tini" \
    && wget -O /usr/local/bin/tini.asc "https://github.com/krallin/tini/releases/download/v$TINI_VERSION/tini.asc" \
    && export GNUPGHOME="$(mktemp -d)" \
    && gpg --batch --keyserver ha.pool.sks-keyservers.net --recv-keys 6380DC428747F6C393FEACA59A84159D7001A4E5 \
    && gpg --batch --verify /usr/local/bin/tini.asc /usr/local/bin/tini \
    && rm -r "$GNUPGHOME" /usr/local/bin/tini.asc \
    && chmod +x /usr/local/bin/tini \
    && tini -h \
    && apt-get purge -y --auto-remove wget
```


Dockerfile 指令  {.cols-2}
---------------

### 主要命令

* [FROM](https://docs.docker.com/engine/reference/builder/#from) 为其他指令设置基础镜像 (Base Image)。
* [MAINTAINER (deprecated - use LABEL instead)](https://docs.docker.com/engine/reference/builder/#maintainer-deprecated) 为生成的镜像设置作者字段。
* [RUN](https://docs.docker.com/engine/reference/builder/#run) 在当前镜像的基础上生成一个新层并执行命令。
* [CMD](https://docs.docker.com/engine/reference/builder/#cmd) 设置容器默认执行命令。
* [EXPOSE](https://docs.docker.com/engine/reference/builder/#expose) 告知 Docker 容器在运行时所要监听的网络端口。注意：并没有实际上将端口设置为可访问。
* [ENV](https://docs.docker.com/engine/reference/builder/#env) 设置环境变量。
* [ADD](https://docs.docker.com/engine/reference/builder/#add) 将文件、目录或远程文件复制到容器中。缓存无效。请尽量用 `COPY` 代替 `ADD`。
* [COPY](https://docs.docker.com/engine/reference/builder/#copy) 将文件或文件夹复制到容器中。注意：将使用 ROOT 用户复制文件，故无论 USER / WORKDIR 指令如何配置，你都需要手动修改其所有者（`chown`），`ADD` 也是一样。
* [ENTRYPOINT](https://docs.docker.com/engine/reference/builder/#entrypoint) 将容器设为可执行的。
* [VOLUME](https://docs.docker.com/engine/reference/builder/#volume) 在容器内部创建挂载点 (mount point) 指向外部挂载的卷标或其他容器。
* [USER](https://docs.docker.com/engine/reference/builder/#user) 设置随后执行 RUN / CMD / ENTRYPOINT 命令的用户名。
* [WORKDIR](https://docs.docker.com/engine/reference/builder/#workdir) 设置工作目录 (working directory)。
* [ARG](https://docs.docker.com/engine/reference/builder/#arg) 定义编译时 (build-time) 变量。
* [ONBUILD](https://docs.docker.com/engine/reference/builder/#onbuild) 添加触发指令，当该镜像被作为其他镜像的基础镜像时该指令会被触发。
* [STOPSIGNAL](https://docs.docker.com/engine/reference/builder/#stopsignal) 设置停止容器时，向容器内发送的系统调用信号 (system call signal)。
* [LABEL](https://docs.docker.com/config/labels-custom-metadata/) 将键值对元数据 (key/value metadata) 应用到镜像、容器或是守护进程。


### .dockerignore

在 Dockerfile 文件的根目录下放置 `.dockerignore` 文件，有助于避免不必要地向docker进程发送大型或敏感文件和目录

```
# 注释说明
*/temp*
*/*/temp*
temp?
*.md
!README*.md
README-secret.md
```

| :-                            | -                                                            |
| :---------------------------- | ------------------------------------------------------------ |
| `# comment`                   | 忽略                                                         |
| `*/temp*`                     | 在根的任何直接子目录中<br />排除名称以 `temp` 开头的文件和目录 |
| `*/*/temp*`                   | 从根以下两级的任何子目录中<br />排除以 `temp` 开头的文件和目录 |
| `temp?`                       | 排除根目录中名称为<br /> `temp` 的单字符扩展名的文件和目录   |
| `!README*.md`                 | 以!（感叹号）开头的行可用于排除例外 |
| <!--rehype:class=auto-wrap--> |                                                              |


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

docker buildx build \
      --progress=plain \
      -t lework/docker-buildkit \
      -f Dockerfile.buildkit .
```


## 更多资源 {.cols-1}

- [Dockerfile 官方参考](https://docs.docker.com/engine/reference/builder/) _(docker.com)_
- [Examples](https://docs.docker.com/engine/reference/builder/#dockerfile-examples)
- [Best practices for writing Dockerfiles](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/)
- [Buildkit](https://github.com/moby/buildkit)