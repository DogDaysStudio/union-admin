<script setup lang="ts">
import {reactive, onMounted} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {amsAssetParkingGet} from '@/service/api/amsAsset'
import {useRequest} from 'vue-request'
import UniUpload from '@/components/upload/UploadFile.vue'

const router = useRouter()
const route = useRoute()

// 停车场详情
const {runAsync: parkingGet} = useRequest(amsAssetParkingGet)

const formData = reactive({} as AssetParkingVO)

onMounted(() => getDetail())

const getDetail = async (): Promise<void> => {
  const {data: parkingDetail} = await parkingGet({parkingId: route.params.parkingId})
  const cloneData = JSON.parse(JSON.stringify(parkingDetail))
  if (cloneData?.parkingRegions) {
    cloneData.parkingRegions.forEach(item => {
      if (item?.regionMapFileModel?.id) {
        item.imgList = [
          {
            url: item?.regionMapFileModel.path, // 图片预览地址（必选）
            uid: Date.now() + Math.floor(Math.random() * 1000), // 唯一标识（用接口返回的id，必选）
            name: item?.regionMapFileModel.name, // 文件名
            status: 'success' as const, // 标记为已上传成功
            size: item?.regionMapFileModel.size, // 文件大小（可选，用于显示）
            bizData: {
              id: item?.regionMapFileModel.id,
            },
          },
        ]
      }
    })
  }
  Object.assign(formData, cloneData)
}
</script>

<template>
  <el-card>
    <template #header>
      <div class="flex justify-between">详情</div>
    </template>
    <div class="mx-auto">
      <el-form :model="formData" ref="formRef" label-position="top">
        <section-group title="基本信息" inline>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="所属项目" required>
                <span>{{ formData.projectName || '-' }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="停车场名称" required>
                <span>{{ formData.parkingName || '-' }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="停车场位置" required>
                <span>{{ formData.parkingLocationName || '-' }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="停车方式" required>
                <span>{{ formData.parkingMethodName || '-' }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="车位类别" required>
                <span>{{ formData.parkingCategoryName || '-' }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="停车位数" required>
                <span>{{ formData.parkingSpaceQuantity || '-' }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </section-group>

        <section-group title="车位区域信息" inline>
          <el-table :data="formData.parkingRegions" border>
            <el-table-column label="序号" type="index" width="60" />
            <el-table-column label="区域类别" prop="regionCategoryName" />
            <el-table-column label="车位区域" prop="regionName" />
            <el-table-column label="区域地图" prop="regionMapFileModel">
              <template #default="{row}">
                <uni-upload
                  disabled
                  v-model:file-list="row.imgList"
                  :limit="1"
                  :accept="'.jpg,.png,.pdf'"
                />
              </template>
            </el-table-column>
          </el-table>
        </section-group>

        <div class="flex justify-center mt-6">
          <el-button type="primary" @click="router.push('/asset/management/parking')">
            返回
          </el-button>
        </div>
      </el-form>
    </div>
  </el-card>
</template>
