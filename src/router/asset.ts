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
            component: () => import('@/views/asset/management/project.vue'),
          },
          {
            path: 'add',
            meta: {title: '项目管理-新增', hidden: true},
            component: () => import('@/views/asset/management/add-project.vue'),
          },
          {
            path: 'import',
            meta: {title: '项目管理-导入', hidden: true},
            component: () => import('@/views/asset/management/import-project.vue'),
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
      // 系统管理
      {
        path: 'system',
        meta: {title: '系统管理'},
        children: [
          {
            path: 'dictionary',
            meta: {title: '数据字典管理'},
            component: () => import('@/views/asset/system/dictionary.vue'),
          },
        ],
      },
    ],
  },
]

export default assetRoutes
