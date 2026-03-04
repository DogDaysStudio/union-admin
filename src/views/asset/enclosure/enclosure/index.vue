<script setup lang="ts">
import {defineField, defineSchema} from '@/components'
import {onMounted, reactive, ref} from 'vue'
import {useRouter} from 'vue-router'
import {ElMessage, ElMessageBox} from 'element-plus'
import {
  amsAssetEnclosureList,
  amsAssetEnclosureEnable,
  amsAssetEnclosureDelete,
} from '@/service/api/amsAsset'
import {useDicListTree} from '@/common/hooks/useDicTree'
import {useRequest} from 'vue-request'

// 字典 产权单位/公司 围合类型
const companyOptions = useDicListTree({dicType: 1001})
const enclosureOptions = useDicListTree({dicType: 1023})
// 列表数据
const {runAsync: enclosureList} = useRequest(amsAssetEnclosureList)
// 修改数据状态
const {runAsync: enclosureEnable} = useRequest(amsAssetEnclosureEnable)
// 删除数据
const {runAsync: enclosureDelete} = useRequest(amsAssetEnclosureDelete)

const formState = reactive({
  pageNum: 1,
  pageSize: 10,
} as AssetEnclosureListDTO)

const formSchema = defineSchema({
  fields: [
    defineField.Input({label: '围合名称', prop: 'enclosureName', clearable: true}),
    defineField.Input({label: '围合编码', prop: 'enclosureId', clearable: true}),
    defineField.Input({label: '所属项目', prop: 'projectName', clearable: true}),
    defineField.Select({
      label: '围合类型',
      prop: 'enclosureTypeCode',
      options: enclosureOptions,
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

onMounted(() => getData())

const tableData = reactive<AssetEnclosureVO[]>([])
const getData = async (): Promise<void> => {
  loading.value = true
  const cloneformState = {...formState}
  if (cloneformState.ownershipUnitCode?.length) {
    cloneformState.ownershipUnitCode =
      cloneformState.ownershipUnitCode[cloneformState.ownershipUnitCode.length - 1]
  }
  const {total: resTotal, data} = await enclosureList({...cloneformState})
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
const addEnclosure = () => router.push('/asset/management/add-enclosure')
const editEnclosure = (enclosureId: string) =>
  router.push(`/asset/management/edit-enclosure/${enclosureId}`)
const detailEnclosure = (enclosureId: string) =>
  router.push(`/asset/management/detail-enclosure/${enclosureId}`)

// 修改状态
const toggleStatus = async (enclosureId: string, enable: number) => {
  await ElMessageBox.confirm(`是否确定${enable ? '停用' : '启用'}围合?`, '确认提示')
  await enclosureEnable({enclosureId, enable: enable ? false : true})
  ElMessage.success('修改成功')
  getData()
}

// 删除
const deleteEnclosure = async (enclosureId: string) => {
  await ElMessageBox.confirm(`是否确定删除围合?`, '确认提示')
  await enclosureDelete({enclosureId})
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
          <el-button type="primary" size="default" @click="addEnclosure">新增围合</el-button>
          <el-button type="primary" size="default">导入</el-button>
          <el-button type="primary" size="default">导出</el-button>
        </div>
      </div>
    </template>
    <el-table v-loading="loading" :data="tableData" border>
      <el-table-column label="序号" type="index" width="60" />
      <el-table-column label="围合编码" prop="enclosureId" />
      <el-table-column label="围合名称" prop="enclosureName" />
      <el-table-column label="围合类型" prop="enclosureTypeName" />
      <el-table-column label="所属项目" prop="projectName" />
      <el-table-column label="产权单位" prop="ownershipUnitName" />
      <el-table-column label="状态" prop="enable">
        <template #default="scope">
          <div>{{ scope?.row?.enable ? '启用' : '禁用' }}</div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="105">
        <template #default="{row}">
          <el-button
            link
            :type="row.enable ? 'danger' : 'primary'"
            @click="toggleStatus(row.enclosureId, row.enable)"
          >
            {{ row.enable ? '停用' : '启用' }}
          </el-button>
          <el-button link type="primary" @click="detailEnclosure(row.enclosureId)">
            查看详情
          </el-button>
          <el-button link type="primary" @click="editEnclosure(row.enclosureId)">编辑</el-button>
          <el-button link type="danger" @click="deleteEnclosure(row.enclosureId)">删除</el-button>
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
