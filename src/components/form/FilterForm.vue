<script setup lang="ts" generic="T">
import {type FormProps} from 'element-plus'
import {useTemplateRef} from 'vue'
import type {DynamicFieldProps} from './types/form'

const {
  schema,
  model,
  showMessage = true,
  ...props
} = defineProps<DynamicFieldProps<T> & Partial<Omit<FormProps, 'model'>>>()

const emit = defineEmits<{
  finish: [model: T]
  reset: []
}>()

const formRef = useTemplateRef('formRef')

const submit = async () => {
  // try {
  //   await formRef.value?.validate()
  //   emit('finish')
  // } catch (error) {
  //   console.log('error', error)
  // }
  // todo: try catch
  await formRef.value?.validate()
  emit('finish', model)
}
const reset = () => {
  formRef.value?.resetFields()
  emit('reset')
}
</script>

<template>
  <!-- todo: section 表单 -->
  <div>
    <el-form ref="formRef" :model="model" :show-message="showMessage" v-bind="props">
      <el-row :gutter="24">
        <dynamic-field :schema="schema" :model="model"></dynamic-field>

        <el-col class="flex! flex-1! justify-end self-start">
          <el-form-item>
            <el-space>
              <el-button @click="reset">重置</el-button>
              <el-button type="primary" @click="submit">查询</el-button>
            </el-space>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
