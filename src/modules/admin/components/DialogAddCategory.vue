<template>
  <BaseDialog
    name="dialog-add-category"
    :title="actionType === 'ADD' ? 'THÊM LOẠI SẢN PHẨM' : 'SỬA LOẠI SẢN PHẨM'"
    width="500"
    :is-loading="isLoading"
    :title-btn-primary="actionType === 'ADD' ? 'Thêm' : 'Sửa'"
    @save="handleAddCategory"
    @cancel="emit('cancel')"
    @open="handleOpen"
  >
    <ElForm ref="formRef" label-position="top" :model="form" :rules="rules" @submit.prevent="handleAddCategory">
      <ElFormItem label="Tên loại sản phẩm" prop="categoryName" class="!mb-0">
        <BaseInput
          v-model="form.categoryName"
          label="Tên loại sản phẩm"
          placeholder="Nhập tên loại sản phẩm"
          borderRadius="8px"
          class="w-full"
        />
      </ElFormItem>
    </ElForm>
  </BaseDialog>
</template>

<script setup lang="ts">
  import type { FormInstance } from 'element-plus'

  import type { ICategory } from '@/types/category.types'

  const {
    isLoading = false,
    category,
    actionType
  } = defineProps<{
    isLoading: boolean
    category: ICategory
    actionType: 'ADD' | 'EDIT'
  }>()
  const emit = defineEmits<{
    save: [categoryName: string]
    edit: [categoryName: string, categoryId: string]
    cancel: []
  }>()
  const formRef = ref<FormInstance | null>(null)
  const form = ref({
    categoryName: ''
  })
  const rules = {
    categoryName: [
      {
        required: true,
        message: 'Vui lòng nhập tên loại sản phẩm',
        trigger: ['blur', 'change']
      }
    ]
  }
  const handleAddCategory = async () => {
    const valid = await formRef.value?.validate()
    if (!valid) return
    if (actionType === 'ADD') {
      emit('save', form.value.categoryName)
    } else {
      emit('edit', form.value.categoryName, category.id)
    }
  }
  const handleOpen = () => {
    formRef.value?.resetFields()
    if (actionType === 'EDIT') {
      form.value.categoryName = category.name
    }
  }
</script>
