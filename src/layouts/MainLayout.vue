<template>
  <el-container class="h-screen">
    <el-header class="p-0!">
      <AppHeader />
    </el-header>
    <el-container>
      <el-aside width="200px">
        <AppSidebar />
      </el-aside>
      <el-main class="p-0">
        <el-tabs
          :model-value="route.path"
          type="card"
          closable
          @tab-remove="handleTabRemove"
          @tab-change="handleTabChange"
        >
          <el-tab-pane
            v-for="tab in tabsStore.tabs"
            :key="tab.path"
            :label="tab.meta.title"
            :name="tab.path"
          />
        </el-tabs>
        <router-view v-slot="{Component}">
          <keep-alive :include="tabsStore.tabs.map(item => item.componentName)">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useTabStore} from '@/stores/tabs'
import type {TabPaneName} from 'element-plus'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'

const route = useRoute()
const router = useRouter()
const tabsStore = useTabStore()

const handleTabRemove = (name: TabPaneName) => {
  tabsStore.removeTab(name as string)
}

// 标注 name 的类型为 tabs 的 @tab-change 事件的入参
const handleTabChange = (name: TabPaneName) => {
  console.log('name', name)

  router.push(name as string)
}

// 存储路由守卫的移除函数
let removeAfterEachGuard: ReturnType<typeof router.afterEach> | null = null

onMounted(() => {
  // 在组件挂载时添加路由守卫
  removeAfterEachGuard = router.afterEach(to => {
    tabsStore.addTab(to)
  })

  tabsStore.addTab(route)
})

onUnmounted(() => {
  // 在组件卸载时移除路由守卫
  removeAfterEachGuard?.()
  removeAfterEachGuard = null
})
</script>
