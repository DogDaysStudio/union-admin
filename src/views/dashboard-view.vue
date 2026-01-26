<script setup lang="ts">
import {reactive} from 'vue'
import {useRouter} from 'vue-router'
// import styles from '@/assets/styles/element/index.scss'
// console.log('primary', styles)

import {defineSchema, defineField} from '@/utils/form-schema'

const router = useRouter()

const formState = reactive({
  name: '',
  birthday: '',
  name2: '',
})

const handleFinish = () => {
  console.log('values')
}

// const rules = {
//   name: [{required: true, message: '请输入姓名'}],
// }

// 定义 Schema（完全自动推导，无需手动映射）
// element-plus
const formSchema = defineSchema({
  fields: [
    defineField.Input({label: '姓名姓名', prop: 'name', placeholder: '请输入姓名'}),
    defineField.AutoComplete({label: '姓名', prop: 'autoname'}),
    defineField.Input({
      label: '姓名',
      prop: 'name2',
      rules: [{required: true, message: '请输入姓名'}],
    }),
    defineField.Select({
      label: '姓名姓名姓名姓名',
      prop: 'select',
      placeholder: '请选择姓名',
      options: [{value: '1a', lable: '1b'}],
    }),
    defineField.Checkbox({
      label: '姓名',
      prop: 'checked',
    }),
    defineField.Checkbox({
      label: '姓名2',
      prop: 'checked2',
      trueValue: '姓名',
      falseValue: '非姓名',
    }),
    defineField.DatePicker({
      label: '日期日期日期日期',
      prop: 'date',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      type: 'daterange',
    }),
    defineField.CheckboxGroup({
      label: 'checked',
      prop: 'checkedgroup',
      options: [
        {value: 'option1', label: 'option1'},
        {value: 'option2', label: 'option2'},
      ],
    }),
    defineField.RadioGroup({
      label: 'Radio.Group',
      prop: 'radio',
      options: [
        {value: 'option1', label: 'Radio option1'},
        {value: 'option2', label: 'Radio option2'},
      ],
    }),
    defineField.AutoComplete({label: '姓名', prop: 'name33'}),
  ],
})
</script>

<template>
  <div>
    <el-card>
      <template #header>数据筛选</template>
      <schema-form :schema="formSchema" :model="formState" @finish="handleFinish"></schema-form>
    </el-card>

    <el-button @click="router.push('home')">跳转</el-button>
  </div>
</template>

<style scoped>
.result {
  margin-top: 24px;
}
</style>
