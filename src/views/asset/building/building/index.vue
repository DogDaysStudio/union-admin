<script setup lang="ts">
import {defineField, defineSchema} from '@/components'
import {onMounted, reactive, ref} from 'vue'
import {useRouter} from 'vue-router'
import {ElMessage, ElMessageBox} from 'element-plus'
import {useRequest} from 'vue-request'
import {useDicListTree, useExport} from '@/common/hooks'
import {
  amsAssetBuildingDelete,
  amsAssetBuildingEnable,
  amsAssetBuildingList,
} from '@/service/api/amsAsset'

// 字典 [产权单位]
const companyOptions = useDicListTree({dicType: 1001})
// 列表数据
const {runAsync: buildingList} = useRequest(amsAssetBuildingList)
// 修改数据状态
const {runAsync: toggleStatusBuilding} = useRequest(amsAssetBuildingEnable)
// 删除数据
const {runAsync: deleteBuilding} = useRequest(amsAssetBuildingDelete)

const formState = reactive({
  pageNum: 1,
  pageSize: 10,
} as AssetBuildingListDTO)

const formSchema = defineSchema({
  fields: [
    defineField.Input({label: '楼栋名称', prop: 'buildingName', clearable: true}),
    defineField.Input({label: '楼栋编码', prop: 'buildingId', clearable: true}),
    defineField.Input({label: '所属项目', prop: 'projectName', clearable: true}),
    defineField.Cascader({
      label: '产权单位',
      prop: 'ownershipUnitCode',
      options: companyOptions,
      clearable: true,
      props: {
        checkStrictly: true,
        value: 'dicCode',
        label: 'dicName',
      },
    }),
    defineField.Select({
      label: '状态',
      prop: 'enable',
      options: [
        {value: '0', label: '禁用'},
        {value: '1', label: '启用'},
      ],
      clearable: true,
    }),
  ],
})

const handleFinish = async (model: typeof formState) => {
  console.log('values', model)
  formState.pageNum = 1
  getData()
}

const total = ref<number>(0)
const loading = ref<boolean>(false)

onMounted(() => getData())

const tableData = reactive<AssetBuildingVO[]>([])
const getData = async (): Promise<void> => {
  loading.value = true
  const params = getParams()
  const {total: resTotal, data} = await buildingList({...params})
  total.value = resTotal
  tableData.length = 0
  tableData.push(...data)
  loading.value = false
}

const getParams = () => {
  const cloneformState = {...formState}
  if (cloneformState.ownershipUnitCode?.length) {
    cloneformState.ownershipUnitCode =
      cloneformState.ownershipUnitCode[cloneformState.ownershipUnitCode.length - 1]
  }
  return cloneformState
}

const handleSizeChange = (val: number): void => {
  formState.pageSize = val
  getData()
}

const handleCurrentChange = (val: number): void => {
  formState.pageNum = val
  getData()
}

const router = useRouter()
const addBuilding = () => router.push('/asset/management/add-building')
const editBuilding = (buildingId: string) =>
  router.push(`/asset/management/edit-building/${buildingId}`)
const detailBuilding = (buildingId: string) =>
  router.push(`/asset/management/detail-building/${buildingId}`)

// 修改状态
const toggleStatus = async (buildingId: string, enable: number) => {
  await ElMessageBox.confirm(`是否确定${enable ? '停用' : '启用'}楼栋?`, '确认提示')
  await toggleStatusBuilding({buildingId, enable: !enable})
  ElMessage.success('修改成功')
  getData()
}

// 删除
const deleteData = async (buildingId: string) => {
  await ElMessageBox.confirm(`是否确定删除楼栋?`, '确认提示')
  await deleteBuilding({buildingId})
  ElMessage.success('删除成功')
  getData()
}

const handleImport = () => {
  router.push('/asset/management/import-building')
}

const {exportData, loading: exportLoading} = useExport({
  meta: '/ams/asset-building/list-export-meta',
  url: '/ams/asset-building/list-export',
})
</script>

<template>
  <el-card>
    <template #header>筛选查询</template>
    <schema-form :schema="formSchema" :model="formState" @finish="handleFinish"></schema-form>
  </el-card>

  <el-card class="mt-base">
    <template #header>
      <div class="flex items-center justify-between w-full">
        <span class="text-base font-medium">数据列表</span>
        <div class="flex">
          <el-button type="primary" @click="addBuilding">新增楼栋</el-button>
          <el-button @click="handleImport">导入</el-button>
          <el-button @click="exportData(getParams())" :loading="exportLoading">导出</el-button>
        </div>
      </div>
    </template>

    <el-table v-loading="loading" :data="tableData" border>
      <el-table-column label="序号" type="index" width="55" fixed="left" />
      <el-table-column label="楼栋编码" prop="buildingId" />
      <el-table-column label="楼栋名称" prop="buildingName" />
      <el-table-column label="所属项目" prop="projectName" />
      <el-table-column label="项目类型" prop="projectTypeName" />
      <el-table-column label="产权单位" prop="ownershipUnitName" width="240" />
      <el-table-column label="状态" prop="enable" width="70">
        <template #default="{row}">
          <el-switch
            :model-value="row.enable === 1"
            @change="toggleStatus(row.buildingId, row.enable)"
          />
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template #default="{row}">
          <el-button link type="primary" @click="detailBuilding(row.buildingId)">
            查看详情
          </el-button>
          <el-button link type="primary" @click="editBuilding(row.buildingId)">编辑</el-button>
          <el-button link type="danger" @click="deleteData(row.buildingId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="mt-base float-right"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
</template>
