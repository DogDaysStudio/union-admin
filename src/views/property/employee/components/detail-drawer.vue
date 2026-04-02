<script setup lang="ts">
import {ref, useTemplateRef} from 'vue'
import {useRequest} from 'vue-request'

import {pmsPropertyEmployeeDetail} from '@/service/api/pmsProperty'
import {useForm} from '@/common/hooks'
import {defineField, defineSchema} from '@/components'

const drawer = ref(false)
const userId = ref('')
const activeName = ref('base')

const formRef = useTemplateRef('formRef')

const [form] = useForm({} as PmsEmployeeVO, formRef)

const schema = defineSchema({
  fields: [
    defineField.Input({
      label: '姓名',
      prop: 'employeeName',
      colProps: {span: 24},
      formItemProps: {labelWidth: '100px'},
    }),
    defineField.Input({
      label: '手机号码',
      prop: 'mobile',
      colProps: {span: 24},
      formItemProps: {labelWidth: '100px'},
    }),
    defineField.Input({
      label: '所属部门',
      prop: 'departmentId',
      colProps: {span: 24},
      formItemProps: {labelWidth: '100px'},
    }),
    defineField.Input({
      label: '当前角色',
      prop: 'roleNames',
      colProps: {span: 24},
      formItemProps: {labelWidth: '100px'},
    }),
    defineField.Input({
      label: '工号',
      prop: 'employeeNumber',
      colProps: {span: 24},
      formItemProps: {labelWidth: '100px'},
    }),
    defineField.Input({
      label: '照片',
      prop: 'avatarFid',
      colProps: {span: 24},
      formItemProps: {labelWidth: '100px'},
    }),
    defineField.Input({
      label: '所属项目',
      prop: 'projectName',
      colProps: {span: 24},
      formItemProps: {labelWidth: '100px'},
    }),
    defineField.Input({
      label: '备注',
      prop: 'notes',
      colProps: {span: 24},
      formItemProps: {labelWidth: '100px'},
    }),
    defineField.Input({
      label: '员工组别',
      prop: 'employeeGroupName',
      colProps: {span: 24},
      formItemProps: {labelWidth: '100px'},
    }),
  ],
})

const {runAsync: runEmployeeDetail} = useRequest(pmsPropertyEmployeeDetail)

const handleOpen = async (id: string) => {
  drawer.value = true
  userId.value = id
  const res = await runEmployeeDetail({id: userId.value})
  formRef.value.setInitialValues(res.data)
}

defineExpose({
  open: handleOpen,
})
</script>

<template>
  <el-drawer v-model="drawer" title="员工详情" size="680px">
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="基本信息" name="base">
        <el-form :model="form" ref="formRef" label-position="left">
          <dynamic-field :schema="schema" :model="form" />
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="日志" name="log">日志</el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>
