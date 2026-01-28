import http from '../service'

export const amsAsset = {
  // 项目列表
  amsAssetProjectList(payload: AssetProjectListDTO) {
    return http.post<Res<AssetProjectVO[]>>('/ams/asset-project/list', payload)
  }
}
