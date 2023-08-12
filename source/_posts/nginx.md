---
title: Nginx
background: bg-[#00ad43]
tags:
  - tools
  - network
categories:
  - 工具
date: 2022-12-06 20:11:09
intro: 这个 [nginx](https://nginx.org/en/) 快速参考备忘单显示了它的常用命和配置使用清单。
---

基础
---------------

### 常用命令 {.col-span-1 .row-span-2}
```sh
sudo systemctl status nginx # nginx当前状态
sudo systemctl reload nginx # 重新加载 nginx
sudo systemctl restart nginx # 重启nginx

sudo nginx -t   # 检查语法
nginx           # 启动
nginx -s reload # 重启
nginx -s stop   # 关闭进程
nginx -s quit   # 平滑关闭nginx
nginx -V        # 查看nginx的安装状态，
```

###  安装  {.col-span-2}
```bash
yum -y install nginx                                                            #yum安装
docker run --name some-nginx -v /some/content:/usr/share/nginx/html:ro -d nginx #doker安装
```

###  代理示例 {.col-span-2}
```nginx
location / {
  proxy_pass http://127.0.0.1:3000;
  proxy_redirect      off;
  proxy_set_header    Host $host;
}
```


### 全局变量 {.col-span-2 .row-span-4}
| 变量 | 说明
:- | :-
`$args` | 这个变量等于请求行中的参数，同 `$query_string`
`$remote_port` | 客户端的端口
`$content_length` | 请求头中的 `Content-length` 字段
`$remote_user` | 已经经过 `Auth Basic Module` 验证的用户名
`$content_type` | 请求头中的 `Content-Type` 字段
`$request_filename` | 当前请求的文件路径，由 `root` 或alias指令与URI请求生成
`$document_root` | 当前请求在 `root` 指令中指定的值
`$scheme` | HTTP方法（如http，https）
`$host` | 请求主机头字段，否则为服务器名称
`$hostname` | 主机名
`$http_user_agent` | 客户端`agent`信息
`$http_cookie` | 客户端`cookie`信息
`$server_protocol` | 请求使用的协议，通常是`HTTP/1.0`或`HTTP/1.1`
`$server_addr` | 服务器地址，在完成一次系统调用后可以确定这个值
`$server_name` | 服务器名称
`$server_port` | 请求到达服务器的端口号
`$limit_rate` | 这个变量可以限制连接速率
`$request_method` | 客户端请求的动作，如 GET/POST
`$request_uri` | 包含请求参数的原始URI，不包含主机名，如：`/foo/bar.php?arg=baz`
`$remote_addr` | 客户端的IP地址
`$uri` | 不带请求参数的当前URI，`$uri`不包含主机名，如 `/foo/bar.html`
`$document_uri` | 与 `$uri` 相同
`$nginx_version` | `nginx` 版本

更多全局变量[查看官方文档](https://nginx.org/en/docs/varindex.html)
### 监听端口
```nginx
server {
  listen 80;      # 标准 HTTP 协议
  listen 443 ssl; # 标准 HTTPS 协议
  listen 443 ssl http2; # 对于 http2
  listen [::]:80; # 使用 IPv6 在 80 上收听
  # 仅收听使用 IPv6
  listen [::]:80 ipv6only=on;
}
```

### 域名 (server_name)

```nginx
server {
  # 监听 example.com
  server_name example.com;
  # 监听多个域
  server_name example.com www.example.com;
  # 监听所有子域
  server_name *.example.com;
  # 监听所有顶级域
  server_name example.*;
  # 监听未指定的主机名（监听 IP 地址本身）
  server_name "";
}
```

### 负载均衡(简单实例)

```nginx
upstream node_js {
  server 0.0.0.0:3000;
  server 0.0.0.0:4000;
  server 0.0.0.0:5000;
}
```

### 负载均衡(权重)

```nginx
upstream test {
  server localhost:8080 weight=9;
  server localhost:8081 weight=1;
}
```

### upstream ip_hash

```nginx {2}
upstream test {
  ip_hash;
  server localhost:8080;
  server localhost:8081;
}
```

解决负载均衡 `session` 的问题

### upstream fair

```nginx {2}
upstream backend {
  fair;
  server localhost:8080;
  server localhost:8081;
}
```

响应时间短的优先分配

### server 可选参数{.row-span-2}

:- | :-
:- | :-
`weight` | 访问权重数值越高，收到请求越多
`fail_timeout` | 指定的时间内必须提供响应
`max_fails` | 尝试失败服务器连接的最大次数
`down` | 标记一个服务器不再接受任何请求
`backup` | 有服务器宕机，标记的机器接收请求

配置示例

```nginx
upstream test {
  server 127.0.0.1:83 weight=9; # 权重
  server 127.0.0.1:83 weight=1; # 权重
  # 失败超时时间
  server 127.0.0.1:83 max_fails=3;
  server 127.0.0.1:83 weight=3 down;
}
```

### upstream url_hash

```nginx {2,3}
upstream backend {
  hash $request_uri;
  hash_method crc32;
  server localhost:8080;
  server localhost:8081;
}
```

按访问url的hash结果来分配请求

### upstream keepalive

```nginx {4}
upstream memcached_backend {
    server 127.0.0.1:11211;
    server 10.0.0.2:11211;
    keepalive 32;
}
```

激活缓存以连接到上游服务器

### 子文件夹中的代理 {.col-span-2}

```nginx {1,2}
location /folder/ { # / 很重要！
  proxy_pass http://127.0.0.1:3000/; # / 很重要！
  proxy_redirect      off;
  proxy_set_header    Host            $host;
  proxy_set_header    X-Real-IP       $remote_addr;
  proxy_set_header    X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

### 反向代理 {.row-span-3}

#### 基础

```nginx
server {
  listen 80;
  server_name example.com;
  
  location / {
    proxy_pass http://0.0.0.0:3000;
    # 其中 0.0.0.0:3000 是绑定在 
    # 0.0.0.0端口3000 列表上的 Node.js 服务器
  }
}
```

#### 基础 + (upstream)

```nginx
upstream node_js {
  server 0.0.0.0:3000;
  # 其中 0.0.0.0:3000 是绑定在 
  # 0.0.0.0端口3000 列表上的 Node.js 服务器
}

server {
  listen 80;
  server_name example.com;
  
  location / {
    proxy_pass http://node_js;
  }
}
```

#### 升级连接（适用于支持 WebSockets 的应用程序）

```nginx
upstream node_js {
  server 0.0.0.0:3000;
}

server {
  listen 80;
  server_name example.com;
  
  location / {
    proxy_pass http://node_js;
    proxy_redirect off;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
 
  }
}
```

适用于 Node.js、Streamlit、Jupyter 等

### 静态资源（传统 Web 服务器） {.col-span-2}

```nginx
server {
  listen 80;
  server_name example.com;
  root /path/to/website;
  # root /www/data/ 示例，如果里面没有'root'，它将寻找 /www/data/index.html
  location / {
  }
  location /images/ { # 如果里面没有“root”，它将寻找 /www/data/images/index.html
  }
  location /videos/ { # 由于里面有“root”，它会寻找 /www/media/videos/index.html
      root /www/media;
  }
}
```
### HTTPS 协议 {.col-span-2}

大多数 SSL 选项取决于您的应用程序做什么或需要什么

```nginx
server {
  listen 443 ssl http2;
  server_name example.com;
  ssl on;

  ssl_certificate /path/to/cert.pem;
  ssl_certificate_key /path/to/privkey.pem;

  ssl_stapling on;
  ssl_stapling_verify on;
  ssl_trusted_certificate /path/to/fullchain.pem;

  ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
  ssl_session_timeout 1d;
  ssl_session_cache shared:SSL:50m;
  add_header Strict-Transport-Security max-age=15768000;
}
```

您可以使用 Let's Encrypt 轻松保护您的网站/应用程序。去 [lets-encrypt](https://certbot.eff.org/lets-encrypt/ubuntuxenial-nginx.html) 获取更多信息

### 重定向(301永久) {.row-span-2}

```nginx
server {
  listen 80;
  server_name www.example.com;
  return 301 http://example.com$request_uri;
}
```

将 http 重定向到 https

```nginx
server {
  listen 80;
  server_name example.com;
  return 301 https://example.com$request_uri;
}
```

### 重定向(302临时)

```nginx
server {
  listen 80;
  server_name yourdomain.com;
  return 302 http://otherdomain.com;
}
```

### 永久重定向到 HTTPS 安全域

```nginx
server {
  listen 80;
  server_name yourdomain.com;
  return 301 https://$host$request_uri;
}
```

### 重定向参数

:- | :-
:- | :-
`permanent` | 永久性重定向。日志中的状态码为 `301`
`redirect` | 临时重定向。日志中的状态码为 `302`

### HTTP 请求端真实的IP

```nginx
location / {
  proxy_set_header X-Forwarded-For $remote_addr;
}
```
### nginx验证 {.col-span-2}
```nginx
location /data {
        charset  off;
        auth_basic           "Please input password";
        auth_basic_user_file /etc/nginx/.htpasswd;
        alias    /home//www/data;
        index    index.html index.htm;
    }
```
htpasswd+nginx验证

示例  {.cols-6}
----

### websocket 的代理 keepalive {.col-span-3}

```nginx
# Upstreams
upstream backend {
    server 127.0.0.1:3000;
    keepalive 5;
}
# HTTP Server
server {
  server_name your_hostname.com;
  error_log /var/log/nginx/rocketchat.access.log;
  location / {
      proxy_pass http://backend;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
      proxy_set_header Host $http_host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forward-Proto http;
      proxy_set_header X-Nginx-Proxy true;
      proxy_redirect off;
  }
}
```

### Apache 的反向代理 {.col-span-3}

```nginx
server {
  server_name domain.tld;

  access_log /log/domain.tld.access.log;
  error_log /log/domain.tld.error.log;
  root /var/www/domain.tld/htdocs;

  # 将请求传递给 Apache 后端
  location / {
      proxy_pass http://backend;
  }
  # 使用后备处理静态文件
  location ~* \.(ogg|ogv|svg|svgz|eot|otf|woff|woff2|ttf|m4a|mp4|ttf|rss|atom|jpe?g|gif|cur|heic|png|tiff|ico|zip|webm|mp3|aac|tgz|gz|rar|bz2|doc|xls|exe|ppt|tar|mid|midi|wav|bmp|rtf|swf|webp)$ {
      add_header "Access-Control-Allow-Origin" "*";
      access_log off;
      log_not_found off;
      expires max;
      try_files $uri @fallback;
  }
  # 如果找不到文件，则回退以将请求传递给 Apache
  location @fallback {
      proxy_pass http://backend;
  }
}
```

### Gitlab 的反向代理 {.col-span-4 .row-span-3}

```nginx
server {
  #侦听的80端口
  listen       80;
  server_name  git.example.cn;
  location / {
    proxy_pass   http://localhost:3000;
    # 以下是一些反向代理的配置可删除
    proxy_redirect             off;
    # 后端的Web服务器可以通过X-Forwarded-For获取用户真实IP
    proxy_set_header           Host $host;
    client_max_body_size       10m;  # 允许客户端请求的最大单文件字节数
    client_body_buffer_size    128k; # 缓冲区代理缓冲用户端请求的最大字节数
    proxy_connect_timeout      300;  # nginx跟后端服务器连接超时时间(代理连接超时)
    proxy_send_timeout         300;  # 后端服务器数据回传时间(代理发送超时)
    proxy_read_timeout         300;  # 连接成功后，后端服务器响应时间(代理接收超时)
    # 设置代理服务器（nginx）保存用户头信息的缓冲区大小
    proxy_buffer_size          4k;
    # proxy_buffers缓冲区，网页平均在32k以下的话，这样设置
    proxy_buffers              4 32k;
    # 高负荷下缓冲大小（proxy_buffers*2）
    proxy_busy_buffers_size    64k;
  }
}
```
### 重定向整个网站 {.col-span-2}

```nginx
server {
  server_name old-site.com;
  return 301 $scheme://new-site.com$request_uri;
}
```
### 重定向单页 {.col-span-2}

```nginx
server {
  location = /oldpage.html {
    return 301 http://example.org/newpage.html;
  }
}
```

### 重定向整个子路径 {.col-span-2}

```nginx
location /old-site {
  rewrite ^/old-site/(.*) http://example.org/new-site/$1 permanent;
}
```

### 负载均衡 {.col-span-3}

```nginx
upstream example {
  ip_hash;
  # upstream的负载均衡，weight是权重，可以根据机器配置定义权重。
  # weigth参数表示权值，权值越高被分配到的几率越大。
  server 192.168.122.11:8081 ;
  server 127.0.0.1:82 weight=3;
  server 127.0.0.1:83 weight=3 down;
  server 127.0.0.1:84 weight=3; max_fails=3  fail_timeout=20s;
  server 127.0.0.1:85 weight=4;;
  keepalive 32;
}
server {
  #侦听的80端口
  listen       80;
  server_name  git.example.cn;
  location / {
    # 在这里设置一个代理，和 upstream 的名字一样
    proxy_pass   http://example;
  }
}
```

### 内容缓存 {.col-span-3}

允许浏览器基本上永久地缓存静态内容。 Nginx 将为您设置 Expires 和 Cache-Control 头信息

```nginx {3}
location /static {
    root /data;
    expires max;
}
```

如果要求浏览器永远不会缓存响应（例如用于跟踪请求），请使用 `-1`

```nginx {3}
location = /empty.gif {
    empty_gif;
    expires -1;
}
```
### 跨域问题 {.col-span-3}

```nginx
server {
  listen 80;
  server_name api.xxx.com;
    
  add_header 'Access-Control-Allow-Origin' '*';
  add_header 'Access-Control-Allow-Credentials' 'true';
  add_header 'Access-Control-Allow-Methods' 'GET,POST,HEAD';

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host  $http_host;    
  } 
}
```
### 重定向 URI 来解决跨域问题 {.col-span-3 .row-span-2}

```nginx
upstream test {
  server 127.0.0.1:8080;
  server localhost:8081;
}
server {
  listen 80;
  server_name api.xxx.com;
  location / { 
    root  html;                   # 去请求../html文件夹里的文件
    index  index.html index.htm;  # 首页响应地址
  }
  # 用于拦截请求，匹配任何以 /api/开头的地址，
  # 匹配符合以后，停止往下搜索正则。
  location ^~/api/{ 
    # 代表重写拦截进来的请求，并且只能对域名后边的除去传递的参数外的字符串起作用
    # 例如www.a.com/api/msg?meth=1&par=2重写，只对/api/msg重写。
    # rewrite后面的参数是一个简单的正则 ^/api/(.*)$，
    # $1代表正则中的第一个()，$2代表第二个()的值，以此类推。
    rewrite ^/api/(.*)$ /$1 break;
    
    # 把请求代理到其他主机 
    # 其中 http://www.b.com/ 写法和 http://www.b.com写法的区别如下
    # 如果你的请求地址是他 http://server/html/test.jsp
    # 配置一： http://www.b.com/ 后面有“/” 
    #         将反向代理成 http://www.b.com/html/test.jsp 访问
    # 配置一： http://www.b.com 后面没有有“/” 
    #         将反向代理成 http://www.b.com/test.jsp 访问
    proxy_pass http://test;

    # 如果 proxy_pass  URL 是 http://a.xx.com/platform/ 这种情况
    # proxy_cookie_path应该设置成 /platform/ / (注意两个斜杠之间有空格)。
    proxy_cookie_path /platfrom/ /;

    # 设置 Cookie 头通过
    proxy_pass_header Set-Cookie;
  } 
}
```
### 跳转到带 www 的域上面 {.col-span-3}

```nginx
server {
  listen 80;
  # 配置正常的带www的域名
  server_name www.wangchujiang.com;
  root /home/www/wabg/download;
  location / {
      try_files $uri $uri/ /index.html =404;
  }
}

server {
  # 将不带 www 的 wangchujiang.com 
  # 永久性重定向到 https://www.wangchujiang.com
  server_name wangchujiang.com;
  rewrite ^(.*) https://www.wangchujiang.com$1 permanent;
}
```
### 代理转发 {.col-span-2 .row-span-2}

```nginx
upstream server-api {
  # api 代理服务地址
  server 127.0.0.1:3110;    
}
upstream server-resource {
  # 静态资源 代理服务地址
  server 127.0.0.1:3120;
}
server {
  listen       3111;
  server_name  localhost; # 这里指定域名
  root /home/www/server-statics;
  # 匹配 api 路由的反向代理到API服务
  location ^~/api/ {
      rewrite ^/(.*)$ /$1 break;
      proxy_pass http://server-api;
  }
  # 假设这里验证码也在API服务中
  location ^~/captcha {
      rewrite ^/(.*)$ /$1 break;
      proxy_pass http://server-api;
  }
  # 假设你的图片资源全部在另外一个服务上面
  location ^~/img/ {
      rewrite ^/(.*)$ /$1 break;
      proxy_pass http://server-resource;
  }
  # 路由在前端，后端没有真实路由，
  # 路由不存在的 404 状态的页面返回 /index.html
  # 使用场景，用在 React/Vue项目没有真实路由
  location / {
    try_files $uri $uri/ /index.html =404;
    #                      空格很重要 ^
  }
}
```

### 屏蔽 IP {.col-span-4}

可以放到 `http`, `server`, `location`, `limit_except` 语句块

```nginx
include blockip.conf;
```

在 `blockip.conf` 里面输入内容，如：

```nginx
deny 165.91.122.67;

deny IP;            # 屏蔽单个 ip 访问
allow IP;           # 允许单个 ip 访问
deny all;           # 屏蔽所有 ip 访问
allow all;          # 允许所有 ip 访问
deny 123.0.0.0/8;   # 屏蔽整个段即从 123.0.0.1 到 123.255.255.254 访问的命令
deny 124.45.0.0/16; # 屏蔽IP段即从 123.45.0.1 到 123.45.255.254 访问的命令
deny 123.45.6.0/24; # 屏蔽IP段即从 123.45.6.1 到 123.45.6.254 访问的命令

# 如果你想实现这样的应用，除了几个IP外，其他全部拒绝
allow 1.1.1.1; 
allow 1.1.1.2;
deny all; 
```

### 强制将 http 重定向到 https {.col-span-4}
```nginx
server {
  listen       80;
  server_name  example.com;
  rewrite ^ https://$http_host$request_uri? permanent; # 强制将 http 重定向到 https
  # 在错误页面和“服务器”响应头字段中启用或禁用发射nginx版本。 防止黑客利用版本漏洞攻击
  server_tokens off;
}
```

### 代理转发连接替换 {.col-span-2}

```nginx
location ^~/api/upload {
  rewrite ^/(.*)$ /wfs/v1/upload break;
  proxy_pass http://wfs-api;
}
```

将地址 `/api/upload` 替换为 `/wfs/v1/upload`

### 爬虫 User-Agent 过滤 {.col-span-4}

```nginx
location / {
  if ($http_user_agent ~* "python|curl|java|wget|httpclient|okhttp") {
      return 503;
  }
  # 正常处理
  # ...
}
```
### 图片防盗链 {.col-span-2}

```nginx
location ~* \.(gif|jpg|png|swf|flv)$ {
  root html;

  valid_referers none blocked *.nginx.com;

  if ($invalid_referer) {
    rewrite ^/ www.nginx.cn;
    # return 404;
  }
}
```
### 虚拟目录配置 {.col-span-2}

```nginx
location /img/ {
  alias /var/www/image/;
}
# 访问 /img/ 目录里面的文件时，
# 会自动去 /var/www/image/ 目录找文件
location /img/ {
  root /var/www/image;
}
# 访问 /img/ 目录下的文件时，
# 会去 /var/www/image/img/ 目录下找文件
```
### 屏蔽文件目录 {.col-span-2 .row-span-2}

```nginx
location ~* "\.(old|orig|original|php#|php~|php_bak|save|swo|aspx?|tpl|sh|bash|bak?|cfg|cgi|dll|exe|git|hg|ini|jsp|log|mdb|out|sql|svn|swp|tar|rdf)$" {
    deny all;
}
```

拒绝访问 `.git` 和 `.svn` 目录

```nginx
location ~ (.git|.svn) {
    deny all;
}
```

拒绝访问隐藏文件和目录

```nginx
location ~ /\.(?!well-known\/) {
    deny all;
}
```

### 防盗图配置 {.col-span-4}

```nginx
location ~ \/public\/(css|js|img)\/.*\.(js|css|gif|jpg|jpeg|png|bmp|swf) {
  valid_referers none blocked *.jslite.io;
  if ($invalid_referer) {
      rewrite ^/  http://wangchujiang.com/piratesp.png;
  }
}
```

### 阻止常见攻击 {.col-span-2}

#### base64编码的网址

```nginx
location ~* "(base64_encode)(.*)(\()" {
    deny all;
}
```

#### javascript eval() url

```nginx
location ~* "(eval\()" {
    deny all;
}
```

### Gzip 配置 {.col-span-4 .row-span-2}

```nginx
gzip  on;
gzip_buffers 16 8k;
gzip_comp_level 6;
gzip_http_version 1.1;
gzip_min_length 256;
gzip_proxied any;
gzip_vary on;
gzip_types
    text/xml application/xml application/atom+xml application/rss+xml application/xhtml+xml image/svg+xml
    text/javascript application/javascript application/x-javascript
    text/x-json application/json application/x-web-app-manifest+json
    text/css text/plain text/x-component
    font/opentype application/x-font-ttf application/vnd.ms-fontobject
    image/x-icon;
gzip_disable  "msie6";
```

### 使网站不可索引 {.col-span-2}

```nginx
add_header X-Robots-Tag "noindex";

location = /robots.txt {
  return 200 "User-agent: *\nDisallow: /\n";
}
```

## 编译  {.cols-2}

### 编译安装

```bash
yum -y install gcc gcc-c++ make ncurses ncurses-devel zlib-devel pcre-devel openssl-devel
wget http://nginx.org/download/nginx-1.23.4.tar.gz
tar xfz nginx-1.23.4.tar.gz 
cd nginx-1.23.4

./configure \
--prefix=/usr/share/nginx \
--sbin-path=/usr/sbin/nginx \
--conf-path=/etc/nginx/nginx.conf \
--error-log-path=/var/log/nginx/error.log \
--http-log-path=/var/log/nginx/access.log \
--pid-path=/var/run/nginx.pid \
--lock-path=/var/run/nginx.lock \
--http-client-body-temp-path=/var/cache/nginx/client_temp \
--http-proxy-temp-path=/var/cache/nginx/proxy_temp \
--http-fastcgi-temp-path=/var/cache/nginx/fastcgi_temp \
--http-uwsgi-temp-path=/var/cache/nginx/uwsgi_temp \
--http-scgi-temp-path=/var/cache/nginx/scgi_temp \
--user=nginx \
--group=nginx \
--with-http_ssl_module \
--with-http_realip_module \
--with-http_addition_module \
--with-http_sub_module \
--with-http_dav_module \
--with-http_flv_module \
--with-http_mp4_module \
--with-http_gunzip_module \
--with-http_gzip_static_module \
--with-http_random_index_module \
--with-http_secure_link_module \
--with-http_stub_status_module \
--with-http_auth_request_module \
--with-mail \
--with-mail_ssl_module \
--with-file-aio \
--with-http_v2_module \

make & make install

mkdir -p /var/cache/nginx/client_temp
chown nginx -R /var/cache/nginx/client_temp

cat << EOF > /lib/systemd/system/nginx.service
[Unit]
Description=The NGINX HTTP and reverse proxy server
After=syslog.target network-online.target remote-fs.target nss-lookup.target
Wants=network-online.target

[Service]
Type=forking
PIDFile=/run/nginx.pid
ExecStartPre=/usr/sbin/nginx -t
ExecStart=/usr/sbin/nginx
ExecReload=/usr/sbin/nginx -s reload
ExecStop=/bin/kill -s QUIT $MAINPID
PrivateTmp=true
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF


systemctl daemon-reload
systemctl enable --now nginx

```


### 编译参数
```
--prefix= 指向安装目录
--sbin-path 指向（执行）程序文件（nginx）
--conf-path= 指向配置文件（nginx.conf）
--error-log-path= 指向错误日志目录
--pid-path= 指向pid文件（nginx.pid）
--lock-path= 指向lock文件（nginx.lock）（安装文件锁定，防止安装文件被别人利用，或自己误操作。）
--user= 指定程序运行时的非特权用户
--group= 指定程序运行时的非特权用户组
--builddir= 指向编译目录
--with-rtsig_module 启用rtsig模块支持（实时信号）
--with-select_module 启用select模块支持（一种轮询模式,不推荐在高载环境下使用）禁用：--without-select_module
--with-poll_module 启用poll模块支持（功能与select相同，与select特性相同，为一种轮询模式,不推荐在高载环境下使用）
--with-file-aio 启用file aio支持（一种APL文件传输格式）
--with-ipv6 启用ipv6支持
--with-http_ssl_module 启用ngx_http_ssl_module支持（使支持https请求，需已安装openssl）
--with-http_realip_module 启用ngx_http_realip_module支持（这个模块允许从请求标头更改客户端的IP地址值，默认为关）
--with-http_addition_module 启用ngx_http_addition_module支持（作为一个输出过滤器，支持不完全缓冲，分部分响应请求）
--with-http_xslt_module 启用ngx_http_xslt_module支持（过滤转换XML请求）
--with-http_image_filter_module 启用ngx_http_image_filter_module支持（传输JPEG/GIF/PNG 图片的一个过滤器）（默认为不启用。gd库要用到）
--with-http_geoip_module 启用ngx_http_geoip_module支持（该模块创建基于与MaxMind GeoIP二进制文件相配的客户端IP地址的ngx_http_geoip_module变量）
--with-http_sub_module 启用ngx_http_sub_module支持（允许用一些其他文本替换nginx响应中的一些文本）
--with-http_dav_module 启用ngx_http_dav_module支持（增加PUT,DELETE,MKCOL：创建集合,COPY和MOVE方法）默认情况下为关闭，需编译开启
--with-http_flv_module 启用ngx_http_flv_module支持（提供寻求内存使用基于时间的偏移量文件）
--with-http_gzip_static_module 启用ngx_http_gzip_static_module支持（在线实时压缩输出数据流）
--with-http_random_index_module 启用ngx_http_random_index_module支持（从目录中随机挑选一个目录索引）
--with-http_secure_link_module 启用ngx_http_secure_link_module支持（计算和检查要求所需的安全链接网址）
--with-http_degradation_module  启用ngx_http_degradation_module支持（允许在内存不足的情况下返回204或444码）
--with-http_stub_status_module 启用ngx_http_stub_status_module支持（获取nginx自上次启动以来的工作状态）
--without-http_charset_module 禁用ngx_http_charset_module支持（重新编码web页面，但只能是一个方向--服务器端到客户端，并且只有一个字节的编码可以被重新编码）
--without-http_gzip_module 禁用ngx_http_gzip_module支持（该模块同-with-http_gzip_static_module功能一样）
--without-http_ssi_module 禁用ngx_http_ssi_module支持（该模块提供了一个在输入端处理处理服务器包含文件（SSI）的过滤器，目前支持SSI命令的列表是不完整的）
--without-http_userid_module 禁用ngx_http_userid_module支持（该模块用来处理用来确定客户端后续请求的cookies）
--without-http_access_module 禁用ngx_http_access_module支持（该模块提供了一个简单的基于主机的访问控制。允许/拒绝基于ip地址）
--without-http_auth_basic_module禁用ngx_http_auth_basic_module（该模块是可以使用用户名和密码基于http基本认证方法来保护你的站点或其部分内容）
--without-http_autoindex_module 禁用disable ngx_http_autoindex_module支持（该模块用于自动生成目录列表，只在ngx_http_index_module模块未找到索引文件时发出请求。）
--without-http_geo_module 禁用ngx_http_geo_module支持（创建一些变量，其值依赖于客户端的IP地址）
--without-http_map_module 禁用ngx_http_map_module支持（使用任意的键/值对设置配置变量）
--without-http_split_clients_module 禁用ngx_http_split_clients_module支持（该模块用来基于某些条件划分用户。条件如：ip地址、报头、cookies等等）
--without-http_referer_module 禁用disable ngx_http_referer_module支持（该模块用来过滤请求，拒绝报头中Referer值不正确的请求）
--without-http_rewrite_module 禁用ngx_http_rewrite_module支持（该模块允许使用正则表达式改变URI，并且根据变量来转向以及选择配置。如果在server级别设置该选项，那么他们将在 location之前生效。如果在location还有更进一步的重写规则，location部分的规则依然会被执行。如果这个URI重写是因为location部分的规则造成的，那么 location部分会再次被执行作为新的URI。 这个循环会执行10次，然后Nginx会返回一个500错误。）
--without-http_proxy_module 禁用ngx_http_proxy_module支持（有关代理服务器）
--without-http_fastcgi_module 禁用ngx_http_fastcgi_module支持（该模块允许Nginx 与FastCGI 进程交互，并通过传递参数来控制FastCGI 进程工作。 ）FastCGI一个常驻型的公共网关接口。
--without-http_uwsgi_module 禁用ngx_http_uwsgi_module支持（该模块用来医用uwsgi协议，uWSGI服务器相关）
--without-http_scgi_module 禁用ngx_http_scgi_module支持（该模块用来启用SCGI协议支持，SCGI协议是CGI协议的替代。它是一种应用程序与HTTP服务接口标准。它有些像FastCGI但他的设计 更容易实现。）
--without-http_memcached_module 禁用ngx_http_memcached_module支持（该模块用来提供简单的缓存，以提高系统效率）
--without-http_limit_zone_module 禁用ngx_http_limit_zone_module支持（该模块可以针对条件，进行会话的并发连接数控制）
--without-http_limit_req_module 禁用ngx_http_limit_req_module支持（该模块允许你对于一个地址进行请求数量的限制用一个给定的session或一个特定的事件）
--without-http_empty_gif_module 禁用ngx_http_empty_gif_module支持（该模块在内存中常驻了一个1*1的透明GIF图像，可以被非常快速的调用）
--without-http_browser_module 禁用ngx_http_browser_module支持（该模块用来创建依赖于请求报头的值。如果浏览器为modern ，则$modern_browser等于modern_browser_value指令分配的值；如 果浏览器为old，则$ancient_browser等于 ancient_browser_value指令分配的值；如果浏览器为 MSIE中的任意版本，则 $msie等于1）
--without-http_upstream_ip_hash_module 禁用ngx_http_upstream_ip_hash_module支持（该模块用于简单的负载均衡）
--with-http_perl_module 启用ngx_http_perl_module支持（该模块使nginx可以直接使用perl或通过ssi调用perl）
--with-perl_modules_path= 设定perl模块路径
--with-perl= 设定perl库文件路径
--http-log-path= 设定access log路径
--http-client-body-temp-path= 设定http客户端请求临时文件路径
--http-proxy-temp-path= 设定http代理临时文件路径
--http-fastcgi-temp-path= 设定http fastcgi临时文件路径
--http-uwsgi-temp-path= 设定http uwsgi临时文件路径
--http-scgi-temp-path= 设定http scgi临时文件路径
--without-http 禁用http server功能
--without-http-cache 禁用http cache功能
--with-mail 启用POP3/IMAP4/SMTP代理模块支持
--with-mail_ssl_module 启用ngx_mail_ssl_module支持
--without-mail_pop3_module 禁用pop3协议（POP3即邮局协议的第3个版本,它是规定个人计算机如何连接到互联网上的邮件服务器进行收发邮件的协议。是因特网电子邮件的第一个离线协议标 准,POP3协议允许用户从服务器上把邮件存储到本地主机上,同时根据客户端的操作删除或保存在邮件服务器上的邮件。POP3协议是TCP/IP协议族中的一员，主要用于 支持使用客户端远程管理在服务器上的电子邮件）
--without-mail_imap_module 禁用imap协议（一种邮件获取协议。它的主要作用是邮件客户端可以通过这种协议从邮件服务器上获取邮件的信息，下载邮件等。IMAP协议运行在TCP/IP协议之上， 使用的端口是143。它与POP3协议的主要区别是用户可以不用把所有的邮件全部下载，可以通过客户端直接对服务器上的邮件进行操作。）
--without-mail_smtp_module 禁用smtp协议（SMTP即简单邮件传输协议,它是一组用于由源地址到目的地址传送邮件的规则，由它来控制信件的中转方式。SMTP协议属于TCP/IP协议族，它帮助每台计算机在发送或中转信件时找到下一个目的地。）
--with-google_perftools_module 启用ngx_google_perftools_module支持（调试用，剖析程序性能瓶颈）
--with-cpp_test_module 启用ngx_cpp_test_module支持
--add-module= 启用外部模块支持
--with-cc= 指向C编译器路径
--with-cpp= 指向C预处理路径
--with-cc-opt= 设置C编译器参数（PCRE库，需要指定–with-cc-opt=”-I /usr/local/include”，如果使用select()函数则需要同时增加文件描述符数量，可以通过–with-cc- opt=”-D FD_SETSIZE=2048”指定。）
--with-ld-opt= 设置连接文件参数。（PCRE库，需要指定–with-ld-opt=”-L /usr/local/lib”。）
--with-cpu-opt= 指定编译的CPU，可用的值为: pentium, pentiumpro, pentium3, pentium4, athlon, opteron, amd64, sparc32, sparc64, ppc64
--without-pcre 禁用pcre库
--with-pcre 启用pcre库
--with-pcre= 指向pcre库文件目录
--with-pcre-opt= 在编译时为pcre库设置附加参数
--with-md5= 指向md5库文件目录（消息摘要算法第五版，用以提供消息的完整性保护）
--with-md5-opt= 在编译时为md5库设置附加参数
--with-md5-asm 使用md5汇编源
--with-sha1= 指向sha1库目录（数字签名算法，主要用于数字签名）
--with-sha1-opt= 在编译时为sha1库设置附加参数
--with-sha1-asm 使用sha1汇编源
--with-zlib= 指向zlib库目录
--with-zlib-opt= 在编译时为zlib设置附加参数
--with-zlib-asm= 为指定的CPU使用zlib汇编源进行优化，CPU类型为pentium, pentiumpro
--with-libatomic 为原子内存的更新操作的实现提供一个架构
--with-libatomic= 指向libatomic_ops安装目录
--with-openssl= 指向openssl安装目录
--with-openssl-opt 在编译时为openssl设置附加参数
--with-debug 启用debug日志
```
[参数说明](http://nginx.org/en/docs/configure.html)

## 更多资源 {.cols-1}

- [Nginx 配置](https://nginxconfig.io/) _(nginxconfig.io)_
- [Nginx 安装维护入门学习笔记](https://jaywcjlove.github.io/nginx-tutorial) _(jaywcjlove.github.io)_
- [advanced-nginx-cheatsheet](https://virtubox.github.io/advanced-nginx-cheatsheet/) _(virtubox.github.io)_
- [第三方模块](https://www.nginx.com/resources/wiki/modules/)