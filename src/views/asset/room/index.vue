<script setup lang="ts">
import {defineField, defineSchema} from '@/components'
import {onMounted, reactive, ref} from 'vue'
import {useRouter} from 'vue-router'
import {ElMessage, ElMessageBox} from 'element-plus'
import {useDicListTree} from '@/common/hooks/useDicTree'
import {amsAssetRoomList, amsAssetRoomEnable, amsAssetRoomDelete} from '@/service/api/amsAsset'
import {iamCommonAreaList} from '@/service/api/iamCommon'
import {useRequest} from 'vue-request'

// 字典 [产权单位1001 经营模式1020]
const companyOptions = useDicListTree({dicType: 1001})
const businessModelOptions = useDicListTree({dicType: 1020})
// 所属省市区
const {runAsync: areaList} = useRequest(iamCommonAreaList)
const cityOptions = reactive<PairModel[]>([])
// 列表数据
const {runAsync: roomList} = useRequest(amsAssetRoomList)
// 修改数据状态
const {runAsync: roomEnable} = useRequest(amsAssetRoomEnable)
// 删除数据
const {runAsync: roomDelete} = useRequest(amsAssetRoomDelete)

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
        value: 'dicCode',
        label: 'dicName',
      },
    }),
    defineField.Select({
      label: '经营模式',
      prop: 'businessModelCode',
      options: businessModelOptions,
      clearable: true,
      props: {
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
                const {data} = await areaList({pid: value})
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

const getOptions = async (): Promise<void> => {
  const {data: cityOption} = await areaList({pid: ''})
  cityOptions.push(...cityOption)
}

const tableData = reactive<AssetRoomVO[]>([])
const getData = async (): Promise<void> => {
  loading.value = true
  const cloneformState = {...formState}
  cloneformState.cityCode = cloneformState?.provinceCode?.[1]
  cloneformState.districtCode = cloneformState?.provinceCode?.[2]
  cloneformState.provinceCode = cloneformState?.provinceCode?.[0]
  if (cloneformState.ownershipUnitCode?.length) {
    cloneformState.ownershipUnitCode =
      cloneformState.ownershipUnitCode[cloneformState.ownershipUnitCode.length - 1]
  }
  const {total: resTotal, data} = await roomList({...cloneformState})
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
const toggleStatus = async (roomId: string, enable: number) => {
  await ElMessageBox.confirm(`是否确定${enable ? '停用' : '启用'}房间?`, '确认提示')
  await roomEnable({roomId, enable: enable ? false : true})
  ElMessage.success('修改成功')
  getData()
}

// 删除
const deleteRoom = async (roomId: string) => {
  await ElMessageBox.confirm(`是否确定删除房间?`, '确认提示')
  await roomDelete({roomId})
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
      <el-table-column label="建筑面积（㎡）" prop="buildingArea" width="130" />
      <el-table-column label="所属项目" prop="projectName" />
      <el-table-column label="所属楼栋" prop="buildingName" />
      <el-table-column label="所属楼层" prop="floorName" />
      <el-table-column label="经营模式" prop="businessModelName" />
      <el-table-column label="产权单位" prop="ownershipUnitName" />
      <el-table-column label="状态" prop="enable">
        <template #default="scope">
          <div>{{ scope?.row?.enable ? '启用' : '禁用' }}</div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="175">
        <template #default="{row}">
          <el-button
            link
            :type="row.enable ? 'danger' : 'primary'"
            @click="toggleStatus(row.roomId, row.enable)"
          >
            {{ row.enable ? '停用' : '启用' }}
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
