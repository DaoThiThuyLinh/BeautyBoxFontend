<template>
  <div class="mb-6 text-2xl font-bold max-sm:my-4 max-sm:text-lg">Tài khoản</div>
  <ElForm
    ref="refForm"
    label-position="top"
    class="grid grid-cols-2 gap-x-4 gap-y-[18px] max-sm:w-full max-sm:grid-cols-1 max-sm:gap-4"
    :model="form"
    :rules="rules"
  >
    <ElFormItem label="Tên" prop="name" class="max-sm:!mb-0">
      <BaseInput v-model="userInfo.name" borderRadius="8px" class="w-full" disabled />
    </ElFormItem>
    <ElFormItem label="Giới tính" prop="gender" class="max-sm:!mb-0">
      <BaseInput :model-value="userInfo.gender === 'MALE' ? 'Nam' : 'Nữ'" borderRadius="8px" class="w-full" disabled />
    </ElFormItem>
    <ElFormItem label="Email" prop="email" class="max-sm:!mb-0">
      <BaseInput v-model="userInfo.email" borderRadius="8px" class="w-full" disabled />
    </ElFormItem>
    <ElFormItem label="Số điện thoại" prop="phone" class="max-sm:!mb-0">
      <BaseInput v-model="userInfo.phone" borderRadius="8px" class="w-full" disabled />
    </ElFormItem>
    <div></div>
    <div class="flex w-full justify-end">
      <BaseButton type="outline" round-size="lg" class="w-40" @click="setOpenDialog('dialog-change-password')"
        >Đổi mật khẩu</BaseButton
      >
    </div>
  </ElForm>
  <DialogChangePassword />
</template>

<script setup lang="ts">
  import type { FormInstance, FormItemRule } from 'element-plus'
  import type { Arrayable } from 'element-plus/es/utils/typescript.mjs'

  import { useAuthStore } from '@/stores/auth.store'
  import { useBaseStore } from '@/stores/base.store'

  import DialogChangePassword from './DialogChangePassword.vue'

  const { userInfo } = storeToRefs(useAuthStore())

  const refForm = ref<FormInstance | null>(null)
  const { setOpenDialog } = useBaseStore()

  const form = ref({
    name: userInfo.value.name,
    gender: userInfo.value.gender,
    email: userInfo.value.email,
    phone: userInfo.value.phone
  })

  const rules: Partial<Record<string, Arrayable<FormItemRule>>> = {
    name: [{ required: true, message: 'Vui lòng nhập tên', trigger: ['blur', 'change'] }],
    gender: [{ required: true, message: 'Vui lòng chọn giới tính', trigger: ['blur', 'change'] }],
    email: [{ required: true, message: 'Vui lòng nhập email', trigger: ['blur', 'change'] }],
    phone: [{ required: true, message: 'Vui lòng nhập số điện thoại', trigger: ['blur', 'change'] }]
  }
</script>

<style scoped></style>
