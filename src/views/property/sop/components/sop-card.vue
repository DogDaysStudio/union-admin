<script setup lang="ts">
import {Document, ArrowRight} from '@element-plus/icons-vue'
import {useRouter} from 'vue-router'

const router = useRouter()

const {item} = defineProps<{
  item: PmsSopTemplateVO
}>()

const handleSopDetail = (sopId: string) => {
  router.push(`/property/settings/sop/${sopId}`)
}
</script>

<template>
  <el-card shadow="hover" @click="handleSopDetail(item.id)" class="cursor-pointer">
    <div class="flex items-center gap-4">
      <el-icon :size="32" class="shrink-0 text-gray-400!">
        <Document />
      </el-icon>
      <div class="flex-1">
        <h4 class="line-clamp-1">{{ item.sopName }}</h4>
        <p class="text-gray-500 text-sm mt-1 line-clamp-1">包含子项：{{ item.categorySummary }}</p>
      </div>
      <el-icon :size="16" class="shrink-0 text-gray-500!">
        <ArrowRight />
      </el-icon>
    </div>
  </el-card>
</template>
