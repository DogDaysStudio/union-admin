<script setup lang="ts">
import {computed, inject} from 'vue'
import get from 'lodash.get'
import set from 'lodash.set'
import type {FieldConfig, FormSchema} from '../form-schema'

const props = defineProps<{
  prop: string
  defaultItem?: Record<string, any>
  schema: FormSchema<FieldConfig<any>[]>
}>()

const model = inject('DynamicFieldFormModel')

const addItem = () => {
  if (!model?.[props.prop]) {
    model[props.prop] = []
  }
  model?.[props.prop]?.push(props.defaultItem || {})
}

// const dynamicColSpan = computed(() => {
//   const schema = props.schema
//   return schema.span ?? Math.floor((24 - 3) / schema.fields.length)
// })

const calcColSpan = (show: boolean, span: number, schema: typeof props.schema) => {
  if (!show) return 0
  return typeof span === 'number'
    ? span
    : (schema.span ?? Math.floor((24 - 3) / schema.fields.length))
}

// const dynamicColSpan = (schema: typeof props.schema) => {
//   return schema.fields.reduce((span, field) => {
//     return span + calcColSpan(field.span, schema)
//   }, 0)
// }
const dynamicColSpan = computed(() => {
  const schema = props.schema
  return schema.fields.reduce((span, field) => {
    return span + calcColSpan(field.show ?? true, field.span, schema)
  }, 0)
})
</script>

<template>
  <el-row :gutter="12" class="dynamic-list-field">
    <!-- class="mt-space" -->
    <template v-for="(_, rowIndex) in model?.[prop]?.length" :key="rowIndex">
      <template
        v-for="(
          {
            component,
            span, // default 8
            colProps,
            label,
            prop,
            // eslint-disable-next-line vue/no-unused-vars
            propMapping,
            rules,
            required,
            formItemProps,
            show = true,
            ...field
          },
          index
        ) in schema.fields"
        :key="index"
      >
        <el-col v-if="show" class="mb-4" :span="calcColSpan(show, span, schema)" v-bind="colProps">
          <el-form-item
            :label="label"
            :prop="[props.prop, rowIndex, prop]"
            :rules="rules"
            :required="required"
            v-bind="Object.assign({}, schema.formItemProps, formItemProps)"
          >
            <component
              :is="component"
              :model-value="get(model, [props.prop, rowIndex, prop])"
              @update:model-value="set(model, [props.prop, rowIndex, prop], $event)"
              v-bind="field"
            />
          </el-form-item>
        </el-col>
      </template>
      <el-col :span="24 - dynamicColSpan">
        <el-button
          link
          type="danger"
          size="small"
          @click="model?.[props.prop]?.splice(rowIndex, 1)"
        >
          删除
        </el-button>
      </el-col>
    </template>
    <el-col :span="dynamicColSpan" />
    <el-col :span="24 - dynamicColSpan">
      <el-button link type="primary" size="small" @click="addItem">添加</el-button>
    </el-col>
  </el-row>
</template>
