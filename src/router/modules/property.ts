import type {RouteRecordRaw} from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const propertyRoutes: RouteRecordRaw[] = [
  {
    path: '/property',
    meta: {title: '物业', root: true},
    component: MainLayout,
    children: [
      {
        path: 'settings',
        meta: {title: '系统设置', menu: true},
        children: [
          {
            path: 'sop',
            meta: {title: 'SOP管理', menu: true},
            component: () => import('@/views/property/sop/index.vue'),
          },
          {
            path: 'sop/:id',
            meta: {title: 'SOP 详情', menu: false},
            component: () => import('@/views/property/sop/detail.vue'),
          },
          {
            path: 'dictionary',
            meta: {title: '数据字典管理', menu: true},
            component: () => import('@/views/property/dictionary/index.vue'),
          },
          {
            path: 'employee',
            meta: {title: '员工管理', menu: true},
            component: () => import('@/views/property/employee/index.vue'),
          },
        ],
      },
      {
        path: 'customer',
        meta: {title: '客户管理', menu: true},
        children: [
          {
            path: 'info',
            meta: {title: '客户信息管理', menu: true},
            component: () => import('@/views/dashboard.vue'),
          },
          {
            path: 'grid',
            meta: {title: '网格化管理', menu: true},
            component: () => import('@/views/dashboard.vue'),
          },
        ],
      },
      {
        path: 'project',
        meta: {title: '项目管理', menu: true},
        children: [
          {
            path: 'assets',
            meta: {title: '项目资产档案', menu: true},
            component: () => import('@/views/dashboard.vue'),
          },
          {
            path: 'customer',
            meta: {title: '客户管理', menu: true},
            component: () => import('@/views/dashboard.vue'),
          },
        ],
      },
      {
        path: 'contract',
        meta: {title: '合同管理', menu: true},
        children: [
          {
            path: 'list',
            meta: {title: '合同列表', menu: true},
            component: () => import('@/views/dashboard.vue'),
          },
        ],
      },
    ],
  },
]

export default propertyRoutes
