---
title: Jenkins Pipeline
background: bg-red-600
label: jenkins
tags:
  - ci
  - cd
  - jenkins
categories:
  - CICD
date: 2022-12-15 18:58:57
intro:  Jenkins Pipeline是一套插件，将持续交付的实现和实施集成到 Jenkins 中。
---



Pipeline {.cols-2}
---------------

### 声明式 Pipeline {.row-span-2}


所有有效的声明式流水线必须包含在一个 `pipeline` 块中

```
pipeline {
   agent any

   stages {
      stage('Hello') {
         steps {
            echo 'Hello World'
         }
         post { 
         	success {
         		echo 'post success'
         	}
         }
      }
   }
}
```

- **pipeline**：代表整条流水线，包含整条流水线的逻辑。
- **agent部分**：指定流水线的执行位置（Jenkins agent）。流水线中的每个阶段都必须在某个地方（物理机、虚拟机或Docker容器）执行，agent部分即指定具体在哪里执行。
- **stages部分**：流水线中多个stage的容器。stages部分至少包含一个stage。
- **stage部分**：阶段，代表流水线的阶段。每个阶段都必须有名称。本例中，build就是此阶段的名称。
- **steps部分**：代表阶段中的一个或多个具体步骤（step）的容器。steps部分至少包含一个步骤，本例中，echo就是一个步骤。在一个stage中有且只有一个steps。

- post部分包含的是在整个pipeline或阶段完成后一些附加的步骤。

  > post部分是可选的，所以并不包含在pipeline最简结构中。但这并不代表它作用不大。根据pipeline或阶段的完成状态，post部分分成多种条件块，包括：

  - always：不论当前完成状态是什么，都执行。
  - changed：只要当前完成状态与上一次完成状态不同就执行。
  - fixed：上一次完成状态为失败或不稳定（unstable），当前完成状态为成功时执行。
  - regression：上一次完成状态为成功，当前完成状态为失败、不稳定或中止（aborted）时执行。
  - aborted：当前执行结果是中止状态时（一般为人为中止）执行。
  - failure：当前完成状态为失败时执行。
  - success：当前完成状态为成功时执行。
  - unstable：当前完成状态为不稳定时执行。
  - cleanup：清理条件块。不论当前完成状态是什么，在其他所有条件块执行完成后都执行。


### 脚本化 Pipeline

脚本化流水线, 与声明式Pipeline一样的是, 是建立在底层流水线的子系统上的。与声明式不同的是, 脚本化流水线实际上是由 Groovy 构建的通用 DSL。

```
node {
    stage('Example1') {
        # 使用 Groovy 的if/else条件语句
        if (env.BRANCH_NAME == 'master') {
            echo 'I only execute on the master branch'
        } else {
            echo 'I execute elsewhere'
        }
    }
    stage('Example2') {
        # 使用 Groovy 的异常处理
        try {
            sh 'exit 1'
        }
        catch (exc) {
            echo 'Something failed, I should sound the klaxons!'
            throw
        }
    }
}
```

### TIPS

