<script lang="ts" setup>
defineProps<{ to: string }>()
</script>

<template>
  <a v-if="!to.startsWith('/')" target="_blank" :href="to">
    <slot />
  </a>
  <router-link v-else :to="to">
    <slot />
  </router-link>
</template>
