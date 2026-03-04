import {reactive, type TemplateRef} from 'vue'

/**
 * @example
   const modelFormRef = useTemplateRef('modelFormRef')
   const [form, resetForm] = useForm(
     {dicType: 1001, dicLevel: 1} as SysDicUpsertDTO,
     modelFormRef
   )

   // *重置表单状态
   resetForm()
 */
export const useForm = <T extends Record<string, any>, R extends TemplateRef<any>>(
  initialState: T,
  formRef?: R
) => {
  // const originalState = {...initialState}
  const originalState = JSON.parse(JSON.stringify(initialState))

  const form = reactive(initialState)

  const resetForm = () => {
    const emptyState = Object.fromEntries(Object.entries(form).map(([key]) => [key, undefined]))
    const resetedState = Object.assign(form, emptyState, originalState)

    formRef?.value?.setInitialValues(resetedState)
    formRef?.value?.resetFields()

    return resetedState
  }

  return [form, resetForm, originalState] as const
}
