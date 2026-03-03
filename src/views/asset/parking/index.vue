<template>
  <el-tabs type="border-card">
    <el-tab-pane label="停车场">
      <lot />
    </el-tab-pane>
    <el-tab-pane label="停车位">
      <space />
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
import lot from './lot/index.vue'
import space from './space/index.vue'
</script>
