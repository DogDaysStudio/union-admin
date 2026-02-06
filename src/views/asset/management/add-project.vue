<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue'
import type {CascaderProps, FormInstance, FormRules} from 'element-plus'
import {ElMessage} from 'element-plus'
import {Search} from '@element-plus/icons-vue'
import {useRequest} from 'vue-request'
import {useRouter} from 'vue-router'
import {amsAssetProjectInsert} from '@/service/api/amsAsset'
import {iamCommonAreaList, iamCommonDicListTree} from '@/service/api/iamCommon'
import {findValueByCustomId} from '@/utils/array-util'

const router = useRouter()

// 所属省市区
const areaList = useRequest(iamCommonAreaList, {
  throttleInterval: 500,
})
const cityOptions = reactive<PairModel[]>([])
// 字典 [筹集方式 产权单位 产权性质 经营模式 筹集主体 项目类型]
const dicListTree = useRequest(iamCommonDicListTree, {
  throttleInterval: 500,
})
const collectWayOptions = reactive<SysDicVO[]>([])
const companyOptions = reactive<SysDicVO[]>([])
const ownershipPropertyOptions = reactive<SysDicVO[]>([])
const businessModelOptions = reactive<SysDicVO[]>([])
const projectTypeOption = reactive<SysDicVO[]>([])
// 新增项目
const projectInsert = useRequest(amsAssetProjectInsert, {
  throttleInterval: 500,
})

// 表单Ref：用于调用表单内置方法（验证、重置）
const formRef = ref<FormInstance>()

// 初始化表单数据：响应式对象，与表单双向绑定
const formData = reactive({
  // projectName: '', // 项目名称
  // projectId: '', // 项目编码
  // projectShortName: '', // 项目简称
  // provinceCode: '', // 所在区域-省 code
  // provinceName: '', // 所在区域-省名称
  // cityCode: '', // 所在区域-城市 code
  // cityName: '', // 所在区域-城市名称
  // districtCode: '', // 地址-区域 code
  // districtName: '', // 地址-区域名称
  // address: '', // 地址-详细地址
  // lng: null, // 经度
  // lat: null, // 纬度
  // landNumber: '', // 宗地号
  // ownershipPropertyCode: '', // 产权性质编码
  // ownershipPropertyName: '', // 产权性质名称
  // ownershipUnitCode: '', // 产权单位编码
  // ownershipUnitName: '', // 产权单位名称
  // collectWayCode: '', // 筹集方式编码
  // collectWayName: '', // 筹集方式名称
  // collectSubjectCode: '', // 筹集主体
  // collectDate: '', // 筹集日期
  // businessModelCode: '', // 经营模式编码
  // businessModelName: '', // 经营模式名称
  // projectTypeCode: '', // 项目类型编码
  // projectTypeName: '', // 项目类型名称
  // projectPhone: '', // 项目电话
} as AssetProjectUpsertDTO)

const formRules = reactive<FormRules<AssetProjectUpsertDTO>>({
  projectName: [{required: true, message: '请填写项目名称', trigger: 'blur'}],
  provinceCode: [{required: true, message: '请选择省市区', trigger: 'change'}],
  address: [{required: true, message: '请填写详细地址', trigger: 'blur'}],
  landNumber: [{required: true, message: '请填写宗地号', trigger: 'blur'}],
  ownershipPropertyCode: [{required: true, message: '请选择产权性质', trigger: 'change'}],
  ownershipUnitCode: [{required: true, message: '请选择产权单位', trigger: 'change'}],
  collectWayCode: [{required: true, message: '请选择筹集方式', trigger: 'change'}],
  collectSubjectCode: [{required: true, message: '请选择筹集主体', trigger: 'change'}],
  collectDate: [{required: true, message: '请选择筹集日期', trigger: 'change'}],
  businessModelCode: [{required: true, message: '请选择经营模式', trigger: 'change'}],
  projectTypeCode: [{required: true, message: '请选择项目类型', trigger: 'change'}],
  projectPhone: [
    {required: true, message: '请填写项目联系电话', trigger: 'blur'},
    {pattern: /^1[3-9]\d{9}$/, message: '请填写正确的11位手机号', trigger: 'blur'},
  ],
})

onMounted(() => getOptions())

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
  const {data: projectType} = await dicListTree.runAsync({dicType: 1003})
  projectTypeOption.push(...Object.values(projectType))
}

const dialogVisible = ref(false)
const openMap = (): void => {
  dialogVisible.value = true
}

