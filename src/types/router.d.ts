// 这段可以直接添加到你的任何 '.ts' 文件中，例如 'router.ts'
// 也可以添加到一个 '.d.ts' 文件中。确保这个文件包含在
// 项目的 'tsconfig.json' 中的 "file" 字段内。
import {RouteRecordInfo, RouteRecordName, ParamValue} from 'vue-router'

// 为了确保这个文件被当作一个模块，添加至少一个 'export' 声明
export interface RouteNamedMap {
  '/data-center': RouteRecordInfo<
    '/data-center', // name
    '/data-center', // path
    any,
    any,
    never
  >
  '/data-center/dashboard': RouteRecordInfo<
    '/data-center/dashboard', // name
    '/data-center/dashboard', // path
    any,
    any,
    never
  >
  '/data-center/analysis': RouteRecordInfo<
    '/data-center/analysis', // name
    '/data-center/analysis', // path
    any,
    any,
    never
  >
  '/data-center/reports': RouteRecordInfo<
    '/data-center/reports', // name
    '/data-center/reports', // path
    any,
    any,
    never
  >
  '/asset': RouteRecordInfo<
    '/asset', // name
    '/asset', // path
    any,
    any,
    never
  >
  '/asset/management/project': RouteRecordInfo<
    '/asset/management/project', // name
    '/asset/management/project', // path
    any,
    any,
    never
  >
  '/asset/management/add': RouteRecordInfo<
    '/asset/management/add', // name
    '/asset/management/add', // path
    any,
    any,
    never
  >
  '/asset/management/edit': RouteRecordInfo<
    '/asset/management/edit', // name
    '/asset/management/edit', // path
    any,
    any,
    never
  >
  '/asset/management/import': RouteRecordInfo<
    '/asset/management/import', // name
    '/asset/management/import', // path
    any,
    any,
    never
  >
  '/asset/management/detail': RouteRecordInfo<
    '/asset/management/detail', // name
    '/asset/management/detail', // path
    any,
    any,
    never
  >
  '/asset/management/building-floor': RouteRecordInfo<
    '/asset/management/building-floor', // name
    '/asset/management/building-floor', // path
    any,
    any,
    never
  >
  '/asset/management/add-building': RouteRecordInfo<
    '/asset/management/add-building', // name
    '/asset/management/add-building', // path
    any,
    any,
    never
  >
  '/asset/edit-building/:id': RouteRecordInfo<
    '/asset/edit-building/:id', // name
    '/asset/edit-building/:id', // path
    {id: ParamValue<true>},
    {id: ParamValue<false>},
    never
  >
  '/asset/detail-building/:id': RouteRecordInfo<
    '/asset/detail-building/:id', // name
    '/asset/detail-building/:id', // path
    {id: ParamValue<true>},
    {id: ParamValue<false>},
    never
  >
  '/asset/add-floor': RouteRecordInfo<
    '/asset/add-floor', // name
    '/asset/add-floor', // path
    any,
    any,
    never
  >
  '/asset/edit-floor/:id': RouteRecordInfo<
    '/asset/edit-floor/:id', // name
    '/asset/edit-floor/:id', // path
    {id: ParamValue<true>},
    {id: ParamValue<false>},
    never
  >
  '/asset/detail-floor/:id': RouteRecordInfo<
    '/asset/detail-floor/:id', // name
    '/asset/detail-floor/:id', // path
    {id: ParamValue<true>},
    {id: ParamValue<false>},
    never
  >
  '/asset/statistics': RouteRecordInfo<
    '/asset/statistics', // name
    '/asset/statistics', // path
    any,
    any,
    never
  >
  '/asset/system/dictionary': RouteRecordInfo<
    '/asset/system/dictionary', // name
    '/asset/system/dictionary', // path
    any,
    any,
    never
  >
  '/lease': RouteRecordInfo<
    '/lease', // name
    '/lease', // path
    any,
    any,
    never
  >
  '/lease/management': RouteRecordInfo<
    '/lease/management', // name
    '/lease/management', // path
    any,
    any,
    never
  >
  '/lease/contract': RouteRecordInfo<
    '/lease/contract', // name
    '/lease/contract', // path
    any,
    any,
    never
  >
  '/lease/rental': RouteRecordInfo<
    '/lease/rental', // name
    '/lease/rental', // path
    any,
    any,
    never
  >
  '/property': RouteRecordInfo<
    '/property', // name
    '/property', // path
    any,
    any,
    never
  >
  '/property/settings': RouteRecordInfo<
    '/property/settings', // name
    '/property/settings', // path
    any,
    any,
    never
  >
  '/property/charge-standard': RouteRecordInfo<
    '/property/charge-standard', // name
    '/property/charge-standard', // path
    any,
    any,
    never
  >
  '/property/charge-management': RouteRecordInfo<
    '/property/charge-management', // name
    '/property/charge-management', // path
    any,
    any,
    never
  >
  '/property/charge-report': RouteRecordInfo<
    '/property/charge-report', // name
    '/property/charge-report', // path
    any,
    any,
    never
  >
  '/iot': RouteRecordInfo<
    '/iot', // name
    '/iot', // path
    any,
    any,
    never
  >
  '/iot/device-management': RouteRecordInfo<
    '/iot/device-management', // name
    '/iot/device-management', // path
    any,
    any,
    never
  >
  '/iot/monitoring': RouteRecordInfo<
    '/iot/monitoring', // name
    '/iot/monitoring', // path
    any,
    any,
    never
  >
  '/iot/analysis': RouteRecordInfo<
    '/iot/analysis', // name
    '/iot/analysis', // path
    any,
    any,
    never
  >
  '/management': RouteRecordInfo<
    '/management', // name
    '/management', // path
    any,
    any,
    never
  >
  '/management/personnel/list': RouteRecordInfo<
    '/management/personnel/list', // name
    '/management/personnel/list', // path
    any,
    any,
    never
  >
  '/management/personnel/add': RouteRecordInfo<
    '/management/personnel/add', // name
    '/management/personnel/add', // path
    any,
    any,
    never
  >
  '/management/personnel/detail/:id': RouteRecordInfo<
    '/management/personnel/detail/:id', // name
    '/management/personnel/detail/:id', // path
    {id: ParamValue<true>},
    {id: ParamValue<false>},
    never
  >
  '/management/personnel/import': RouteRecordInfo<
    '/management/personnel/import', // name
    '/management/personnel/import', // path
    any,
    any,
    never
  >
  '/management/personnel/execute': RouteRecordInfo<
    '/management/personnel/execute', // name
    '/management/personnel/execute', // path
    any,
    any,
    never
  >
  '/management/personnel/complete': RouteRecordInfo<
    '/management/personnel/complete', // name
    '/management/personnel/complete', // path
    any,
    any,
    never
  >
  '/management/department': RouteRecordInfo<
    '/management/department', // name
    '/management/department', // path
    any,
    any,
    never
  >
  '/management/role': RouteRecordInfo<
    '/management/role', // name
    '/management/role', // path
    any,
    any,
    never
  >
  '/management/permission': RouteRecordInfo<
    '/management/permission', // name
    '/management/permission', // path
    any,
    any,
    never
  >
  '/login': RouteRecordInfo<
    'login', // name
    '/login', // path
    any,
    any,
    never
  >
  '/': RouteRecordInfo<
    '/', // name
    '/', // path
    any,
    any,
    never
  >
  '/404': RouteRecordInfo<
    '404', // name
    '/404', // path
    any,
    any,
    never
  >
  '/:pathMatch(.*)*': RouteRecordInfo<
    '/:pathMatch(.*)*', // name
    '/:pathMatch(.*)*', // path
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
