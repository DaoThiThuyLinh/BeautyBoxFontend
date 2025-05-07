<template>
  <BaseDialog
    name="dialog-add-brand"
    :title="actionType === 'ADD' ? 'THÊM THƯƠNG HIỆU' : 'SỬA THƯƠNG HIỆU'"
    width="800"
    :is-loading="isLoading"
    @open="handleOpen"
    @close="handleClose"
  >
    <ElForm ref="formRef" label-position="top" :model="form" :rules="rules" @keydown.enter.prevent>
      <ElFormItem label="Ảnh thương hiệu" prop="image" class="!w-full">
        <ElUpload
          v-show="!urlImgPreview"
          class="upload w-full"
          drag
          action=""
          :show-file-list="false"
          :auto-upload="false"
          list-type="picture"
          accept=".jpg,.jpeg,.png"
          :on-change="(file: UploadFile) => handleSelectFile(file)"
          multiple
        >
          <div class="flex items-center justify-center">
            <BaseIcon name="upload" class="text-[#5B616E]" />
          </div>
          <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
        </ElUpload>
        <div
          v-show="urlImgPreview"
          class="mt-3 flex h-[200px] w-full items-center justify-center rounded-md border border-dashed border-[#dbdbdb] p-6"
        >
          <div class="relative h-full w-full">
            <img :src="urlImgPreview!" alt="" class="h-full w-full rounded-xl object-cover" />
            <x-circle class="absolute -top-3 -right-3 cursor-pointer" @click="clearImage" />
          </div>
        </div>
      </ElFormItem>

      <ElFormItem label="Tên thương hiệu" prop="name">
        <BaseInput v-model="form.name" placeholder="Nhập tên thương hiệu" borderRadius="8px" class="w-full" />
      </ElFormItem>

      <!-- <ElFormItem label="Mô tả" prop="description" class="!mb-0">
        <ElMention v-model="form.description" type="textarea" class="metion w-full" placeholder="Please input" />
      </ElFormItem> -->
      <ElFormItem label="Mô tả sảm phẩm" prop="description" class="!mb-0 w-full">
        <QuillEditor
          v-model:content="form.description"
          :options="editorOptions"
          placeholder="Vui lòng nhập mô tả sảm phẩm"
          content-type="html"
          class="quill-editor"
        />
      </ElFormItem>
    </ElForm>

    <template #footer>
      <div class="flex items-center justify-between space-x-4">
        <BaseButton type="outline" round-size="lg" class="w-24" @click="setOpenDialog('dialog-add-brand', false)">Hủy</BaseButton>
        <BaseButton :is-loading="isLoading" type="secondary" round-size="lg" class="w-24" @click="addOrEditBranch">{{
          actionType === 'ADD' ? 'Thêm' : 'Sửa'
        }}</BaseButton>
      </div>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
  import { COLORS_TEXT_EDITOR, MAX_SIZE_IMAGE_UPLOAD } from '@/constant'
  import XCircle from '@/icons/x-circle.svg?skipsvgo'
  import { apiAdmin } from '@/services'
  import { QuillEditor } from '@vueup/vue-quill'
  import '@vueup/vue-quill/dist/vue-quill.snow.css'
  import { type FormInstance, type UploadFile } from 'element-plus'
  import type { QuillOptionsStatic } from 'quill'

  import type { IBrand } from '@/types/brand.types'

  import { useBaseStore } from '@/stores/base.store'

  const { setOpenDialog } = useBaseStore()

  const emit = defineEmits<{
    reload: []
  }>()
  const { brand, actionType } = defineProps<{
    brand: IBrand
    actionType: 'ADD' | 'EDIT'
  }>()

  const imgBrandEdit = ref<string | null>(null)
  const isLoading = ref(false)
  const formRef = ref<FormInstance | null>(null)
  const form = ref<{
    name: string
    description: string
    image: Partial<UploadFile> | null
  }>({
    name: '',
    description: '',
    image: null
  })

  const rules = computed(() => ({
    image: [
      {
        required: actionType === 'ADD' || !imgBrandEdit.value,
        message: 'Vui lòng tải ảnh thương hiệu',
        trigger: ['blur', 'change']
      }
    ],
    name: [
      {
        required: true,
        message: 'Vui lòng nhập tên thương hiệu',
        trigger: ['blur', 'change']
      }
    ]
  }))

  const editorOptions: QuillOptionsStatic = {
    theme: 'snow',
    modules: {
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ header: 1 }, { header: 2 }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ script: 'sub' }, { script: 'super' }],
          [{ indent: '-1' }, { indent: '+1' }],
          [{ direction: 'rtl' }],
          [{ size: ['small', false, 'large', 'huge'] }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ color: COLORS_TEXT_EDITOR }, { background: COLORS_TEXT_EDITOR }],
          [{ font: [] }],
          [{ align: [] }],
          ['clean'],
          ['link', 'image', 'video']
        ]
      }
    }
  }

  const handleSelectFile = async (file: UploadFile) => {
    try {
      if (file.size! > MAX_SIZE_IMAGE_UPLOAD) {
        ElMessage.error('File size is too large')
        return
      }
      form.value.image = file
      formRef.value?.clearValidate('image')
    } catch (error) {
      console.log(error)
    }
  }

  const clearImage = () => {
    form.value.image = null
    if (actionType === 'EDIT') {
      imgBrandEdit.value = null
    }
  }

  const urlImgPreview = computed(() => {
    return form.value.image?.url || imgBrandEdit.value
  })

  const addOrEditBranch = async () => {
    isLoading.value = true
    try {
      const valid = await formRef.value?.validate()
      const formData = new FormData()
      if (!valid) return
      formData.append('name', form.value.name)
      formData.append('description', form.value.description)
      if (form.value.image) {
        formData.append('image', form.value.image!.raw!)
      }
      if (actionType === 'ADD') {
        await apiAdmin.addBranch(formData)
      } else {
        formData.append('id', brand.id)
        await apiAdmin.editBrand(formData)
      }
      setOpenDialog('dialog-add-brand', false)
      ElNotification({
        title: 'Success',
        message: actionType === 'ADD' ? 'Thêm thương hiệu mới thành công' : 'Sửa thương hiệu thành công',
        type: 'success'
      })
      emit('reload')
    } catch (error) {
      console.log(error)
    }
    isLoading.value = false
  }

  const handleClose = () => {
    clearImage()
    form.value = {
      name: '',
      description: '',
      image: null
    }
    formRef.value?.resetFields()
  }

  const handleOpen = () => {
    formRef.value?.resetFields()
    if (actionType === 'EDIT') {
      form.value.name = brand.name
      form.value.description = brand.description
      imgBrandEdit.value = brand.imgUrl
    }
  }
</script>

<style lang="scss" scoped>
  .el-form {
    :deep(.el-form-item__content) {
      .metion {
        .el-textarea__inner {
          border-radius: 8px !important;
          color: var(--color-text-primary);
          font-size: 16px;
        }
      }
    }
  }
  .quill-editor-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }

  .quill-editor {
    height: 300px;
    margin-bottom: 20px;
  }
  :deep(.ql-container) {
    width: 100%;
    border-radius: 0 0 8px 8px;
  }
  :deep(.el-form-item__content) {
    border-radius: 8px;
  }
  :deep(.ql-toolbar) {
    border-radius: 8px 8px 0 0;
  }
  /* Custom styles for color picker */
  :deep(.ql-color .ql-picker-options),
  :deep(.ql-background .ql-picker-options) {
    padding: 3px 5px;
    width: 152px;
  }

  :deep(.ql-editor.ql-blank::before) {
    color: #a8abb2;
    font-size: 14px;
  }

  :deep(.ql-color .ql-picker-item),
  :deep(.ql-background .ql-picker-item) {
    border: 1px solid transparent;
    float: left;
    height: 16px;
    margin: 2px;
    padding: 0px;
    width: 16px;
  }
</style>
