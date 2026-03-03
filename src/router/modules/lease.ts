import type {RouteRecordRaw} from 'vue-router'
// import MainLayout from '@/layouts/MainLayout.vue'
import LeaseLayout from '@/layouts/LeaseLayout.vue'

const leaseRoutes: RouteRecordRaw[] = [
  {
    path: '/lease',
    meta: {title: '租赁', root: true},
    component: LeaseLayout,
    children: [
      {
        path: '',
        // meta: {title: '租赁管理', menu: true},
        meta: {title: '', menu: true},
        component: () => import('@/views/lease/index.vue'),
      },
    ],
  },
]

export default leaseRoutes
