---
title: Docker-Compose
date: 2022-12-09 18:58:46
background: bg-[#6d94c7]
label: dokcer
tags:
    - container
    - virtual
    - docker-compose
    - compose
categories:
    - 云原生
intro: Docker-Compose 项目是 Docker 官方的开源项目，负责实现对 Docker 容器集群的快速编排。
---


开始 {.cols-2}	
---------------

### 安装

#### linux

```bash
curl -L \
  "https://github.com/docker/compose/releases/download/v2.16.0/docker-compose-$(uname -s)-$(uname -m)" \
  -o /usr/local/bin/docker-compose

chmod +x /usr/local/bin/docker-compose
```
#### windows
```powershell
Start-BitsTransfer -Source "https://github.com/docker/compose/releases/download/v2.16.0/docker-compose-Windows-x86_64.exe" -Destination $Env:ProgramFiles\Docker\docker-compose.exe
```


### docker-compose 文件示例 {.row-span-2}

```yaml
# https://docs.docker.com/compose/compose-file/
# https://docs.docker.com/compose/compose-file/compose-file-v3/
# docker-compose.yml
version: '3.7'
web:
  container_name: web
  # build from Dockerfile
  build: .

  # build from image
  image: ubuntu
  image: ubuntu:14.04
  image: tutum/influxdb
  image: example-registry:4000/postgresql
  image: a4bc65fd

  ports:
    - "3000"
    - "8000:80"  # guest:host

  # command to execute
  command: bundle exec thin -p 3000
  command: [bundle, exec, thin, -p, 3000]

  # override the entrypoint
  entrypoint: /app/start.sh
  entrypoint: [php, -d, vendor/bin/phpunit]

  # environment vars
  environment:
    RACK_ENV: development
  environment:
    - RACK_ENV=development

  # environment vars from file
  env_file: .env
  env_file: [.env, .development.env]

  # expose ports to linked services (not to host)
  expose: ["3000"]

  # make this service extend another
  extends:
    file: common.yml  # optional
    service: webapp

  # makes the `db` service available as the hostname `database`
  # (implies depends_on)
  links:
    - db:database
    - redis

  # 设置dns
  dns:
    - 8.8.8.8

  # 设置 host地址绑定
  extra_hosts:
    - "somehost:192.168.1.100"
      
  # 健康检查
  
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost"]

  # 依赖db，在db服务后启动
  depends_on:
    - db

  # 挂载目录
  volumes:
    - db-data:/var/lib/mysql
    - ./_data:/var/lib/mysql
  
  # 重启策略
  restart: always
  
  # 系统限制
  sysctls:
    net.core.somaxconn: 1024
  
  ulimits:
    nproc: 65535
    nofile:
      soft: 20000
      hard: 40000
  cap_add:
    - SYS_PTRACE
  cap_drop:
    - NET_ADMIN
  privileged: true

networks:
  frontend:

volumes:
  db-data:
```


### 命令

```bash
docker-compose up         # 启动yml定义的所有服务
docker-compose up -d      # 以后台的形式启动服务
docker-compose down       # #停止并移除yaml中的所有服务
docker-compose ps         # 查看已经启动的服务状态
docker-compose bundle     # #从Compose文件生成分布式应用程序包（DAB）
docker-compose config     # #验证并查看Compose文件
docker-compose events     # 展示项目中每个容器的容器事件
docker-compose logs       # 查看服务的输出
docker-compose port       # 打印绑定的公共端口。
docker-compose pull       # 拉取服务镜像
docker-compose push       # push 服务镜像
docker-compose version    # 查看版本
docker-compose build      # 构建或重新构建服务。
docker-compose start      # 启动一个已经存在的服务容器。
docker-compose stop       # 停止一个已经运行的容器，但不删除它。
docker-compose pause      # 暂停服务
docker-compose unpause    # 恢复处于暂停状态状态中的服务
docker-compose exec       # 在服务中运行命令
docker-compose help       # 获取帮助
docker-compose kill       # 通过发送 SIGKILL 信号来停止指定服务的容器
docker-compose restart    # 重启yml中定义的所有服务
docker-compose rm         # 删除停止的服务容器。
docker-compose top        # 显示正在运行的进程
docker-compose run        # 在一个服务上执行一个命令。
docker-compose scale      # 设置同一个服务运行的容器个数。
docker-compose scale web=2 worker=3
```



## 更多资源 {.cols-1}

- [compose 撰写规范](https://docs.docker.com/compose/compose-file/)
- [compose-file-v3](https://docs.docker.com/compose/compose-file/compose-file-v3/)
- [compose-file-v2](https://docs.docker.com/compose/compose-file/compose-file-v2/)
- [awesome-compose](https://github.com/docker/awesome-compose)