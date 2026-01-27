import type {RouteRecordRaw} from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const iotRoutes: RouteRecordRaw[] = [
  {
    path: '/iot',
    redirect: '/iot/device-management',
    component: MainLayout,
    children: [
      {
        path: 'device-management',
        meta: {title: 'IOT设备管理'},
        component: () => import('@/views/home-view.vue'),
      },
      {
        path: 'monitoring',
        meta: {title: '设备监控'},
        component: () => import('@/views/home-view.vue'),
      },
      {
        path: 'analysis',
        meta: {title: '数据分析'},
        component: () => import('@/views/home-view.vue'),
      },
    ],
  },
]

export default iotRoutes
