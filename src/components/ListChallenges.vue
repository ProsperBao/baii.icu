<script setup lang="ts">
import type { Post } from '~/types'
import { useRouter } from 'vue-router/auto'
import { englishOnly, formatDate } from '~/logics'

const NAME_MAPPING = {
  'typescript-challenge': 'TS体操',
  'source': '源码阅读',
} as Record<string, string>

const router = useRouter()
const routes: Post[] = router.getRoutes()
  .filter(i => i.path.startsWith('/challenges') && i.meta.frontmatter.date && !i.meta.frontmatter.draft)
  .filter(i => !i.path.endsWith('.html'))
  .map((i) => {
    const category = `${i.meta.frontmatter.category}`.split('>')
    return {
      path: i.meta.frontmatter.redirect || i.path,
      title: i.meta.frontmatter.title,
      date: i.meta.frontmatter.date,
      lang: i.meta.frontmatter.lang,
      duration: i.meta.frontmatter.duration,
      recording: i.meta.frontmatter.recording,
      upcoming: i.meta.frontmatter.upcoming,
      redirect: i.meta.frontmatter.redirect,
      place: i.meta.frontmatter.place,
      category: category[0],
      tag: category.slice(1),
    }
  })

const posts = computed(() =>
  Object.values([...routes]
    .reduce((acc, i) => {
      const category = `${i.category}`.split('>')[0]
      acc[category] = [...(acc[category] || []), i]
        .sort((a, b) => +new Date(b.date) - +new Date(a.date))
        .filter(i => !englishOnly.value || i.lang !== 'en')
      return acc
    }, {} as Record<string, Post[]>)).flat(),
)

function isSameGroup(a: Post, b?: Post) {
  return a.category === b?.category
}

function getGroupName(p: Post) {
  return NAME_MAPPING[p.category as string] || p.category
}
</script>

<template>
  <ul>
    <template v-if="!posts.length">
      <div py2 op50>
        { nothing here yet }
      </div>
    </template>

    <template v-for="route, idx in posts" :key="route.path">
      <div
        v-if="!isSameGroup(route, posts[idx - 1])"
        select-none relative h20 pointer-events-none slide-enter
        :style="{
          '--enter-stage': idx - 2,
          '--enter-step': '60ms',
        }"
      >
        <span text-4em absolute left--3rem top-2rem font-bold c-hex-aaa op10>{{ getGroupName(route) }}</span>
      </div>
      <div
        class="slide-enter"
        :style="{
          '--enter-stage': idx,
          '--enter-step': '60ms',
        }"
      >
        <component
          :is="route.path.includes('://') ? 'a' : 'RouterLink'"
          v-bind="
            route.path.includes('://') ? {
              href: route.path,
              target: '_blank',
              rel: 'noopener noreferrer',
            } : {
              to: route.path,
            }
          "
          class="item block font-normal mb-6 mt-2 no-underline"
        >
          <li class="no-underline" flex="~ col md:row gap-2 md:items-center">
            <div class="title text-lg leading-1.2em" flex="~ gap-2 wrap">
              <span align-middle>{{ route.title }}</span>
              <span
                v-if="route.redirect"
                align-middle op50 flex-none text-xs ml--1.5
                i-carbon-arrow-up-right
                title="External"
              />
            </div>

            <div flex="~ gap-2 items-center">
              <span text-sm op50 ws-nowrap>
                {{ formatDate(route.date, true) }}
              </span>
              <span
                v-for="tag in route.tag"
                :key="tag"
                align-middle flex-none
                class="text-xs bg-zinc:15 text-zinc5 rounded px-1 py-0.5 my-auto"
              >
                {{ NAME_MAPPING[tag] || tag }}
              </span>
            </div>
          </li>
          <div v-if="route.place" op50 text-sm hidden mt--2 md:block>
            {{ route.place }}
          </div>
        </component>
      </div>
    </template>
  </ul>
</template>
