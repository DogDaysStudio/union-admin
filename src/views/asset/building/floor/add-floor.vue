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
interface ProjectOptionVO {
  projectId: string
  projectName: string
}
const projectOptions = reactive<ProjectOptionVO[]>([])
// 字典 户型
const roomListTree = useRequest(iamCommon.iamCommonDicListTree, {
  throttleInterval: 500,
})
const roomOptions = reactive<SysDicVO[]>([])
// 楼栋下拉列表
const buildingList = useRequest(amsAsset.amsAssetBuildingList, {
  throttleInterval: 500,
})
const buildingOptions = reactive<AssetBuildingVO[]>([])
// 字典 产权单位（公司）
const companyListTree = useRequest(iamCommon.iamCommonDicListTree, {
  throttleInterval: 500,
})
const companyOptions = reactive<SysDicVO[]>([])
// 新增楼层
const addFloor = useRequest(amsAsset.amsAssetFloorInsert, {
  throttleInterval: 500,
})

// 表单Ref：用于调用表单内置方法（验证、重置）
const formRef = ref<FormInstance>()

interface floorDTO {
  roomNumber: number | null // 每层房间数
}

// 核心：定义楼栋完整类型 = 原有AssetBuildingDTO + 楼层扩展字段floorDTO
type AssetBuildingCompleteDTO = AssetBuildingDTO & floorDTO

// 初始化表单数据：响应式对象，与表单双向绑定
const formData = reactive({} as AssetFloorBaseDTO & AssetBuildingCompleteDTO)

// 表单验证规则：对应prop字段，实现必填/格式校验
const formRules = reactive<FormRules>({
  floorName: {required: true, message: '请填写楼层名称', trigger: 'blur'},
  floorHeight: {required: true, message: '请填写层高（m）', trigger: 'blur'},
  projectId: {required: true, message: '请选择所属项目', trigger: 'change'},
  assetId: {required: true, message: '请选择所属楼栋', trigger: 'change'},
  ownershipUnitCode: {required: true, message: '请选择产权单位', trigger: 'change'},
})

onMounted(() => {
  getOptions()
})

// 获取下拉接口
const getOptions = async (): Promise<void> => {
  const {data: project} = await projectSelectAll.runAsync()
  projectOptions.push(...Object.values(project))
  const {data: roomList} = await roomListTree.runAsync({dicType: 1024, pageable: false})
  roomOptions.push(...Object.values(roomList))
  const {data: companyList} = await companyListTree.runAsync({dicType: 1001, pageable: false})
  companyOptions.push(...Object.values(companyList))
  const {data: building} = await buildingList.runAsync({pageable: false} as AssetBuildingListDTO)
  buildingOptions.push(...Object.values(building))
}

// 定义房间项的类型（规范TS类型，可选但推荐）
interface RoomItem {
  roomNumber: string // 房间号（与房间名一致）
  roomLayoutCode: string // 户型编码（初始为空）
  roomHeight: number // 房间层高（与表单填写的层高一致）
  assetType: string
  ownershipUnitCode: string[] | undefined // 新增：产权单位（与楼层的级联选择值类型一致）
}

// 生成房间数据：点击生成按钮触发
const handleGenerateRooms = () => {
  // 1. 校验层高和房间数是否有效
  const floorHeight = Number(formData.floorHeight) // 转数字（兼容输入框字符串）
  const roomCount = formData.roomNumber // 每层房间数（el-input-number绑定的数字）

  // 校验规则：层高必须是有效数字、房间数必须是正整数、两者都不能为空
  if (!roomCount || roomCount < 1) {
    ElMessage.warning('请填写有效的每层房间数（正整数）')
    return
  }
  if (isNaN(floorHeight) || floorHeight <= 0) {
    ElMessage.warning('请填写有效的层高（大于0的数字）')
    return
  }

  // 2. 生成房间数据数组
  const roomList: RoomItem[] = []
  for (let i = 1; i <= roomCount; i++) {
    // 补零生成房间名/房间号（001、002、003...格式）
    const roomNo = String(i).padStart(3, '0')
    roomList.push({
      roomNumber: roomNo,
      roomLayoutCode: '', // 户型编码初始为空，留待用户选择
      roomHeight: floorHeight, // 房间层高与表单填写的层高一致
      assetType: '1',
      ownershipUnitCode:
        typeof formData.ownershipUnitCode === 'string'
          ? [formData.ownershipUnitCode]
          : formData.ownershipUnitCode,
    })
  }
  formData.roomList = roomList as unknown as AssetRoomUpsertDTO[]
}

