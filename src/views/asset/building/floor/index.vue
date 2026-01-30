<script setup lang="ts">
import {defineField, defineSchema} from '@/components'
import {onMounted, reactive, ref} from 'vue'
import {useRouter} from 'vue-router'
import {ElMessage, ElMessageBox} from 'element-plus'
import {amsAsset} from '@/service/api/amsAsset'
import {useRequest} from 'vue-request'

// 列表数据
const floorList = useRequest(amsAsset.amsAssetFloorList, {
  throttleInterval: 500,
})
// 修改数据状态
const toggleStatusFloor = useRequest(amsAsset.amsAssetFloorEnable, {
  throttleInterval: 500,
})
// 删除数据
const deleteFloor = useRequest(amsAsset.amsAssetFloorDelete, {
  throttleInterval: 500,
})

const formState = reactive({
  pageable: false,
  pageNum: 1,
  pageSize: 10,
  floorId: '', // 楼层编码
  floorName: '', // 楼层名称
  projectId: '', // 项目编码
  assetId: '', // 楼层编码
  ownershipUnitCode: '', // 产权单位编码
  enable: null, // 0-禁用;1-启用
} as AssetFloorListDTO)

const formSchema = defineSchema({
  fields: [
    defineField.Input({label: '楼层名称', prop: 'floorName', clearable: true}),
    defineField.Input({label: '楼层编码', prop: 'floorId', clearable: true}),
    defineField.Select({
      label: '所属楼层',
      prop: 'assetId',
      options: [
        {value: 'option1', label: 'option1'},
        {value: 'option2', label: 'option2'},
      ],
      clearable: true,
    }),
    defineField.Select({
      label: '产权公司',
      prop: 'ownershipUnitCode',
      options: [
        {value: 'option1', label: 'option1'},
        {value: 'option2', label: 'option2'},
      ],
      clearable: true,
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
  getData()
})

const tableData = reactive<AssetFloorVO[]>([])
const getData = async (): Promise<void> => {
  loading.value = true
  const cloneformState = {...formState}
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
const addProject = () => {
  router.push('/asset/management/add')
}

// 修改状态
const toggleStatus = (floorId: string, enable: number): void => {
  ElMessageBox.confirm(`是否确定${enable ? '停用' : '启用'}楼层?`, '确认提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const {code} = await toggleStatusFloor.runAsync({floorId, enable: enable ? 0 : 1})
      if (code === 200) {
        getData()
        ElMessage({
          type: 'success',
          message: '修改成功',
        })
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消操作',
      })
    })
}

// 删除
const deleteData = (floorId: string): void => {
  ElMessageBox.confirm(`是否确定删除楼层?`, '确认提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const {code} = await deleteFloor.runAsync({floorId})
      if (code === 200) {
        getData()
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消操作',
      })
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
          <el-button type="primary" size="default" @click="addProject">新增楼层</el-button>
          <el-button type="primary" size="default">导入</el-button>
          <el-button type="primary" size="default">导出</el-button>
        </div>
      </div>
    </template>

    <el-table v-loading="loading" :data="tableData" border>
      <el-table-column label="序号" type="index" width="60" />
      <el-table-column label="楼层编码" prop="floorId" />
      <el-table-column label="楼层名称" prop="floorName" />
      <el-table-column label="所属楼栋" prop="assetType" />
      <el-table-column label="所属项目" prop="projectName" />
      <el-table-column label="产权公司" prop="ownershipUnitName" />
      <el-table-column label="状态" prop="enable">
        <template #default="scope">
          <div>{{ scope?.row?.enable ? '启用' : '禁用' }}</div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="185">
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
          <el-button link type="primary">查看详情</el-button>
          <el-button link type="primary">编辑</el-button>
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
