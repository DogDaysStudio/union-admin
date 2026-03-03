<script setup lang="ts">
import {defineField, defineSchema} from '@/components'
import {onMounted, reactive, ref} from 'vue'
import {useRouter} from 'vue-router'
import {ElMessage, ElMessageBox} from 'element-plus'
import {useRequest} from 'vue-request'
import {
  amsAssetParkingDelete,
  amsAssetParkingEnable,
  amsAssetParkingList,
} from '@/service/api/amsAsset'

// 列表数据
const {runAsync: parkingList} = useRequest(amsAssetParkingList)
// 修改数据状态
const {runAsync: toggleStatusParking} = useRequest(amsAssetParkingEnable)
// 删除数据
const {runAsync: deleteParking} = useRequest(amsAssetParkingDelete)

const formState = reactive({
  pageNum: 1,
  pageSize: 10,
} as AssetParkingListDTO)

const formSchema = defineSchema({
  fields: [
    defineField.Input({label: '所属项目', prop: 'projectName', clearable: true}),
    defineField.Input({label: '停车场', prop: 'buildingName', clearable: true}),
    defineField.Input({label: '停车区域', prop: 'parkingName', clearable: true}),
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

const tableData = reactive<AssetParkingVO[]>([])
const getData = async (): Promise<void> => {
  loading.value = true
  const {total: resTotal, data} = await parkingList({...formState})
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
const addLot = () => router.push('/asset/management/add-parking-lot')
const editLot = (parkingId: string) =>
  router.push(`/asset/management/edit-parking-lot/${parkingId}`)
const detailLot = (parkingId: string) =>
  router.push(`/asset/management/detail-parking-lot/${parkingId}`)

// 修改状态
const toggleStatus = (parkingId: string, enable: number): void => {
  ElMessageBox.confirm(`是否确定${enable ? '停用' : '启用'}停车场?`, '确认提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await toggleStatusParking({parkingId, enable: !enable})
    ElMessage.success('修改成功')
    getData()
  })
}

// 删除
const deleteLot = (parkingId: string): void => {
  ElMessageBox.confirm(`是否确定删除停车场?`, '确认提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await deleteParking({parkingId})
    ElMessage.success('删除成功')
    getData()
  })
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
          <el-button type="primary" size="default" @click="addLot">新增停车场</el-button>
          <el-button type="primary" size="default">导入</el-button>
          <el-button type="primary" size="default">导出</el-button>
        </div>
      </div>
    </template>

    <el-table v-loading="loading" :data="tableData" border>
      <el-table-column label="序号" type="index" width="60" />
      <el-table-column label="停车场编码" prop="parkingId" />
      <el-table-column label="停车场" prop="parkingName" />
      <el-table-column label="车位编码" prop="projectName" />
      <el-table-column label="车位区域" prop="projectTypeName" />
      <el-table-column label="所属项目" prop="ownershipUnitName" />
      <el-table-column label="停车场位置" prop="ownershipUnitName" />
      <el-table-column label="停车方式" prop="ownershipUnitName" />
      <el-table-column label="车位类别" prop="ownershipUnitName" />
      <el-table-column label="区域类别" prop="ownershipUnitName" />
      <el-table-column label="状态" prop="enable">
        <template #default="scope">
          <div>{{ scope?.row?.enable ? '启用' : '禁用' }}</div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="105">
        <template #default="{row}">
          <el-button
            link
            :type="row.enable ? 'danger' : 'primary'"
            @click="toggleStatus(row.parkingId, row.enable)"
          >
            {{ row.enable ? '停用' : '启用' }}
          </el-button>
          <el-button link type="primary" @click="detailLot(row.parkingId)">查看详情</el-button>
          <el-button link type="primary" @click="editLot(row.parkingId)">编辑</el-button>
          <el-button link type="danger" @click="deleteLot(row.parkingId)">删除</el-button>
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
