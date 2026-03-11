<script setup lang="ts">
import {defineField, defineSchema} from '@/components'
import {onMounted, reactive, ref, useTemplateRef, watch} from 'vue'
import {useRouter} from 'vue-router'
import {ElMessage, ElMessageBox} from 'element-plus'
import {useDicListTree, useExport} from '@/common/hooks'
import {
  amsAssetShopList,
  amsAssetShopEnable,
  amsAssetShopDelete,
  amsAssetShopGet,
  amsAssetShopSplit,
} from '@/service/api/amsAsset'
import {iamCommonAreaList} from '@/service/api/iamCommon'
import {useRequest} from 'vue-request'

// 字典 [产权单位1001 经营模式1020]
const companyOptions = useDicListTree({dicType: 1001})
const businessModelOptions = useDicListTree({dicType: 1020})
const projectTypeOption = useDicListTree({dicType: 1003})
// 所属省市区
const {runAsync: areaList} = useRequest(iamCommonAreaList)
const cityOptions = reactive<PairModel[]>([])
// 列表数据
const {runAsync: shopList} = useRequest(amsAssetShopList)
// 修改数据状态
const {runAsync: shopEnable} = useRequest(amsAssetShopEnable)
// 删除数据
const {runAsync: shopDelete} = useRequest(amsAssetShopDelete)
// 商铺详情
const {runAsync: shopGet} = useRequest(amsAssetShopGet)
// 商铺拆分
const {runAsync: shopSplit, loading: splitLoading} = useRequest(amsAssetShopSplit)

