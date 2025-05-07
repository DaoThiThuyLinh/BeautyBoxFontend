<template>
  <BaseDialog
    name="dialog-add-address"
    width="800"
    title="THÊM ĐỊA CHỈ"
    class="dialog-add-address"
    :is-loading="isLoading"
    @close="refForm?.resetFields()"
    @save="handleAddAddress"
  >
    <ElForm ref="refForm" label-position="top" :model="form" :rules="rules" @submit.prevent="handleAddAddress">
      <ElFormItem class="!mb-3 w-full" prop="name">
        <BaseInput v-model="form.name" placeholder="Tên địa chỉ (vd: Văn phòng, Nhà, ...)" borderRadius="8px" class="w-full" />
      </ElFormItem>

      <ElCheckbox v-model="checked" size="large" class="checkbox-order mb-3">
        <p class="text-base font-normal">Người nhận là người khác</p>
      </ElCheckbox>

      <div v-if="checked" class="grid grid-cols-2 gap-x-4 gap-y-[18px]">
        <ElFormItem class="w-full" prop="recipientName">
          <BaseInput v-model="form.recipientName" placeholder="Tên người nhận" borderRadius="8px" class="w-full" />
        </ElFormItem>
        <ElFormItem class="w-full" prop="recipientPhoneNumber">
          <BaseInput
            v-model="form.recipientPhoneNumber"
            placeholder="Số điện thoại người nhận"
            borderRadius="8px"
            class="w-full"
          />
        </ElFormItem>
      </div>
      <div class="my-3 text-lg font-bold">
        <p>Thông tin nhận hàng</p>
      </div>
      <ElFormItem class="w-full" prop="province">
        <BaseSelect v-model="form.province" placeholder="Tỉnh/thành phố" teleported class="w-full" @change="handleSelectProvince">
          <ElOption v-for="item in listProvinces" :key="item.code" :value="item.code" :label="item.name" />
        </BaseSelect>
      </ElFormItem>
      <div class="grid grid-cols-2 gap-x-4 max-sm:grid-cols-1">
        <ElFormItem class="w-full" prop="district">
          <BaseSelect v-model="form.district" placeholder="Quận/huyện" teleported class="w-full" @change="handleSelectDistrict">
            <ElOption v-for="item in listDistricts" :key="item.code" :value="item.code" :label="item.name" />
          </BaseSelect>
        </ElFormItem>
        <ElFormItem class="w-full" prop="commune">
          <BaseSelect v-model="form.commune" placeholder="Phường/xã" teleported class="w-full" @change="handleSelectWard">
            <ElOption v-for="item in listWards" :key="item.code" :value="item.code" :label="item.name" />
          </BaseSelect>
        </ElFormItem>
      </div>
      <ElFormItem class="w-full" prop="detailAddress">
        <BaseInput v-model="form.detailAddress" borderRadius="8px" class="w-full" placeholder="Địa chỉ chi tiết" />
      </ElFormItem>

      <ElCheckbox v-model="form.isDefault" size="large" class="checkbox-order">
        <p class="text-base font-normal">Đặt làm địa chỉ mặc định</p>
      </ElCheckbox>
    </ElForm>
  </BaseDialog>
</template>

