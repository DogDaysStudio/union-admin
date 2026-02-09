<script setup lang="ts">
import type {MenuItem} from './types/menu'

defineOptions({
  name: 'AppSidebarMenu',
})

defineProps<{
  items: MenuItem[]
}>()
</script>

<template>
  <template v-for="item in items" :key="item.key">
    <el-sub-menu v-if="item.children" :index="item.key">
      <template #title>
        <span>{{ item.label }}</span>
      </template>
      <app-sidebar-menu :items="item.children" />
    </el-sub-menu>
    <el-menu-item v-else :index="item.key">{{ item.label }}</el-menu-item>
  </template>
</template>
