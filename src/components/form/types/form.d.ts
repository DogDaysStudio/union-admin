import type {FormSchema, FieldConfig} from '../utils/form-schema'
import type {ColProps} from 'element-plus'

export interface DynamicFieldProps<T> {
  /**
   * 表单 Schema
   */
  schema: FormSchema<FieldConfig<any>[]>
  model: T
}
