<script setup lang="ts">
import {defineField, defineSchema} from '@/components'
import {onMounted, reactive, ref} from 'vue'
import {useRouter} from 'vue-router'
import {ElMessage, ElMessageBox} from 'element-plus'
import {useRequest} from 'vue-request'
import {
  amsAssetBuildingList,
  amsAssetFloorDelete,
  amsAssetFloorEnable,
  amsAssetFloorList,
  amsAssetProjectList,
} from '@/service/api/amsAsset'
import {iamCommonDicListTree} from '@/service/api/iamCommon'

// 字典 产权单位（公司）
const companyListTree = useRequest(iamCommonDicListTree, {
  throttleInterval: 500,
})
const companyOptions = reactive<SysDicVO[]>([])
// 楼栋下拉列表
const buildingList = useRequest(amsAssetBuildingList, {
  throttleInterval: 500,
})
const buildingOptions = reactive<AssetBuildingVO[]>([])
// 获取项目列表
const projectList = useRequest(amsAssetProjectList, {
  throttleInterval: 500,
})
const projectOptions = reactive<{projectId: string; projectName: string}[]>([])
// 列表数据
const floorList = useRequest(amsAssetFloorList, {
  throttleInterval: 500,
})
// 修改数据状态
const toggleStatusFloor = useRequest(amsAssetFloorEnable, {
  throttleInterval: 500,
})
// 删除数据
const deleteFloor = useRequest(amsAssetFloorDelete, {
  throttleInterval: 500,
})

const formState = reactive({
  pageNum: 1,
  pageSize: 10,
  assetType: '1',
} as AssetFloorListDTO)

const formSchema = defineSchema({
  fields: [
    defineField.Input({label: '楼层名称', prop: 'floorName', clearable: true}),
    defineField.Input({label: '楼层编码', prop: 'floorId', clearable: true}),
    defineField.Select({
      label: '所属项目',
      prop: 'projectTypeCode',
      options: projectOptions,
      props: {
        value: 'projectId',
        label: 'projectName',
      },
      clearable: true,
    }),
    defineField.Select({
      label: '所属楼栋',
      prop: 'assetId',
      options: buildingOptions,
      clearable: true,
      props: {
        value: 'buildingId',
        label: 'buildingName',
      },
    }),
    defineField.Cascader({
      label: '产权单位',
      prop: 'ownershipUnitCode',
      options: companyOptions,
      clearable: true,
      props: {
        checkStrictly: true,
        value: 'dicId',
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

onMounted(() => {
  getOptions()
  getData()
})

// 获取下拉接口
const getOptions = async (): Promise<void> => {
  const {data: project} = await projectList.runAsync({pageable: false} as AssetProjectListDTO)
  projectOptions.push(...Object.values(project))
  const {data: companyList} = await companyListTree.runAsync({
    dicType: 1001,
    pageable: false,
  } as SysDicListDTO)
  companyOptions.push(...Object.values(companyList))
  const {data: building} = await buildingList.runAsync({pageable: false} as AssetBuildingListDTO)
  buildingOptions.push(...Object.values(building))
}

const tableData = reactive<AssetFloorVO[]>([])
const getData = async (): Promise<void> => {
  loading.value = true
  const cloneformState = {...formState}
  if (cloneformState.ownershipUnitCode?.length) {
    cloneformState.ownershipUnitCode =
      cloneformState.ownershipUnitCode[cloneformState.ownershipUnitCode.length - 1]
  }
  const {total: resTotal, data} = await floorList.runAsync({...cloneformState})
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
const addFloor = () => router.push('/asset/management/add-floor')
const editFloor = (floorId: string) => router.push(`/asset/management/edit-floor/${floorId}`)
const detailFloor = (floorId: string) => router.push(`/asset/management/detail-floor/${floorId}`)

// 修改状态
const toggleStatus = (floorId: string, enable: number): void => {
  ElMessageBox.confirm(`是否确定${enable ? '停用' : '启用'}楼层?`, '确认提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await toggleStatusFloor.runAsync({floorId, enable: enable ? 0 : 1})
    ElMessage.success('修改成功')
    getData()
  })
}

// 删除
const deleteData = (floorId: string): void => {
  ElMessageBox.confirm(`是否确定删除楼层?`, '确认提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await deleteFloor.runAsync({floorId})
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
          <el-button type="primary" size="default" @click="addFloor">新增楼层</el-button>
          <el-button type="primary" size="default">导入</el-button>
          <el-button type="primary" size="default">导出</el-button>
        </div>
      </div>
    </template>

    <el-table v-loading="loading" :data="tableData" border>
      <el-table-column label="序号" type="index" width="60" />
      <el-table-column label="楼层编码" prop="floorId" />
      <el-table-column label="楼层名称" prop="floorName" />
      <el-table-column label="所属楼栋" prop="assetName" />
      <el-table-column label="所属项目" prop="projectName" />
      <el-table-column label="产权单位" prop="ownershipUnitName" />
      <el-table-column label="状态" prop="enable">
        <template #default="scope">
          <div>{{ scope?.row?.enable ? '启用' : '禁用' }}</div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="105">
        <template #default="{row}">
          <el-button
            v-if="row.enable"
            link
            type="danger"
            @click="toggleStatus(row.floorId, row.enable)"
          >
            停用
          </el-button>
          <el-button
            v-if="!row.enable"
            link
            type="primary"
            @click="toggleStatus(row.floorId, row.enable)"
          >
            启用
          </el-button>
          <el-button link type="primary" @click="detailFloor(row.floorId)">查看详情</el-button>
          <el-button link type="primary" @click="editFloor(row.floorId)">编辑</el-button>
          <el-button link type="danger" @click="deleteData(row.floorId)">删除</el-button>
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
