<template>
  <BaseDialog
    name="dialog-register"
    :is-show-footer="false"
    :is-show-header="false"
    header-class="hidden-header-dialog"
    width="800"
  >
    <div class="group flex cursor-pointer justify-end" @click="setOpenDialog('dialog-register', false)">
      <BaseIcon name="close" :size="16" class="text-[var(--color-secondary)] group-hover:text-[var(--color-icon-hover)]" />
    </div>
    <div class="text-text-primary">
      <h1 class="mb-6 text-center text-[26px] font-bold">ĐĂNG KÍ</h1>
      <ElForm
        ref="refFormRegister"
        class="grid grid-cols-2 gap-x-10"
        label-position="top"
        :model="formRegister"
        :rules="rulesRegisterForm"
      >
        <ElFormItem label="Tên người dùng" prop="name">
          <ElInput v-model="formRegister.name" placeholder="Vui lòng nhập tên người dùng" />
        </ElFormItem>
        <ElFormItem label="Giới tính" prop="gender">
          <BaseSelect v-model="formRegister.gender" placeholder="Vui lòng chọn giới tính" teleported class="w-full">
            <ElOption v-for="item in GENDER" :key="item.value" :label="item.label" :value="item.value" />
          </BaseSelect>
        </ElFormItem>
        <ElFormItem prop="email" label="Email">
          <ElInput v-model="formRegister.email" placeholder="Vui lòng nhập email" type="email" />
        </ElFormItem>
        <ElFormItem label="Số điện thoại" prop="phone">
          <ElInput v-model="formRegister.phone" placeholder="Vui lòng nhập số điện thoại" />
        </ElFormItem>
        <ElFormItem prop="password" label="Mật khẩu">
          <ElInput v-model="formRegister.password" type="password" placeholder="Vui lòng nhập mật khẩu" show-password />
        </ElFormItem>
        <ElFormItem prop="passwordConfirm" label="Nhập lại mật khẩu">
          <ElInput
            v-model="formRegister.passwordConfirm"
            type="password"
            placeholder="Vui lòng nhập lại mật khẩu"
            show-password
            @keyup.enter="handleRegister('SUBMIT')"
          />
        </ElFormItem>
      </ElForm>
      <BaseButton type="primary" :is-loading="isLoading" @click="handleRegister('SUBMIT')">
        <span class="font-bold">ĐĂNG KÍ</span>
      </BaseButton>
      <p class="mx-auto my-6 text-center text-xs font-semibold">*Vui lòng không hủy đơn hàng khi đã thanh toán*</p>
      <p class="text-center text-xs text-[#5aa000]">
        Đăng nhập ngay để mua sắm dễ dàng hơn, sử dụng những tiện ích mới nhất và tận hưởng thêm nhiều ưu đãi độc quyền dành riêng
        cho thành viên Beauty Box.
      </p>
    </div>
  </BaseDialog>
</template>

<script setup lang="ts">
  import { GENDER } from '@/constant'
  import { apiAuth } from '@/services'
  import type { FormInstance, FormItemRule } from 'element-plus'
  import type { Arrayable } from 'element-plus/es/utils/typescript.mjs'

  import isPhoneNumberValid from '@/utils/isPhoneNumberValid'

  import { useBaseStore } from '@/stores/base.store'

  const { setOpenDialog } = useBaseStore()

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

  const validateField = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
    if (value === '') {
      callback(new Error('Vui lòng nhập số điện thoại'))
    } else if (!isPhoneNumberValid(value)) {
      callback(new Error('Số điện thoại không hợp lệ'))
    } else {
      callback()
    }
  }

  const validateConfirmPassword = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
    if (value === '') {
      callback(new Error('Vui lòng nhập lại mật khẩu'))
    } else if (value !== formRegister.value.password) {
      callback(new Error('Mật khẩu không khớp'))
    } else {
      callback()
    }
  }

  const rulesRegisterForm: Partial<Record<string, Arrayable<FormItemRule>>> = {
    name: [{ required: true, message: 'Vui lòng nhập tên người dùng', trigger: ['blur', 'change'] }],
    gender: [{ required: true, message: 'Vui lòng chọn giới tính', trigger: ['blur', 'change'] }],
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
    phone: [{ required: true, validator: validateField, trigger: ['blur', 'change'] }],
    password: [{ required: true, message: 'Vui lòng nhập mật khẩu', trigger: ['blur', 'change'] }],
    passwordConfirm: [{ required: true, validator: validateConfirmPassword, trigger: ['blur', 'change'] }]
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
</script>

<style scoped></style>
