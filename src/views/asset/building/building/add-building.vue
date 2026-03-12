<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import type {FormInstance, FormRules} from 'element-plus'
import {ElMessage} from 'element-plus'
import {useRequest} from 'vue-request'
import {findValueByCustomId} from '@/utils/array-util'
import {useDicListTree} from '@/common/hooks/useDicTree'
import {amsAssetBuildingInsert, amsAssetProjectList} from '@/service/api/amsAsset'

const router = useRouter()

// 获取项目列表
const {runAsync: projectList} = useRequest(amsAssetProjectList)
const projectOptions = reactive<{projectId: string; projectName: string}[]>([])
// 字典 [户型 产权单位]
const roomOptions = useDicListTree({dicType: 1024})
const companyOptions = useDicListTree({dicType: 1001})
// 新增项目
const {runAsync: addBuilding, loading: insertLoading} = useRequest(amsAssetBuildingInsert)

const formRef = ref<FormInstance>()

interface floorDTO {
  aboveground: number | null // 地面层
  underground: number | null // 地下层
  roomNumber: number | null // 每层房间数
}

type AssetBuildingCompleteDTO = AssetBuildingDTO & floorDTO

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

const formRules = reactive<FormRules>({})

onMounted(() => {
  getOptions()
  updateFormRules() // 初始化时生成第一个楼栋的规则
})

const getOptions = async (): Promise<void> => {
  const {data: project} = await projectList({pageable: false} as AssetProjectListDTO)
  projectOptions.push(...project)
}

// 新增楼栋
const addBuildingItem = (index: number) => {
  formRef.value.validate(async valid => {
    if (!valid) {
      ElMessage.warning('请先填写完整信息')
      return
    }
    const lastBuilding = formData.buildingList[index]
    if (!lastBuilding) return
    const newBuilding: AssetBuildingCompleteDTO = JSON.parse(JSON.stringify(lastBuilding))
    newBuilding.floorList = [] // 楼层数据清空，全新空数组，无任何引用
    formData.buildingList.push(newBuilding)
    updateFormRules() // 新增后更新规则，生成新楼栋的所有字段规则
  })
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
  formRef.value.validate(async valid => {
    if (!valid) return

    const currentBuilding = formData.buildingList[index]
    const {aboveground, underground, roomNumber, ownershipUnitCode} = currentBuilding
    if (aboveground === undefined || underground === undefined || roomNumber === undefined) {
      ElMessage.warning('请填写有效的数值：地上层/地下层≥0，每层商铺数≥1')
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
        floorId: `${f}层`,
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
        floorId: `B${f}层`,
        assetType: '1',
        floorName: `B${f}层`,
        floorHeight: defaultHeight,
        roomList: roomChildren,
        ownershipUnitCode, // 赋值：楼层继承楼栋的产权单位编码
      })
    }

    // 5. 更新当前楼栋的floorData，ElTree会自动重新渲染并回显产权单位
    currentBuilding.floorList = floorData
    currentBuilding.totalFloor = aboveground + underground
    currentBuilding.totalRoom = (aboveground + underground) * roomNumber
  })
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
            findValueByCustomId(targetCode, 'dicCode', 'dicName', companyOptions) || ''
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
                findValueByCustomId(room.roomLayoutCode, 'dicCode', 'dicName', roomOptions) || ''
            } else {
              Flag = false
            }
          })
        })
      })

      if (Flag) {
        const {msg} = await addBuilding({...paramsData})
        ElMessage.success(msg)
        router.push('/asset/management/building-floor')
      } else {
        ElMessage.warning('请填写完整信息：层高、户型、产权单位为必填项')
      }
    } else {
      ElMessage.error('请填写完整楼栋基础信息')
    }
  })
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
                    value: 'dicCode',
                    label: 'dicName',
                  }"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="8">
              <!-- :prop="`buildingList[${index}].totalFloor`" -->
              <el-form-item label="总楼层" required>
                <el-input v-model="item.totalFloor" placeholder="请填写总楼层" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <!-- :prop="`buildingList[${index}].totalRoom`" -->
              <el-form-item label="总房间数" required>
                <el-input v-model="item.totalRoom" placeholder="请填写总房间数" disabled />
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
                  <el-input-number
                    v-model="item.aboveground"
                    placeholder="请填写地面（层）"
                    :min="0"
                    :precision="0"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="地下（层）"
                  :prop="`buildingList[${index}].underground`"
                  required
                >
                  <el-input-number
                    v-model="item.underground"
                    placeholder="请填写地下（层）"
                    :min="0"
                    :precision="0"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="每层房间数"
                  :prop="`buildingList[${index}].roomNumber`"
                  required
                >
                  <div class="flex w-full">
                    <el-input-number
                      v-model="item.roomNumber"
                      placeholder="请填写每层房间数"
                      :min="0"
                      :precision="0"
                    />
                    <el-button type="primary" class="ml-4" @click="generateFloorAndRoom(index)">
                      生成
                    </el-button>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- table -->
            <el-table
              :data="item.floorList"
              border
              default-expand-all
              :preserve-expanded-content="true"
              :row-key="row => row.floorId"
            >
              <el-table-column type="expand">
                <template #default="{row}">
                  <div class="py-2 px-4 pl-12">
                    <el-table :data="row.roomList" border>
                      <el-table-column label="房间">
                        <template #default="{row}">
                          <el-input v-model="row.roomName" />
                        </template>
                      </el-table-column>
                      <el-table-column label="层高">
                        <template #default="{row}">
                          <el-input-number v-model="row.roomHeight" />
                        </template>
                      </el-table-column>
                      <el-table-column label="户型">
                        <template #default="{row}">
                          <el-select v-model="row.roomLayoutCode">
                            <el-option
                              v-for="item in roomOptions"
                              :key="item.dicCode"
                              :label="item.dicName"
                              :value="item.dicCode"
                            />
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column label="产权单位">
                        <template #default="{row}">
                          <el-cascader
                            v-model="row.ownershipUnitCode"
                            :options="companyOptions"
                            :props="{
                              checkStrictly: true,
                              value: 'dicCode',
                              label: 'dicName',
                            }"
                          />
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="楼层">
                <template #default="{row}">
                  <el-input v-model="row.floorName" />
                </template>
              </el-table-column>
              <el-table-column label="层高">
                <template #default="{row}">
                  <el-input-number v-model="row.floorHeight" :min="0" />
                </template>
              </el-table-column>
              <el-table-column label="产权单位">
                <template #default="{row}">
                  <el-cascader
                    v-model="row.ownershipUnitCode"
                    :options="companyOptions"
                    :props="{
                      checkStrictly: true,
                      value: 'dicCode',
                      label: 'dicName',
                    }"
                  />
                </template>
              </el-table-column>
            </el-table>
          </section-group>
        </el-card>

        <div class="flex justify-center mt-6">
          <el-button @click="router.push('/asset/management/building-floor')">返回</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="insertLoading">确定</el-button>
        </div>
      </el-form>
    </div>
  </el-card>
</template>
