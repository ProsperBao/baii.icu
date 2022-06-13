import type { DefineComponent, WritableComputedRef } from 'vue'

export async function useSwitchLanguage(locale: WritableComputedRef<string>) {
  const router = useRouter()
  const route = useRoute()
  const routes = router.getRoutes()
  const component = ref<DefineComponent | null>(null)
  const loadComponent = async () => {
    const pageRoute = routes.find(i => i.path === `${route.fullPath}/index.${locale.value.toLocaleLowerCase()}`)
    if (pageRoute) {
      const load = await (pageRoute.components.default as Function)()
      component.value = markRaw(load.default)
    }
  }

  await loadComponent()
  watch(() => locale.value, loadComponent)

  return {
    component,
  }
}
