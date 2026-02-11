<script setup lang="ts">
import {defineField, defineSchema} from '@/components'
import {onMounted, reactive, ref} from 'vue'
import {useRouter} from 'vue-router'
import {ElMessage, ElMessageBox} from 'element-plus'
import {amsAssetRoomList, amsAssetRoomEnable, amsAssetRoomDelete} from '@/service/api/amsAsset'
import {iamCommonDicListTree, iamCommonAreaList} from '@/service/api/iamCommon'
import {useRequest} from 'vue-request'

// 字典 [产权单位/公司1001 经营模式1020 项目类型1003 资产分类1002 房屋类型1005]
const dicListTree = useRequest(iamCommonDicListTree, {
  throttleInterval: 500,
})
const companyOptions = reactive<SysDicVO[]>([])
const businessModelOptions = reactive<SysDicVO[]>([])
// const projectTypeOptions = reactive<SysDicVO[]>([])
// const assetOptions = reactive<SysDicVO[]>([])
// const roomTypeOptions = reactive<SysDicVO[]>([])
// 所属省市区
const areaList = useRequest(iamCommonAreaList, {
  throttleInterval: 500,
})
const cityOptions = reactive<PairModel[]>([])
// 列表数据
const roomList = useRequest(amsAssetRoomList, {
  throttleInterval: 500,
})
// 修改数据状态
const roomEnable = useRequest(amsAssetRoomEnable, {
  throttleInterval: 500,
})
// 删除数据
const roomDelete = useRequest(amsAssetRoomDelete, {
  throttleInterval: 500,
})

const formState = reactive({
  pageNum: 1,
  pageSize: 10,
} as AssetRoomListDTO)

const formSchema = defineSchema({
  fields: [
    defineField.Input({label: '楼栋名称', prop: 'buildingName', clearable: true}),
    defineField.Input({label: '楼层名称', prop: 'floorName', clearable: true}),
    defineField.Input({label: '所属项目', prop: 'projectName', clearable: true}),
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
      label: '经营模式',
      prop: 'businessModelCode',
      options: businessModelOptions,
      clearable: true,
      props: {
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
    defineField.Cascader({
      label: '所属省市区',
      prop: 'provinceCode',
      props: {
        value: 'k',
        label: 'v',
        checkStrictly: true,
        lazy: true,
        lazyLoad(node, resolve) {
          const {level, value} = node
          setTimeout(async () => {
            let nodes: {k: string; v: string; leaf?: boolean}[] = []
            switch (level) {
              case 0:
                nodes = cityOptions
                break
              case 1:
              case 2:
                const {data} = await areaList.runAsync({pid: value})
                nodes = data
                break
            }
            nodes.forEach(item => (level >= 2 ? (item.leaf = true) : ''))
            resolve(nodes)
          }, 800)
        },
      },
      clearable: true,
    }),
    // defineField.Select({
    //   label: '项目类型',
    //   prop: 'ownershipUnitCode',
    //   options: projectTypeOptions,
    //   clearable: true,
    //   props: {
    //     value: 'dicId',
    //     label: 'dicName',
    //   },
    // }),
    // defineField.Cascader({
    //   label: '资产类型',
    //   prop: 'ownershipUnitCode',
    //   options: assetOptions,
    //   clearable: true,
    //   props: {
    //     checkStrictly: true,
    //     value: 'dicId',
    //     label: 'dicName',
    //   },
    // }),
    // defineField.Select({
    //   label: '房屋类型',
    //   prop: 'ownershipUnitCode',
    //   options: roomTypeOptions,
    //   clearable: true,
    //   props: {
    //     value: 'dicId',
    //     label: 'dicName',
    //   },
    // }),
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
  const {data: companyList} = await dicListTree.runAsync({
    dicType: 1001,
    pageable: false,
  } as SysDicListDTO)
  companyOptions.push(...Object.values(companyList))
  const {data: businessModel} = await dicListTree.runAsync({dicType: 1020})
  businessModelOptions.push(...Object.values(businessModel))
  //   const {data: projectType} = await dicListTree.runAsync({dicType: 1003})
  //   projectTypeOptions.push(...Object.values(projectType))
  //   const {data: asset} = await dicListTree.runAsync({dicType: 1002})
  //   assetOptions.push(...Object.values(asset))
  //   const {data: roomType} = await dicListTree.runAsync({dicType: 1005})
  //   roomTypeOptions.push(...Object.values(roomType))
  const {data: cityOption} = await areaList.runAsync({pid: ''})
  cityOptions.push(...cityOption)
}

const tableData = reactive<AssetRoomVO[]>([])
const getData = async (): Promise<void> => {
  loading.value = true
  const cloneformState = {...formState}
  if (cloneformState.ownershipUnitCode?.length) {
    cloneformState.ownershipUnitCode =
      cloneformState.ownershipUnitCode[cloneformState.ownershipUnitCode.length - 1]
  }
  const {total: resTotal, data} = await roomList.runAsync({...cloneformState})
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
const addRoom = () => router.push('/asset/management/add-room')
const editRoom = (roomId: string) => router.push(`/asset/management/edit-room/${roomId}`)
const detailRoom = (roomId: string) => router.push(`/asset/management/detail-room/${roomId}`)

// 修改状态
const toggleStatus = (roomId: string, enable: number): void => {
  ElMessageBox.confirm(`是否确定${enable ? '停用' : '启用'}房间?`, '确认提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await roomEnable.runAsync({roomId, enable: enable ? false : true})
    ElMessage.success('修改成功')
    getData()
  })
}

// 删除
const deleteRoom = (roomId: string): void => {
  ElMessageBox.confirm(`是否确定删除房间?`, '确认提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await roomDelete.runAsync({roomId})
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
          <el-button type="primary" size="default" @click="addRoom">新增房屋</el-button>
          <el-button type="primary" size="default">导入</el-button>
          <el-button type="primary" size="default">导出</el-button>
        </div>
      </div>
    </template>
    <el-table v-loading="loading" :data="tableData" border>
      <el-table-column label="序号" type="index" width="60" />
      <el-table-column label="房间编码" prop="roomId" />
      <el-table-column label="房间号" prop="roomNumber" />
      <el-table-column label="户型" prop="roomLayoutName" />
      <el-table-column label="建筑面积（㎡）" prop="buildingArea" />
      <el-table-column label="所属项目" prop="projectName" />
      <el-table-column label="所属楼栋" prop="buildingName" />
      <el-table-column label="所属楼层" prop="floorName" />
      <el-table-column label="经营模式" prop="businessModelName" />
      <el-table-column label="产权单位" prop="ownershipUnitName" />
      <!-- <el-table-column label="租赁类型" prop="ownershipUnitName" />
      <el-table-column label="拆分状态" prop="ownershipUnitName" /> -->
      <el-table-column label="状态" prop="enable">
        <template #default="scope">
          <div>{{ scope?.row?.enable ? '启用' : '禁用' }}</div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="170">
        <template #default="{row}">
          <el-button
            v-if="row.enable"
            link
            type="danger"
            @click="toggleStatus(row.roomId, row.enable)"
          >
            停用
          </el-button>
          <el-button
            v-if="!row.enable"
            link
            type="primary"
            @click="toggleStatus(row.roomId, row.enable)"
          >
            启用
          </el-button>
          <el-button link type="primary" @click="detailRoom(row.roomId)">查看详情</el-button>
          <el-button link type="primary" @click="editRoom(row.roomId)">编辑</el-button>
          <el-button link type="danger" @click="deleteRoom(row.roomId)">删除</el-button>
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
