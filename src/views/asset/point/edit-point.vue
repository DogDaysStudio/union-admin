<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import type {FormInstance, FormRules} from 'element-plus'
import {ElMessage} from 'element-plus'
import {
  amsAssetProjectList,
  amsAssetResourceUpdate,
  amsAssetResourceGet,
} from '@/service/api/amsAsset'
import {iamCommonDicListTree} from '@/service/api/iamCommon'
import {useRequest} from 'vue-request'
import {findValueByCustomId} from '@/utils/array-util'

const router = useRouter()
const route = useRoute()

// 获取项目列表
const projectList = useRequest(amsAssetProjectList, {
  throttleInterval: 500,
})
const projectOptions = reactive<{projectId: string; projectName: string}[]>([])
// 字典 [业务类型1009 点位类型1011 广告类型1010 媒体类型1012 资源业务标签1028]
const dicListTree = useRequest(iamCommonDicListTree, {
  throttleInterval: 500,
})
const resourceBusinessTypeOptions = reactive<SysDicVO[]>([])
const resourceTypeOptions = reactive<SysDicVO[]>([])
const resourceAdTypeOptions = reactive<SysDicVO[]>([])
const resourceMediaTypeOptions = reactive<SysDicVO[]>([])
const resourceBusinessTagOptions = reactive<SysDicVO[]>([])
// 编辑点位
const resourceUpdate = useRequest(amsAssetResourceUpdate, {
  throttleInterval: 500,
})
// 点位详情
const resourceGet = useRequest(amsAssetResourceGet, {
  throttleInterval: 500,
})

const formRef = ref<FormInstance>()

const formData = reactive({} as AssetResourceVO)

// 表单验证规则：对应prop字段，实现必填/格式校验
const formRules = reactive<FormRules>({
  projectName: {required: true, message: '请填写所属项目', trigger: 'blur'},
  locationName: {required: true, message: '请填写位置', trigger: 'blur'},
  resourceBusinessTypeCode: {required: true, message: '请选择业务类型', trigger: 'blur'},
  resourceTypeCode: {required: true, message: '请选择点位类型', trigger: 'blur'},
  resourceAdTypeCode: {required: true, message: '请选择广告类型', trigger: 'blur'},
  resourceMediaTypeCode: {required: true, message: '请选择媒体类型', trigger: 'blur'},
  resourceBusinessTagCode: {required: true, message: '请选择业务标签', trigger: 'blur'},
  resourceName: {required: true, message: '请填写空间点位资源名称', trigger: 'blur'},
  resourceNumber: {required: true, message: '请填写空间点位资源编号', trigger: 'blur'},
  resourceId: {required: true, message: '请填写点位资源编码', trigger: 'blur'},
  resourceSpecs: {required: true, message: '请填写规格', trigger: 'blur'},
  resourceArea: {
    required: true,
    message: '请填写面积（㎡）',
    trigger: 'blur',
  },
  resourceState: {required: true, message: '请选择点位资源状态', trigger: 'blur'},
  enable: {required: true, message: '请选择启停状态', trigger: 'blur'},
})

onMounted(() => {
  getDetail()
  getOptions()
})

// 获取下拉接口
const getOptions = async (): Promise<void> => {
  const {data: project} = await projectList.runAsync({pageable: false} as AssetProjectListDTO)
  projectOptions.push(...Object.values(project))
  const {data: resourceBusinessType} = await dicListTree.runAsync({dicType: 1009})
  resourceBusinessTypeOptions.push(...Object.values(resourceBusinessType))
  const {data: resourceType} = await dicListTree.runAsync({dicType: 1011})
  resourceTypeOptions.push(...Object.values(resourceType))
  const {data: resourceAdType} = await dicListTree.runAsync({dicType: 1010})
  resourceAdTypeOptions.push(...Object.values(resourceAdType))
  const {data: resourceMediaType} = await dicListTree.runAsync({dicType: 1012})
  resourceMediaTypeOptions.push(...Object.values(resourceMediaType))
  const {data: resourceBusinessTagCode} = await dicListTree.runAsync({dicType: 1028})
  resourceBusinessTagOptions.push(...Object.values(resourceBusinessTagCode))
}

const getDetail = async (): Promise<void> => {
  const {data: resource} = await resourceGet.runAsync({
    resourceId: route.params.id,
  } as AssetResourceVO)
  Object.assign(formData, resource)
}

