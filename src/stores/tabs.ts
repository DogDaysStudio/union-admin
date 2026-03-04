import {defineStore} from 'pinia'
import {nextTick} from 'vue'
import {type RouteLocationNormalized} from 'vue-router'
import router from '@/router'

type TabRoute = Pick<RouteLocationNormalized, 'path' | 'meta' | 'matched' | 'name'>
type Tab = Pick<RouteLocationNormalized, 'path' | 'meta' | 'name'> & {componentName: string}

export const useTabStore = defineStore('tab', {
  state: () => ({
    tabs: [] as Tab[],
  }),
  actions: {
    /**
     * 添加标签页，如果已存在则会刷新旧页面
     * @param tab 标签页路由信息
     */
    addTab(tab: TabRoute) {
      if (!tab.meta?.title) return // 有 title 才添加到 tab 中
      if (this.tabs.some(item => item.path === tab.path)) return
      const nameTab = this.tabs.find(item => item.name === tab.name)

      const _pushTab = (tab: TabRoute) => {
        this.tabs.push({
          path: tab.path,
          meta: tab.meta,
          name: tab.name,
          componentName: getComponentName(tab),
        })
      }

      if (nameTab) {
        this.removeTab(nameTab.path)
        nextTick(() => _pushTab(tab))
      } else {
        _pushTab(tab)
      }
    },

    /**
     * 移除指定路径的标签页
     * @param path 标签页路径
     */
    removeTab(path: string) {
      this.tabs = this.tabs.filter(item => item.path !== path)
    },

    /**
     * 关闭当前标签页
     */
    close(path?: string) {
      const currentPath = router.currentRoute.value.path
      path ??= currentPath
      const index = this.tabs.findIndex(item => item.path === path)

      this.removeTab(path)

      // 如果关闭的是当前激活的标签页，跳转其他标签页
      if (path === currentPath && this.tabs.length) {
        const activeIndex = index >= this.tabs.length ? this.tabs.length - 1 : index
        router.push(this.tabs[activeIndex].path)
      }
    },
    // closeOthers
    // refresh
  },
  // persist: true,
})

/**
 * 获取路由组件名称
 * @param route 路由信息
 * @returns 组件名称
 */
export function getComponentName(route: TabRoute) {
  return route.matched?.[route.matched?.length - 1]?.components?.default?.name || ''
}
