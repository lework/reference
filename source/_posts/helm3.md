---
title: Helm3 
background: bg-[#0f1689]
tags:
  - helm
  - helm3
  - kubernets
categories:
  - 云原生
date: 2023-03-01 19:35:39
intro: Helm 是 Deis 开发的一个用于 Kubernetes 应用的包管理工具,主要用来管理 Charts
---


入门  {.cols-2}
--------

### 安装

```bash
# 脚本安装
$ curl -fsSL -o get_helm.sh \
  https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
$ chmod 700 get_helm.sh
$ ./get_helm.sh

# 二进制安装
wget https://get.helm.sh/helm-v3.11.1-linux-amd64.tar.gz
tar xvf helm-v3.11.1-linux-amd64.tar.gz
sudo mv linux-amd64/helm /usr/local/bin
rm -rf linux-amd64 helm-v3.7.0-linux-amd64.tar.gz

# 补全
helm completion bash > /etc/bash_completion.d/helm
```

### 用法

```bash
helm version                            # 查看 helm 版本
helm create xxx                         # 创建一个 xxx charts
helm repo add myharbor xxx              # 增加 repo
helm repo update                        # 更新仓库资源
helm install xxx1 ./xxx                 # 部署安装 xxx，设置名称为xxx1
# 更新已部署版本
helm upgrade test ./portail-web -n test-namespace --values=new-values.yml
helm uninstall xxx1                     # 卸载删除 xxx1
helm list                               # 列出已经部署的charts
helm package ./xxx                      # 打包charts
helm template helm_charts-0.1.1.tgz     # 查看生成的模板
```


命令行  {.cols-2}
--------

### Repos

```bash
helm repo add [name] [url] # 添加一个存储库
helm repo remove [name] # 从系统中删除一个存储库
helm repo update # 更新存储库
helm repo list # 列出存储库
helm repo index # 生成一个包含在当前目录中发现的 chart 的索引文件
helm search [keyword] # 搜索 chart 
helm search repo [keyword] # 搜索仓库
helm search hub [keyword] # 搜索hub
```



### releases {.row-span-3}

```bash
helm upgrade [release] [chart] # 更新 app
helm upgrade [release] [chart] --atomic # 如果升级失败，告诉 Helm 要回滚。
helm upgrade [release] [chart] --install # 升级一个版本。如果系统中不存在该版本，请安装它
helm upgrade [release] [chart] --version [version-number] # 升级到指定版本
helm rollback [release] [revision] # 回滚到指定版本
helm upgrade --wait <name> # 等待 pods 启动


helm ls # 列出当前命名空间中的版本
helm ls -A # 列出所有命名空间中的版本
helm ls -A -o json | jq  -r '.[] | select(.status = "deployed") | .name' # 寻找指定状态的版本
helm list --namespace [namespace] # 列出指定命名空间中的所有可用版本
helm list --date --reverse   # 排序

helm get values <release> # 输出安装时的 values
helm get all [release] # 下载所有的 release 信息
helm get hooks [release] # 下载所有 hooks
helm get manifest [release] # 下载 manifest
helm get notes [release] # 下载 notes
helm get values [release] # 下载 values 文件
helm history [release] # 获取发布历史


helm status [release] # 查看版本的状态
helm env # 查看有关Helm客户端环境的信息
helm template -s templates\deployment.yaml demo-app -n demo	  # 渲染模板
```
在 Kubernetes 集群上运行的 Chart 的一个实例。在同一个集群上，一个 Chart 可以安装很多次。每次安装都会创建一个新的 release。

### Apps
```bash
helm install [name] [chart] --namespace [namespace] # 在指定命名空间中安装应用
helm install [name] [chart] --values [yaml-file/url] # 用你选择的文件中指定的值来覆盖默认值
helm install [name] --dry-run --debug # 运行测试安装以验证和核实 chart 
helm uninstall [release name]  # 卸载应用版本
```


### Chart
```bash
helm create [name] # 创建一个包含以下内容的目录 (Chart.yaml, values.yaml,charts/ and templates/)
helm package [chart-path] # 将 chart 打包到 chart 档案中
helm lint [chart] # 运行测试以检查 chart 并确定可能的问题
helm show all [chart] # 检查一个 chart 并列出其内容
helm show chart [chart] # 显示 chart 的定义
helm show values [chart] # 显示 chart 的值
helm pull [chart] # 下载 chart
helm pull [chart] --untar --untardir [directory] # 下载一个图表，并将存档内容解压到一个目录中
helm dependency list [chart] # 显示一个图表的依赖关系的列表
helm install mychart-0.1.0.tgz --dry-run --debug # 测试安装
```

### Plugin 
```bash
helm plugin list # 列出插件
helm plugin install <plugin URL> # 安装插件
helm plugin update [plugin1] [plugin2] # 更新插件
helm plugin uninstall [plugin1] # 卸载插件
```


Helm Templates  {.cols-2}
------


### Chart 目录结构

```shell
wordpress/
  Chart.yaml                # 包含了chart信息的YAML文件
  LICENSE                   # 可选: 包含chart许可证的纯文本文件
  README.md                 # 可选: 可读的README文件
  values.yaml               # chart 默认的配置值
  values.schema.json        # 可选: 一个使用JSON结构的values.yaml文件
  charts/                   # 包含chart依赖的其他chart
  crds/                     # 自定义资源的定义
  templates/                # 模板目录， 当和values 结合时，可生成有效的Kubernetes manifest文件
  templates/NOTES.txt       # 可选: 包含简要使用说明的纯文本文件
```
Helm Chart 基本元素为 charts/、Chart.yaml、templates/、values.yaml，并保留 crds/ ，要正确的使用 chart 进行发布，该元素是必不可少的。


### 变量  {.row-span-3}
```
name: {{ .Values.storageClassName }}
name: {{ .Values.storageClassName | quote }}
name: {{ .Values.storageClassName | default "default value" }}
name: {{ .Values.storageClassName | required ".storageClassName must be set" }}
name: {{ .Values.storageClassName | trim }}

name: {{ printf "%s-%d" .Values.storageClassName .Values.storageClassVersion }}
name: {{ .Values.storageClassName | replace "{placeholder}" "example" }}

{{ $fullName := printf "%s %s" .Values.firstName .Values.lastName }}

name: {{ .Values.storageClassName | trimAll "/" }}
name: {{ .Values.storageClassName | trimPrefix "/" }}
name: {{ .Values.storageClassName | trimSuffix "/" }}

name: {{ .Values.storageClassName | lower }}
name: {{ .Values.storageClassName | upper }}
```
[全部变量](https://helm.sh/docs/chart_template_guide/function_list/) [内置变量](https://helm.sh/docs/chart_template_guide/builtin_objects/)

#### 内置变量

```
{{ .Release.Name }}
{{ .Release.Namespace }}

{{ .Chart.Name }}
{{ .Chart.Version }}

{{ .Files.Get config.ini }}
```


### 换行处理
```
{{ $value1  }}               # 有换行符
{{- $value1 }}               # 无换行符
```

### 缩进

```
env:
  {{ .Values.environmentVariables | toYaml | indent 2 }}

env: {{ .Values.environmentVariables | toYaml | nindent 2 }}

{{- toYaml .Values.myhash }}
{{- toYaml (.Files.get "myconfig.yaml") | nindent 2 }}
```


### 条件语句 {.row-span-2}

```
{{ if .Values.enablePersistence }}
  # ...
{{ else if .Values.enableFilesystem }}
  # ...
{{ else }}
  # ...
{{ end }}
​
# equal, not equal
{{ if eq .Values.environment "production" }}
{{ if ne .Values.environment "production" }}
​
# and, or
{{ if and (eq .Values.environment "production") (eq .Values.host "minikube") }}
{{ if or (eq .Values.environment "production") (eq .Values.host "minikube") }}
​
# not (negation)
{{ if not (eq .Values.environment "production") }}
​
# greater than, less than
{{ if gt (len .Values.items) 3 }}
{{ if gte (len .Values.items) 3 }}
{{ if lt (len .Values.items) 3 }}
{{ if lte (len .Values.items) 3 }}
​
# strings
{{ if .Values.name | contains "example" }}
{{ if .Values.name | hasPrefix "foobar-" }}
{{ if .Values.name | hasSuffix "-foobar" }}
{{ if .Values.name | regexMatch "^[a-z]+$" }}
​
# lists
{{ if .Values.items | has "example" }}
​
# ternary
{{ ternary "returned if true" "returned if false" .Values.someBoolean }}
```

### 循环
```
# simple
volumes:
  {{ range .Values.volumeIds }}
  - volumeName: {{ . }}
  {{ end }}

# with named variable
volumes:
  {{ range $volumeId := .Values.volumeIds }}
  - volumeName: {{ $volumeId }}
  {{ end }}

# with index (array) or key (dict)
volumes:
  {{ range $key, $value := .Values.configuration }}
  - {{ $key }}: {{ $value }}
  {{ end }}
```


### 包含
```
# define templates in _helpers.tpl
{{- define "your-project.image" -}}
{{ printf "%s:%s" .Values.image.name .Values.image.tag | quote }}
{{- end -}}

# use in other files
image: {{ include "your-project.image" . }}

# more specific parameters as the scope
{{- define "your-project.someInclude" -}}
{{ . | replace "{placeholder}" "example" }}
{{- end -}}

# usage
foobar: {{ include "your-project.someInclude" .Values.foobar }}
```

### Lookup
```
{{ $previous := lookup "v1" "Secret" .Release.Namespace "some-secret" }}
data:
  {{- if $previous }}
  foobarPassword: {{ $previous.data.foobarPassword | quote }}
  {{- else if .Values.foobarPassword }}
  foobarPassword: {{ .Values.foobarPassword | b64enc | quote }}
  {{- else }}
  foobarPassword: {{ randAlphaNum 40 | b64enc | quote }}
  {{- end }}
```

### Fail
```
{{ if eq .Values.storageClassName "foobar1" }}
  # ...
{{ else if eq .Values.storageClassName "foobar2" }}
  # ...
{{ else }}
  {{ fail ".storageClassName is not recognized" }}
{{ end }}
```

### Dates
```
# ISO 8601, format string is provided as a lookalike-string
{{ now | date "2006-01-02T15:04:05" }}
```

### 其他  {.row-span-3}
```
{{ .Values.param | squote }}      # You usually want to single quote strings ('')

{{ .Values.param | indent 16 }}   # Print with additional 16 leading spaces
{{ .Values.param | nindent 16 }}  # Ensure total indentation is 16 (useful when template code is indented)

{{ randAlphaNum 5 }}              # Produce random string 5 chars long

{{ "Hello" | repeat 3 }}          # "HelloHelloHello"

{{ .Values.param2 | default "abc" }}   # Insert value or default value

{{- pluck .Values.env .Values.ip | first }} # .env is a single key, .ip is a map

{{ print $.Template.BasePath "/configmap.yaml" }}
```

### UUIDs
```
id: {{ uuidv4 }}
```

### Base64
```
{{ .Values.someData | b64enc }}
{{ .Values.someData | b64dec }}
```

### Crypto
```
{{ .Values.someData | sha256sum }}
​
{{ .Values.someData | encryptAES "secret key" }}
{{ .Values.someData | decryptAES "secret key" }}
```

## 更多资源 {.cols-1}

- [helm](https://helm.sh/) _(helm.sh)_
- [kubeapps](https://kubeapps.com/) _(kubeapps.com)_
- [artifacthub](https://artifacthub.io/) _(artifacthub.io)_
- [声明式Helm Chart管理工具](https://helmfile.readthedocs.io/en/latest/) _(helmfile.readthedocs.io)_
- [helmsman](https://github.com/Praqma/helmsman) _(github.com)_
- [helm-playground](https://helm-playground.com/) _(helm-playground.com)_





