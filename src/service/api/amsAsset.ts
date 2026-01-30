import http from '../service'

export const amsAsset = {
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
  // 启用/禁用项目 | object:{buildingId:楼栋编码,enable:bool}
  amsAssetBuildingEnable(payload: Record<string, any>) {
    return http.post<Res<Record<string, any>>>('/ams/asset-building/enable', payload)
  },
  // 删除楼栋
  amsAssetBuildingDelete(payload: Record<string, any>) {
    return http.post<Res<Record<string, any>>>('/ams/asset-building/delete', payload)
  },

  // 楼层列表
  amsAssetFloorList(payload: AssetFloorListDTO) {
    return http.post<Res<AssetFloorVO[]>>('/ams/asset-floor/list', payload)
  },
  // 启用/禁用楼层 | object:{floorId:楼层编码,enable:bool}
  amsAssetFloorEnable(payload: Record<string, any>) {
    return http.post<Res<Record<string, any>>>('/ams/asset-floor/enable', payload)
  },
  // 删除楼层
  amsAssetFloorDelete(payload: Record<string, any>) {
    return http.post<Res<Record<string, any>>>('/ams/asset-floor/delete', payload)
  },
}
