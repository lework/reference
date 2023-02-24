---
title: Groovy
date: 2022-12-16 18:59:41
background: bg-[#4298b8]
tags:
    - groovy
    - jenkins
categories:
    - 编程
intro: |
    Apache [Groovy](https://groovy-lang.org/) 是一种功能强大的、可选类型的动态语言，具有静态类型和静态编译功能，用于 Java 平台，旨在通过简洁、熟悉和易于学习的语法提高开发人员的工作效率。它可以与任何 Java 程序顺利地集成，并立即为您的应用程序提供强大的功能，包括脚本功能、特定于领域的语言编写、运行时和编译时元编程以及函数式编程。
---



开始
---------------

### 下载安装

#### windows
```
https://groovy.jfrog.io/artifactory/dist-release-local/groovy-windows-installer/groovy-4.0.6/groovy-4.0.6.msi
```

#### linux
```bash
$ yum -y install java-11-openjdk
$ wget https://groovy.jfrog.io/artifactory/dist-release-local/groovy-zips/apache-groovy-binary-4.0.6.zip
$ unzip apache-groovy-binary-4.0.6.zip
$ mv groovy-4.0.6 /usr/share/groovy
$ echo 'export GROOVY_HOME=/usr/share/groovy' >> /etc/profile
$ echo 'export PATH="$PATH:$GROOVY_HOME/bin"' >> /etc/profile
$ echo "export JAVA_HOME=$(dirname $(dirname $(realpath $(which java))))" >> /etc/profile
$ source /etc/profile
$ groovy --version
Groovy Version: 4.0.6 JVM: 11.0.17 Vendor: Red Hat, Inc. OS: Linux
```


### 命令行执行

```bash
$ groovy MyScript.groovy
$ groovy -e "print 12.5*Math.PI"

$ echo 12.5  groovy -pe|
"line.toDouble() * Math.PI"

$ groovy -i.bak -pe
"line.reverse()" data.txt
```

### 注释

```groovy
// 单行注释

/* 多行
   注释 */

println 1 /* one */ + 2 /* two */

/**
 * 这里是 doc 注释
 * desc
 */
```


数据类型 {.cols-2}
---------------


### 基本数据类型

| 类型                 | 常量                             | 说明                                                         |
| :------------------- | :------------------------------- | :----------------------------------------------------------- |
| java.lang.String     | `"hi"`, `'hi'`, `/hi/`, `$/hi/$` | 双引号允许嵌入表达式。 `/`表示您不需要转义\字符，`$/`表示您无需转义/字符（适用于正则表达式）。 |
| java.lang.Character  | `'H' as char`                    | 单个字符文字                                                 |
| java.lang.Boolean    | `true`, `false`                  | 布尔类型                                                     |
| java.lang.Byte       | `0 as byte`, `-12 as byte`       | 8位整数。字节值                                              |
| java.lang.Integer    | `0`, `-12`                       | 32位整数。整数                                               |
| java.lang.Long       | `0L`, `-12L`                     | 64位整数。长整型                                             |
| java.math.BigInteger | `0G`, `-12G`                     | 值没有上限。没有原始的对等                                   |
| java.lang.Float      | `0.0F`, `-12.12F`                | 32位单精度浮点数。原始类型:`float`                           |
| java.lang.Double     | `0.0D`, `-12.12D`                | 64位双精度浮点数。 基本类型：双精度                          |
| java.math.BigDecimal | `0.0`, `-12.12`                  | 精确的无上限浮点数。不,原始的等效。                          |
| java.util.List       | `[]`, `[1, 2, 3]`                | 列表                                                         |
| java.util.Set        | `[] as Set`, `[1, 2, 3] as Set`  | 列表                                                         |
| java.util.Map        | `[:]`, `[one: 1, two: 2]`        | 使用映射文字时，字符串键不需要引号。                         |
| groovy.lang.IntRange | `0..<10`, `1..100`               | 第一个字面值排除了上界，而第二个字面值包含了上界。下界总是包含在内的。 |

### 类型转换

```groovy
Set s = [1, 2, 3, 3]
char ch = 'H'
int[] a = [1, 2, 3, 4]

def s = [1, 2, 3, 3] as Set
def ch = 'H' as char
def a = [1, 2, 3, 4] as int[]
def strNumber = number.toString();

```

### list 

```groovy
def nums = [1,2,4,5,6]
def nums1 = [0,"23",4,5,62,false] as LinkedList

println "nums is ${nums.getClass().getName()} size = ${nums.size()}"

println "第三个元素是 ${nums1[2]},倒数第一个是 ${nums1[-1]};第一个和倒数第一个：${nums1[0,-1]}"
println "第二个到第四个：${nums1[1..3]}"

// add
def list = [1, 2]
list.add(3)

// remove
list.remove(1)

// 遍历
nums1.each {
  print "$it, "
}

// 带有下标的遍历：使用 eachWithIndex 方法
numList.eachWithIndex { int value ,int index->
    println "list[$index] = $value"
}

// 数组
String [] strings = ["I","'","m","is","a","dog","."]
println "\n 数组 :${strings.getClass().getName()}"
strings.each{
  print "$it "
}

// for
for (item in ["A", "B", "C"]) {
   println item
}
```



### map

```groovy
def colors = [red:'#FF0000',green:'#00FF00',blue:'#0000FF']

println " map calss is ${colors.getClass().getName()}"
println "通过 map.key 的方式访问 colors.red = ${colors.red}"
println "通过 map[key] 的方式访问 colors['red'] = ${colors['red']}"
println "通过 map.get(key) 的方式访问 colors.get(red) = ${colors.get('red')}"

// 添加元素
colors['pink'] = '#FF00FF'
colors.yellow = '#FFFF00'

// 修改元素
colors.red = 'red'
colors['blue'] = 'blue'

// 删除元素
colors.remove('red')

// 遍历 
colors.each{
    println "${it.key} :${it.value}"
}

// 查找元素 
def green = colors.find { key ,value ->
  if(key.equals('green')) {
      return colors[key]
  }
  return null
}

println "查找结果是 ${green}"

def blue = colors.find { Map.Entry entry ->
    if(entry.key.equals('blue')){
        return entry.value
    }
    return null
}
println "查找的结果是 ${blue}"


// for
def map = ['abc':1, 'def':2, 'xyz':3]
x = 0
for ( e in map ) {
    x += e.value
}

```


## 运算符 {.cols-2}

### 基本运算符

| 运算符     | 方法                    | 说明           |
| :--------- | :---------------------- | :------------- |
| `+`        | a.plus(b)               | 加             |
| `-`        | a.minus(b)              | 减             |
| `*`        | a.multiply(b)           | 乘             |
| `/`        | a.div(b)                | 除             |
| `%`        | a.mod(b)                | 取余           |
| `**`       | a.power(b)              | 取幂           |
| `|`        | a.or(b)                 | 或             |
| `&`        | a.and(b)                | 和             |
| `^`        | a.xor(b)                | 异或           |
| `as`       | a.asType(b)             | 类型转换       |
| `a()`      | a.call()                | 方法调用       |
| `a[b]`     | a.getAt(b)              | 访问元素       |
| `a[b] = c` | a.putAt(b, c)           | 列表赋值       |
| `a in b`   | b.isCase(a)             | 判断是否存在   |
| `<<`       | a.leftShift(b)          | 左移位或追加   |
| `>>`       | a.rightShift(b)         | 右移位         |
| `>>>`      | a.rightShiftUnsigned(b) | 无符号右移     |
| `++`       | a.next()                | 自增长         |
| `--`       | a.previous()            | 自减           |
| `+a`       | a.positive()            | Make positive  |
| `-a`       | a.negative()            | Make negative  |
| `~a`       | a.bitwiseNegative()     | Bitwise negate |

### 其他运算符

| 运算符        | 说明                                                         |
| :------------ | :----------------------------------------------------------- |
| `a == b`      | 相等                                                         |
| `a != b`      | 不相等                                                       |
| `a < b`       | 小于                                                         |
| `a <= b`      | 小于等于                                                     |
| `a > b`       | 大于                                                         |
| `a >= b`      | 大于等于                                                     |
| `a <=> b`     | 比较（如果a小于，等于或大于，则返回-1、0或1）                |
| `a =~ b`      | 正则表达式模式匹配。返回一个匹配器，如果a匹配b的任何部分，则等于true。 |
| `a ==~ b`     | 正则表达式模式精确匹配。如果a与b完全匹配，则返回true。       |
| `a?.b`        | 空导航。如果a或b为空，则返回null。                           |
| `a ? v1 : v2` | 三元操作符(简明if-else)。如果表达式a的值为true，则返回v1，否则返回v2。 |
| `a ?: b`      | 猫王运算符。如果a等于true (Groovy Truth)，则返回值a，否则返回b。 |



## 流程控制

```groovy
if (<expr>) {          
    ...
}
else if (<expr>) {      
    ...
}
else {
    ...
}
```

```gr
switch (<value>) {
case <value>:                 
    ...
    break                     
case <value>:                 
    ...
    break
default:                      
    ...
    break
}
```

## 循环

### for

```groovy
for (int i in 0..<10) {
    println(i);
}

for (int i = 0; i < 10; i += 2) {
    println(i);
}
```

### while

```groovy
int count = 0;

while(count<5) {
    println(count);
    count++;
}
```

### do-while
```groovy
def count = 5
def fact = 1
do {
    fact *= count--
} while(count > 1)
assert fact == 120
```



## 异常

### try/catch
```groovy
try {
    // Execute the code that might throw an exception
}
catch (SpecficException ex) {                 
    // Do something with the exception `ex`
}
catch (GenericException ex) {
    ...
}
finally {                                     
    ...
}

throw new MyException() //抛异常

assert 1==2 :"1不等于2" // 断言
```



## class/object {.cols-2}

### 类

```groovy
class Person {
    String name
    Date dateOfBirth

    int getAge() {
        return (new Date() - dateOfBirth).intdiv(365)
    }
}

def p = new Person()
def p = new Person(name: "John Doe", dateOfBirth: ...)

```


### 闭包 {.row-span-2}

闭包其实就是一段匿名代码块。

闭包在` Groovy` 中是 `groovy.lang.Closure` 类的实例，这使得闭包可以赋值给变量或字段

```groovy
// 定义一个闭包
def hello = { println "Hello 闭包" }

// 调用
hello.call()
hello()


/*
  * closure 就是 闭包参数
*/
def customEach(closure){
    //迭代元素
    for(int i in 1..10){
    //在闭包后跟上 () 就是调用了 括号里的参数就是闭包要接收的参数
        closure(i)
    }
}

// 如果只有一个参数 默认就是 it
customEach {
     println it
}

// map闭包
def eachMap(closure){
    def map1 = [name:'map闭包',age:666]
    map1.each {
        closure(it.key,it.value)
    }
}

// 如果有多个参数，就必须要把参数列出来，使用 -> 将 参数和主体分开
eachMap { key,value ->
    println "$key:$value"
}
```


### 方法

```groovy
/*
 * 返回大的那个
 */
def max(int a ,int b){
    if(a>b){
      return   a
    }else{
      return   b
    }
}

/*
 * 返回大的那个, return 可以省略
 */
def max(int a ,int b){
    if(a>b){
       a
    }else{
       b
    }
}

// 调用
max (10,20)
max 10,20 // 可以省略括号

```




更多资源
---------------

- [官方文档](http://docs.groovy-lang.org/next/html/documentation/) 
- [语法](http://www.groovy-lang.org/syntax.html)
- [API 文档](http://docs.groovy-lang.org/latest/html/groovy-jdk/java/lang/Object.html)

