<script setup lang="ts">
import {defineField, defineSchema} from '@/components'
import {onMounted, reactive, ref} from 'vue'
import {useRouter} from 'vue-router'
import {ElMessage, ElMessageBox} from 'element-plus'
import {useDicListTree} from '@/common/hooks/useDicTree'
import {amsAssetShopList, amsAssetShopEnable, amsAssetShopDelete} from '@/service/api/amsAsset'
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
  const cloneformState = {...formState}
  cloneformState.cityCode = cloneformState?.provinceCode?.[1]
  cloneformState.districtCode = cloneformState?.provinceCode?.[2]
  cloneformState.provinceCode = cloneformState?.provinceCode?.[0]
  if (cloneformState.ownershipUnitCode?.length) {
    cloneformState.ownershipUnitCode =
      cloneformState.ownershipUnitCode[cloneformState.ownershipUnitCode.length - 1]
  }
  const {total: resTotal, data} = await shopList({...cloneformState})
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
          <el-button type="primary" size="default" @click="addShop">新增房屋（商业）</el-button>
          <el-button type="primary" size="default">导入</el-button>
          <el-button type="primary" size="default">导出</el-button>
        </div>
      </div>
    </template>
    <el-table v-loading="loading" :data="tableData" border>
      <el-table-column label="序号" type="index" width="60" />
      <el-table-column label="商铺编码" prop="shopId" />
      <el-table-column label="商铺名称" prop="shopNumber" />
      <el-table-column label="建筑面积（㎡）" prop="buildingArea" width="125" />
      <el-table-column label="实用面积（㎡）" prop="usableArea" width="125" />
      <el-table-column label="所属项目" prop="projectName" />
      <el-table-column label="所属楼栋/围合" prop="assetName" width="125" />
      <el-table-column label="所属楼层" prop="floorName" width="90" />
      <el-table-column label="经营模式" prop="businessModelName" />
      <el-table-column label="产权单位" prop="ownershipUnitName" />
      <el-table-column label="状态" prop="enable" width="70">
        <template #default="scope">
          <div>{{ scope?.row?.enable ? '启用' : '禁用' }}</div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="180">
        <template #default="{row}">
          <el-button
            link
            :type="row.enable ? 'danger' : 'primary'"
            @click="toggleStatus(row.shopId, row.enable)"
          >
            {{ row.enable ? '停用' : '启用' }}
          </el-button>
          <el-button link type="primary" @click="detailShop(row.shopId)">查看详情</el-button>
          <el-button link type="primary" @click="editShop(row.shopId)">编辑</el-button>
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
</template>
