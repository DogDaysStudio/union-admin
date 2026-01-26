import {createRouter, createWebHistory} from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
// import {useUserStore} from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 登录路由
    {
      path: '/login',
      name: 'login',
      meta: {title: '登录' /*, requiresAuth: false*/},
      component: () => import('@/views/login-view.vue'),
    },
    // 主路由
    {
      path: '/',
      redirect: '/dashboard',
      component: MainLayout,
      // meta: {requiresAuth: true},
      children: [
        {
          path: '/dashboard',
          meta: {title: '数据看板'},
          component: () => import('../views/dashboard-view.vue'),
        },
        {
          path: '/home',
          meta: {title: '主页'},
          component: () => import('../views/home-view.vue'),
        },
      ],
    },
  ],
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
