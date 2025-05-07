<template>
  <BaseDialog
    name="dialog-change-password"
    width="500"
    title="ĐỔI MẬT KHẨU"
    :is-loading="isLoading"
    title-btn-primary="Lưu"
    @open="refForm?.resetFields()"
    @save="handleChanePassword"
  >
    <ElForm ref="refForm" label-position="top" :model="form" :rules="rules">
      <ElFormItem prop="password" label="Mật khẩu">
        <ElInput v-model="form.password" type="password" placeholder="Vui lòng nhập mật khẩu" show-password />
      </ElFormItem>
      <ElFormItem prop="passwordConfirm" label="Nhập lại mật khẩu">
        <ElInput
          v-model="form.passwordConfirm"
          type="password"
          placeholder="Vui lòng nhập lại mật khẩu"
          show-password
          @keyup.enter="handleChanePassword"
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

  const { setOpenDialog } = useBaseStore()

  const isLoading = ref(false)
  const refForm = ref<FormInstance | null>(null)
  const form = ref({
    password: '',
    passwordConfirm: ''
  })

  const validateConfirmPassword = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
    if (value === '') {
      callback(new Error('Vui lòng nhập lại mật khẩu'))
    } else if (value !== form.value.password) {
      callback(new Error('Mật khẩu không khớp'))
    } else {
      callback()
    }
  }

  const rules: Partial<Record<string, Arrayable<FormItemRule>>> = {
    password: [{ required: true, message: 'Vui lòng nhập mật khẩu', trigger: ['blur', 'change'] }],
    passwordConfirm: [{ required: true, validator: validateConfirmPassword, trigger: ['blur', 'change'] }]
  }

  const handleChanePassword = async () => {
    const valid = await refForm.value?.validate()
    if (!valid) return
    isLoading.value = true
    try {
      await apiAuth.changePassword(form.value)
      ElNotification({
        message: 'Đổi mật khẩu thành công',
        type: 'success'
      })
      setOpenDialog('dialog-change-password', false)
    } catch (error) {
      console.log(error)
    }
    isLoading.value = false
  }
</script>

<style scoped></style>
