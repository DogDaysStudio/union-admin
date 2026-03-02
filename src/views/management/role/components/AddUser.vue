<script setup lang="ts">
import {ref, useTemplateRef} from 'vue'
import {useRequest} from 'vue-request'
import {useForm} from '@/common/hooks'
import {iamAuthRoleGet} from '@/service/api/iamAuth'
import {iamAuthUserList} from '@/service/api/imaAuthUser'

defineEmits<{
  (e: 'submit', userList: AuthUserVO[]): void
}>()

defineExpose({
  show(userIdList: string[]) {
    addUserForm.userIdList = userIdList
    addUserDialogVisible.value = true
  },
  hide() {
    addUserDialogVisible.value = false
  },
})

const addUserDialogVisible = ref(false)
const addUserFormRef = useTemplateRef('addUserFormRef')
const [addUserForm, resetAddUserForm] = useForm({} as AuthRoleUpsertDTO, addUserFormRef)
const getRole = useRequest(iamAuthRoleGet)

const {data: employeeList} = useRequest(iamAuthUserList, {manual: false})
</script>

<template>
  <el-dialog v-model="addUserDialogVisible" title="添加人员" @closed="resetAddUserForm">
    <el-form ref="addUserFormRef" :model="addUserForm">
      <el-form-item prop="roleName">
        <el-input v-model="addUserForm.roleName" placeholder="请输入" disabled />
      </el-form-item>

      <el-form-item prop="userIdList">
        <el-transfer
          v-loading="getRole.loading.value"
          class="full"
          v-model="addUserForm.userIdList"
          :data="employeeList?.data"
          :titles="['选择员工', '已选员工']"
          :props="{label: 'certName', key: 'userId'}"
          filterable
          :filter-method="(query, item) => item.certName.includes(query)"
        ></el-transfer>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="
            $emit(
              'submit',
              employeeList?.data.filter(item => addUserForm.userIdList.includes(item.userId))
            )
          "
          :loading="getRole.loading.value"
        >
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
