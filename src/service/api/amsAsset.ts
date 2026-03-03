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

// 商铺列表
export function amsAssetShopList(payload: AssetShopListDTO) {
  return http.post<Res<AssetShopVO[]>>('/ams/asset-shop/list', payload)
}
// 新增商铺
export function amsAssetShopInsert(payload: AssetShopInsertDTO) {
  return http.post<Res<Record<string, any>>>('/ams/asset-shop/insert', payload)
}
// 更新商铺
export function amsAssetShopUpdate(payload: AssetShopUpsertDTO) {
  return http.post<Res<Record<string, any>>>('/ams/asset-shop/update', payload)
}
// 商铺详情
export function amsAssetShopGet(payload: Record<string, any>) {
  return http.post<Res<AssetShopVO>>('/ams/asset-shop/get', payload)
}
// 删除商铺
export function amsAssetShopDelete(payload: Record<string, any>) {
  return http.post<Res<Record<string, any>>>('/ams/asset-shop/delete', payload)
}
// 启用/禁用商业 | object:{shopId:住宅编码,enable:bool}
export function amsAssetShopEnable(payload: {shopId: any; enable: boolean}) {
  return http.post<Res<Record<string, any>>>('/ams/asset-shop/enable', payload)
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

// 停车场列表
export function amsAssetParkingList(payload: AssetParkingListDTO) {
  return http.post<Res<AssetParkingVO[]>>('/ams/asset-parking/list', payload)
}
// 新增停车场
export function amsAssetParkingUpsert(payload: AssetParkingInsertDTO) {
  return http.post<Res<Record<string, any>>>('/ams/asset-parking/upsert', payload)
}
// 更新停车场
export function amsAssetParkingUpdate(payload: AssetParkingDTO) {
  return http.post<Res<Record<string, any>>>('/ams/asset-parking/update', payload)
}
// 停车场详情 | object:{parkingId:停车场编码}
export function amsAssetParkingGet(payload: {parkingId: any}) {
  return http.post<Res<AssetParkingVO>>('/ams/asset-parking/get', payload)
}
// 删除停车场 | object:{parkingId:停车场编码}
export function amsAssetParkingDelete(payload: {parkingId: any}) {
  return http.post<Res<Record<string, any>>>('/ams/asset-parking/delete', payload)
}
// 启用/禁用停车场 | object:{parkingId:停车场编码,enable:bool}
export function amsAssetParkingEnable(payload: {parkingId: any; enable: boolean}) {
  return http.post<Res<Record<string, any>>>('/ams/asset-parking/enable', payload)
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

// 固定资产管理
export function amsAssetFixedList(payload: AssetFixedListDTO) {
  return http.post<Res<AssetFixedVO[]>>('/ams/asset-fixed/list', payload)
}

export function amsAssetFixedInsert(payload: AssetFixedUpsertDTO) {
  return http.post<Res<Record<string, any>>>('/ams/asset-fixed/insert', payload)
}

export function amsAssetFixedUpdate(payload: AssetFixedUpsertDTO) {
  return http.post<Res<Record<string, any>>>('/ams/asset-fixed/update', payload)
}

// 删除固定资产
export function amsAssetFixedDelete(payload: {fixedId: string}) {
  return http.post<Res<Record<string, any>>>('/ams/asset-fixed/delete', payload)
}

// 启用/禁用固定资产 | object:{fixedId:固定资产编码,enable:bool}
export function amsAssetFixedEnable(payload: {fixedId: string; enable: boolean}) {
  return http.post<Res<Record<string, any>>>('/ams/asset-fixed/enable', payload)
}

// 批量启用/禁用固定资产
export function amsAssetFixedBatchEnable(payload: AssetFixedBatchEnableDTO) {
  return http.post<Res<Record<string, any>>>('/ams/asset-fixed/batch-enable', payload)
}

// 生成固定资产编码
export function amsAssetFixedGenerateFixedId(payload: AssetFixedIdGenerateDTO) {
  return http.post<Res<string>>('/ams/asset-fixed/generate-fixed-id', payload)
}

export function amsAssetFixedGet(payload: {fixedId: string}) {
  return http.post<Res<AssetFixedVO>>('/ams/asset-fixed/get', payload)
}
