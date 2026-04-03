<script setup lang="ts">
import {useForm} from '@/common/hooks'
import {defineField, defineSchema, DynamicField} from '@/components'
import {computed, ref} from 'vue'

// const emit = defineEmits<{
//   (e: 'finish', data: PmsCustomerInsertDTO): void
// }>()

const visible = ref<boolean>(false)

const [form] = useForm({} as PmsCustomerInsertDTO)

const schema = computed(() =>
  defineSchema({
    fields: [
      defineField.Input({
        label: '客户姓名',
        prop: 'customerName',
        placeholder: '客户姓名',
        colProps: {span: 24},
        formItemProps: {
          rules: [{required: true, message: '请输入客户姓名'}],
        },
      }),
      defineField.Input({
        label: '手机号',
        prop: 'phone',
        placeholder: '手机号',
        colProps: {span: 24},
        formItemProps: {
          rules: [{required: true, message: '请输入手机号'}],
        },
      }),
      defineField.Input({
        label: '证件类型',
        prop: 'certType',
        placeholder: '证件类型',
        colProps: {span: 24},
      }),
      defineField.Input({
        label: '证件号',
        prop: 'certNo',
        placeholder: '证件号',
        colProps: {span: 24},
      }),
      defineField.Input({label: '性别', prop: 'gender', placeholder: '性别', colProps: {span: 24}}),
      defineField.DatePicker({
        label: '出生日期',
        prop: 'birthday',
        placeholder: '出生日期',
        colProps: {span: 24},
      }),
      defineField.UploadFile({
        label: '证件照片',
        prop: 'certPhoto',
        colProps: {span: 24},
        action: '/common/file/upload',
      }),
      defineField.Input({
        label: '银行账号',
        prop: 'bankAccount',
        placeholder: '银行账号',
        colProps: {span: 24},
      }),
      defineField.UploadFile({label: '银行卡照片', prop: 'bankCardPhoto', colProps: {span: 24}}),
      defineField.UploadFile({label: '个人照片', prop: 'personalPhoto', colProps: {span: 24}}),
      defineField.Input({label: '备注', prop: 'remark', placeholder: '备注', colProps: {span: 24}}),
    ],
  })
)

const handleOpen = () => {
  visible.value = true
}

defineExpose({
  open: handleOpen,
})
</script>

<template>
  <el-dialog v-model="visible" title="新增客户信息" width="620px">
    <dynamic-field :schema="schema" :model="form"></dynamic-field>
  </el-dialog>
</template>
