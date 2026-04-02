<script setup lang="ts">
import {useForm} from '@/common/hooks'
import {defineField, defineSchema, DynamicField} from '@/components'
import {computed, ref, useTemplateRef} from 'vue'
import {pmsPmsSopUpdateBasic} from '@/service/api/pmsProperty'
import {useRequest} from 'vue-request'

const emit = defineEmits<{
  (e: 'finish'): void
}>()

const visible = ref<boolean>(false)

const formRef = useTemplateRef('formRef')

const [form, resetForm] = useForm({} as PmsSopTemplateUpdateBasicDTO, formRef)

const schema = computed(() =>
  defineSchema({
    fields: [
      defineField.Input({
        label: 'SOP名称',
        prop: 'sopName',
        placeholder: 'SOP名称',
        colProps: {span: 24},
        formItemProps: {
          rules: [{required: true, message: '请输入SOP名称'}],
          labelWidth: '60px',
        },
      }),
      defineField.Input({
        label: 'SOP描述',
        prop: 'description',
        placeholder: 'SOP描述',
        colProps: {span: 24},
      }),
    ],
  })
)

const {runAsync: runSopUpdateBasic, loading: sopUpdateBasicLoading} =
  useRequest(pmsPmsSopUpdateBasic)

const handleOpen = (detail: PmsSopTemplateUpdateBasicDTO) => {
  visible.value = true
  form.id = detail.id
  form.sopName = detail.sopName
  form.description = detail.description
}

const handleClose = () => {
  resetForm()
  visible.value = false
}

const handleSubmit = async () => {
  await runSopUpdateBasic(form)
  handleClose()
  emit('finish')
}

defineExpose({
  open: handleOpen,
})
</script>

<template>
  <el-dialog v-model="visible" title="关联组别" width="480px">
    <el-form ref="formRef" :model="form" label-width="100px" label-position="top">
      <dynamic-field :schema="schema" :model="form" render-row></dynamic-field>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="sopUpdateBasicLoading">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>
