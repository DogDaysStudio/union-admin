<script setup lang="ts">
import {onMounted, onUnmounted, onUpdated, ref, useTemplateRef} from 'vue'

import {useRouter} from 'vue-router'

const router = useRouter()

interface MenuItem {
  label: string
  key: string
  children?: MenuItem[]
}

const menuRef = useTemplateRef<typeof ElMenu>('menuRef')

// onMounted(() => {
//   setTimeout(() => {
//     menuRef.value.updateActiveIndex('/resource-management/property-managem3ent')
//   }, 3000)
//   // console.log(menuRef.value)
// })

const sidebarItems = ref<MenuItem[]>([
  {
    label: '资源管理',
    key: '/dashboard2',
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
  {
    label: '大屏',
    key: '/dashboard',
  },
  {
    label: '主页',
    key: '/home',
  },
])

const activeKey = ref('/dashboard/a2')
const defaultOpenKeys = ref(['/dashboard'])

const handleMenuSelect = (key: string) => {
  activeKey.value = key
}

let subscription: ReturnType<typeof router.afterEach> = null
onMounted(() => {
  subscription = router.afterEach(to => {
    // menuRef.value.updateActiveIndex(to.path)
    activeKey.value = to.path
  })
})
onUnmounted(() => {
  subscription?.()
  subscription = null
})
</script>

<template>
  <div class="h-full">
    <el-menu
      ref="menuRef"
      mode="vertical"
      :default-active="activeKey"
      :default-openeds="
        undefined
        // defaultOpenKeys
      "
      class="h-full"
      @select="handleMenuSelect"
      router
      style="
        --el-menu-bg-color: #1f283e;
        --el-menu-hover-bg-color: #1f283e;
        --el-menu-text-color: #fff;
        --el-menu-active-color: #fff;
        width: 200px;
      "
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
