<script setup lang="ts">
import type { DefineComponent } from 'vue'

const { locale, availableLocales } = useI18n()
const localeIndex = computed(() => {
  let res: DefineComponent<{}, {}, any> | null = null
  Object.values(import.meta.globEager('~/posts/index-*.md')).forEach((i) => {
    if (i.default.name === `index-${locale.value}`)
      res = i.default
  })
  return res
})

const toggleLocales = () => {
  const locales = availableLocales
  locale.value = locales[(locales.indexOf(locale.value) + 1) % locales.length]
}
</script>

<template>
  <!-- <div>1</div> -->
  <component :is="localeIndex" />
  <button @click="toggleLocales">
    next language
  </button>
</template>
