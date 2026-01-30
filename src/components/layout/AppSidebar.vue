<script setup lang="ts">
import {computed, ref, onMounted, onUnmounted} from 'vue'
import {useRouter} from 'vue-router'
import {useModuleStore} from '@/stores/module'
import {routes} from '@/router'

interface MenuItem {
  hidden?: boolean
  label: string
  key: string
  children?: MenuItem[]
}

const router = useRouter()
const moduleStore = useModuleStore()

// 从路由生成菜单结构
const generateMenuFromRoutes = (modulePath: string): MenuItem[] => {
  // 找到对应模块的路由
  const moduleRoute = routes.find(route => route.path === modulePath)

  if (!moduleRoute || !moduleRoute.children) {
    return []
  }

  // 递归转换路由为菜单，确保生成完整路径
  const convertRouteToMenu = (route: any, parentPath: string = ''): MenuItem => {
    // 生成完整路径
    const fullPath = parentPath ? `${parentPath}/${route.path}` : route.path

    const menuItem: MenuItem = {
      hidden: route.meta?.hidden || false,
      label: route.meta?.title || '',
      key: fullPath,
    }

    if (route.children && route.children.length > 0) {
      menuItem.children = route.children.map((child: any) => convertRouteToMenu(child, fullPath))
    }

    return menuItem
  }

  return moduleRoute.children.map((child: any) => convertRouteToMenu(child, moduleRoute.path))
}

// 模块路径映射
const modulePathMap = {
  data: '/data-center',
  asset: '/asset',
  lease: '/lease',
  property: '/property',
  iot: '/iot',
}

// 根据当前激活的模块获取对应的菜单
const sidebarItems = computed(() => {
  const currentModule = moduleStore.activeModule
  const modulePath =
    modulePathMap[currentModule as keyof typeof modulePathMap] || modulePathMap.data
  return generateMenuFromRoutes(modulePath)
})

const activeKey = ref(router.currentRoute.value.path)

const handleMenuSelect = (key: string) => {
  activeKey.value = key
}

let subscription: ReturnType<typeof router.afterEach> = null
onMounted(() => {
  subscription = router.afterEach(to => {
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
            <el-menu-item v-else-if="!child.children && !child.hidden" :index="child.key">
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
