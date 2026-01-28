<script setup lang="ts">
import {ref} from 'vue'
import {Document, UploadFilled, CircleCheck, Warning} from '@element-plus/icons-vue'

const active = ref<number>(1)
</script>
<template>
  <el-card>
    <template #header>导入项目</template>
    
    <el-steps :active="active" align-center>
      <el-step title="上传文件" />
      <el-step title="执行导入" />
      <el-step title="导入完成" />
    </el-steps>

    <!-- 第一步 -->
    <el-card v-if="active === 1" class="m-4">
      <div class="flex items-center justify-between">
        <el-icon size="50" color="var(--el-color-primary)"><Document /></el-icon>
        <div class="pl-4 flex-1">
          <div class="font-bold mb-1">填写导入项目的信息</div>
          <span class="text-gray-400 text-sm">
            请按照数据模板的格式准备导入数据，模板中的表头名称不可更改，表头行不能删除
          </span>
        </div>
        <el-button type="danger">下载模板</el-button>
      </div>
    </el-card>

    <el-card v-if="active === 1" class="m-4">
      <div class="flex items-center justify-between">
        <el-icon size="50" color="var(--el-color-primary)"><UploadFilled /></el-icon>
        <div class="pl-4 flex-1">
          <div class="font-bold mb-1">上传填好的项目信息表</div>
          <span class="text-gray-400 text-sm">
            文件后缀名必须为xls或xlsx（即Excel格式），文件大小不得大于10M
          </span>
        </div>
        <el-button type="danger">上传文件</el-button>
      </div>
    </el-card>

    <!-- 第二步 -->
    <el-card v-if="active === 2" class="m-4">
      <div class="flex items-center justify-between">
        <el-icon size="50" color="var(--el-color-success)"><CircleCheck /></el-icon>
        <div class="pl-4 flex-1">
          <div class="font-bold mb-1">正常数量条数</div>
          <span class="text-gray-400 text-sm">100条</span>
        </div>
      </div>
    </el-card>

    <el-card v-if="active === 2" class="m-4">
      <div class="flex items-center justify-between">
        <el-icon size="50" color="var(--el-color-warning)"><Warning /></el-icon>
        <div class="pl-4 flex-1">
          <div class="font-bold mb-1">异常数量条数</div>
          <span class="text-gray-400 text-sm">100条</span>
        </div>
        <el-button type="danger">下载异常数据</el-button>
      </div>
    </el-card>

    <!-- 第三步 -->
    <div v-if="active === 3" class="text-center mb-10">
      <el-icon size="50" color="var(--el-color-success)"><CircleCheck /></el-icon>
      <div class="text-2xl">导入完成</div>
      <span class="text-gray-400 text-sm">成功导入项目数量：3个</span>
    </div>

    <!-- 操作按钮 -->
    <div class="flex justify-center">
      <el-button type="danger" v-if="active !== 3">下一步</el-button>
      <el-button v-if="active === 2">返回重新上传</el-button>
      <el-button v-if="active === 3" type="danger">完成</el-button>
    </div>
  </el-card>
</template>
