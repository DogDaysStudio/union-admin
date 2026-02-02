<script setup lang="ts">
import {defineField, defineSchema} from '@/components'
import {ref, reactive} from 'vue'
import {useRouter} from 'vue-router'

const router = useRouter()

// 搜索表单
const searchForm = reactive({
  keyword: '',
  role: '',
  department: '',
  status: '',
  timeRange: '',
})

// 分页信息
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
})

// 人员列表数据
const personnelList = ref([
  {
    id: 1,
    name: '张小刚',
    gender: '男',
    department: '产品部',
    role: '产品经理',
    account: 'admin',
    phone: '18888888888',
    online: true,
    type: '内部',
    source: '内部HR系统',
    lastLoginTime: '2019-08-25 14:54',
    enabled: true,
  },
  {
    id: 2,
    name: '李小花',
    gender: '女',
    department: '产品部',
    role: '产品经理',
    account: 'admin',
    phone: '18888888888',
    online: true,
    type: '内部',
    source: '手动创建',
    lastLoginTime: '2019-08-25 14:54',
    enabled: true,
  },
  {
    id: 3,
    name: '李亮',
    gender: '男',
    department: '产品部',
    role: '产品经理',
    account: 'admin',
    phone: '18888888888',
    online: true,
    type: '外部',
    source: '手动创建',
    lastLoginTime: '2019-08-25 14:54',
    enabled: true,
  },
])

// 处理搜索
const handleSearch = () => {
  console.log('搜索', searchForm)
  // 这里可以添加搜索数据的逻辑
}

// 处理重置
const handleReset = () => {
  Object.assign(searchForm, {
    keyword: '',
    role: '',
    department: '',
    status: '',
    timeRange: '',
  })
}

// 处理添加
const handleAdd = () => {
  router.push('/management/personnel/add')
}

// 处理导入
const handleImport = () => {
  router.push('/management/personnel/import')
}

// 处理批量修改部门
const handleBatchUpdateDept = () => {
  console.log('修改部门')
  // 这里可以添加批量修改部门的逻辑
}

// 处理批量修改角色
const handleBatchUpdateRole = () => {
  console.log('修改角色')
  // 这里可以添加批量修改角色的逻辑
}

// 处理批量停用
const handleBatchDisable = () => {
  console.log('停用')
  // 这里可以添加批量停用的逻辑
}

// 处理批量启用
const handleBatchEnable = () => {
  console.log('启用')
  // 这里可以添加批量启用的逻辑
}

// 处理批量重置密码
const handleBatchResetPwd = () => {
  console.log('重置密码')
  // 这里可以添加批量重置密码的逻辑
}

// 处理详情
const handleDetail = (id: number) => {
  router.push(`/management/personnel/detail/${id}`)
}

// 处理重置密码
const handleResetPassword = (id: number) => {
  console.log('重置密码', id)
  // 这里可以添加重置密码的逻辑
}

// 处理分页大小变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  // 这里可以添加分页查询的逻辑
}

// 处理页码变化
const handleCurrentChange = (current: number) => {
  pagination.current = current
  // 这里可以添加分页查询的逻辑
}

const schema = defineSchema({
  fields: [
    //
    defineField.Input({label: '输入查询', prop: 'keyword', placeholder: '姓名/账号/手机'}),
    defineField.Input({label: '角色', prop: 'role'}),
    defineField.Input({label: '所属部门', prop: 'department'}),
    defineField.Input({label: '账户状态', prop: 'status'}),
    defineField.Input({label: '添加时间', prop: 'timeRange'}),
  ],
})
</script>

<template>
  <!-- 数据筛选区域 -->
  <section-group title="数据筛选">
    <schema-form
      :schema="schema"
      :model="searchForm"
      @finish="handleSearch"
      @reset="handleReset"
    ></schema-form>
  </section-group>

  <!-- 数据列表区域 -->
  <section-group title="数据列表">
    <template #extra>
      <el-space>
        <el-button type="primary" @click="handleAdd">+ 添加</el-button>
        <el-button @click="handleImport">导入</el-button>
        <el-dropdown>
          <el-button>导出 ▼</el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>导出Excel</el-dropdown-item>
              <el-dropdown-item>导出CSV</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button @click="handleBatchUpdateDept">修改部门</el-button>
        <el-button @click="handleBatchUpdateRole">修改角色</el-button>
        <el-button @click="handleBatchDisable">停用</el-button>
        <el-button @click="handleBatchEnable">启用</el-button>
        <el-button @click="handleBatchResetPwd">重置密码</el-button>
      </el-space>
    </template>

    <el-table :data="personnelList" style="width: 100%" stripe border>
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="gender" label="性别" />
      <el-table-column prop="department" label="所属部门" />
      <el-table-column prop="role" label="当前角色" />
      <el-table-column prop="account" label="登录账号" />
      <el-table-column prop="phone" label="手机" width="120" />
      <el-table-column label="在线状态">
        <template #default="scope">
          <div class="flex items-center">
            <el-tag size="small" :type="scope.row.online ? 'success' : 'info'">
              {{ scope.row.online ? '在线' : '离线' }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="特性" />
      <el-table-column prop="source" label="来源渠道" width="120" />
      <el-table-column prop="lastLoginTime" label="最后登陆时间" width="150" />
      <el-table-column prop="enabled" label="启用">
        <template #default="scope">
          <el-switch v-model="scope.row.enabled" disabled />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130">
        <template #default="scope">
          <el-button link size="small" @click="handleDetail(scope.row.id)">详情</el-button>
          <el-button link size="small" type="danger" @click="handleResetPassword(scope.row.id)">
            重置密码
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </section-group>

  <div class="flex justify-end items-center">
    <el-pagination
      v-model:current-page="pagination.current"
      v-model:page-size="pagination.pageSize"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
