---
title: Nginx 错误码
background: bg-[#00B140]
tags:
  - nginx
  - error-code
categories:
  - 错误码
date: 2023-03-29 19:22:42
intro:  Nginx 相关错误。
---



Nginx  {.cols-1}
--------

### 客户端错误代码

| 错误码                       | 原因                                             |
| ---------------------------- | ------------------------------------------------ |
| 400 Bad Request              | 请求不符合服务器的语法或参数无效                 |
| 401 Unauthorized             | 需要用户认证才能访问资源                         |
| 403 Forbidden                | 服务器拒绝访问所请求的资源                       |
| 404 Not Found                | 服务器无法找到所请求的资源                       |
| 405 Method Not Allowed       | 请求的HTTP方法不允许访问该资源                   |
| 408 Request Timeout          | 服务器等待请求时发生超时                         |
| 413 Request Entity Too Large | 请求的实体太大，服务器无法处理                   |
| 414 Request-URI Too Long     | 请求的URI太长，服务器无法处理                    |
| 415 Unsupported Media Type   | 请求的媒体类型不受支持                           |
| 499 Client has closed connection   | 客户端主动断开了连接                           |
| 500 Internal Server Error    | 服务器遇到了意外情况，无法完成请求               |
| 502 Bad Gateway              | 作为代理或网关的服务器从上游服务器接收到无效响应 |
| 503 Service Unavailable      | 服务器当前无法处理请求，可能是由于超载或维护     |
| 504 Gateway Timeout          | 作为代理或网关的服务器等待上游服务器响应超时     |

### 服务器错误代码

| 错误信息                                                     | 说明                                                         |
| :----------------------------------------------------------- | ------------------------------------------------------------ |
| recv() failed (104: Connection reset by peer)                | 客户关闭了连接，而服务器还在给客户端发送数据                 |
| recv() failed (104: Connection reset by peer) while connecting to upstream | upstream发送了RST，将连接重置                                |
| recv() failed (104: Connection reset by peer) while reading response header from upstream | 与上游服务器连接的套接字被对方重置                           |
| connect() failed (111: Connection refused) while connecting to upstream | Nginx 无法连接到上游服务器                                   |
| connect() failed (111: Connection refused) while reading response header from upstream | 用户在连接成功后读取数据时，若遇到后端upstream挂掉或者不通，会收到该错误 |
| connect() failed (111: Connection refused) while sending request to upstream | Nginx和upstream连接成功后发送数据时，若遇到后端upstream挂掉或者不通，会收到该错误 |
| connect() failed (110: Connection timed out) while connecting to upstream | Nginx 与上游服务器的连接超时                                 |
| connect() failed (110: Connection timed out) while reading upstream | Nginx 读取来自upstream的响应时超时                           |
| connect() failed (110: Connection timed out) while reading response header from upstream | nginx读取来自upstream的响应头时超时                          |
| no live upstreams while connecting to upstream               | Nginx 无法找到可用的上游服务器                               |
| upstream prematurely closed connection while reading response header from upstream | 上游服务器过早关闭连接                                       |
| upstream sent invalid header while reading response header from upstream | upstream发送的响应头无效                                     |
| upstream sent no valid HTTP/1.0 header while reading response header from upstream | upstream发送的响应头无效                                     |
| client intended to send too large body                       | 客户端发送的请求体太大，超过了 Nginx 的限制                  |
| server reached max_children setting, consider raising it     | Nginx 已经达到了进程数量的最大值                             |
| no resolver defined to resolve example.com                   | Nginx 未配置 DNS 解析器                                      |
| reopening logs                                               | 用户发送kill -USR1命令                                       |
| gracefully shutting down                                     | 用户发送kill -WINCH命令                                      |
| SSL_do_handshake() failed                                    | SSL/TLS 握手失败                                             |
| SSL: error:14094416:SSL routines:ssl3_read_bytes:sslv3 alert certificate unknown | SSL/TLS 握手失败，可能是由于证书问题                         |
| SSL: error:1408A0C1:SSL routines:ssl3_get_client_hello:no shared cipher | SSL/TLS 握手失败，没有共享的加密套件                         |
| SSL: error:1417A0C1:SSL routines:tls_post_process_client_hello:no shared cipher | SSL/TLS 握手失败，没有共享的加密套件                         |
| SSL_write() failed while sending response to client          | 在向客户端发送响应时，SSL/TLS 写入失败                       |
| SSL_read() failed (SSL: error:140940E5:SSL routines:ssl3_read_bytes:ssl handshake failure:<br />SSL alert unexpected message) while reading upstream | 从上游服务器读取数据时，SSL/TLS 握手失败                     |
| {.left-text}                                                 |                                                              |


更多资源
---

- [Nginx error log](https://nginx.org/en/docs/http/ngx_http_log_module.html#error_log)