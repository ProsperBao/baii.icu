<script setup lang="ts">
import type { DefineComponent } from 'vue'

const props = defineProps<{ path: string }>()

const { locale } = useI18n()
const router = useRouter()
const localeIndex = shallowRef<DefineComponent | null>(null)
const pageRoute = router.getRoutes().find(i => i.path === `${props.path}.${locale.value}`)
if (pageRoute) {
  const component = await (pageRoute.components.default as Function)()
  localeIndex.value = component.default
}
</script>

<template>
  <component :is="localeIndex" />
</template>
