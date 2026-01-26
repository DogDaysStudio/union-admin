import {createRouter, createWebHistory} from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/home',
    //   name: 'home',
    //   component: () => import('@/views/home-view.vue'),
    // },
    {
      path: '/',
      redirect: '/dashboard',
      component: MainLayout,
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

// router.beforeEach((to, from) => {
//   console.log('to, from', to, from)
// })

export default router
