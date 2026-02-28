import {defineStore} from 'pinia'
import type {RouteLocationNormalized} from 'vue-router'

type TabRoute = Pick<RouteLocationNormalized, 'path' | 'meta' | 'matched'>
type Tab = Pick<RouteLocationNormalized, 'path' | 'meta'> & {componentName: string}

export const useTabStore = defineStore('tab', {
  state: () => ({
    tabs: [] as Tab[],
  }),
  actions: {
    addTab(tab: TabRoute) {
      if (this.tabs.some(item => item.path === tab.path)) return
      if (!tab.meta?.title) return // 有 title 才添加到 tab 中

      this.tabs.push({
        path: tab.path,
        meta: tab.meta,
        componentName: getComponentName(tab),
      })
    },
    removeTab(path: string) {
      this.tabs = this.tabs.filter(item => item.path !== path)
    },
  },
  // persist: true,
})

export function getComponentName(route: TabRoute) {
  return route.matched?.[route.matched?.length - 1]?.components?.default?.name || ''
}
