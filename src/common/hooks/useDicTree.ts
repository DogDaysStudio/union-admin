import {iamCommonDicListTree} from '@/service/api/iamCommon'
import {onMounted, reactive} from 'vue'

/**
 * 获取字典列表
 * @example
 * const companyDict = useDicTree({dicType: 1001})
 */
export function useDicListTree(params: {dicType: number | string}) {
  const dicTree = reactive<SysDicVO[]>([])

  onMounted(() => {
    iamCommonDicListTree(params, {showError: false}).then(res => {
      if (res.data?.length) {
        dicTree.push(...res.data)
      }
    })
  })

  return dicTree
}
