import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "deployer",
  ignoreDeadLinks: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
    ],

    sidebar: [
      {
        text: "安装",
        link: "/installation.md"
      },
      {
        text: '入门',
        link: "/getting-started.md"
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/mowangjuanzi/deplyer-doc-zh.git' }
    ]
  }
})
