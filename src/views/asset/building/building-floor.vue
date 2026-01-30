<template>
  <el-tabs type="border-card">
    <el-tab-pane label="楼栋">
      <building />
    </el-tab-pane>
    <el-tab-pane label="楼层">
      <floor />
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
import building from './building/index.vue'
import floor from './floor/index.vue'
</script>
