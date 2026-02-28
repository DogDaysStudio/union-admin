<template>
  <div class="flex items-center bg-white shadow-[0_2px_8px_rgba(0,0,0,0.09)]">
    <div class="flex flex-row justify-center items-center" style="width: 200px">
      <el-icon class="text-lg"><Compass /></el-icon>
      <span class="ml-2 font-bold">深安居运营平台</span>
    </div>
    <el-menu
      class="flex-1 border-none!"
      mode="horizontal"
      :default-active="moduleStore.activeModule"
      @select="handleMenuSelect"
    >
      <el-menu-item v-for="item in moduleStore.roots" :key="item.path" :index="item.path">
        {{ item.title }}
      </el-menu-item>
    </el-menu>
    <div class="px-4">
      <el-dropdown>
        <el-button>
          <el-icon class="mr-1"><User /></el-icon>
          用户
          <el-icon class="ml-1"><ArrowDown /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item>设置</el-dropdown-item>
            <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Compass, User, ArrowDown} from '@element-plus/icons-vue'
import {useModuleStore} from '@/stores/module'
import {ElMessage} from 'element-plus'
import {iamAuthLogout} from '@/service/api/iamAuth'
import {useRouter} from 'vue-router'
import {useTabStore} from '@/stores/tabs'
import type {MenuItem} from './types/menu'

const router = useRouter()
const tabsStore = useTabStore()
const moduleStore = useModuleStore()

const handleMenuSelect = (key: string) => {
  moduleStore.setActiveModule(key)
  if (key === '/lease') {
    router.push(key)
  } else if (router.currentRoute.value.fullPath === '/lease') {
    const tab = tabsStore.tabs.find(item => item.path.startsWith(key))
    if (tab) {
      router.push(tab.path)
    } else {
      const menuPath = findFirstMenu(moduleStore.currentMenu)
      if (menuPath) {
        router.push(menuPath)
      }
    }
  }
}

function findFirstMenu(menu: MenuItem[]): string {
  if (menu?.length) {
    if (menu[0]?.children) return findFirstMenu(menu[0].children)
    return menu[0].path
  }
  return null
}

const handleLogout = async () => {
  await iamAuthLogout({})
  ElMessage.success('退出登录成功')
}
</script>
