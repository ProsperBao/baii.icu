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
    - name: 'SourceCodeReading'
      link: '/challenges/source'
      desc: 'The challenge of reading source code'
      icon: 'i-carbon-bot'
    - name: 'RestraintAlmanac'
      link: 'https://github.com/FuBaooo/restraint-almanac'
      desc: 'A restraint almanac'
      icon: 'i-carbon:floating-ip'
  Challenge:
    - name: 'TypeChallenges'
      link: '/challenges/type'
      desc: 'Typescript challenge completed'
      icon: 'i-carbon-ai-results-high'
  Maintenance:
    - name: 'Bookmark'
      link: '/bookmark'
      desc: 'These are things that I find interesting'
      icon: 'i-carbon:bookmark'
    - name: 'DstCloudManage'
      link: 'https://github.com/FuBaooo/dst-cloud-manage'
      desc: 'DST server management tools'
      icon: 'i-carbon-cloud-services'
    - name: 'EpubReading'
      link: 'https://github.com/FuBaooo/epub-reading'
      desc: 'A novel reader with translation function'
      icon: 'i-carbon-book'
---

<list-projects :projects="frontmatter.projects"></list-projects>
