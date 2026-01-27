import type {RouteRecordRaw} from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const propertyRoutes: RouteRecordRaw[] = [
  {
    path: '/property',
    redirect: '/property/settings',
    component: MainLayout,
    children: [
      {
        path: 'settings',
        meta: {title: '物业基础设置'},
        component: () => import('@/views/home-view.vue'),
      },
      {
        path: 'charge-standard',
        meta: {title: '收费标准设置'},
        component: () => import('@/views/home-view.vue'),
      },
      {
        path: 'charge-management',
        meta: {title: '物业收费管理'},
        component: () => import('@/views/home-view.vue'),
      },
      {
        path: 'charge-report',
        meta: {title: '物业收费报表'},
        component: () => import('@/views/home-view.vue'),
      },
    ],
  },
]

export default propertyRoutes
