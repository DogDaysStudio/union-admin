import type {MenuItem} from '@/components/layout/types/menu'
import {joinPath} from '@/utils/router'
import {defineStore} from 'pinia'
import {useRouter} from 'vue-router'
import {ref, computed, watchEffect} from 'vue'

// export const modulePaths = ['/data-center', '/asset', '/lease', '/property', '/iot', '/management']

// 从路由生成菜单
const generateMenuFromRoutes = (routes: any[]) => {
  // 递归转换路由为菜单，确保生成完整路径
  const convertRouteToMenu = (route: any, parentPath: string = ''): MenuItem => {
    // 生成完整路径
    const fullPath = joinPath(route.path, parentPath)

    const menuItem: MenuItem = {
      label: route.meta?.title || '',
      path: fullPath,
      key: route.path ? fullPath : route.name, // 防止二级路由 key 重复，只作为菜单的 key 使用
      meta: route.meta,
    }

    if (route.children) {
      menuItem.children = route.children
        .map((child: any) => convertRouteToMenu(child, fullPath))
        .filter(Boolean)
      if (!menuItem.children?.length) return null
    } else if (!menuItem.meta?.menu) {
      return null
    }

    return menuItem
  }

  return routes.map(child => convertRouteToMenu(child)).filter(Boolean)
}

export const useModuleStore = defineStore('module', () => {
  const router = useRouter()

  const activeModule = ref('') // 默认激活数据模块

  // 从路由中提取菜单（包含顶部菜单）
  const menus = computed(() => {
    const menuRoutes = router.options.routes.filter(route => route.meta?.root)
    return generateMenuFromRoutes(menuRoutes)
  })

  // 根据当前激活的模块获取对应的菜单（sidebar菜单）
  const currentMenu = computed(() => {
    return menus.value.find(route => route.path === activeModule.value)?.children
  })

  // 提取顶部菜单
  const roots = computed(
    () => menus.value.map(route => ({path: route.path, title: route.meta?.title})) || []
  )

  // 设置初始菜单
  watchEffect(() => {
    if (!activeModule.value) {
      activeModule.value = roots.value?.[0]?.path
    }
  })

  const setActiveModule = (module: string) => {
    if (roots.value.some(root => root.path === module)) {
      activeModule.value = module
    }
  }

  // 根据路由路径更新模块
  const updateModuleFromRoute = (path: string) => {
    const module = roots.value.find(module => path.startsWith(module.path))
    if (module) {
      activeModule.value = module.path
    }
  }

  return {
    activeModule,
    roots,
    menus,
    currentMenu,
    setActiveModule,
    updateModuleFromRoute,
  }
})

// 路由守卫
// router.afterEach(to => {
//   const moduleStore = useModuleStore()
//   moduleStore.updateModuleFromRoute(to.path)
// })

// export const useModuleStore = defineStore('module', () => {
//   const activeModule = ref(modules[0]) // 默认激活数据模块

//   const setActiveModule = (module: string) => {
//     activeModule.value = module
//   }

//   // 根据路由路径更新模块
//   const updateModuleFromRoute = (path: string) => {
//     const module = modules.find(module => path.startsWith(module))
//     if (module) {
//       activeModule.value = module
//     }
//   }

//   return {
//     activeModule,
//     setActiveModule,
//     updateModuleFromRoute,
//   }
// })