const handleSubmit = () => {
  if (!formRef.value) return
  formRef.value.validate(async valid => {
    if (valid) {
      const cloneForm = JSON.parse(JSON.stringify(formData))
      cloneForm.cityCode = cloneForm?.provinceCode?.[1]
      cloneForm.districtCode = cloneForm?.provinceCode?.[2]
      cloneForm.provinceCode = cloneForm?.provinceCode?.[0]
      if (cloneForm.ownershipUnitCode?.length) {
        cloneForm.ownershipUnitCode =
          cloneForm.ownershipUnitCode[cloneForm.ownershipUnitCode.length - 1]
        cloneForm.ownershipUnitName =
          findValueByCustomId(cloneForm.ownershipUnitCode, 'dicId', 'dicName', companyOptions) || ''
      }
      if (cloneForm.collectSubjectCode?.length) {
        cloneForm.collectSubjectCode =
          cloneForm.collectSubjectCode[cloneForm.collectSubjectCode.length - 1]
        cloneForm.collectSubjectName =
          findValueByCustomId(cloneForm.collectSubjectCode, 'dicId', 'dicName', companyOptions) ||
          ''
      }
      cloneForm.ownershipPropertyName =
        findValueByCustomId(
          cloneForm.ownershipPropertyCode,
          'dicId',
          'dicName',
          ownershipPropertyOptions
        ) || ''
      cloneForm.collectWayName =
        findValueByCustomId(cloneForm.collectWayCode, 'dicId', 'dicName', collectWayOptions) || ''
      cloneForm.businessModelName =
        findValueByCustomId(
          cloneForm.businessModelCode,
          'dicId',
          'dicName',
          businessModelOptions
        ) || ''
      cloneForm.projectTypeName =
        findValueByCustomId(cloneForm.projectTypeCode, 'dicId', 'dicName', projectTypeOption) || ''

      console.log('表单提交数据：', {...cloneForm})

      await projectInsert.runAsync({...cloneForm})
      router.push('/asset/management/project')

      ElMessage.success('表单提交成功！')
    } else {
      ElMessage.error('表单填写有误，请检查必填项和格式！')
    }
  })
}

// 重置表单：重置数据+清除验证状态
const handleReset = () => {
  if (!formRef.value) return
  formRef.value.resetFields()
  ElMessage.info('表单已重置')
}

const props: CascaderProps = {
  checkStrictly: true,
  value: 'k',
  label: 'v',
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
}
</script>

<template>
  <el-card>
    <template #header>
      <div class="flex justify-between">
        新增项目
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
      >
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="项目名称" prop="projectName">
              <el-input v-model="formData.projectName" placeholder="请填写项目名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目编码">
              <el-input v-model="formData.projectId" placeholder="系统自动生成" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目简称" prop="projectShortName">
              <el-input v-model="formData.projectShortName" placeholder="请填写项目简称" />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="省市区" prop="provinceCode">
              <el-cascader
                v-model="formData.provinceCode"
                placeholder="请选择省/市/区"
                :props="props"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="详细地址" prop="address">
              <el-input v-model="formData.address" placeholder="请填写详细地址">
                <template #append>
                  <el-button :icon="Search" @click="openMap" />
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="经纬度">
              <el-row :gutter="12">
                <el-col :span="12">
                  <el-input v-model="formData.lng" placeholder="经度" />
                </el-col>
                <el-col :span="12">
                  <el-input v-model="formData.lat" placeholder="纬度" />
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="宗地号" prop="landNumber">
              <el-input v-model="formData.landNumber" placeholder="请填写宗地号" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产权性质" prop="ownershipPropertyCode">
              <el-select v-model="formData.ownershipPropertyCode" placeholder="请选择产权性质">
                <el-option
                  v-for="item in ownershipPropertyOptions"
                  :key="item.dicId"
                  :label="item.dicName"
                  :value="item.dicId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产权单位" prop="ownershipUnitCode">
              <el-cascader
                v-model="formData.ownershipUnitCode"
                placeholder="请选择产权单位"
                :options="companyOptions"
                :props="{
                  checkStrictly: true,
                  value: 'dicId',
                  label: 'dicName',
                }"
                clearable
              />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="筹集方式" prop="collectWayCode">
              <el-select v-model="formData.collectWayCode" placeholder="请选择筹集方式">
                <el-option
                  v-for="item in collectWayOptions"
                  :key="item.dicId"
                  :label="item.dicName"
                  :value="item.dicId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="筹集主体" prop="collectSubjectCode">
              <el-cascader
                v-model="formData.collectSubjectCode"
                placeholder="请选择筹集主体"
                :options="companyOptions"
                :props="{
                  checkStrictly: true,
                  value: 'dicId',
                  label: 'dicName',
                }"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="筹集日期" prop="collectDate">
              <el-date-picker
                v-model="formData.collectDate"
                type="date"
                placeholder="请选择筹集日期"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="经营模式" prop="businessModelCode">
              <el-select v-model="formData.businessModelCode" placeholder="请选择经营模式">
                <el-option
                  v-for="item in businessModelOptions"
                  :key="item.dicId"
                  :label="item.dicName"
                  :value="item.dicId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目类型" prop="projectTypeCode">
              <el-select v-model="formData.projectTypeCode" placeholder="请选择项目类型">
                <el-option
                  v-for="item in projectTypeOption"
                  :key="item.dicId"
                  :label="item.dicName"
                  :value="item.dicId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目电话" prop="projectPhone">
              <el-input v-model="formData.projectPhone" placeholder="请填写项目联系电话" />
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

  <el-dialog v-model="dialogVisible" title="详细地址" width="800">
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
