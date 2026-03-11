<script setup lang="ts">
import {onMounted, reactive, ref, watch} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {defineField, defineSchema, UploadFile} from '@/components'
import {useRequest} from 'vue-request'
import {useExport} from '@/common/hooks/useExport'
import {getFileListId} from '@/components/upload/utils'
import {ElMessage, ElMessageBox} from 'element-plus'
import type {FormInstance, FormRules, UploadUserFile} from 'element-plus'
import {
  amsAssetFixedList,
  amsAssetFixedEnable,
  amsAssetFixedDelete,
  amsAssetFixedBatchEnable,
  amsAssetFixedBatchWarranty,
  amsAssetFixedBatchUpdate,
} from '@/service/api/amsAsset'

type AssetFixedListForm = AssetFixedListDTO & {
  // enable?: number
  deviceWorkState?: number | string
  locationName?: string
}

const formState = reactive({
  pageable: true,
  pageNum: 1,
  pageSize: 10,
} as AssetFixedListForm)

const formSchema = defineSchema({
  fields: [
    defineField.Input({label: '楼栋名称', prop: 'assetName', clearable: true}),
    defineField.Input({label: '楼层名称', prop: 'floorName', clearable: true}),
    defineField.Input({label: '所属项目', prop: 'projectName', clearable: true}),
    defineField.Input({label: '设备分类', prop: 'deviceType', clearable: true}),
    defineField.Input({label: '固定资产名称', prop: 'fixedName', clearable: true}),
    defineField.Select({
      label: '设备状态',
      prop: 'deviceWorkState',
      options: [
        {value: 1, label: '正常'},
        {value: 0, label: '故障'},
      ],
      clearable: true,
    }),
    defineField.Input({label: '设备位置', prop: 'locationName', clearable: true}),
  ],
})

const {runAsync: fetchFixedList} = useRequest(amsAssetFixedList)
const {runAsync: fixedEnable} = useRequest(amsAssetFixedEnable)
const {runAsync: fixedDelete} = useRequest(amsAssetFixedDelete)
const {runAsync: fixedBatchEnable} = useRequest(amsAssetFixedBatchEnable)
const {runAsync: fixedBatchWarranty, loading: warrantySubmitting} = useRequest(
  amsAssetFixedBatchWarranty
)
const {runAsync: fixedBatchUpdate, loading: batchEditSubmitting} =
  useRequest(amsAssetFixedBatchUpdate)
const {exportData, loading: exportLoading} = useExport({
  meta: '/ams/asset-fixed/list-export-meta',
  url: '/ams/asset-fixed/list-export',
})
const loading = ref(false)
const total = ref(0)
const tableData = reactive<AssetFixedVO[]>([])
const selectedRows = ref<AssetFixedVO[]>([])

const router = useRouter()
const route = useRoute()

// 监听路由参数变化，触发刷新
watch(
  () => route.query.refresh,
  () => {
    getData()
  }
)

const handleFinish = () => {
  formState.pageNum = 1
  getData()
}

const reset = () => {
  Object.assign(formState, {
    pageable: true,
    pageNum: 1,
    pageSize: 10,
  })
  getData()
}

const getData = async () => {
  loading.value = true
  try {
    const payload = {...formState}
    const {total: resTotal, data} = await fetchFixedList(payload)
    total.value = resTotal
    tableData.length = 0
    tableData.push(...data)
  } finally {
    loading.value = false
  }
}

const handleSizeChange = (size: number) => {
  formState.pageSize = size
  getData()
}

const handleCurrentChange = (page: number) => {
  formState.pageNum = page
  getData()
}

const handleSelectionChange = (rows: AssetFixedVO[]) => {
  selectedRows.value = rows
}

const goFixedDetail = (fixedId?: string) => {
  if (!fixedId) {
    ElMessage.warning('未获取到固定资产编码')
    return
  }
  router.push(`/asset/management/fixed/detail-fixed/${fixedId}`)
}

