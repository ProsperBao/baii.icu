<script lang="ts" setup>
import Sakana from 'sakana'

const props = defineProps<{ licolico: 'chisato' | 'takina' }>()

onMounted(() => {
  Sakana.init({
    el: `#sakana-widget-${props.licolico}`,
    character: props.licolico,
    inertia: 0.01,
    decay: 0.99,
    r: 60,
    y: 10,
    scale: 0.5,
    translateY: 0,
    canSwitchCharacter: false,
  })
})
</script>

<template>
  <div
    :id="`sakana-widget-${licolico}`" class="lt-lg:hidden fixed bottom-0 z-9999999" :class="[{
      'left--10vh': props.licolico === 'chisato',
      'right--10vh': props.licolico === 'takina',
    }]"
  />
</template>
