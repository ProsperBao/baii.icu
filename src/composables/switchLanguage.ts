import type { DefineComponent, WritableComputedRef } from 'vue'

export async function useSwitchLanguage(locale: WritableComputedRef<string>) {
  const router = useRouter()
  const route = useRoute()
  const routes = router.getRoutes().filter(i => i.name)
  const component = ref<DefineComponent | null>(null)
  const loadComponent = async () => {
    const pageRoute = routes.find(i => i.path === `${route.fullPath === '/' ? '' : route.fullPath}/index.${locale.value.toLocaleLowerCase()}`)
    if (pageRoute) {
      let load: DefineComponent | null = null
      if (!pageRoute.components) return
      if (typeof (pageRoute.components.default) === 'function') {
        load = await (pageRoute.components.default as Function)()
        load = load!.default
      }
      else {
        load = pageRoute.components.default as DefineComponent
      }

      load && (component.value = markRaw(load))
    }
  }

  await loadComponent()
  watch(() => locale.value, loadComponent)

  return {
    component,
  }
}
