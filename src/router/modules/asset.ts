import type {RouteRecordRaw} from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const assetRoutes: RouteRecordRaw[] = [
  {
    path: '/asset',
    meta: {title: '资产', root: true},
    component: MainLayout,
    children: [
      {
        path: '',
        meta: {title: '资产管理'},
        children: [
          {
            path: '/asset/management/project',
            meta: {title: '项目管理', menu: true},
            component: () => import('@/views/asset/management/project.vue'),
          },
          {
            path: '/asset/management/add',
            meta: {title: '项目管理-新增'},
            component: () => import('@/views/asset/management/add-project.vue'),
          },
          {
            path: '/asset/management/edit/:id',
            meta: {title: '项目管理-编辑'},
            component: () => import('@/views/asset/management/edit-project.vue'),
          },
          {
            path: '/asset/management/detail/:id',
            meta: {title: '项目管理-详情'},
            component: () => import('@/views/asset/management/detail-project.vue'),
          },
          {
            path: '/asset/management/import',
            meta: {title: '项目管理-导入'},
            component: () => import('@/views/asset/management/import-project.vue'),
          },
          {
            path: '/asset/management/detail',
            meta: {title: '项目管理-详情'},
            component: () => import('@/views/asset/management/detail-project.vue'),
          },
          {
            path: '/asset/management/building-floor',
            meta: {title: '楼栋管理', menu: true},
            component: () => import('@/views/asset/building/building-floor.vue'),
          },
          {
            path: '/asset/management/add-building',
            meta: {title: '楼栋-新增'},
            component: () => import('@/views/asset/building/building/add-building.vue'),
          },
          {
            path: '/asset/management/edit-building/:id',
            meta: {title: '楼栋-编辑'},
            component: () => import('@/views/asset/building/building/edit-building.vue'),
          },
          {
            path: '/asset/management/detail-building/:id',
            meta: {title: '楼栋-详情'},
            component: () => import('@/views/asset/building/building/detail-building.vue'),
          },
          {
            path: '/asset/management/add-floor',
            meta: {title: '楼层-新增'},
            component: () => import('@/views/asset/building/floor/add-floor.vue'),
          },
          {
            path: '/asset/management/edit-floor/:id',
            meta: {title: '楼层-编辑'},
            component: () => import('@/views/asset/building/floor/edit-floor.vue'),
          },
          {
            path: '/asset/management/detail-floor/:id',
            meta: {title: '楼层-详情'},
            component: () => import('@/views/asset/building/floor/detail-floor.vue'),
          },
          {
            path: '/asset/management/enclosure-floor',
            meta: {title: '围合管理', menu: true},
            component: () => import('@/views/asset/enclosure/enclosure-floor.vue'),
          },
          {
            path: '/asset/management/add-enclosure',
            meta: {title: '围合-新增'},
            component: () => import('@/views/asset/enclosure/enclosure/add-enclosure.vue'),
          },
          {
            path: '/asset/management/edit-enclosure/:id',
            meta: {title: '围合-编辑'},
            component: () => import('@/views/asset/enclosure/enclosure/edit-enclosure.vue'),
          },
          {
            path: '/asset/management/detail-enclosure/:id',
            meta: {title: '围合-详情'},
            component: () => import('@/views/asset/enclosure/enclosure/detail-enclosure.vue'),
          },
          {
            path: '/asset/management/add-enclosure-floor',
            meta: {title: '围合-楼层-新增'},
            component: () => import('@/views/asset/enclosure/floor/add-floor.vue'),
          },
          {
            path: '/asset/management/edit-enclosure-floor/:id',
            meta: {title: '围合-楼层-编辑'},
            component: () => import('@/views/asset/enclosure/floor/edit-floor.vue'),
          },
          {
            path: '/asset/management/detail-enclosure-floor/:id',
            meta: {title: '围合-楼层-详情'},
            component: () => import('@/views/asset/enclosure/floor/detail-floor.vue'),
          },

          {
            path: '/asset/management/room',
            meta: {title: '房屋（住宅）管理', menu: true},
            component: () => import('@/views/asset/room/index.vue'),
          },
          {
            path: '/asset/management/add-room',
            meta: {title: '房屋-新增'},
            component: () => import('@/views/asset/room/add-room.vue'),
          },
          {
            path: '/asset/management/edit-room/:id',
            meta: {title: '房屋-编辑'},
            component: () => import('@/views/asset/room/edit-room.vue'),
          },
          {
            path: '/asset/management/detail-room/:id',
            meta: {title: '房屋-详情'},
            component: () => import('@/views/asset/room/detail-room.vue'),
          },
          {
            path: '/asset/management/shop',
            meta: {title: '房屋（商业）管理', menu: true},
            component: () => import('@/views/asset/shop/index.vue'),
          },
          {
            path: '/asset/management/add-shop',
            meta: {title: '商业-新增'},
            component: () => import('@/views/asset/shop/add-shop.vue'),
          },
          {
            path: 'management/fixed/add',
            meta: {title: '固定资产-新增'},
            component: () => import('@/views/asset/fixed/add-fixed.vue'),
          },
          {
            path: 'management/fixed/edit-fixed/:id',
            meta: {title: '固定资产-编辑', keepAlive: false},
            component: () => import('@/views/asset/fixed/edit-fixed.vue'),
          },
          {
            path: 'management/fixed/detail-fixed/:id',
            meta: {title: '固定资产-详情', keepAlive: false},
            component: () => import('@/views/asset/fixed/detail-fixed.vue'),
          },
          {
            path: '/asset/management/edit-shop/:id',
            meta: {title: '商业-编辑'},
            component: () => import('@/views/asset/shop/edit-shop.vue'),
          },
          {
            path: '/asset/management/detail-shop/:id',
            meta: {title: '商业-详情'},
            component: () => import('@/views/asset/shop/detail-shop.vue'),
          },

          {
            path: '/asset/management/point',
            meta: {title: '点位资源管理', menu: true},
            component: () => import('@/views/asset/point/index.vue'),
          },
          {
            path: '/asset/management/add-point',
            meta: {title: '点位-新增'},
            component: () => import('@/views/asset/point/add-point.vue'),
          },
          {
            path: '/asset/management/edit-point/:id',
            meta: {title: '点位-编辑'},
            component: () => import('@/views/asset/point/edit-point.vue'),
          },
          {
            path: '/asset/management/detail-point/:id',
            meta: {title: '点位-详情'},
            component: () => import('@/views/asset/point/detail-point.vue'),
          },
          {
            path: 'management/fixed',
            meta: {title: '固定资产管理', menu: true},
            component: () => import('@/views/asset/fixed/index.vue'),
          },
          {
            path: '/asset/management/parking',
            meta: {title: '建筑物管理', menu: true},
            component: () => import('@/views/asset/parking/index.vue'),
          },
          {
            path: '/asset/management/add-parking-lot',
            meta: {title: '停车场-新增'},
            component: () => import('@/views/asset/parking/lot/add-lot.vue'),
          },
          {
            path: '/asset/management/edit-parking-lot/:id',
            meta: {title: '停车场-编辑'},
            component: () => import('@/views/asset/parking/lot/edit-lot.vue'),
          },
          {
            path: '/asset/management/detail-parking-lot/:id',
            meta: {title: '停车场-详情'},
            component: () => import('@/views/asset/parking/lot/detail-lot.vue'),
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
            meta: {title: '数据字典管理', menu: true},
            component: () => import('@/views/asset/system/dictionary.vue'),
          },
        ],
      },
    ],
  },
]

export default assetRoutes
