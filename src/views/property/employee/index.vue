<script setup lang="ts">
import {useActivated, useDicListTree, useForm} from '@/common/hooks'
import {defineField, defineSchema} from '@/components'
import {computed} from 'vue'
import {usePagination, useRequest} from 'vue-request'
import {iamAuthOrgList, iamAuthRoleList} from '@/service/api/iamAuth'
import {iamAuthUserList} from '@/service/api/imaAuthUser'
import {useExport} from '@/common/hooks/useExport'

// 搜索表单
const [searchForm] = useForm({
  pageable: true,
  pageNum: 1,
  pageSize: 10,
} as AuthUserListDTO)

const {
  data: personnelList,
  runAsync: runPersonnelList,
  refreshAsync: refreshPersonnelList,
  loading: personnelListLoading,
  current,
  pageSize,
  total,
  changePageSize,
  changeCurrent,
} = usePagination(iamAuthUserList, {
  manual: false,
  defaultParams: [searchForm],
})

useActivated(refreshPersonnelList)

// 角色列表
const {data: roleList} = useRequest(iamAuthRoleList, {
  manual: false,
  defaultParams: [{pageable: false} as AuthRoleListDTO],
})
// 部门列表
const {data: orgList} = useRequest(iamAuthOrgList, {
  manual: false,
  defaultParams: [{pageable: false} as AuthOrgListDTO],
})

const {exportData, loading: exportLoading} = useExport({
  meta: '/iam/auth-user/list-export-meta',
  url: '/iam/auth-user/list-export',
})

const schema = computed(() =>
  defineSchema({
    fields: [
      defineField.Input({label: '输入查询', prop: 'keyword', placeholder: '姓名/账号/手机'}),
      defineField.Select({
        label: '角色',
        prop: 'roleId',
        props: {label: 'roleName', value: 'roleId'},
        options: roleList?.value?.data,
      }),
      defineField.Select({
        label: '所属部门',
        prop: 'orgId',
        props: {label: 'orgName', value: 'orgId'},
        options: orgList?.value?.data,
      }),
      defineField.Input({label: '账户状态', prop: 'enable'}),
      defineField.DateTimeRangePicker({
        label: '添加时间',
        propMapping: ['insertTimeBegin', 'insertTimeEnd'],
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
      @finish="runPersonnelList(searchForm)"
      @reset="runPersonnelList(searchForm)"
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
      :data="personnelList?.data"
      stripe
      border
      v-loading="personnelListLoading"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="certName" label="姓名" />
      <el-table-column
        prop="gender"
        label="性别"
        :formatter="row => gender?.find(item => item.dicCode === row.gender)?.dicName || '-'"
      />
      <el-table-column prop="orgName" label="所属部门" />
      <el-table-column prop="roleName" label="当前角色" />
      <el-table-column prop="loginAccount" label="登录账号" width="140" />
      <el-table-column prop="mobile" label="手机" width="120" />
      <el-table-column prop="lastLoginTime" label="最后登陆时间" width="170" />
      <el-table-column prop="enable" label="启用">
        <template #default="scope">
          <!-- <el-switch v-model="row.enable" disabled /> -->
          <el-tag size="small" :type="scope.row.enable ? 'success' : 'danger'">
            {{ scope.row.enable ? '启用' : '停用' }}
          </el-tag>
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
</template>
