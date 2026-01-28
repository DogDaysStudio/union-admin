<script setup lang="ts" generic="T">
import DynamicFieldCol from './src/DynanicFieldCol.vue'
import type {DynamicFieldProps} from './src/form'

defineProps<
  DynamicFieldProps<T> & {
    /**
     * 外面是否包一层 el-row
     */
    renderRow?: boolean
  }
>()
</script>

<template>
  <el-row v-if="renderRow" :gutter="24">
    <dynamic-field-col :schema="schema" :model="model"></dynamic-field-col>
  </el-row>
  <dynamic-field-col v-else :schema="schema" :model="model"></dynamic-field-col>
</template>
