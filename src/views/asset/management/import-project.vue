<script setup lang="ts">
import {useTabStore} from '@/stores/tabs'
import {useRouter} from 'vue-router'

const tabsStore = useTabStore()

const router = useRouter()
</script>

<template>
  <el-card>
    <template #header>导入项目</template>
    <import-data
      template-url="/ams/asset-project/export-template"
      check-url="/ams/asset-project/check-template"
      check-export-url="/ams/asset-project/check-template-export"
      import-url="/ams/asset-project/import-template"
      :type="1001"
      :title="{
        template: '填写导入项目的信息',
        // templateDesc: '请按照数据模板的格式准备导入数据，模板中的表头名称不可更改，表头行不能删除',
        upload: '上传填好的项目信息表',
        // uploadDesc: '文件后缀名必须为xls或xlsx（即Excel格式），文件大小不得大于10M',
      }"
      @finish="(tabsStore.close(), router.push('/asset/management/project'))"
    ></import-data>
  </el-card>
</template>
