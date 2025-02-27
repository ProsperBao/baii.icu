<script lang="ts" setup>
// import Sakana from 'sakana'

const props = defineProps<{ licolico: 'chisato' | 'takina' }>()

onMounted(() => {
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-expect-error
  new (window as Window & typeof globalThis & { SakanaWidget: typeof SakanaWidget }).SakanaWidget({ character: props.licolico, controls: false }).mount(`#sakana-widget-${props.licolico}`)
})
</script>

<template>
  <div
    :id="`sakana-widget-${licolico}`" class="lt-lg:hidden fixed bottom-0 z-9999999" :class="[{
      'left-10vh': props.licolico === 'chisato',
      'right-10vh': props.licolico === 'takina',
    }]"
  />
</template>