- Jenkins Pipeline 的定义内容被写入一个文本文件(称为`Jenkinsfile`)
- 声明式管道鼓励[声明式编程模型](https://en.wikipedia.org/wiki/Declarative_programming), 脚本化管道遵循更加[命令式的编程模型](https://en.wikipedia.org/wiki/Imperative_programming)



Pipeline 指令 {.cols-2}
---------------

### parameters 参数 {.row-span-3}

 `parameters` 指令提供用户在触发管道时应该提供的参数列表。 

```
pipeline {
  agent any
  parameters {
    booleanParam defaultValue: true, description: '', name: 'userFlag'
  }
  stages {
    stage("foo") {
      steps {
        echo "flag: ${params.userFlag}"
      }
    }
  }
}
```

#### 可用参数

- `string`，字符串类型的参数。

    ```
    parameters {
      string name: 'DEPLOY_ENV', defaultValue: 'staging', description: ''
    }
    ```

- `text`，多行文本类型的参数，换行使用\n。

    ```
    parameters {
      text name: 'DEPLOY_TEXT', defaultValue:'One\nTwo\nThree\n'，description: ''
    }
    ```

- `booleanParam` 布尔类型的参数。

  ```
  parameters {
  	booleanParam(name: 'DEBUG_BUILD', defaultValue: true, description: '') 
  }
  ```

  

- `choice`，选择参数类型，使用\n来分隔多个选项。

    ```
    parameters {
      choice choices: ['dev\\ntest\\nstaging'], description: '请选择部署的环境', name: 'CHOICES'
    }
    ```

- password，密码类型。

    ```
    parameters {
      password defaultValue: 'test', description: '', name: 'test'
    }
    ```

- file 文件类型

    ```
    parameters {
      file description: '', name: '/tmp/file'
    }
    ```


#### 插件：Active Choices Parameter

插件地址: https://plugins.jenkins.io/uno-choice/

```
properties([
    parameters([
        [$class: 'ChoiceParameter', 
            choiceType: 'PT_SINGLE_SELECT', 
            description: 'Select the Env Name from the Dropdown List', 
            filterLength: 1, 
            filterable: true, 
            name: 'Env', 
            randomName: 'choice-parameter-5631314439613978', 
            script: [
                $class: 'GroovyScript', 
                fallbackScript: [
                    classpath: [], 
                    sandbox: false, 
                    script: 
                        'return[\'Could not get Env\']'
                ], 
                script: [
                    classpath: [], 
                    sandbox: false, 
                    script: 
                        'return["Dev","QA","Stage","Prod"]'
                ]
            ]
        ], 
        [$class: 'CascadeChoiceParameter', 
            choiceType: 'PT_SINGLE_SELECT', 
            description: 'Select the Server from the Dropdown List', 
            filterLength: 1, 
            filterable: true, 
            name: 'Server', 
            randomName: 'choice-parameter-5631314456178619', 
            referencedParameters: 'Env', 
            script: [
                $class: 'GroovyScript', 
                fallbackScript: [
                    classpath: [], 
                    sandbox: false, 
                    script: 
                        'return[\'Could not get Environment from Env Param\']'
                ], 
                script: [
                    classpath: [], 
                    sandbox: false, 
                    script: 
                        ''' if (Env.equals("Dev")){
                                return["devaaa001","devaaa002","devbbb001","devbbb002","devccc001","devccc002"]
                            }
                            else if(Env.equals("QA")){
                                return["qaaaa001","qabbb002","qaccc003"]
                            }
                            else if(Env.equals("Stage")){
                                return["staaa001","stbbb002","stccc003"]
                            }
                            else if(Env.equals("Prod")){
                                return["praaa001","prbbb002","prccc003"]
                            }
                        '''
                ]
            ]
        ]
    ])
])

pipeline {
  environment {
         vari = ""
  }
  agent any
  stages {
      stage ("Example") {
        steps {
         script{
          echo 'Hello'
          echo "${params.Env}"
          echo "${params.Server}"
          if (params.Server.equals("Could not get Environment from Env Param")) {
              echo "Must be the first build after Pipeline deployment.  Aborting the build"
              currentBuild.result = 'ABORTED'
              return
          }
          echo "Crossed param validation"
        } }
      }
  }
}
```
#### 应用：由另一个pipeline传参并触发

```
steps {
  build(
    job: "parameters-example",
    parameters:[
       booleanParam(name: 'userFlag', value: true)
    ]
  )
}
```

### environment 环境变量

`environment`：用于设置环境变量，可定义在stage或pipeline部分。

```
pipeline {
    agent any
    environment { 
        CC = 'clang'
    }
    stages {
        stage('Example') {
            environment { 
                BB = "stage"
            }
            steps {
                sh 'printenv'
            }
        }
    }
}
```

#### jenkins内置变量

在pipeline执行时，Jenkins通过一个名为env的全局变量，将Jenkins内置环境变量暴露出来。

```
pipeline {
  agent any
    stages {
      stage('Example') {
        steps {
          echo "Running ${env.BUILD_NUMBER} on ${env.JENKINS_URL}" //方法一
          echo "Running $env.BUILD_NUMBER on $env.JENKINS_ URL" //方法二
          echo "Running ${BUILD_NUMBER} on ${JENKINS_URL}" //方法三
        }
    }
  }
}
```

#### 自定义pipeline环境变量

environment指令可以在pipeline中定义，代表变量作用域为整个pipeline；也可以在stage中定义，代表变量只在该阶段有效。

```
pipeline {
  agent any
  environment {
    CC = 'clang'
  }
  stages {
    stage('Example') {
      environment {
        DEBUG_ FLAGS ='- g'
      }
      steps {
        sh "${CC} ${DEBUG_ FLAGS}"
        sh 'printenv'
      }
    }
  }
}

```

#### 自定义全局环境变量

进入Manage Jenkins→Configure System→Global properties页，勾选"Environmentvariables"复选框，单击"Add"按钮，在输入框中输入变量名和变量值即可.

自定义全局环境变量会被加入 env 属性列表中，所以，使用自定义全局环境变量与使用Jenkins内置变量的方法无异：`${env.name}`。



### options 选项

options指令可定义在stage或pipeline部分。

`options`：用于配置Jenkins pipeline本身的选项，比如 `options {retry(3)}`指当pipeline失败时再重试2次。

#### 可用选项
- `buildDiscarder`：保存最近历史构建记录的数量。当pipeline执行完成后，会在硬盘上保存制品和构建执行日志，如果长时间不清理会占用大量空间，设置此选项后会自动清理。此选项只能在pipeline下的options中使用。exp: ` options { buildDiscarder(logRotator(numToKeepStr: '1')) } `
- `checkoutToSubdirectory`：Jenkins从版本控制库拉取源码时，默认检出到工作空间的根目录中，此选项可以指定检出到工作空间的子目录中。exp: ` options { checkoutToSubdirectory('foo') } `
- `disableConcurrentBuilds`：同一个pipeline，Jenkins默认是可以同时执行多次的，如图3-2所示。此选项是为了禁止pipeline同时执行。exp: ` options { disableConcurrentBuilds() } `
- `disableResume`:   如果主服务器重新启动，则不允许管道恢复。 exp: ` options { disableResume() } `
- `newContainerPerStage`：当agent为docker或dockerfile时，指定在同一个Jenkins节点上，每个stage都分别运行在一个新的容器中，而不是所有stage都运行在同一个容器中。
- ` overrideIndexTriggers`: 允许重写分支索引触发器的默认处理。exp: ` options { overrideIndexTriggers(true) }` 
- ` preserveStashes`:  保存已完成的构建中的存储，以便在阶段重新启动时使用 . exp: ` options { preserveStashes(buildCount: 5) } `
- `quietPeriod`:  设置管道的静默期（以秒为单位），以覆盖全局默认值  exp: ` options { quietPeriod(30) } `
- `retry`：当发生失败时进行重试，可以指定整个pipeline的重试次数。需要注意的是，这个次数是指总次数，包括第1次失败。以下例子总共会执行4次。当使用retry选项时，options可以被放在stage块中。 exp: ` options { retry(3) } `
- `skipDefaultCheckout`:  默认情况下，在agent指令中跳过从源代码管理中检出代码。exp: `options { skipDefaultCheckout() }`
- `skipStagesAfterUnstable`: 一旦构建状态变得不稳定，就跳过阶段。 exp: ` options { skipStagesAfterUnstable() } `
- `timeout`：如果 pipeline 执行时间过长，超出了我们设置的 timeout 时间，Jenkins 将中止pipeline。exp: ` options { timeout(time: 1, unit: 'HOURS') } `
- `timestamps` : 在管道运行产生的所有控制台输出之前加上发出该管道的时间。 exp：`options { timestamps() } `
- `parallelsAlwaysFailFast`:  将管道中所有后续并行阶段的failfast设置为true。exp: ` options { parallelsAlwaysFailFast() } `

#### stage 选项
- `skipDefaultCheckout`:  默认情况下，在agent指令中跳过从源代码管理中检出代码。exp: `options { skipDefaultCheckout() }`
- `timeout`：如果 pipeline 执行时间过长，超出了我们设置的 timeout 时间，Jenkins 将中止pipeline。exp: ` options { timeout(time: 1, unit: 'HOURS') } `
- `retry`：当发生失败时进行重试，可以指定整个pipeline的重试次数。需要注意的是，这个次数是指总次数，包括第1次失败。以下例子总共会执行4次。当使用retry选项时，options可以被放在stage块中。 exp: ` options { retry(3) } `
- `timestamps` : 在管道运行产生的所有控制台输出之前加上发出该管道的时间。 exp：`options { timestamps() } `
- `parallel`：并行执行多个step。在pipeline插件1.2版本后，parallel开始支持对多个阶段进行并行执行。
- `parameters`：与input不同，parameters是执行pipeline前传入的一些参数。
- `triggers`：用于定义执行pipeline的触发器。
- `when`：当满足when定义的条件时，阶段才执行。

### tools 工具

`tools`指令定义自动安装和安装到路径上的工具的部分。 

```
pipeline {
    agent any
    tools {
        maven 'apache-maven-3.0.1' 
    }
    stages {
        stage('Example') {
            steps {
                sh 'mvn --version'
            }
        }
    }
}
```

### triggers 触发器 {.row-span-3}

`triggers` 指令定义了应该重新触发管道的自动化方式。

#### cron 时间触发

 接受一个cron样式的字符串来定义一个定期间隔 

```
pipeline {
  agent any
  triggers {
   cron('0 0 * * *')
  }
  stages {
    stage('Nightly build') {
      steps {
        echo '这是一个耗时的构建，每天凌晨执行'
      }
    }
  }
}

```

#### pollSCM 轮询代码仓库

接受一个cron样式的字符串来定义一个定期间隔，Jenkins应该在这个间隔上检查新的源代码更改。如果存在新的更改，将重新触发管道。 

```
pipeline {
  agent any
  triggers {
    // 每分钟判断一次代码是否有变化
    pollSCM('H/1 * * * *')
  }
}

```

Jenkins trigger cron语法采用的是UNIX cron语法（有些细微的区别）。一条cron包含5个字段，使用空格或Tab分隔，格式为：MINUTE HOUR DOM MONTH DOW。

#### upstream 由上游任务触发

接受逗号分隔的作业字符串和阈值。当字符串中的任何作业以最小阈值结束时，将重新触发管道。

```
// job1 和job2 都是任务名
triggers {
  upstream(upstreamProjects: 'job1,job2', threshold: hudson.model.Result.SUCCESS)
}

```

当upstreamProjects参数接收多个任务时，使用，分隔。threshold参数是指上游任务的执行结果是什么值时触发。

hudson.model.Result是一个枚举，包括以下值：

- ABORTED：任务被手动中止。

- FAILURE：构建失败。

- SUCCESS：构建成功。

- UNSTABLE：存在一些错误，但不至于构建失败。

- NOT_BUILT：在多阶段构建时，前面阶段的问题导致后面阶段无法执行。

注意：需要手动触发一次任务，让Jenkins加载pipeline后，trigger指令才会生效。

#### gitlab 事件触发

- GitLab插件（https：//plugins.jenkins.io/gitlab-plugin）

- git插件（https：//plugins.jenkins.io/git）。

```
pipeline {
  agent any
  triggers {
    gitlab(trigger0nPush: true,
           triggerOnMergeRequest: true,
           branchFilterType: 'All'，
           secretToken: "1234546")
  }
  stages {
    stage('build') {
      steps {
        echo "hello world from gitlab trigger"
      }
    }
  }
}

```

GitLab trigger方法有很多参数可配置，下面简单介绍一些常用的参数。

- triggerOnPush：当GitLab触发push事件时，是否执行构建。

- triggerOnMergeRequest：当GitLab触发mergeRequest事件时，是否执行构建。

- branchFilterType：只有符合条件的分支才会被触发。必选，否则无法实现触发。可以设置的值有：

◦ NameBasedFilter：基于分支名进行过滤，多个分支名使用逗号分隔。

◦ RegexBasedFilter：基于正则表达对分支名进行过滤。

◦ All：所有分支都会被触发。

- includeBranchesSpec：基于branchFilterType值，输入期望包括的分支的规则。

- excludeBranchesSpec：基于branchFilterType值，输入期望排除的分支的规则。

#### Generic Webhook Trigger插件触发

插件地址：https://plugins.jenkins.io/generic-webhook-trigger

```
pipeline {
  agent any

  triggers {
    GenericTrigger(
      genericVariables: [
        [key: 'ref', value:' $.ref' ]
      ],
      token:'secret',
      causeString: 'Triggered on $ref',
      printContributedVariables: true,
      printPostContent: true
      )
  }
  stages {
    stage('Some step') {
      steps {
        echo "hello world from Generic Webhook trigger"
        sh "echo $ref"
        sh "printenv"
      }
    }
  }
}

```

注意：在创建完成后，需要手动运行一次，这样pipeline的触发条件才会生效。

发起一次POST请求

```
curl -X POST -H "Content-Type: application/json" -d '{"ref": "refs/heads/master"}' -vs http://192.168.23.11:8667/jenkins/generic-webhook-trigger/invoke?token=secret
```

接着，我们就看到pipeline被触发执行了。

#### jenkins cron 语法

Jenkins cron语法遵循[cron实用程序](https://en.wikipedia.org/wiki/Cron)的语法 （略有不同）。具体来说，每行包含5个由TAB或空格分隔的字段：

```
* * * * *
分 时 天 月 周
第一个*表示一小时内的分钟数（0–59）
第二个*表示一天中的时间（0–23）
第三个*表示一个月中的某天（1-31）
第四个*表示一年中的某月（1–12）
第五个*表示一周中的第几天，取值0~7，其中0和7代表的都是周日
```

　要为一个字段指定多个值，可以使用以下运算符。按优先顺序排列：

- `*` 指定所有有效值
- `M-N` 指定一个范围值
- `M-N/X` 或 `*/X` 以 `X` 为间隔数在`M-N（指定范围）或*/X（整个范围）每次递增`
- `A,B,…,Z` 枚举多值

　　为了允许定期调度的任务在系统上产生均衡负载，应尽可能使用符号H（用于"hash")。例如，使用 `0 0 * * *` （每日凌晨执行）每日多个job同时执行将引起很大的高峰。而使用 `H H * * *` 仍然会每天执行一次。但是不会同时执行，可以更好的利用有限的资源。使用 `H` 可以表示一个范围。例如， `H H(0-7) * * *` 指每日上午12:00（午夜）至上午7:59之间的某段时间执行。H 符号可以看作是一个范围内的随机值，但它实际上是 job 名称的 hash，而不是随机函数，因此对于任何给定的项目，该值都保持稳定。``

　　此外还支持`@yearly`,`@annually`,`@monthly`,`@weekly`,`@daily`,`@midnight`,`@hourly 作为便利的别名，使用 hash system 保持自动平衡，@hourly等效于 H * * * * 表示在一个小时的任意时间， @midnight 表示在凌晨12:00到凌晨2:59之间。`

**示例**

```
每十五分钟（也许在:07,:22,:37,:52）
triggers{ cron('H/15 * * * *') }

在每小时的前半部分中每十分钟一次（三遍,也许在:04,:14,:24）
triggers{ cron('H(0-29)/10 * * * *') }

每隔一个小时的45分钟，每两小时一次，从上午9:45开始，到每个工作日的下午3:45结束。
triggers{ cron('45 9-16/2 * * 1-5') }

每个工作日的上午9点至下午5点之间每两小时一次（可能在10:38AM,12:38PM,2:38PM,4:38PM）
triggers{ cron('H H(9-16)/2 * * 1-5') }

每月12月1日和15日每天一次
triggers{ cron('H H 1,15 1-11 *') }
```

### stage 步骤

`stage`指令位于`stages`部分，应该包含一个步骤部分、一个可选的代理部分或其他特定于stage的指令。实际上，管道完成的所有实际工作都将封装在一个或多个阶段指令中。 

```
pipeline {
    agent any
    stages {
        stage('Example') {
            steps {
                echo 'Hello World'
            }
        }
    }
}
```

### input 输入

` input`指令允许您使用`input`步骤提示输入。 

执行input步骤会暂停pipeline，直到用户输入参数。

```
pipeline {
  agent any
  stages {
    stage('deploy') {
    steps {
      input message: "发布或停止"
    }
  }
}
```

带有选项的input

```
// 变量名，用于存储input步骤的返回值
def approvalMap

pipeline {
  agent any
  stages {
    stage('pre deploy') {
      steps {
        script {
           approvalMap = input(
             message: '准备发布到哪个环境?',
             ok: '确定',
             parameters: [
               choice(choices: 'dev\ntest\nprod', description: '发布到什么环境?' , name: 'ENV'),
               string(defaultValue:'', description:'', name: 'myparam' )
             ],
             submitter: 'admin,admin2,releaseGroup',
             submitterParameter: 'APPROVER'
           )
         }
      }
    }
    stage('deploy') {
     steps {
       echo "操作者是${approvalMap['APPROVER']}"
       echo "发布到什么环境? ${approvalMap['ENV']}"
       echo "自定义参数: ${approvalMap['myparam']}"
     }
   }
  }
}
```

 **配置选项**

- `message` 显示的信息
- `id` input的可选标识符，默认stage名称
- ` ok` input表单上"ok"按钮的可选文本。
- ` submitter` 允许提交此input的用户或外部组名的可选逗号分隔列表。默认允许任何用户。
- `submitterParameter` 环境变量的可选名称，如果存在，则使用`submitter`名称进行设置。
- `parameters` 一个可选的参数列表

### when 条件

`when` 指令允许管道根据给定的条件来决定是否应该执行阶段。 

#### 内置条件 

- `branch` 当正在构建的分支与给出的分支模式匹配时执行阶段

    ```
    when { 
      branch 'master'
    }
    ```
    
- `buildingTag` 如果pipeline所执行的代码被打了tag，则执行

    ```
    when {
      buildingTag( )
    }
    ```
    
- `changelog` 如果版本控制库的changelog符合正则表达式，则执行

    ```
    when {
      changelog '.*^\\[DEPENDENCY\\].+$'
    }
    ```
    
- `changeset` 如果版本控制库的变更集合中包含一个或多个文件符合给定的Ant风格路径表达式，则执行

    ```
    when {
      changeset "**/*.js"
    }
    ```

- `changeRequest`  如果当前构建是一个" change request "(也就是GitHub和Bitbucket上的Pull request, GitLab上的Merge request, Gerrit上的change，等等)，则执行这个阶段。 

    ```
    when {
    	changeRequest()
    }
    ```

- `environment` 如果环境变量的值与给定的值相同，则执行

    ```
    when {
     environment name: 'DEPLOY_TO', value: 'production'
    }
    ```

- `equals` 如果期望值与给定的值相同，则执行

    ```
    when {
      equals expected: 2, actual: currentBuild.number
    }
    ```

- `expression` 如果Groovy表达式返回的是true，则执行

    ```
    when {
      expression {
        return env.BRANCH_NAME != 'master';
      }
    }
    ```

- `tag` 如果pipeline所执行的代码被打了tag，且tag名称符合规则，则执行

    ```
    when {
      tag "release-*"
    }
    ```
    
    如果tag的参数为空，即tag()，则表示不论tag名称是什么都执行，与buildingTag的效果相同。

- `not` 当嵌套条件为false时执行阶段。必须包含一个条件。

    ```
    when { 
      not { 
        branch 'master' 
      }
    }
    ```

- `allOf` 当所有嵌套条件都为真时执行。必须至少包含一个条件。

    ```
    when { 
      allOf { 
        branch 'master'
        environment name: 'DEPLOY_TO', value: 'production' 
      }
    }
    ```

- `anyOf`  当至少一个嵌套条件为真时执行。必须至少包含一个条件。

    ```
    when {
      anyOf {
        branch 'master'
        branch 'staging'
      }
    }
    ```
    
- `triggeredBy` 当给定的参数触发当前构建时，执行该阶段。
    ```
    when { triggeredBy 'SCMTrigger' }

    when { triggeredBy 'TimerTrigger' }

    when { triggeredBy 'UpstreamCause' }

    when { triggeredBy cause: "UserIdCause", detail: "vlinde" }
    ```

- 在进入agent阶段前的when

  默认情况下，如果定义了某个阶段的agent，则在进入该阶段的agent后将对该阶段的when条件进行评估。但是，可以通过在when块中指定beforeAgent选项来更改这一点。如果beforeAgent设置为true，那么将首先计算when条件，并且只有当when条件计算为true时才会进入agent。 

- 在进入input步骤前的when

   默认情况下，如果定义了输入条件，则在input之前不会计算阶段的when条件。但是，可以通过在when块中指定beforeInput选项来更改这一点。如果beforeInput设置为true，那么将首先计算when条件，并且只有当when条件计算为true时才会进入input。 

- 在进入options步骤前的when

  默认情况下，如果定义了某个阶段的options，那么将在进入该阶段的options后计算该阶段的when条件。但是，可以通过在when块中指定beforeOptions选项来更改这一点。如果beforeOptions设置为true，那么将首先计算when条件，并且只有当when条件计算为true时才会进入这些options。


## 高级 {.cols-2}

### 阶段嵌套

声明式管道中的阶段可以有一个`stages`部分，其中包含一系列按顺序运行的嵌套阶段。请注意，一个阶段必须有且只有一个`steps`、`stages`、`parallel`或`matrix`。如果`stage`指令嵌套在一个`parallel`或`matrix`块本身中，则不可能在一个`stage`指令中嵌套一个`parallel`或`matrix`块。然而，在`parallel`或`matrix`块中的阶段指令可以使用`stage`的所有其他功能，包括`agent`、`tools`、`when`等。 

```
pipeline {
    agent none
    stages {
        stage('Non-Sequential Stage') {
            agent {
                label 'for-non-sequential'
            }
            steps {
                echo "On Non-Sequential Stage"
            }
        }
        stage('Sequential') {
            agent {
                label 'for-sequential'
            }
            environment {
                FOR_SEQUENTIAL = "some-value"
            }
            stages {
                stage('In Sequential 1') {
                    steps {
                        echo "In Sequential 1"
                    }
                }
                stage('In Sequential 2') {
                    steps {
                        echo "In Sequential 2"
                    }
                }
                stage('Parallel In Sequential') {
                    parallel {
                        stage('In Parallel 1') {
                            steps {
                                echo "In Parallel 1"
                            }
                        }
                        stage('In Parallel 2') {
                            steps {
                                echo "In Parallel 2"
                            }
                        }
                    }
                }
            }
        }
    }
}
```

### 并行构建

声明性管道中的阶段可以有一个并行(`parallel`)部分，其中包含要并行运行的嵌套阶段的列表。请注意，一个阶段必须有且只有一个`steps`、`stages`、`parallel`或`matrix`。如果`stage`指令嵌套在一个`parallel`或`matrix`块本身中，则不可能在一个`stage`指令中嵌套一个`parallel`或`matrix`块。然而，在`parallel`或`matrix`块中的`stage`指令可以使用阶段的所有其他功能，包括`agent`、`tools`、`when`等。 

此外，通过添加选项` failFast true ` 或`options {parallelsAlwaysFailFast()}`，使您可以在任何一个阶段失败时强制终止所有阶段

```
pipeline {
  agent none
  stages {
    stage('Run Tests') {
      failFast true
      parallel {
        stage('Test On Chrome') {
          agent { label "chrome" }
          steps {
            echo "Chrome UI测试"
          }
        }
        stage('Test On Firefox') {
          agent { label "firefox" }
          steps {
            echo "Firefox UI测试"
          }
        stage('Test On IE') {
          agent { label "ie" }
          steps {
            echo "IE UI测试"
          }
        }
      }// end of parallel
    } // end of run tests
  } // end of stages
} // end of pipeline
```

并行步骤

```
stage('并行构建') {
  steps {
    parallel(
      jdk8: {
        echo jdk8 build"
      },
      jdk9: {
        echo "jdk9 build"
      }
    )
  }
} 
```

并行阶段运行在不同的executor上，而并行步骤运行在同一个executor上。

### 矩阵

声明性管道中的阶段可以有一个矩阵部分，它定义了一个多维矩阵，其中包含要并行运行的名称-值组合。我们将这些组合称为矩阵中的"细胞"。矩阵中的每个单元可以包括一个或多个阶段，使用该单元的配置按顺序运行。 请注意，一个阶段必须有且只有一个`steps`、`stages`、`parallel`或`matrix`。如果`stage`指令嵌套在一个`parallel`或`matrix`块本身中，则不可能在一个`stage`指令中嵌套一个`parallel`或`matrix`块。然而，在`parallel`或`matrix`块中的`stage`指令可以使用阶段的所有其他功能，包括`agent`、`tools`、`when`等。 

此外，通过添加选项` failFast true ` 或`options {parallelsAlwaysFailFast()}`，使您可以在任何一个阶段失败时强制终止所有阶段

矩阵部分必须包括`axes`部分和`stages`部分。`axes`部分定义了矩阵中每个`axis`的值。`stage`部分定义了在每个单元中依次运行的阶段列表。 一个矩阵可以有一个`excludes`部分来从矩阵中移除无效的单元。 

```
pipeline {
    parameters {
        choice(name: 'PLATFORM_FILTER', choices: ['all', 'linux', 'windows', 'mac'], description: 'Run on specific platform')
    }
    agent none
    stages {
        stage('BuildAndTest') {
            matrix {
                agent {
                    label "${PLATFORM}-agent"
                }
                when { anyOf {
                    expression { params.PLATFORM_FILTER == 'all' }
                    expression { params.PLATFORM_FILTER == env.PLATFORM }
                } }
                axes {
                    axis {
                        name 'PLATFORM'
                        values 'linux', 'windows', 'mac'
                    }
                    axis {
                        name 'BROWSER'
                        values 'firefox', 'chrome', 'safari', 'edge'
                    }
                }
                excludes {
                    exclude {
                        axis {
                            name 'PLATFORM'
                            values 'linux'
                        }
                        axis {
                            name 'BROWSER'
                            values 'safari'
                        }
                    }
                    exclude {
                        axis {
                            name 'PLATFORM'
                            notValues 'windows'
                        }
                        axis {
                            name 'BROWSER'
                            values 'edge'
                        }
                    }
                }
                stages {
                    stage('Build') {
                        steps {
                            echo "Do Build for ${PLATFORM} - ${BROWSER}"
                        }
                    }
                    stage('Test') {
                        steps {
                            echo "Do Test for ${PLATFORM} - ${BROWSER}"
                        }
                    }
                }
            }
        }
    }
}
```



## 具体步骤

### 文件目录相关 {.row-span-2}

- `deleteDir`：删除当前目录deleteDir是一个无参步骤，删除的是当前工作目录。通常它与dir步骤一起使用，用于删除指定目录下的内容。

- `dir`：切换到目录默认pipeline工作在工作空间目录下，dir步骤可以让我们切换到其他目录。

    ```
    dir('/var/logs'){
      deleteDir()
    }
    ```

- `fileExists`：判断文件是否存在fileExists（'/tmp/a.jar'）判断/tmp/a.jar文件是否存在。如果参数是相对路径，则判断在相对当前工作目录下，该文件是否存在。结果返回布尔类型。

- `isUnix`：判断是否为类UNIX系统如果当前pipeline运行在一个类UNIX系统上，则返回true。

- `pwd`：确认当前目录pwd与Linux的pwd命令一样，返回当前所在目录。它有一个布尔类型的可选参数：tmp，如果参数值为true，则返回与当前工作空间关联的临时目录。

- `writeFile`：将内容写入指定文件中writeFile支持的参数有：

  - file：文件路径，可以是绝对路径，也可以是相对路径。

  - text：要写入的文件内容。

  - encoding（可选）：目标文件的编码。如果留空，则使用操作系统默认的编码。如果写的是Base64的数据，则可以使用Base64编码。

-  `readFile`：读取文件内容读取指定文件的内容，以文本返回。readFile支持的参数有：

    - file：路径，可以是绝对路径，也可以是相对路径。

    - encoding（可选）：读取文件时使用的编码。

    ```
    script{
      //"amVua2lucyBib29r" 是"jenkins book" 进行Base64编码后的值
      writeFile(file:"base64File", text:"amVua2lucyBib29r"，encoding: "Base64")
      def content = readFile(file: 'base64File', encoding: 'UTF-8')
      echo "${ content}"
      //打印结果: jenkins book
    }
    ```

### 制品相关  {.row-span-2}

- `stash`：保存临时文件stash步骤可以将一些文件保存起来，以便被同一次构建的其他步骤或阶段使用。如果整个pipeline的所有阶段在同一台机器上执行，则stash步骤是多余的。

  所以，通常需要stash的文件都是要跨Jenkins node使用的。关于Jenkins node的相关概念，我们会在第14章中进行介绍。stash步骤会将文件存储在tar文件中，对于大文件的stash操作将会消耗Jenkins master的计算资源。Jenkins官方文档推荐，当文件大小为5∼100MB时，应该考虑使用其他替代方案。

  stash步骤的参数列表如下：
    - name：字符串类型，保存文件的集合的唯一标识。
    - allowEmpty：布尔类型，允许stash内容为空。
    - excludes：字符串类型，将哪些文件排除。如果排除多个文件，则使用逗号分隔。留空代表不排除任何文件。
    - includes：字符串类型，stash哪些文件，留空代表当前文件夹下的所有文件。
    - useDefaultExcludes：布尔类型，如果为true，则代表使用Ant风格路径默认排除文件列表。
	除了name参数，其他参数都是可选的。excludes和includes使用的是Ant风格路径表达式。在3.7.5节中将简单介绍该表达式写法。

- `unstash`：取出之前stash的文件unstash步骤只有一个name参数，即stash时的唯一标识。通常stash与unstash步骤同时使用。以下是完整示例。

    ```
    pipeline {
      agent none
      stages {
        stage('stash') {
          agent { label "master" }
          steps {
            writeFile file: "a. txt", text: "$BUILD_NUMBER"
            stash(name: "abc", includes: "a.txt")
          }

        stage('unstash') {
          agent { label "node2" }
          steps {
            script{
              unstash("abc")
              def content = readFile("a.txt")
              echo "${content}"
             }
           }
         }
       }
    }

    ```
    
    stash步骤在master节点上执行，而unstash步骤在node2节点上执行。

### 命令相关

- `sh`：执行shell命令

	sh步骤支持的参数有：

    - script：将要执行的shell脚本，通常在类UNIX系统上可以是多行脚本。

    - encoding：脚本执行后输出日志的编码，默认值为脚本运行所在系统的编码。

    - returnStatus：布尔类型，默认脚本返回的是状态码，如果是一个非零的状态码，则会引发pipeline执行失败。如果returnStatus参数为true，则不论状态码是什么，pipeline的执行都不会受影响。

    - returnStdout：布尔类型，如果为true，则任务的标准输出将作为步骤的返回值，而不是打印到构建日志中（如果有错误，则依然会打印到日志中）。

	除了script参数，其他参数都是可选的。returnStatus与returnStdout参数一般不会同时使用，因为返回值只能有一个。如果同时使用，则只有returnStatus参数生效。

- `bat` 步骤执行的是Windows的批处理命令。

- `powershell` 步骤执行的是PowerShell脚本


### 自动化

#### ansible

https://plugins.jenkins.io/ansible

```
steps {
  ansiblePlaybook colorized: true, extras: '-e exvar=t', inventory: '/etc/ansible.hosts', limit: 'test', playbook: '/root/playbook.yaml'
}
```


### 构建工具

#### maven

```
pipeline {
   agent any
   tools {
      maven "mvn-3.5.4"
   }
   stages {
      stage('Build') {
         steps {
            sh "mvn -Dmaven.test.failure.ignore=true clean package"
         }
      }
   }
}
```

使用mvn的配置文件

```
configFileProvider( [configFile(fileId: 'maven-global-settings', variable: 'MAVEN_GLOBAL_ENV')]) {
  sh "mvn -s $MAVEN_GLOBAL_ENV clean install"
}
```

#### go

```
pipeline {
  agent any
  environment {
    GOPATH = "${env WORKSPACE}/"
  }
  tools {
    go ' go1.10'
  }
  stages {
    stage( 'build') {
      steps {
        sh "go build"
      }
    }
  }
}
```

#### python

使用pyenv

```
withPythonEnv('/usr/bin/python') {
  sh 'python --version'
}

```

#### 利用环境变量来支持更多的构建工具

```
pipeline {
  agent any
  environment {
    PATH="/usr/lib/customtool/bin:$PATH"
    CUSTOM_PATH="/usr/lib/customtool/bin"
  }
  stages {
    stage('build') {
      steps {
        sh "customtool build"
        sh "${CUSTOM_PATH}/customtool build"
      }
    }
  }
}
```

#### 利用tools作用域实现多版本编译

```
pipeline {
  agent any
  stages{
    stage("build with jdk- 10.0.2"){
      tools {
        jdk "jdk - 10. 0.2"
      }
      steps{
        sh "printenv"
      }
    }
    stage("build with jdk-9.0.4"){
      tools {
        jdk "jdk-9. 0.4"
      }
      steps{
        sh "printenv"
      }
    }
  }
}
```

### 代码质量

#### pmd

https://pmd.github.io/

```
post {
  always{
    pmd(canRunOnFailed: true, pattern: '**/target/pmd.xml' )
  }
}
```

#### junit

https://plugins.jenkins.io/junit

```
post {
  always{
    junit testResults: "**/target/surefire-reports/*.xml"
  }
}
```

#### JaCoCo 

https://plugins.jenkins.io/jacoco

```
steps{
  sh "mvn clean install"
  jacoco(
    //代码覆盖率统计文件位置,Ant风格路径表达式
    execPattern: 'target/**/*.exec',
    // classes文件位置,Ant风格路径表达式
    classPattern: 'target/classes',
    //源码文件位置,Ant风格路径表达式
    sourcePattern: 'src/main/java',
    // 排除分析的位置,Ant风格路径表达式
    exclusionPattern: 'src/test*',
    //是否禁用每行覆盖率的源文件显示
    skipCopyOfSrcFiles: false,
    //如果为true,则对各维度的覆盖率进行比较。如果任何一个维度的当前覆盖率小于最小覆盖率阙值,则构建状态为失败
    //如果当前覆盖率在最大闽值和最小阅值之间,则当前构建状态为不稳定:如果当前覆盖率大于最大阅值,则构建成功
    changeBuildStatus: true,
    //字节码指令覆盖率
    minimumInstructionCoverage: '30', maximumInstructionCoverage:'70',
    //行覆盖率
    minimumLineCoverage: '30', maximumLineCoverage: '70',
    //圈复杂度覆盖率
    minimumComplexityCoverage: '30', maximumComplexityCoverage: '70',
    //方法覆盖率
    minimunMethodCoverage: '30', maximumMethodCoverage:'70',
    //类覆盖率
    minimumClassCoverage:'30', maximumClassCoverage: '70',
    //分支覆盖率
    minimumBranchCoverage:'30', maximumBranchCoverage:'70' ,
    //如果为true,则只有所有维度的覆盖率变化量的绝对值小于相应的变化量阈值时,构建结果才为成功
    buildoverBuild: true,
    //以下是各个维度覆盖率的变化量阈值
    deltaInstructionCoverage: '80', deltaLineCoverage: '80',
    deltaMethodCoverage: '80', deltaClassCoverage: '80',
    deltaComplexityCoverage: '80', deltaBranchCoverage: '80'
  }
}
```

#### Taurus

https://plugins.jenkins.io/performance

```
pipeline {
  agent any
  stages {
    stage('performance test') {
      steps {
        bzt params: 'blaze_exist_jmeter_config.yml
      }
    }
  }
}
```

#### SonarQube

https://plugins.jenkins.io/sonar

```
script{
  def sonarHome = tool name: 'sonarqube3.2.0', type: 'hudson.plugins.sonar.SonarRunnerInstallation'
  withSonarQubeEnv('sonar') {
    sh "${sonarHome}/bin/sonar-scanner -Dsonar.host.url=${SONAR_HOSTURL} -Dsonar.login=${SONAR_AUTH_TOKEN}"
  }
}

```
#### allure

https://plugins.jenkins.io/allure-jenkins-plugin

```
script {
  allure([
    includeProperties: false,
    jdk: '',
    properties: [],
    reportBuildPolicy: 'ALWAYS',
    results: [[path: 'target/allure-results' ]]
  ])
}

```

### 凭据使用

#### withCredentials

- **Secret text** 是一串需要保密的文本

```
withCredentials( [string( credentialsId: 'secretText', variable: 'varName')]) {
  echo "${varName}"
}
```

- **Username with password** 指用户和密码凭证。

```
withCredentials([usernamePassword(credentialsId: "git1ab-userpwd-pair', usernameVariable: 'username',passwordVariable:' passwd')]){
  echo "${username}, ${passwd}"
}
```

- **Secret file** 指需要保密的文本文件

使用Secret file时，Jenkins会将文件复制到一个临时目录中，再将文件路径设置到一个变量中。构建结束后，所复制的Secret file会被删除。

```
withCredentials( [file(credentialsId: 'ansible-vault-password', variable: 'vault')]){
  sh "ansible -i hosts playbook.yml --vault-password-file=${vault}"
}
```

- **SSH Username with private key** 指一对SSH用户名和密钥。

```
withCredentials([sshUserPrivateKey(
                 keyFileVariable:"key",
                 credentialsId:"private-key")]){
   echo "${key}"
}
```

通过环境变量来使用凭证

credentials helper方法只支持Secret text、Username with password、Secretfile三种凭证。

```
environment {
  AWS_ACCESS_KEY_ID = credentials('aws-secret-key-id')
  AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key')
}
```

#### HashiCorp Vault

https://plugins.jenkins.io/hashicorp-vault-plugin

https://github.com/jenkinsci/hashicorp-vault-pipeline-plugin

```
pipeline {
  agent any
  environment {
    SECRET = vault path: 'secret/hello', key: 'value'
  }
  stages {
    stage("read vault key") {
      steps {
        script{
          def x = vault path: 'secret/hello', key: 'value'
          echo "${x}"
          echo "${SECRET}"
        }
      }
    }
  }
}
```

### 隐藏敏感信息

如果使用的是credentials helper方法或者withCredentials步骤为变量赋值的，那么这个变量的值是不会被明文打印到Jenkins日志中的。

```
steps {
  script{
    def hack = 'hack it'
    withCredentials([string(credentialsId: 'abc', variable: 'secretText')]) {
      echo "${secretText}" //打印 ****
      hack = "${secretText}"
  }
  echo "${hack}" //打印出明文: test
}

```

#### Masked Pass-word

https://plugins.jenkins.io/mask-passwords

```
pipeline {
  agent any
  environment {
    SECRET1 = "secret1"
    SECRET2 = "secret2"
    NOT_ SECRET = "no secret"
  }
  stages {
    stage("read vault key") {
      steps {
        wrap([$class: 'MaskPasswordsBuildWrapper', varPasswordPairs: [
           [password: env['SECRET1'], var: 's1'],
           [password: env['SECRET2'], var: 's2']]]
        ){
           echo "被隐藏的密文: ${SECRET1}和${SECRET2}"
           echo "secret1" // 这也会被隐藏，打印成********
           echo "明文打印: ${NOT_ SECRET}"
        }
      }
    }
  }
}

```

### 制品库

#### archiveArtifacts

```
post {
  always {
    archiveArtifacts allowEmptyArchive: true, artifacts: 'file.tgz', fingerprint: true, onlyIfSuccessful: true
  }
}
```

#### nexus

https://plugins.jenkins.io/nexus-jenkins-plugin

```
stage('Build') {
  steps {
    sh "mvn clean test package"
    nexusPublisher(
      nexus InstanceId: 'nexus3',
      nexusRepositoryId:'maven-releases',
      packages:[
        [
        $class: ' MavenPackage',
        mavenAssetList:[
          [classifier:
            extension:'',
            filePath: './target/server-1.0-SNAPSHOT.jar'
          ],// end of mavenAssetList
        mavenCoordinate:[
          artifactId: 'server',
          groupId: 'codes.showme',
          packaging: 'jar', version: '1.0'
        ] // end of packages
     ])
  }
}
```

#### docker

```
pipeline {
  agent any
  environment {
    registry = "http://192.168.0.101:8595"
    registryCredential = 'dockernexus'
  }
  stages {
    stage('Build') {
      steps {
        withDockerRegistry([ credentialsId: "${registryCredential}", url: "${registry}" ]) {
            sh "docker build . -t ${registry}/he1lo:v2"
            sh "docker push ${registry}/hello:v2"
        }
      }
    }
  }
}

```

#### Copy Artifact

从其他pipeline中拷贝制品

https://plugins.jenkins.io/copyartifact

```
steps {
  copyArtifacts(
    projectName: "core",
    selector: lastSuccessful(true)
  )
}
```


### 通知

#### Email

```
post {
    failure {
        mail to: 'team@example.com',
             subject: "Failed Pipeline: ${currentBuild.fullDisplayName}",
             body: "Something is wrong with ${env.BUILD_URL}"
    }
}
```

#### email-ext

https://plugins.jenkins.io/email-ext

```
post {
  failure {
    emailext body:
      ""<p>EXECUTED: Job <b>\' ${env.J0B_NAME}:${env.BUILD_NUMBER})\'
      </b></p><p>View console output at "<a href="${env.BUILD.URL}">
      ${env.JOB_NAME }:${env.BUILD_NUMBER}</a>"</p>
      <p><i>(Build log is attached.)</i></p>"",
      compresslog: true,
      attachLog: true ，
      recipientProviders: [culprits(), developers()， requestor() ，brokenBuildSuspects()],
      replyTo: 'do-not-rep1y@company.com'，
      subject: "Status: ${currentBuild.result?: 'SUCCESS'} - Job \'${env.JOB_NAME}:${env.BUILD_NUMBER}\'",
      to: "jenkinsbooksample@163.com"
  }
}
```

#### 钉钉

https://plugins.jenkins.io/dingding-notifications

```
dingTalk accessToken: "<accessToken值>", imageUrl:"<钉钉群里显示消息的缩略图>", jenkinsUrl:
"<Jenkins的链接>", message: "<文本消息>", notifyPeople: ""李四"
```

#### HTTP Request

https://plugins.jenkins.io/http_request

```
steps {
  script{
    def response = httpRequest(url: 'http://192.168.88.3:8081',
                               acceptType:"APPLICATION JSON",
                               contentType: "APPLICATION_JSON",
                               httpMode: "POST",
                               authentication: "http_request",
                               customHeaders:[
                                 [name: "headername", value: "headerValue"],
                                 [name: "token", value:"secret", maskValue: true]
                               ],
                               requestBody: "{ 'buildNumber':'${env.BUILD_NUMBER}'}",
                               timeout: 5,
                               validResponseCodes: "200:302")
    echo "${response.status}"
    echo "${response.content}"
  }
}
```

### 其他步骤

- `error`：主动报错，中止当前pipelineerror 步骤的执行类似于抛出一个异常。

  它只有一个必需参数：message。通常省略参数：error（"there's an error"）。

- `waitUntil`：等待条件满足不断重复waitUntil块内的代码，直到条件为true。

  waitUntil不负责处理块内代码的异常，遇到异常时直接向外抛出。

  waitUntil步骤最好与timeout步骤共同使用，避免死循环。示例如下：

    ```
    timeout(50) {
      waitUntil {
        script {
          def r = sh script: 'curl http://exmaple', returnStatus: true
          return (r == 0)
        }
    }
    ```

- `retry`：重复执行块执行N 次闭包内的脚本。

  如果其中某次执行抛出异常，则只中止本次执行，并不会中止整个retry的执行。同时，在执行retry的过程中，用户是无法中止pipeline的。

  ```
  steps{
    retry(20){
      script{
        sh script: 'curl http://exmaple', returnStatus: true
      }
    } 
  }
  ```

- `sleep`：让pipeline休眠一段时间sleep步骤可用于简单地暂停pipeline，

  其支持的参数有：

  - time：整型，休眠时间。

  - unit（可选）：时间单位，支持的值有NANOSECONDS、MICROSECONDS、MILLISECONDS、SECONDS（默认）、MINUTES、HOURS、DAYS。

    ```
    sleep(120) //休眠120秒
    sleep(time:'2', unit:"MINUTES") //休眠2分钟
    ```

- `Workspace Cleanup`使用Workspace Cleanup插件清理空间通常，当pipeline执行完成后，并不会自动清理空间。如果需要（通常需要）清理工作空间，则可以通过Workspace Cleanup插件实现。
  1. 安装Workspace Cleanup插件（地址为https：//plugins.jenkins.io/ws-cleanup）。
  2. 在pipeline的post部分加入插件步骤。

    ```
  post{
      always {
      	cleanWs()
      }
  }
    ```

更多步骤  https://jenkins.io/doc/pipeline/steps/ 

## agent 节点

- 任意节点

    ```
    pipeline {
      agent any
    }
    ```

- 指定节点标签

    ```
    pipeline {
      agent {
        label 'jdk8'
      }
    }

    pipeline {
      agent {
        node {
          label 'jdk8'
          customWorkspacke '/tmp'
        }
      }
    }

    pipeline {
      agent {
        label 'windeos && jdk8'
      }
    }
    ```

- 不分配节点

    ```
    pipeline {
      agent none
      stages {
        stage('test') {
          agent { label 'mvn'}
          setps {
            echo "hi"
          }
        }
      }
    }
    ```

- docker 节点

    ```
    pipeline {
      agent {
        docker {
          label 'docker'
          image 'maven:3-alpine'
        }
      }
    }
    ```

## 脚本

### script

`script`步骤获取一个脚本化管道块，并在声明性管道中执行它。 脚本管道实际上是用Groovy构建的通用DSL 。

```
pipeline {
    agent any
    stages {
        stage('Example') {
            steps {
                echo 'Hello World'

                script {
                    def browsers = ['chrome', 'firefox']
                    for (int i = 0; i < browsers.size(); ++i) {
                        echo "Testing the ${browsers[i]} browser"
                    }
                }
            }
        }
    }
}
```


### 流程控制

```
node {
    stage('Example') {
        if (env.BRANCH_NAME == 'master') {
            echo 'I only execute on the master branch'
        } else {
            echo 'I execute elsewhere'
        }
    }
}
```

### try/catch

```
node {
    stage('Example') {
        try {
            sh 'exit 1'
        }
        catch (exc) {
            echo 'Something failed, I should sound the klaxons!'
            throw
        }
    }
}
```
### 定义groovy函数

```
def createVersion(String BUILD_NUMBER) {
  return new Date().format('yyMM') + "-${BUILD_NUMBER}"
}

pipeline {
  agent any
  environment {
    _version = createVersion(BUILD_NUMBER)
  }
  stages {
    stage( 'Build') {
      steps {
        echo "${_version}" 
      }
    }
  }
}

```


## 示例 {.cols-2}

### java项目发布

https://github.com/jenkins-docs/simple-java-maven-app

```
pipeline {
    agent {
        docker {
            image 'maven:3-alpine'
            args '-v /root/.m2:/root/.m2'
        }
    }
    options {
        skipStagesAfterUnstable()
    }
    stages {
        stage('Build') {
            steps {
                sh 'mvn -B -DskipTests clean package'
            }
        }
        stage('Test') {
            steps {
                sh 'mvn test'
            }
            post {
                always {
                    junit 'target/surefire-reports/*.xml'
                }
            }
        }
        stage('Deliver') { 
            steps {
                sh './jenkins/scripts/deliver.sh' 
            }
        }
    }
}
```



### node.js项目发布

https://github.com/jenkins-docs/simple-node-js-react-npm-app

```
pipeline {
    agent {
        docker {
            image 'node:6-alpine'
            args '-p 3000:3000'
        }
    }
    environment { 
        CI = 'true'
    }
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                sh './jenkins/scripts/test.sh'
            }
        }
        stage('Deliver') { 
            steps {
                sh './jenkins/scripts/deliver.sh' 
                input message: 'Finished using the web site? (Click "Proceed" to continue)' 
                sh './jenkins/scripts/kill.sh' 
            }
        }
    }
}
```

### python项目发布

https://github.com/jenkins-docs/simple-python-pyinstaller-app

```
pipeline {
    agent none
    options {
        skipStagesAfterUnstable()
    }
    stages {
        stage('Build') {
            agent {
                docker {
                    image 'python:2-alpine'
                }
            }
            steps {
                sh 'python -m py_compile sources/add2vals.py sources/calc.py'
                stash(name: 'compiled-results', includes: 'sources/*.py*')
            }
        }
        stage('Test') {
            agent {
                docker {
                    image 'qnib/pytest'
                }
            }
            steps {
                sh 'py.test --junit-xml test-reports/results.xml sources/test_calc.py'
            }
            post {
                always {
                    junit 'test-reports/results.xml'
                }
            }
        }
        stage('Deliver') { 
            agent any
            environment { 
                VOLUME = '$(pwd)/sources:/src'
                IMAGE = 'cdrx/pyinstaller-linux:python2'
            }
            steps {
                dir(path: env.BUILD_ID) { 
                    unstash(name: 'compiled-results') 
                    sh "docker run -v ${VOLUME} ${IMAGE} 'pyinstaller -F add2vals.py'" 
                }
            }
            post {
                success {
                    archiveArtifacts "${env.BUILD_ID}/sources/dist/add2vals" 
                    sh "docker run -v ${VOLUME} ${IMAGE} 'rm -rf build dist'"
                }
            }
        }
    }
}
```

### 多分支构建

```
pipeline {
    agent {
        docker {
            image 'node:6-alpine'
            args '-p 3000:3000 -p 5000:5000'
        }
    }
    environment {
        CI = 'true'
    }
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                sh './jenkins/scripts/test.sh'
            }
        }
        stage('Deliver for development') {
            when {
                branch 'development' 
            }
            steps {
                sh './jenkins/scripts/deliver-for-development.sh'
                input message: 'Finished using the web site? (Click "Proceed" to continue)'
                sh './jenkins/scripts/kill.sh'
            }
        }
        stage('Deploy for production') {
            when {
                branch 'production'  
            }
            steps {
                sh './jenkins/scripts/deploy-for-production.sh'
                input message: 'Finished using the web site? (Click "Proceed" to continue)'
                sh './jenkins/scripts/kill.sh'
            }
        }
    }
}
```



更多资源
------

- [官方例子](https://jenkins.io/doc/pipeline/examples/)
- [Pipeline 语法](https://jenkins.io/doc/book/pipeline/syntax/)
- [片段生成](http://localhost:8080/job/pipeline_job/pipeline-syntax)
- [Groovy 速查表](https://quickref.leops.cn/groovy.html)