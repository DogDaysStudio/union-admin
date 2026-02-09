import type {RouteRecordRaw} from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const assetRoutes: RouteRecordRaw[] = [
  {
    path: '/asset',
    meta: {rootTitle: '资产管理'},
    component: MainLayout,
    children: [
      {
        path: '',
        meta: {title: '资产管理'},
        children: [
          {
            path: '/asset/management/project',
            meta: {title: '项目管理'},
            component: () => import('@/views/asset/management/project.vue'),
          },
          {
            path: '/asset/management/add',
            meta: {title: '项目管理-新增', hidden: true},
            component: () => import('@/views/asset/management/add-project.vue'),
          },
          {
            path: '/asset/management/edit/:id',
            meta: {title: '项目管理-编辑', hidden: true},
            component: () => import('@/views/asset/management/edit-project.vue'),
          },
          {
            path: '/asset/management/import',
            meta: {title: '项目管理-导入', hidden: true},
            component: () => import('@/views/asset/management/import-project.vue'),
          },
          {
            path: '/asset/management/detail',
            meta: {title: '项目管理-详情', hidden: true},
            component: () => import('@/views/asset/management/detail-project.vue'),
          },
          {
            path: '/asset/management/building-floor',
            meta: {title: '楼栋楼层管理'},
            component: () => import('@/views/asset/building/building-floor.vue'),
          },
          {
            path: '/asset/management/add-building',
            meta: {title: '楼栋-新增', hidden: true},
            component: () => import('@/views/asset/building/building/add-building.vue'),
          },
          {
            path: '/asset/management/edit-building/:id',
            meta: {title: '楼栋-编辑', hidden: true},
            component: () => import('@/views/asset/building/building/edit-building.vue'),
          },
          {
            path: '/asset/management/detail-building/:id',
            meta: {title: '楼栋-详情', hidden: true},
            component: () => import('@/views/asset/building/building/detail-building.vue'),
          },
          {
            path: '/asset/management/add-floor',
            meta: {title: '楼层-新增', hidden: true},
            component: () => import('@/views/asset/building/floor/add-floor.vue'),
          },
          {
            path: '/asset/management/edit-floor/:id',
            meta: {title: '楼层-编辑', hidden: true},
            component: () => import('@/views/asset/building/floor/edit-floor.vue'),
          },
          {
            path: '/asset/management/detail-floor/:id',
            meta: {title: '楼层-详情', hidden: true},
            component: () => import('@/views/asset/building/floor/detail-floor.vue'),
          },
          {
            path: '/asset/management/enclosure-floor',
            meta: {title: '围合管理'},
            component: () => import('@/views/asset/enclosure/enclosure-floor.vue'),
          },
          {
            path: '/asset/management/add-enclosure',
            meta: {title: '围合-新增', hidden: true},
            component: () => import('@/views/asset/enclosure/enclosure/add-enclosure.vue'),
          },
          {
            path: '/asset/management/edit-enclosure/:id',
            meta: {title: '围合-编辑', hidden: true},
            component: () => import('@/views/asset/enclosure/enclosure/edit-enclosure.vue'),
          },
          {
            path: '/asset/management/detail-enclosure/:id',
            meta: {title: '围合-详情', hidden: true},
            component: () => import('@/views/asset/enclosure/enclosure/detail-enclosure.vue'),
          },
          {
            path: '/asset/management/add-enclosure-floor',
            meta: {title: '围合-楼层-新增', hidden: true},
            component: () => import('@/views/asset/enclosure/floor/add-floor.vue'),
          },
          {
            path: '/asset/management/edit-enclosure-floor/:id',
            meta: {title: '围合-楼层-编辑', hidden: true},
            component: () => import('@/views/asset/enclosure/floor/edit-floor.vue'),
          },
          {
            path: '/asset/management/detail-enclosure-floor/:id',
            meta: {title: '围合-楼层-详情', hidden: true},
            component: () => import('@/views/asset/enclosure/floor/detail-floor.vue'),
          },
        ],
      },
      {
        path: '/asset/statistics',
        meta: {title: '资产统计'},
        component: () => import('@/views/home-view.vue'),
      },
      // 系统管理
      {
        path: '',
        meta: {title: '系统管理'},
        children: [
          {
            path: '/asset/system/dictionary',
            meta: {title: '数据字典管理'},
            component: () => import('@/views/asset/system/dictionary.vue'),
          },
        ],
      },
    ],
  },
]

export default assetRoutes
