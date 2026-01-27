<script setup lang="ts">
import {ref, reactive, onMounted, onUnmounted, useTemplateRef} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {iamAuth} from '@/service/api/iamAuth'
import {ElMessage} from 'element-plus'
import {useRequest} from 'vue-request'
import {useUserStore} from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const appId = route.query.appId as string | undefined
const redirectUrl = route.query.redirectUrl as string | undefined

// 表单数据
const formData = reactive<AuthLoginDTO>({
  loginType: 'PWD',
  loginAccount: '',
  loginPwd: '',
  imgCode: '',
  imgId: '',
  verifyCode: '',
})

// 验证码登录相关
const countDown = ref(0)
const timer = ref<number | null>(null)

// 表单验证规则
const formRules = {
  loginAccount: [
    {required: true, message: '请输入用户名或手机号'},
    {
      validator: (rule: any, value: string, callback: any) => {
        const regex =
          formData.loginType === 'SMS' ? /^1[3-9]\d{9}$/ : /^[a-zA-Z0-9_]{4,16}$|^1[3-9]\d{9}$/
        if (!regex.test(value)) {
          callback(
            new Error(
              formData.loginType === 'SMS'
                ? '请输入正确的手机号格式'
                : '请输入正确的用户名或手机号格式'
            )
          )
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  loginPwd: [
    {
      required: formData.loginType === 'PWD',
      message: '请输入密码',
      trigger: 'blur',
    },
    {
      min: 6,
      message: '密码长度不能少于6位',
      trigger: 'blur',
      validator: (rule: any, value: string, callback: any) => {
        if (formData.loginType === 'PWD' && value.length < 6) {
          callback(new Error('密码长度不能少于6位'))
        } else {
          callback()
        }
      },
    },
  ],
  imgCode: [
    {
      required: formData.loginType === 'PWD' || formData.loginType === 'SMS',
      message: '请输入图形验证码',
      trigger: 'blur',
    },
  ],
  verifyCode: [
    {
      required: formData.loginType === 'SMS',
      message: '请输入短信验证码',
      trigger: 'blur',
    },
    {
      validator: (rule: any, value: string, callback: any) => {
        if (formData.loginType === 'SMS' && !/^\d{6}$/.test(value)) {
          callback(new Error('请输入6位数字验证码'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

// 图片验证码相关
const imgSrc = ref('')
// const loading = ref(false)
const formRef = useTemplateRef('formRef')

const reqImgCode = useRequest(iamAuth.iamAuthGetImgCode, {
  throttleInterval: 500,
})
// 生成图片验证码
const generateCaptcha = async () => {
  try {
    const {data} = await reqImgCode.runAsync()
    formData.imgId = data.imgId
    imgSrc.value = data.img
  } catch (error) {
    console.error('获取验证码失败', error)
    ElMessage.error('获取验证码失败，请稍后重试')
  }
}

const {runAsync, loading} = useRequest(
  async (payload: Parameters<typeof iamAuth.iamAuthLogin>[0]) => {
    await iamAuth.iamAuthLogin(payload)

    await iamAuth.iamAuthInfo()
  }
)

// 附带 ticket 跳转至指定页面
const redirectWithTicket = async (appId: string, redirectUrl: string) => {
  const {data} = await iamAuth.iamAuthSsoTicket({appId})
  const url = new URL(redirectUrl)
  url.searchParams.set('ticket', data)
  location.href = url.toString()
}

// 登录方法
const handleLogin = async () => {
  await formRef.value.validate()

  if (formData.loginType === 'PWD') {
    await runAsync({
      loginType: 'PWD',
      loginAccount: formData.loginAccount,
      loginPwd: formData.loginPwd,
      imgId: formData.imgId,
      imgCode: formData.imgCode,
    })
  } else if (formData.loginType === 'SMS') {
    await runAsync({
      loginType: 'SMS',
      loginAccount: formData.loginAccount,
      verifyCode: formData.verifyCode,
      imgId: formData.imgId,
      imgCode: formData.imgCode,
    })
  }

  if (appId && redirectUrl) {
    await redirectWithTicket(appId, redirectUrl)
  } else {
    // 跳转至首页
    router.push('/')
  }
  ElMessage.success('登录成功')
}

// 获取短信验证码
const getVerifyCode = async () => {
  if (!formData.loginAccount.trim()) {
    ElMessage.error('请输入手机号')
    return
  }

  const phoneRegex = /^1[3-9]\d{9}$/
  if (!phoneRegex.test(formData.loginAccount)) {
    ElMessage.error('请输入正确的手机号')
    return
  }

  // 调用发送验证码API
  await iamAuth.iamAuthSendVerifyCode({mobile: formData.loginAccount})
  ElMessage.success('验证码发送成功')

  // 开始倒计时
  countDown.value = 60
  timer.value = setInterval(() => {
    countDown.value--
    if (countDown.value <= 0) {
      clearInterval(timer.value!)
      timer.value = null
    }
  }, 1000)
}

// 忘记密码
const handleForgotPassword = () => {
  // 这里可以实现忘记密码的逻辑，目前只是一个占位符
  ElMessage.info('忘记密码功能暂未实现')
}

// 页面加载时生成验证码
onMounted(() => {
  if (userStore.token && appId && redirectUrl) {
    redirectWithTicket(appId, redirectUrl)
  } else {
    generateCaptcha()
  }
})

// 清理定时器
onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})
</script>

<template>
  <div class="flex h-screen bg-primary">
    <!-- 左侧二维码区域 -->
    <div class="hidden lg:flex w-1/2 items-center justify-center bg-primary text-white p-8">
      <div class="text-center">
        <h1 class="text-2xl font-bold mb-4">深安居运营管理平台</h1>
        <p class="text-sm text-blue-100 mb-6">Enterprise Data Service Solutions</p>
        <div class="bg-white p-6 rounded-lg shadow-lg">
          <p class="text-primary mb-4">打开运营一体化APP</p>
          <p class="text-primary mb-4">在【我的】页打开右上角扫一扫</p>
          <div class="flex justify-center">
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f5f5f5'/%3E%3Cpath d='M100 50L125 75L100 100L75 75z' fill='%233b82f6'/%3E%3Cpath d='M100 100L125 125L100 150L75 125z' fill='%233b82f6'/%3E%3C/svg%3E"
              alt="登录二维码"
              class="w-48 h-48"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧登录表单区域 -->
    <div class="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-800">用户登录 / USER LOGIN</h2>
        </div>

        <!-- 登录类型切换 -->
        <div class="flex mb-6">
          <el-button
            type="text"
            :class="[
              'flex-1 py-2 text-center font-medium',
              formData.loginType === 'PWD'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-primary',
            ]"
            @click="formData.loginType = 'PWD'"
          >
            密码登陆
          </el-button>
          <el-button
            type="text"
            :class="[
              'flex-1 py-2 text-center font-medium',
              formData.loginType === 'SMS'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-primary',
            ]"
            @click="formData.loginType = 'SMS'"
          >
            验证码登陆
          </el-button>
        </div>

        <!-- 登录表单 -->
        <el-form ref="formRef" :model="formData" :rules="formRules" label-position="top">
          <!-- 用户名/手机号输入框 -->
          <el-form-item prop="loginAccount">
            <el-input
              v-model="formData.loginAccount"
              :placeholder="formData.loginType === 'PWD' ? '请输入用户名或手机号' : '请输入手机号'"
              size="large"
            />
          </el-form-item>

          <!-- 密码输入框 - 仅密码登录时显示 -->
          <el-form-item prop="loginPwd" v-if="formData.loginType === 'PWD'">
            <el-input
              v-model="formData.loginPwd"
              placeholder="请输入登录密码"
              show-password
              size="large"
            />
          </el-form-item>

          <!-- 图形验证码 - 密码登录和验证码登录时都显示 -->
          <el-form-item
            prop="imgCode"
            v-if="formData.loginType === 'PWD' || formData.loginType === 'SMS'"
          >
            <el-input
              v-model="formData.imgCode"
              placeholder="请输入图形验证码"
              size="large"
              class="flex-1"
            >
              <template #suffix>
                <!-- 图形验证码 -->
                <img
                  :src="imgSrc"
                  alt="图形验证码"
                  class="w-full h-9 cursor-pointer hover:opacity-90"
                  @click="generateCaptcha"
                />
              </template>
            </el-input>
          </el-form-item>

          <!-- 短信验证码 - 仅验证码登录时显示 -->
          <el-form-item prop="verifyCode" v-if="formData.loginType === 'SMS'">
            <el-input
              v-model="formData.verifyCode"
              placeholder="请输入6位短信验证码"
              size="large"
              class="flex-1"
            >
              <template #append>
                <el-button
                  type="primary"
                  size="large"
                  @click="getVerifyCode"
                  :disabled="countDown > 0"
                >
                  {{ countDown > 0 ? `${countDown}秒后重新获取` : '获取验证码' }}
                </el-button>
              </template>
            </el-input>
          </el-form-item>

          <!-- 登录按钮 -->
          <el-form-item>
            <el-button
              type="primary"
              @click="handleLogin"
              size="large"
              class="w-full"
              :loading="loading"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>

        <!-- 其他登录选项 -->
        <div class="mt-6 flex justify-between items-center text-sm">
          <div>
            <span class="text-gray-500">没有账号，联系企业管理员开通账号</span>
          </div>
          <el-button type="text" @click="handleForgotPassword" class="text-primary hover:underline">
            忘记密码
          </el-button>
        </div>

        <!-- 其他登录方式 -->
        <div class="mt-8">
          <div class="flex items-center justify-center">
            <div class="flex-1 h-px bg-gray-300"></div>
            <span class="px-3 text-gray-500 text-sm">其他登录方式</span>
            <div class="flex-1 h-px bg-gray-300"></div>
          </div>
          <div class="mt-4 flex justify-center space-x-6">
            <el-button type="text" class="text-gray-400 hover:text-primary transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                />
              </svg>
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
