<template>
  <BaseDialog
    name="dialog-edit-warehouse"
    title="SỬA KHO HÀNG"
    title-btn-primary="Lưu"
    width="800"
    :is-loading="isLoading"
    @open="handleOpen"
    @cancel="setOpenDialog('dialog-edit-warehouse', false)"
    @save="handleSave"
  >
    <ElForm ref="formRef" label-position="top" :model="form" :rules="rules">
      <div class="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
        <ElFormItem label="Số lượng" prop="entryQuantity" class="!mb-0">
          <ElInput
            v-model="form.entryQuantity"
            placeholder="Nhập số lượng"
            :formatter="(value: string) => formatNumberInput(value)"
            :parser="(value: string) => parseNumberInput(value)"
          />
        </ElFormItem>
        <ElFormItem label="Giá sản phẩm" prop="entryPrice" class="!mb-0">
          <ElInput
            v-model="form.entryPrice"
            placeholder="Nhập giá sản phẩm"
            :formatter="(value: string) => formatNumberInput(value)"
            :parser="(value: string) => parseNumberInput(value)"
          />
        </ElFormItem>
        <ElFormItem label="Ngày nhập" prop="entryDate" class="w-full">
          <ElDatePicker
            v-model="form.entryDate"
            type="date"
            placeholder="Ngày nhập"
            class="w-full"
            style="width: 100%; height: 40px"
          />
        </ElFormItem>
        <ElFormItem label="Số điện thoại" prop="entryPhoneNumber">
          <ElInput v-model="form.entryPhoneNumber" placeholder="Nhập số điện thoại" />
        </ElFormItem>
      </div>
      <ElFormItem label="Nơi nhập" prop="entryPlace">
        <ElInput v-model="form.entryPlace" placeholder="Nhập nơi nhập" @keyup.enter="handleSave" />
      </ElFormItem>
    </ElForm>
  </BaseDialog>
</template>

<script setup lang="ts">
  import { apiWarehouse } from '@/services'
  import type { FormInstance } from 'element-plus'

  import type { IWarehouse } from '@/types/warehouse.types'

  import formatNumberInput from '@/utils/formatNumberInput'
  import isPhoneNumberValid from '@/utils/isPhoneNumberValid'
  import parseNumberInput from '@/utils/parseNumberInput'

  import { useBaseStore } from '@/stores/base.store'

  const formRef = ref<FormInstance | null>(null)
  const { setOpenDialog } = useBaseStore()

  const { warehouse } = defineProps<{
    warehouse: IWarehouse
  }>()

  const emit = defineEmits<{
    reload: []
  }>()

  const isLoading = ref(false)
  const form = ref({
    entryDate: '',
    entryPrice: '',
    entryPhoneNumber: '',
    entryPlace: '',
    entryQuantity: '',
    id: ''
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

  const rules = {
    entryQuantity: [
      {
        required: true,
        message: 'Vui lòng nhập số lượng',
        trigger: ['blur', 'change']
      }
    ],
    entryPrice: [
      {
        required: true,
        message: 'Vui lòng nhập giá sản phẩm',
        trigger: ['blur', 'change']
      }
    ],
    entryDate: [
      {
        required: true,
        message: 'Vui lòng nhập ngày nhập',
        trigger: ['blur', 'change']
      }
    ],
    entryPhoneNumber: [{ required: true, validator: validateField, trigger: ['blur', 'change'] }],
    entryPlace: [
      {
        required: true,
        message: 'Vui lòng nhập nơi nhập',
        trigger: ['blur', 'change']
      }
    ]
  }
  const handleOpen = () => {
    form.value = {
      entryDate: warehouse.entryDate,
      entryPrice: warehouse.entryPrice as string,
      entryPhoneNumber: warehouse.entryPhoneNumber,
      entryPlace: warehouse.entryPlace,
      entryQuantity: warehouse.entryQuantity as string,
      id: warehouse.id
    }
  }

  const handleSave = async () => {
    const valid = await formRef.value?.validate()
    if (!valid) return
    isLoading.value = true
    try {
      await apiWarehouse.editWarehouse(form.value)
      ElNotification({
        title: 'Thành công',
        message: 'Cập nhật kho hàng thành công',
        type: 'success'
      })
      setOpenDialog('dialog-edit-warehouse', false)
      emit('reload')
    } catch (error) {
      console.log(error)
    }
    isLoading.value = false
  }
</script>

<style scoped></style>
