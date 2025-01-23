<script setup lang="ts">
import { useRoute } from 'vue-router/auto'
import { englishOnly } from '../logics'

const inactiveStyle = 'opacity-20 hover:opacity-50'
const activeStyle = 'opacity-100 underline'

const route = useRoute()

const navLinks = [
  { path: '/posts', label: 'Blog' },
  { path: '/projects', label: 'Projects' },
  { path: '/challenges', label: 'Challenges' },
  { path: '/notes', label: 'Notes' },
]
</script>

<template>
  <div class="prose m-auto mb-8 select-none animate-none! op100!">
    <button flex="~ gap1" items-center mb2 op30 text-sm @click="englishOnly = !englishOnly">
      <div :i="englishOnly ? 'carbon-checkbox-checked' : 'carbon-checkbox'" />
      English Only
    </button>

    <div mb-0 flex="~ col gap-1 sm:row sm:gap-3 wrap" text-3xl>
      <RouterLink
        v-for="link in navLinks"
        :key="link.path"
        :to="link.path"
        class="!border-none"
        :class="route.path === link.path ? activeStyle : inactiveStyle"
      >
        {{ link.label }}
      </RouterLink>
    </div>
  </div>
</template>
