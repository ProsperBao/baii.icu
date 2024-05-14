---
title: 项目 - ProsperBao
display: Projects
subtitle: 我参加的一些项目或挑战，虽然不多。
description: 我参加的一些项目或挑战，虽然不多。
projects:
  进行中:
    - name: 'Baii.icu'
      link: 'https://github.com/ProsperBao/baii.icu'
      desc: '这个博客'
      icon: 'i-carbon-edit'
    - name: 'SourceCodeReading'
      link: '/challenges/source'
      desc: '阅读源代码的挑战'
      icon: 'i-carbon-bot'
    - name: 'RestraintAlmanac'
      link: 'https://github.com/ProsperBao/restraint-almanac'
      desc: '自律人黄历'
      icon: 'i-carbon:floating-ip'
  挑战:
    - name: 'TypeChallenges'
      link: '/challenges/type'
      desc: '已经挑战完成的 Typescript 挑战'
      icon: 'i-carbon-ai-results-high'
  维护中:
    - name: 'Bookmark'
      link: '/bookmark'
      desc: '这些是我觉得有意思的东西'
      icon: 'i-carbon:bookmark'
    - name: 'DstCloudManage'
      link: 'https://github.com/ProsperBao/dst-cloud-manage'
      desc: '一个饥荒服务器管理工具'
      icon: 'i-carbon-cloud-services'
    - name: 'EpubReading'
      link: 'https://github.com/ProsperBao/epub-reading'
      desc: '一个自带翻译功能的小说阅读器'
      icon: 'i-carbon-book'
---

<list-projects :projects="frontmatter.projects"></list-projects>
