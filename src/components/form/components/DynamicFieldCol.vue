<script setup lang="ts" generic="T">
import get from 'lodash.get'
import set from 'lodash.set'
import type {DynamicFieldProps} from '../types/form'
import ListField from './ListField.vue'

defineOptions({name: 'DynamicFieldCol'})

defineProps<DynamicFieldProps<T>>()
</script>

<template>
  <template
    v-for="(
      {
        valuePropName = 'modelValue',
        component,
        span, // default 8
        colProps,
        label,
        prop,
        propMapping,
        rules,
        required,
        formItemProps,
        show = true,
        // fields,
        ...field
      },
      index
    ) in schema?.fields"
    :key="index"
  >
    <el-col
      v-if="show"
      :span="typeof span === 'number' ? span : (schema.span ?? 8)"
      v-bind="colProps"
    >
      <template v-if="propMapping?.length">
        <template v-for="(prop, index) in propMapping" :key="index">
          <el-form-item
            v-if="index === 0"
            :label="label"
            :prop="prop"
            :rules="rules"
            :required="required"
            label-width="120px"
            v-bind="Object.assign({}, schema.formItemProps, formItemProps)"
          >
            <component
              :is="component"
              :[valuePropName]="propMapping.map(prop => get(model, prop))"
              @[`update:${valuePropName}`]="
                $event => propMapping.forEach((prop, index) => set(model, prop, $event?.[index]))
              "
              v-bind="field"
            />
          </el-form-item>
          <el-form-item v-else :prop="prop" :rules="rules" v-show="false" />
        </template>
      </template>

      <el-form-item
        v-else
        :label="label"
        :prop="prop"
        :rules="rules"
        :required="required"
        label-width="120px"
        v-bind="Object.assign({}, schema.formItemProps, formItemProps)"
      >
        <component v-if="component === ListField" :is="component" :prop="prop" v-bind="field" />
        <component
          v-else
          :is="component"
          :[valuePropName]="prop ? get(model, prop) : undefined"
          @[`update:${valuePropName}`]="$event => prop && set(model, prop, $event)"
          v-bind="field"
        />
      </el-form-item>
    </el-col>
  </template>
</template>