const formState = reactive({
  pageNum: 1,
  pageSize: 10,
} as AssetShopListDTO)

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
    defineField.Select({
      label: '项目类型',
      prop: 'projectTypeCode',
      options: projectTypeOption,
      clearable: true,
      props: {
        value: 'dicCode',
        label: 'dicName',
      },
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

const tableData = reactive<AssetShopVO[]>([])
const getData = async (): Promise<void> => {
  loading.value = true
  const params = getParams()
  const {total: resTotal, data} = await shopList({...params})
  total.value = resTotal
  tableData.length = 0
  tableData.push(...data)
  loading.value = false
}

const getParams = () => {
  const cloneformState = {...formState}
  cloneformState.cityCode = cloneformState?.provinceCode?.[1]
  cloneformState.districtCode = cloneformState?.provinceCode?.[2]
  cloneformState.provinceCode = cloneformState?.provinceCode?.[0]
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
const addShop = () => router.push('/asset/management/add-shop')
const editShop = (shopId: string) => router.push(`/asset/management/edit-shop/${shopId}`)
const detailShop = (shopId: string) => router.push(`/asset/management/detail-shop/${shopId}`)

// 修改状态
const toggleStatus = async (shopId: string, enable: number) => {
  await ElMessageBox.confirm(`是否确定${enable ? '停用' : '启用'}商铺?`, '确认提示', {
    type: 'warning',
  })
  await shopEnable({shopId, enable: enable ? false : true})
  ElMessage.success('修改成功')
  getData()
}

// 删除
const deleteShop = async (shopId: string) => {
  await ElMessageBox.confirm(`是否确定删除商铺?`, '确认提示', {type: 'warning'})
  await shopDelete({shopId})
  ElMessage.success('删除成功')
  getData()
}

const handleImport = () => {
  router.push('/asset/management/import-shop')
}

const {exportData, loading: exportLoading} = useExport({
  meta: '/ams/asset-shop/list-export-meta',
  url: '/ams/asset-shop/list-export',
})

// 弹窗
const dialogVisible = ref(false)
const splitFormRef = useTemplateRef('splitFormRef')

interface AssetShopSplitMoreDTO {
  shopNumber: string
  shopName: string
  buildingArea: number
  usableArea: number
  splitNumber: number
}
// 表单
const splitForm = reactive({shopSplitList: []} as AssetShopSplitDTO & AssetShopSplitMoreDTO)

const splitShop = async (shopId: string) => {
  dialogVisible.value = true
  const {data} = await shopGet({shopId})
  Object.assign(splitForm, data)
  splitForm.shopSplitList.length = 0
  addShopSplitList()
}

const addShopSplitList = () => {
  splitForm.shopSplitList.push({
    shopName: '', // 商铺名称
    shopNumber: '', // 商铺号
    buildingArea: null, // 建筑面积
    usableArea: null, // 实用面积
  })
}

const deleteShopSplitList = (index: number) => {
  splitForm.shopSplitList.splice(index, 1)
}

watch(splitForm.shopSplitList, () => {
  splitForm.splitNumber = splitForm.shopSplitList.length
})

const handleSplitConfirm = async () => {
  await splitFormRef.value?.validate()
  let Flag = true
  splitForm.shopSplitList.map(item => {
    if (!item.shopName || !item.shopNumber || !item.buildingArea || !item.usableArea) Flag = false
  })
  if (Flag) {
    const {msg} = await shopSplit({...splitForm})
    ElMessage.success(msg)
    dialogVisible.value = false
    getData()
  } else {
    ElMessage.warning('请填写完整数据')
  }
}

const handleSplitCancel = () => (dialogVisible.value = false)
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
          <el-button type="primary" @click="addShop">新增房屋（商业）</el-button>
          <el-button @click="handleImport">导入</el-button>
          <el-button @click="exportData(getParams())" :loading="exportLoading">导出</el-button>
        </div>
      </div>
    </template>
    <el-table v-loading="loading" :data="tableData" border row-key="shopId" default-expand-all>
      <el-table-column label="序号" type="index" width="55" fixed="left" />
      <el-table-column label="商铺编码" prop="shopId" width="240" />
      <el-table-column label="商铺号" prop="shopNumber" width="150" />
      <el-table-column label="商铺名称" prop="shopName" width="150" />
      <el-table-column label="建筑面积（㎡）" prop="buildingArea" width="125" />
      <el-table-column label="实用面积（㎡）" prop="usableArea" width="125" />
      <el-table-column label="所属项目" prop="projectName" width="120" />
      <el-table-column label="所属楼栋/围合" prop="assetName" width="125" />
      <el-table-column label="所属楼层" prop="floorName" width="90" />
      <el-table-column label="经营模式" prop="businessModelName" width="100" />
      <el-table-column label="产权单位" prop="ownershipUnitName" width="240" />
      <el-table-column label="拆分状态" prop="splitState" width="90">
        <template #default="scope">
          <div>{{ scope?.row?.splitState ? '已拆分' : '未拆分' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="enable" width="70">
        <template #default="{row}">
          <el-switch
            :model-value="row.enable === 1"
            @change="toggleStatus(row.shopId, row.enable)"
          />
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="250">
        <template #default="{row}">
          <el-button link type="primary" @click="detailShop(row.shopId)">查看详情</el-button>
          <el-button link type="primary" @click="editShop(row.shopId)">编辑</el-button>
          <el-button link type="primary" @click="splitShop(row.shopId)">商铺拆分</el-button>
          <el-button link type="danger" @click="deleteShop(row.shopId)">删除</el-button>
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

  <!-- 添加部门弹窗 -->
  <el-dialog v-model="dialogVisible" title="商铺拆分" @closed="splitFormRef?.resetFields()">
    <el-form :model="splitForm" ref="splitFormRef" label-width="90px">
      <el-form-item label="商铺号" required>
        <el-input v-model="splitForm.shopNumber" disabled />
      </el-form-item>
      <el-form-item label="商铺编码" required>
        <el-input v-model="splitForm.shopId" disabled />
      </el-form-item>
      <el-form-item label="商铺名称" required>
        <el-input v-model="splitForm.shopName" disabled />
      </el-form-item>
      <el-form-item label="建筑面积" required>
        <el-input-number v-model="splitForm.buildingArea" disabled :min="0" />
      </el-form-item>
      <el-form-item label="实用面积" required>
        <el-input-number v-model="splitForm.usableArea" disabled :min="0" />
      </el-form-item>
      <el-form-item label="拆分间数" required>
        <el-input-number v-model="splitForm.splitNumber" disabled :min="0" :precision="0" />
      </el-form-item>
      <el-table :data="splitForm.shopSplitList" border>
        <el-table-column label="拆分商铺名称" prop="shopName">
          <template #default="{row}">
            <el-input v-model="row.shopName" />
          </template>
        </el-table-column>
        <el-table-column label="拆分商铺号" prop="shopNumber">
          <template #default="{row}">
            <el-input v-model="row.shopNumber" />
          </template>
        </el-table-column>
        <el-table-column label="建筑面积" prop="buildingArea">
          <template #default="{row}">
            <el-input-number v-model="row.buildingArea" :min="0" />
          </template>
        </el-table-column>
        <el-table-column label="实用面积" prop="usableArea">
          <template #default="{row}">
            <el-input-number v-model="row.usableArea" :min="0" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{$index}">
            <el-button link type="primary" @click="addShopSplitList">添加</el-button>
            <el-button
              link
              type="danger"
              @click="deleteShopSplitList($index)"
              :disabled="$index === 0"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <template #footer>
      <el-button @click="handleSplitCancel">取消</el-button>
      <el-button type="primary" @click="handleSplitConfirm" :loading="splitLoading">确定</el-button>
    </template>
  </el-dialog>
</template>
