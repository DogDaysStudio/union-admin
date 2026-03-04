<script setup lang="ts">
import type {CheckboxValueType} from 'element-plus'
import {computed} from 'vue'

const modelValue = defineModel<string[]>()

const props = defineProps<{
  meta: PairModel[]
}>()

defineEmits<{
  (e: 'save', fields: string[]): void
}>()

const checkAll = computed(() => {
  const checkedCount = modelValue.value.length
  return checkedCount > 0 && checkedCount === props.meta.length
})
const isIndeterminate = computed(() => {
  const checkedCount = modelValue.value.length
  return checkedCount > 0 && checkedCount < props.meta.length
})

const handleCheckAllChange = (value: CheckboxValueType) => {
  modelValue.value = value ? props.meta.map(item => item.k) : []
}
</script>

<template>
  <el-space size="large">
    <el-checkbox
      :model-value="checkAll"
      :indeterminate="isIndeterminate"
      @change="handleCheckAllChange"
    >
      全选
    </el-checkbox>
    <el-button text type="danger" @click="$emit('save', modelValue)">保存配置</el-button>
  </el-space>
  <el-checkbox-group v-model="modelValue">
    <el-row>
      <el-col v-for="item in meta" :key="item.k" :span="6">
        <el-checkbox :label="item.v" :value="item.k">{{ item.v }}</el-checkbox>
      </el-col>
    </el-row>
  </el-checkbox-group>
</template>
