<script setup lang="ts">
import {useTabStore} from '@/stores/tabs'
import {useRouter} from 'vue-router'

const tabsStore = useTabStore()
const router = useRouter()
</script>

<template>
  <el-card>
    <template #header>导入固定资产</template>
    <import-data
      template-url="/ams/asset-fixed/export-template"
      check-url="/ams/asset-fixed/check-template"
      check-export-url="/ams/asset-fixed/check-template-export"
      import-url="/ams/asset-fixed/import-template"
      :title="{
        template: '填写导入固定资产的信息',
        upload: '上传填好的固定资产信息表',
      }"
      @finish="(tabsStore.close(), router.push('/asset/management/fixed'))"
    ></import-data>
  </el-card>
</template>
