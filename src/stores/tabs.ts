import {defineStore} from 'pinia'
import {ref} from 'vue'
import type {RouteLocationNormalized} from 'vue-router'

type TabRoute = Pick<RouteLocationNormalized, 'path' | 'meta' | 'matched'>
type Tab = Pick<RouteLocationNormalized, 'path' | 'meta'> & {componentName: string}

// todo: 改为对象的形式
export const useTabStore = defineStore(
  'tab',
  () => {
    const tabs = ref<Tab[]>([])

    function addTab(tab: TabRoute) {
      if (tabs.value.some(item => item.path === tab.path)) {
        return
      }

      tabs.value.push({
        path: tab.path,
        meta: tab.meta,
        componentName: getComponentName(tab),
      })
    }

    function removeTab(path: string) {
      tabs.value = tabs.value.filter(item => item.path !== path)
    }

    return {tabs, addTab, removeTab}
  }
  // {
  //   persist: true,
  // }
)

// todo: fix: 获取不到 name 会返回 component
export function getComponentName(route: TabRoute) {
  return route.matched?.[route.matched?.length - 1]?.components?.default?.name || ''
}
