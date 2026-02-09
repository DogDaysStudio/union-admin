import {createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router'
import {useModuleStore} from '@/stores/module'
import {joinPath, walkRoute} from '@/utils/router'
import modules from '@/router/modules'
// import {useUserStore} from '@/stores/user'

export const routes: RouteRecordRaw[] = [
  ...modules,
  // 登录路由
  {
    path: '/login',
    name: 'login',
    meta: {title: '登录' /*, requiresAuth: false*/},
    component: () => import('@/views/login.vue'),
  },

  {path: '/', redirect: '/data-center'},
  // 404 页面路由
  {
    path: '/404',
    name: '404',
    meta: {title: '页面不存在'},
    component: () => import('@/views/404.vue'),
  },

  // 404 路由重定向
  {path: '/:pathMatch(.*)*', redirect: '/404'},
]

// 确保每个路由有 name 属性，优先与最终的 path 一致，其次设置为 title
walkRoute(routes, (route, parentPath) => {
  if (!route.name) {
    if (route.path) {
      route.name = joinPath(route.path, parentPath)
    } else {
      route.name = route.meta?.title
    }
  }
})

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// // 路由守卫
router.afterEach(to => {
  const moduleStore = useModuleStore()
  moduleStore.updateModuleFromRoute(to.path)
})

// router.isReady().then(() => {
//   const moduleStore = useModuleStore()
//   moduleStore.init()
// })

// 路由守卫
// router.beforeEach(to => {
//   const userStore = useUserStore()

//   const requiresAuth = businessRoutes.some(route =>
//     to.path.startsWith(route.path)
//   ) /* || to.path === '/404' */

//   // 如果页面需要登录，且用户未登录，则跳转到登录页
//   if (requiresAuth && !userStore.token) {
//     return {path: '/login'}
//   }
//   // 如果用户已登录，访问登录页则自动跳转到首页
//   else if (to.path === '/login' && userStore.token) {
//     return {path: '/'}
//   }
// })

// 监听 Vite 插件发送的消息
if (import.meta.hot) {
  import.meta.hot.on('router:changed', () => {
    // console.log('[Router Watcher] Received router:changed message from Vite')
    // 发送更新后的路由对象回 Vite
    import.meta.hot.send('router:updated', {routes})
    // console.log('[Router Watcher] Sent updated routes to Vite')
  })

  // 初始化时发送一次路由对象
  // console.log('[Router Watcher] Sending initial routes to Vite')
  import.meta.hot.send('router:updated', {routes})
}

export default router
