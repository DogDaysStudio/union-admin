<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue'
import type {CascaderProps, FormInstance, FormRules} from 'element-plus'
import {ElMessage} from 'element-plus'
import {Search} from '@element-plus/icons-vue'
// import {amsAsset} from '@/service/api/amsAsset'
import {useRequest} from 'vue-request'
import {iamCommonAreaList} from '@/service/api/iamCommon'

// 所属省市区
const areaList = useRequest(iamCommonAreaList, {
  throttleInterval: 500,
})
const cityOptions = reactive<PairModel[]>([])
// 新增项目
// const addAmsAssetProject = useRequest(amsAsset.amsAssetProjectInsert, {
//   throttleInterval: 500,
// })

// 表单Ref：用于调用表单内置方法（验证、重置）
const formRef = ref<FormInstance>()

// 初始化表单数据：响应式对象，与表单双向绑定
const formData = reactive({
  projectName: '', // 项目名称
  projectId: '', // 项目编码
  projectShortName: '', // 项目简称
  provinceCode: '', // 所在区域-省 code
  provinceName: '', // 所在区域-省名称
  cityCode: '', // 所在区域-城市 code
  cityName: '', // 所在区域-城市名称
  districtCode: '', // 地址-区域 code
  districtName: '', // 地址-区域名称
  address: '', // 地址-详细地址
  lng: null, // 经度
  lat: null, // 纬度
  landNumber: '', // 宗地号
  ownershipPropertyCode: '', // 产权性质编码
  ownershipPropertyName: '', // 产权性质名称
  ownershipUnitCode: '', // 产权单位编码
  ownershipUnitName: '', // 产权单位名称
  collectWayCode: '', // 筹集方式编码
  collectWayName: '', // 筹集方式名称
  collectSubject: '', // 筹集主体
  collectDate: '', // 筹集日期
  businessModelCode: '', // 经营模式编码
  businessModelName: '', // 经营模式名称
  projectTypeCode: '', // 项目类型编码
  projectTypeName: '', // 项目类型名称
  projectPhone: '', // 项目电话
} as AssetProjectUpsertDTO)

// 表单验证规则：对应prop字段，实现必填/格式校验
const formRules = reactive<FormRules<AssetProjectUpsertDTO>>({
  projectName: [{required: true, message: '请填写项目名称', trigger: 'blur'}],
  projectId: [{required: true, message: '请填写项目编码', trigger: 'blur'}],
  provinceCode: [{required: true, message: '请选择省市区', trigger: 'change'}],
  address: [{required: true, message: '请填写详细地址', trigger: 'blur'}],
  landNumber: [{required: true, message: '请填写宗地号', trigger: 'blur'}],
  ownershipPropertyCode: [{required: true, message: '请选择产权性质', trigger: 'change'}],
  ownershipUnitCode: [{required: true, message: '请选择产权单位', trigger: 'change'}],
  collectWayCode: [{required: true, message: '请选择筹集方式', trigger: 'change'}],
  collectSubject: [{required: true, message: '请选择筹集主体', trigger: 'change'}],
  collectDate: [{required: true, message: '请选择筹集日期', trigger: 'change'}],
  businessModelCode: [{required: true, message: '请选择经营模式', trigger: 'change'}],
  projectTypeCode: [{required: true, message: '请选择项目类型', trigger: 'change'}],
  projectPhone: [
    {required: true, message: '请填写项目联系电话', trigger: 'blur'},
    {pattern: /^1[3-9]\d{9}$/, message: '请填写正确的11位手机号', trigger: 'blur'},
  ],
})

onMounted(() => {
  getOptions()
})

const getOptions = async (): Promise<void> => {
  const {data: cityOption} = await areaList.runAsync({pid: ''})
  cityOptions.push(...cityOption)
}

const dialogVisible = ref(false)
const openMap = (): void => {
  dialogVisible.value = true
}

// 提交表单：先验证，通过后处理数据
const handleSubmit = () => {
  if (!formRef.value) return
  formRef.value.validate(valid => {
    if (valid) {
      // 验证通过：处理表单提交逻辑（如接口请求）
      console.log('表单提交数据：', {...formData})
      ElMessage.success('表单提交成功！')
    } else {
      // 验证失败：提示错误
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
    <!-- 外层容器：水平居中 -->
    <div class="mx-auto">
      <!-- 表单核心：绑定数据/验证、标签宽度、间距 -->
      <el-form
        :model="formData"
        :rules="formRules"
        ref="formRef"
        label-width="80px"
        label-position="top"
      >
        <!-- 第一行：项目名称、编码、简称 -->
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="项目名称" prop="projectName">
              <el-input v-model="formData.projectName" placeholder="请填写项目名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目编码" prop="projectId">
              <el-input v-model="formData.projectId" placeholder="系统自动生成" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目简称" prop="projectShortName">
              <el-input v-model="formData.projectShortName" placeholder="请填写项目简称" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第二行：省市区、详细地址、经纬度 -->
        <el-row :gutter="24">
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
                  <el-input v-model="formData.lng" placeholder="经度" disabled />
                </el-col>
                <el-col :span="12">
                  <el-input v-model="formData.lat" placeholder="纬度" disabled />
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第三行：宗地号、产权性质、产权单位 -->
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="宗地号" prop="landNumber">
              <el-input v-model="formData.landNumber" placeholder="请填写宗地号" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产权性质" prop="ownershipPropertyCode">
              <el-select v-model="formData.ownershipPropertyCode" placeholder="请选择产权性质">
                <el-option label="国有" value="state-owned" />
                <el-option label="集体" value="collective" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产权单位" prop="ownershipUnitCode">
              <el-select v-model="formData.ownershipUnitCode" placeholder="请选择产权单位">
                <el-option label="市国资委" value="city-sasac" />
                <el-option label="区国资委" value="district-sasac" />
                <el-option label="国有企业" value="state-enterprise" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第四行：筹集方式、筹集主体、筹集日期 -->
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="筹集方式" prop="collectWayCode">
              <el-select v-model="formData.collectWayCode" placeholder="请选择筹集方式">
                <el-option label="自建" value="self-built" />
                <el-option label="购置" value="purchase" />
                <el-option label="配建" value="allocated" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="筹集主体" prop="collectSubject">
              <el-select v-model="formData.collectSubject" placeholder="请选择筹集主体">
                <el-option label="政府" value="government" />
                <el-option label="国有企业" value="state-enterprise" />
                <el-option label="民营企业" value="private-enterprise" />
              </el-select>
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
        </el-row>

        <!-- 第五行：经营模式、项目类型、项目电话 -->
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="经营模式" prop="businessModelCode">
              <el-select v-model="formData.businessModelCode" placeholder="请选择经营模式">
                <el-option label="自营" value="self-operated" />
                <el-option label="托管" value="hosting" />
                <el-option label="合作运营" value="cooperation" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目类型" prop="projectTypeCode">
              <el-select v-model="formData.projectTypeCode" placeholder="请选择项目类型">
                <el-option label="保障性租赁住房" value="affordable-rental" />
                <el-option label="公租房" value="public-rental" />
                <el-option label="人才公寓" value="talent-apartment" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目电话" prop="projectPhone">
              <el-input v-model="formData.projectPhone" placeholder="请填写项目联系电话" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 表单操作按钮：居中、间距 -->
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
