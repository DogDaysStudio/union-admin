<script setup lang="tsx">
import {computed, onUpdated, reactive} from 'vue'
import {useRouter} from 'vue-router'

import {defineSchema, defineField} from '@/components/form/form-schema.ts'
import {rules} from '@/common/rules'

const router = useRouter()

const formState = reactive({
  name: '1212',
  birthday: '12',
  name2: '',
  dateStart: '',
  dateEnd: '',
  date: {
    dateStart: '',
    dateEnd: '',
  },
  // date: [], // 添加 date 属性用于 DatePicker 的 daterange 类型
  // dateStart: computed({
  //   get() {
  //     return [formState.dateStart, formState.dateEnd]
  //   },
  //   set(value) {
  //     formState.dateStart = value[0]
  //     formState.dateEnd = value[1]
  //   },
  // }),
})

const formState2 = reactive({
  nameList: [
    {name1: '111', name2: '222'},
    {name1: '111', name2: '222'},
    {name1: '111', name2: '222'},
    // {name1: '333', name2: '444'},
  ],
})

const handleFinish = values => {
  console.log('values', values)
}

const handleReset = () => {
  // formState.dateStart = '2026-01-02'
  // formState.dateEnd = '2026-01-09'
}

onUpdated(() => {
  console.log('onUpdated ')
})

// const rules = {
//   name: [{required: true, message: '请输入姓名'}],
// }

// 定义 Schema（完全自动推导，无需手动映射）
// 如果 schema 需要动态，使用 computed 来计算
const formSchema = computed(() =>
  defineSchema({
    // span: 24,
    fields: [
      defineField.Empty({
        label: '空字段1',
        prop: 'name',
      }),
      defineField.Empty({
        label: '空字段2',
        modelValue: `name 字数：${formState.name?.length}`,
      }),
      defineField.SubField({
        label: '经纬度',
        schema: {
          span: 12,
          formItemProps: {labelWidth: 0},
          fields: [defineField.Input({prop: 'name'}), defineField.Input({prop: 'name'})],
        },
      }),
      // {
      //   label: '',
      //   fields: [
      //     defineField.Input({
      //       label: 'sub1',
      //       prop: 'name',
      //       // disabled: true,
      //       rules: formState.name?.length > 2 ? [rules.required()] : undefined,
      //     }),
      //     defineField.Input({
      //       label: 'sub2',
      //       prop: 'name',
      //       // disabled: true,
      //       rules: formState.name?.length > 2 ? [rules.required()] : undefined,
      //     }),
      //   ],
      // },
      defineField.Input({
        label: '姓名姓名',
        prop: 'name',
        // disabled: true,
        rules: formState.name?.length > 2 ? [rules.required()] : undefined,
      }),
      defineField.AutoComplete({label: '姓名', prop: 'autoname'}),
      defineField.Input({label: '姓名', prop: 'name2'}),
      defineField.Select({
        label: '姓名名姓名',
        prop: 'select',
        placeholder: '请选择姓名',
        // options: [{value: '1a', lable: '1b'}],
      }),
      defineField.Checkbox({label: '姓名', prop: 'checked'}),
      defineField.DateTimeRangePicker({
        label: 'DateTimePicker',
        propMapping: [
          ['date', 'dateStart'],
          ['date', 'dateEnd'],
        ],
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
)

const formSchema2 = computed(() =>
  defineSchema({
    // span: 24,
    fields: [
      defineField.Input({
        label: '姓名姓名',
        prop: 'name',
        // disabled: true,
        rules: formState.name?.length > 2 ? [rules.required()] : undefined,
      }),
      defineField.Input({label: '姓名', prop: 'name2'}),
      defineField.ListField({
        label: '姓名列表',
        prop: 'nameList',
        schema: {
          formItemProps: {labelPosition: 'right'},
          fields: [
            defineField.Input({
              prop: 'name1',
              label: 'hello',
              rules: [rules.required()],
            }),
            defineField.Input({prop: 'name2', label: ' a'}),
            defineField.Input({prop: 'name3', label: ' '}),
          ],
        },
      }),
    ],
  })
)
</script>

<template>
  <div>
    <el-card>
      <template #header>数据筛选</template>
      <schema-form
        label-position="top"
        :schema="formSchema"
        :model="formState"
        @finish="handleFinish"
        @reset="handleReset"
      ></schema-form>
    </el-card>

    <el-card>
      <schema-form
        label-position="top"
        :schema="formSchema2"
        :model="formState2"
        @finish="console.log('$event', $event)"
        @reset="handleReset"
      ></schema-form>
    </el-card>

    <el-button @click="router.push('analysis')">跳转</el-button>
  </div>
</template>

<style scoped>
.result {
  margin-top: 24px;
}
</style>
