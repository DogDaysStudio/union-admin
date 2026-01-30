import {reactive, type TemplateRef} from 'vue'

/**
 * @example
 * const modelFormRef = useTemplateRef('modelFormRef')
 * const [formModel, resetModel] = useModel(
 *   {dicType: 1001, dicLevel: 1} as SysDicUpsertDTO,
 *   modelFormRef
 * )
 *
 * // *重置表单状态
 * resetModel()
 */
export const useModel = <T extends Record<string, any>, R extends TemplateRef<any>>(
  initialState: T,
  formRef: R
) => {
  // const originalState = {...initialState}
  const originalState = JSON.parse(JSON.stringify(initialState))
  console.log('originalState', originalState)

  const formModel = reactive(initialState)

  const resetModel = () => {
    const emptyState = Object.fromEntries(
      Object.entries(formModel).map(([key]) => [key, undefined])
    )
    const resetedState = Object.assign(formModel, emptyState, originalState)

    // formRef?.value?.setInitialValues(resetedState)
    // formRef?.value?.resetFields()
    // formRef?.value?.resetFields(Object.keys(emptyState))
    // todo: delete resetedState.children...
    // formRef?.value?.clearValidate()

    console.log(
      'resetedState, formModel, emptyState, originalState, Object.keys(emptyState)',
      resetedState,
      formModel,
      emptyState,
      originalState,
      Object.keys(emptyState)
    )

    return resetedState
  }

  return [formModel, resetModel, originalState] as const
}
