hexo.extend.helper.register("request_cheatsheet", function () {
    return `${this.config.github}/issues/new?title=Cheatsheet+request%3A+&labels=request&template=cheatsheet-request.md&assignee=Lework`;
});

hexo.extend.helper.register("contributing", function () {
    return `${this.config.github}/blob/main/README.md#contributing`;
});


hexo.extend.helper.register("edit_page", function () {
    return `${this.config.github}/blob/main/source/_posts/${this.page.slug}.md`
});

hexo.extend.helper.register("github_url", function () {
  return `${this.config.github}`
});