import http from '@/service/service'
import {h, ref} from 'vue'
import {ElMessageBox} from 'element-plus'
import {ExportData} from '@/components'
import {downloadBlob} from '@/utils/util'
import {useLocalStorage} from './useStorage'

type ExportReq<T> = T extends {Req: infer R} ? Partial<R> : never

/**
 * 导出数据
 * @param options 导出配置
 * @param options.meta meta 字段地址
 * @param options.url 导出地址
 * @example
   const {exportData, loading: exportLoading} = useExport({
     meta: '/iam/auth-user/list-export-meta',
     url: '/iam/auth-user/list-export',
   })
  <el-button @click="exportData(searchForm)" :loading="exportLoading">导出</el-button>
 */
export function useExport<URL extends keyof ApiType>(options: {meta: string; url: URL}) {
  const loading = ref(false)
  const meta = ref<PairModel[]>([])

  const storageKey = `useExport:${options.meta}`
  const {value: exportFields, saveValue: saveExportFields} = useLocalStorage(
    storageKey,
    [] as string[]
  )

  /**
   * 导出数据
   * @param formState 页面查询条件
   */
  const exportData = async (formState?: ExportReq<ApiType[URL]>) => {
    if (!meta.value.length) {
      loading.value = true
      try {
        meta.value = await http.post<Res<PairModel[]>>(options.meta).then(res => res.data || [])
        if (!exportFields.value.length) {
          exportFields.value = meta.value.map(item => item.k)
        }
      } finally {
        loading.value = false
      }
    }

    await ElMessageBox({
      title: '导出',
      customClass: 'min-w-[600px]',
      showCancelButton: true,
      confirmButtonText: '导出',
      draggable: true,
      overflow: true,
      message: () =>
        h(ExportData, {
          modelValue: exportFields.value,
          'onUpdate:modelValue': (val: string[]) => {
            exportFields.value = val
          },
          meta: meta.value,
          onSave: (fields: string[]) => {
            console.log('onSave fields:', fields)
            if (!fields.length) return ElMessage.error('请选择保存的字段')

            saveExportFields(fields)
            ElMessage.success('导出字段已保存')
          },
        }),
    })

    if (!exportFields.value.length) return

    try {
      loading.value = true
      await downloadBlob({
        url: options.url,
        body: {...formState, exportFields: exportFields.value},
      })
    } finally {
      loading.value = false
    }
  }

  return {exportData, loading}
}
