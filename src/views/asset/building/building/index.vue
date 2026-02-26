<script setup lang="ts">
import {defineField, defineSchema} from '@/components'
import {onMounted, reactive, ref} from 'vue'
import {useRouter} from 'vue-router'
import {ElMessage, ElMessageBox} from 'element-plus'
import {useRequest} from 'vue-request'
import {
  amsAssetBuildingDelete,
  amsAssetBuildingEnable,
  amsAssetBuildingList,
  amsAssetProjectList,
} from '@/service/api/amsAsset'
import {iamCommonDicListTree} from '@/service/api/iamCommon'

// 获取项目列表
const projectList = useRequest(amsAssetProjectList, {
  throttleInterval: 500,
})
const projectOptions = reactive<{projectId: string; projectName: string}[]>([])
// 字典 产权单位（公司）
const companyListTree = useRequest(iamCommonDicListTree, {
  throttleInterval: 500,
})
const companyOptions = reactive<SysDicVO[]>([])
// 列表数据
const buildingList = useRequest(amsAssetBuildingList, {
  throttleInterval: 500,
})
// 修改数据状态
const toggleStatusBuilding = useRequest(amsAssetBuildingEnable, {
  throttleInterval: 500,
})
// 删除数据
const deleteBuilding = useRequest(amsAssetBuildingDelete, {
  throttleInterval: 500,
})

const formState = reactive({
  pageable: false,
  pageNum: 1,
  pageSize: 10,
  projectName: '', // 项目名称
  buildingId: '', // 楼栋编码
  buildingName: '', // 楼栋名称
  projectTypeCode: '', // 项目类型编码
  ownershipUnitCode: '', // 产权单位编码
  enable: null, // 状态
} as AssetBuildingListDTO)

const formSchema = defineSchema({
  fields: [
    defineField.Input({label: '楼栋名称', prop: 'buildingName', clearable: true}),
    defineField.Input({label: '楼栋编码', prop: 'buildingId', clearable: true}),
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

onMounted(() => {
  getOptions()
  getData()
})

// 获取下拉接口
const getOptions = async (): Promise<void> => {
  const {data: project} = await projectList.runAsync({pageable: false} as AssetProjectListDTO)
  projectOptions.push(...Object.values(project))
  const {data: companyList} = await companyListTree.runAsync({dicType: 1001})
  companyOptions.push(...Object.values(companyList))
}

const tableData = reactive<AssetBuildingVO[]>([])
const getData = async (): Promise<void> => {
  loading.value = true
  const cloneformState = {...formState}
  if (cloneformState.ownershipUnitCode?.length) {
    cloneformState.ownershipUnitCode =
      cloneformState.ownershipUnitCode[cloneformState.ownershipUnitCode.length - 1]
  }
  const {total: resTotal, data} = await buildingList.runAsync({...cloneformState})
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
const addBuilding = () => router.push('/asset/management/add-building')
const editBuilding = (buildingId: string) =>
  router.push(`/asset/management/edit-building/${buildingId}`)
const detailBuilding = (buildingId: string) =>
  router.push(`/asset/management/detail-building/${buildingId}`)

// 修改状态
const toggleStatus = (buildingId: string, enable: number): void => {
  ElMessageBox.confirm(`是否确定${enable ? '停用' : '启用'}楼栋?`, '确认提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await toggleStatusBuilding.runAsync({buildingId, enable: !enable})
    ElMessage.success('修改成功')
    getData()
  })
}

// 删除
const deleteData = (buildingId: string): void => {
  ElMessageBox.confirm(`是否确定删除楼栋?`, '确认提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await deleteBuilding.runAsync({buildingId})
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
          <el-button type="primary" size="default" @click="addBuilding">新增楼栋</el-button>
          <el-button type="primary" size="default">导入</el-button>
          <el-button type="primary" size="default">导出</el-button>
        </div>
      </div>
    </template>

    <el-table v-loading="loading" :data="tableData" border>
      <el-table-column label="序号" type="index" width="60" />
      <el-table-column label="楼栋编码" prop="buildingId" />
      <el-table-column label="楼栋名称" prop="buildingName" />
      <el-table-column label="所属项目" prop="projectName" />
      <el-table-column label="项目类型" prop="projectTypeName" />
      <el-table-column label="产权单位" prop="ownershipUnitName" />
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
            @click="toggleStatus(row.buildingId, row.enable)"
          >
            {{ row.enable ? '停用' : '启用' }}
          </el-button>
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
