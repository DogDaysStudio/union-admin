<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue'
import type {FormInstance, FormRules} from 'element-plus'
import {ElMessage} from 'element-plus'
import {amsAsset} from '@/service/api/amsAsset'
import {useRequest} from 'vue-request'

// 获取项目名称
const projectSelectAll = useRequest(amsAsset.amsAssetProjectSelectAll, {
  throttleInterval: 500,
})
interface ProjectOptionVO {
  projectId: string
  projectName: string
}
const projectOptions = reactive<ProjectOptionVO[]>([])
// 生成楼栋编码
const buildingGenerateBuildingId = useRequest(amsAsset.amsAssetBuildingGenerateBuildingId, {
  throttleInterval: 500,
})
// 新增项目
const addBuilding = useRequest(amsAsset.amsAssetBuildingInsert, {
  throttleInterval: 500,
})

// 表单Ref：用于调用表单内置方法（验证、重置）
const formRef = ref<FormInstance>()

interface floorDTO {
  aboveground: number | null // 地面层
  underground: number | null // 地下层
  roomNumber: number | null // 每层房间数
  floorData: FloorItemDTO[] // 新增楼层数据数组
}

// 定义floorData
interface FloorItemDTO {
  floorId: string
  floorName: string
  floorHeight: number | null
  children?: FloorItemDTO[] // 若后续子节点有具体类型，可替换为：interface FloorChild {}; children: FloorChild[]
}

// 核心：定义楼栋完整类型 = 原有AssetBuildingDTO + 楼层扩展字段floorDTO
type AssetBuildingCompleteDTO = AssetBuildingDTO & floorDTO

// 初始化表单数据：响应式对象，与表单双向绑定
const formData = reactive({
  buildingList: [
    {
      buildingId: '', // 楼栋编码
      buildingName: '', // 楼栋名称
      projectId: '', // 项目编码
      ownershipUnitCode: '', // 产权单位编码
      ownershipUnitName: '', // 产权单位名称
      totalFloor: null, // 总层数
      totalRoom: null, // 总房间
      aboveground: null, // 地面（层）
      underground: null, // 地下（层）
      roomNumber: null, //
      floorData: [], // 初始化floorData为空数组
    },
  ], // 楼栋数据
  // floorList: [], // 楼层数据
  // roomList: [], // 住宅数据
} as AssetBuildingInsertDTO & {buildingList: AssetBuildingCompleteDTO[]})

// 封装各字段的通用验证规则（按需扩展，与原有规则一致）
const getProjectIdRule = () => [{required: true, message: '请选择项目', trigger: 'change'}]
const getBuildingNameRule = () => [{required: true, message: '请填写楼栋名称', trigger: 'blur'}]
const getBuildingIdRule = () => [{required: true, message: '请填写楼栋编码', trigger: 'blur'}]
const getTotalFloorRule = () => [{required: true, message: '请填写总层数', trigger: 'blur'}]
const getTotalRoomRule = () => [{required: true, message: '请填写总房间', trigger: 'blur'}]
const getOwnershipUnitCodeRule = () => [
  {required: true, message: '请选择产权单位', trigger: 'change'},
]
const getAbovegroundRule = () => [{required: true, message: '请填写地面（层）', trigger: 'blur'}]
const getUndergroundRule = () => [{required: true, message: '请填写地下（层）', trigger: 'blur'}]
const getRoomNumberRule = () => [{required: true, message: '请填写每层房间数', trigger: 'blur'}]

// 核心：动态更新formRules，与楼栋列表同步
const updateFormRules = () => {
  // 1. 清空原有规则（避免增删楼栋后残留无效规则）
  Object.keys(formRules).forEach(key => delete formRules[key])
  // 2. 遍历所有楼栋，为每个楼栋的每个字段生成精确索引的规则
  formData.buildingList.forEach((_, index) => {
    // 规则键与模板中:prop完全一致：`buildingList[${index}].字段名`
    formRules[`buildingList[${index}].projectId`] = getProjectIdRule()
    formRules[`buildingList[${index}].buildingName`] = getBuildingNameRule()
    formRules[`buildingList[${index}].buildingId`] = getBuildingIdRule()
    formRules[`buildingList[${index}].totalFloor`] = getTotalFloorRule()
    formRules[`buildingList[${index}].totalRoom`] = getTotalRoomRule()
    formRules[`buildingList[${index}].ownershipUnitCode`] = getOwnershipUnitCodeRule()
    formRules[`buildingList[${index}].aboveground`] = getAbovegroundRule()
    formRules[`buildingList[${index}].underground`] = getUndergroundRule()
    formRules[`buildingList[${index}].roomNumber`] = getRoomNumberRule()
  })
}

