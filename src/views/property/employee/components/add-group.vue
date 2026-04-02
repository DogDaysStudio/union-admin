<script setup lang="ts">
import {useForm} from '@/common/hooks'
import {defineField, defineSchema, DynamicField} from '@/components'
import {computed, ref, useTemplateRef} from 'vue'

const emit = defineEmits<{
  (e: 'finish'): void
}>()

const visible = ref<boolean>(false)

const formRef = useTemplateRef('formRef')

const [form] = useForm({} as PmsCustomerInsertDTO, formRef)

const schema = computed(() =>
  defineSchema({
    fields: [
      defineField.Select({
        label: '组别',
        prop: 'employeeGroups',
        placeholder: '组别',
        colProps: {span: 24},
        options: [],
        formItemProps: {
          rules: [{required: true, message: '请输入组别'}],
          labelWidth: '60px',
        },
      }),
    ],
  })
)

const handleOpen = () => {
  visible.value = true
}

const handleClose = () => {
  visible.value = false
}

const handleSubmit = async () => {
  visible.value = false
  emit('finish')
}

defineExpose({
  open: handleOpen,
})
</script>

<template>
  <el-dialog v-model="visible" title="关联组别" width="480px">
    <el-form ref="formRef" :model="form" label-width="100px" label-position="left">
      <dynamic-field :schema="schema" :model="form" render-row></dynamic-field>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>
