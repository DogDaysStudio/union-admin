import type {RouteRecordRaw} from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const dataRoutes: RouteRecordRaw[] = [
  {
    path: '/data-center',
    // redirect: '/data-center/dashboard',
    meta: {title: '数据', root: true},
    component: MainLayout,
    children: [
      {
        path: 'dashboard',
        meta: {title: '数据看板', menu: true},
        component: () => import('@/views/dashboard.vue'),
      },
      {
        path: 'analysis',
        meta: {title: '数据分析', menu: true},
        component: () => import('@/views/home-view.vue'),
      },
      {
        path: 'reports',
        meta: {title: '数据报表', menu: true},
        component: () => import('@/views/home-view.vue'),
      },
    ],
  },
]

export default dataRoutes
