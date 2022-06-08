<script setup lang="ts">
useHead({
  title: 'FuBaooo',
  meta: [
    { name: 'description', content: 'FuBaooo\'s personal website' },
    {
      name: 'theme-color',
      content: computed(() => isDark.value ? '#175e9e' : '#ffffff'),
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: '/favicon.svg',
    },
  ],
})
</script>

<template>
  <RouterView />
</template>
