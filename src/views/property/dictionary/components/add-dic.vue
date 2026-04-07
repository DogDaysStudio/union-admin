<script setup lang="ts">
import {ref, computed} from 'vue'
import {useForm} from '@/common/hooks/useForm'
import {rules} from '@/common/rules'
import type {FormInstance} from 'element-plus'
import {pmsPmsDicItemInsertBatch} from '@/service/api/pmsProperty'
import {useRequest} from 'vue-request'
import {defineField, defineSchema} from '@/components'

const emit = defineEmits<{
  (e: 'finish'): void
}>()

const visible = ref(false)
const formRef = ref<FormInstance>()

const [form, resetForm] = useForm(
  {
    items: [{}] as ItemEntry[],
    typeId: undefined,
  },
  formRef
)

const {runAsync: insertAsync, loading: insertLoading} = useRequest(pmsPmsDicItemInsertBatch)

const formSchema = computed(() =>
  defineSchema({
    span: 24,
    fields: [
      defineField.ListField({
        prop: 'items',
        formItemProps: {labelWidth: 0},
        schema: {
          fields: [
            defineField.Input({
              prop: 'itemName',
              label: '名称',
              rules: [rules.required()],
            }),
            // defineField.Input({prop: 'dicCode', label: 'code', disabled: true}),
          ],
        },
      }),
    ],
  })
)

const handleClose = () => {
  visible.value = false
  resetForm()
}

const handleOpen = (row: {typeId: string}) => {
  visible.value = true
  form.typeId = row.typeId
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  await insertAsync({typeId: form.typeId, items: form.items})
  handleClose()
  emit('finish')
}

defineExpose({
  open: handleOpen,
})
</script>

<template>
  <el-dialog v-model="visible" width="560px">
    <template #title>
      <h2 class="font-bold text-xl">新增字典值</h2>
    </template>
    <el-form :model="form" ref="formRef">
      <dynamic-field render-row :schema="formSchema" :model="form" />
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="insertLoading">保存</el-button>
    </template>
  </el-dialog>
</template>