const goFixedEdit = (fixedId?: string) => {
  if (!fixedId) {
    ElMessage.warning('未获取到固定资产编码')
    return
  }
  router.push(`/asset/management/fixed/edit-fixed/${fixedId}`)
}

const ensureSelection = () => {
  if (!selectedRows.value.length) {
    ElMessage.warning('请选择至少一条固定资产记录')
    return false
  }
  return true
}

const handleExport = () => {
  exportData(formState)
}

const handleBatchEdit = () => {
  if (!ensureSelection()) return
  batchEditDialogVisible.value = true
}

// 修改状态
const toggleStatus = (fixedId: string, enable: number): void => {
  const targetEnable = enable ? 0 : 1
  ElMessageBox.confirm(`是否确定${targetEnable ? '启用' : '停用'}固定资产?`, '确认提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await fixedEnable({fixedId, enable: !!targetEnable})
    ElMessage.success('操作成功')
    getData()
  })
}

// 删除
const handleDelete = (fixedId: string): void => {
  ElMessageBox.confirm(`是否确定删除该固定资产?`, '确认提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await fixedDelete({fixedId})
    ElMessage.success('删除成功')
    getData()
  })
}

const handleBatchEnable = () => {
  if (!ensureSelection()) return
  ElMessageBox.confirm('确认批量启用选中的固定资产吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await fixedBatchEnable({
      fixedIdList: selectedRows.value.map(item => item.fixedId),
      enable: true,
    })
    ElMessage.success('批量启用成功')
    getData()
  })
}

const handleBatchDisable = () => {
  if (!ensureSelection()) return
  ElMessageBox.confirm('确认批量停用选中的固定资产吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await fixedBatchEnable({
      fixedIdList: selectedRows.value.map(item => item.fixedId),
      enable: false,
    })
    ElMessage.success('批量停用成功')
    getData()
  })
}

const warrantyDialogVisible = ref(false)
const warrantyFormRef = ref<FormInstance>()
const warrantyForm = reactive({
  warrantyCompany: '',
  warrantyLinkman: '',
  warrantyPhone: '',
  warrantyExpireDate: '',
  contractFiles: [] as UploadUserFile[],
})

const batchEditDialogVisible = ref(false)
const batchEditFormRef = ref<FormInstance>()
const batchEditForm = reactive({
  label: '',
  drawingFiles: [] as UploadUserFile[],
  deviceContractFiles: [] as UploadUserFile[],
  deviceInformationFiles: [] as UploadUserFile[],
})

const warrantyFormRules: FormRules = {
  warrantyCompany: [{required: true, message: '请选择设备质保方名称', trigger: 'blur'}],
  warrantyLinkman: [{required: true, message: '请选择设备质保方联系人', trigger: 'blur'}],
  warrantyPhone: [{required: true, message: '请选择设备质保方联系方式', trigger: 'blur'}],
  warrantyExpireDate: [{required: true, message: '请选择设备质保到期日', trigger: 'change'}],
}

const batchEditFormRules: FormRules = {
  label: [{required: true, message: '请输入标签', trigger: 'blur'}],
}

const resetWarrantyForm = () => {
  warrantyForm.warrantyCompany = ''
  warrantyForm.warrantyLinkman = ''
  warrantyForm.warrantyPhone = ''
  warrantyForm.warrantyExpireDate = ''
  warrantyForm.contractFiles = []
}

const resetBatchEditForm = () => {
  batchEditForm.label = ''
  batchEditForm.drawingFiles = []
  batchEditForm.deviceContractFiles = []
  batchEditForm.deviceInformationFiles = []
}

const openWarrantyDialog = () => {
  if (!ensureSelection()) return
  warrantyDialogVisible.value = true
}

