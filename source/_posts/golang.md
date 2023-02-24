---
title: Golang
date: 2022-12-11 10:21:41
background: bg-[#4ba4cc]
tags:
    - Go
    - Golang
categories:
    - 编程
intro: |
    [Golang](https://golang.org/) 的基本语法和使用. 
---


开始
--------

### 安装 {.row-span-2}

Golang [下载页面](https://go.dev/dl/)

#### Windows
```
https://go.dev/dl/go1.19.4.windows-amd64.msi

C:\> $env:GO111MODULE = "on"
C:\> $env:GOPROXY = "https://goproxy.cn"
# 还可以设置不走 proxy 的私有仓库或组，多个用逗号相隔（可选）
$env:GOPRIVATE = "git.mycompany.com,github.com/my/private"
```

#### Linux
```bash
wget -O go.tgz https://go.dev/dl/go1.19.4.linux-amd64.tar.gz
tar -C /usr/local -xzf go.tgz
rm go.tgz
go version

export GO111MODULE=on
export GOPROXY=https://goproxy.cn,direct
export GOPATH=/go
export PATH=$PATH:/usr/local/go/bin

# 还可以设置不走 proxy 的私有仓库或组，多个用逗号相隔（可选）
export GOPRIVATE=git.mycompany.com,github.com/my/private
```
#### IDE
- [Visual Studio Code](https://code.visualstudio.com/)
- [GoLand](https://www.jetbrains.com/go/download/)


### hello.go {.row-span-2}
```go
package main

import "fmt"

func main() {
  message := greetMe("world")
  fmt.Println(message)
}

func greetMe(name string) (string) {
  msg := "Hello, "
  return msg + name + "!"
}
```
直接运行
```shell script
$ go run hello.go
Hello, world!
```
编译后运行
```shell script
$ go build -o hello hello.go
$ chmod +x hello
$ ./hello
Hello, world!
```
试试 [Go repl](https://repl.it/languages/go)

### 注释
```go
// 单行注释
/* 多行
 注释 */
```

### 变量声明 

```go
var foo int 				// 没有初始化声明
var foo int = 42 			// 初始化声明
var foo, bar int = 42, 1302 // 一次声明并初始化多个变量
var foo = 42 				// 省略类型，变量会从初始值中获得类型
var (                       // 批量声明
    a int
    b string
    c := 1
)
foo := 42 					// 简洁赋值，只能在 func 内使用，省略 var 关键字，类型总是隐含的
_, b := GetData()           // _ 被称为空白标识符,任何赋给这个标识符的值都将被抛弃

const constant = "This is a constant"  // 常量
// Iota可用于从0开始递增的数字
const (
    _ = iota
    a
    b
    c = 1 << iota
    d
)
```



Golang 基础类型
--------

### 字符串

```go
s1 := "Hello" + "World"
s2 := `A "raw" string literal
can include line breaks.`
// 输出：10
fmt.Println(len(s1))
// 输出：Hello
fmt.Println(string(s1[0:5]))
```
字符串的类型为 `string`.


### Numbers 

```go
num := 3         // int
num := 3.        // float64
num := 3 + 4i    // complex128
num := byte('a') // byte (alias: uint8)
var u uint = 7        // uint (unsigned)
var p float32 = 22.7  // 32-bit float
```



### Booleans

```go
isTrue   := true
isFalse  := false
```



### Arrays {.row-span-3}
```go
┌────┬────┬────┬────┬─────┬─────┐
| 2  | 3  | 5  | 7  | 11  | 13  |
└────┴────┴────┴────┴─────┴─────┘
  0    1    2    3     4     5
```

---

```go
primes := [...]int{2, 3, 5, 7, 11, 13}
fmt.Println(len(primes)) // => 6
// 输出：[2 3 5 7 11 13]
fmt.Println(primes)
// 与 [:3] 相同，输出：[2 3 5]
fmt.Println(primes[0:3])
```
---
```go
var a [2]string
a[0] = "Hello"
a[1] = "World"
fmt.Println(a[0], a[1]) //=> Hello World
fmt.Println(a)   // => [Hello World]
```
#### 2d array
```go
var twoDimension [2][3]int
for i := 0; i < 2; i++ {
    for j := 0; j < 3; j++ {
        twoDimension[i][j] = i + j
    }
}
// => 2d:  [[0 1 2] [1 2 3]]
fmt.Println("2d: ", twoDimension)
```



### 切片 {.row-span-3}

```go
var a []int                              // 声明一个切片和声明一个数组一样，只是不需要长度
var a = []int {1, 2, 3, 4}               // 声明并赋值一个切片 (由隐式给出的数组支持)
a := []int{1, 2, 3, 4}                   // 简写
chars := []string{0:"a", 2:"c", 1: "b"}  // ["a", "b", "c"]

var b = a[lo:hi]    // 声明一个从索引 lo 到 hi-1 的切片 (数组的视图) 
var b = a[1:4]      // 索引从1到3的切片
var b = a[:3]       // 低位索引缺省值为0
var b = a[3:]       // 高位索引缺省值为切片 a 的长度
a =  append(a,17,3) // 向切片 a 加入多个元素
c := append(a,b...) // 拼接切片 a 和切片 b

// 使用 make 声明一个切片
a = make([]byte, 5, 5)  // 第一个参数是长度，第二是容量
a = make([]byte, 5) // 容量是可选参数

// 从一个数组中声明一个切片
x := [3]string{"a", "b", "c"}
s := x[:] // 引用 x 存储的切片

// loop over an array/a slice
for i, e := range a {
    // i is the index, e the element
}

// if you only need e:
for _, e := range a {
    // e is the element
}

// ...and if you only need the index
for i := range a {
}
```

更多: [Slices example](https://gobyexample.com/slices)


### 指针

```go
func main () {
  b := *getPointer()
  fmt.Println("Value is", b)
}
```


```go
func getPointer () (myPointer *int) {
  a := 234
  return &a
}
```


```go
a := new(int)
*a = 234
```

更多: [Pointers](https://tour.golang.org/moretypes/1)




### 常量
```go
const s string = "constant"
const Phi = 1.618
const n = 500000000
const d = 3e20 / n
fmt.Println(d)
```




### 类型转换

```go
i := 90
f := float64(i)
u := uint(i)
s := string(i) 	// 将等于字符Z

// 需要导入 "strconv"
s := strconv.Itoa(i)   // 数字转字符
```




Golang 字符串
--------

### Strings function
```go
package main
import (
	"fmt"
	s "strings"
)
func main() {
    /* Need to import strings as s */
	fmt.Println(s.Contains("test", "e"))
    /* Build in */
    fmt.Println(len("hello"))  // => 5
    // Outputs: 101
	fmt.Println("hello"[1])
    // Outputs: e
	fmt.Println(string("hello"[1]))
}
```



### fmt.Printf {.row-span-2 .col-span-2}
```go
package main
import (
	"fmt"
	"os"
)
type point struct {
	x, y int
}
func main() {
	p := point{1, 2}
	fmt.Printf("%v\n", p)                        // => {1 2}
	fmt.Printf("%+v\n", p)                       // => {x:1 y:2}
	fmt.Printf("%#v\n", p)                       // => main.point{x:1, y:2}
	fmt.Printf("%T\n", p)                        // => main.point
	fmt.Printf("%t\n", true)                     // => TRUE
	fmt.Printf("%d\n", 123)                      // => 123
	fmt.Printf("%b\n", 14)                       // => 1110
	fmt.Printf("%c\n", 33)                       // => !
	fmt.Printf("%x\n", 456)                      // => 1c8
	fmt.Printf("%f\n", 78.9)                     // => 78.9
	fmt.Printf("%e\n", 123400000.0)              // => 1.23E+08
	fmt.Printf("%E\n", 123400000.0)              // => 1.23E+08
	fmt.Printf("%s\n", "\"string\"")             // => "string"
	fmt.Printf("%q\n", "\"string\"")             // => "\"string\""
	fmt.Printf("%x\n", "hex this")               // => 6.86578E+15
	fmt.Printf("%p\n", &p)                       // => 0xc00002c040
	fmt.Printf("|%6d|%6d|\n", 12, 345)           // => |    12|   345|
	fmt.Printf("|%6.2f|%6.2f|\n", 1.2, 3.45)     // => |  1.20|  3.45|
	fmt.Printf("|%-6.2f|%-6.2f|\n", 1.2, 3.45)   // => |1.20  |3.45  |
	fmt.Printf("|%6s|%6s|\n", "foo", "b")        // => |   foo|     b|
	fmt.Printf("|%-6s|%-6s|\n", "foo", "b")      // => |foo   |b     |
	s := fmt.Sprintf("a %s", "string")
	fmt.Println(s)
	fmt.Fprintf(os.Stderr, "an %s\n", "error")
}
```
更多: [fmt](https://golang.org/pkg/fmt/)




### 字符串函数
| Example                       | Result      |
|-------------------------------|-------------|
| Contains("test", "es")        | true        |
| Count("test", "t")            | 2           |
| HasPrefix("test", "te")       | true        |
| HasSuffix("test", "st")       | true        |
| Index("test", "e")            | 1           |
| Join([]string{"a", "b"}, "-") | a-b         |
| Repeat("a", 5)                | aaaaa       |
| Replace("foo", "o", "0", -1)  | f00         |
| Replace("foo", "o", "0", 1)   | f0o         |
| Split("a-b-c-d-e", "-")       | [a b c d e] |
| ToLower("TEST")               | test        |
| ToUpper("test")               | TEST        |



Golang 条件控制
--------

### 示例

```go
a := 10
if a > 20 {
    fmt.Println(">")
} else if a < 20 {
    fmt.Println("<")
} else {
    fmt.Println("=")
}
```

### if中的语句

```go
x := "hello go!"
if count := len(x); count > 0 {
    fmt.Println("Yes")
}
```
---
```go
if _, err := doThing(); err != nil {
    fmt.Println("Uh oh")
}
```

### Switch {.row-span-2}
```go {.wrap}
x := 42.0
switch x {
case 0:
case 1, 2: // case 可以和多个条件匹配，用逗号分隔它们
    fmt.Println("Multiple matches")
     // case 自动添加 break ，默认没有 fallthrough
case 42:
    fmt.Println("reached")
case 43:
    fmt.Println("Unreached")
case number > 43: // 你也能在 switch 的 case 中进行比较
    fmt.Println("Greater")
default:
    fmt.Println("Optional")
}
```

更多: [Switch](https://github.com/golang/go/wiki/Switch)

### For loop

```go
for i := 0; i <= 10; i++ {
  fmt.Println("i: ", i)
}
```

### For-Range loop

```go {.wrap}
nums := []int{2, 3, 4}
sum := 0
for _, num := range nums {
    sum += num
}
fmt.Println("sum:", sum)
```

### While loop

```go
i := 1
for i <= 3 {
    fmt.Println(i)
    i++
}

for ; i < 10;  { // while 循环（和其他语言的 while 循环一样）
}
for { // 你可以省略条件，类似其他语言的 while(true)
}
```

### Continue 关键字
```go
for i := 0; i <= 5; i++ {
    if i % 2 == 0 {
        continue
    }
    fmt.Println(i)
}
```
### Break 关键字
```go
for {
    fmt.Println("loop")
    break
}
```



Golang 结构和映射
--------

### 定义 {.col-span-2 .row-span-3}

```go
package main
import (
	"fmt"
)

// 声明结构体
type Vertex struct { 
	X int
	Y int
}

// 匿名结构体
point := struct {
    X, Y int
}{1, 2}

// 为结构体定义方法, 该结构体在每次调用的时候都会被复制！
func (v Vertex) Abs() float64 {
	return math.Sqrt(v.X*v.X + v.Y*v.Y)
}

// 对于需要（对结构体）产生改变的方法，则可以使用指向结构体
// 的指针作为类型。这样做的话，结构体的值就不会在
// 方法调用的时候被复制了。
func (v *Vertex) add(n float64) {
    v.X += n
    v.Y += n
}

func main() {
	// 创建
	var v = Vertex{1, 2}
    var v = Vertex{X: 1, Y: 2} // 通过键值定义结构体
    var v = []Vertex{{1,2},{5,2},{5,5} } // 初始化一个结构体切片
    
	v.X = 4            // 访问结构体成员
	fmt.Println(v.X, v.Y) // => 4 2
	
	v.Abs() // 调用方法
}
```

更多: [Structs](https://tour.golang.org/moretypes/2)

### 字面量

```go
v := Vertex{X: 1, Y: 2}
// Field names can be omitted
v := Vertex{1, 2}
// Y is implicit
v := Vertex{X: 1}
```

You can also put field names.


### 映射
```go
m := make(map[string]int)
m["k1"] = 7
m["k2"] = 13
fmt.Println(m) // => map[k1:7 k2:13]
v1 := m["k1"]
fmt.Println(v1)     // => 7
fmt.Println(len(m)) // => 2
delete(m, "k2")
fmt.Println(m) // => map[k1:7]
elem, ok := m["k2"]   // // 检查键 "k2" 是否存在，并查找映射相应的值
fmt.Println(prs) // => false
n := map[string]int{"foo": 1, "bar": 2}
fmt.Println(n) // => map[bar:2 foo:1]

// iterate over map content
for key, value := range m {
}
```


### 指向结构的指针

```go
p := Vertex{1, 2}  // p 是一个 Vertex
q := &p            // q 是一个指向 Vertex 的指针
v := &Vertex{1, 2} // v 也是一个指向 Vertex 的指针
v.X = 2

//  Vertex 的指针类型是 *Vertex
var s *Vertex = new(Vertex) // new 方法会创建一个指向新的结构实例的指针
```

当`v`是一个指针的时候,  `v.X`和`(*v).X`是一样的.






Golang 函数
--------


### 多个参数
```go
func plus(a int, b int) int {
    return a + b
}
func plusPlus(a, b, c int) int {  // 相同类型的多个参数
    return a + b + c
}
fmt.Println(plus(1, 2))
fmt.Println(plusPlus(1, 2, 3))
```

### 多个返回值

```go
func vals() (int, int) {
    return 3, 7
}
a, b := vals()
fmt.Println(a)    // => 3
fmt.Println(b)    // => 7
```

### 匿名函数

```go
r1, r2 := func() (string, string) {
    x := []string{"hello", "lework"}
    return x[0], x[1]
}()
// => hello lework
fmt.Println(r1, r2)
```

### 返回已命名的值

```go
func split(sum int) (x, y int) {
  x = sum * 4 / 9
  y = sum - x
  return  // x 和 y 将被返回
}
x, y := split(17)
fmt.Println(x)   // => 7
fmt.Println(y)   // => 10
```

不指定返回值会导致可读性差。

### 不定参数函数
```go
// 通过在最后一个参数的类型名称之前使用 ...，你可以指示它需要零个或多个参数。
func sum(nums ...int) {
    fmt.Print(nums, " ")
    total := 0
    for _, num := range nums {
        total += num
    }
    fmt.Println(total)
}
sum(1, 2)     //=> [1 2] 3
sum(1, 2, 3)  // => [1 2 3] 6
nums := []int{1, 2, 3, 4}
sum(nums...)  // => [1 2 3 4] 10
```


### 初始化函数
```go
import --> const --> var --> init()
```
---
```go
var num = setNumber()
func setNumber() int {
    return 42
}
func init() {
    num = 0
}
func main() {
    fmt.Println(num) // => 0
}
```


### 函数值
```go
func main() {
    // 函数值：把函数「绑定」给一个变量
    add := func(a, b int) int {
        return a + b
    }
    // 使用该变量来调用该函数
    fmt.Println(add(3, 4)) // => 7
}
```

### 闭包 1
```go
// 闭包是一个函数值，它可以引用其函数体之外的变量
func scope() func() int{
    outer_var := 2
    foo := func() int {return outer_var}
    return foo
}
// Outpus: 2
fmt.Println(scope()())
```

### 闭包 2
```go
// 闭包：不会改变外部变量，而是重新定义它们！
// 闭包内用到的外层变量，会在闭包创建的时候，把外层变量的地址传进闭包内
func outer() (func() int, int) {
    outer_var := 2
    inner := func() int {
        outer_var += 99  // 尝试改变外部变量 outer_var
        return outer_var // => 101 (但 outer_var 是一个新定义的变量只在内部可见）
    }
    inner()
    return inner, outer_var // => 101, 2（outer_var 仍然是2，没有被内部改变！）
}
inner, val := outer()
fmt.Println(inner()) // => 200
fmt.Println(val)     // => 101
```


Golang 包
--------


### 导入  {.row-span-2}

```go
import "fmt"
import "math/rand"
```
#### Same as
```go
import (
  "fmt"        // gives fmt.Println
  "math/rand"  // gives rand.Intn
)
```

更多: [Importing](https://tour.golang.org/basics/1)




### 别名  {.row-span-2}

```go
import r "math/rand"
```
---
```go
import (
    "fmt"
    r "math/rand"
)
```
---
```go
r.Intn()
```


### 包

```go
package main
// An internal package may be imported only by another package
// that is inside the tree rooted at the parent of the internal directory
package internal
```

更多: [Internal packages](https://go.dev/doc/go1.4#internalpackages)

### Exporting names

```go
// Begin with a capital letter
func Hello () {
  ···
}
```

更多: [Exported names](https://tour.golang.org/basics/3)



Golang 并发
--------

### 协程 {.col-span-2}

协程是轻量级的线程（由 Go 管理，而不是操作系统的线程）

```go
package main
import (
	"fmt"
	"time"
)
func f(from string) {
	for i := 0; i < 3; i++ {
		fmt.Println(from, ":", i)
	}
}
func main() {
	f("direct")
	go f("goroutine")      // 在协程中使用一个已经命名的函数
	go func(msg string) {  // 在协程中使用一个匿名函数
		fmt.Println(msg)
	}("going")
	time.Sleep(time.Second)
	fmt.Println("done")
}
```


更多: [Goroutines](https://tour.golang.org/concurrency/1), [Channels](https://tour.golang.org/concurrency/2)




### WaitGroup

```go
package main
import (
	"fmt"
	"sync"
	"time"
)
func w(id int, wg *sync.WaitGroup) {
	defer wg.Done()
	fmt.Printf("%d starting\n", id)
	time.Sleep(time.Second)
	fmt.Printf("%d done\n", id)
}
func main() {
	var wg sync.WaitGroup
	for i := 1; i <= 5; i++ {
		wg.Add(1)
		go w(i, &wg)
	}
	wg.Wait()
}
```
更多: [WaitGroup](https://golang.org/pkg/sync/#WaitGroup)




### 通道

```go
ch := make(chan int) // 创建一个 int 类型的通道
ch <- 1  // 给通道 ch 发送一个值
ch <- 2
ch <- 3

v := <-ch            // 从 ch 接收一个值

close(ch) // 关闭通道
```
---
```go
// 从通道读取并测试它是否已经关闭,  如果 ok 是 false ，通道已经关闭
v, ok := <-ch

// 从通道中读取直到它关闭
for i := range ch {
  ···
}
```
---
```go
// 通过 select 在多个通道上操作，如果通道没有被阻塞，相应的 case 被执行
func doStuff(channelOut, channelIn chan int) {
    select {
    case channelOut <- 42:
        fmt.Println("We could write to channelOut!")
    case x := <- channelIn:
        fmt.Println("We could read from channelIn")
    case <-time.After(time.Second * 1):
        fmt.Println("timeout")
    }
}
```

更多: [Range and close](https://tour.golang.org/concurrency/4)



### 缓冲通道

```go
// 创建一个缓冲通道。
// 如果已经写入并未被读取的值比 <缓冲的大小> 少时
// 写入到一个缓冲通道不会被阻塞。
ch := make(chan int, 2)
ch <- 1
ch <- 2
ch <- 3
// fatal error:
// all goroutines are asleep - deadlock
```

更多: [Buffered channels](https://tour.golang.org/concurrency/3)

### 至理名言

```go
// 向 nil 值的通道发送数据永远会被阻塞
var c chan string
c <- "Hello, World!"
// fatal error: all goroutines are asleep - deadlock!

// 从一个 nil 值的通道接收数据永远会被阻塞
var c chan string
fmt.Println(<-c)
// fatal error: all goroutines are asleep - deadlock!


// 向一个已经关闭的通道发送数据会触发一个 panic
var c = make(chan string, 1)
c <- "Hello, World!"
close(c)
c <- "Hello, Panic!"
// panic: send on closed channel


// 从一个关闭的通道接收数据，会立即返回一个零值
var c = make(chan int, 2)
c <- 1
c <- 2
close(c)
for i := 0; i < 3; i++ {
    fmt.Printf("%d ", <-c)
}
// 1 2 0
```



Golang 错误控制
--------

### 处理错误
```go
type error interface {
    Error() string
}

// 可能返回错误的函数
func doStuff() (int, error) {
}

func main() {
    result, err := doStuff()
    if err != nil {
        // 处理错误
    } else {
        // 一切安好，处理结果 result
    }
}
```

### defer 函数

```go
func main() {
  defer func() {
    fmt.Println("Done")
  }()
  fmt.Println("Working...")
}
```

#### Defer

```go
func main() {
  defer fmt.Println("Done")
  fmt.Println("Working...")
}
```

更多: [Defer, panic and recover](https://blog.golang.org/defer-panic-and-recover)


### Lambda defer

```go
func main() {
  var d = int64(0)
  defer func(d *int64) {
    fmt.Printf("& %v Unix Sec\n", *d)
  }(&d)
  fmt.Print("Done ")
  d = time.Now().Unix()
}
```

defer func使用d的当前值，除非我们在main结束时使用一个指针来获得最终值。







Golang 方法  {.cols-2}
--------

### 接收器

```go
type Vertex struct {
  X, Y float64
}
```

```go
func (v Vertex) Abs() float64 {
  return math.Sqrt(v.X * v.X + v.Y * v.Y)
}
```


```go
v := Vertex{1, 2}
v.Abs()
```

更多: [Methods](https://tour.golang.org/methods/1)

### Mutation

```go
func (v *Vertex) Scale(f float64) {
  v.X = v.X * f
  v.Y = v.Y * f
}
```


```go
v := Vertex{6, 12}
v.Scale(0.5)
// `v` is updated
```

更多: [Pointer receivers](https://tour.golang.org/methods/4)

Golang 接口 {.cols-2}
--------

### 接口声明

```go
type Shape interface {
  Area() float64
  Perimeter() float64
}
```
### 嵌套 {.row-span-3}

Go 没有类的继承，不过它有接口和结构体嵌套。

```go
// 实现 ReadWriter 必须同时实现 Reader 和 Writer
type ReadWriter interface {
    Reader
    Writer
}

// Server 导出了所有的 Logger 的方法
type Server struct {
    Host string
    Port int
    *log.Logger
}

// 通常使用这种方式初始化嵌套类型
server := &Server{"localhost", 80, log.New(...)}

// 在嵌入的结构体上实现的方法会被传递
server.Log(...) // 这样实际上是调用的 server.Logger.Log(...)

// 嵌入的结构体的字段名称是它的类型名称（这个示例中是 Logger ）
var logger *log.Logger = server.Logger
```


### 结构

```go
type Rectangle struct {
  Length, Width float64
}
```

结构 Rectangle 通过实现其所有方法隐式实现接口 Shape

### 方法

```go
// 类型如果实现了接口的所有方法，就隐式的实现了接口

func (r Rectangle) Area() float64 {
  return r.Length * r.Width
}
func (r Rectangle) Perimeter() float64 {
  return 2 * (r.Length + r.Width)
}
```

在 Shape 中定义的方法在Rectangle中实现

### 接口示例

```go {.wrap}
func main() {
  var r Shape = Rectangle{Length: 3, Width: 4}
  fmt.Printf("Type of r: %T, Area: %v, Perimeter: %v.", r, r.Area(), r.Perimeter())
}
```

其他
-------------

### 关键字
- break
- default
- func
- interface
- select
- case
- defer
- go
- map
- struct
- chan
- else
- goto
- package
- switch
- const
- fallthrough
- if
- range
- type
- continue
- for
- import
- return
- var
{.cols-3 .marker-none}

### 运算符和标点符号
|   |    |     |     |      |    |     |   |   |
|---|----|-----|-----|------|----|-----|---|---|
| + | &  | +=  | &=  | &&   | == | !=  | ( | ) |
| - | \| | -=  | \|= | \|\| | <  | <=  | [ | ] |
| * | ^  | *=  | ^=  | <-   | >  | >=  | { | } |
| / | << | /=  | <<= | ++   | =  | :=  | , | ; |
| % | >> | %=  | >>= | --   | !  | ... | . | : |
|   | &^ | &^= |     |      |    |     |   |   |


Go 命令
-------------

### Go 编译器命令

:- | --
:- | --
`go command [参数]`  | go 命令 [参数]
`go build`          | 编译包和依赖包
`go clean`          | 移除对象和缓存文件
`go doc`            | 显示包的文档
`go env`            | 打印go的环境变量信息
`go bug`            | 报告bug
`go fix`            | 更新包使用新的api
`go fmt`            | 格式规范化代码
`go generate`       | 通过处理资源生成go文件
`go get`            | 下载并安装包及其依赖
`go install`        | 编译和安装包及其依赖
`go list`           | 列出所有包
`go run`            | 编译和运行go程序
`go test`           | 测试
`go tool`           | 运行给定的go工具
`go version`        | 显示go当前版本
`go vet`            | 发现代码中可能的错误

### ENV

:- | --
:- | --
`GOOS`         | 编译系统
`GOARCH`       | 编译arch
`GO111MODULE`  | gomod开关
`GOPROXY`      | go代理 <https://goproxy.io>  <https://goproxy.cn>
`GOSSAFUNC`    | 生成 `SSA.html` 文件，展示代码优化的每一步 `GOSSAFUNC=func_name go build`

### Module

:- | --
:- | --
`go mod init`         | 初始化当前文件夹，创建go.mod文件
`go mod download`     | 下载依赖的module到本地
`go mod tidy`         | 增加缺少的module，删除无用的module
`go mod vendor`       | 将依赖复制到vendor下
文件 `go.mod`          |  依赖列表和版本约束
文件 `go.sum`          |  记录 `module` 文件 `hash` 值，用于安全校验


更多资源 {.cols-1}
--------
- [A tour of Go](https://tour.golang.org/welcome/1) _(tour.golang.org)_
- [Golang wiki](https://github.com/golang/go/wiki/) _(github.com)_
- [Effective Go](https://golang.org/doc/effective_go.html) _(golang.org)_
- [Go by Example](https://gobyexample.com/) _(gobyexample.com)_
- [Awesome Go](https://awesome-go.com/) _(awesome-go.com)_
- [JustForFunc Youtube](https://www.youtube.com/channel/UC_BzFbxG2za3bp5NRRRXJSw) _(youtube.com)_
- [Style Guide](https://github.com/golang/go/wiki/CodeReviewComments) _(github.com)_