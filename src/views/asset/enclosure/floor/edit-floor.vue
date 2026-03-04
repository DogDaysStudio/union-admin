<script setup lang="ts">
import {ref, reactive, onMounted, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import type {FormInstance, FormRules} from 'element-plus'
import {ElMessage} from 'element-plus'
import {useDicListTree} from '@/common/hooks/useDicTree'
import {
  amsAssetProjectList,
  amsAssetEnclosureList,
  amsAssetFloorUpdate,
  amsAssetFloorGet,
} from '@/service/api/amsAsset'
import {useRequest} from 'vue-request'
import {findValueByCustomId} from '@/utils/array-util'

const route = useRoute()
const router = useRouter()

// 获取项目列表
const {runAsync: projectList} = useRequest(amsAssetProjectList)
const projectOptions = reactive<{projectId: string; projectName: string}[]>([])
// 围合下拉列表
const {runAsync: enclosureList} = useRequest(amsAssetEnclosureList)
const enclosureOptions = reactive<AssetEnclosureVO[]>([])
// 字典 [产权单位]
const companyOptions = useDicListTree({dicType: 1001})
// 编辑楼层
const {runAsync: updateFloor, loading: updateLoading} = useRequest(amsAssetFloorUpdate)
// 楼层详情
const {runAsync: getFloor} = useRequest(amsAssetFloorGet)

const formRef = ref<FormInstance>()

const formData = reactive({} as AssetFloorDTO)

const formRules = reactive<FormRules>({
  floorName: {required: true, message: '请填写楼层名称', trigger: 'blur'},
  floorHeight: {required: true, message: '请填写层高（m）', trigger: 'blur'},
  projectId: {required: true, message: '请选择所属项目', trigger: 'blur'},
  assetId: {required: true, message: '请选择所属围合', trigger: 'blur'},
  ownershipUnitCode: {required: true, message: '请选择产权单位', trigger: 'blur'},
})

onMounted(() => getOptions())

const getOptions = async (): Promise<void> => {
  const {data: project} = await projectList({pageable: false} as AssetProjectListDTO)
  projectOptions.push(...project)
  const {data: floorDetail} = await getFloor({floorId: route.params.floorId})
  Object.assign(formData, floorDetail)
}

// 监听projectId变化，获取围合
watch(
  () => formData.projectId,
  async (newVal, oldVal) => {
    if (oldVal !== undefined) {
      enclosureOptions.length = 0
      formData.assetId = ''
    }
    if (newVal) {
      const {data: enclosure} = await enclosureList({
        pageable: false,
        projectId: newVal,
      } as AssetEnclosureListDTO)
      enclosureOptions.push(...enclosure)
    }
  },
  {immediate: true}
)

const handleSubmit = () => {
  if (!formRef.value) return
  formRef.value.validate(async valid => {
    if (valid) {
      const paramsData = JSON.parse(JSON.stringify(formData))
      if (Array.isArray(paramsData?.ownershipUnitCode)) {
        const targetCode =
          paramsData.ownershipUnitCode[paramsData.ownershipUnitCode.length - 1] ?? ''
        paramsData.ownershipUnitName =
          findValueByCustomId(targetCode, 'dicCode', 'dicName', companyOptions) || ''
        paramsData.ownershipUnitCode =
          paramsData.ownershipUnitCode[paramsData.ownershipUnitCode.length - 1]
      }
      const {msg} = await updateFloor({...paramsData, assetType: '2'})
      ElMessage.success(msg)
      router.push('/asset/management/enclosure-floor')
    } else {
      ElMessage.error('请填写完整信息')
    }
  })
}
</script>

<template>
  <el-card>
    <template #header>
      <div class="flex justify-between">
        编辑楼层
        <p class="text-red-600">
          <span>*</span>
          为必填项
        </p>
      </div>
    </template>
    <div class="mx-auto">
      <el-form
        :model="formData"
        :rules="formRules"
        ref="formRef"
        label-width="80px"
        label-position="top"
        :validate-on-rule-change="false"
        :validate-on-init="false"
      >
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="楼层名称" prop="floorName" required>
              <el-input v-model="formData.floorName" placeholder="请填写楼层名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="楼层编码" prop="floorId" required>
              <el-input v-model="formData.floorId" placeholder="请填写楼层编码" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="层高（m）" prop="floorHeight" required>
              <el-input-number v-model="formData.floorHeight" placeholder="请填写层高" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属项目" prop="projectId" required>
              <el-select v-model="formData.projectId" placeholder="请选择所属项目">
                <el-option
                  v-for="item in projectOptions"
                  :key="item.projectId"
                  :label="item.projectName"
                  :value="item.projectId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目编码" prop="projectId" required>
              <el-input v-model="formData.projectId" placeholder="请填写层高" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属围合" prop="assetId" required>
              <el-select
                v-model="formData.assetId"
                placeholder="请选择所属围合"
                :disabled="!formData.projectId"
              >
                <el-option
                  v-for="item in enclosureOptions"
                  :key="item.enclosureId"
                  :label="item.enclosureName"
                  :value="item.enclosureId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="围合编码" prop="assetId" required>
              <el-input v-model="formData.assetId" placeholder="请填写围合编码" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产权单位" prop="ownershipUnitCode" required>
              <el-cascader
                v-model="formData.ownershipUnitCode"
                placeholder="请选择产权单位"
                :options="companyOptions"
                :props="{
                  checkStrictly: true,
                  value: 'dicCode',
                  label: 'dicName',
                }"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <div class="flex justify-center mt-6">
          <el-button @click="router.push('/asset/management/enclosure-floor')">返回</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="updateLoading">确定</el-button>
        </div>
      </el-form>
    </div>
  </el-card>
</template>
