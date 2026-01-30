import {FORMAT_DATE, FORMAT_DATETIME} from '@/common/date.ts'
import {
  ElAutocomplete,
  ElCascader,
  ElCheckbox,
  ElCheckboxGroup,
  ElDatePicker,
  ElInput,
  ElInputNumber,
  ElRadio,
  ElRadioGroup,
  ElSelect,
  type ColPropsPublic,
  type FormItemPropsPublic,
  type FormPropsPublic,
} from 'element-plus'
import {type Component, type VNodeProps} from 'vue'
import EmptyField from './src/EmptyField.vue'
import SubField from './src/SubField.vue'
import ListField from './src/ListField.vue'

// 提取组件 Props 的实用类型
import type {ComponentPublicInstance} from 'vue'

type ExtractComponentProps<T> = T extends new () => ComponentPublicInstance<infer P>
  ? P
  : T extends new () => {$props: infer P}
    ? P
    : T extends (props: infer P, ...args: any[]) => any
      ? P
      : Record<string, any>

// 排除 Vue 的通用属性，只保留组件特定属性
type ComponentSpecificProps<T> = Omit<
  ExtractComponentProps<T>,
  keyof VNodeProps
  //  | keyof AllowedComponentProps
>

export type FormSchema<Fields extends FieldConfig<any>[]> = {
  // span?: ColProps['span']
  span?: ColPropsPublic['span']
  // labelWidth?: FormPropsPublic['labelWidth']
  formItemProps?: FormPropsPublic
  fields: Fields
}

// 字段配置类型
export type FieldConfig<T extends Component = Component> = {
  /** 是否显示该字段  @default true */
  show?: boolean
  component: T
  // 映射属性，用于组合并绑定组件的 model-value
  propMapping?: (string | string[])[]
  /**
   * @default 'model-value'
   */
  // valuePropName?: string
  // formItemProps?: Partial<FormItemProps>
  formItemProps?: FormItemPropsPublic
  colProps?: ColPropsPublic
  // 可以添加其他通用属性
} & Pick<FormItemPropsPublic, 'label' | 'prop' | 'rules' | 'required'> &
  Pick<ColPropsPublic, 'span'> &
  ComponentSpecificProps<T>

/**
 * 定义表单字段
 */
export function defineSchema<Fields extends FieldConfig<any>[]>(schema: FormSchema<Fields>) {
  return schema
}

/**
 * 定义表单项字段
 */
export function defineField<T extends Component>(field: FieldConfig<T>): FieldConfig<T> {
  return field
}

type DefineField<T extends Component, OmitProps extends keyof FieldConfig<T> = 'component'> = (
  field: Omit<FieldConfig<T>, OmitProps>
) => FieldConfig<T>

defineField.Input = (field => {
  return defineField({
    component: ElInput,
    placeholder: '请输入',
    // clearable: true,
    ...field,
  })
}) as DefineField<typeof ElInput>

defineField.Checkbox = (field => {
  return defineField({component: ElCheckbox, ...field})
}) as DefineField<typeof ElCheckbox>

defineField.CheckboxGroup = (field => {
  return defineField({component: ElCheckboxGroup, ...field})
}) as DefineField<typeof ElCheckboxGroup>

/**
 * DatePicker 可以变种为 DateTimePicker， 只需要设置 type 为 'datetime' 即可
 */
defineField.DatePicker = (field => {
  return defineField({
    component: ElDatePicker,
    valueFormat: FORMAT_DATE,
    placeholder: '请选择',
    ...field,
  })
}) as DefineField<typeof ElDatePicker>

defineField.DateRangePicker = (field => {
  return defineField.DatePicker({
    type: 'daterange',
    startPlaceholder: '开始日期',
    endPlaceholder: '结束日期',
    ...field,
  })
}) as DefineField<typeof ElDatePicker>

defineField.DateTimePicker = (field => {
  return defineField.DatePicker({type: 'datetime', valueFormat: FORMAT_DATETIME, ...field})
}) as DefineField<typeof ElDatePicker>

defineField.DateTimeRangePicker = (field => {
  return defineField.DatePicker({
    type: 'datetimerange',
    valueFormat: FORMAT_DATETIME,
    startPlaceholder: '开始时间',
    endPlaceholder: '结束时间',
    ...field,
  })
}) as DefineField<typeof ElDatePicker>

defineField.Select = (field => {
  return defineField({component: ElSelect, placeholder: '请选择', ...field})
}) as DefineField<typeof ElSelect>

defineField.Radio = (field => {
  return defineField({component: ElRadio, ...field})
}) as DefineField<typeof ElRadio>

defineField.RadioGroup = (field => {
  return defineField({component: ElRadioGroup, ...field})
}) as DefineField<typeof ElRadioGroup>

defineField.AutoComplete = (field => {
  return defineField({component: ElAutocomplete, placeholder: '请输入', clearable: true, ...field})
}) as DefineField<typeof ElAutocomplete>

defineField.Cascader = (field => {
  return defineField({component: ElCascader, placeholder: '请选择', ...field})
}) as DefineField<typeof ElCascader>

defineField.InputNumber = (field => {
  return defineField({component: ElInputNumber, ...field})
}) as DefineField<typeof ElInputNumber>

// *空组件，直接渲染在 el-form-item 内
defineField.Empty = (field => {
  return defineField({component: EmptyField, ...field})
}) as DefineField<typeof EmptyField>

defineField.SubField = (field => {
  return defineField({component: SubField, ...field})
}) as DefineField<typeof SubField>

defineField.ListField = (field => {
  return defineField({component: ListField, ...field})
}) as DefineField<typeof ListField, 'component' | 'propMapping'>
