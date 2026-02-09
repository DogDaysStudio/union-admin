<script setup lang="ts">
import {ref, onMounted, onUnmounted} from 'vue'
import {useRouter} from 'vue-router'
import {useModuleStore} from '@/stores/module'
import {findItemById} from '@/utils/array-util'

const router = useRouter()
const moduleStore = useModuleStore()

const activeKey = ref(router.currentRoute.value.path)

const handleMenuSelect = (key: string) => {
  activeKey.value = key
}

let subscription: ReturnType<typeof router.afterEach> = null
onMounted(() => {
  subscription = router.afterEach(to => {
    const item = findItemById(to.path, moduleStore.currentMenu, {children: 'children', key: 'key'})
    if (item) {
      activeKey.value = to.path
    }
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
      router
      mode="vertical"
      class="h-full"
      :default-active="activeKey"
      @select="handleMenuSelect"
      style="
        --el-menu-bg-color: #1f283e;
        --el-menu-hover-bg-color: #1f283e;
        --el-menu-text-color: #fff;
        --el-menu-active-color: #fff;
        width: 200px;
      "
    >
      <app-sidebar-menu :items="moduleStore.currentMenu" />
    </el-menu>
  </div>
</template>
