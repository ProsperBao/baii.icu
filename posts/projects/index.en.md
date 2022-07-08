---
title: Projects - FuBaooo
display: Projects
subtitle: I participated in some projects or challenges, although not many.
description: I participated in some projects or challenges, although not many.
projects:
  Ongoing:
    - name: 'Baii.icu'
      link: 'https://github.com/FuBaooo/baii.icu'
      desc: 'this blog'
      icon: 'i-carbon-edit'
    - name: 'EpubReading'
      link: 'https://github.com/FuBaooo/epub-reading'
      desc: 'A novel reader with translation function'
      icon: 'i-carbon-book'
    - name: 'ThroughMusic'
      link: 'https://github.com/FuBaooo/ThroughMusic'
      desc: 'A project imitating Netease cloud'
      icon: 'i-carbon-continue'
  Challenge:
    - name: 'TypeChallenges'
      link: '/challenges/type'
      desc: 'Typescript challenge completed'
      icon: 'i-carbon-ai-results-high'
  Maintenance:
    - name: 'DstCloudManage'
      link: 'https://github.com/FuBaooo/dst-cloud-manage'
      desc: 'DST server management tools'
      icon: 'i-carbon-cloud-services'
---

<list-projects :projects="frontmatter.projects"></list-projects>
