<script setup lang="ts">
import {defineField, defineSchema} from '@/components'
import {onMounted, reactive, ref} from 'vue'
import {useRouter} from 'vue-router'
import {ElMessage, ElMessageBox} from 'element-plus'
import {useRequest} from 'vue-request'
import {
  amsAssetParkingSpaceDelete,
  // amsAssetParkingEnable,
  amsAssetParkingSpaceList,
} from '@/service/api/amsAsset'

// 列表数据
const {runAsync: spaceList} = useRequest(amsAssetParkingSpaceList)
// 修改数据状态
// const {runAsync: toggleStatusParking} = useRequest(amsAssetParkingEnable)
// 删除数据
const {runAsync: spaceDelete} = useRequest(amsAssetParkingSpaceDelete)

const formState = reactive({
  pageNum: 1,
  pageSize: 10,
} as AssetParkingSpaceListDTO)

const formSchema = defineSchema({
  fields: [
    defineField.Input({label: '所属项目', prop: 'projectName', clearable: true}),
    defineField.Input({label: '停车场', prop: 'parkingName', clearable: true}),
    defineField.Input({label: '停车区域', prop: 'parkingSpaceRegionName', clearable: true}),
    defineField.Select({
      label: '状态',
      prop: 'enable',
      options: [
        {value: 0, label: '禁用'},
        {value: 1, label: '启用'},
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

const tableData = reactive<AssetParkingSpaceVO[]>([])
const getData = async (): Promise<void> => {
  loading.value = true
  const {total: resTotal, data} = await spaceList({...formState})
  total.value = resTotal
  tableData.length = 0
  tableData.push(...data)
  loading.value = false
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
const addSpace = () => router.push('/asset/management/add-parking-space')
const editSpace = (parkingSpaceId: string) =>
  router.push(`/asset/management/edit-parking-space/${parkingSpaceId}`)
const detailLot = (parkingSpaceId: string) =>
  router.push(`/asset/management/detail-parking-space/${parkingSpaceId}`)

// 修改状态
const toggleStatus = async (parkingSpaceId: string, enable: number) => {
  await ElMessageBox.confirm(`是否确定${enable ? '停用' : '启用'}车位?`, '确认提示')
  // await toggleStatusParking({parkingSpaceId, enable: !enable})
  ElMessage.success('修改成功')
  getData()
}

// 删除
const deleteSpace = async (parkingSpaceId: string) => {
  await ElMessageBox.confirm(`是否确定删除车位?`, '确认提示')
  await spaceDelete({parkingSpaceId})
  ElMessage.success('删除成功')
  getData()
}
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
          <el-button type="primary" size="default" @click="addSpace">新增车位</el-button>
          <el-button type="primary" size="default">导入</el-button>
          <el-button type="primary" size="default">导出</el-button>
        </div>
      </div>
    </template>

    <el-table v-loading="loading" :data="tableData" border>
      <el-table-column label="序号" type="index" width="60" fixed="left" />
      <el-table-column label="车位名称" prop="parkingSpaceName" width="120" />
      <el-table-column label="车位编码" prop="parkingSpaceId" width="220" />
      <el-table-column label="停车场" prop="parkingName" width="120" />
      <el-table-column label="停车场编码" prop="parkingId" width="120" />
      <el-table-column label="车位区域" prop="parkingSpaceRegionName" width="120" />
      <el-table-column label="所属项目" prop="projectName" width="100" />
      <el-table-column label="权属方信息" prop="ownershipInfo" width="100" />
      <el-table-column label="使用方信息" prop="userInfo" width="100" />
      <el-table-column label="使用方租期" prop="leaseTerm" width="100" />
      <el-table-column label="车牌" prop="licensePlate" width="100" />
      <el-table-column label="车位状态" prop="enable" width="100">
        <template #default="scope">
          <div>{{ scope?.row?.enable ? '启用' : '禁用' }}</div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="225">
        <template #default="{row}">
          <el-button
            link
            :type="row.enable ? 'danger' : 'primary'"
            @click="toggleStatus(row.parkingSpaceId, row.enable)"
          >
            {{ row.enable ? '停用' : '启用' }}
          </el-button>
          <el-button link type="primary" @click="detailLot(row.parkingSpaceId)">查看详情</el-button>
          <el-button link type="primary" @click="editSpace(row.parkingSpaceId)">编辑</el-button>
          <el-button link type="danger" @click="deleteSpace(row.parkingSpaceId)">删除</el-button>
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
