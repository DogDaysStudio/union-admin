<script setup lang="ts">
import {defineField, defineSchema} from '@/utils/form-schema'
import {onMounted, reactive, ref} from 'vue'
import {useRouter} from 'vue-router'
import {ElMessage, ElMessageBox} from 'element-plus'
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
// 修改数据状态
const toggleStatusProject = useRequest(amsAsset.amsAssetProjectEnable, {
  throttleInterval: 500,
})
// 删除数据
const deleteProject = useRequest(amsAsset.amsAssetProjectDelete, {
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
}

const tableData = reactive<AssetProjectVO[]>([])
const getData = async (): Promise<void> => {
  loading.value = true
  const cloneformState = {...formState}
  cloneformState.cityCode = cloneformState?.provinceCode?.[1]
  cloneformState.districtCode = cloneformState?.provinceCode?.[2]
  cloneformState.provinceCode = cloneformState?.provinceCode?.[0]
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
const addProject = () => {
  router.push('/asset/management/add')
}

// 修改状态
const toggleStatus = (projectId: string, enable: number): void => {
  ElMessageBox.confirm(`是否确定${enable ? '停用' : '启用'}项目?`, '确认提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const {code} = await toggleStatusProject.runAsync({projectId, enable: enable ? 0 : 1})
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
const deleteData = (projectId: string): void => {
  ElMessageBox.confirm(`是否确定删除项目?`, '确认提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const {code} = await deleteProject.runAsync({projectId})
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
    <template #header>数据筛选</template>
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
        <template #default="{row}">
          <el-button
            v-if="row.enable"
            link
            type="danger"
            @click="toggleStatus(row.projectId, row.enable)"
          >
            停用
          </el-button>
          <el-button
            v-if="!row.enable"
            link
            type="primary"
            @click="toggleStatus(row.projectId, row.enable)"
          >
            启用
          </el-button>
          <el-button link type="primary">查看详情</el-button>
          <el-button link type="primary">编辑</el-button>
          <el-button link type="danger" @click="deleteData(row.projectId)">删除</el-button>
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
