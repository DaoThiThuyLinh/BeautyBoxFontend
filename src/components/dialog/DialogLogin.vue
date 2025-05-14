<template>
  <BaseDialog
    name="dialog-login"
    :is-show-footer="false"
    :is-show-header="false"
    header-class="hidden-header-dialog"
    width="500"
    @open="refFormLogin?.resetFields()"
  >
    <div class="group flex cursor-pointer justify-end" @click="setOpenDialog('dialog-login', false)">
      <BaseIcon name="close" :size="16" class="text-[var(--color-secondary)] group-hover:text-[var(--color-icon-hover)]" />
    </div>
    <div class="text-text-primary mx-auto w-5/6">
      <h1 class="text-center text-[26px] font-bold">ĐĂNG NHẬP</h1>
      <p class="mx-auto mt-4 mb-5 w-72 text-center text-sm font-medium">
        Bạn chưa có tài khoản?
        <span class="cursor-pointer text-[#0151fc] underline" @click="handleRegister('OPEN_DIALOG')">Đăng kí ngay.</span>
      </p>
      <ElForm ref="refFormLogin" label-position="top" :model="formLogin" :rules="rulesLoginForm">
        <ElFormItem prop="email" label="Email">
          <ElInput v-model="formLogin.email" placeholder="Vui lòng nhập email" type="email" />
        </ElFormItem>
        <ElFormItem prop="password" label="Mật khẩu">
          <ElInput
            v-model="formLogin.password"
            type="password"
            placeholder="Vui lòng nhập mật khẩu"
            show-password
            @keyup.enter="handleLogin('SUBMIT')"
          />
        </ElFormItem>
      </ElForm>
      <p class="mb-[18px] cursor-pointer text-end text-[#0151fc] underline" @click="handleForgotPassword">Quên mật khẩu.</p>
      <BaseButton type="primary" :is-loading="isLoading" @click="handleLogin('SUBMIT')">
        <span class="font-bold">ĐĂNG NHẬP</span>
      </BaseButton>
      <p class="mx-auto my-6 text-center text-xs font-semibold">*Vui lòng không hủy đơn hàng khi đã thanh toán*</p>
      <p class="text-center text-xs text-[#5aa000]">
        Đăng nhập ngay để mua sắm dễ dàng hơn, sử dụng những tiện ích mới nhất và tận hưởng thêm nhiều ưu đãi độc quyền dành riêng
        cho thành viên Beauty Box.
      </p>
    </div>
  </BaseDialog>

  <DialogForgotPassword @login="setOpenDialog('dialog-login')" />
</template>

<script setup lang="ts">
  import { apiAuth } from '@/services'
  import type { FormInstance, FormItemRule } from 'element-plus'
  import type { Arrayable } from 'element-plus/es/utils/typescript.mjs'

  import { useAuthStore } from '@/stores/auth.store'
  import { useBaseStore } from '@/stores/base.store'

  import DialogForgotPassword from './DialogForgotPassword.vue'

  const { setOpenDialog } = useBaseStore()
  const { login, setBearerToken } = useAuthStore()
  const refFormLogin = ref<FormInstance | null>(null)
  const refFormRegister = ref<FormInstance | null>(null)
  const isLoading = ref(false)

  const formRegister = ref({
    name: '',
    password: '',
    passwordConfirm: '',
    gender: '',
    email: '',
    phone: ''
  })
  const formLogin = ref({
    password: '',
    email: ''
  })

  const rulesLoginForm: Partial<Record<string, Arrayable<FormItemRule>>> = {
    email: [
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
    ],
    password: [{ required: true, message: 'Vui lòng nhập mật khẩu', trigger: ['blur', 'change'] }]
  }

  const handleRegister = async (type: 'SUBMIT' | 'OPEN_DIALOG') => {
    if (type === 'OPEN_DIALOG') {
      refFormRegister.value?.resetFields()
      setOpenDialog('dialog-login', false)
      setOpenDialog('dialog-register')
    } else {
      const valid = await refFormRegister.value?.validate()
      if (!valid) return
      isLoading.value = true
      try {
        await apiAuth.register(formRegister.value)
        ElNotification({
          title: 'Success',
          message: 'Tạo tài khoản thành công',
          type: 'success'
          // position: 'bottom-right'
        })
        setOpenDialog('dialog-register', false)
        setOpenDialog('dialog-login', true)
        formRegister.value = {
          name: '',
          password: '',
          passwordConfirm: '',
          gender: '',
          email: '',
          phone: ''
        }
      } catch (error) {
        console.log(error)
      }
      isLoading.value = false
    }
  }

  const handleLogin = async (type: 'SUBMIT' | 'OPEN_DIALOG') => {
    if (type === 'OPEN_DIALOG') {
      refFormLogin.value?.resetFields()
      setOpenDialog('dialog-login')
    } else {
      const valid = await refFormLogin.value?.validate()
      if (!valid) return
      isLoading.value = true
      try {
        const { tokenContent, roleName } = await login(formLogin.value)
        setBearerToken(tokenContent)
        ElNotification({
          title: 'Success',
          message: `Bạn đăng nhập thành công với vai trò là ${roleName === 'ROLE_USER' ? 'khách hàng' : 'quản trị viên'}`,
          type: 'success'
          // position: 'bottom-right'
        })
        setOpenDialog('dialog-login', false)
        formLogin.value = {
          password: '',
          email: ''
        }
      } catch (error) {
        console.log(error)
      }
      isLoading.value = false
    }
  }

  const handleForgotPassword = () => {
    setOpenDialog('dialog-login', false)
    setOpenDialog('dialog-forgot-password')
  }
</script>

<style scoped></style>
