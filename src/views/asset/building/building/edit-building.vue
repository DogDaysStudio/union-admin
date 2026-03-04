<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue'
import type {FormInstance, FormRules} from 'element-plus'
import {ElMessage} from 'element-plus'
import {useRouter, useRoute} from 'vue-router'
import {useRequest} from 'vue-request'
import {findValueByCustomId} from '@/utils/array-util'
import {useDicListTree} from '@/common/hooks/useDicTree'
import {
  amsAssetBuildingGet,
  amsAssetBuildingUpdate,
  amsAssetProjectList,
} from '@/service/api/amsAsset'

const router = useRouter()
const route = useRoute()

// 获取项目列表
const {runAsync: projectList} = useRequest(amsAssetProjectList)
const projectOptions = reactive<{projectId: string; projectName: string}[]>([])
// 字典 [ 产权单位 ]
const companyOptions = useDicListTree({dicType: 1001})
// 楼栋详情
const {runAsync: buildingGet} = useRequest(amsAssetBuildingGet)
// 编辑项目
const {runAsync: buildingUpdate, loading: updateLoading} = useRequest(amsAssetBuildingUpdate)

const formRef = ref<FormInstance>()

const formData = reactive({} as AssetBuildingVO)

const formRules = reactive<FormRules>({
  buildingName: {required: true, message: '请填写楼栋名称', trigger: 'blur'},
  ownershipUnitCode: {required: true, message: '请选择产权单位', trigger: 'change'},
})

onMounted(() => {
  getOptions()
  getDetail()
})

const getOptions = async (): Promise<void> => {
  const {data: project} = await projectList({pageable: false} as AssetProjectListDTO)
  projectOptions.push(...project)
}

const getDetail = async (): Promise<void> => {
  const {data} = await buildingGet({buildingId: route.params.buildingId})
  Object.assign(formData, data)
}

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
      paramsData.projectName =
        findValueByCustomId(paramsData.projectId, 'projectId', 'projectName', projectOptions) || ''
      const {msg} = await buildingUpdate({...paramsData})
      ElMessage.success(msg)
      router.push('/asset/management/building-floor')
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
        编辑楼栋
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
            <el-form-item label="楼栋名称" prop="buildingName" required>
              <el-input v-model="formData.buildingName" placeholder="请填写楼栋名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="楼栋编码" required>
              <el-input v-model="formData.buildingId" placeholder="请填写楼栋编码" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目名称" required>
              <el-select v-model="formData.projectId" placeholder="请填写项目名称" disabled>
                <el-option
                  v-for="item in projectOptions"
                  :key="item.projectId"
                  :label="item.projectName"
                  :value="item.projectId"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="项目编码" required>
              <el-input v-model="formData.projectId" placeholder="请填写项目编码" disabled />
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
              />
            </el-form-item>
          </el-col>
        </el-row>

        <div class="flex justify-center mt-6">
          <el-button @click="router.push('/asset/management/building-floor')">返回</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="updateLoading">确定</el-button>
        </div>
      </el-form>
    </div>
  </el-card>
</template>
