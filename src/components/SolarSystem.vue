<script setup lang="ts">
import { isClient } from '@vueuse/core'
import _ from 'lodash'
import { isDark } from '~/composables/dark'
const { random } = _

const starVarList = ref<string[]>([])
const asteroidsVarList = ref<string[]>([])

if (isClient) {
  const { stop } = useTimeoutFn(generateStar, 5900)
  useResizeObserver(document.body, generateStar)
  initAsteroidsBelt()
  function generateStar() {
    if (!isDark)
      return stop()
    const { innerWidth, innerHeight } = window
    starVarList.value = new Array(parseInt(`${(innerWidth / 100) * 30}`))
      .fill('')
      .map(() => `${random(0, innerWidth)}px ${random(0, innerHeight)}px 0 0 rgba(255, 255, 255, ${random(0, 1, true).toFixed(3)})`)
  }
  function initAsteroidsBelt() {
    for (let i = 0; i < 600; i++) {
      const [x, y] = [random(0, 175), random(0, 175)]
      asteroidsVarList.value.push(`${
        random(0, 1, true) > 0.5 ? '-' : ''
      }${x}px ${
        random(0, 1, true) > 0.5 ? '-' : ''
      }${y}px 0 -104px rgba(255, 255, 255, ${
        random(0, 1, true).toFixed(3)
      })`)
    }
  }
}
</script>

<template>
  <div class="solar-system-container" brightness-80>
    <div class="solar-syst" :style="{ '--star': starVarList.join(', '), '--asteroids': asteroidsVarList.join(', ') }">
      <div class="sun" />
      <div class="mercury" />
      <div class="venus" />
      <div class="earth" />
      <div class="mars" />
      <div class="jupiter" />
      <div class="saturn" />
      <div class="uranus" />
      <div class="neptune" />
      <div class="pluto" />
      <div class="asteroids-belt" />
    </div>
  </div>
</template>

<style scoped>
@import url('~/styles/star.css');

*,
*:before,
*:after {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.solar-system-container {
  position: fixed;
  z-index: -1;
  left: 0;
  top: 0;
  height: 100vh;
  width: 100vw;
  font: normal 1em/1.45em "Helvetica Neue", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  color: #fff;
  background: radial-gradient(ellipse at bottom, #1C2837 0%, #050608 100%);
  background-attachment: fixed;
}

.solar-syst {
  margin: 0 auto;
  width: 100%;
  height: 100%;
  position: relative;
}

.solar-syst:after {
  content: "";
  position: absolute;
  height: 2px;
  width: 2px;
  top: -2px;
  background: white;
  box-shadow: var(--star);
  border-radius: 100px;
  animation: star 2s linear infinite;
}

.solar-syst div {
  border-radius: 1000px;
  top: 50%;
  left: 50%;
  position: absolute;
  z-index: 999;
}

.solar-syst div:not(.sun) {
  border: 1px solid rgba(102, 166, 229, 0.12);
}

.solar-syst div:not(.sun):before {
  left: 50%;
  border-radius: 100px;
  content: "";
  position: absolute;
}

.solar-syst div:not(.asteroids-belt):before {
  box-shadow: inset 0 6px 0 -2px rgba(0, 0, 0, 0.25);
}

@keyframes star {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
</style>
