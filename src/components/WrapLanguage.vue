<script setup lang="ts">
import type { DefineComponent } from 'vue'

const props = defineProps<{ path: string }>()

const { locale } = useI18n()
const localeIndex = computed(() => {
  let res: DefineComponent | null = null
  Object.values(import.meta.globEager(`${props.path}/.*/.md`)).forEach((i) => {
    if (i.default.name === `index.${locale.value}`)
      res = i.default
  })
  return res
})
</script>

<template>
  <component :is="localeIndex" />
</template>
