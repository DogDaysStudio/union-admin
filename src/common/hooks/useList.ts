import {iamAuthRoleList} from '@/service/api/iamAuth'
import {onMounted, reactive} from 'vue'

export function useList<T, P = any>(api: (params: P) => Promise<Res<T[]>>, defaultParams: P) {
  const list = reactive<T[]>([])
  onMounted(async () => {
    const {data} = await api(defaultParams)
    if (data?.length) {
      list.push(...(data as any[]))
    }
  })
  return list
}

useList(iamAuthRoleList, {pageNum: 1, pageSize: 10} as AuthRoleListDTO)
