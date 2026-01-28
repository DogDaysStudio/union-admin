<script setup lang="ts">
import {defineField, defineSchema} from '@/utils/form-schema'
import {onMounted, reactive, ref} from 'vue'
import {iamCommon} from '@/service/api/iamCommon'
import {amsAsset} from '@/service/api/amsAsset'
import {useRequest} from 'vue-request'

// 所属省市区
const areaList = useRequest(iamCommon.iamCommonAreaList, {
  throttleInterval: 500,
})
const cityOptions = reactive<PairModel[]>([])
// 项目来源
// 产权单位

// 列表数据
const projectList = useRequest(amsAsset.amsAssetProjectList, {
  throttleInterval: 500,
})

const formState = reactive({
  pageable: false,
  pageNum: 1,
  pageSize: 10,
  projectName: '', // 项目名称
  provinceCode: '', // 所在区域-省 code
  cityCode: '', // 所在区域-城市 code
  districtCode: '', // 地址-区域 code
  collectWayCode: '', // 筹集方式编码
  ownershipUnitCode: '', // 产权单位编码
  ownershipPropertyCode: '', // 产权性质编码
  businessModelCode: '', // 经营模式编码
  enable: null, // 状态
} as AssetProjectListDTO)

const formSchema = defineSchema({
  fields: [
    defineField.Input({label: '项目名称', prop: 'projectName', clearable: true}),
    defineField.Select({
      label: '所属省市区',
      prop: 'provinceCode',
      options: cityOptions,
      props: {
        value: 'k',
        label: 'v',
      },
      clearable: true,
    }),
    defineField.Select({
      label: '项目来源',
      prop: 'collectWayCode',
      options: [
        {value: 'option1', label: 'option1'},
        {value: 'option2', label: 'option2'},
      ],
      clearable: true,
    }),
    defineField.Select({
      label: '产权单位',
      prop: 'ownershipUnitCode',
      options: [
        {value: 'option1', label: 'option1'},
        {value: 'option2', label: 'option2'},
      ],
      clearable: true,
    }),
    defineField.Select({
      label: '产权性质',
      prop: 'ownershipPropertyCode',
      options: [
        {value: 'option1', label: 'option1'},
        {value: 'option2', label: 'option2'},
      ],
      clearable: true,
    }),
    defineField.Select({
      label: '运营模式',
      prop: 'businessModelCode',
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
        {value: 'option1', label: 'option1'},
        {value: 'option2', label: 'option2'},
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

const getOptions = async (): Promise<void> => {
  const {data: cityOption} = await areaList.runAsync({pid: ''})
  cityOptions.push(...cityOption)
}

const tableData = reactive<AssetProjectVO[]>([])
const getData = async (): Promise<void> => {
  loading.value = true
  const {total: resTotal, data} = await projectList.runAsync({...formState})
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
</script>

<template>
  <el-card>
    <template #header>数据筛选</template>
    <schema-form :schema="formSchema" :model="formState" @finish="handleFinish"></schema-form>
  </el-card>

  <el-card class="mt-base">
    <template #header>
      <div class="flex items-center justify-between w-full">
        <span class="text-base font-medium">数据列表</span>
        <div class="flex">
          <el-button type="primary" size="default">新增项目</el-button>
          <el-button type="primary" size="default">导入</el-button>
          <el-button type="primary" size="default">导出</el-button>
        </div>
      </div>
    </template>

    <el-table v-loading="loading" :data="tableData" border>
      <el-table-column label="序号" type="index" width="60" />
      <el-table-column label="项目编码" prop="projectId" />
      <el-table-column label="项目名称" prop="projectName" />
      <el-table-column label="项目简称" prop="projectShortName" />
      <el-table-column label="项目来源" prop="collectWayName" />
      <el-table-column label="项目类型" prop="projectTypeName" />
      <el-table-column label="产权单位" prop="ownershipUnitName" />
      <el-table-column label="产权性质" prop="ownershipPropertyName" />
      <el-table-column label="经营模式" prop="businessModelName" />
      <el-table-column label="所属省市区">
        <template #default="scope">
          <div>
            {{ scope?.row?.provinceName + scope?.row?.cityName + scope?.row?.districtName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="详细地址" prop="address" />
      <el-table-column label="状态" prop="enable">
        <template #default="scope">
          <div>{{ scope?.row?.enable ? '启用' : '禁用' }}</div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="185">
        <template #default>
          <el-button link type="primary">停用</el-button>
          <el-button link type="primary">查看详情</el-button>
          <el-button link type="primary">编辑</el-button>
          <el-button link type="danger">删除</el-button>
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
