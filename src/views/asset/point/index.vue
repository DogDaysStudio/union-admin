<script setup lang="ts">
import {defineField, defineSchema} from '@/components'
import {onMounted, reactive, ref} from 'vue'
import {useRouter} from 'vue-router'
import {ElMessage, ElMessageBox} from 'element-plus'
import {
  amsAssetResourceList,
  amsAssetResourceEnable,
  amsAssetResourceDelete,
} from '@/service/api/amsAsset'
import {iamCommonDicListTree} from '@/service/api/iamCommon'
import {useRequest} from 'vue-request'

// 字典 [业务类型1009 点位类型1011 广告类型1010 媒体类型1012]
const dicListTree = useRequest(iamCommonDicListTree, {
  throttleInterval: 500,
})
const resourceBusinessTypeOptions = reactive<SysDicVO[]>([])
const resourceTypeOptions = reactive<SysDicVO[]>([])
const resourceAdTypeOptions = reactive<SysDicVO[]>([])
const resourceMediaOptions = reactive<SysDicVO[]>([])
// 列表数据
const resourceList = useRequest(amsAssetResourceList, {
  throttleInterval: 500,
})
// 修改数据状态
const resourceEnable = useRequest(amsAssetResourceEnable, {
  throttleInterval: 500,
})
// 删除数据
const resourceDelete = useRequest(amsAssetResourceDelete, {
  throttleInterval: 500,
})

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
        value: 'dicId',
        label: 'dicName',
      },
    }),
    defineField.Select({
      label: '点位类型',
      prop: 'resourceTypeCode',
      options: resourceTypeOptions,
      clearable: true,
      props: {
        value: 'dicId',
        label: 'dicName',
      },
    }),
    defineField.Cascader({
      label: '广告类型',
      prop: 'resourceAdTypeCode',
      options: resourceAdTypeOptions,
      clearable: true,
      props: {
        checkStrictly: true,
        value: 'dicId',
        label: 'dicName',
      },
    }),
    defineField.Select({
      label: '媒体类型',
      prop: 'resourceMediaTypeCode',
      options: resourceMediaOptions,
      clearable: true,
      props: {
        value: 'dicId',
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

onMounted(() => {
  getOptions()
  getData()
})

// 获取下拉接口
const getOptions = async (): Promise<void> => {
  const {data: resourceBusinessType} = await dicListTree.runAsync({dicType: 1009})
  resourceBusinessTypeOptions.push(...Object.values(resourceBusinessType))
  const {data: resourceType} = await dicListTree.runAsync({dicType: 10011})
  resourceTypeOptions.push(...Object.values(resourceType))
  const {data: resourceAdType} = await dicListTree.runAsync({dicType: 1010})
  resourceAdTypeOptions.push(...Object.values(resourceAdType))
  const {data: resourceMedia} = await dicListTree.runAsync({dicType: 1012})
  resourceMediaOptions.push(...Object.values(resourceMedia))
}

const tableData = reactive<AssetResourceVO[]>([])
const getData = async (): Promise<void> => {
  loading.value = true
  const cloneformState = {...formState}
  const {total: resTotal, data} = await resourceList.runAsync({...cloneformState})
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
const toggleStatus = (resourceId: string, enable: number): void => {
  ElMessageBox.confirm(`是否确定${enable ? '停用' : '启用'}点位?`, '确认提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await resourceEnable.runAsync({resourceId, enable: enable ? false : true})
    ElMessage.success('修改成功')
    getData()
  })
}

// 删除
const deleteRoom = (resourceId: string): void => {
  ElMessageBox.confirm(`是否确定删除点位?`, '确认提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await resourceDelete.runAsync({resourceId})
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
          <el-button type="primary" size="default" @click="addPoint">新增</el-button>
          <el-button type="primary" size="default">导入</el-button>
          <el-button type="primary" size="default">导出</el-button>
        </div>
      </div>
    </template>
    <el-table v-loading="loading" :data="tableData" border>
      <el-table-column label="序号" type="index" width="60" />
      <el-table-column label="点位编码" prop="resourceId" />
      <el-table-column label="点位名称" prop="resourceName" />
      <el-table-column label="点位编号" prop="resourceNumber" />
      <el-table-column label="业务类型" prop="resourceBusinessType" />
      <el-table-column label="点位类型" prop="resourceType" />
      <el-table-column label="广告类型" prop="resourceAdType" />
      <el-table-column label="媒体类型" prop="resourceMediaType" />
      <el-table-column label="所属项目" prop="projectName" />
      <el-table-column label="所属围合/楼栋" prop="buildingEnclosureName" />
      <el-table-column label="楼层名称" prop="floorName" />
      <el-table-column label="位置" prop="location" />
      <el-table-column label="规格" prop="resourceSpecs" />
      <el-table-column label="面积（㎡）" prop="resourceArea" />
      <el-table-column label="点位状态" prop="resourceState" />
      <el-table-column label="启停状态" prop="enable">
        <template #default="scope">
          <div>{{ scope?.row?.enable ? '启用' : '禁用' }}</div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="170">
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
