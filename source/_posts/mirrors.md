---
title: 常见软件镜像
date: 2022-12-04 16:45:04
icon: icon-logo
background: bg-blue-500
tags:
    - software
    - mirrors
categories:
    - 公共服务
intro: 用于设置常用软件的国内镜像，以便加速下载资源。
---



测速
--------------------

### 镜像下载测速 {.col-span-3}
```bash
# 系统软件源测速
curl -sSL https://cdn.jsdelivr.net/gh/lework/script/shell/os_repo_speed_test.sh | bash

# Docker hub 测速
curl -sSL https://cdn.jsdelivr.net/gh/lework/script/shell/docker_hub_speed_test.sh | bash
```



系统镜像
--------------------

### centos {.col-span-3}
```bash
sed -e 's!^#baseurl=!baseurl=!g' \
       -e  's!^mirrorlist=!#mirrorlist=!g' \
       -e 's!mirror.centos.org!mirrors.ustc.edu.cn!g' \
       -i  /etc/yum.repos.d/CentOS-Base.repo

yum install -y epel-release
sed -e 's!^mirrorlist=!#mirrorlist=!g' \
    -e 's!^#baseurl=!baseurl=!g' \
    -e 's!^metalink!#metalink!g' \
    -e 's!//download\.fedoraproject\.org/pub!//mirrors.ustc.edu.cn!g' \
    -e 's!http://mirrors\.ustc!https://mirrors.ustc!g' \
    -i /etc/yum.repos.d/epel.repo /etc/yum.repos.d/epel-testing.repo
```
### debain {.col-span-3}
```bash
cp /etc/apt/sources.list{,-bak}
cat > /etc/apt/sources.list <<EOF
deb http://mirrors.aliyun.com/debian/ stretch main
deb-src http://mirrors.aliyun.com/debian/ stretch main
deb http://mirrors.aliyun.com/debian/ stretch-updates main
deb-src http://mirrors.aliyun.com/debian/ stretch-updates main
deb http://mirrors.aliyun.com/debian-security stretch/updates main
deb-src http://mirrors.aliyun.com/debian-security stretch/updates main
EOF
apt-get update
```
#### 直接替换 
```
sudo sed -e 's/deb.debian.org/mirrors.163.com/g' \
  -e 's#security.debian.org#mirrors.163.com/debian-security#g' \
  -i /etc/apt/sources.list
```

### debian archive {.col-span-3}
debian 旧版本系统(2[hamm ]-7[wheezy])源都放在 debian-archive 中，
```bash
cp /etc/apt/sources.list{,-bak}
cat << EOF > /etc/apt/sources.list
deb http://mirrors.163.com/debian-archive/debian/ wheezy main non-free contrib
deb http://mirrors.163.com/debian-archive/debian/ wheezy-backports main non-free contrib
deb-src http://mirrors.163.com/debian-archive/debian/ wheezy main non-free contrib
deb-src http://mirrors.163.com/debian-archive/debian/ wheezy-backports main non-free contrib
deb http://mirrors.163.com/debian-archive/debian-security/ wheezy/updates main non-free contrib
deb-src http://mirrors.163.com/debian-archive/debian-security/ wheezy/updates main non-free contrib
EOF

apt-get -o Acquire::Check-Valid-Until=false update
```

### ubuntu {.col-span-3}
```bash
sudo sed -i 's/archive.ubuntu.com/mirrors.tuna.tsinghua.edu.cn/g' /etc/apt/sources.list
```

### freebsd {.col-span-3}
pkg 软件源
```bash
# /usr/local/etc/pkg/repos/FreeBSD.conf
FreeBSD: {
  url: "pkg+http://mirrors.ustc.edu.cn/freebsd-pkg/${ABI}/latest",
}

pkg update -f
```
ports 软件源
```bash
# /etc/make.conf

MASTER_SITE_OVERRIDE?=http://mirrors.ustc.edu.cn/freebsd-ports/distfiles/${DIST_SUBDIR}/
```


软件镜像
--------------------

### pip {.col-span-3}

- 阿里云 https://mirrors.aliyun.com/pypi/simple 
- 中国科技大学 https://pypi.mirrors.ustc.edu.cn/simple 
- 豆瓣(douban) http://pypi.douban.com/simple 
- 清华大学 https://pypi.tuna.tsinghua.edu.cn/simple 
- 中国科学技术大学 http://pypi.mirrors.ustc.edu.cn/simple 


#### 下载时使用

```bash
pip install numpy -i https://mirrors.aliyun.com/pypi/simple
```
#### 永久修改

```bash
pip install pip -U
pip config set global.index-url https://mirrors.aliyun.com/pypi/simple
```

#### 配置文件

