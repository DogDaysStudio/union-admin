<script setup lang="ts" generic="T">
import get from 'lodash.get'
import set from 'lodash.set'
import type {DynamicFieldProps} from './form'
import ListField from './ListField.vue'

defineOptions({name: 'DynamicFieldCol'})

defineProps<DynamicFieldProps<T>>()
</script>

<template>
  <el-col
    v-for="(
      {
        // valuePropName = 'model-value',
        component,
        span, // default 8
        colProps,
        label,
        prop,
        propMapping,
        rules,
        required,
        formItemProps,
        // fields,
        ...field
      },
      index
    ) in schema?.fields"
    :key="index"
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
            :model-value="propMapping.map(prop => get(model, prop))"
            @update:model-value="
              $event => propMapping.forEach((prop, index) => set(model, prop, $event?.[index]))
            "
            v-bind="field"
          />
        </el-form-item>
        <el-form-item v-else :prop="prop" :rules="rules" class="hidden!" />
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
      <component
        :is="component"
        :model-value="prop ? get(model, prop) : undefined"
        @update:model-value="$event => prop && set(model, prop, $event)"
        :prop="component === ListField ? prop : undefined"
        v-bind="field"
      />
    </el-form-item>
  </el-col>
</template>
