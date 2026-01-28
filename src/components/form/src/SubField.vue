<script setup lang="ts">
import {inject} from 'vue'
import DynamicField from '../DynamicField.vue'
import type {FormSchema, FieldConfig} from '../form-schema'

defineProps<{
  schema: FormSchema<FieldConfig<any>[]>
}>()

const model = inject('DynamicFieldFormModel')
</script>

<template>
  <DynamicField render-row :schema="schema" :model="model" />
</template>
