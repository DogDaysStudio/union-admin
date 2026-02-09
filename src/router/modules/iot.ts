import type {RouteRecordRaw} from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const iotRoutes: RouteRecordRaw[] = [
  {
    path: '/iot',
    redirect: '/iot/device-management',
    meta: {title: 'IOT', root: true},
    component: MainLayout,
    children: [
      {
        path: 'device-management',
        meta: {title: 'IOT设备管理', menu: true},
        component: () => import('@/views/home-view.vue'),
      },
      {
        path: 'monitoring',
        meta: {title: '设备监控', menu: true},
        component: () => import('@/views/home-view.vue'),
      },
      {
        path: 'analysis',
        meta: {title: '数据分析', menu: true},
        component: () => import('@/views/home-view.vue'),
      },
    ],
  },
]

export default iotRoutes
