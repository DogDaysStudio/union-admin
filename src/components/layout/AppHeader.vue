<template>
  <div class="flex items-center bg-white shadow-[0_2px_8px_rgba(0,0,0,0.09)]">
    <div class="flex flex-row justify-center items-center" style="width: 200px">
      <el-icon class="text-lg"><Compass /></el-icon>
      <span class="ml-2 font-bold">深安居运营平台</span>
    </div>
    <el-menu
      class="flex-1 border-none!"
      mode="horizontal"
      :default-active="activeKey"
      @select="handleMenuSelect"
    >
      <el-menu-item v-for="item in menuItems" :key="item.key" :index="item.key">
        {{ item.label }}
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
            <el-dropdown-item>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {Compass, User, ArrowDown} from '@element-plus/icons-vue'

interface MenuItem {
  label: string
  key: string
}

const menuItems = ref<MenuItem[]>([
  {label: '数据', key: '/data-center'},
  {label: '资产', key: '/asset'},
  {label: '租赁', key: '/lease'},
  {label: '物业', key: '/property'},
  {label: 'IOT', key: '/iot'},
])

const activeKey = ref(menuItems.value[0].key)

const handleMenuSelect = (key: string) => {
  activeKey.value = key
}
</script>
