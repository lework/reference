---
title: HTTP 状态码
background: bg-[#3b7dc0]
date: 2023-03-29 20:19:304
tags:
    - http
    - error-code
categories:
    - 错误码
intro: |
    HTTP 状态码由三个十进制数字组成，第一个十进制数字定义了状态码的类型。
plugins:
    - tooltip
---

HTTP 状态码
-----------

### 分类
- [1xx：信息性状态码](#1xx-information){data-tooltip="这表示请求已经被接收，进程正在继续处理。"}
- [2xx：成功状态码](#2xx-successful){data-tooltip="这表示动作已经成功接收、理解和接受。"}
- [3xx：重定向状态码](#3xx-redirection){data-tooltip="这表示必须采取进一步行动才能完成请求。"}
- [4xx：客户端错误状态码](#4xx-client-error){data-tooltip="这表示请求包含错误的语法或无法完成。"}
- [5xx：服务器错误状态码](#5xx-server-error){data-tooltip="这表示服务器未能满足显然有效的请求。"}


### 2xx. Successful
- [200: OK](https://tools.ietf.org/html/rfc7231#section-6.3.1){data-tooltip="请求成功。"}
- [201: Created](https://tools.ietf.org/html/rfc7231#section-6.3.2){data-tooltip="请求已经被完成，并创建了一个新的资源。"}
- [202: Accepted](https://tools.ietf.org/html/rfc7231#section-6.3.3){data-tooltip="请求已经被接受进行处理，但处理尚未完成。"}
- [203: Non-Authoritative Information](https://tools.ietf.org/html/rfc7231#section-6.3.4){data-tooltip="实体头中的信息来自于本地或第三方副本，而不是原始服务器。"}
- [204: No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5){data-tooltip="在响应中只有状态码和头部信息，没有响应体。"}
- [205: Reset Content](https://tools.ietf.org/html/rfc7231#section-6.3.6){data-tooltip="浏览器应该清除用于此事务的表单以进行其他输入。"}
- [206: Partial Content](https://tools.ietf.org/html/rfc7233#section-4.1){data-tooltip="服务器返回请求的部分数据。用于响应指定 Range 头的请求。服务器必须使用 Content-Range 头指定响应中包含的范围。"}

### 4xx. Client Error   {.row-span-3}
* [400: Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1){data-tooltip="服务器无法理解请求。"}
* [401: Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1){data-tooltip="请求的页面需要用户名和密码。"}
* [402: Payment Required](https://tools.ietf.org/html/rfc7231#section-6.5.2){data-tooltip="暂时不能使用该代码。"}
* [403: Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3){data-tooltip="拒绝访问请求的页面。"}
* [404: Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4){data-tooltip="服务器找不到请求的页面。"}
* [405: Method Not Allowed](https://tools.ietf.org/html/rfc7231#section-6.5.5){data-tooltip="请求中指定的方法不被允许。"}
* [406: Not Acceptable](https://tools.ietf.org/html/rfc7231#section-6.5.6){data-tooltip="服务器只能生成客户端不接受的响应。"}
* [407: Proxy Authentication Required](https://tools.ietf.org/html/rfc7235#section-3.2){data-tooltip="必须在代理服务器上进行身份验证，然后才能提供此请求。"}
* [408: Request Timeout](https://tools.ietf.org/html/rfc7231#section-6.5.7){data-tooltip="请求的等待时间超过了服务器准备等待的时间。"}
* [409: Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8){data-tooltip="请求无法完成，因为存在冲突。"}
* [410: Gone](https://tools.ietf.org/html/rfc7231#section-6.5.9){data-tooltip="请求的页面不再可用。"}
* [411: Length Required](https://tools.ietf.org/html/rfc7231#section-6.5.10){data-tooltip="没有定义“Content-Length”，服务器将不接受请求。"}
* [412: Precondition Failed](https://tools.ietf.org/html/rfc7232#section-4.2){data-tooltip="请求中的前置条件被服务器评估为false。"}
* [413: Payload Too Large](https://tools.ietf.org/html/rfc7231#section-6.5.11){data-tooltip="请求实体太大，服务器无法接受请求。"}
* [414: URI Too Long](https://tools.ietf.org/html/rfc7231#section-6.5.12){data-tooltip="请求的URL太长，服务器无法接受请求。当将“post”请求转换为带有长查询信息的“get”请求时发生。"}
* [415: Unsupported Media Type](https://tools.ietf.org/html/rfc7231#section-6.5.13){data-tooltip="服务器无法接受请求，因为不支持媒体类型。"}
* [416: Range Not Satisfiable](https://tools.ietf.org/html/rfc7233#section-4.4){data-tooltip="请求的字节范围不可用且超出界限。"}
* [417: Expectation Failed](https://tools.ietf.org/html/rfc7231#section-6.5.14){data-tooltip="Expect请求头字段中给出的期望无法被服务器满足。"}
* [426: Upgrade Required](https://tools.ietf.org/html/rfc7231#section-6.5.15){data-tooltip="服务器拒绝使用当前协议执行请求，但客户端升级到不同协议后可能会愿意执行该请求。"}
* [451: Unavailable For Legal Reasons](https://datatracker.ietf.org/doc/html/rfc7725#section-3){data-tooltip="此状态代码表示服务器由于法律要求而拒绝访问资源。"}

### 1xx. Information
* [100: Continue](https://tools.ietf.org/html/rfc7231#section-6.2.1){data-tooltip="只有部分请求已被服务器接收，但只要尚未被拒绝，客户端应继续该请求。"}
* [101: Switching Protocols](https://tools.ietf.org/html/rfc7231#section-6.2.2){data-tooltip="服务器正在切换协议。"}
* [102: Processing](https://tools.ietf.org/html/rfc2518#section-10.1){data-tooltip="中间响应，用于通知客户端服务器已接受完整请求，但尚未完成处理。"}

### 3xx. Redirection
* [300: Multiple Choices](https://tools.ietf.org/html/rfc7231#section-6.4.1){data-tooltip="一个链接列表，用户可以选择一个链接并跳转到该位置。最多有五个地址。"}
* [301: Moved Permanently](https://tools.ietf.org/html/rfc7231#section-6.4.2){data-tooltip="请求的页面已经永久移动到新的 URL。"}
* [302: Found](https://tools.ietf.org/html/rfc7231#section-6.4.3){data-tooltip="请求的页面已经暂时移动到新的 URL。"}
* [303: See Other](https://tools.ietf.org/html/rfc7231#section-6.4.4){data-tooltip="请求的页面可以在另一个 URL 下找到。"}
* [304: Not Modified](https://tools.ietf.org/html/rfc7232#section-4.1){data-tooltip="这是对 If-Modified-Since 或 If-None-Match 头部的响应代码，其中 URL 自指定日期以来未被修改。"}
* [305: Use Proxy](https://tools.ietf.org/html/rfc7231#section-6.4.5){data-tooltip="请求的 URL 必须通过 Location 头部中提到的代理访问。"}
* [306: Unused](https://tools.ietf.org/html/rfc7231#section-6.4.6){data-tooltip="此代码在以前的版本中使用过。它不再使用，但代码被保留。"}
* [307: Temporary Redirect](https://tools.ietf.org/html/rfc7231#section-6.4.7){data-tooltip="请求的页面已经暂时移动到新的 URL。"}

### 5xx. Server Error
* [500: Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1){data-tooltip="请求未完成。服务器遇到了意外情况。"}
* [501: Not Implemented](https://tools.ietf.org/html/rfc7231#section-6.6.2){data-tooltip="请求未完成。服务器不支持所需的功能。"}
* [502: Bad Gateway](https://tools.ietf.org/html/rfc7231#section-6.6.3){data-tooltip="请求未完成。服务器从上游服务器收到了无效的响应。"}
* [503: Service Unavailable](https://tools.ietf.org/html/rfc7231#section-6.6.4){data-tooltip="请求未完成。服务器暂时过载或停机。"}
* [504: Gateway Timeout](https://tools.ietf.org/html/rfc7231#section-6.6.5){data-tooltip="网关超时。"}
* [505: HTTP Version Not Supported](https://tools.ietf.org/html/rfc7231#section-6.6.6){data-tooltip="服务器不支持“http协议”的版本。"}



更多资源
----

- [RFC 2616](https://tools.ietf.org/html/rfc2616)
- [RFC 7231](https://tools.ietf.org/html/rfc7231)
- [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html#name-status-codes)
- [HTTP 响应状态码](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status) _(developer.mozilla.org)_
- [httpcode](http://httpcode.info/) _(httpcode.info)_

