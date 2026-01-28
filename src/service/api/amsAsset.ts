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
}
