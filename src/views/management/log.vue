<script setup lang="ts">
import {reactive} from 'vue'
import {usePagination, useRequest} from 'vue-request'
import {ElMessage} from 'element-plus'
import {defineField, defineSchema} from '@/components'
import {iamSysActionLogClear, iamSysActionLogList} from '@/service/api/iamSys'

// 筛选条件
const searchForm = reactive({
  pageable: true,
  pageNum: 1,
  pageSize: 10,
} as SysActionLogListDTO)

// 使用 usePagination 实现分页
const {
  data: logList,
  run: runLogList,
  loading: logListLoading,
  current,
  pageSize,
  total,
  refresh: refreshLogList,
} = usePagination(iamSysActionLogList, {
  manual: false,
  defaultParams: [searchForm],
})

// 请求清空日志
const reqClearLog = useRequest(iamSysActionLogClear, {
  onSuccess: () => {
    ElMessage.success('清空日志成功')
    handleSearch()
  },
  onError: error => {
    ElMessage.error('清空日志失败')
    console.error('清空日志失败:', error)
  },
})

// 搜索
const handleSearch = () => {
  searchForm.pageNum = 1
  runLogList(searchForm)
}

// 重置
const handleReset = () => {
  handleSearch()
}

// 清空日志
const handleClear = async () => {
  await ElMessageBox.confirm('确认清空所有日志吗？', '提示')
  await reqClearLog.run(searchForm)
  refreshLogList()
}

// 导出
const handleExport = () => {
  ElMessage.info('导出功能开发中')
}

// 搜索表单 schema
const searchFormSchema = defineSchema({
  fields: [
    defineField.Input({label: '输入查询', prop: 'content', placeholder: '内容信息'}),
    defineField.Input({label: '终端类型', prop: 'client', placeholder: '全部'}),
    // defineField.Select({
    //   label: '终端类型',
    //   prop: 'client',
    //   placeholder: '全部',
    //   options: [
    //     {label: '全部', value: ''},
    //     {label: 'Web端', value: 'Web端'},
    //     {label: 'APP端', value: 'APP端'},
    //   ],
    // }),
    defineField.DateTimeRangePicker({
      label: '日志时间',
      propMapping: ['insertTimeBegin', 'insertTimeEnd'],
    }),
    defineField.Input({label: '操作人员', prop: 'uname', placeholder: '请输入操作人员姓名'}),
    defineField.Input({label: '操作模块', prop: 'module', placeholder: '全部'}),
    defineField.Input({label: '操作类型', prop: 'type', placeholder: '全部'}),
  ],
})
</script>

<template>
  <!-- 数据筛选区域 -->
  <section-group title="数据筛选">
    <schema-form
      :schema="searchFormSchema"
      :model="searchForm"
      @finish="handleSearch"
      @reset="handleReset"
    ></schema-form>
  </section-group>

  <!-- 数据列表区域 -->
  <section-group title="数据列表">
    <template #extra>
      <el-button @click="handleExport">导出</el-button>
      <el-button type="danger" @click="handleClear">清空</el-button>
    </template>

    <el-table :data="logList?.data" style="width: 100%" v-loading="logListLoading" stripe border>
      <el-table-column prop="insertTime" label="日志时间" width="180" />
      <el-table-column prop="client" label="终端设备" width="220">
        <template #default="scope">
          <el-tooltip :content="scope.row.client" placement="top">
            <div class="truncate max-w-full">{{ scope.row.client }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="module" label="操作模块" width="160" />
      <el-table-column prop="type" label="操作类型" width="120" />
      <el-table-column prop="uname" label="操作人员" width="120" />
      <el-table-column prop="ip" label="IP地址" width="150" />
      <el-table-column prop="content" label="内容">
        <template #default="scope">
          <el-tooltip :content="scope.row.content" placement="top">
            <div class="truncate max-w-full">{{ scope.row.content }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </section-group>

  <!-- 分页 -->
  <el-pagination
    class="float-right"
    v-model:current-page="current"
    v-model:page-size="pageSize"
    :total="total"
  />
</template>

<style scoped>
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  width: 100%;
}
</style>
