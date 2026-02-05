import http from '../service'

export const amsAsset = {
  // 查询所有项目
  amsAssetProjectSelectAll() {
    return http.post<Res<Record<string, any>>>('/ams/asset-project/selectAll')
  },
  // 项目列表
  amsAssetProjectList(payload: AssetProjectListDTO) {
    return http.post<Res<AssetProjectVO[]>>('/ams/asset-project/list', payload)
  },
  // 启用/禁用项目 | object:{projectId:项目编码,enable:bool}
  amsAssetProjectEnable(payload: Record<string, any>) {
    return http.post<Res<Record<string, any>>>('/ams/asset-project/enable', payload)
  },
  // 删除项目
  amsAssetProjectDelete(payload: Record<string, any>) {
    return http.post<Res<Record<string, any>>>('/ams/asset-project/delete', payload)
  },
  // 新增项目
  amsAssetProjectInsert(payload: AssetProjectUpsertDTO) {
    return http.post<Res<Record<string, any>>>('/ams/asset-project/insert', payload)
  },

  // 楼栋列表
  amsAssetBuildingList(payload: AssetBuildingListDTO) {
    return http.post<Res<AssetBuildingVO[]>>('/ams/asset-building/list', payload)
  },
  // 新增楼栋
  amsAssetBuildingInsert(payload: AssetBuildingInsertDTO) {
    return http.post<Res<Record<string, any>>>('/ams/asset-building/insert', payload)
  },
  // 更新楼栋
  amsAssetBuildingUpdate(payload: AssetBuildingUpdateDTO) {
    return http.post<Res<Record<string, any>>>('/ams/asset-building/update', payload)
  },
  // 楼栋详情
  amsAssetBuildingGet(payload: Record<string, any>) {
    return http.post<Res<AssetBuildingVO>>('/ams/asset-building/get', payload)
  },
  // 删除楼栋
  amsAssetBuildingDelete(payload: Record<string, any>) {
    return http.post<Res<Record<string, any>>>('/ams/asset-building/delete', payload)
  },
  // 启用/禁用项目 | object:{buildingId:楼栋编码,enable:bool}
  amsAssetBuildingEnable(payload: Record<string, any>) {
    return http.post<Res<Record<string, any>>>('/ams/asset-building/enable', payload)
  },

  // 楼层列表
  amsAssetFloorList(payload: AssetFloorListDTO) {
    return http.post<Res<AssetFloorVO[]>>('/ams/asset-floor/list', payload)
  },
  // 新增楼层
  amsAssetFloorInsert(payload: AssetFloorBaseDTO) {
    return http.post<Res<string>>('/ams/asset-floor/insert', payload)
  },
  // 更新楼层
  amsAssetFloorUpdate(payload: AssetFloorBaseDTO) {
    return http.post<Res<string>>('/ams/asset-floor/update', payload)
  },
  // 楼层详情
  amsAssetFloorGet(payload: Record<string, any>) {
    return http.post<Res<AssetFloorVO>>('/ams/asset-floor/get', payload)
  },
  // 删除楼层
  amsAssetFloorDelete(payload: Record<string, any>) {
    return http.post<Res<Record<string, any>>>('/ams/asset-floor/delete', payload)
  },
  // 启用/禁用楼层 | object:{floorId:楼层编码,enable:bool}
  amsAssetFloorEnable(payload: Record<string, any>) {
    return http.post<Res<Record<string, any>>>('/ams/asset-floor/enable', payload)
  },

  // 围合列表
  amsAssetEnclosureList(payload: AssetEnclosureListDTO) {
    return http.post<Res<AssetEnclosureVO[]>>('/ams/asset-enclosure/list', payload)
  },
  // 新增围合
  amsAssetEnclosureInsert(payload: AssetEnclosureInsertDTO) {
    return http.post<Res<Record<string, any>>>('/ams/asset-enclosure/insert', payload)
  },
}
