<script setup lang="ts">
import {ref, useTemplateRef} from 'vue'
import {useForm} from '@/common/hooks/useForm'
import {pmsPmsSopCopy} from '@/service/api/pmsProperty'
import {useRequest} from 'vue-request'
import {defineSchema, defineField} from '@/components'

const {groupOptions} = defineProps<{
  groupOptions: {label: string; value: string}[]
}>()

const visible = ref(false)
const formRef = useTemplateRef('formRef')

const emit = defineEmits<{
  (e: 'finish'): void
}>()

const [form, resetForm] = useForm(
  {
    targetGroupId: undefined,
    sopIds: undefined,
  },
  formRef
)

const schema = defineSchema({
  fields: [
    defineField.RadioGroup({
      prop: 'targetGroupId',
      options: groupOptions,
    }),
  ],
})

const rules = {
  targetGroupId: [{required: true, message: '请选择分组', trigger: 'blur'}],
}

const {runAsync: copyAsync, loading: copyLoading} = useRequest(pmsPmsSopCopy)

const handleOpen = (data: {sopIds: string[]}) => {
  visible.value = true
  form.sopIds = data.sopIds
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  await copyAsync(form)
  handleClose()
  emit('finish')
}

const handleClose = () => {
  visible.value = false
  resetForm()
}

defineExpose({
  open: handleOpen,
})
</script>

<template>
  <el-dialog v-model="visible" width="560px">
    <template #title>
      <h2 class="font-bold text-xl">复制到</h2>
      <p class="text-gray-500 text-sm mt-1">复制已选的SOP到其他分组</p>
    </template>
    <el-form :model="form" ref="formRef" :rules="rules" label-position="top">
      <dynamic-field :schema="schema" :model="form" />
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="copyLoading">保存</el-button>
    </template>
  </el-dialog>
</template>
