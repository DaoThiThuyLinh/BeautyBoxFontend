<template>
  <BaseDialog
    name="dialog-forgot-password"
    title="QUÊN MẬT KHẨU"
    width="500"
    title-btn-primary="Tiếp tục"
    :is-loading="isLoading"
    class-btn-primary="w-32"
    @open="refFormInputEmail?.resetFields()"
    @cancel="setOpenDialog('dialog-forgot-password', false)"
    @save="handleForgotPassword"
  >
    <ElForm v-if="step === 1" ref="refFormInputEmail" label-position="top" :model="emailInput" :rules="ruleInputEmail">
      <ElFormItem prop="mail" label="Email" class="!mb-0">
        <ElInput
          v-model="emailInput.mail"
          placeholder="Vui lòng nhập email"
          type="email"
          @keydown.enter.prevent="handleForgotPassword"
        />
      </ElFormItem>
    </ElForm>

    <div v-if="step === 2" class="flex flex-col items-center justify-center space-y-4">
      <OtpInput @complete="handleOtpComplete" />
      <p v-if="!remainingSeconds" class="cursor-pointer text-[#0151fc] underline" @click="resendOtp">Gửi lại mã xác thực</p>
      <span class="countdown-time text-base font-medium" :class="{ 'text-[var(--color-text-error)]': isAlmostExpired }">
        {{ formattedTime }}
      </span>
    </div>
    <ElForm
      v-if="step === 3"
      ref="refFormChangePassword"
      label-position="top"
      :model="formChangePassword"
      :rules="rulesChangePassword"
    >
      <ElFormItem prop="password" label="Mật khẩu">
        <ElInput v-model="formChangePassword.password" type="password" placeholder="Vui lòng nhập mật khẩu" show-password />
      </ElFormItem>
      <ElFormItem prop="passwordConfirm" label="Nhập lại mật khẩu">
        <ElInput
          v-model="formChangePassword.passwordConfirm"
          type="password"
          placeholder="Vui lòng nhập lại mật khẩu"
          show-password
          @keydown.enter.prevent="handleForgotPassword"
        />
      </ElFormItem>
    </ElForm>
  </BaseDialog>
</template>

<script setup lang="ts">
  import { apiAuth } from '@/services'
  import type { FormInstance, FormItemRule } from 'element-plus'
  import type { Arrayable } from 'element-plus/es/utils/typescript.mjs'

  import { useBaseStore } from '@/stores/base.store'

  import OtpInput from '../base/otp/OtpInput.vue'

  const { setOpenDialog } = useBaseStore()

  const emit = defineEmits<{
    login: []
  }>()

  const remainingSeconds = ref(90)
  let intervalId: number | null = null
  const isLoading = ref(false)

  const refFormInputEmail = ref<FormInstance | null>(null)
  const refFormChangePassword = ref<FormInstance | null>(null)
  const step = ref(1)
  const emailInput = ref({
    mail: ''
  })

  const formChangePassword = ref({
    password: '',
    passwordConfirm: ''
  })

  const validateConfirmPassword = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
    if (value === '') {
      callback(new Error('Vui lòng nhập lại mật khẩu'))
    } else if (value !== formChangePassword.value.password) {
      callback(new Error('Mật khẩu không khớp'))
    } else {
      callback()
    }
  }

  const rulesChangePassword: Partial<Record<string, Arrayable<FormItemRule>>> = {
    password: [{ required: true, message: 'Vui lòng nhập mật khẩu', trigger: ['blur', 'change'] }],
    passwordConfirm: [{ required: true, validator: validateConfirmPassword, trigger: ['blur', 'change'] }]
  }

  const ruleInputEmail: Partial<Record<string, Arrayable<FormItemRule>>> = {
    mail: [
      {
        required: true,
        message: 'Vui lòng nhập email',
        trigger: ['blur', 'change']
      },
      {
        type: 'email',
        message: 'Email không hợp lệ',
        trigger: ['blur', 'change']
      }
    ]
  }
  const isAlmostExpired = computed(() => {
    return remainingSeconds.value <= 10
  })

  const formattedTime = computed(() => {
    const minutes = Math.floor(remainingSeconds.value / 60)
    const seconds = remainingSeconds.value % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  })

  // Start the timer interval
  const startTimer = () => {
    if (intervalId !== null) return

    intervalId = window.setInterval(() => {
      if (remainingSeconds.value > 0) {
        remainingSeconds.value--
      }
    }, 1000)
  }

  const handleForgotPassword = async () => {
    if (step.value === 1) {
      getOtp()
    } else if (step.value === 3) {
      forgotPassword()
    }
  }

  const getOtp = async () => {
    const valid = await refFormInputEmail.value?.validate()
    if (!valid) return
    isLoading.value = true
    try {
      await apiAuth.getOtp(emailInput.value)
      ElNotification({
        title: 'Success',
        message: 'Đã gửi mã xác thực đến email của bạn',
        type: 'success'
      })
      step.value = 2
      startTimer()
    } catch (error) {
      console.error(error)
    }
    isLoading.value = false
  }

  const resendOtp = async () => {
    try {
      await apiAuth.getOtp(emailInput.value)
      ElNotification({
        title: 'Success',
        message: 'Đã gửi mã xác thực đến email của bạn',
        type: 'success'
      })
      remainingSeconds.value = 90
      startTimer()
    } catch (error) {
      console.error(error)
    }
  }

  const handleOtpComplete = async (otp: string) => {
    isLoading.value = true
    try {
      await apiAuth.verifyOtp({
        mail: emailInput.value.mail,
        code: otp
      })
      ElNotification({
        title: 'Success',
        message: 'Xác thực thành công',
        type: 'success'
      })
      step.value = 3
    } catch (error) {
      console.error(error)
    }
    isLoading.value = false
  }

  const forgotPassword = async () => {
    const valid = refFormChangePassword.value?.validate()
    if (!valid) return
    isLoading.value = true
    try {
      await apiAuth.forgotPassword({
        mail: emailInput.value.mail,
        password: formChangePassword.value.password,
        passwordConfirm: formChangePassword.value.passwordConfirm
      })
      ElNotification({
        title: 'Success',
        message: 'Đặt lại mật khẩu thành công',
        type: 'success'
      })
      setOpenDialog('dialog-forgot-password', false)
      emit('login')
    } catch (error) {
      console.log(error)
    }
    isLoading.value = false
  }
</script>

<style scoped></style>
