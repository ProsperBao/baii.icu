<script lang="ts" setup>
defineProps<{ href: string }>()
</script>

<template>
  <a v-if="!href.startsWith('/')" target="_blank" :href="href"><slot /></a>
  <router-link v-else :to="href">
    <slot />
  </router-link>
</template>
