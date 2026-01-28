import http from '../service'

export const iamCommon = {
  // 省_市_区_商圈 | object:{pid:上级ID}
  iamCommonAreaList(payload: Record<string, any>) {
    return http.post<Res<PairModel[]>>('/iam/common/area/list', payload)
  },
}
