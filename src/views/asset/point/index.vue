<script setup lang="ts">
import {defineField, defineSchema} from '@/components'
import {onMounted, reactive, ref} from 'vue'
import {useRouter} from 'vue-router'
import {ElMessage, ElMessageBox} from 'element-plus'
import {useDicListTree} from '@/common/hooks/useDicTree'
import {
  amsAssetResourceList,
  amsAssetResourceEnable,
  amsAssetResourceDelete,
} from '@/service/api/amsAsset'
import {useRequest} from 'vue-request'

// 字典 [业务类型1009 点位类型1011 广告类型1010 媒体类型1012]
const resourceBusinessTypeOptions = useDicListTree({dicType: 1009})
const resourceTypeOptions = useDicListTree({dicType: 1011})
const resourceAdTypeOptions = useDicListTree({dicType: 1010})
const resourceMediaOptions = useDicListTree({dicType: 1012})
// 列表数据
const {runAsync: resourceList} = useRequest(amsAssetResourceList)
// 修改数据状态
const {runAsync: resourceEnable} = useRequest(amsAssetResourceEnable)
// 删除数据
const {runAsync: resourceDelete} = useRequest(amsAssetResourceDelete)

const formState = reactive({
  pageNum: 1,
  pageSize: 10,
} as AssetResourceListDTO)

const formSchema = defineSchema({
  fields: [
    defineField.Input({label: '楼栋名称', prop: 'buildingName', clearable: true}),
    defineField.Input({label: '楼层名称', prop: 'floorName', clearable: true}),
    defineField.Input({label: '所属项目', prop: 'projectName', clearable: true}),
    defineField.Select({
      label: '业务类型',
      prop: 'resourceBusinessTypeCode',
      options: resourceBusinessTypeOptions,
      clearable: true,
      props: {
        value: 'dicCode',
        label: 'dicName',
      },
    }),
    defineField.Select({
      label: '点位类型',
      prop: 'resourceTypeCode',
      options: resourceTypeOptions,
      clearable: true,
      props: {
        value: 'dicCode',
        label: 'dicName',
      },
    }),
    defineField.Select({
      label: '广告类型',
      prop: 'resourceAdTypeCode',
      options: resourceAdTypeOptions,
      clearable: true,
      props: {
        value: 'dicCode',
        label: 'dicName',
      },
    }),
    defineField.Select({
      label: '媒体类型',
      prop: 'resourceMediaTypeCode',
      options: resourceMediaOptions,
      clearable: true,
      props: {
        value: 'dicCode',
        label: 'dicName',
      },
    }),
    defineField.Input({label: '资源名称', prop: 'resourceName', clearable: true}),
    defineField.Select({
      label: '资源状态',
      prop: 'resourceState',
      options: [
        {value: '0', label: '待租'},
        {value: '1', label: '已租'},
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

const tableData = reactive<AssetResourceVO[]>([])
const getData = async (): Promise<void> => {
  loading.value = true
  const cloneformState = {...formState}
  const {total: resTotal, data} = await resourceList({...cloneformState})
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
const addPoint = () => router.push('/asset/management/add-point')
const editPoint = (resourceId: string) => router.push(`/asset/management/edit-point/${resourceId}`)
const detailPoint = (resourceId: string) =>
  router.push(`/asset/management/detail-point/${resourceId}`)

// 修改状态
const toggleStatus = async (resourceId: string, enable: number) => {
  await ElMessageBox.confirm(`是否确定${enable ? '停用' : '启用'}点位?`, '确认提示')
  await resourceEnable({resourceId, enable: enable ? false : true})
  ElMessage.success('修改成功')
  getData()
}

// 删除
const deleteRoom = async (resourceId: string) => {
  await ElMessageBox.confirm(`是否确定删除点位?`, '确认提示')
  await resourceDelete({resourceId})
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
          <el-button type="primary" size="default" @click="addPoint">新增</el-button>
          <el-button type="primary" size="default">导入</el-button>
          <el-button type="primary" size="default">导出</el-button>
        </div>
      </div>
    </template>
    <el-table v-loading="loading" :data="tableData" border>
      <el-table-column label="序号" type="index" width="60" fixed="left" />
      <el-table-column label="点位编码" prop="resourceId" width="180" />
      <el-table-column label="点位名称" prop="resourceName" width="120" />
      <el-table-column label="点位编号" prop="resourceNumber" width="120" />
      <el-table-column label="业务类型" prop="resourceBusinessType" width="120" />
      <el-table-column label="点位类型" prop="resourceType" width="120" />
      <el-table-column label="广告类型" prop="resourceAdType" width="120" />
      <el-table-column label="媒体类型" prop="resourceMediaType" width="120" />
      <el-table-column label="所属项目" prop="projectName" width="120" />
      <el-table-column label="所属围合/楼栋" prop="assetName" width="120" />
      <el-table-column label="楼层名称" prop="floorName" width="120" />
      <el-table-column label="位置" prop="locationName" width="120" />
      <el-table-column label="规格" prop="resourceSpecs" width="80" />
      <el-table-column label="面积（㎡）" prop="resourceArea" width="100" />
      <el-table-column label="点位状态" prop="resourceState" width="90" />
      <el-table-column label="启停状态" prop="enable" width="90">
        <template #default="scope">
          <div>{{ scope?.row?.enable ? '启用' : '禁用' }}</div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="230">
        <template #default="{row}">
          <el-button
            link
            :type="row.enable ? 'danger' : 'primary'"
            @click="toggleStatus(row.resourceId, row.enable)"
          >
            {{ row.enable ? '停用' : '启用' }}
          </el-button>
          <el-button link type="primary" @click="detailPoint(row.resourceId)">查看详情</el-button>
          <el-button link type="primary" @click="editPoint(row.resourceId)">编辑</el-button>
          <el-button link type="danger" @click="deleteRoom(row.resourceId)">删除</el-button>
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
