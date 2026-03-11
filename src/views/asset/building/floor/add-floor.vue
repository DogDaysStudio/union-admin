<script setup lang="ts">
import {ref, reactive, onMounted, watch} from 'vue'
import {useRouter} from 'vue-router'
import type {FormInstance, FormRules} from 'element-plus'
import {ElMessage} from 'element-plus'
import {useRequest} from 'vue-request'
import {findValueByCustomId} from '@/utils/array-util'
import {useDicListTree} from '@/common/hooks/useDicTree'
import {
  amsAssetBuildingList,
  amsAssetFloorInsert,
  amsAssetProjectList,
} from '@/service/api/amsAsset'

const router = useRouter()

// 项目列表
const {runAsync: projectList} = useRequest(amsAssetProjectList)
const projectOptions = reactive<{projectId: string; projectName: string}[]>([])
// 字典 [户型 产权单位 ]
const roomOptions = useDicListTree({dicType: 1024})
const companyOptions = useDicListTree({dicType: 1001})
// 楼栋下拉列表
const {runAsync: buildingList} = useRequest(amsAssetBuildingList)
const buildingOptions = reactive<AssetBuildingVO[]>([])
// 新增楼层
const {runAsync: addFloor, loading: insertLoading} = useRequest(amsAssetFloorInsert)

// 表单Ref：用于调用表单内置方法（验证、重置）
const formRef = ref<FormInstance>()

interface floorDTO {
  roomNumber: number | null // 每层房间数
}

// 核心：定义楼栋完整类型 = 原有AssetBuildingDTO + 楼层扩展字段floorDTO
type AssetBuildingCompleteDTO = AssetBuildingDTO & floorDTO

// 初始化表单数据：响应式对象，与表单双向绑定
const formData = reactive({} as AssetFloorDTO & AssetBuildingCompleteDTO)

// 表单验证规则：对应prop字段，实现必填/格式校验
const formRules = reactive<FormRules>({
  floorName: {required: true, message: '请填写楼层名称', trigger: 'blur'},
  floorHeight: {required: true, message: '请填写层高（m）', trigger: 'blur'},
  projectId: {required: true, message: '请选择所属项目', trigger: 'blur'},
  assetId: {required: true, message: '请选择所属楼栋', trigger: 'blur'},
  ownershipUnitCode: {required: true, message: '请选择产权单位', trigger: 'blur'},
})

onMounted(() => getOptions())

// 获取下拉接口
const getOptions = async (): Promise<void> => {
  const {data: project} = await projectList({pageable: false} as AssetProjectListDTO)
  projectOptions.push(...project)
}

// 监听projectId变化，获取楼栋
watch(
  () => formData.projectId,
  async projectId => {
    buildingOptions.length = 0
    formData.assetId = ''
    if (projectId) {
      const {data: building} = await buildingList({
        pageable: false,
        projectId,
      } as AssetBuildingListDTO)
      buildingOptions.push(...building)
    }
  },
  {immediate: false}
)

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
  formRef.value.validate(async valid => {
    if (!valid) return
    // 1. 校验层高和房间数是否有效
    const floorHeight = Number(formData.floorHeight) // 转数字（兼容输入框字符串）
    const roomCount = formData.roomNumber // 每层房间数（el-input-number绑定的数字）

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
  })
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
          findValueByCustomId(targetCode, 'dicCode', 'dicName', companyOptions) || ''
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
            findValueByCustomId(room.roomLayoutCode, 'dicCode', 'dicName', roomOptions) || ''
        } else {
          Flag = false
        }
        if (Array.isArray(room?.ownershipUnitCode)) {
          const targetCode = room.ownershipUnitCode[room.ownershipUnitCode.length - 1] ?? ''
          room.ownershipUnitName =
            findValueByCustomId(targetCode, 'dicCode', 'dicName', companyOptions) || ''
          room.ownershipUnitCode = room.ownershipUnitCode[room.ownershipUnitCode.length - 1]
        }
      })
      if (Flag) {
        const {msg} = await addFloor({...paramsData})
        ElMessage.success(msg)
        router.push('/asset/management/building-floor')
      } else {
        ElMessage.warning('请填写层高、户型')
      }
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
        新增楼层
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
        <section-group title="楼层信息" inline>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="楼层名称" prop="floorName" required>
                <el-input v-model="formData.floorName" placeholder="请填写楼层名称" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="层高（m）" prop="floorHeight" required>
                <el-input-number v-model="formData.floorHeight" placeholder="请填写层高" :min="1" />
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
                <el-select
                  v-model="formData.assetId"
                  placeholder="请选择所属楼栋"
                  :disabled="!formData.projectId"
                >
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
                    value: 'dicCode',
                    label: 'dicName',
                  }"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
        </section-group>

        <section-group title="房间信息" inline>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="每层房间数">
                <div class="flex w-full">
                  <el-input-number
                    v-model="formData.roomNumber"
                    placeholder="请填写每层房间数"
                    :min="1"
                    :precision="0"
                  />
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
            :props="{
              children: 'roomList',
            }"
            :expand-on-click-node="false"
          >
            <template #default="{data}">
              <el-row :gutter="24">
                <span class="ml-2">
                  房间：
                  <el-input class="w-40!" v-model="data.roomNumber" />
                </span>
                <span class="ml-2">
                  层高：
                  <el-input-number
                    class="w-40!"
                    v-model="data.roomHeight"
                    placeholder="请输入层高"
                    :min="1"
                  />
                </span>
                <span class="ml-2">
                  户型：
                  <el-select class="w-40!" v-model="data.roomLayoutCode" placeholder="请选择户型">
                    <el-option
                      v-for="item in roomOptions"
                      :key="item.dicCode"
                      :label="item.dicName"
                      :value="item.dicCode"
                    />
                  </el-select>
                </span>
                <span class="ml-2">
                  产权单位：
                  <el-cascader
                    v-model="data.ownershipUnitCode"
                    placeholder="请选择产权单位"
                    :options="companyOptions"
                    :props="{
                      checkStrictly: true,
                      value: 'dicCode',
                      label: 'dicName',
                    }"
                    clearable
                  />
                </span>
              </el-row>
            </template>
          </el-tree>
        </section-group>

        <div class="flex justify-center mt-6">
          <el-button @click="router.push('/asset/management/building-floor')">返回</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="insertLoading">确定</el-button>
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
