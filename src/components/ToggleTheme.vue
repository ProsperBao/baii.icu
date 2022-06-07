<script setup lang='ts'>
import { toggleDark } from '~/composables/dark'
const { t } = useI18n()
</script>

<template>
  <button class="icon-btn mx-2 !outline-none" :title="t('button.toggle_dark')" @click="() => toggleDark()">
    <div i="carbon-sun dark:carbon-moon" />
  </button>
</template>
