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
  type ColProps,
  type FormItemProps,
} from 'element-plus'
import type {Component, VNodeProps} from 'vue'

// 提取组件 Props 的实用类型
type ExtractComponentProps<T> = T extends new () => {$props: infer P}
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
  fields: Fields
}

// 字段配置类型
export type FieldConfig<T extends Component = Component> = {
  component: T
  /**
   * @default 'model-value'
   */
  formItemProps?: Partial<FormItemProps>
  colProps?: Partial<ColProps>
  // 可以添加其他通用属性
} & Pick<FormItemProps, 'label' | 'prop' | 'rules' | 'required'> &
  Partial<Pick<ColProps, 'span'>> &
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
  // todo: 针对不同组件设置默认值
  // switch (field.component.name) {
  //   case ElCheckbox.name:
  //     console.log('ElCheckbox.name field', ElCheckbox.name, field)

  //     field.valuePropName = 'checked'
  //     break
  // }

  return field
}

defineField.Input = (
  field: Omit<FieldConfig<typeof ElInput>, 'component'>
): FieldConfig<typeof ElInput> => {
  return defineField({component: ElInput, placeholder: '请输入', ...field})
}

defineField.Checkbox = (
  field: Omit<FieldConfig<typeof ElCheckbox>, 'component'>
): FieldConfig<typeof ElCheckbox> => {
  return defineField({component: ElCheckbox, ...field})
}

defineField.CheckboxGroup = (
  field: Omit<FieldConfig<typeof ElCheckboxGroup>, 'component'>
): FieldConfig<typeof ElCheckboxGroup> => {
  return defineField({component: ElCheckboxGroup, ...field})
}

defineField.DatePicker = (
  field: Omit<FieldConfig<typeof ElDatePicker>, 'component'>
): FieldConfig<typeof ElDatePicker> => {
  return defineField({component: ElDatePicker, ...field})
}

defineField.Select = (
  field: Omit<FieldConfig<typeof ElSelect>, 'component'>
): FieldConfig<typeof ElSelect> => {
  return defineField({component: ElSelect, placeholder: '请选择', ...field})
}

defineField.Radio = (
  field: Omit<FieldConfig<typeof ElRadio>, 'component'>
): FieldConfig<typeof ElRadio> => {
  return defineField({component: ElRadio, ...field})
}

defineField.RadioGroup = (
  field: Omit<FieldConfig<typeof ElRadioGroup>, 'component'>
): FieldConfig<typeof ElRadioGroup> => {
  return defineField({component: ElRadioGroup, ...field})
}

defineField.AutoComplete = (
  field: Omit<FieldConfig<typeof ElAutocomplete>, 'component'>
): FieldConfig<typeof ElAutocomplete> => {
  return defineField({component: ElAutocomplete, placeholder: '请输入', ...field})
}

defineField.Cascader = (
  field: Omit<FieldConfig<typeof ElCascader>, 'component'>
): FieldConfig<typeof ElCascader> => {
  return defineField({component: ElCascader, placeholder: '请选择', ...field})
}

defineField.InputNumber = (
  field: Omit<FieldConfig<typeof ElInputNumber>, 'component'>
): FieldConfig<typeof ElInputNumber> => {
  return defineField({component: ElInputNumber, ...field})
}