const handleWarrantyConfirm = async () => {
  if (!ensureSelection()) return
  await warrantyFormRef.value?.validate()
  const contractFid = getFileListId(warrantyForm.contractFiles)?.[0] || ''
  await fixedBatchWarranty({
    fixedIdList: selectedRows.value.map(item => item.fixedId),
    warrantyCompany: warrantyForm.warrantyCompany,
    warrantyLinkman: warrantyForm.warrantyLinkman,
    warrantyPhone: warrantyForm.warrantyPhone,
    warrantyExpireDate: warrantyForm.warrantyExpireDate,
    contractFid,
  })
  ElMessage.success('维护质保信息已提交')
  warrantyDialogVisible.value = false
  resetWarrantyForm()
  getData()
}

const handleWarrantyDialogClosed = () => {
  warrantyFormRef.value?.clearValidate()
  resetWarrantyForm()
}

const handleBatchEditConfirm = async () => {
  if (!ensureSelection()) return
  await batchEditFormRef.value?.validate()
  await fixedBatchUpdate({
    fixedIdList: selectedRows.value.map(item => item.fixedId),
    label: batchEditForm.label,
    drawingFid: getFileListId(batchEditForm.drawingFiles)?.[0] || '',
    deviceContractFid: getFileListId(batchEditForm.deviceContractFiles)?.[0] || '',
    deviceInformationFid: getFileListId(batchEditForm.deviceInformationFiles)?.[0] || '',
  })
  ElMessage.success('批量编辑成功')
  batchEditDialogVisible.value = false
  resetBatchEditForm()
  getData()
}

const handleBatchEditDialogClosed = () => {
  batchEditFormRef.value?.clearValidate()
  resetBatchEditForm()
}

onMounted(() => getData())
</script>