interface Room {
  projectId: string
  roomNumber: string
  roomHeight: number
  roomLayoutName: string
  roomLayoutCode: string | number
  ownershipUnitCode: []
  ownershipUnitName: string
}

// 提交表单：先验证，通过后处理数据
const handleSubmit = () => {
  if (!formRef.value) return
  formRef.value.validate(async valid => {
    if (valid) {
      let Flag = true
      const paramsData = JSON.parse(JSON.stringify(formData))
      if (Array.isArray(paramsData?.ownershipUnitCode)) {
        const targetCode =
          paramsData.ownershipUnitCode[paramsData.ownershipUnitCode.length - 1] ?? ''
        paramsData.ownershipUnitName =
          findValueByCustomId(targetCode, 'dicId', 'dicName', companyOptions) || ''
        paramsData.ownershipUnitCode =
          paramsData.ownershipUnitCode[paramsData.ownershipUnitCode.length - 1]
      }
      paramsData.assetType = '1'
      paramsData.roomList?.forEach((room: Room) => {
        room.projectId = paramsData.projectId
        if (!room?.roomHeight) {
          Flag = false
        }
        if (room.roomLayoutCode) {
          room.roomLayoutName =
            findValueByCustomId(room.roomLayoutCode, 'dicId', 'dicName', roomOptions) || ''
        } else {
          Flag = false
        }
        if (Array.isArray(room?.ownershipUnitCode)) {
          const targetCode = room.ownershipUnitCode[room.ownershipUnitCode.length - 1] ?? ''
          room.ownershipUnitName =
            findValueByCustomId(targetCode, 'dicId', 'dicName', companyOptions) || ''
          room.ownershipUnitCode = room.ownershipUnitCode[room.ownershipUnitCode.length - 1]
        }
      })
      console.log(paramsData, 'paramsData')

      if (Flag) {
        const {msg} = await addFloor.runAsync({...paramsData})
        ElMessage.success(msg)
      } else {
        ElMessage.warning('请填写层高、户型')
      }
    } else {
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

const treeProps = {
  children: 'roomList', // 替换默认children为roomList（必配）
}
</script>

<template>
  <el-card>
    <template #header>
      <div class="flex justify-between">
        新增楼层
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
        <el-card class="mb-4">
          <template #header>
            <div class="flex justify-between">楼层信息</div>
          </template>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="楼层名称" prop="floorName" required>
                <el-input v-model="formData.floorName" placeholder="请填写楼层名称" />
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
              <el-form-item label="所属楼栋" prop="assetId" required>
                <el-select v-model="formData.assetId" placeholder="请选择所属楼栋">
                  <el-option
                    v-for="item in buildingOptions"
                    :key="item.buildingId"
                    :label="item.buildingName"
                    :value="item.buildingId"
                  />
                </el-select>
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
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>

          <section-group title="房间信息" inline>
            <el-row :gutter="24">
              <el-col :span="8">
                <el-form-item label="每层房间数">
                  <div class="flex w-full">
                    <el-input-number v-model="formData.roomNumber" placeholder="请填写每层房间数" />
                    <el-button type="primary" class="ml-4" @click="handleGenerateRooms">
                      生成
                    </el-button>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>

            <el-tree
              ref="treeRef"
              :data="formData.roomList"
              node-key="roomId"
              default-expand-all
              :props="treeProps"
              :expand-on-click-node="false"
            >
              <template #default="{data}">
                <el-row :gutter="24">
                  <el-col :span="6">
                    房间：
                    <el-input class="w-50!" v-model="data.roomNumber" />
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
