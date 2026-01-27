import type {RouteRecordRaw} from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const assetRoutes: RouteRecordRaw[] = [
  {
    path: '/asset',
    redirect: '/asset/management/project',
    component: MainLayout,
    children: [
      {
        path: 'management',
        meta: {title: '资产管理'},
        component: () => import('@/views/home-view.vue'),
        children: [
          {
            path: 'project',
            meta: {title: '项目管理'},
            component: () => import('@/views/asset/project-management.vue'),
          },
          {
            path: 'list',
            meta: {title: '资产列表'},
            component: () => import('@/views/home-view.vue'),
          },
        ],
      },
      {
        path: 'statistics',
        meta: {title: '资产统计'},
        component: () => import('@/views/home-view.vue'),
      },
    ],
  },
]

export default assetRoutes
