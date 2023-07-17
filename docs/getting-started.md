# 入门

> [getting-started.md](https://github.com/deployphp/deployer/blob/master/docs/getting-started.md)
> <br>
> commit e0b59ec6685b3b9a8bccd1e9735d5798f48240e9

本教程中将介绍如下内容：

- 使用提供的 provision 设置新主机。
- 配置部署并执行第一次调度。

首先, [安装 Deployer](installation.md):

现在切换到项目并运行下列命令：

```sh
dep init
```

Deployer 将询问几个问题，完成后将会有 **deploy.php** 或 **deploy.yaml**
文件。这是部署脚本。包含主机，任务和需要的其它脚本。Deployer 带有所有框架的脚本并且全部基于
[common](recipe/common.md) 脚本。

## Provision

:::info 注意
如果有配置好的 Web 服务器，可以直接跳过[部署](#deploy)步骤。
:::

在 Linode、DigitalOcean、Vultr、AWS、GCP 等等上创建新的 VPS。

请确保使用的镜像是 **Ubuntu 20.04 LTS**，因为这个版本是借助 Deployer [provision](recipe/provision.md) 脚本提供支持。

:::tip
在服务器上配置反向 DNS 或 RDNS。这将允许服务器使用域名而不是 IP 地址使用 SSH 登录。
:::

**deploy.php** 脚本包含使用一些重要参数定义的主机：

- `remote_user` ssh 连接的用户名，
- `deploy_path` 将要调用的主机路径。

将 `remote_user` 设置为 `deployer`。目前，新服务器可能只有 `root` 用户。provision 脚本将创建并配置 `deployer` 用户。

```php
host('example.org')
    ->set('remote_user', 'deployer')
    ->set('deploy_path', '~/example');
```

连接到远程主机需要指定身份密钥或者私钥。需要直接添加身份密钥到主机定义中，但最好将其放到 **~/.ssh/config** 文件：

```
Host *
  IdentityFile ~/.ssh/id_rsa
```

现在开始配置服务器。当主机没有用户 `deployer`，使用 `-o remote_user=root` 重写 provision 的 `remote_user`。

```sh
dep provision -o remote_user=root
```

:::tip
如果服务器没有 `root` 用户，但您的远程用户可以使用 `sudo` 成为 `root`，则使用：

```sh
dep provision -o become=root
```

:::

在配置期间，Deployer 会询问几个问题：php 版本、数据库类型等等。接下来 Deployer 将会配置服务器并创建 `deployer`
用户。Provision 大约需要 **5 分钟**，将会安装好运行网站需要的一切。新网站将配置在
[deploy_path](recipe/common.md#deploy_path)。

配置完网络服务器后，开始部署项目。

## Deploy

部署项目：

```sh
dep deploy
```

如果部署失败，Deployer 将打印错误消息以及哪个命令不成功。很可能需要在 _.env_ 文件或类似文件中配置正确的数据库凭据。

Ssh 到主机，例如，用于编辑 _.env_：

```sh
dep ssh
```

:::tip
如果你的 web 服务器使用的 OpenSSH 版本低于 v7.6, 更新代码可能会失败并有错误消息
`unsupported option "accept-new"`。这时需要用如下重写 Git SSH 命令：
```php
set('git_ssh_command', 'ssh');
```
:::

正确配置所有内容后，可以从停止的位置恢复部署。然而，这不是必需的；可以从新的部署开始：

```
dep deploy --start-from deploy:migrate
```

第一次成功部署后，可以在服务器上找到以下目录结构：

```
~/example                      // deploy_path。
 |- current -> releases/1      // 当前版本的符号链接。
 |- releases                   // 所有版本的目录。
    |- 1                       // 实际文件位置。
       |- ...
       |- .env -> shared/.env  // 共享 .env 文件的符号链接。
 |- shared                     // 版本间共享文件的目录。
    |- ...
    |- .env                    // 示例：共享 .env 文件。
 |- .dep                       // Deployer 配置文件。
```

配置网络服务器以服务 `current` 目录。例如，nginx：

```
root /home/deployer/example/current/public;
index index.php;
location / {
    try_files $uri $uri/ /index.php?$query_string;
}
```

如果使用 provision 脚本，Deployer 将自动配置 Caddy Web 服务器从 [public_path](/recipe/provision/website.md#public_path) 提供服务。

现在在主机上添加构建步骤：

```php
task('build', function () {
    cd('{{release_path}}');
    run('npm install');
    run('npm run prod');
});

after('deploy:update_code', 'build');
```

Deployer 有一个有效的任务就是用来检查当前部署的内容。

```
$ dep releases
task releases
+---------------------+--------- deployer.org -------+--------+-----------+
| Date (UTC)          | Release     | Author         | Target | Commit    |
+---------------------+-------------+----------------+--------+-----------+
| 2021-11-05 14:00:22 | 1 (current) | Anton Medvedev | HEAD   | 943ded2be |
+---------------------+-------------+----------------+--------+-----------+
```

:::tip
部署期间，[dep push](recipe/deploy/push.md) 任务也许有用。
:::