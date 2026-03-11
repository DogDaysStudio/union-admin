<script lang="ts" setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import type {TabsPaneContext} from 'element-plus'
import ProjectInformation from './components/ProjectInformation.vue'

const router = useRouter()

const activeName = ref('first')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
</script>

<template>
  <el-card>
    <template #header>
      <div class="flex justify-between items-center">
        <span>基本信息</span>
        <el-button type="primary" @click="router.push('/asset/management/project')">返回</el-button>
      </div>
    </template>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="项目信息" name="first">
        <project-information />
      </el-tab-pane>
      <!-- <el-tab-pane label="楼栋" name="second">楼栋</el-tab-pane> -->
    </el-tabs>
  </el-card>
</template>
