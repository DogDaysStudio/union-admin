<script setup lang="ts">
import {iamAuthSsoTicket} from '@/service/api/iamAuth'
import {onMounted, ref} from 'vue'

const appId = 'OMS'
const url = 'https://szaj-uat.anjueasy.com/sso'
// const url = 'http://127.0.0.1:3000/sso'

const source = ref('')

onMounted(async () => {
  const {data} = await iamAuthSsoTicket({appId})
  if (data) {
    source.value = `${url}?appId=${appId}&ticket=${data}`
  }
})
</script>

<template>
  <iframe :src="source" frameborder="0" width="100%" height="100%"></iframe>
</template>
