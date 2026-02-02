<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <div class="text-center">
      <div class="text-9xl font-bold text-gray-900 mb-4">404</div>
      <h1 class="text-3xl font-semibold text-gray-900 mb-4">页面不存在</h1>
      <p class="text-gray-500 mb-8">抱歉，您访问的页面不存在或已被移除</p>
      <el-button type="primary" @click="backHome">返回首页</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router'

const router = useRouter()

const backHome = () => {
  router.push('/')
}
</script>
