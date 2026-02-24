import http from '../service'

// 项目列表
export function amsAssetProjectList(payload: AssetProjectListDTO) {
  return http.post<Res<AssetProjectVO[]>>('/ams/asset-project/list', payload)
}
// 新增项目
export function amsAssetProjectInsert(payload: AssetProjectUpsertDTO) {
  return http.post<Res<Record<string, any>>>('/ams/asset-project/insert', payload)
}
// 更新项目
export function amsAssetProjectUpdate(payload: AssetProjectUpsertDTO) {
  return http.post<Res<Record<string, any>>>('/ams/asset-project/update', payload)
}
// 项目详情
export function amsAssetProjectGet(payload: Record<string, any>) {
  return http.post<Res<AssetProjectVO>>('/ams/asset-project/get', payload)
}
// 删除项目
export function amsAssetProjectDelete(payload: Record<string, any>) {
  return http.post<Res<Record<string, any>>>('/ams/asset-project/delete', payload)
}
// 启用/禁用项目 | object:{projectId:项目编码,enable:bool}
export function amsAssetProjectEnable(payload: Record<string, any>) {
  return http.post<Res<Record<string, any>>>('/ams/asset-project/enable', payload)
}

// 楼栋列表
export function amsAssetBuildingList(payload: AssetBuildingListDTO) {
  return http.post<Res<AssetBuildingVO[]>>('/ams/asset-building/list', payload)
}
// 新增楼栋
export function amsAssetBuildingInsert(payload: AssetBuildingInsertDTO) {
  return http.post<Res<Record<string, any>>>('/ams/asset-building/insert', payload)
}
// 更新楼栋
export function amsAssetBuildingUpdate(payload: AssetBuildingUpdateDTO) {
  return http.post<Res<Record<string, any>>>('/ams/asset-building/update', payload)
}
// 楼栋详情
export function amsAssetBuildingGet(payload: Record<string, any>) {
  return http.post<Res<AssetBuildingVO>>('/ams/asset-building/get', payload)
}
// 删除楼栋
export function amsAssetBuildingDelete(payload: Record<string, any>) {
  return http.post<Res<Record<string, any>>>('/ams/asset-building/delete', payload)
}
// 启用/禁用项目 | object:{buildingId:楼栋编码,enable:bool}
export function amsAssetBuildingEnable(payload: Record<string, any>) {
  return http.post<Res<Record<string, any>>>('/ams/asset-building/enable', payload)
}

// 楼层列表
export function amsAssetFloorList(payload: AssetFloorListDTO) {
  return http.post<Res<AssetFloorVO[]>>('/ams/asset-floor/list', payload)
}
// 新增楼层
export function amsAssetFloorInsert(payload: AssetFloorDTO) {
  return http.post<Res<string>>('/ams/asset-floor/insert', payload)
}
// 更新楼层
export function amsAssetFloorUpdate(payload: AssetFloorDTO) {
  return http.post<Res<string>>('/ams/asset-floor/update', payload)
}
// 楼层详情
export function amsAssetFloorGet(payload: Record<string, any>) {
  return http.post<Res<AssetFloorVO>>('/ams/asset-floor/get', payload)
}
// 删除楼层
export function amsAssetFloorDelete(payload: Record<string, any>) {
  return http.post<Res<Record<string, any>>>('/ams/asset-floor/delete', payload)
}
// 启用/禁用楼层 | object:{floorId:楼层编码,enable:bool}
export function amsAssetFloorEnable(payload: Record<string, any>) {
  return http.post<Res<Record<string, any>>>('/ams/asset-floor/enable', payload)
}