linux   : `~/.pip/pip.conf`
windows : `C:\User\用户\pip\pip.ini`
```ini
[global]
index-url = https://mirrors.aliyun.com/pypi/simple
```

### easy_install {.col-span-3}

```bash
cat >> ~/.pydistutils.cfg  <<EOF
[easy_install]
index-url = https://mirrors.aliyun.com/pypi/simple
EOF
```

### ruby  {.col-span-2}
```bash
gem sources --add https://gems.ruby-china.com/ --remove https://rubygems.org/
bundle config mirror.https://rubygems.org https://gems.ruby-china.com
```

### maven {.row-span-3}
maven 的 settings.xml
```xml
<mirrors>
<mirror>
    <id>aliyunmaven</id>
    <mirrorOf>*</mirrorOf>
    <name>阿里云公共仓库</name>
    <url>https://maven.aliyun.com/repository/public</url>
</mirror>
</mirrors>
```
maven 项目的pom.xml

```xml
<repositories>
    <repository>
        <id>nexus-163</id>
        <name>Nexus 163</name>
        <url>http://mirrors.163.com/maven/repository/maven-public/</url>
        <layout>default</layout>
        <snapshots>
            <enabled>false</enabled>
        </snapshots>
        <releases>
            <enabled>true</enabled>
        </releases>
    </repository>
</repositories>
<pluginRepositories>
    <pluginRepository>
        <id>nexus-163</id>
        <name>Nexus 163</name>
        <url>http://mirrors.163.com/maven/repository/maven-public/</url>
        <snapshots>
            <enabled>false</enabled>
        </snapshots>
        <releases>
            <enabled>true</enabled>
        </releases>
    </pluginRepository>
</pluginRepositories>
```


### npm  {.col-span-2}
```bash
npm --registry=https://registry.npmmirror.com install

npm config set registry https://registry.npmmirror.com
npm config list
```

### yarn  {.col-span-2}
```bash
yarn config set registry https://registry.npmmirror.com
yarn config list
```

### go {.col-span-2 .row-span-2}

- https://mirrors.aliyun.com/goproxy/ 
- https://goproxy.io
- https://gorpoxy.cn 

#### linux
```bash
# 配置 GOPROXY 环境变量
export GOPROXY=https://proxy.golang.com.cn,direct
# 还可以设置不走 proxy 的私有仓库或组，多个用逗号相隔（可选）
export GOPRIVATE=git.mycompany.com,github.com/my/private
```

#### windows
```powershell
# 配置 GOPROXY 环境变量
$env:GOPROXY = "https://proxy.golang.com.cn,direct"
# 还可以设置不走 proxy 的私有仓库或组，多个用逗号相隔（可选）
$env:GOPRIVATE = "git.mycompany.com,github.com/my/private"
```


### gradle {.row-span-1} 
build.gradle 文件

```
allprojects {
    repositories {
        maven { url 'https://maven.aliyun.com/repository/public/' }
        mavenLocal()
        mavenCentral()
    }
}
```

### cygwin
```bash
选择 Install from Internet, 在User URL处输入以下地址：

https://mirrors.tuna.tsinghua.edu.cn/cygwin/
```



### jenkins {.col-span-3}

