import type {RouteRecordRaw} from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const leaseRoutes: RouteRecordRaw[] = [
  {
    path: '/lease',
    redirect: '/lease/management',
    meta: {title: '租赁', root: true},
    component: MainLayout,
    children: [
      {
        path: 'management',
        meta: {title: '租赁管理', menu: true},
        component: () => import('@/views/home-view.vue'),
      },
      {
        path: 'contract',
        meta: {title: '合同管理', menu: true},
        component: () => import('@/views/home-view.vue'),
      },
      {
        path: 'rental',
        meta: {title: '租金管理', menu: true},
        component: () => import('@/views/home-view.vue'),
      },
    ],
  },
]

export default leaseRoutes
