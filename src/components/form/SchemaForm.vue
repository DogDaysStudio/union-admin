<script setup lang="ts">
import get from 'lodash.get'
import set from 'lodash.set'
import {type FormProps} from 'element-plus'
import type {FieldConfig, FormSchema} from '@/utils/form-schema'
import {useTemplateRef} from 'vue'

const {
  schema,
  model,
  showMessage = true,
  ...props
} = defineProps<
  {
    /**
     * 表单 Schema
     */
    schema: FormSchema<FieldConfig<any>[]>
  } & Partial<FormProps>
>()

const emit = defineEmits<{
  finish: []
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
  emit('finish')
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
        <el-col
          v-for="(
            {
              // eslint-disable-next-line vue/no-unused-vars
              valuePropName = 'model-value',
              component,
              // componentProps,
              span = 8,
              colProps,
              label,
              prop,
              rules,
              required,
              formItemProps,
              ...field
            },
            index
          ) in schema?.fields"
          :key="index"
          :span="span"
          v-bind="colProps"
        >
          <el-form-item
            :label="label"
            :prop="prop"
            :rules="rules"
            :required="required"
            v-bind="formItemProps"
          >
            <!-- <component
              :is="component"
              :[valuePropName]="get(model, prop)"
              @[`update:${valuePropName}`]="$event => set(model, prop, $event)"
              v-bind="field"
            /> -->
            <component
              :is="component"
              :model-value="get(model, prop)"
              @update:model-value="set(model, prop, $event)"
              v-bind="field"
            />
          </el-form-item>
        </el-col>

        <el-col class="flex! flex-1! justify-end self-start">
          <el-form-item>
            <el-space>
              <el-button @click="reset">重置</el-button>
              <el-button type="primary" @click="submit">提交</el-button>
            </el-space>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
