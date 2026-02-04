import http from '../service'

export const iamCommon = {
  // 省_市_区_商圈 | object:{pid:上级ID}
  iamCommonAreaList(payload: {pid: any}) {
    return http.post<Res<PairModel[]>>('/iam/common/area/list', payload)
  },
  // 树形码表 | object:{dicType:字典类型}
  iamCommonDicListTree(payload: {dicType: any}) {
    return http.post<Res<SysDicVO[]>>('/iam/common/dic/list-tree', payload)
  },
}
