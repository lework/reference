---
title: Jenkins
icon: icon-style
background: bg-red-700
tags:
  - ci
  - cd
  - jenkins
categories:
  - CICD
date: 2022-12-13 20:46:10
intro:  Jenkins 是一个免费的开源自动化服务器。[Jenkins](https://www.jenkins.io/) 通过持续集成和促进持续交付的技术方面，帮助自动化软件开发过程中的非人工部分。它是一个基于服务器的系统，运行在servlet容器(如Apache Tomcat)中。
---



安装
---------------


### centos {.row-span-2}

```
# Step 1: Install Java
$ sudo yum install fontconfig java-11-openjdk

# Step 2: Add Jenkins Repository
$ sudo rpm --import https://pkg.jenkins.io/redhat/jenkins.io.key

# Step 3: Add Jenkins repo to the system
$ sudo cat <<EOF > /etc/yum.repos.d/jenkins.repo
[jenkins]
name=Jenkins
baseurl=http://pkg.jenkins.io/redhat-stable
gpgcheck=1
EOF

# Step 4: Install Jenkins
$ sudo yum install Jenkins

# Step 5: Verify installation
$ sudo systemctl status Jenkins

# Step 6: Once Jenkins is up and running, access it from the link:
# http://localhost:8080
```



### debian/ubuntu {.row-span-2}

```
# Step 1: Install Java
$ sudo apt update
$ sudo apt install fontconfig openjdk-11-jre

# Step 2: Add Jenkins Repository
$ curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo tee \
  /usr/share/keyrings/jenkins-keyring.asc > /dev/null

# Step 3: Add Jenkins repo to the system
$ echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null

# Step 4: Install Jenkins
$ sudo apt update
$ sudo apt install Jenkins

# Step 5: Verify installation
$ systemctl status Jenkins

# Step 6: Once Jenkins is up and running, access it from the link:
# http://localhost:8080
```



### docker

```bash
$ sudo mkdir -p /data/jenkins
$ sudo docker run \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  --env JENKINS_ADMIN_ID=admin \
  --env JENKINS_ADMIN_PASSWORD=password \
  --restart always \
   -v /data/jenkins:/var/jenkins_home \
  jenkins:jenkins

# http://localhost:8080
```

### war


```bash
$ sudo yum install fontconfig java-11-openjdk
$ sudo wget https://get.jenkins.io/war-stable/2.375.1/jenkins.war
$ sudo java -jar jenkins.war

# http://localhost:8080
```


介绍  {.cols-2}
---------------

###  目录结构

- `$jenkins_home/config.xml` 	jenkins配置文件
- `$jenkins_home/secrets/initialAdminPassword`	初始化admin密码
- `$jenkins_home/hudson.model.UpdateCenter.xml`	更新插件配置文件
- `$jenkins_home/update-center-rootCAs/`	校验更新插件内容的CA目录
- `$jenkins_home/plugins/`	插件目录
- `$jenkins_home/jobs/`	任务目录
- `$jenkins_home/users/`	用户目录
- `$jenkins_home/secrets/`	凭证目录
- `$jenkins_home/logs/`	日志目录



### JOB 类型

| 类型                 | 说明                                                         |
| -------------------- | ------------------------------------------------------------ |
| `Freestyle`            | 自由式构建作业是通用构建作业，可提供最大的灵活性。它可以用于任何类型的项目。 |
| `Pipeline`             | 该项目以代码形式运行整个软件开发工作流程。它可以将整个工作流作为一个代码运行。 |
| `Multiconfiguration`   | 多配置项目允许您在不同的环境中运行相同的构建作业。它用于在不同环境中测试应用程序。 |
| `Folder`               | 该项目允许用户创建文件夹以在一个文件夹或子文件夹中组织和分类类似的作业。 |
| `GitHub Organisation`  | 此项目扫描您的整个 GitHub 组织并为包含 Jenkinsfile 的每个存储库创建管道作业 |
| `Multibranch Pipeline` | 此项目类型允许您为同一项目的不同分支实施不同的 Jenkinsfile。 |



插件  {.cols-2}
---------------


### 常用插件

| 名称                                                         | 说明                                                         |
| :----------------------------------------------------------- | ------------------------------------------------------------ |
| [Role-based Authorization Strategy](https://plugins.jenkins.io/role-strategy ) | 生产当中常用的Jenkins用户视图权限管理插件。                  |
| [Periodic Backup](https://plugins.jenkins.io/periodicbackup) | 备份                                                         |
| [Notification](https://plugins.jenkins.io/notification)      | 发送任务通知                                                 |
| [Git Parameter](https://plugins.jenkins.io/git-parameter)    | 在参数化构建步骤当中，可添加Git的branch或者tag来作为参数进行构建。 |
| [AnsiColor](https://plugins.jenkins.io/ansicolor)            | 输出颜色                                                     |
| [SSH Agent](https://plugins.jenkins.io/git-parameter)        | ssh 客户端                                                   |
| [Build Name and Description Setter](https://plugins.jenkins.io/build-name-setter) | 修改构建名称和描述                                           |
| [Publish Over SSH](https://plugins.jenkins.io/publish-over-ssh) | 通过ssh上传文件                                              |
| [user build vars](https://plugins.jenkins.io/build-user-vars-plugin) | 让整个Jenkins系统中的用户参数成为一个可调用的变量            |
| [Throttle Concurrent Builds](https://plugins.jenkins.io/throttle-concurrents) | 允许限制每个节点或全局运行的项目并发构建的数量。             |
| [Active Choices](https://plugins.jenkins.io/uno-choice)      | 根据所选参数，自动调出对应参数所依赖的后续参数               |
| [Rebuilder](https://plugins.jenkins.io/rebuild)              | 直接重复上次构建                                             |
| [Email Extension](https://plugins.jenkins.io/email-ext)      | 邮件通知                                                     |
| [Workspace Cleanup](https://plugins.jenkins.io/ws-cleanup)   | 删除 workspace                                               |
| [Least Load](https://plugins.jenkins.io/leastload/)          | 使用slave最小负载的job调度算法                               |

### UpdateCenter

使用国内镜像源

```bash
[ ! -d /var/lib/jenkins/update-center-rootCAs ] \
  && mkdir /var/lib/jenkins/update-center-rootCAs
wget https://cdn.jsdelivr.net/gh/lework/jenkins-update-center/rootCA/update-center.crt \
  -O /var/lib/jenkins/update-center-rootCAs/update-center.crt
chown jenkins.jenkins -R /var/lib/jenkins/update-center-rootCAs
sed -i 's#https://updates.jenkins.io/update-center.json#https://cdn.jsdelivr.net/gh/lework/jenkins-update-center/updates/aliyun/update-center.json#' \
  /var/lib/jenkins/hudson.model.UpdateCenter.xml
systemctl restart jenkins
```

 

## JSON API {.cols-2}

### 任务管理

```
# 打印所有的任务
GET /api/json?tree=jobs[name]&pretty=true

# 开启任务
POST /job/enable

# 构建任务
POST /<name>/build

# 带参数的构建任务
POST /<name>/buildWithParameters?<params>

# 任务信息
GET /job/jobName/lastBuild/api/json
GET /job/repoName/job/BranchName/lastBuild/api/json
```

### 应用管理

- [http://localhost:8080/jenkins/exit ](http://localhost:8080/jenkins/exit) − 关闭 Jenkins
- [http://localhost:8080/jenkins/restart ](http://localhost:8080/jenkins/restart) − 重启 Jenkins
- [http://localhost:8080/jenkins/reload ](http://localhost:8080/jenkins/reload) − 重载



更多资源
---------------

- [官方文档](https://www.jenkins.io/doc/book/)
- [jenkins-groovy 示例 ](https://github.com/dennyzhang/cheatsheet-jenkins-groovy-A4)

