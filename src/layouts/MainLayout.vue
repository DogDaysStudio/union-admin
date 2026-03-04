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
          <keep-alive :include="cacheInclude">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import {computed, onMounted, onUnmounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useTabStore} from '@/stores/tabs'
import type {TabPaneName} from 'element-plus'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'

const route = useRoute()
const router = useRouter()
const tabsStore = useTabStore()

const cacheInclude = computed(() =>
  tabsStore.tabs
    .filter(tab => tab.meta?.keepAlive !== false)
    .map(tab => tab.componentName)
    .filter(Boolean)
)

const handleTabRemove = (name: TabPaneName) => {
  const tabName = name as string
  const currentPath = route.path

  // 找到要删除的tab的索引
  const tabIndex = tabsStore.tabs.findIndex(tab => tab.path === tabName)

  // 移除tab
  tabsStore.removeTab(tabName)

  // 如果删除的是当前激活的tab，且还有其他tab
  if (tabName === currentPath && tabsStore.tabs.length > 0) {
    // 计算要激活的tab的索引
    let activeIndex = tabIndex
    if (activeIndex >= tabsStore.tabs.length) {
      // 如果删除的是最后一个tab，激活前一个
      activeIndex = tabsStore.tabs.length - 1
    }

    // 跳转到对应的tab
    if (activeIndex >= 0) {
      router.push(tabsStore.tabs[activeIndex].path)
    }
  }
}

// 标注 name 的类型为 tabs 的 @tab-change 事件的入参
const handleTabChange = (name: TabPaneName) => {
  // todo: 如果已经页面已经存在，考虑要不要刷新页面
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
