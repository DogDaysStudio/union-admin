import {createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router'
import {useModuleStore} from '@/stores/module'
// 导入各模块路由
import data from './data'
import asset from './asset'
import lease from './lease'
import property from './property'
import iot from './iot'
import management from './management'
// import {useUserStore} from '@/stores/user'

const businessRoutes = [...data, ...asset, ...lease, ...property, ...iot, ...management]

export const routes: RouteRecordRaw[] = [
  ...businessRoutes,
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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 路由守卫
router.afterEach(to => {
  const moduleStore = useModuleStore()
  moduleStore.updateModuleFromRoute(to.path)
})

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

export default router
