<template>
  <el-tabs type="border-card">
    <el-tab-pane label="围合">
      <enclosure />
    </el-tab-pane>
    <el-tab-pane label="楼层">
      <floor />
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
import enclosure from './enclosure/index.vue'
import floor from './floor/index.vue'
</script>
