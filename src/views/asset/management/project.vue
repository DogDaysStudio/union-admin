<script setup lang="ts">
import {defineField, defineSchema} from '@/components'
import {onMounted, reactive, ref} from 'vue'
import {useRouter} from 'vue-router'
import {ElMessage, ElMessageBox} from 'element-plus'
import {useRequest} from 'vue-request'
import {
  amsAssetProjectDelete,
  amsAssetProjectEnable,
  amsAssetProjectList,
} from '@/service/api/amsAsset'
import {iamCommonAreaList, iamCommonDicListTree} from '@/service/api/iamCommon'

// 所属省市区
const areaList = useRequest(iamCommonAreaList, {
  throttleInterval: 500,
})
const cityOptions = reactive<PairModel[]>([])
// 字典 [筹集方式 产权单位 产权性质 经营模式]
const dicListTree = useRequest(iamCommonDicListTree, {
  throttleInterval: 500,
})
const collectWayOptions = reactive<SysDicVO[]>([])
const companyOptions = reactive<SysDicVO[]>([])
const ownershipPropertyOptions = reactive<SysDicVO[]>([])
const businessModelOptions = reactive<SysDicVO[]>([])
// 列表数据
const projectList = useRequest(amsAssetProjectList, {
  throttleInterval: 500,
})
// 修改数据状态
const toggleStatusProject = useRequest(amsAssetProjectEnable, {
  throttleInterval: 500,
})
// 删除数据
const projectDelete = useRequest(amsAssetProjectDelete, {
  throttleInterval: 500,
})

const formState = reactive({
  pageNum: 1,
  pageSize: 10,
} as AssetProjectListDTO)

const formSchema = defineSchema({
  fields: [
    defineField.Input({label: '项目名称', prop: 'projectName', clearable: true}),
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
    defineField.Select({
      label: '筹集方式',
      prop: 'collectWayCode',
      options: collectWayOptions,
      props: {
        value: 'dicCode',
        label: 'dicName',
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
      label: '产权性质',
      prop: 'ownershipPropertyCode',
      options: ownershipPropertyOptions,
      clearable: true,
      props: {
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
  const {data: collectWay} = await dicListTree.runAsync({dicType: 1021})
  collectWayOptions.push(...Object.values(collectWay))
  const {data: companyList} = await dicListTree.runAsync({dicType: 1001})
  companyOptions.push(...Object.values(companyList))
  const {data: ownershipProperty} = await dicListTree.runAsync({dicType: 1022})
  ownershipPropertyOptions.push(...Object.values(ownershipProperty))
  const {data: businessModel} = await dicListTree.runAsync({dicType: 1020})
  businessModelOptions.push(...Object.values(businessModel))
}

const tableData = reactive<AssetProjectVO[]>([])
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
  const {total: resTotal, data} = await projectList.runAsync({...cloneformState})
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
const addProject = () => router.push('/asset/management/add')
const editProject = (projectId: string) => router.push(`/asset/management/edit/${projectId}`)
const detailProject = (projectId: string) => router.push(`/asset/management/detail/${projectId}`)

const deleteProject = (projectId: string): void => {
  ElMessageBox.confirm(`是否确定删除项目?`, '确认提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await projectDelete.runAsync({projectId})
    getData()
    ElMessage.success('删除成功')
  })
}

const toggleStatus = (projectId: string, enable: number): void => {
  ElMessageBox.confirm(`是否确定${enable ? '停用' : '启用'}项目?`, '确认提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await toggleStatusProject.runAsync({projectId, enable: !enable})
    getData()
    ElMessage.success('修改成功')
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
          <el-button type="primary" size="default" @click="addProject">新增项目</el-button>
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
      <el-table-column label="筹集方式" prop="collectWayName" />
      <el-table-column label="项目类型" prop="projectTypeName" />
      <el-table-column label="产权单位" prop="ownershipUnitName" />
      <el-table-column label="产权性质" prop="ownershipPropertyName" />
      <el-table-column label="经营模式" prop="businessModelName" />
      <el-table-column label="所属省市区" prop="areaName" />
      <el-table-column label="详细地址" prop="address" />
      <el-table-column label="状态" prop="enable">
        <template #default="scope">
          <div>{{ scope?.row?.enable ? '启用' : '禁用' }}</div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="185">
        <template #default="{row}">
          <el-button
            link
            :type="row.enable ? 'danger' : 'primary'"
            @click="toggleStatus(row.projectId, row.enable)"
          >
            {{ row.enable ? '停用' : '启用' }}
          </el-button>
          <el-button link type="primary" @click="detailProject(row.projectId)">查看详情</el-button>
          <el-button link type="primary" @click="editProject(row.projectId)">编辑</el-button>
          <el-button link type="danger" @click="deleteProject(row.projectId)">删除</el-button>
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
