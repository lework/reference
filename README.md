# Reference

[![love](https://badgen.net/badge/make%20with/love/pink)](#)
[![License](https://badgen.net/badge/license/MIT/blue)](https://github.com/lework/reference/blob/main/LICENSE)
[![contributors](https://badgen.net/github/contributors/lework/reference)](https://github.com/lework/reference/graphs/contributors)
[![forks](https://badgen.net/github/forks/lework/reference)](https://github.com/lework/reference/network/members)
[![starts](https://badgen.net/github/stars/lework/reference)](#)



专为运维人员而分享的速查表(备忘单)，目的是为了方便运维小伙伴在日常工作中查阅。

很高兴在**备忘单**中看到你的最佳技能速查表，如果您看到这里的速查表不合适，您可以通过提交[PR](#contributing)来修复它或提供更好的速查表。

本仓库由 [Reference](https://github.com/Fechin/reference) 而来。在此感谢 [Fechin](https://github.com/Fechin)。

## Live Demo

[https://lework.github.io/reference](https://lework.github.io/reference)



## Directory structure
```
.
├── source
│   ├── _posts   # Cheatsheet source files
│   │   ├── awk.md
│   │   ├── vim.md # => https://quickref.leops.cn/vim
│   │   ├── php.md
│   │   ├── css.md # => https://quickref.leops.cn/css
│   │   ├── ...
│   └── widget   # Widget files
│       └── chmod.html
├── public       # Distribution files
├── _config.yml
├── gulpfile.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── themes
    └── coo      # Theme files
```

## Contributing

感谢你对备忘单的贡献，正是你这样的人使[quickref.leops.cn](https://quickref.leops.cn)成为一个了不起的网站🎉。请随时[提交问题](https://github.com/lework/reference/issues/new?assignee=leops)和改进请求。

**参考[QuickRef Cheatsheet](https://quickref.leops.cn/quickref)** 的速查表是个不错的做法

### Development setup

1. Clone Github repo `git clone https://github.com/lework/reference.git`
2. Install `npm` package manager (Read [installation guide](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm))
3. Run `npm install` in the root folder to install dependencies.
4. Run `npm run dev` to start a dev server. This serves the project and live reloads when any files are changed, then visit http://127.0.0.1:4000 preview.
5. Send us pull request and chill.

A `source/_posts/{filename}.md` file will be processed into a cheat sheet, let's create or edit a markdown file:

### Front Matter
```markdown
---
title: QuickRef
date: 2020-11-25 18:28:43
icon: icon-style
background: bg-emerald-600
tags:
categories:
- Other
  intro: This is a reference of styles that you can use on quickref cheatsheets!
---
```
Just need `title` and `intro`, and ignore other options. I will complete it if it can be released.

### CSS classes
QuickRefs uses [markdown-it-attrs](https://github.com/arve0/markdown-it-attrs) and supports adding classes via its syntax. Also, there is a reference of styles that you can use on `quickref.leops.cn` cheat sheets:  https://quickref.leops.cn/quickref


<a href="https://github.com/lework/reference/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=lework/reference" />
</a>



## License
[MIT](https://github.com/lework/reference/blob/main/LICENSE) © [lework](https://github.com/lework)

