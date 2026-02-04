import http from '../service'

export const amsSysDic = {
  // 新增/修改字典
  amsSysDicUpsert(payload: SysDicUpsertDTO) {
    return http.post<Res<string>>('/ams/sys-dic/upsert', payload)
  },

  // 字典列表
  amsSysDicList(payload: SysDicListDTO) {
    return http.post<Res<SysDicVO[]>>('/ams/sys-dic/list', payload)
  },

  // 字典详情 | object:{dicId:字典ID}
  amsSysDicGet(payload: {dicId: any}) {
    return http.post<Res<SysDicVO>>('/ams/sys-dic/get', payload)
  },

  // 启用/禁用字典 | object:{dicId:字典ID,enable:bool}
  amsSysDicEnable(payload: {dicId: any; enable: boolean}) {
    return http.post<Res<Record<string, any>>>('/ams/sys-dic/enable', payload)
  },

  // 删除字典 | object:{dicId:字典ID}
  amsSysDicDelete(payload: {dicId: any}) {
    return http.post<Res<Record<string, any>>>('/ams/sys-dic/delete', payload)
  },
}
