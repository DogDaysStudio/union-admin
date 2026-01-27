import type {RouteRecordRaw} from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const dataRoutes: RouteRecordRaw[] = [
  {
    path: '/data-center',
    redirect: '/data-center/dashboard',
    component: MainLayout,
    children: [
      {
        path: 'dashboard',
        meta: {title: '数据看板'},
        component: () => import('@/views/dashboard.vue'),
      },
      {
        path: 'analysis',
        meta: {title: '数据分析'},
        component: () => import('@/views/home-view.vue'),
      },
      {
        path: 'reports',
        meta: {title: '数据报表'},
        component: () => import('@/views/home-view.vue'),
      },
    ],
  },
]

export default dataRoutes
