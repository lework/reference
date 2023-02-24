---
title: Bash
date: 2022-12-04 12:45:04
background: bg-[#3e4548]
tags:
    - shell
    - sh
    - echo
    - script
    - linux
categories:
    - 编程
intro: 这是一份快速参考速查表，用于入门linux bash shell脚本。.
---

开始
---------------

### hello.sh

```bash
#!/bin/bash

VAR="world"
echo "Hello $VAR!" # => Hello world!
```
执行脚本
```shell script
$ bash hello.sh # 以 bash 方式执行脚本 
$ sh hello.sh   # 以 sh 方式执行脚本
$ sh hell0.sh & # 以 后台 方式执行脚本
```


### 变量

```bash
varname="John"           # 定义变量，索引号
varname='John'           # 定义变量，单引号
varname=`echo John`      # command赋值变量 用` `
varname=$(echo John)     # command赋值变量 用$()
varname = "John"         # => Error (=左右不能有空格)
var=                     # 空参数
unset var                # 取消变量
let foo=1+2              # 声明变量时，可以直接执行算术表达式。
readonly variable        # 只读变量
local variable           # 定义内部变量，仅在函数内使用
export VARNAME=value     # 定义环境变量

echo ${varname}    # => John (输出变量内容)
echo $varname      # => John (输出变量内容)
echo "$varname"    # => John (输出变量内容)
echo '$varname'    # => $varname (输出字符串)
echo "${varname}!" # => John! (输出变量内容)
```



### 注释

```bash
# 这是一个内联的Bash注释. 单行注释
```

```bash
: '
This is a
multi line
comment
'
```
多行注释使用 `:'` 开始 和 `'` 结尾




### 参数  {.row-span-2}

| 表达式  | 描述                                       |
|-------------|---------------------------------------|
| `$1` … `$9` | 参数 1 ... 9                           |
| `$0`        | 脚本本身的名称             |
| `$1`        | 第一个参数                        |
| `${10}`     | 位置参数 10               |
| `$#`        | 参数数量                   |
| `$$`        | shell 的进程 id               |
| `$@`        | 传递给脚本/函数的所有参数(识别每个参数)    |
| `$*`        | 传递给脚本/函数的所有参数(把所有参数当成一个字符串)                         |
| `$!`        | 上一个被执行的命令的PID(后台运行的进程)    |
| `$?`        | 上一个命令的退出状态(管道命令使用${PIPESTATUS})                         |
| `$-`        | 为当前 Shell 的启动参数                      |
| `$_`        | 上一个命令的最后一个参数 |

更多: [特殊参数](http://wiki.bash-hackers.org/syntax/shellvars#special_parameters_and_shell_variables)


### 函数

```bash
get_name() {
    echo "John"
}

echo "You are $(get_name)"
```

更多: [函数](#bash-functions)

### 条件语句 {#conditionals-example}

```bash
if [[ -z "$string" ]]; then
    echo "String is empty"
elif [[ -n "$string" ]]; then
    echo "String is not empty"
fi
```

更多: [Conditionals](#bash-conditionals)

### 大括号扩展

```bash
echo {A,B}.js
```
---

| 表达式 | 描述         |
|------------|---------------------|
| `{A,B}`    |  与 `A B` 相同       |
| `{A,B}.js` | 与 `A.js B.js` 相同 |
| `{1..5}`   | 与 `1 2 3 4 5` 相同 |

更多: [Brace expansion](http://wiki.bash-hackers.org/syntax/expansion/brace)

### Shell 执行

```bash
# => I'm in /path/of/current
echo "I'm in $(PWD)"

# Same as:
echo "I'm in `pwd`"
```

更多: [Command substitution](http://wiki.bash-hackers.org/syntax/expansion/cmdsubst)



Bash 参数扩展
--------------------



### 语法 {.col-span-2 .row-span-3}

| 代码              | 描述         |
|-------------------|---------------------|
| `${FOO%word}`   | 从尾开始扫描word，将匹配word正则表达式的字符过滤掉,%为最短匹配       |
| `${FOO%%word}`  | 从尾开始扫描word，将匹配word正则表达式的字符过滤掉,%%为最长匹配  |
| `${FOO#word}`   | 从头开始扫描word，将匹配word正则表达的字符过滤掉,#为最短匹配       |
| `${FOO##word}`  | 从头开始扫描word，将匹配word正则表达的字符过滤掉,##为最长匹配  |
| `${FOO/pattern/string}`  | 替换第一个匹配项 |
| `${FOO//pattern/string}` | 替换全部匹配项         |
| `${FOO/%pattern/string}` | 替换后缀      |
| `${FOO/#pattern/string}` | 替换前缀      |
| `${!prefix*}` | 将带有前缀为prefix的参数名打印出来      |
| `${!prefix@}` | 将带有前缀为prefix的参数名打印出来      |
| `${!name[@]}` | 打印出来name数组有哪些下标      |
| `${!name[*]}` | 打印出来name数组有哪些下标      |
| `${var#*/}` | 表示从左边开始删除第一个 / 号及左边的所有字符 |
| `${var##*/}` |表示从左边开始删除最后（最右边）一个 / 号及左边的所有字符 |
| `${var%/*}` | 表示从右边开始，删除第一个 / 号及右边的字符 |
| `${var%%/*}` | 表示从右边开始，删除最后（最左边）一个 / 号及右边的字符 |

#### 子字符串
| 表达式      | 描述                    |
|-----------------|--------------------------------|
| `${FOO:3}`      | 截取FOO的值的子字符串, 从3到结束|
| `${FOO:0:3}`    | 子串 _(位置，长度)_ |
| `${FOO:(-3):3}` | 从右边开始的子串,  bash 4.2之后才支持负数索引       |

#### 长度
| 表达式      | 描述                    |
|------------|------------------|
| `${#FOO}`  |  `$FOO` 的长度 |
#### 默认值
| 表达式      | 描述                    |
|-------------------|------------------------------------------|
| `${FOO:-val}`     |  `$FOO`，如果未设置，则为 `val`                |
| `${FOO:=val}`     | 如果未设置，则将 `$FOO` 设置为 `val`           |
| `${FOO:+val}`     | 如果`$FOO`被设置，则`val`的值被赋值给`$FOO`。                  |
| `${FOO:?message}` |  如果 `$FOO` 未设置，则显示message并退出 |



### 替换

```bash
echo ${food:-Cake}  #=> $food or "Cake"

STR="/path/to/foo.cpp"
echo ${STR%.cpp}    # /path/to/foo
echo ${STR%.cpp}.o  # /path/to/foo.o
echo ${STR%/*}      # /path/to

echo ${STR##*.}     # cpp (获取文件后缀)
echo ${STR##*/}     # foo.cpp (文件名)

echo ${STR#*/}      # path/to/foo.cpp
echo ${STR##*/}     # foo.cpp

echo ${STR/foo/bar} # /path/to/bar.cpp
```


### 切片

```bash
name="John"
echo ${name}           # => John
echo ${name:0:2}       # => Jo
echo ${name::2}        # => Jo
echo ${name::-1}       # => Joh
echo ${name:(-1)}      # => n
echo ${name:(-2)}      # => hn
echo ${name:(-2):2}    # => hn

length=2
echo ${name:0:length}  # => Jo
```
更多: [Parameter expansion](http://wiki.bash-hackers.org/syntax/pe)

### 转换 

```bash
STR="HELLO WORLD!"
echo ${STR,}   # => hELLO WORLD! 首字母小写
echo ${STR,,}  # => hello world! 全部小写

STR="hello world!"
echo ${STR^}   # => Hello world! 首字母大写
echo ${STR^^}  # => HELLO WORLD! 全部大写

ARR=(hello World)
echo "${ARR[@],}" # => hello world 数组中的所有元素首字母小写
echo "${ARR[@]^}" # => Hello World 数组中的所有元素首字母大写
```

### ~扩展

```bash
~          # $HOME的值
~/foo      # $HOME/foo
~fred/foo  # 用户fred的主目录的foo子目录
~+/foo     # $PWD/foo
~-/foo     # ${OLDPWD-'~-'}/foo
~N         # 将显示一个'dirs +N'命令的结果字符串
~+N        # 将显示一个'dirs +N'命令的结果字符串
~-N        # 将显示一个'dirs -N'命令的结果字符串
```




Bash 数组 
------

### 数组定义

```bash
arr_number=(1 2 3 4 5)             # 数值类型的数组
Fruits=('Apple' 'Banana' 'Orange') # 字符串类型数组

Fruits[0]="Apple"                  # 赋值
Fruits[1]="Banana"
Fruits[2]="Orange"

ARRAY1=(foo{1..2}) # => foo1 foo2
ARRAY2=({A..D})    # => A B C D

# 合并  => foo1 foo2 A B C D
ARRAY3=(${ARRAY1[@]} ${ARRAY2[@]})

# 声明构造
declare -a Numbers=(1 2 3)
Numbers+=(4 5) # 追加 => 1 2 3 4 5
```



### 索引

| -                  | -             |
|--------------------|---------------|
| `${Fruits[0]}`     | 第一个元素 |
| `${Fruits[-1]}`    | 最后一个元素  |
| `${Fruits[*]}`     | 所有元素  |
| `${Fruits[@]}`     | 所有元素  |
| `${#Fruits[@]}`    | 总数 |
| `${#Fruits}`       | 第一节长度 |
| `${#Fruits[3]}`    | 第n节长度 |
| `${Fruits[@]:3:2}` | 范围         |
| `${!Fruits[@]}`    | 所有的key   |



### 迭代

```bash
Fruits=('Apple' 'Banana' 'Orange')

for e in "${Fruits[@]}"; do
    echo $e
done

let i=0
let j=${#Fruits[@]}-1
for (( i=0;i<j;i++,j-- ))
  do
    echo ${arr[i]}
done
```
#### 包含索引
```bash
for i in "${!Fruits[@]}"; do
  printf "%s\t%s\n" "$i" "${Fruits[$i]}"
done

```


### 操作 {.col-span-2}

```bash
Fruits=("${Fruits[@]}" "Watermelon")     # 添加
Fruits+=('Watermelon')                   # 添加
Fruits=( ${Fruits[@]/Ap*/} )             # 通过正则表达式匹配删除
unset Fruits[2]                          # 删除指定的一项
Fruits=(${Fruits[@]/a*/})                # 删除正则表达式匹配到的元素
Fruits=("${Fruits[@]}")                  # 赋值
Fruits=("${Fruits[@]}" "${Veggies[@]}")  # 连接
lines=(`cat "logfile"`)                  # 从文件中读取
```

### 数组为参数
```bash
function extract()
{
    local -n myarray=$1
    local idx=$2
    echo "${myarray[$idx]}"
}
Fruits=('Apple' 'Banana' 'Orange')
extract Fruits 2     # => Orangle
```





Bash 字典
------------

### 字典定义

```bash
declare -A sounds # 定义字典
array=([2]=valC [0]=valA [1]=valB)  # 定义字典
```

```bash
sounds[dog]="bark"    # 赋值
sounds[cow]="moo"
sounds[bird]="tweet"
sounds[wolf]="howl"
```


### 字典使用

```bash
echo ${sounds[dog]} # 输出指定dog元素的值
echo ${sounds[@]}   # 输出所有的value
echo ${!sounds[@]}  # 输出所有的key
echo ${#sounds[@]}  # 输出字典的数量
unset sounds[dog]   # 删除 dog
```

### 迭代

```bash
for val in "${sounds[@]}"; do
    echo $val
done
```
---
```bash
for key in "${!sounds[@]}"; do
    echo $key
done
```





Bash 条件表达式
------------



### 语法

```bash
# 写法一
test expression

# 写法二
[ expression ]

# 写法三
[[ expression ]]

# [ ] 单双括号
　# - [ ] 两个符号左右都要有空格分隔
　# - 内部操作符与操作变量之间要有空格：如  [  ]
　# - 字符串比较中，> < 需要写成\> \< 进行转义
　# - [ ] 中字符串或者${}变量尽量使用"" 双引号扩住，避免值未定义引用而出错的好办法
　# - [ ] 中可以使用 –a –o 进行逻辑运算

# [[ ]] 双方括号
　# [[ ]] 两个符号左右都要有空格分隔
　# 内部操作符与操作变量之间要有空格：如  [[ "a" = "b" ]]
　# 字符串比较中，可以直接使用 > < 无需转义
　# [[ ]] 中字符串或者${}变量尽量如未使用"" 双引号扩住的话，会进行模式和元字符匹配
　  # [[ "ab"=a* ]] && echo "ok"
　# [[] ] 内部可以使用 &&  || 进行逻辑运算
```

### 整数表达式

| 表达式           | 描述                                 |
|---------------------|---------------------------------------------|
| `[[ NUM -eq NUM ]]` | 等于 <yel>Eq</yel>ual                            |
| `[[ NUM -ne NUM ]]` | 不等于 <yel>N</yel>ot <yel>e</yel>qual             |
| `[[ NUM -lt NUM ]]` | 小于 <yel>L</yel>ess <yel>t</yel>han             |
| `[[ NUM -le NUM ]]` | 小于等于 <yel>L</yel>ess than or <yel>e</yel>qual    |
| `[[ NUM -gt NUM ]]` | 大于 <yel>G</yel>reater <yel>t</yel>han          |
| `[[ NUM -ge NUM ]]` | 大于等于 <yel>G</yel>reater than or <yel>e</yel>qual |
| `(( NUM < NUM ))`   | 小于                                   |
| `(( NUM <= NUM ))`  | 小于或等于                          |
| `(( NUM > NUM ))`   | 大于                                |
| `(( NUM >= NUM ))`  | 大于或等于                        |


### 字符串表达式

| 表达式          | 描述                 |
|--------------------|-----------------------------|
| `[[ -z STR ]]`     | 空字符串                |
| `[[ -n STR ]]`     | <yel>N</yel>非空字符串 |
| `[[ STR ]]` | 如果string不为空（长度大于0），则判断为真。                       |
| `[[ STR1 == STR2 ]]` | STR1 等于 STR2                       |
| `[[ STR = STR ]]`  | 如果string1和string2相同，则判断为真          |
| `[[ STR < STR ]]`  | 小于 _(ASCII码对比)_         |
| `[[ STR > STR ]]`  | 大于 _(ASCII码对比)_      |
| `[[ STR != STR ]]` | 不相等                   |
| `[[ STR =~ STR ]]` | 正则匹配                      |


### 文件表达式 {.row-span-2}

| 表达式         | 描述                            |
|-------------------|----------------------------------------|
| `[[ -a file ]]`   |  file存在，则为true |
| `[[ -b file ]]`   |  如果 file 存在并且是一个块（设备）文件，则为true|
| `[[ -c file ]]`   |  如果 file 存在并且是一个字符（设备）文件，则为true。|
| `[[ -d file ]]`   |  file存在并且是目录，则为true|
| `[[ -e file ]]`   |  file存在，则为true|
| `[[ -f file ]]`   |  file存在并且是常规文件（不是目录或其他特殊类型的文件），则为true|
| `[[ -g file ]]`   |  如果 file 存在并且设置了组 ID，则为true。|
| `[[ -G file ]]`   |  如果 file 存在并且属于有效的组 ID，则为true。|
| `[[ -h file ]]`   |  如果 file 存在并且是符号链接，则为true。|
| `[[ -k file ]]`   |  如果 file 存在并且设置了它的“sticky bit”，则为true。|
| `[[ -L file ]]`   |  如果 file 存在并且是一个符号链接，则为true。|
| `[[ -N file ]]`   |  如果 file 存在并且自上次读取后已被修改，则为true。|
| `[[ -O file ]]`   |  如果 file 存在并且属于有效的用户 ID，则为true。|
| `[[ -p file ]]`   |  如果 file 存在并且是一个命名管道，则为true。|
| `[[ -r file ]]`   |  file具有read权限，则为true|
| `[[ -s file ]]`   |  file存在且不为空，则为true|
| `[[ -S file ]]`   |  如果 file 存在且是一个网络 socket，则为true。|
| `[[ -t fd   ]]`   |  如果 fd 是一个文件描述符，并且重定向到终端，则为true。 这可以用来判断是否重定向了标准输入／输出错误。|
| `[[ -u file ]]`   |  如果 file 存在并且设置了 setuid 位，则为true。|
| `[[ -w file ]]`   |  file具有write权限，则为true|
| `[[ -x file ]]`   |  file具有执行权限，如果是目录，则具有目录搜索权限，则为true|
| `[[ f1 -nt f2 ]]` |  f2 f1 比 f2 新|
| `[[ f1 -ot f2 ]]` |  f1 f2 比 f1 新|
| `[[ f1 -ef f2 ]]` | 相同的文件   |


### 逻辑表达式
```bash
if [ "$1" = 'y' -a $2 -gt 0 ]; then
    echo "yes"
fi

if [ "$1" = 'n' -o $2 -lt 0 ]; then
    echo "no"
fi

# 以下表示的含义一致
[  exp1  -a exp2  ]
[[  exp1 && exp2 ]]
[  exp1  ] && [  exp2  ]
[[ exp1  ]] && [[  exp2 ]]

# 以下表示的含义一致
[  exp1  -o exp2  ]
[[  exp1 || exp2 ]]
[  exp1  ] || [  exp2  ]
[[ exp1  ]] || [[  exp2 ]]

# 三元表达式
[ -f /opt/file ] && echo 'file' || echo 'not file'     # 判断
[ -f /opt/file ] && (echo 'file'; echo 'shell') || echo 'not file'     # 子shell
```

### 示例 {.row-span-2}

#### 字符串判断
```bash
if [[ -z "$string" ]]; then
    echo "String is empty"
elif [[ -n "$string" ]]; then
    echo "String is not empty"
else
    echo "This never happens"
fi
```

#### 组合
```bash
if [[ X && Y ]]; then
    ...
fi
```

#### 相等
```bash
if [[ "$A" == "$B" ]]; then
    ...
fi
```

#### 正则表达式
```bash
if [[ '1. abc' =~ ([a-z]+) ]]; then
    echo ${BASH_REMATCH[1]}
fi
```

#### 小于
```bash
if (( $a < $b )); then
   echo "$a is smaller than $b"
fi
```

#### 是否存在
```bash
if [[ -e "file.txt" ]]; then
    echo "file exists"
fi
```
#### if 其他
```bash
if true; then echo 'hello world'; fi

if true
then
  echo 'hello world'
fi

if test $USER = "foo"; then
  echo "Hello foo."
fi

# 检查命令输出结果
if ping -c 1 google.com; then
    echo "It appears you have a working internet connection"
fi

# Grep 检查
if grep -q 'foo' ~/.bash_history; then
    echo "You appear to have typed 'foo' in the past"
fi
```

#### case 语句
```bash
OS=$(uname -s)

case "$OS" in
  FreeBSD) echo "This is FreeBSD" ;;
  Darwin) echo "This is Mac OSX" ;;
  AIX) echo "This is AIX" ;;
  Minix) echo "This is Minix" ;;
  Linux) echo "This is Linux" ;;
  *) echo "Failed to identify this OS" ;;
esac
```

### 其他表达式

| 表达式            | 描述          |
|----------------------|----------------------|
| `[[ -o noclobber ]]` | 选项是否开启 |
| `[[ ! EXPR ]]`       | Not                  |
| `[[ X && Y ]]`       | And                  |
| `[[ X || Y ]]`       | Or                   |



Bash 循环
-----

### 基本 for 循环

```bash
for i in /etc/rc.*; do
    echo $i
done
```

### 类似 C 语言的 for 循环

```bash
for ((i = 0 ; i < 100 ; i++)); do
    echo $i
done
```

### 范围 {.row-span-2}

```bash
for i in {1..5}; do
    echo "Welcome $i"
done
```


#### 范围中的步长

```bash
for i in {5..50..5}; do
    echo "Welcome $i"
done
```



### 自动递增

```bash
i=1
while [[ $i -lt 4 ]]; do
    echo "Number: $i"
    ((i++))
done
```

### 自动递减

```bash
i=3
while [[ $i -gt 0 ]]; do
    echo "Number: $i"
    ((i--))
done
```


### Continue

```bash {data=3,5}
for number in $(seq 1 3); do
    if [[ $number == 2 ]]; then
        continue; # 跳出本次循环
    fi
    echo "$number"
done
```


### Break

```bash
for number in $(seq 1 3); do
    if [[ $number == 2 ]]; then
        break; # 跳出循环
    fi
    echo "$number"
done
```
### select 
```bash
select name [in list];
do
  statements that can use $name
done

select brand in Samsung Sony iphone symphony Walton
do
  echo "You have chosen $brand"
done
```

### While
```bash
while [[ "$1" =~ ^- && ! "$1" == "--" ]]; do
case $1 in
  -V | --version )
    echo $version
    exit
    ;;
  -s | --string )
    shift; string=$1
    ;;
  -f | --flag )
    flag=1
    ;;
esac;
shift; # shift n 表示把第n+1个参数移到第1个参数, 即命令结束后$1的值等于$n+1的值
done
```

### Until
```bash
count=0
until [ $count -gt 10 ]; do
    echo "$count"
    ((count++))
done

until false; do echo 'Hi, until looping ...'; done
```


### 死循环 

```bash
while true; do
    # here is some code.
done
```

#### 死循环 (简写)
```bash
while :; do
    # here is some code.
done
```


### 读取文件的每一行

```bash
cat file.txt | while read line; do
    echo $line
done

< file.txt | while read line; do
  echo $line
done
```



Bash 函数
---------

### 函数定义

```bash
myfunc() {
    echo "hello $1"
}
```

```bash
function myfunc() {
    echo "hello $1"
}
```

```bash
myfunc "John"

unset -f myfunc         # 删除定义的函数
declare -f myfunc       # 显示myfunc函数的定义内容
```

### 返回值

```bash
myfunc() {
    local myresult='some value'
    echo $myresult
}
```

```bash
result="$(myfunc)"
```

### 抛出错误

```bash
myfunc() {
    return 1 # 返回非0数字
}
```

```bash
if myfunc; then
    echo "success"
else
    echo "failure"
fi
```



Bash 选项  {.cols-2}
-------

### 选项

```bash
# - 表示打开， + 表示关闭
set -u            # 如果遇到不存在的变量，Bash 默认忽略它
set -x            # 用来在运行结果之前，先输出执行的那一行命令。
set -e            # 只要发生错误，就终止执行。
set -n            # 等同于set -o noexec，不运行命令，只检查语法是否正确。
set -f            # 等同于set -o noglob，表示不对通配符进行文件名扩展。
set -v            # 等同于set -o verbose，表示打印 Shell 接收到的每一行输入。

set -o noclobber  # 避免叠加文件 (echo "hi" > foo)
set -o errexit    # 用于在出错时退出，避免级联错误
set -o pipefail   # 用于在出错时退出，避免管道之间的连续错误
set -o nounset    # 暴露未设置的变量
```

### 全局选项

```bash
shopt               # 查看所有参数
shopt globstar      # 查看globstar参数
shopt -s execfail   # 打开参数
shopt -u execfail   # 关闭参数
shopt -q execfail   # 查询参数是否打开，返回0表示打开

shopt -s nullglob   # 不匹配的 glob 被删除 ('*.foo' => '')
shopt -s failglob   # 不匹配的 glob 抛出错误
shopt -s nocaseglob # 不区分大小写
shopt -s dotglob    # 通配符匹配.文件 ("*.sh" => ".foo.sh")
shopt -s globstar   # 允许 ** 进行递归匹配 ('lib/**/*.rb' => 'lib/a/b/c.rb')
```


Bash 历史 {.cols-2}
-------

### 命令

| 命令               | 描述                               |
|-----------------------|-------------------------------------------|
| `history`             | 显示历史                              |
| `sudo !!`             | 使用 sudo 运行上一个命令        |
| `shopt -s histverify` | 不要立即执行扩展结果 |

### 表达式

| 表达式   | 描述                                          |
|--------------|------------------------------------------------------|
| `!$`         | 展开最新命令的最后一个参数         |
| `!*`         | 展开最新命令的所有参数         |
| `!-n`        | 展开第 `n` 个最近的命令                     |
| `!n`         | 展开历史中的第 `n` 个命令                      |
| `!<command>` | 展开最近调用的命令 `<command>` |

### 操作

| 代码                 | 描述                                                           |
|----------------------|-----------------------------------------------------------------------|
| `!!`                 | 再次执行最后一条命令                                           |
| `!!:s/<FROM>/<TO>/`  | 在最近的命令中将第一次出现的 `<FROM>` 替换为 `<TO>` |
| `!!:gs/<FROM>/<TO>/` | 在最近的命令中将所有出现的 `<FROM>` 替换为 `<TO>`  |
| `!$:t`               | 仅从最近命令的最后一个参数扩展基本名称       |
| `!$:h`               | 仅从最近命令的最后一个参数展开目录      |

`!!` 和 `!$` 可以替换为任何有效的扩展。

### 切片

| 代码     | 描述                                                                              |
|----------|------------------------------------------------------------------------------------------|
| `!!:n`   | 仅扩展最近命令中的第 `n` 个标记(命令为 `0`；第一个参数为 `1`) |
| `!^`     | 从最近的命令展开第一个参数                                          |
| `!$`     | 从最近的命令中展开最后一个标记                                               |
| `!!:n-m` | 从最近的命令扩展令牌范围                                          |
| `!!:n-$` | 从最近的命令中将第 `n` 个标记展开到最后                                      |

`!!` 可以替换为任何有效的扩展，即 `!cat`、`!-2`、`!42` 等。

信号
-------------
### 常见信号 {.col-span-2}

```bash
trap -l
 1) SIGHUP       2) SIGINT       3) SIGQUIT      4) SIGILL
 5) SIGTRAP      6) SIGABRT      7) SIGBUS       8) SIGFPE
 9) SIGKILL     10) SIGUSR1     11) SIGSEGV     12) SIGUSR2
13) SIGPIPE     14) SIGALRM     15) SIGTERM     17) SIGCHLD
18) SIGCONT     19) SIGSTOP     20) SIGTSTP     21) SIGTTIN
22) SIGTTOU     23) SIGURG      24) SIGXCPU     25) SIGXFSZ
26) SIGVTALRM   27) SIGPROF     28) SIGWINCH    29) SIGIO
30) SIGPWR      31) SIGSYS      35) SIGRTMIN    36) SIGRTMIN+1
37) SIGRTMIN+2  38) SIGRTMIN+3  39) SIGRTMIN+4  40) SIGRTMIN+5
41) SIGRTMIN+6  42) SIGRTMIN+7  43) SIGRTMIN+8  44) SIGRTMIN+9
45) SIGRTMIN+10 46) SIGRTMIN+11 47) SIGRTMIN+12 48) SIGRTMIN+13
49) SIGRTMIN+14 50) SIGRTMAX-14 51) SIGRTMAX-13 52) SIGRTMAX-12
53) SIGRTMAX-11 54) SIGRTMAX-10 55) SIGRTMAX-9  56) SIGRTMAX-8
57) SIGRTMAX-7  58) SIGRTMAX-6  59) SIGRTMAX-5  60) SIGRTMAX-4
61) SIGRTMAX-3  62) SIGRTMAX-2  63) SIGRTMAX-1  64) SIGRTMAX
```

| 信号编号     | 信号名称                                           通知内容|
|----------|----------------------------------------------------- |----|
| 1   | HUP|通知重启过程。|
| 2     | INT                                          |	通知中断过程。（Ctrl + c）|
| 3      | QUIT                                               |通知终止过程。（创建核心）|
| 9 | KILL                                          |通知强制终止的过程|
| 15  | TERM                                      |通知终止过程。（默认）|


### 信号处理

```bash
trap 'command' 1 2 3 15
trap 'command' EXIT

trap 'echo "trapped."; exit 1' 1 2 3 15
trap '' 1 2 3 15   # 忽略信号处理

function egress {
  command1
  command2
  command3
}

trap egress EXIT   # 使用函数

# 处理脚本错误
trap 'echo Error at about $LINENO' ERR


traperr() {
    echo "ERROR: ${BASH_SOURCE[1]} at about ${BASH_LINENO[0]}"
}

set -o errtrace
trap traperr ERR
```


颜色
-------------

### 常见颜色

```bash
NOCOLOR='\033[0m'
RED='\033[0;31m'
GREEN='\033[0;32m'
ORANGE='\033[0;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
LIGHTGRAY='\033[0;37m'
DARKGRAY='\033[1;30m'
LIGHTRED='\033[1;31m'
LIGHTGREEN='\033[1;32m'
YELLOW='\033[1;33m'
LIGHTBLUE='\033[1;34m'
LIGHTPURPLE='\033[1;35m'
LIGHTCYAN='\033[1;36m'
WHITE='\033[1;37m'

echo -e "The first five colors of the rainbow are ${RED}red ${ORANGE}orange ${YELLOW}yellow ${GREEN}green ${NOCOLOR}and ${BLUE}blue${NOCOLOR}"
```


### 16色  {.col-span-2}
 
```bash
# Foreground (text)
echo -e "Default \e[31mRed"

# Background
echo -e "Default \e[41mRed"

for clbg in {40..47} {100..107} 49 ; do
    #Foreground
    for clfg in {30..37} {90..97} 39 ; do
        #Formatting
        for attr in 0 1 2 4 5 7 ; do
            #Print the result
            echo -en "\e[${attr};${clbg};${clfg}m ^[${attr};${clbg};${clfg}m \e[0m"
        done
        echo #Newline
    done
done
```

### tput 颜色

```bash
export TERM=xterm
#　tput Color Capabilities:
tput setab [1-7] – Set a background color using ANSI escape
tput setb [1-7] – Set a background color
tput setaf [1-7] – Set a foreground color using ANSI escape
tput setf [1-7] – Set a foreground color

#　tput Text Mode Capabilities:
tput bold – Set bold mode
tput dim – turn on half-bright mode
tput smul – begin underline mode
tput rmul – exit underline mode
tput rev – Turn on reverse mode
tput smso – Enter standout mode (bold on rxvt)
tput rmso – Exit standout mode
tput sgr0 – Turn off all attributes

#　Color Code for tput:
0 – Black   1 – Red      2 – Green   3 – Yellow
4 – Blue    5 – Magenta  6 – Cyan    7 – White
```

### 256色 {.col-span-2}
```bash
# Foreground (text)
echo -e "\e[38;5;82mHello \e[38;5;198mWorld"

# Background
echo -e "\e[40;38;5;82mHello \e[30;48;5;82m World \e[0m"

for clbg in {40..47} {100..107} 49 ; do
    #Foreground
    for clfg in {30..37} {90..97} 39 ; do
        #Formatting
        for attr in 0 1 2 4 5 7 ; do
            #Print the result
            echo -en "\e[${attr};${clbg};${clfg}m ^[${attr};${clbg};${clfg}m \e[0m"
        done
        echo #Newline
    done
done
```

其他 
-------------

### 重定向 {.row-span-2 .col-span-2}

```bash
cmd1|cmd2   # pipe;将cmd1的标准输出作为cmd2的标准输入
<file       # 从文件中获取标准输入
>file       # 将标准输出定向到文件
>>file      # 将标准输出定向到文件;如果文件已经存在，则附加到文件
>|file      # 强制标准输出到文件，即使设置了noclobber也是如此
n>|file     # 强制从文件描述符n输出到文件，即使设置了noclobber也是如此
<>file      # 使用file作为标准输入和标准输出
n<>file     # 使用file作为文件描述符n的输入和输出
n>file      # 将文件描述符n指向文件
n<file      # 从文件中获取文件描述符n
n>>file     # 将文件描述n指向文件;如果文件已经存在,则附加到文件
n>&         # 将标准输出复制到文件描述符n
n<&         # 复制文件描述符n的标准输入
n>&m        # 文件描述符n是输出文件描述符的副本
n<&m        # 文件描述符n是输入文件描述符的副本
&>file      # 将标准输出和标准错误指向文件
<&-         # 关闭标准输入
>&-         # 关闭标准输出
n>&-        # 关闭文件描述符n的输出
n<&-        # 关闭文件描述符n的输入

# 追加内容到文件
cat >> a.log <<EOF
123
EOF

# 将标准错误重定向到标准输出
nohup command > myout.file 2>&1 &
```

### 数值计算
```bash
# 第一种：$[]
# 第二种：$(())
# 第三种: expr
# 第四种：let

((i=$j+$k))     等价于   i=`expr $j + $k`
((i=$j-$k))     等价于   i=`expr $j -$k`
((i=$j*$k))     等价于   i=`expr $j \*$k`
((i=$j/$k))     等价于   i=`expr $j /$k`

+：加法
-：减法
*：乘法
/：除法（整除）
%：余数
**：指数
++：自增运算（前缀或后缀）
--：自减运算（前缀或后缀）


$((a + 200))      # $a + 200
$(($RANDOM%200))  # 0..199 之间的随机数
```

### 子shell

```bash
(cd somedir; echo "I'm now in $PWD")
pwd # still in first directory
```


### 检查命令

```bash
command -V cd
#=> "cd is a function/alias/whatever"
```

### Source

```bash
source "${0%/*}/../share/foo.sh"
```

### 脚本目录

```bash
DIR="${0%/*}"
```

### printf

```bash
printf "Hello %s, I'm %s" Sven Olga
#=> "Hello Sven, I'm Olga

printf "1 + 1 = %d" 2
#=> "1 + 1 = 2"

printf "Print a float: %f" 2
#=> "Print a float: 2.000000"
```

### 反斜杠转义 {.row-span-2}

- &nbsp; 
- \!
- \"
- \#
- \&
- \'
- \(
- \)
- \,
- \;
- \<
- \>
- \[
- \|
- \\
- \]
- \^
- \{
- \}
- \`
- \$
- \*
- \?
{.cols-4 .marker-none}


使用 `\` 转义这些特殊字符



### 可选参数

```bash
args=("$@")
args+=(foo)
args+=(bar)
echo "${args[@]}"
```

将参数放入数组中，然后追加



### 转到上一个目录

```bash
pwd # /home/user/foo
cd bar/
pwd # /home/user/foo/bar
cd -
pwd # /home/user/foo
```


### 读取输入

```bash
echo -n "Proceed? [y/n]: "
read ans
echo $ans
```

```bash
read -n 1 ans    # 读取一个字符
```


### 条件执行

```bash
git commit && git push
git commit || echo "Commit failed"
```


### 严格模式

```bash
set -euo pipefail
IFS=$'\n\t'
```

更多: [Unofficial bash strict mode](http://redsymbol.net/articles/unofficial-bash-strict-mode/)


### Heredoc

```sh
cat <<END
hello world
END
```

### 删除输入的字符
```sh
stty erase ^h
read  -p  "请输入参数信息"
```
输入参数时正常使用删除字符操作而不会出现 ^H 字符



## 更多资源 {.cols-1}
* [Devhints](https://devhints.io/bash) _(devhints.io)_
* [Bash-hackers wiki](http://wiki.bash-hackers.org/) _(bash-hackers.org)_
* [Shell vars](http://wiki.bash-hackers.org/syntax/shellvars) _(bash-hackers.org)_
* [Learn bash in y minutes](https://learnxinyminutes.com/docs/bash/) _(learnxinyminutes.com)_
* [Bash Guide](http://mywiki.wooledge.org/BashGuide) _(mywiki.wooledge.org)_
* [ShellCheck](https://www.shellcheck.net/) _(shellcheck.net)_
* [shell - Standard Shell](https://devmanual.gentoo.org/tools-reference/bash/index.html) _(devmanual.gentoo.org)_
