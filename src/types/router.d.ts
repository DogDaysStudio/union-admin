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
  '/asset/management/edit/:id': RouteRecordInfo<
    '/asset/management/edit/:id', // name
    '/asset/management/edit/:id', // path
    {id: ParamValue<true>},
    {id: ParamValue<false>},
    never
  >
  '/asset/management/detail/:id': RouteRecordInfo<
    '/asset/management/detail/:id', // name
    '/asset/management/detail/:id', // path
    {id: ParamValue<true>},
    {id: ParamValue<false>},
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
  '/asset/management/edit-building/:id': RouteRecordInfo<
    '/asset/management/edit-building/:id', // name
    '/asset/management/edit-building/:id', // path
    {id: ParamValue<true>},
    {id: ParamValue<false>},
    never
  >
  '/asset/management/detail-building/:id': RouteRecordInfo<
    '/asset/management/detail-building/:id', // name
    '/asset/management/detail-building/:id', // path
    {id: ParamValue<true>},
    {id: ParamValue<false>},
    never
  >
  '/asset/management/add-floor': RouteRecordInfo<
    '/asset/management/add-floor', // name
    '/asset/management/add-floor', // path
    any,
    any,
    never
  >
  '/asset/management/edit-floor/:id': RouteRecordInfo<
    '/asset/management/edit-floor/:id', // name
    '/asset/management/edit-floor/:id', // path
    {id: ParamValue<true>},
    {id: ParamValue<false>},
    never
  >
  '/asset/management/detail-floor/:id': RouteRecordInfo<
    '/asset/management/detail-floor/:id', // name
    '/asset/management/detail-floor/:id', // path
    {id: ParamValue<true>},
    {id: ParamValue<false>},
    never
  >
  '/asset/management/enclosure-floor': RouteRecordInfo<
    '/asset/management/enclosure-floor', // name
    '/asset/management/enclosure-floor', // path
    any,
    any,
    never
  >
  '/asset/management/add-enclosure': RouteRecordInfo<
    '/asset/management/add-enclosure', // name
    '/asset/management/add-enclosure', // path
    any,
    any,
    never
  >
  '/asset/management/edit-enclosure/:id': RouteRecordInfo<
    '/asset/management/edit-enclosure/:id', // name
    '/asset/management/edit-enclosure/:id', // path
    {id: ParamValue<true>},
    {id: ParamValue<false>},
    never
  >
  '/asset/management/detail-enclosure/:id': RouteRecordInfo<
    '/asset/management/detail-enclosure/:id', // name
    '/asset/management/detail-enclosure/:id', // path
    {id: ParamValue<true>},
    {id: ParamValue<false>},
    never
  >
  '/asset/management/add-enclosure-floor': RouteRecordInfo<
    '/asset/management/add-enclosure-floor', // name
    '/asset/management/add-enclosure-floor', // path
    any,
    any,
    never
  >
  '/asset/management/edit-enclosure-floor/:id': RouteRecordInfo<
    '/asset/management/edit-enclosure-floor/:id', // name
    '/asset/management/edit-enclosure-floor/:id', // path
    {id: ParamValue<true>},
    {id: ParamValue<false>},
    never
  >
  '/asset/management/detail-enclosure-floor/:id': RouteRecordInfo<
    '/asset/management/detail-enclosure-floor/:id', // name
    '/asset/management/detail-enclosure-floor/:id', // path
    {id: ParamValue<true>},
    {id: ParamValue<false>},
    never
  >
  '/asset/management/room': RouteRecordInfo<
    '/asset/management/room', // name
    '/asset/management/room', // path
    any,
    any,
    never
  >
  '/asset/management/add-room': RouteRecordInfo<
    '/asset/management/add-room', // name
    '/asset/management/add-room', // path
    any,
    any,
    never
  >
  '/asset/management/edit-room/:roomId': RouteRecordInfo<
    '/asset/management/edit-room/:roomId', // name
    '/asset/management/edit-room/:roomId', // path
    {roomId: ParamValue<true>},
    {roomId: ParamValue<false>},
    never
  >
  '/asset/management/detail-room/:roomId': RouteRecordInfo<
    '/asset/management/detail-room/:roomId', // name
    '/asset/management/detail-room/:roomId', // path
    {roomId: ParamValue<true>},
    {roomId: ParamValue<false>},
    never
  >
  '/asset/management/shop': RouteRecordInfo<
    '/asset/management/shop', // name
    '/asset/management/shop', // path
    any,
    any,
    never
  >
  '/asset/management/add-shop': RouteRecordInfo<
    '/asset/management/add-shop', // name
    '/asset/management/add-shop', // path
    any,
    any,
    never
  >
  '/asset/management/fixed/add': RouteRecordInfo<
    '/asset/management/fixed/add', // name
    '/asset/management/fixed/add', // path
    any,
    any,
    never
  >
  '/asset/management/fixed/edit-fixed/:id': RouteRecordInfo<
    '/asset/management/fixed/edit-fixed/:id', // name
    '/asset/management/fixed/edit-fixed/:id', // path
    {id: ParamValue<true>},
    {id: ParamValue<false>},
    never
  >
  '/asset/management/fixed/detail-fixed/:id': RouteRecordInfo<
    '/asset/management/fixed/detail-fixed/:id', // name
    '/asset/management/fixed/detail-fixed/:id', // path
    {id: ParamValue<true>},
    {id: ParamValue<false>},
    never
  >
  '/asset/management/edit-shop/:shopId': RouteRecordInfo<
    '/asset/management/edit-shop/:shopId', // name
    '/asset/management/edit-shop/:shopId', // path
    {shopId: ParamValue<true>},
    {shopId: ParamValue<false>},
    never
  >
  '/asset/management/detail-shop/:shopId': RouteRecordInfo<
    '/asset/management/detail-shop/:shopId', // name
    '/asset/management/detail-shop/:shopId', // path
    {shopId: ParamValue<true>},
    {shopId: ParamValue<false>},
    never
  >
  '/asset/management/point': RouteRecordInfo<
    '/asset/management/point', // name
    '/asset/management/point', // path
    any,
    any,
    never
  >
  '/asset/management/add-point': RouteRecordInfo<
    '/asset/management/add-point', // name
    '/asset/management/add-point', // path
    any,
    any,
    never
  >
  '/asset/management/edit-point/:id': RouteRecordInfo<
    '/asset/management/edit-point/:id', // name
    '/asset/management/edit-point/:id', // path
    {id: ParamValue<true>},
    {id: ParamValue<false>},
    never
  >
  '/asset/management/detail-point/:id': RouteRecordInfo<
    '/asset/management/detail-point/:id', // name
    '/asset/management/detail-point/:id', // path
    {id: ParamValue<true>},
    {id: ParamValue<false>},
    never
  >
  '/asset/management/fixed': RouteRecordInfo<
    '/asset/management/fixed', // name
    '/asset/management/fixed', // path
    any,
    any,
    never
  >
  '/asset/management/parking': RouteRecordInfo<
    '/asset/management/parking', // name
    '/asset/management/parking', // path
    any,
    any,
    never
  >
  '/asset/management/add-parking-lot': RouteRecordInfo<
    '/asset/management/add-parking-lot', // name
    '/asset/management/add-parking-lot', // path
    any,
    any,
    never
  >
  '/asset/management/edit-parking-lot/:id': RouteRecordInfo<
    '/asset/management/edit-parking-lot/:id', // name
    '/asset/management/edit-parking-lot/:id', // path
    {id: ParamValue<true>},
    {id: ParamValue<false>},
    never
  >
  '/asset/management/detail-parking-lot/:id': RouteRecordInfo<
    '/asset/management/detail-parking-lot/:id', // name
    '/asset/management/detail-parking-lot/:id', // path
    {id: ParamValue<true>},
    {id: ParamValue<false>},
    never
  >
  '/asset/management/add-parking-space': RouteRecordInfo<
    '/asset/management/add-parking-space', // name
    '/asset/management/add-parking-space', // path
    any,
    any,
    never
  >
  '/asset/management/detail-parking-space/:id': RouteRecordInfo<
    '/asset/management/detail-parking-space/:id', // name
    '/asset/management/detail-parking-space/:id', // path
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
  '/management/personnel/edit/:userId': RouteRecordInfo<
    '/management/personnel/edit/:userId', // name
    '/management/personnel/edit/:userId', // path
    {userId: ParamValue<true>},
    {userId: ParamValue<false>},
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
  '/management/role/list': RouteRecordInfo<
    '/management/role/list', // name
    '/management/role/list', // path
    any,
    any,
    never
  >
  '/management/role/permission/:roleId': RouteRecordInfo<
    '/management/role/permission/:roleId', // name
    '/management/role/permission/:roleId', // path
    {roleId: ParamValue<true>},
    {roleId: ParamValue<false>},
    never
  >
  '/management/permission': RouteRecordInfo<
    '/management/permission', // name
    '/management/permission', // path
    any,
    any,
    never
  >
  '/management/log': RouteRecordInfo<
    '/management/log', // name
    '/management/log', // path
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