<script setup lang="ts">
  import { apiProfile } from '@/services'
  import type { FormInstance } from 'element-plus'

  import type { IDefaultAddress } from '@/types/profile.types'

  import { useAuthStore } from '@/stores/auth.store'
  import { useBaseStore } from '@/stores/base.store'

  const { getListProvince, getListDistrict, getListWards, setOpenDialog } = useBaseStore()
  const { listProvinces, listDistricts, listWards } = storeToRefs(useBaseStore())
  const { userInfo } = storeToRefs(useAuthStore())

  const emit = defineEmits<{
    reload: []
  }>()

  const isLoading = ref(false)
  const refForm = ref<FormInstance | null>(null)
  const checked = ref(false)
  const form = ref<IDefaultAddress>({
    name: '',
    commune: '',
    district: '',
    province: '',
    detailAddress: '',
    recipientName: userInfo.value.name,
    recipientPhoneNumber: userInfo.value.phone,
    isDefault: false
  })
  const rules = {
    name: [
      {
        required: true,
        message: 'Vui lòng nhập tên địa chỉ',
        trigger: ['blur', 'change']
      }
    ],
    commune: [
      {
        required: true,
        message: 'Vui lòng nhập tên phường/xã',
        trigger: ['blur', 'change']
      }
    ],
    district: [
      {
        required: true,
        message: 'Vui lòng nhập tên quận/huyện',
        trigger: ['blur', 'change']
      }
    ],
    province: [
      {
        required: true,
        message: 'Vui lòng nhập tên tỉnh/thành phố',
        trigger: ['blur', 'change']
      }
    ],
    detailAddress: [
      {
        required: true,
        message: 'Vui lòng nhập tên địa chỉ chi tiết',
        trigger: ['blur', 'change']
      }
    ],
    recipientName: [
      {
        required: true,
        message: 'Vui lòng nhập tên người nhận',
        trigger: ['blur', 'change']
      }
    ],
    recipientPhoneNumber: [
      {
        required: true,
        message: 'Vui lòng nhập số điện thoại người nhận',
        trigger: ['blur', 'change']
      }
    ]
  }
  onMounted(async () => {
    await getListProvince()
  })

  watch(checked, newValue => {
    if (newValue) {
      form.value.recipientName = ''
      form.value.recipientPhoneNumber = ''
    } else {
      form.value.recipientName = userInfo.value.name
      form.value.recipientPhoneNumber = userInfo.value.phone
    }
  })

  const handleSelectProvince = async (code: string) => {
    if (code) {
      refForm.value?.clearValidate('province')
      await getListDistrict(code)
    }
  }
  const handleSelectDistrict = async (code: string) => {
    if (code) {
      refForm.value?.clearValidate('district')
      await getListWards(code)
    }
  }
  const handleSelectWard = async (code: string) => {
    if (code) {
      refForm.value?.clearValidate('commune')
    }
  }
  const handleAddAddress = async () => {
    const valid = await refForm.value?.validate()
    if (!valid) return
    isLoading.value = true
    try {
      const body = {
        ...form.value,
        district: listDistricts.value.find(item => item.code === +form.value.district)?.name,
        province: listProvinces.value.find(item => item.code === +form.value.province)?.name,
        commune: listWards.value.find(item => item.code === +form.value.commune)?.name
      }
      const rs = await apiProfile.addAddress(body)
      ElNotification({
        title: 'Success',
        message: rs.message,
        type: 'success'
      })
      setOpenDialog('dialog-add-address', false)
      emit('reload')
    } catch (error) {
      console.log(error)
    }
    isLoading.value = false
  }
</script>

<style scoped lang="scss">
  :deep(.el-checkbox__input) {
    .el-checkbox__inner {
      border-radius: 4px;
      width: 20px;
      height: 20px;
    }
    .el-checkbox__inner:after {
      border: 2px solid transparent;
      border-left: 0;
      border-top: 0;
      box-sizing: content-box;
      content: '';
      height: 10px;
      left: 7px;
      position: absolute;
      top: 1px;
      transform: rotate(45deg) scaleY(0);
      transform-origin: center;
      transition: transform 0.15s ease-in 0.05s;
      width: 3px;
    }
  }

  :deep(.el-checkbox__input.is-checked) {
    .el-checkbox__inner:after {
      border-color: white;
      transform: rotate(45deg) scaleY(1);
    }
  }
  :deep(.el-checkbox__input.is-checked) {
    .el-checkbox__inner {
      background-color: var(--color-primary) !important;
      border-color: var(--color-primary) !important;
    }
  }
  :deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
    color: var(--color-text-primary) !important;
  }
</style>
