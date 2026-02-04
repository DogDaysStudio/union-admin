import type {RouteRecordRaw} from 'vue-router'

// 拼接路由路径
export const joinPath = (path: string, parentPath: string) =>
  path.startsWith('/') ? path : [parentPath, path].filter(Boolean).join('/')

// 每项路由都走一遍逻辑
export function walkRoute(
  routes: RouteRecordRaw[],
  onRoute: (route: RouteRecordRaw, parentPath?: string) => void,
  parentPath = ''
) {
  routes.forEach(route => {
    onRoute(route, parentPath)
    if (route.children) {
      walkRoute(route.children, onRoute, joinPath(route.path, parentPath))
    }
  })
}
