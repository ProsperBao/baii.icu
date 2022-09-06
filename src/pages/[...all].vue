<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="icon-btn" text-lg>
    {{ t('not-found') }}
  </div>
</template>

<route lang="yaml">
meta:
  layout: 404
</route>
