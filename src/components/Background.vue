<script lang="ts" setup>
import { isDark } from '~/composables/dark'
</script>

<template>
  <TransitionGroup name="fade">
    <SolarSystem v-if="isDark" key="solar" />
    <Galaxy v-show="!isDark" key="galaxy" />
  </TransitionGroup>
</template>

<style>
.fade-enter-active {
  transition: all 0.3s ease-in;
}

.fade-leave-active {
  transition: all 0.3s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
