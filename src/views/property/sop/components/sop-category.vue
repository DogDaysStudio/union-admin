<script setup lang="ts">
import {EditPen, Rank, Plus} from '@element-plus/icons-vue'
import {computed, nextTick, ref} from 'vue'
import {pmsPropertySopCategoryInsert, pmsPmsSopCategoryUpdate} from '@/service/api/pmsProperty'
import {useRequest} from 'vue-request'

const {categoryList = [], sopId} = defineProps<{
  categoryList: PmsSopCategoryVO[]
  sopId: string
}>()

const emit = defineEmits<{
  (e: 'add-category'): void
  (e: 'change-category', id: string): void
  (e: 'update-category', id: string): void
}>()

const newCategoryName = ref('')
const isAddingCategory = ref(false)
const activeCategoryId = ref('')
const inputRef = ref<InstanceType<typeof ElInput>>()
const categoryRef = ref<InstanceType<typeof ElInput>>()

const isEditingCategory = ref(false)
const editCategoryId = ref('')
const editCategoryName = ref('')

const isEmpty = computed(() => categoryList?.length === 0)

const {runAsync: runSopCategoryInsert, loading: sopCategoryInsertLoading} = useRequest(
  pmsPropertySopCategoryInsert
)

const {runAsync: runSopCategoryUpdate} = useRequest(pmsPmsSopCategoryUpdate)

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
  activeCategoryId.value = id
  emit('change-category', id)
}

const handleEditSopCategory = (item: PmsSopCategoryVO) => {
  isEditingCategory.value = true
  editCategoryId.value = item.id
  editCategoryName.value = item.categoryName
  nextTick(() => {
    categoryRef.value?.[0]?.focus()
  })
}

const handleCancelEditSopCategory = () => {
  isEditingCategory.value = false
  editCategoryId.value = ''
  editCategoryName.value = ''
}

const handleEditSopCategorySubmit = async () => {
  if (!editCategoryName.value) {
    handleCancelEditSopCategory()
    return
  }
  await runSopCategoryUpdate({
    categoryId: editCategoryId.value,
    categoryName: editCategoryName.value,
  })
  handleCancelEditSopCategory()
  emit('update-category', editCategoryId.value)
}

defineExpose({
  changeCategory: handleSopCategoryClick,
})
</script>

<template>
  <div class="flex flex-col gap-3">
    <div v-if="!isEmpty" class="flex flex-col gap-3">
      <div
        v-for="item in categoryList"
        :key="item.id"
        @click="handleSopCategoryClick(item.id)"
        class="cursor-pointer rounded-sm px-3 p-2 text-sm/8 group transition-all duration-300"
        :class="{
          'bg-sky-100': activeCategoryId === item.id,
          'bg-gray-100 hover:bg-gray-100': activeCategoryId !== item.id,
        }"
      >
        <div class="flex items-center justify-between w-full" v-if="editCategoryId !== item.id">
          <span>{{ item.categoryName }}</span>
          <el-button
            link
            class="size-8 opacity-0 group-hover:opacity-100"
            text
            :icon="EditPen"
            @click.stop="handleEditSopCategory(item)"
          />
          <el-button
            link
            class="size-8 opacity-0 group-hover:opacity-100 ml-auto!"
            text
            :icon="Rank"
          />
        </div>
        <el-input
          ref="categoryRef"
          v-model="editCategoryName"
          v-else
          @blur="handleEditSopCategorySubmit"
          @keyup.enter="handleSopCategorySubmit"
        />
      </div>
    </div>

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
      :disabled="isAddingCategory || sopCategoryInsertLoading || isEditingCategory"
    >
      增加SOP分类
    </el-button>
  </div>
</template>
