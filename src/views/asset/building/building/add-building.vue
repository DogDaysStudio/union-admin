<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue'
import type {FormInstance, FormRules} from 'element-plus'
import {ElMessage} from 'element-plus'
import {amsAsset} from '@/service/api/amsAsset'
import {iamCommon} from '@/service/api/iamCommon'
import {useRequest} from 'vue-request'
import {findValueByCustomId} from '@/utils/array-util'

// 获取项目名称
const projectSelectAll = useRequest(amsAsset.amsAssetProjectSelectAll, {
  throttleInterval: 500,
})
const projectOptions = reactive<{projectId: string; projectName: string}[]>([])
// 字典 户型
const roomListTree = useRequest(iamCommon.iamCommonDicListTree, {
  throttleInterval: 500,
})
const roomOptions = reactive<SysDicVO[]>([])
// 字典 产权单位（公司）
const companyListTree = useRequest(iamCommon.iamCommonDicListTree, {
  throttleInterval: 500,
})
const companyOptions = reactive<SysDicVO[]>([])
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
      roomNumber: null, // 每层房间数
      floorList: [],
    },
  ], // 楼栋数据
} as AssetBuildingInsertDTO & {buildingList: AssetBuildingCompleteDTO[]})

// 封装各字段的通用验证规则（按需扩展，与原有规则一致）
const getProjectIdRule = () => [{required: true, message: '请选择项目', trigger: 'change'}]
const getBuildingNameRule = () => [{required: true, message: '请填写楼栋名称', trigger: 'blur'}]
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
  const {data: roomList} = await roomListTree.runAsync({dicType: 1024, pageable: false})
  roomOptions.push(...Object.values(roomList))
  const {data: companyList} = await companyListTree.runAsync({dicType: 1001, pageable: false})
  companyOptions.push(...Object.values(companyList))
}

// 新增楼栋
const addBuildingItem = (index: number) => {
  const lastBuilding = formData.buildingList[index]
  if (!lastBuilding) return
  const newBuilding: AssetBuildingCompleteDTO = JSON.parse(JSON.stringify(lastBuilding))
  newBuilding.floorList = [] // 楼层数据清空，全新空数组，无任何引用
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
  const {aboveground, underground, roomNumber, ownershipUnitCode} = currentBuilding

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

  const floorData = []
  const defaultHeight = null // 房间默认层高（保持原有逻辑）

  // 3. 生成地上楼层（倒序：如2层→1层，符合示例要求）
  for (let f = aboveground; f >= 1; f--) {
    const roomChildren = []
    // 生成当前楼层的房间
    for (let r = 1; r <= roomNumber; r++) {
      roomChildren.push({
        assetType: '1',
        roomName: `${f}${r.toString().padStart(2, '0')}`,
        roomHeight: defaultHeight,
        roomList: undefined,
        ownershipUnitCode, // 赋值：房间继承楼栋的产权单位编码
      })
    }
    // 推入地上楼层（新增ownershipUnitCode赋值）
    floorData.push({
      assetType: '1',
      floorName: `${f}层`,
      floorHeight: defaultHeight,
      roomList: roomChildren,
      ownershipUnitCode, // 赋值：楼层继承楼栋的产权单位编码
    })
  }

  // 4. 生成地下楼层（正序：B1层→B2层，符合示例要求）
  for (let f = 1; f <= underground; f++) {
    const roomChildren = []
    // 生成当前地下楼层的房间
    for (let r = 1; r <= roomNumber; r++) {
      roomChildren.push({
        assetType: '1',
        roomName: `B${f}-${r.toString().padStart(3, '0')}`,
        roomHeight: defaultHeight,
        roomList: undefined,
        ownershipUnitCode, // 赋值：房间继承楼栋的产权单位编码
      })
    }
    // 推入地下楼层（新增ownershipUnitCode赋值）
    floorData.push({
      assetType: '1',
      floorName: `B${f}层`,
      floorHeight: defaultHeight,
      roomList: roomChildren,
      ownershipUnitCode, // 赋值：楼层继承楼栋的产权单位编码
    })
  }

  // 5. 更新当前楼栋的floorData，ElTree会自动重新渲染并回显产权单位
  currentBuilding.floorList = floorData
  currentBuilding.totalRoom = (aboveground + underground) * roomNumber
  ElMessage.success('楼层房间数据生成成功，已继承楼栋产权单位！')
}

// 先完善TS接口：补全Floor、Room的产权单位相关字段，保证类型匹配
interface Room {
  projectId: string
  roomNumber: string
  roomName: string
  roomHeight: number | null
  roomLayoutName: string
  roomLayoutCode: string | number | undefined
  ownershipUnitCode: string | any[] // 支持数组（前端绑定）/字符串（提交后端）
  ownershipUnitName: string // 产权单位中文名称
}

