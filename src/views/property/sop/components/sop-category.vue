<script setup lang="ts">
import {EditPen, Rank, Plus} from '@element-plus/icons-vue'
import {computed, nextTick, ref} from 'vue'
import {pmsPropertySopCategoryInsert} from '@/service/api/pmsProperty'
import {useRequest} from 'vue-request'

const {categoryList = [], sopId} = defineProps<{
  categoryList: PmsSopCategoryVO[]
  sopId: string
}>()

const emit = defineEmits<{
  (e: 'add-category'): void
  (e: 'change-category', id: string): void
}>()

const newCategoryName = ref('')
const isAddingCategory = ref(false)
const activeCategoryId = ref('')
const inputRef = ref<InstanceType<typeof ElInput>>()

const isEmpty = computed(() => categoryList?.length === 0)

const {runAsync: runSopCategoryInsert, loading: sopCategoryInsertLoading} = useRequest(
  pmsPropertySopCategoryInsert
)

const handleAddSopCategory = () => {
  isAddingCategory.value = true
  nextTick(() => {
    inputRef.value?.focus()
  })
}

const handleSopCategorySubmit = async () => {
  if (!newCategoryName.value) {
    isAddingCategory.value = false
    return
  }
  await runSopCategoryInsert({
    sopId: sopId,
    categoryName: newCategoryName.value,
  })
  emit('add-category')
  isAddingCategory.value = false
  newCategoryName.value = ''
}

const handleSopCategoryClick = (id: string) => {
  emit('change-category', id)
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div v-if="!isEmpty" class="flex flex-col gap-3">
      <div
        v-for="item in categoryList"
        :key="item.id"
        @click="handleSopCategoryClick(item.id)"
        class="cursor-pointer rounded-sm px-3 p-2 text-sm group flex items-center justify-between"
        :class="{
          'bg-sky-100': activeCategoryId === item.id,
          'bg-gray-100 hover:bg-gray-100': activeCategoryId !== item.id,
        }"
      >
        <span>{{ item.categoryName }}</span>
        <el-button class="size-8 opacity-0 group-hover:opacity-100" text :icon="EditPen" />
        <el-button class="size-8 opacity-0 group-hover:opacity-100 ml-auto!" text :icon="Rank" />
      </div>
    </div>

    <!-- <div v-else class="flex justify-center items-center bg-gray-50 rounded-sm p-3 text-sm h-26 text-gray-400">
      暂无分类
    </div> -->

    <el-input
      ref="inputRef"
      v-model="newCategoryName"
      placeholder="请输入分类名称"
      v-if="isAddingCategory"
      @keyup.enter="handleSopCategorySubmit"
      :disabled="sopCategoryInsertLoading"
      @blur="handleSopCategorySubmit"
    />

    <el-button
      :icon="Plus"
      @click="handleAddSopCategory"
      class="w-full"
      :disabled="isAddingCategory || sopCategoryInsertLoading"
    >
      增加SOP分类
    </el-button>
  </div>
</template>
