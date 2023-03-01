---
title: Containerd
date: 2022-12-10 17:48:04
background: bg-[#575757]
tags:
    - container
    - virtual
    - image
    - crictl
    - ctr
    - nerdctl
categories:
    - 云原生
intro: Containerd 是一个工业级标准的容器运行时，它强调简单性、健壮性和可移植性。Containerd 可以在宿主机中管理完整的容器生命周期：容器镜像的传输和存储、容器的执行和管理、存储和网络等。
---

开始  {.cols-2}
---------------

### centos 安装

```bash
# centos
cat << EOF > /etc/yum.repos.d/docker-ce.repo
[docker-ce-stable]
name=Docker CE Stable - \$basearch
baseurl=https://mirrors.aliyun.com/docker-ce/linux/centos/$(rpm --eval '%{centos_ver}')/\$basearch/stable
enabled=1
gpgcheck=1
gpgkey=https://mirrors.aliyun.com/docker-ce/linux/centos/gpg
EOF
yum install -y containerd.io containernetworking bash-completion
crictl completion bash > /etc/bash_completion.d/crictl

containerd config default > /etc/containerd/config.toml
sed -i -e "s#k8s.gcr.io#registry.cn-hangzhou.aliyuncs.com/kainstall#g" \
        -e "s#registry.k8s.io#registry.cn-hangzhou.aliyuncs.com/kainstall#g" \
        -e "s#https://registry-1.docker.io#https://yssx4sxy.mirror.aliyuncs.com#g" \
        -e "s#SystemdCgroup = false#SystemdCgroup = true#g" \
        -e "s#oom_score = 0#oom_score = -999#" \
        -e "s#max_concurrent_downloads = 3#max_concurrent_downloads = 10#g" /etc/containerd/config.toml

grep docker.io /etc/containerd/config.toml ||  sed -i -e "/registry.mirrors]/a\ \ \ \ \ \ \ \ [plugins.\"io.containerd.grpc.v1.cri\".registry.mirrors.\"docker.io\"]\n           endpoint = [\"https://yssx4sxy.mirror.aliyuncs.com\"]" \
      /etc/containerd/config.toml

cat << EOF > /etc/crictl.yaml
runtime-endpoint: unix:///run/containerd/containerd.sock
image-endpoint: unix:///run/containerd/containerd.sock
timeout: 2
debug: false
pull-image-on-create: true
disable-pull-on-run: false
EOF
  
systemctl restart containerd
systemctl enable containerd
```

### debian 安装
```bash
wget -qO - http://mirrors.aliyun.com/docker-ce/linux/debian/gpg | sudo apt-key add -
echo "deb [trusted=yes] http://mirrors.aliyun.com/docker-ce/linux/debian $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker-ce.list
apt-get update

apt-get install -y containerd.io bash-completion

[ -d /etc/bash_completion.d ] && crictl completion bash > /etc/bash_completion.d/crictl

containerd config default > /etc/containerd/config.toml
sed -i -e "s#k8s.gcr.io#registry.cn-hangzhou.aliyuncs.com/kainstall#g" \
        -e "s#registry.k8s.io#registry.cn-hangzhou.aliyuncs.com/kainstall#g" \
        -e "s#https://registry-1.docker.io#https://yssx4sxy.mirror.aliyuncs.com#g" \
        -e "s#SystemdCgroup = false#SystemdCgroup = true#g" \
        -e "s#oom_score = 0#oom_score = -999#" \
        -e "s#max_concurrent_downloads = 3#max_concurrent_downloads = 10#g" /etc/containerd/config.toml

grep docker.io /etc/containerd/config.toml ||  sed -i -e "/registry.mirrors]/a\ \ \ \ \ \ \ \ [plugins.\"io.containerd.grpc.v1.cri\".registry.mirrors.\"docker.io\"]\n           endpoint = [\"https://yssx4sxy.mirror.aliyuncs.com\"]" \
      /etc/containerd/config.toml

cat << EOF > /etc/crictl.yaml
runtime-endpoint: unix:///run/containerd/containerd.sock
image-endpoint: unix:///run/containerd/containerd.sock
timeout: 2
debug: false
pull-image-on-create: true
disable-pull-on-run: false
EOF
  
systemctl restart containerd
systemctl enable containerd
```

命令  {.cols-2}
---------------

### ctr

ctr 是 containerd 的一个客户端工具

#### 容器
```bash
ctr container create docker.io/library/nginx:latest demo  # 创建容器
ctr container list                  # 列出容器
ctr container info demo             # 容器信息
ctr container rm demo               # 删除容器
ctr containers stats demo           # 镜像状态
```

#### 运行
```bash
ctr run docker.io/library/nginx:alpine redis   # 运行镜像
```
#### 镜像

```bash
ctr images list # 镜像列表
ctr images pull docker.io/library/nginx:alpine # 拉取镜像
ctr image tag docker.io/library/nginx:alpine local.hub/nginx:alpine # 打标签
ctr image push local.hub/nginx:alpine  # 推送镜像
ctr image remove docker.io/library/nginx:latest # 删除镜像
ctr image check  # 检查本地镜像
ctr image mount docker.io/library/nginx:alpine /mnt # 将镜像挂载到本机目录
ctr image unmount /mnt  # 将镜像从主机目录上卸载
ctr image export --platform linux/amd64 nginx.tar.gz docker.io/library/nginx:alpine # 将镜像导出为压缩包
ctr image import nginx.tar.gz  # 镜像导入
```

#### 任务
```bash
ctr task start -d nginx                # 启动镜像
ctr task ls                            # 查看正在运行的容器
ctr task exec --exec-id 0 -t nginx sh  # 进入容器
ctr task pause nginx                   # 暂停容器
ctr task resume nginx                  # 恢复容器
ctr task kill nginx                    # 杀死容器
ctr task rm nginx                      # 删除任务
ctr task metrics nginx                 # 获取容器指标
ctr task ps nginx                      # 查看容器进程在宿主机的PID
```

#### 命名空间
```bash
ctr ns ls  # 查看命名空间
ctr ns create test  # 创建命名空间
ctr ns rm test      # 删除命名空间
ctr -n test image ls  # 查看命名空间下的镜像
```
### nerdctl

nerdctl 是一个与 docker cli 风格兼容的 containerd 客户端工具，而且直接兼容 docker compose 的语法的，这就大大提高了直接将 containerd 作为本地开发、测试或者单机容器部署使用的效率。


#### 容器
```bash
nerdctl run -d -p 80:80 --name=nginx --restart=always nginx:alpine # 运行容器
nerdctl exec -it nginx /bin/sh # 进入容器
nerdctl ps # 列出容器
nerdctl --namespace k8s.io ps -a  # 列出 k8s.io 命名空间的容器
nerdctl inspect nginx # 获取容器的详细信息
nerdctl logs -f nginx # 容器日志
nerdctl stop nginx # 停止容器
nerdctl rm nginx   # 删除容器
```
#### 镜像
```bash
nerdctl images                                         # 镜像列表
nerdctl pull docker.io/library/busybox:latest          # 拉取镜像
nerdctl tag nginx:alpine local.hub/nginx:alpine        # 镜像标签
nerdctl login --username xxx --password xxx  local.hub # 登录hub
nerdctl push local.hub/nginx:alpine                    # 推送镜像
nerdctl save -o busybox.tar.gz busybox:latest          # 保存镜像
nerdctl rmi busybox                                    # 删除镜像
nerdctl load -i busybox.tar.gz                         # 导入镜像
```
#### 编译

nerdctl build 需要依赖 buildkit 工具

```bash
nerdctl build -t nginx:nerdctl -f Dockerfile .
```

### crictl

crictl 是遵循 CRI 接口规范的一个命令行工具，通常用它来检查和管理kubelet节点上的容器运行时和镜像。crictl 使用命名空间 k8s.io 。

#### 容器
```bash
crictl ps                           # 查看运行的容器
crictl logs 1f73f2d81bf98           # 查看容器日志
crictl inspect 1f73f2d81bf98        # 查看容器信息
crictl stats 1f73f2d81bf98          # 查看容器状态
crictl start 1f73f2d81bf98          # 启动容器
crictl stop 1f73f2d81bf98           # 停止容器
crictl rm 1f73f2d81bf98             # 删除容器
crictl exec -i -t 1f73f2d81bf98 ls  # 执行命令
```

#### 镜像
```bash
crictl image ls     # 列出镜像 
crictl pull busybox # 拉取镜像
crictl rmi  busybox # 删除镜像
crictl rmi --prune  # 清空不用的镜像
```

#### POD
```bash
crictl pods                    # 查看运行的k8s pods
crictl pods --label run=nginx  # 查看标签的pods

cat <<EOF> pod-config.json
{
  "metadata": {
    "name": "nginx-sandbox",
    "namespace": "default",
    "attempt": 1,
    "uid": "hdishd83djaidwnduwk28bcsb"
  },
  "log_directory": "/tmp",
  "linux": {
  }
}
EOF
cat <<EOF> container-config.json
{
  "metadata": {
    "name": "busybox"
  },
  "image":{
    "image": "busybox"
  },
  "command": [
    "top"
  ],
  "log_path":"busybox.log",
  "linux": {
  }
}
EOF

crictl runp pod-config.json  # 运行 pod 沙箱环境
crictl create f84dd361f8dc51518ed291fbadd6db537b0496536c1d2d6c05ff943ce8c9a54f container-config.json pod-config.json # 创建容器，id是pod环境的id
```


## 更多资源

- [官方文档](https://github.com/containerd/containerd/blob/main/docs/getting-started.md)
- [nerdctl](https://github.com/containerd/nerdctl)
- [crictl](https://github.com/kubernetes-sigs/cri-tools)
- [Buildkit](https://github.com/moby/buildkit)
