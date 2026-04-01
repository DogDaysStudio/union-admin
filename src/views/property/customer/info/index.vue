<script setup lang="ts">
import {useActivated, useForm} from '@/common/hooks'
import {defineField, defineSchema} from '@/components'
import {computed, defineAsyncComponent, ref} from 'vue'
import {usePagination} from 'vue-request'
import {pmsPropertyCustomerList} from '@/service/api/pmsProperty'
import {useExport} from '@/common/hooks/useExport'

const AddInfo = defineAsyncComponent(() => import('./components/add-info.vue'))

const addInfoRef = ref<InstanceType<typeof AddInfo>>()

// 搜索表单
const [searchForm] = useForm({
  pageable: true,
  pageNum: 1,
  pageSize: 10,
} as PmsCustomerListDTO)

const {
  data: customerList,
  runAsync: runCustomerList,
  refreshAsync: refreshCustomerList,
  loading: customerListLoading,
  current,
  pageSize,
  total,
  changePageSize,
  changeCurrent,
} = usePagination(pmsPropertyCustomerList, {
  manual: false,
  defaultParams: [searchForm],
})

useActivated(refreshCustomerList)

const {exportData, loading: exportLoading} = useExport({
  meta: '/iam/auth-user/list-export-meta',
  url: '/iam/auth-user/list-export',
})

const schema = computed(() =>
  defineSchema({
    fields: [defineField.Input({label: '姓名', prop: 'searchName', placeholder: '姓名'})],
  })
)

const handleAddInfo = () => {
  addInfoRef.value?.open()
}
</script>

<template>
  <!-- 数据筛选区域 -->
  <section-group title="数据筛选">
    <schema-form
      :schema="schema"
      :model="searchForm"
      @finish="runCustomerList(searchForm)"
      @reset="runCustomerList(searchForm)"
    ></schema-form>
  </section-group>

  <!-- 数据列表区域 -->
  <section-group title="数据列表">
    <template #extra>
      <el-space>
        <el-button @click="exportData(searchForm)" :loading="exportLoading">导出</el-button>
        <el-button @click="handleAddInfo">新增</el-button>
      </el-space>
    </template>

    <el-table
      ref="multipleTableRef"
      :data="customerList?.data"
      stripe
      border
      v-loading="customerListLoading"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="certName" label="姓名" />
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

  <AddInfo ref="addInfoRef" />
</template>