interface Floor {
  floorHeight: number | null
  roomList: Room[] // 楼层下的房间列表，关联Room接口
  ownershipUnitCode: string | any[] // 支持数组（前端绑定）/字符串（提交后端）
  ownershipUnitName: string // 产权单位中文名称
  floorName?: string // 兼容楼层名称字段
}

interface Building {
  ownershipUnitCode: string | any[]
  ownershipUnitName: string
  projectId: string
  floorList: Floor[] // 楼栋下的楼层列表，关联Floor接口
  buildingName?: string
  totalFloor?: number | null
}

// 提交表单：先验证，通过后处理数据
const handleSubmit = () => {
  if (!formRef.value) return
  formRef.value.validate(async valid => {
    if (valid) {
      let Flag = true
      const paramsData = JSON.parse(JSON.stringify(formData))

      // 【核心】抽离通用函数：处理产权单位（楼栋/楼层/房间通用）
      // 入参：target-待处理对象（楼栋/楼层/房间），Flag-提交状态标识（直接修改外部值）
      const processOwnershipUnit = (target: {
        ownershipUnitCode: string | any[]
        ownershipUnitName: string
      }) => {
        if (Array.isArray(target.ownershipUnitCode)) {
          const targetCode = target.ownershipUnitCode[target.ownershipUnitCode.length - 1] ?? ''
          if (!targetCode) Flag = false
          target.ownershipUnitName =
            findValueByCustomId(targetCode, 'dicId', 'dicName', companyOptions) || ''
          target.ownershipUnitCode = targetCode
        }
      }

      paramsData.buildingList?.forEach((building: Building) => {
        // 1. 处理楼栋产权单位 → 调用通用函数（替代原重复代码）
        processOwnershipUnit(building)
        // 2. 处理楼层数据
        building.floorList?.forEach((floor: Floor) => {
          if (!floor?.floorHeight) Flag = false
          processOwnershipUnit(floor)
          // 3. 处理房间数据
          floor.roomList?.forEach((room: Room) => {
            room.projectId = building.projectId
            room.roomNumber = room.roomName
            if (!room.roomHeight) Flag = false
            processOwnershipUnit(room)
            if (room.roomLayoutCode) {
              room.roomLayoutName =
                findValueByCustomId(room.roomLayoutCode, 'dicId', 'dicName', roomOptions) || ''
            } else {
              Flag = false
            }
          })
        })
      })

      if (Flag) {
        const {msg} = await addBuilding.runAsync({...paramsData})
        ElMessage.success(msg)
      } else {
        ElMessage.warning('请填写完整信息：层高、户型、产权单位为必填项')
      }
    } else {
      ElMessage.error('请填写完整楼栋基础信息')
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
                <el-select v-model="item.projectId" placeholder="请填写项目名称">
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
              <el-form-item
                label="产权单位"
                :prop="`buildingList[${index}].ownershipUnitCode`"
                required
              >
                <el-cascader
                  v-model="item.ownershipUnitCode"
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
              :data="item.floorList"
              node-key="floorId"
              default-expand-all
              :props="{
                children: 'roomList',
              }"
              :expand-on-click-node="false"
            >
              <template #default="{data}">
                <el-row v-if="data.roomList" :gutter="24">
                  <el-col :span="8">
                    楼层：
                    <el-input class="w-50!" v-model="data.floorName" />
                  </el-col>
                  <el-col :span="8">
                    层高：
                    <el-input-number
                      class="w-50!"
                      v-model="data.floorHeight"
                      placeholder="请输入层高"
                    />
                  </el-col>
                  <el-col :span="8">
                    产权单位：
                    <el-cascader
                      class="w-50!"
                      v-model="data.ownershipUnitCode"
                      placeholder="请选择产权单位"
                      :options="companyOptions"
                      :props="{
                        checkStrictly: true,
                        value: 'dicId',
                        label: 'dicName',
                      }"
                      clearable
                    />
                  </el-col>
                </el-row>
                <el-row v-else :gutter="24">
                  <el-col :span="6">
                    房间：
                    <el-input class="w-50!" v-model="data.roomName" />
                  </el-col>
                  <el-col :span="6">
                    层高：
                    <el-input-number
                      class="w-50!"
                      v-model="data.roomHeight"
                      placeholder="请输入层高"
                    />
                  </el-col>
                  <el-col :span="6">
                    户型：
                    <el-select class="w-50!" v-model="data.roomLayoutCode" placeholder="请选择户型">
                      <el-option
                        v-for="item in roomOptions"
                        :key="item.dicId"
                        :label="item.dicName"
                        :value="item.dicId"
                      />
                    </el-select>
                  </el-col>
                  <el-col :span="6">
                    产权单位：
                    <el-cascader
                      class="w-50!"
                      v-model="data.ownershipUnitCode"
                      placeholder="请选择产权单位"
                      :options="companyOptions"
                      :props="{
                        checkStrictly: true,
                        value: 'dicId',
                        label: 'dicName',
                      }"
                      clearable
                    />
                  </el-col>
                </el-row>
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
