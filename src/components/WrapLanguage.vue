<script setup lang="ts">
const { locale } = useI18n()
const { component } = await useSwitchLanguage(locale)
</script>

<template>
  <component :is="component" />
</template>
