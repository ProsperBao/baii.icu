---
title: 书签 - ProsperBao
display: 书签
subtitle: 一些我觉得有意思或者有用的东西.
description: 一些我觉得有意思或者有用的东西.
projects:
  设计:
    - name: 'Browse Fonts'
      link: 'https://fonts.google.com/'
      desc: '上面有非常多的不同的开源字体'
      icon: 'i-carbon:text-font'
    - name: 'Baseline'
      link: 'https://baseline.is/tools/background-remover/'
      desc: '免费的背景去除工具'
      icon: 'i-carbon:erase'
    - name: 'Tinypng'
      link: 'https://tinypng.com/'
      desc: '超高压缩比的图片压缩工具'
      icon: 'i-carbon:circle-packing'
  工具:
    - name: 'tldraw'
      link: 'https://www.tldraw.com/'
      desc: '非常好用的在轻量级的绘图工具'
      icon: 'i-carbon:flow-modeler-reference'
    - name: 'SvgPathEditor'
      link: 'https://yqnn.github.io/svg-path-editor/'
      desc: 'SVG 路径编辑'
      icon: 'i-carbon:paint-brush-alt'
---

<list-projects :projects="frontmatter.projects"></list-projects>