<template>
  <el-card>
    <template #header>筛选查询</template>
    <schema-form :schema="formSchema" :model="formState" @finish="handleFinish" @reset="reset" />
  </el-card>

  <el-card class="mt-base">
    <template #header>
      <div class="flex items-center justify-between w-full">
        <span class="text-base font-medium">数据列表</span>
        <div class="flex">
          <el-button type="primary" @click="router.push('/asset/management/fixed/add')">
            + 添加
          </el-button>
          <el-button @click="router.push('/asset/management/fixed/import')">导入</el-button>
          <el-button @click="handleExport" :loading="exportLoading">导出</el-button>
          <el-button @click="handleBatchEdit">批量编辑</el-button>
          <el-button @click="openWarrantyDialog">维护质保信息</el-button>
          <el-button @click="handleBatchEnable">批量启用</el-button>
          <el-button @click="handleBatchDisable">批量停用</el-button>
        </div>
      </div>
    </template>

    <el-table
      v-loading="loading"
      :data="tableData"
      border
      :row-key="row => row.fixedId"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" fixed="left" />
      <el-table-column type="index" label="序号" width="60" fixed="left" />
      <el-table-column label="固定资产编码" prop="fixedId" min-width="150" />
      <el-table-column label="固定资产名称" prop="fixedName" min-width="150" />
      <el-table-column label="资产分类" prop="fixedTypeName" min-width="120" />
      <el-table-column label="设备类型" prop="fixedTypeName" min-width="120" />
      <el-table-column label="所属项目" prop="projectName" min-width="140" />
      <el-table-column label="楼栋名称" prop="assetName" min-width="140" />
      <el-table-column label="楼层名称" prop="floorName" min-width="140" />
      <el-table-column label="房间" prop="locationId" min-width="120" />
      <el-table-column label="位置" prop="locationName" min-width="160" />
      <el-table-column label="启停状态" prop="enable" width="100">
        <template #default="{row}">
          <el-tag :type="row.enable ? 'success' : 'danger'">
            {{ row.enable ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="设备质保方" prop="warrantyCompany" min-width="140" />
      <el-table-column label="设备安装日期" prop="deviceInstallDate" min-width="140" />
      <el-table-column label="设备质保到期日" prop="warrantyExpireDate" min-width="150" />
      <el-table-column label="设备管理方" prop="deviceManageUser" min-width="140" />
      <el-table-column label="设备状态" prop="deviceWorkState" min-width="120">
        <template #default="{row}">
          <el-tag :type="row.deviceWorkState === 1 ? 'success' : 'danger'">
            {{ row.deviceWorkState === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" min-width="230">
        <template #default="{row}">
          <el-button link type="primary" @click="goFixedDetail(row.fixedId)">查看详情</el-button>
          <el-button link type="primary" @click="goFixedEdit(row.fixedId)">编辑</el-button>
          <el-button
            link
            :type="row.enable ? 'danger' : 'primary'"
            @click="toggleStatus(row.fixedId, row.enable)"
          >
            {{ row.enable ? '停用' : '启用' }}
          </el-button>
          <el-button link type="danger" @click="handleDelete(row.fixedId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="mt-base float-right"
      :total="total"
      :page-size="formState.pageSize"
      :current-page="formState.pageNum"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>

  <el-dialog
    v-model="batchEditDialogVisible"
    title="批量编辑"
    width="520px"
    @closed="handleBatchEditDialogClosed"
  >
    <el-form
      ref="batchEditFormRef"
      :model="batchEditForm"
      :rules="batchEditFormRules"
      label-width="120px"
    >
      <el-form-item label="标签" prop="label">
        <el-input v-model="batchEditForm.label" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="图纸">
        <upload-file v-model:file-list="batchEditForm.drawingFiles" list-type="text">
          <template #trigger>
            <el-button type="primary" plain>上传文件</el-button>
          </template>
        </upload-file>
        <div class="text-xs text-gray-500 ml-2">
          支持 .rar .zip .doc .docx .pdf .jpg 等，单个文件不超过20MB
        </div>
      </el-form-item>
      <el-form-item label="设备合同">
        <upload-file v-model:file-list="batchEditForm.deviceContractFiles" list-type="text">
          <template #trigger>
            <el-button type="primary" plain>上传文件</el-button>
          </template>
        </upload-file>
        <div class="text-xs text-gray-500 ml-2">
          支持 .rar .zip .doc .docx .pdf .jpg 等，单个文件不超过20MB
        </div>
      </el-form-item>
      <el-form-item label="设备技术资料">
        <upload-file v-model:file-list="batchEditForm.deviceInformationFiles" list-type="text">
          <template #trigger>
            <el-button type="primary" plain>上传文件</el-button>
          </template>
        </upload-file>
        <div class="text-xs text-gray-500 ml-2">
          支持 .rar .zip .doc .docx .pdf .jpg 等，单个文件不超过20MB
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="batchEditDialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="batchEditSubmitting" @click="handleBatchEditConfirm">
        确定
      </el-button>
    </template>
  </el-dialog>

  <el-dialog
    v-model="warrantyDialogVisible"
    title="批量维护质保信息"
    width="520px"
    @closed="handleWarrantyDialogClosed"
  >
    <el-form
      ref="warrantyFormRef"
      :model="warrantyForm"
      :rules="warrantyFormRules"
      label-width="150px"
    >
      <el-form-item label="设备质保方名称" prop="warrantyCompany">
        <el-input v-model="warrantyForm.warrantyCompany" placeholder="请选择" />
      </el-form-item>
      <el-form-item label="设备质保方联系人" prop="warrantyLinkman">
        <el-input v-model="warrantyForm.warrantyLinkman" placeholder="请选择" />
      </el-form-item>
      <el-form-item label="设备质保方联系方式" prop="warrantyPhone">
        <el-input v-model="warrantyForm.warrantyPhone" placeholder="请选择" />
      </el-form-item>
      <el-form-item label="设备质保到期日" prop="warrantyExpireDate">
        <el-date-picker
          v-model="warrantyForm.warrantyExpireDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item label="合同">
        <upload-file v-model:file-list="warrantyForm.contractFiles">
          <template #trigger>
            <el-button type="primary" plain>上传文件</el-button>
          </template>
        </upload-file>
        <div class="text-xs text-gray-500 ml-2">
          支持 .rar .zip .doc .docx .pdf .jpg 等，单个文件不超过20MB
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="warrantyDialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="warrantySubmitting" @click="handleWarrantyConfirm">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>
