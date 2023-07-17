# 安装

> [installation.md](https://github.com/deployphp/deployer/blob/master/docs/installation.md)
> <br>
> commit 29ea4359161d1c30346f2037c4062fc165bc5308

安装 Deployer，在项目目录中执行如下命令：

```
composer require --dev deployer/deployer
```

在项目内运行如下命令去初始化 deployer：

```
vendor/bin/dep init
```

:::tip Bash 集成
添加下面的别名到 _.bashrc_ 文件：

```bash
alias dep='vendor/bin/dep'
```

Deployer 带有对任务名称、选项和主机的自动完成支持。

运行以下命令以添加 bash 补全支持：

```
dep completion bash > /etc/bash_completion.d/deployer
```

确保 _.bashrc_ 文件包含以某种方式生成的文件。
:::