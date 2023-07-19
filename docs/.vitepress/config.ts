import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Deployer",
  ignoreDeadLinks: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '文档', link: '/getting-started.md' },
      { text: "Recipes", link: "/recipe/" },
      { text: "贡献", link: "/contrib/"}
    ],

    sidebar: [
      {
        text: "安装",
        link: "/installation.md"
      },
      {
        text: '入门',
        link: "/getting-started.md"
      },
      {
        text: "基础", link: "/basics.md"
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/mowangjuanzi/deplyer-doc-zh.git' }
    ]
  }
})
