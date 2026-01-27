<script setup lang="ts">
import {RouterView} from 'vue-router'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import {onErrorCaptured} from 'vue'

onErrorCaptured((err, instance, info) => {
  console.log('错误捕获:', err, instance, info)
})
</script>

<template>
  <el-config-provider :locale="zhCn">
    <RouterView />
  </el-config-provider>
</template>

<style scoped></style>
