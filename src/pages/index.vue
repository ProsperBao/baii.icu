<script setup lang="ts">
import type { DefineComponent } from 'vue'

const { locale } = useI18n()
const localeIndex = computed(() => {
  let res: DefineComponent<{}, {}, any> | null = null
  Object.values(import.meta.globEager('~/posts/index.*.md')).forEach((i) => {
    if (i.default.name === `index.${locale.value}`)
      res = i.default
  })
  return res
})
</script>

<template>
  <!-- <div>1</div> -->
  <component :is="localeIndex" />
</template>