// 围合列表
export function amsAssetEnclosureList(payload: AssetEnclosureListDTO) {
  return http.post<Res<AssetEnclosureVO[]>>('/ams/asset-enclosure/list', payload)
}
// 新增围合
export function amsAssetEnclosureInsert(payload: AssetEnclosureInsertDTO) {
  return http.post<Res<Record<string, any>>>('/ams/asset-enclosure/insert', payload)
}
// 更新围合
export function amsAssetEnclosureUpdate(payload: AssetEnclosureUpdateDTO) {
  return http.post<Res<Record<string, any>>>('/ams/asset-enclosure/update', payload)
}
// 围合详情
export function amsAssetEnclosureGet(payload: Record<string, any>) {
  return http.post<Res<AssetEnclosureVO>>('/ams/asset-enclosure/get', payload)
}
// 删除围合
export function amsAssetEnclosureDelete(payload: Record<string, any>) {
  return http.post<Res<Record<string, any>>>('/ams/asset-enclosure/delete', payload)
}
// 启用/禁用项目 | object:{enclosureId:围合编码,enable:bool}
export function amsAssetEnclosureEnable(payload: {enclosureId: any; enable: boolean}) {
  return http.post<Res<Record<string, any>>>('/ams/asset-enclosure/enable', payload)
}

// 住宅列表
export function amsAssetRoomList(payload: AssetRoomListDTO) {
  return http.post<Res<AssetRoomVO[]>>('/ams/asset-room/list', payload)
}
// 新增住宅
export function amsAssetRoomInsert(payload: AssetRoomInsertDTO) {
  return http.post<Res<Record<string, any>>>('/ams/asset-room/insert', payload)
}
// 更新住宅
export function amsAssetRoomUpdate(payload: AssetRoomUpsertDTO) {
  return http.post<Res<Record<string, any>>>('/ams/asset-room/update', payload)
}
// 住宅详情
export function amsAssetRoomGet(payload: Record<string, any>) {
  return http.post<Res<AssetRoomVO>>('/ams/asset-room/get', payload)
}
// 删除住宅
export function amsAssetRoomDelete(payload: Record<string, any>) {
  return http.post<Res<Record<string, any>>>('/ams/asset-room/delete', payload)
}
// 启用/禁用住宅 | object:{roomId:住宅编码,enable:bool}
export function amsAssetRoomEnable(payload: {roomId: any; enable: boolean}) {
  return http.post<Res<Record<string, any>>>('/ams/asset-room/enable', payload)
}

// 资源列表
export function amsAssetResourceList(payload: AssetResourceListDTO) {
  return http.post<Res<AssetResourceVO[]>>('/ams/asset-resource/list', payload)
}
// 新增资源
export function amsAssetResourceInsert(payload: AssetResourceInsertDTO) {
  return http.post<Res<Record<string, any>>>('/ams/asset-resource/insert', payload)
}
// 更新资源
export function amsAssetResourceUpdate(payload: AssetResourceUpsertDTO) {
  return http.post<Res<Record<string, any>>>('/ams/asset-resource/update', payload)
}
// 资源详情
export function amsAssetResourceGet(payload: Record<string, any>) {
  return http.post<Res<AssetResourceVO>>('/ams/asset-resource/get', payload)
}
// 删除资源
export function amsAssetResourceDelete(payload: Record<string, any>) {
  return http.post<Res<Record<string, any>>>('/ams/asset-resource/delete', payload)
}
// 启用/禁用资源 | object:{resourceId:资源编码,enable:bool}
export function amsAssetResourceEnable(payload: {resourceId: any; enable: boolean}) {
  return http.post<Res<Record<string, any>>>('/ams/asset-resource/enable', payload)
}

// 根据项目查询围合/楼栋
export function amsAssetBuildingSelectBuildingEnclosure(payload: Record<string, any>) {
  return http.post<Res<Record<string, any>>>(
    '/ams/asset-building/select-building-enclosure',
    payload
  )
}

// 根据楼层查询商铺号/房间号
export function amsAssetResourceSelectLocationId(payload: AssetLocationIdListDTO) {
  return http.post<Res<Record<string, any>>>('/ams/asset-resource/select-location-id', payload)
}
