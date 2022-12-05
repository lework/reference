---
title: docker
date: 2022-12-05 21:17:56
icon: icon-docker
background: bg-[#488fdf]
tags:
    - container
    - virtual
    - image
categories:
    - 云原生
intro: 这是 [Docker](https://docs.docker.com/get-started/) 的速查表。 你可以在这里找到最常见的 Docker 命令。
---

开始  {.cols-2}
---------------

### Getting started 
在后台创建和运行容器

```shell script 
$ docker run -d -p 80:80 docker/getting-started
```

----

- `-d`  以后台模式运行容器
- `-p 80:80`  将端口 80 映射到容器中的端口 80
- `docker/getting-started`  镜像地址
{.marker-none}


在前台创建并运行容器
```shell script
$ docker run -it --rm -p 8001:8080 --name my-nginx nginx
```

----

- `-it`  交互式bash模式
- `--rm` 容器终止运行后自动删除容器文件
- `-p 8001:8080`  将 8001 端口映射到容器中的 8080 端口
- `--name my-nginx` 指定名称
- `nginx`  使用的镜像
{.marker-none}



### 一般命令 
| Example                             | Description                                      |
|-------------------------------------|--------------------------------------------------|
| `docker ps`                         | 列出正在运行的容器                                  |
| `docker ps -a`                      | 列出所有容器                                  |
| `docker ps -s`                      | 列出正在运行的容器 _(显示 CPU / 内存)_        |
| `docker images`                     | 列出所有镜像                                  |
| `docker exec -it <container>  bash` | 连接到容器                                  |
| `docker logs <container>`           | 显示容器的控制台日志                                  |
| `docker stop <container>`           | 停止容器                                  |
| `docker restart <container>`        | 重启一个容器                                  |
| `docker rm <container>`             | 移除一个容器                                  |
| `docker port <container>`           | 显示容器的端口映射                                  |
| `docker top <container>`            | 列出进程                                  |
| `docker kill <container>`           | 杀死一个容器                                  |

参数 `<container>` 可以是容器 id 或名称




Docker 容器 {.cols-2}
----------


### 启动和停止
| Description                   | Example                             |
|-------------------------------|-------------------------------------|
| `docker start nginx-server`   | 启动容器                            |
| `docker stop nginx-server`    | 停止容器                            |
| `docker restart nginx-server` | 重启容器                          |
| `docker pause nginx-server`   | 暂停容器                             |
| `docker unpause nginx-server` | 恢复暂停的容器                           |
| `docker wait nginx-server`    | 阻塞容器                |
| `docker kill nginx-server`    | 向容器发送 SIGKILL                  |
| `docker attach nginx-server`  | 连接到容器 |



### 容器信息

| Example                       | Description                            |
|-------------------------------|----------------------------------------|
|`docker ps`                   | 列出正在运行的容器      |  
|`docker ps -a`                | 列出所有容器    |
|`docker logs nginx-server`    | 容器日志    |
|`docker inspect nginx-server` | 检查容器    |
|`docker events nginx-server`  | 容器事件    |
|`docker port nginx-server`    | 公共端口    |
|`docker top nginx-server`     | 运行进程    |
|`docker stats nginx-server`   | 容器资源使用    |
|`docker diff nginx-server`    | 列出对容器所做的更改    |


### 创建容器

```yaml
docker create [options] IMAGE
  -a, --attach               # 附加标准输出/错误
  -i, --interactive          # 附加标准输入（交互式）
  -t, --tty                  # 伪终端
      --name NAME            # 命名你的镜像
  -p, --publish 5000:5000    # 端口映射（主机:容器）
      --expose 5432          # 向容器公开端口 
  -P, --publish-all          # 发布所有端口
      --link container:alias # 链接 linking
  -v, --volume `pwd`:/app    # mount（需要绝对路径）
  -e, --env NAME=hello       # 环境变量 env vars
```
#### 示例
```shell script
$ docker create --name my_redis --expose 6379 redis:3.0.2
```


### 操作
重命名容器
```shell script
docker rename my-nginx nginx-server
```
移除容器
```shell script
docker rm nginx-server
```
更新容器
```shell script
docker update --cpu-shares 512 -m 300M nginx-server
```




Docker 镜像 {.cols-2}
------

### 操作
| `Example`                          | Description                     |
|------------------------------------|---------------------------------|
| `docker images`                    | 列出镜像 |                  
| `docker rmi nginx`                 | 删除镜像 |
| `docker load < ubuntu.tar.gz`      | 加载一个 tar 存储库 |
| `docker load --input ubuntu.tar`   | 加载一个 tar 存储库 |
| `docker save busybox > ubuntu.tar` | 将镜像保存到 tar 存档 |
| `docker history`                   | 显示镜像的历史 |
| `docker commit nginx`              | 将容器另存为镜像。|
| `docker tag nginx eon01/nginx`     | 标记镜像 |
| `docker push eon01/nginx`          | 推送镜像 |


### 编译镜像
```shell script
$ docker build .
$ docker build github.com/creack/docker-firefox
$ docker build - < Dockerfile
$ docker build - < context.tar.gz
$ docker build -t eon/nginx-server .
$ docker build -f myOtherDockerfile .
$ curl example.com/remote/Dockerfile | docker build -f - .
$ dokcer build --no-cache .
$ DOCKER_BUILDKIT=1 docker build 
$ docker buildx build --push --tag myregistry.com/myimage:latest .
$ docker buildx build --load . -f - <<EOF
FROM alpine
RUN echo "hello world"
EOF
```



Docker 网络  {.cols-2}
----------




### 操作

删除网络
```shell script
docker network rm MyOverlayNetwork
```
列出网络
```shell script
docker network ls
```
获取有关网络的信息
```shell script
docker network inspect MyOverlayNetwork
```
将正在运行的容器连接到网络
```shell script
docker network connect MyOverlayNetwork nginx
```
启动时将容器连接到网络
```shell script
docker run -it -d --network=MyOverlayNetwork nginx
```
断开容器与网络的连接
```shell script
docker network disconnect MyOverlayNetwork nginx
```



### 创建网络
```shell script
docker network create -d overlay MyOverlayNetwork
docker network create -d bridge MyBridgeNetwork
docker network create -d overlay \
  --subnet=192.168.0.0/16 \
  --subnet=192.170.0.0/16 \
  --gateway=192.168.0.100 \
  --gateway=192.170.0.100 \
  --ip-range=192.168.1.0/24 \
  --aux-address="my-router=192.168.1.5" \
  --aux-address="my-switch=192.168.1.6" \
  --aux-address="my-printer=192.170.1.5" \
  --aux-address="my-nas=192.170.1.6" \
  MyOverlayNetwork
```




其他 {.cols-2}
-------------


### Docker Hub
| Docker Syntax               | Description                         |
|-----------------------------|-------------------------------------|
| `docker search search_word` | 在 docker hub 中搜索镜像       |
| `docker pull user/image   ` | 从 docker hub 下载镜像 |
| `docker login             ` | 向 docker hub 进行身份验证          |
| `docker push user/image   ` | 将镜像上传到 docker hub     |





### 镜像仓库  {.row-span-3}

登录镜像仓库

```shell script
$ docker login
$ docker login localhost:8080
```

登出镜像仓库

```shell script
$ docker logout
$ docker logout localhost:8080
```

搜索镜像

```shell script
$ docker search nginx
$ docker search nginx --stars=3 --no-trunc busybox
```

拉取镜像

```shell script
$ docker pull nginx
$ docker pull eon01/nginx localhost:5000/myadmin/nginx
```

推送镜像

```shell script
$ docker push eon01/nginx
$ docker push eon01/nginx localhost:5000/myadmin/nginx
```



### 批量清理
|  Example                                     | Description                                            |
|-------------|---------------------------------------------|
`docker stop -f $(docker ps -a -q)` | 停止所有容器
`docker rm -f $(docker ps -a -q)` |  删除所有容器
`docker rmi -f $(docker images -q)` | 删除所有镜像





### 存储卷

检查卷
```shell script
$ docker volume ls
```
清理未使用的卷
```shell script
$ docker volume prune
```