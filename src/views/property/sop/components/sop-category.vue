<script setup lang="ts">
import {ref, watch} from 'vue'

const {sopCategory} = defineProps<{
  sopCategory: PmsSopCategoryVO
  isActive: boolean
}>()

const categoryName = ref(sopCategory.categoryName)

// const handleEnter = () => {
//   console.log(sopCategory.categoryName)
// }

// const handleFocus = () => {
//   console.log('focus')
// }

// const handleBlur = () => {
//   console.log('blur')
// }

watch(
  () => sopCategory.categoryName,
  newVal => {
    categoryName.value = newVal
  }
)
</script>

<template>
  <div
    class="flex rounded-sm p-3 cursor-pointer transition-all duration-300"
    :class="{'bg-blue-50': isActive, 'bg-gray-50 hover:bg-blue-50': !isActive}"
  >
    <div class="flex-1 p-1 rounded-sm">
      <!-- <input type="text" class="flex-1 border-none focus:outline-none" v-model="categoryName" @keyup.enter="handleEnter" @focus="handleFocus" @blur="handleBlur" /> -->
      <span>{{ categoryName }}</span>
    </div>
  </div>
</template>
