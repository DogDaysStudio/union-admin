<script setup lang="ts">
import {useActivated, useForm} from '@/common/hooks'
import {defineField, defineSchema} from '@/components'
import {computed, defineAsyncComponent, ref} from 'vue'
import {usePagination} from 'vue-request'
import {pmsPropertyEmployeeList} from '@/service/api/pmsProperty'
import {useExport} from '@/common/hooks/useExport'

const AddGroup = defineAsyncComponent(() => import('./components/add-group.vue'))
const DetailDrawer = defineAsyncComponent(() => import('./components/detail-drawer.vue'))

const addGroupRef = ref<InstanceType<typeof AddGroup>>()
const detailDrawerRef = ref<InstanceType<typeof DetailDrawer>>()
const checkedKeys = ref<string[]>([])

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
  url: 'pms/employee/export' as keyof ApiType,
})

const schema = computed(() =>
  defineSchema({
    fields: [
      defineField.Input({
        label: '姓名',
        prop: 'searchName',
        placeholder: '姓名',
        formItemProps: {
          labelWidth: '40px',
        },
      }),
    ],
  })
)

const handleSelectionChange = (selection: PmsLegacyIssueVO[]) => {
  checkedKeys.value = selection.map(item => item.id)
}

const handleAddGroup = () => {
  addGroupRef.value?.open()
}

const handleOpenDetail = (row: PmsLegacyIssueVO) => {
  detailDrawerRef.value?.open(row.id)
}
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
        <el-button @click="handleAddGroup" :disabled="checkedKeys.length <= 0">关联组别</el-button>
        <el-button :disabled="checkedKeys.length <= 0">关联项目</el-button>
        <el-button @click="exportData(searchForm)" :loading="exportLoading">导出</el-button>
      </el-space>
    </template>

    <el-table
      ref="multipleTableRef"
      :data="employeeList?.data"
      border
      v-loading="employeeListLoading"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="certName" label="姓名" width="100" />
      <el-table-column prop="mobile" label="手机号码" />
      <el-table-column prop="departmentName" label="所属部门" />
      <el-table-column prop="roleNames" label="当前角色">
        <template #default="{row}">
          <div class="flex flex-wrap gap-2">
            <el-tag v-for="role in row.roleNames" :key="role">{{ role }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="loginAccount" label="工号" width="140" />
      <el-table-column prop="mobile" label="照片" width="120" />
      <el-table-column prop="lastLoginTime" label="备注" />
      <el-table-column prop="lastLoginTime" label="员工组别" width="170" />
      <el-table-column prop="lastLoginTime" label="所属项目" />
      <el-table-column prop="lastLoginTime" label="操作" width="60" fixed="right" align="center">
        <template #default="{row}">
          <el-button type="primary" link @click="handleOpenDetail(row)">详情</el-button>
        </template>
      </el-table-column>
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

  <add-group ref="addGroupRef" @finish="refreshEmployeeList" />
  <detail-drawer ref="detailDrawerRef" />
</template>