游览器访问 jenkins,例如: [http://localhost:8080/pluginManager/advanced] 


选择一个国内源: 

| Site | Source | CDN | 
| -- | ------ |----------------------------------------------------------- |
| tencent | https://raw.githubusercontent.com/lework/jenkins-update-center/master/updates/tencent/update-center.json  | https://cdn.jsdelivr.net/gh/lework/jenkins-update-center/updates/tencent/update-center.json  |
| huawei | https://raw.githubusercontent.com/lework/jenkins-update-center/master/updates/huawei/update-center.json  | https://cdn.jsdelivr.net/gh/lework/jenkins-update-center/updates/huawei/update-center.json  |
| tsinghua | https://raw.githubusercontent.com/lework/jenkins-update-center/master/updates/tsinghua/update-center.json  | https://cdn.jsdelivr.net/gh/lework/jenkins-update-center/updates/tsinghua/update-center.json  |
| ustc | https://raw.githubusercontent.com/lework/jenkins-update-center/master/updates/ustc/update-center.json  | https://cdn.jsdelivr.net/gh/lework/jenkins-update-center/updates/ustc/update-center.json  |
| bit | https://raw.githubusercontent.com/lework/jenkins-update-center/master/updates/bit/update-center.json  | https://cdn.jsdelivr.net/gh/lework/jenkins-update-center/updates/bit/update-center.json  |


### docker-ce  {.col-span-3}

#### CentOS/RHEL
```bash
curl -o /etc/yum.repos.d/docker-ce.repo https://mirrors.ustc.edu.cn/docker-ce/linux/centos/docker-ce.repo
sed -i 's#download.docker.com#mirrors.ustc.edu.cn/docker-ce#g' /etc/yum.repos.d/docker-ce.repo
```
#### Debian
```bash
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add -
sudo add-apt-repository \
   "deb [arch=amd64] http://mirrors.ustc.edu.cn/docker-ce/linux/debian \
   $(lsb_release -cs) \
   stable"
sudo apt-get update
sudo apt-get install docker-ce
```
#### Ubuntu
```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository \
   "deb [arch=amd64] https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
sudo apt-get update
sudo apt-get install docker-ce
```

### kubernetes  {.col-span-3}
#### CentOS/RHEL/Fedora
```bash
cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64/
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF
setenforce 0
yum install -y kubelet kubeadm kubectl
systemctl enable kubelet && systemctl start kubelet
```
#### Debian/Ubuntu
```bash
apt-get update && apt-get install -y apt-transport-https
curl https://mirrors.aliyun.com/kubernetes/apt/doc/apt-key.gpg | apt-key add -
cat <<EOF >/etc/apt/sources.list.d/kubernetes.list
deb https://mirrors.aliyun.com/kubernetes/apt/ kubernetes-xenial main
EOF
apt-get update
apt-get install -y kubelet kubeadm kubectl
```





### NuGet
选择工程-》NuGet 包管理器-》程序包管理器设置

```
https://nuget.cdn.azure.cn/v3/index.json
https://repo.huaweicloud.com/repository/nuget/v3/index.json
```
### Hex

```
export HEX_MIRROR="https://hexpm.upyun.com"
export HEX_CDN="https://hexpm.upyun.com"
```

容器镜像
--------------------

### docker
```bash
cp  /etc/docker/daemon.json{,-bak}
cat > /etc/docker/daemon.json <<EOF
{
    "log-driver": "json-file",
    "log-opts": {
        "max-size": "100m",
        "max-file": "3"
    },
    "live-restore": true,
    "max-concurrent-downloads": 10,
    "max-concurrent-uploads": 10,
    "storage-driver": "overlay2",
    "storage-opts": [
        "overlay2.override_kernel_check=true"
    ],
    "exec-opts": ["native.cgroupdriver=systemd"],
    "registry-mirrors": [
        "https://uyah70su.mirror.aliyuncs.com"
    ]
}
EOF
```

### containerd
```
生成默认配置
containerd config default > /etc/containerd/config.toml

将registry.mirrors替换成代理的
    [plugins.cri.registry]
      [plugins.cri.registry.mirrors]
        [plugins.cri.registry.mirrors."docker.io"]
          endpoint = ["https://registry-1.docker.io"]

sed -i 's#https://registry-1.docker.io#https://uyah70su.mirror.aliyuncs.com#g' /etc/containerd/co
```

### podman

```
cp /etc/containers/registries.conf{,.bak}
cat > /etc/containers/registries.conf << EOF
unqualified-search-registries = ["docker.io"]

[[registry]]
prefix = "docker.io"
location = "uyah70su.mirror.aliyuncs.com"
EOF
```

### gcr 镜像  {.col-span-3}

```
k8s.gcr.io/{image_name}  ==>  registry.cn-hangzhou.aliyuncs.com/kainstall/{image_name}
docker pull registry.cn-hangzhou.aliyuncs.com/kainstall/kube-scheduler:[镜像版本号]
```
更多: [sync_image](https://github.com/lework/sync_image)


## 更多资源 {.cols-1}
### github   {.col-span-2}

#### 仅限访问和下载，请不要提交账号信息，需保护自己的隐私。
```
https://gh.lework.workers.dev  # 对github clone、release、archive以及项目文件进行加速
```
#### Release、Code(ZIP) 文件加速：
```
https://gh.con.sh | 美国 01
https://gh.api.99988866.xyz | 美国 02
https://download.fastgit.org | 日本东京
https://g.ioiox.com | 中国香港 （估计 10M 小水管，但稳定，不会动不动下载中断，算是备用
https://git.yumenaka.net | 美国洛杉矶（晚上时比前面两个美国的更快
```
#### Git Clone 加速：
```
https://hub.fastgit.org | 中国香港
https://gitclone.com | 中国浙江杭州
https://github.com.cnpmjs.org | 新加坡
```
#### Raw 文件加速：
```
https://cdn.jsdelivr.net | 中国国内
https://raw.fastgit.org | 中国香港
https://git.yumenaka.net | 美国洛杉矶
```

### 前端开源项目 CDN

- https://www.jsdelivr.com/ 
- https://www.bootcdn.cn/ 
- https://cdnjs.com/ 
- http://www.staticfile.org/ 
- http://jscdn.upai.com 
- https://cdn.baomitu.com/ 