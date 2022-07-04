<script setup lang="ts">
import { isClient } from '@vueuse/core'
import { isDark } from '~/composables/dark'
import { StarField } from '~/composables/galaxyAnimation'

let starfield: StarField | null
const el = ref<HTMLCanvasElement | null>(null)

if (isClient) {
  onMounted(() => {
    if (el.value) {
      starfield = new StarField(Math.floor(window.innerWidth / 3), el.value)
      starfield.startRenderLoop()
    }
  })
  onUnmounted(() => {
    if (el.value)
      starfield?.stopRenderLoop()
  })

  watch(() => isDark.value, (n) => {
    if (!n && starfield?.screen.every(i => i === 0)) {
      nextTick(() => {
        if (el.value) {
          starfield = new StarField(Math.floor(window.innerWidth / 3), el.value)
          starfield.startRenderLoop()
        }
      })
    }
  })
}
</script>

<template>
  <div fixed top-0 bottom-0 left-0 right-0 pointer-events-none opacity-50 style="z-index: -1">
    <canvas ref="el" class="w-full h-full" />
  </div>
</template>
