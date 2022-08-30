<script lang="ts" setup>
import type SakanaWidget from 'sakana-widget'
const props = defineProps<{ licolico: 'chisato' | 'takina' }>()

onMounted(() => {
  new (window as Window & typeof globalThis & { SakanaWidget: typeof SakanaWidget }).SakanaWidget({ character: props.licolico, controls: false }).mount(`#sakana-widget-${props.licolico}`)
})
</script>

<template>
  <div
    :id="`sakana-widget-${licolico}`" fixed bottom-0 class="lt-lg:hidden" :class="[{
      'left-10vh': props.licolico === 'chisato',
      'right-10vh': props.licolico === 'takina',
    }]"
  />
</template>
