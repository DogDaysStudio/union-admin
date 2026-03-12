<script setup lang="ts">
import {useTabStore} from '@/stores/tabs'
import {useRouter} from 'vue-router'

const tabsStore = useTabStore()

const router = useRouter()
</script>

<template>
  <el-card>
    <template #header>导入停车位</template>
    <import-data
      template-url="/ams/asset-parking-space/export-template"
      check-url="/ams/asset-parking-space/check-template"
      check-export-url="/ams/asset-parking-space/check-template-export"
      import-url="/ams/asset-parking-space/import-template"
      :upload-props="{data: {type: 1001}}"
      :title="{
        template: '填写导入停车位的信息',
        // templateDesc: '请按照数据模板的格式准备导入数据，模板中的表头名称不可更改，表头行不能删除',
        upload: '上传填好的停车位信息表',
        // uploadDesc: '文件后缀名必须为xls或xlsx（即Excel格式），文件大小不得大于10M',
      }"
      @finish="(tabsStore.close(), router.push('/asset/management/parking'))"
    ></import-data>
  </el-card>
</template>
