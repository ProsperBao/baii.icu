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
  挑战:
    - name: 'TypeChallenges'
      link: '/posts/challenges/type'
      desc: '已经挑战完成的 Typescript 挑战'
      icon: 'i-carbon-ai-results-high'
  维护中:
    - name: 'DstCloudManage'
      link: 'https://github.com/FuBaooo/dst-cloud-manage'
      desc: '一个饥荒服务器管理工具'
      icon: 'i-carbon-cloud-services'
---

<ListProjects :projects="frontmatter.projects"/>