<template>
  <div class="h-full bg-[#001529]">
    <el-menu
      mode="vertical"
      :default-active="activeKey"
      :default-openeds="defaultOpenKeys"
      background-color="#001529"
      text-color="#fff"
      active-text-color="#1890ff"
      class="h-full w-[200px] border-none"
      @select="handleMenuSelect"
    >
      <template v-for="item in sidebarItems" :key="item.key">
        <el-sub-menu v-if="item.children" :index="item.key">
          <template #title>
            <span>{{ item.label }}</span>
          </template>
          <template v-for="child in item.children" :key="child.key">
            <el-sub-menu v-if="child.children" :index="child.key">
              <template #title>
                <span>{{ child.label }}</span>
              </template>
              <el-menu-item
                v-for="grandChild in child.children"
                :key="grandChild.key"
                :index="grandChild.key"
              >
                {{ grandChild.label }}
              </el-menu-item>
            </el-sub-menu>
            <el-menu-item v-else :index="child.key">
              {{ child.label }}
            </el-menu-item>
          </template>
        </el-sub-menu>
        <el-menu-item v-else :index="item.key">
          {{ item.label }}
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'

interface MenuItem {
  label: string
  key: string
  children?: MenuItem[]
}

const sidebarItems = ref<MenuItem[]>([
  {
    label: '资源管理',
    key: '/dashboard',
    children: [
      {label: '盘点任务', key: '/resource-management/inventory-tasks'},
      {label: '工作台', key: '/dashboard/a2'},
      {label: '盘点计划', key: '/resource-management/inventory-plans'},
      {label: '租控管理', key: '/resource-management/lease-control'},
      {
        label: '房产项目',
        key: '/resource-management/property-projects',
        children: [
          {label: '房产资料(商业)', key: '/resource-management/property-projects/commercial'},
          {label: '房产资料(住宅)', key: '/resource-management/property-projects/residential'},
          {label: '房产资料(公寓)', key: '/resource-management/property-projects/apartment'},
          {label: '房产资料(菜场)', key: '/resource-management/property-projects/market'},
        ],
      },
      {label: '物管项目', key: '/resource-management/property-management'},
      {label: '产权房屋', key: '/resource-management/property-rights'},
    ],
  },
])

const activeKey = ref('/dashboard/a2')
const defaultOpenKeys = ref(['/dashboard'])

const handleMenuSelect = (key: string) => {
  activeKey.value = key
}
</script>
