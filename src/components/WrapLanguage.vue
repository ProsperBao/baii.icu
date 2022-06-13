<script setup lang="ts">
import type { DefineComponent } from 'vue'

const props = defineProps<{ path: string }>()

const { locale } = useI18n()
const router = useRouter()
const localeIndex = ref<DefineComponent | null>(null)
const pickLocaleComponent = async () => {
  const pageRoute = router.getRoutes().find(i => i.path === `${props.path}.${locale.value.toLocaleLowerCase()}`)
  if (pageRoute) {
    const component = await (pageRoute.components.default as Function)()
    localeIndex.value = markRaw(component.default)
  }
}
await pickLocaleComponent()
watch(() => locale.value, pickLocaleComponent)
</script>

<template>
  <component :is="localeIndex" />
</template>
