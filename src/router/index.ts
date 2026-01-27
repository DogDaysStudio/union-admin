import {createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router'
import {useModuleStore} from '@/stores/module'
// 导入各模块路由
import data from './data'
import asset from './asset'
import lease from './lease'
import property from './property'
import iot from './iot'

export const routes: RouteRecordRaw[] = [
  // 登录路由
  {
    path: '/login',
    name: 'login',
    meta: {title: '登录' /*, requiresAuth: false*/},
    component: () => import('@/views/login-view.vue'),
  },

  {path: '/', redirect: '/data-center'},
  ...data,
  ...asset,
  ...lease,
  ...property,
  ...iot,
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
// router.beforeEach((to, from, next) => {
//   const userStore = useUserStore()
//   const requiresAuth = to.matched.some(record => record.meta.requiresAuth !== false)

//   // 如果页面需要登录，且用户未登录，则跳转到登录页
//   if (requiresAuth && !userStore.token) {
//     next({path: '/login'})
//   }
//   // 如果用户已登录，访问登录页则自动跳转到首页
//   else if (to.path === '/login' && userStore.token) {
//     next({path: '/dashboard'})
//   }
//   // 其他情况正常跳转
//   else {
//     next()
//   }
// })

export default router
