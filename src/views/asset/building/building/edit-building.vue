<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue'
import type {FormInstance, FormRules} from 'element-plus'
import {ElMessage} from 'element-plus'
import {useRouter, useRoute} from 'vue-router'
import {amsAsset} from '@/service/api/amsAsset'
import {iamCommon} from '@/service/api/iamCommon'
import {useRequest} from 'vue-request'
import {findValueByCustomId} from '@/utils/array-util'

const router = useRouter()
const route = useRoute()

// 获取项目名称
const projectSelectAll = useRequest(amsAsset.amsAssetProjectSelectAll, {
  throttleInterval: 500,
})
const projectOptions = reactive<{projectId: string; projectName: string}[]>([])
// 字典 产权单位（公司）
const companyListTree = useRequest(iamCommon.iamCommonDicListTree, {
  throttleInterval: 500,
})
const companyOptions = reactive<SysDicVO[]>([])
// 楼栋详情
const buildingGet = useRequest(amsAsset.amsAssetBuildingGet, {
  throttleInterval: 500,
})
// 新增项目
const buildingUpdate = useRequest(amsAsset.amsAssetBuildingUpdate, {
  throttleInterval: 500,
})

// 表单Ref：用于调用表单内置方法（验证、重置）
const formRef = ref<FormInstance>()

// 初始化表单数据：响应式对象，与表单双向绑定
const formData = reactive({} as AssetBuildingVO)

// 表单验证规则：对应prop字段，实现必填/格式校验
const formRules = reactive<FormRules>({
  buildingName: {required: true, message: '请填写楼栋名称', trigger: 'blur'},
  ownershipUnitCode: {required: true, message: '请选择产权单位', trigger: 'change'},
})

onMounted(() => {
  getOptions()
  getDetail()
})

// 获取下拉接口
const getOptions = async (): Promise<void> => {
  const {data: project} = await projectSelectAll.runAsync()
  projectOptions.push(...Object.values(project))
  const {data: companyList} = await companyListTree.runAsync({
    dicType: 1001,
    pageable: false,
  } as SysDicListDTO)
  companyOptions.push(...Object.values(companyList))
}

// 获取详情
const getDetail = async (): Promise<void> => {
  const {data} = await buildingGet.runAsync({buildingId: route.params.id})
  Object.assign(formData, data)
}

// 提交表单：先验证，通过后处理数据
const handleSubmit = () => {
  if (!formRef.value) return
  formRef.value.validate(async valid => {
    if (valid) {
      const paramsData = JSON.parse(JSON.stringify(formData))
      if (Array.isArray(paramsData?.ownershipUnitCode)) {
        const targetCode =
          paramsData.ownershipUnitCode[paramsData.ownershipUnitCode.length - 1] ?? ''
        paramsData.ownershipUnitName =
          findValueByCustomId(targetCode, 'dicId', 'dicName', companyOptions) || ''
        paramsData.ownershipUnitCode =
          paramsData.ownershipUnitCode[paramsData.ownershipUnitCode.length - 1]
      }
      const {msg} = await buildingUpdate.runAsync({...paramsData})
      ElMessage.success(msg)
      router.push('/asset/management/building-floor')
    } else {
      ElMessage.error('请填写完整信息')
    }
  })
}

// 重置表单：重置数据+清除验证状态
const handleReset = () => router.push('/asset/management/building-floor')
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
    <!-- 外层容器：水平居中 -->
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
                  value: 'dicId',
                  label: 'dicName',
                }"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <div class="flex justify-center mt-6">
          <el-button @click="handleReset">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </el-form>
    </div>
  </el-card>
</template>
