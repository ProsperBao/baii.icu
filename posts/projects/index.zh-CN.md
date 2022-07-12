---
title: 项目 - FuBaooo
display: Projects
subtitle: 我参加的一些项目或挑战，虽然不多。
description: 我参加的一些项目或挑战，虽然不多。
projects:
  进行中:
    - name: 'Baii.icu'
      link: 'https://github.com/FuBaooo/baii.icu'
      desc: '这个博客'
      icon: 'i-carbon-edit'
    - name: 'ThroughMusic'
      link: 'https://github.com/AcrossMountains/ThroughMusic'
      desc: '一个模仿网易云的项目'
      icon: 'i-carbon-continue'
    - name: 'SourceCodeReading'
      link: '/challenges/source'
      desc: '阅读源代码的挑战'
      icon: 'i-carbon-bot'
  挑战:
    - name: 'TypeChallenges'
      link: '/challenges/type'
      desc: '已经挑战完成的 Typescript 挑战'
      icon: 'i-carbon-ai-results-high'
  维护中:
    - name: 'DstCloudManage'
      link: 'https://github.com/FuBaooo/dst-cloud-manage'
      desc: '一个饥荒服务器管理工具'
      icon: 'i-carbon-cloud-services'
    - name: 'EpubReading'
      link: 'https://github.com/FuBaooo/epub-reading'
      desc: '一个自带翻译功能的小说阅读器'
      icon: 'i-carbon-book'
---

<list-projects :projects="frontmatter.projects"></list-projects>
