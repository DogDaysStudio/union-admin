<script setup lang="ts">
import {useActivated, useDicListTree, useForm} from '@/common/hooks'
import {defineField, defineSchema} from '@/components'
import {computed} from 'vue'
import {usePagination} from 'vue-request'
import {pmsPropertyEmployeeList} from '@/service/api/pmsProperty'
import {useExport} from '@/common/hooks/useExport'

// 搜索表单
const [searchForm] = useForm({
  pageable: true,
  pageNum: 1,
  pageSize: 10,
} as PmsEmployeeListDTO)

const {
  data: employeeList,
  runAsync: runEmployeeList,
  refreshAsync: refreshEmployeeList,
  loading: employeeListLoading,
  current,
  pageSize,
  total,
  changePageSize,
  changeCurrent,
} = usePagination(pmsPropertyEmployeeList, {
  manual: false,
  defaultParams: [searchForm],
})

useActivated(refreshEmployeeList)

const {exportData, loading: exportLoading} = useExport({
  meta: '/iam/auth-user/list-export-meta',
  url: '/iam/auth-user/list-export',
})

const schema = computed(() =>
  defineSchema({
    fields: [
      defineField.Input({label: '姓名', prop: 'searchName', placeholder: '姓名'}),
      defineField.Select({
        label: '组别',
        prop: 'employeeGroups',
        props: {label: 'roleName', value: 'roleId'},
        options: employeeList?.value?.data,
      }),
    ],
  })
)

const gender = useDicListTree({dicType: 9002})
</script>

<template>
  <!-- 数据筛选区域 -->
  <section-group title="数据筛选">
    <schema-form
      :schema="schema"
      :model="searchForm"
      @finish="runEmployeeList(searchForm)"
      @reset="runEmployeeList(searchForm)"
    ></schema-form>
  </section-group>

  <!-- 数据列表区域 -->
  <section-group title="数据列表">
    <template #extra>
      <el-space>
        <el-button @click="exportData(searchForm)" :loading="exportLoading">导出</el-button>
      </el-space>
    </template>

    <el-table
      ref="multipleTableRef"
      :data="employeeList?.data"
      stripe
      border
      v-loading="employeeListLoading"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="certName" label="姓名" />
      <el-table-column
        prop="gender"
        label="手机号码"
        :formatter="row => gender?.find(item => item.dicCode === row.gender)?.dicName || '-'"
      />
      <el-table-column prop="orgName" label="所属部门" />
      <el-table-column prop="roleName" label="当前角色" />
      <el-table-column prop="loginAccount" label="工号" width="140" />
      <el-table-column prop="mobile" label="照片" width="120" />
      <el-table-column prop="lastLoginTime" label="备注" width="170" />
      <el-table-column prop="lastLoginTime" label="员工组别" width="170" />
      <el-table-column prop="lastLoginTime" label="所属项目" width="170" />
    </el-table>
  </section-group>

  <el-pagination
    class="float-right"
    v-model:current-page="current"
    v-model:page-size="pageSize"
    :total="total"
    @size-change="changePageSize"
    @current-change="changeCurrent"
  />
</template>