// 提交表单：先验证，通过后处理数据
const handleSubmit = () => {
  if (!formRef.value) return
  formRef.value.validate(async valid => {
    if (valid) {
      const paramsData = JSON.parse(JSON.stringify(formData)) as AssetResourceUpsertDTO
      paramsData.resourceBusinessType = findValueByCustomId(
        paramsData.resourceBusinessTypeCode,
        'dicCode',
        'dicName',
        resourceBusinessTypeOptions
      )
      paramsData.resourceType = findValueByCustomId(
        paramsData.resourceTypeCode,
        'dicCode',
        'dicName',
        resourceTypeOptions
      )
      paramsData.resourceAdType = findValueByCustomId(
        paramsData.resourceAdTypeCode,
        'dicCode',
        'dicName',
        resourceAdTypeOptions
      )
      paramsData.resourceMediaType = findValueByCustomId(
        paramsData.resourceMediaTypeCode,
        'dicCode',
        'dicName',
        resourceMediaTypeOptions
      )
      paramsData.resourceBusinessTag = findValueByCustomId(
        paramsData.resourceBusinessTagCode,
        'dicCode',
        'dicName',
        resourceBusinessTagOptions
      )
      const {msg} = await resourceUpdate.runAsync({...paramsData})
      ElMessage.success(msg)
      router.push('/asset/management/point')
    }
  })
}

const handleReset = () => router.push('/asset/management/point')
</script>

<template>
  <el-card>
    <template #header>
      <div class="flex justify-between">
        编辑
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
        <section-group title="基本信息" inline>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="所属项目" prop="projectName" required>
                <el-input v-model="formData.projectName" placeholder="请填写所属项目" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所属围合/楼栋" prop="buildingEnclosureName">
                <el-input
                  v-model="formData.buildingEnclosureName"
                  placeholder="请填写所属围合/楼栋"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所属楼层" prop="floorName">
                <el-input v-model="formData.floorName" placeholder="请填写所属楼层" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="位置" prop="locationName" required>
                <el-input v-model="formData.locationName" placeholder="请填写位置" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="经营模式">
                <el-input
                  v-model="formData.businessModelName"
                  placeholder="请填写经营模式"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="房间号/商铺号">
                <el-input
                  v-model="formData.locationId"
                  placeholder="请选择房间号/商铺号"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="业务类型" prop="resourceBusinessTypeCode" required>
                <el-select v-model="formData.resourceBusinessTypeCode" placeholder="请选择业务类型">
                  <el-option
                    v-for="item in resourceBusinessTypeOptions"
                    :key="item.dicCode"
                    :label="item.dicName"
                    :value="item.dicCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="点位类型" prop="resourceTypeCode" required>
                <el-select v-model="formData.resourceTypeCode" placeholder="请选择点位类型">
                  <el-option
                    v-for="item in resourceTypeOptions"
                    :key="item.dicCode"
                    :label="item.dicName"
                    :value="item.dicCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="广告类型" prop="resourceAdTypeCode" required>
                <el-select v-model="formData.resourceAdTypeCode" placeholder="请选择广告类型">
                  <el-option
                    v-for="item in resourceAdTypeOptions"
                    :key="item.dicCode"
                    :label="item.dicName"
                    :value="item.dicCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="媒体类型" prop="resourceMediaTypeCode" required>
                <el-select v-model="formData.resourceMediaTypeCode" placeholder="请选择媒体类型">
                  <el-option
                    v-for="item in resourceMediaTypeOptions"
                    :key="item.dicCode"
                    :label="item.dicName"
                    :value="item.dicCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="业务标签" prop="resourceBusinessTagCode" required>
                <el-select v-model="formData.resourceBusinessTagCode" placeholder="请选择业务标签">
                  <el-option
                    v-for="item in resourceBusinessTagOptions"
                    :key="item.dicCode"
                    :label="item.dicName"
                    :value="item.dicCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </section-group>

        <section-group title="点位信息" inline>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="空间点位资源名称" prop="resourceName" required>
                <el-input v-model="formData.resourceName" placeholder="请选填写空间点位资源名称" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="空间点位资源编号" prop="resourceNumber" required>
                <el-input
                  v-model="formData.resourceNumber"
                  placeholder="请选填写空间点位资源编号"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="空间点位资源编码" prop="resourceId" required>
                <el-input
                  v-model="formData.resourceId"
                  placeholder="请选填写点位资源编码"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="规格" prop="resourceSpecs" required>
                <el-input v-model="formData.resourceSpecs" placeholder="请选填写规格" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="面积（㎡）" prop="resourceArea" required>
                <el-input-number v-model="formData.resourceArea" placeholder="请选填写面积（㎡）" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="点位资源状态" prop="resourceState" required>
                <el-select
                  v-model="formData.resourceState"
                  :options="[
                    {value: 0, label: '待租'},
                    {value: 1, label: '已租'},
                  ]"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="启停状态" prop="enable" required>
                <el-select
                  v-model="formData.enable"
                  :options="[
                    {value: 0, label: '禁用'},
                    {value: 1, label: '启用'},
                  ]"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </section-group>

        <div class="flex justify-center mt-6">
          <el-button @click="handleReset">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </el-form>
    </div>
  </el-card>
</template>
