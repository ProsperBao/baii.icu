<script lang="ts" setup>
import { isDark } from '~/composables/dark'
</script>

<template>
  <TransitionGroup>
    <SolarSystem v-if="isDark" key="solar" />
    <Galaxy v-show="!isDark" key="galaxy" />
  </TransitionGroup>
</template>
