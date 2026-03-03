import type {RouteRecordRaw} from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const managementRoutes: RouteRecordRaw[] = [
  {
    path: '/management',
    meta: {title: '管理', root: true},
    component: MainLayout,
    children: [
      {
        path: '',
        meta: {title: '人员管理'},
        children: [
          {
            path: '/management/personnel/list',
            meta: {title: '人员管理', menu: true},
            component: () => import('@/views/management/personnel/personnel.vue'),
          },
          {
            path: '/management/personnel/add',
            meta: {title: '添加人员'},
            component: () => import('@/views/management/personnel/add-personnel.vue'),
          },
          {
            path: '/management/personnel/edit/:userId',
            meta: {title: '编辑人员'},
            component: () => import('@/views/management/personnel/add-personnel.vue'),
          },
          {
            path: '/management/personnel/detail/:id',
            meta: {title: '人员详情'},
            component: () => import('@/views/management/personnel/detail-personnel.vue'),
          },
          {
            path: '/management/personnel/import',
            meta: {title: '批量导入'},
            component: () => import('@/views/management/personnel/import-personnel.vue'),
          },
          {
            path: '/management/personnel/execute',
            meta: {title: '执行导入'},
            component: () => import('@/views/management/personnel/import-personnel-execute.vue'),
          },
          {
            path: '/management/personnel/complete',
            meta: {title: '导入完成'},
            component: () => import('@/views/management/personnel/import-personnel-complete.vue'),
          },
        ],
      },
      {
        path: 'department',
        meta: {title: '部门管理', menu: true},
        component: () => import('@/views/management/department.vue'),
      },
      {
        path: '',
        meta: {title: '角色管理'},
        children: [
          {
            path: '/management/role/list',
            meta: {title: '角色管理', menu: true},
            component: () => import('@/views/management/role/index.vue'),
          },
          {
            path: '/management/role/permission/:roleId',
            props: true,
            meta: {title: '设置权限'},
            component: () => import('@/views/management/role/permission.vue'),
          },
        ],
      },
      {
        path: '/management/permission',
        meta: {title: '权限管理', menu: true},
        component: () => import('@/views/management/permission.vue'),
      },
      {
        path: '/management/log',
        meta: {title: '日志管理', menu: true},
        component: () => import('@/views/management/log.vue'),
      },
    ],
  },
]

export default managementRoutes
