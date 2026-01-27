import {ref} from 'vue'
import {defineStore} from 'pinia'

export const useModuleStore = defineStore('module', () => {
  const activeModule = ref('data') // 默认激活数据模块

  const setActiveModule = (module: string) => {
    activeModule.value = module
  }

  // 根据路由路径更新模块
  const updateModuleFromRoute = (path: string) => {
    if (path.startsWith('/data-center')) {
      activeModule.value = 'data'
    } else if (path.startsWith('/asset')) {
      activeModule.value = 'asset'
    } else if (path.startsWith('/lease')) {
      activeModule.value = 'lease'
    } else if (path.startsWith('/property')) {
      activeModule.value = 'property'
    } else if (path.startsWith('/iot')) {
      activeModule.value = 'iot'
    }
  }

  return {
    activeModule,
    setActiveModule,
    updateModuleFromRoute,
  }
})
