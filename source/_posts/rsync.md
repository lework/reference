---
title: rsync
icon: icon-style
background: bg-green-300
tags:
    - rsync
    - sync
categories:
    - 命令
date: 2023-02-21 19:37:53
intro: |
    使用 [rsync](https://rsync.samba.org/) 可提供快速增量文件传输。
---


入门
--------

### 安装 {.row-span-2}

```shell
# Install rsync
sudo apt-get install rsync

# Create a directory for rsync
sudo mkdir -p /var/rsync

# Set permissions
sudo chown -R root:root /var/rsync
sudo chmod -R 755 /var/rsync

# Create a configuration file
sudo cp /etc/rsyncd.conf /etc/rsyncd.conf_bak
sudo cat <EOF > /etc/rsyncd.conf
uid = root
gid = root
use chroot = yes
max connections = 4
strict modes = yes
log file = /var/log/rsyncd.log
pid file = /var/run/rsyncd.pid
[rsync_share]
    path = /var/rsync
    comment = Rsync Share
    read only = no
    list = yes
EOF
sudo chown root:root /etc/rsyncd.conf
sudo chmod 644 /etc/rsyncd.conf

# Start the rsync service
sudo systemctl start rsync 
sudo systemctl enable rsync
```


### 使用 {.col-span-2}
```shell
rsync [OPTION]... SRC [SRC]... DEST

# ssh协议 local->remote 
rsync [OPTION]... SRC [SRC]... [USER@]HOST:DEST

# ssh协议 remote->local
rsync [OPTION]... [USER@]HOST:SRC [DEST]

# rsync协议 local->remote 
rsync [OPTION]... SRC [SRC]... rsync://[USER@]HOST[:PORT]/DEST

# rsync协议 remote->local
rsync [OPTION]... rsync://[USER@]HOST[:PORT]/SRC [DEST]
```

### 示例 {.col-span-2}

```shell
# ./src/ 同步到 ./dest/
rsync -avz src/ dest

# ./src/ 同步到 ./dest/src/
rsync -avz src  dest

# 无差别同步并限流
rsync -avz --delete --bwlimit=2048 src/ dest

# 指定密码
rsync -avz /backup/ rsync_backup@10.0.0.9::backup/ --password-file=/etc/rsync.password

# 列出远程指定目录内的文件列表
rsync -v rsync://rsync_backup@10.0.0.9::backup/
```


常用操作  {.cols-1}
--------

### 远程传输

```shell
rsync -avz -e "ssh -l <user>" <src> <user>@<server>:<target>

# 指定ssh端口
rsync -avz ./deployment/ -e 'ssh -p 19527' root@10.0.0.9:/tools

# 使用sudo
rsync -avz -e ssh --rsync-path='sudo rsync' ./deployment/ 10.0.0.9:/etc/nginx/

# 通过带有密钥代理转发的跳转主机的隧道
rsync -e "ssh -A -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
      -o ProxyCommand=\"ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -W %h:%p ${SSH_USER}@${BASTION_HOST}\"" \
      ./deployment/ ${SSH_USER}@${TARGET_HOST}:/var/www/${ENV}/

# remote->local
rsync -avzh -e "ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" \
    --progress 'preview-host:/var/www/html/mb/app/*' /tmp/
    
# local->remote
rsync --rsync-path 'sudo rsync' -avP \
    -og --chown=root:root \
    --checksum --delete \
    ./deployment/ ubuntu@${TARGET_HOST}:/opt/app/${ENV}/
```

### 过滤

```shell
# 排除目录或文件
rsync -a --exclude=node_modules --exclude=.DS_Store --exclude=tmp /src_directory/ /dst_directory/

# 指定要在文件中排除的文件和目录
rsync -a --exclude-from='/exclude-file.txt' /src_directory/ /dst_directory/

# 合并过滤条件
rsync -a --exclude={'file1.txt','dir1/*','dir2'} src_directory/ dst_directory/

# 包含和排除
rsync -a -m \
    --include='*.jpg' \
    --include='*/' \
    --exclude='*' \
    src_directory/ dst_directory/
```


### 删除目录

```shell
mkdir /tmp/test
rsync --delete-before -a -H -v --progress --stats /tmp/test/ log/

```


## 更多资源 {.cols-1}

- [rsync](https://rsync.samba.org/) _(rsync.samba.org)_
- [rsyncd.conf](https://download.samba.org/pub/rsync/rsyncd.conf.5) _(samba.org)_
