<script setup lang="ts">
import {defineField, defineSchema} from '@/utils/form-schema'
import {reactive} from 'vue'

const formState = reactive({} as AuthUserVO)

const formSchema = defineSchema({
  fields: [
    defineField.Input({label: '项目名称', prop: 'projectName'}),
    defineField.Select({label: '所属省市区', prop: 'city'}),
  ],
})

const handleFinish = (model: typeof formState) => {
  console.log('values', model)
}
</script>

<template>
  <el-card>
    <template #header>数据筛选</template>
    <schema-form :schema="formSchema" :model="formState" @finish="handleFinish"></schema-form>
  </el-card>

  <el-card class="mt-base">
    <template #header>数据列表</template>
    <el-table>
      <el-table-column label="项目名称" prop="projectName"></el-table-column>
      <el-table-column label="所属省市区" prop="city"></el-table-column>
    </el-table>
    <el-pagination class="mt-base" layout="total, sizes, prev, pager, next, jumper" :total="100" />
  </el-card>
</template>
