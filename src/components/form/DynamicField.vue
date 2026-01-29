<script setup lang="ts" generic="T">
import {provide} from 'vue'
import DynamicFieldCol from './src/DynamicFieldCol.vue'
import type {DynamicFieldProps} from './src/form'

const props = defineProps<
  DynamicFieldProps<T> & {
    /**
     * 外面是否包一层 el-row
     */
    renderRow?: boolean
  }
>()

provide('DynamicFieldFormModel', props.model)
</script>

<template>
  <el-row v-if="renderRow" :gutter="24">
    <dynamic-field-col :schema="schema" :model="model"></dynamic-field-col>
  </el-row>
  <dynamic-field-col v-else :schema="schema" :model="model"></dynamic-field-col>
</template>
