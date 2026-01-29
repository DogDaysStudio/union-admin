<script setup lang="ts">
import {inject} from 'vue'
import get from 'lodash.get'
import set from 'lodash.set'
import type {FieldConfig, FormSchema} from '../form-schema'

const props = defineProps<{
  prop: string
  defaultItem?: Record<string, any>
  schema: FormSchema<FieldConfig<any>[]>
}>()

const model = inject('DynamicFieldFormModel')
console.log('model?.[prop]?.length', model, props, model?.[props.prop]?.length)
</script>

<template>
  <el-row :gutter="12" class="dynamic-list-field">
    <!-- class="mt-space" -->
    <template v-for="(_, rowIndex) in model?.[prop]?.length" :key="rowIndex">
      <el-col
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
            ...field
          },
          index
        ) in schema.fields"
        :key="index"
        class="mb-4"
        :span="
          typeof span === 'number'
            ? span
            : (schema.span ?? Math.floor((24 - 3) / schema.fields.length))
        "
        v-bind="colProps"
      >
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
      <el-col :span="3" class="text-right">
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
    <el-col :span="24" class="text-right">
      <el-button
        link
        type="primary"
        size="small"
        @click="model?.[props.prop]?.push(props.defaultItem || {})"
      >
        添加
      </el-button>
    </el-col>
  </el-row>
</template>
