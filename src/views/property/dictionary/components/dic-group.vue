<script setup lang="ts">
import {Plus} from '@element-plus/icons-vue'
import {nextTick, onMounted, ref} from 'vue'
import {pmsPropertySopCategoryInsert} from '@/service/api/pmsProperty'
import {useRequest} from 'vue-request'
import Sortable from 'sortablejs'

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
const categoryMenuRef = ref<InstanceType<typeof HTMLDivElement>>()
const isEditingCategory = ref(false)
const editCategoryId = ref('')

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
  activeCategoryId.value = id
  emit('change-category', id)
}

const initDraggable = () => {
  const dom = categoryMenuRef.value

  Sortable.create(dom, {
    animation: 150,
    handle: '.handle-drag',
    async onEnd(evt) {
      const {oldIndex, newIndex} = evt
      console.log({oldIndex, newIndex})
      console.log(categoryList)
    },
  })
}

onMounted(() => {
  initDraggable()
})

defineExpose({
  changeCategory: handleSopCategoryClick,
})
</script>

<template>
  <div class="flex flex-col gap-3">
    <div>
      <div class="flex flex-col gap-3" ref="categoryMenuRef">
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
          </div>
        </div>
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
      字典
    </el-button>
  </div>
</template>