// 表单验证规则：对应prop字段，实现必填/格式校验
const formRules = reactive<FormRules>({})

onMounted(() => {
  getOptions()
  updateFormRules() // 初始化时生成第一个楼栋的规则
})

// 获取下拉接口
const getOptions = async (): Promise<void> => {
  const {data: project} = await projectSelectAll.runAsync()
  projectOptions.push(...Object.values(project))
}

// 选择项目获取楼栋编码
const handleChange = async (value: string, index: number): Promise<void> => {
  const {data} = await buildingGenerateBuildingId.runAsync({projectId: value})
  formData.buildingList[index].buildingId = data
}

// 新增楼栋
const addBuildingItem = (index: number) => {
  const lastBuilding = formData.buildingList[index]
  if (!lastBuilding) return
  const newBuilding: AssetBuildingCompleteDTO = JSON.parse(JSON.stringify(lastBuilding))
  newBuilding.buildingId = '' // 楼栋编码清空（系统自动生成）
  newBuilding.floorData = [] // 楼层数据清空，全新空数组，无任何引用
  formData.buildingList.push(newBuilding)
  updateFormRules() // 新增后更新规则，生成新楼栋的所有字段规则
  ElMessage.success('已新增楼栋，继承上一楼栋信息')
}

// 删除楼栋
const deleteBuildingItem = (index: number) => {
  if (formData.buildingList.length <= 1) {
    ElMessage.warning('至少保留一个楼栋信息，不可全部删除')
    return
  }
  formData.buildingList.splice(index, 1)
  updateFormRules() // 删除后更新规则，重新生成剩余楼栋的规则
  ElMessage.success('楼栋已删除')
}

/**
 * 生成楼层房间数据核心方法
 * @param index 当前楼栋在buildingList中的索引
 */
const generateFloorAndRoom = (index: number) => {
  const currentBuilding = formData.buildingList[index]
  const {aboveground, underground, roomNumber} = currentBuilding

  if (!formData.buildingList[index].buildingId) {
    ElMessage.warning('请选择项目')
    return
  }

  // 1. 输入值校验：非空、非负整数
  if (
    aboveground === null ||
    aboveground < 0 ||
    underground === null ||
    underground < 0 ||
    roomNumber === null ||
    roomNumber < 1
  ) {
    ElMessage.warning('请填写有效的数值：地上层/地下层≥0，每层房间数≥1')
    return
  }

  const floorData: FloorItemDTO[] = []
  const defaultHeight = 3 // 房间默认层高3米

  // 2. 生成地上楼层（倒序：如2层→1层，符合示例要求）
  for (let f = aboveground; f >= 1; f--) {
    const floorId = formData.buildingList[index].buildingId // 前缀为楼层数，语义化
    const roomChildren: FloorItemDTO[] = []
    // 生成当前楼层的房间
    for (let r = 1; r <= roomNumber; r++) {
      roomChildren.push({
        floorId: formData.buildingList[index].buildingId, // 前缀：楼层-房间号
        floorName: `${f}${r.toString().padStart(2, '0')}`, // 房间号：楼层+两位房间数（如101、202）
        floorHeight: defaultHeight,
        children: undefined, // 房间无子节点
      })
    }
    // 推入地上楼层
    floorData.push({
      floorId,
      floorName: `${f}层`,
      floorHeight: defaultHeight, // 父楼层不设置层高，仅房间设置
      children: roomChildren,
    })
  }

  // 3. 生成地下楼层（正序：B1层→B2层，符合示例要求）
  for (let f = 1; f <= underground; f++) {
    const floorId = formData.buildingList[index].buildingId // 前缀为B+地下楼层数，语义化
    const roomChildren: FloorItemDTO[] = []
    // 生成当前地下楼层的房间
    for (let r = 1; r <= roomNumber; r++) {
      roomChildren.push({
        floorId: formData.buildingList[index].buildingId, // 前缀：B楼层-房间号
        floorName: `B${f}-${r.toString().padStart(3, '0')}`, // 房间号：B楼层-三位房间数（如B1-101、B2-202）
        floorHeight: defaultHeight,
        children: undefined,
      })
    }
    // 推入地下楼层
    floorData.push({
      floorId,
      floorName: `B${f}层`,
      floorHeight: defaultHeight,
      children: roomChildren,
    })
  }

  // 4. 更新当前楼栋的floorData，ElTree会自动重新渲染
  currentBuilding.floorData = floorData
  // 自动计算总房间数（可选，同步到表单总房间字段）
  currentBuilding.totalRoom = (aboveground + underground) * roomNumber
  ElMessage.success('楼层房间数据生成成功！')
}

