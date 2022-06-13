<script setup lang="ts">
import { useSwitchLanguage } from '~/composables/switch-language'

const { locale } = useI18n()
const { component } = await useSwitchLanguage(locale)
</script>

<template>
  <component :is="component" />
</template>
