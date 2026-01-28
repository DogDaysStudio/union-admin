import type {RouteRecordRaw} from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const assetRoutes: RouteRecordRaw[] = [
  {
    path: '/asset',
    // redirect: '/asset/management/project',
    component: MainLayout,
    children: [
      {
        path: 'management',
        meta: {title: '资产管理'},
        // component: () => import('@/views/asset/project-management.vue'),
        children: [
          {
            path: 'project',
            meta: {title: '项目管理'},
            component: () => import('@/views/asset/project-management.vue'),
          },
          {
            path: 'add',
            meta: {title: '项目管理-新增',hidden: true},
            component: () => import('@/views/asset/add-project-management.vue'),
          },
          {
            path: 'import',
            meta: {title: '项目管理-导入',hidden: true},
            component: () => import('@/views/asset/import-project-management.vue'),
          },
          // {
          //   path: 'lists',
          //   meta: {title: '资产列表'},
          //   component: () => import('@/views/asset/add-management.vue'),
          // },
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