// 提交表单：先验证，通过后处理数据
const handleSubmit = () => {
  if (!formRef.value) return
  formRef.value.validate(async valid => {
    if (valid) {
      // 验证通过：处理表单提交逻辑（如接口请求）
      console.log('表单提交数据：', {...formData})
      console.log()
      //          {
      //       buildingId: '', // 楼栋编码
      //       buildingName: '', // 楼栋名称
      //       projectId: '', // 项目编码
      //       ownershipUnitCode: '', // 产权单位编码
      //       ownershipUnitName: '', // 产权单位名称
      //       totalFloor: null, // 总层数
      //       totalRoom: null, // 总房间
      //       aboveground: null, // 地面（层）
      //       underground: null, // 地下（层）
      //       roomNumber: null, //
      //       floorData: [], // 初始化floorData为空数组
      //     },
      //   ], // 楼栋数据
      //   floorList: [{}], // 楼层数据
      //   roomList: [], // 住宅数据

      const paramsData = JSON.parse(JSON.stringify(formData))
      console.log(paramsData)

      const {msg} = await addBuilding.runAsync({...paramsData})
      ElMessage.success(msg)
    } else {
      // 验证失败：提示错误
      ElMessage.error('请填写完整信息')
    }
  })
}

// 重置表单：重置数据+清除验证状态
const handleReset = () => {
  if (!formRef.value) return
  formRef.value.resetFields()
  ElMessage.info('表单已重置')
}
</script>

<template>
  <el-card>
    <template #header>
      <div class="flex justify-between">
        新增楼栋
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
        <el-card class="mb-4" v-for="(item, index) in formData.buildingList" :key="index">
          <template #header>
            <div class="flex justify-between">
              楼栋信息
              <div>
                <el-button type="primary" @click="addBuildingItem(index)">添加楼栋</el-button>
                <el-button type="danger" @click="deleteBuildingItem(index)">删除楼栋</el-button>
              </div>
            </div>
          </template>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="项目名称" :prop="`buildingList[${index}].projectId`" required>
                <el-select
                  v-model="item.projectId"
                  placeholder="请填写项目名称"
                  :options="projectOptions"
                  @change="handleChange($event, index)"
                >
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
              <el-form-item label="楼栋名称" :prop="`buildingList[${index}].buildingName`" required>
                <el-input v-model="item.buildingName" placeholder="请填写楼栋名称" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="楼栋编码" :prop="`buildingList[${index}].buildingId`" required>
                <el-input v-model="item.buildingId" placeholder="系统自动生成" disabled />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="总楼层" :prop="`buildingList[${index}].totalFloor`" required>
                <el-input v-model="item.totalFloor" placeholder="请填写总楼层" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="总房间数" :prop="`buildingList[${index}].totalRoom`" required>
                <el-input v-model="item.totalRoom" placeholder="请填写总房间数" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="产权单位"
                :prop="`buildingList[${index}].ownershipUnitCode`"
                required
              >
                <el-select v-model="item.ownershipUnitCode" placeholder="请选择产权单位">
                  <el-option label="南山公司" value="1" />
                  <el-option label="福田公司" value="2" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <section-group title="楼层信息" inline>
            <el-row :gutter="24">
              <el-col :span="8">
                <el-form-item
                  label="地面（层）"
                  :prop="`buildingList[${index}].aboveground`"
                  required
                >
                  <el-input-number v-model="item.aboveground" placeholder="请填写地面（层）" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="地下（层）"
                  :prop="`buildingList[${index}].underground`"
                  required
                >
                  <el-input-number v-model="item.underground" placeholder="请填写地下（层）" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="每层房间数"
                  :prop="`buildingList[${index}].roomNumber`"
                  required
                >
                  <div class="flex w-full">
                    <el-input-number v-model="item.roomNumber" placeholder="请填写每层房间数" />
                    <el-button type="primary" class="ml-4" @click="generateFloorAndRoom(index)">
                      生成
                    </el-button>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>

            <el-tree
              ref="treeRef"
              :data="item.floorData"
              node-key="floorId"
              default-expand-all
              :expand-on-click-node="false"
            >
              <template #default="{data}">
                <div>
                  <span>{{ data.floorName }}</span>
                  <el-input-number
                    class="ml-4"
                    v-model="data.floorHeight"
                    placeholder="请输入层高"
                  />
                </div>
              </template>
            </el-tree>
          </section-group>
        </el-card>

        <!-- 表单操作按钮：居中、间距 -->
        <div class="flex justify-center mt-6">
          <el-button @click="handleReset">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </el-form>
    </div>
  </el-card>
</template>
<style lang="scss" scoped>
:deep() {
  .el-tree-node__content {
    height: 44px;
    line-height: 30px;
  }
}
</style>
