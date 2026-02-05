// 这段可以直接添加到你的任何 '.ts' 文件中，例如 'router.ts'
// 也可以添加到一个 '.d.ts' 文件中。确保这个文件包含在
// 项目的 'tsconfig.json' 中的 "file" 字段内。
import {RouteRecordInfo, RouteRecordName, ParamValue} from 'vue-router'

// 为了确保这个文件被当作一个模块，添加至少一个 'export' 声明
export interface RouteNamedMap {
  '/data-center': RouteRecordInfo<
    '/data-center',
    '/data-center',
    any,
    any,
    never
  >
  '/data-center/dashboard': RouteRecordInfo<
    '/data-center/dashboard',
    '/data-center/dashboard',
    any,
    any,
    never
  >
  '/data-center/analysis': RouteRecordInfo<
    '/data-center/analysis',
    '/data-center/analysis',
    any,
    any,
    never
  >
  '/data-center/reports': RouteRecordInfo<
    '/data-center/reports',
    '/data-center/reports',
    any,
    any,
    never
  >
  '/asset': RouteRecordInfo<
    '/asset',
    '/asset',
    any,
    any,
    never
  >
  '/asset/management/project': RouteRecordInfo<
    '/asset/management/project',
    '/asset/management/project',
    any,
    any,
    never
  >
  '/asset/management/add': RouteRecordInfo<
    '/asset/management/add',
    '/asset/management/add',
    any,
    any,
    never
  >
  '/asset/management/edit': RouteRecordInfo<
    '/asset/management/edit',
    '/asset/management/edit',
    any,
    any,
    never
  >
  '/asset/management/import': RouteRecordInfo<
    '/asset/management/import',
    '/asset/management/import',
    any,
    any,
    never
  >
  '/asset/management/detail': RouteRecordInfo<
    '/asset/management/detail',
    '/asset/management/detail',
    any,
    any,
    never
  >
  '/asset/management/building-floor': RouteRecordInfo<
    '/asset/management/building-floor',
    '/asset/management/building-floor',
    any,
    any,
    never
  >
  '/asset/management/add-building': RouteRecordInfo<
    '/asset/management/add-building',
    '/asset/management/add-building',
    any,
    any,
    never
  >
  '/asset/management/edit-building/:id': RouteRecordInfo<
    '/asset/management/edit-building/:id',
    '/asset/management/edit-building/:id',
    {id: ParamValue<true>},
    {id: ParamValue<false>},
    never
  >
  '/asset/management/detail-building/:id': RouteRecordInfo<
    '/asset/management/detail-building/:id',
    '/asset/management/detail-building/:id',
    {id: ParamValue<true>},
    {id: ParamValue<false>},
    never
  >
  '/asset/management/add-floor': RouteRecordInfo<
    '/asset/management/add-floor',
    '/asset/management/add-floor',
    any,
    any,
    never
  >
  '/asset/management/edit-floor/:id': RouteRecordInfo<
    '/asset/management/edit-floor/:id',
    '/asset/management/edit-floor/:id',
    {id: ParamValue<true>},
    {id: ParamValue<false>},
    never
  >
  '/asset/management/detail-floor/:id': RouteRecordInfo<
    '/asset/management/detail-floor/:id',
    '/asset/management/detail-floor/:id',
    {id: ParamValue<true>},
    {id: ParamValue<false>},
    never
  >
  '/asset/management/enclosure-floor': RouteRecordInfo<
    '/asset/management/enclosure-floor',
    '/asset/management/enclosure-floor',
    any,
    any,
    never
  >
  '/asset/management/add-enclosure': RouteRecordInfo<
    '/asset/management/add-enclosure',
    '/asset/management/add-enclosure',
    any,
    any,
    never
  >
  '/asset/statistics': RouteRecordInfo<
    '/asset/statistics',
    '/asset/statistics',
    any,
    any,
    never
  >
  '/asset/system/dictionary': RouteRecordInfo<
    '/asset/system/dictionary',
    '/asset/system/dictionary',
    any,
    any,
    never
  >
  '/lease': RouteRecordInfo<
    '/lease',
    '/lease',
    any,
    any,
    never
  >
  '/lease/management': RouteRecordInfo<
    '/lease/management',
    '/lease/management',
    any,
    any,
    never
  >
  '/lease/contract': RouteRecordInfo<
    '/lease/contract',
    '/lease/contract',
    any,
    any,
    never
  >
  '/lease/rental': RouteRecordInfo<
    '/lease/rental',
    '/lease/rental',
    any,
    any,
    never
  >
  '/property': RouteRecordInfo<
    '/property',
    '/property',
    any,
    any,
    never
  >
  '/property/settings': RouteRecordInfo<
    '/property/settings',
    '/property/settings',
    any,
    any,
    never
  >
  '/property/charge-standard': RouteRecordInfo<
    '/property/charge-standard',
    '/property/charge-standard',
    any,
    any,
    never
  >
  '/property/charge-management': RouteRecordInfo<
    '/property/charge-management',
    '/property/charge-management',
    any,
    any,
    never
  >
  '/property/charge-report': RouteRecordInfo<
    '/property/charge-report',
    '/property/charge-report',
    any,
    any,
    never
  >
  '/iot': RouteRecordInfo<
    '/iot',
    '/iot',
    any,
    any,
    never
  >
  '/iot/device-management': RouteRecordInfo<
    '/iot/device-management',
    '/iot/device-management',
    any,
    any,
    never
  >
  '/iot/monitoring': RouteRecordInfo<
    '/iot/monitoring',
    '/iot/monitoring',
    any,
    any,
    never
  >
  '/iot/analysis': RouteRecordInfo<
    '/iot/analysis',
    '/iot/analysis',
    any,
    any,
    never
  >
  '/management': RouteRecordInfo<
    '/management',
    '/management',
    any,
    any,
    never
  >
  '/management/personnel': RouteRecordInfo<
    '/management/personnel',
    '/management/personnel',
    any,
    any,
    never
  >
  '/management/personnel/list': RouteRecordInfo<
    '/management/personnel/list',
    '/management/personnel/list',
    any,
    any,
    never
  >
  '/management/personnel/add': RouteRecordInfo<
    '/management/personnel/add',
    '/management/personnel/add',
    any,
    any,
    never
  >
  '/management/personnel/detail/:id': RouteRecordInfo<
    '/management/personnel/detail/:id',
    '/management/personnel/detail/:id',
    {id: ParamValue<true>},
    {id: ParamValue<false>},
    never
  >
  '/management/personnel/import': RouteRecordInfo<
    '/management/personnel/import',
    '/management/personnel/import',
    any,
    any,
    never
  >
  '/management/personnel/execute': RouteRecordInfo<
    '/management/personnel/execute',
    '/management/personnel/execute',
    any,
    any,
    never
  >
  '/management/personnel/complete': RouteRecordInfo<
    '/management/personnel/complete',
    '/management/personnel/complete',
    any,
    any,
    never
  >
  '/management/department': RouteRecordInfo<
    '/management/department',
    '/management/department',
    any,
    any,
    never
  >
  '/management/permission': RouteRecordInfo<
    '/management/permission',
    '/management/permission',
    any,
    any,
    never
  >
  '/login': RouteRecordInfo<
    'login',
    '/login',
    any,
    any,
    never
  >
  '/': RouteRecordInfo<
    '/',
    '/',
    any,
    any,
    never
  >
  '/404': RouteRecordInfo<
    '404',
    '/404',
    any,
    any,
    never
  >
  '/:pathMatch(.*)*': RouteRecordInfo<
    '/:pathMatch(.*)*',
    '/:pathMatch(.*)*',
    {pathMatch: ParamValue<true>},
    {pathMatch: ParamValue<false>},
    never
  >
}

declare module 'vue-router' {
  interface TypesConfig {
    RouteNamedMap: RouteNamedMap
  }
}
