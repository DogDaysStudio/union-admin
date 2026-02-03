import type {RouteRecordRaw} from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const managementRoutes: RouteRecordRaw[] = [
  {
    path: '/management',
    // redirect: '/management/personnel',
    component: MainLayout,
    children: [
      {
        path: 'personnel',
        meta: {title: '人员管理'},
        // component: () => import('@/views/management/personnel/personnel.vue'),
        children: [
          {
            path: 'list',
            meta: {title: '人员管理'},
            component: () => import('@/views/management/personnel/personnel.vue'),
          },
          {
            path: 'add',
            meta: {title: '添加人员'},
            component: () => import('@/views/management/personnel/add-personnel.vue'),
          },
          {
            path: 'detail/:id',
            meta: {title: '人员详情'},
            component: () => import('@/views/management/personnel/detail-personnel.vue'),
          },
          {
            path: 'import',
            meta: {title: '批量导入'},
            component: () => import('@/views/management/personnel/import-personnel.vue'),
          },
          {
            path: 'execute',
            meta: {title: '执行导入'},
            component: () => import('@/views/management/personnel/import-personnel-execute.vue'),
          },
          {
            path: 'complete',
            meta: {title: '导入完成'},
            component: () => import('@/views/management/personnel/import-personnel-complete.vue'),
          },
        ],
      },
      {
        path: 'department',
        meta: {title: '部门管理'},
        component: () => import('@/views/management/department.vue'),
      },
      // 权限管理
      {
        path: 'permission',
        meta: {title: '权限管理'},
        component: () => import('@/views/management/permission.vue'),
      },
    ],
  },
]

export default managementRoutes
