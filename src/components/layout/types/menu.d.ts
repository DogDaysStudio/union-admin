import type {RouteMeta} from 'vue-router'

export interface MenuItem {
  label: string
  path: string
  key: string // 完整路径或路由name
  meta?: RouteMeta
  children?: MenuItem[]
}
