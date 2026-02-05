<script setup lang="ts">
import {reactive, onMounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useRequest} from 'vue-request'
import {amsAssetFloorGet} from '@/service/api/amsAsset'

const route = useRoute()
const router = useRouter()

const getFloor = useRequest(amsAssetFloorGet, {
  throttleInterval: 500,
})

const formData = reactive({} as AssetFloorVO)

onMounted(() => getOptions())

const getOptions = async (): Promise<void> => {
  const {data: floorDetail} = await getFloor.runAsync({floorId: route.params.id})
  Object.assign(formData, floorDetail)
}

const handleSubmit = () => router.push('/asset/management/building-floor')
</script>

<template>
  <el-card>
    <template #header>
      <div class="flex justify-between">楼层详情</div>
    </template>
    <div class="mx-auto">
      <el-form
        :model="formData"
        ref="formRef"
        label-width="80px"
        label-position="top"
        :validate-on-rule-change="false"
        :validate-on-init="false"
      >
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="楼层名称" required>
              <span>{{ formData.floorName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="楼层编码" required>
              <span>{{ formData.floorId }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="层高（m）" required>
              <span>{{ formData.floorHeight }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属项目" required>
              <span>{{ formData.projectName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目编码" required>
              <span>{{ formData.projectId }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属楼栋" required>
              <span>{{ formData.assetName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="楼栋编码" required>
              <span>{{ formData.assetId }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产权单位" required>
              <span>{{ formData.ownershipUnitName }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <div class="flex justify-center mt-6">
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </el-form>
    </div>
  </el-card>
</template>
