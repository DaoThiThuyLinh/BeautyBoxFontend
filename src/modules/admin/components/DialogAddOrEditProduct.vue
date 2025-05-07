<template>
  <BaseDialog
    name="dialog-add-or-edit-product"
    :title="typeAction === 'ADD' ? 'THÊM SẢN PHẨM' : 'CẬP NHẬT SẢN PHẨM'"
    width="1200"
    class="dialog-add-or-edit-product"
    :is-loading="isLoading"
    :title-btn-primary="typeAction === 'ADD' ? 'Thêm' : 'Cập nhật'"
    :class-btn-primary="typeAction === 'ADD' ? 'w-24' : 'w-32'"
    @save="handleAddOrEditProduct"
    @cancel="setOpenDialog('dialog-add-or-edit-product', false)"
    @close="handleClose"
  >
    <BaseLoading v-if="isGetProductDetail && typeAction === 'EDIT'" />
    <ElForm v-if="isShowForm" ref="refForm" label-position="top" :model="form" :rules="rules">
      <ElFormItem v-if="typeAction === 'ADD'" label="Ảnh sảm phẩm">
        <ElUpload
          v-show="!uploadedFiles.length"
          class="upload w-full"
          drag
          :show-file-list="false"
          :auto-upload="false"
          list-type="picture"
          accept=".jpg,.jpeg,.png"
          :on-change="handleSelectFiles"
          :multiple="true"
        >
          <div class="flex items-center justify-center">
            <BaseIcon name="upload" class="text-[#5B616E]" />
          </div>
          <div class="!text-sm !text-[#5B616E]">
            Drag and drop your image here,<em class="!text-[#0151fc]"> or click to upload.</em>
          </div>
        </ElUpload>
        <div class="grid grid-cols-4 gap-6 max-sm:grid-cols-2">
          <div v-for="(file, index) in uploadedFiles" :key="index" class="flex h-[200px] items-center justify-between rounded-xl">
            <div class="relative h-full w-full">
              <img :src="file.url" alt="" class="h-full w-full rounded-xl object-cover" />
              <x-circle class="absolute -top-3 -right-3 cursor-pointer" @click="removeFile(index)" />
            </div>
          </div>
        </div>
      </ElFormItem>

      <ElFormItem v-if="typeAction === 'EDIT'" label="Ảnh sảm phẩm">
        <BaseLoading v-if="isDeleteImage" />
        <div v-else class="grid grid-cols-4 gap-6 max-sm:grid-cols-2">
          <div v-for="(img, index) in imgsProduct" :key="index" class="flex h-[200px] items-center justify-between rounded-xl">
            <div class="relative h-full w-full">
              <img :src="img.image" alt="" class="h-full w-full rounded-xl object-cover" />
              <x-circle class="absolute -top-2 -right-2 cursor-pointer" @click="removeImage(img.id)" />
            </div>
          </div>
          <ElUpload
            v-show="!uploadedFiles.length"
            class="upload-image-product w-full"
            drag
            :show-file-list="false"
            :auto-upload="false"
            list-type="picture"
            accept=".jpg,.jpeg,.png"
            :on-change="handleSelectFiles"
            :multiple="true"
          >
            <div class="relative flex h-full w-full cursor-pointer items-center justify-center">
              <BaseIcon name="plus" size="40" class="text-[#8c939d]" />
            </div>
          </ElUpload>
          <div v-for="(file, index) in uploadedFiles" :key="index" class="flex h-[200px] items-center justify-between rounded-xl">
            <div class="relative h-full w-full">
              <img :src="file.url" alt="" class="h-full w-full rounded-xl object-cover" />
              <x-circle class="absolute -top-3 -right-3 cursor-pointer" @click="removeFile(index)" />
            </div>
          </div>
        </div>
      </ElFormItem>
      <ElFormItem label="Tên sảm phẩm" prop="name">
        <ElInput v-model="form.name" placeholder="Vui lòng nhập tên sản phẩm" />
      </ElFormItem>
      <div class="flex justify-between gap-6 max-sm:block">
        <ElFormItem label="Thể loại" prop="categoryId" class="w-full">
          <BaseSelect v-model="form.categoryId" placeholder="Vui lòng chọn thể loại" teleported class="w-full">
            <ElOption v-for="item in listCategories" :key="item.id" :label="item.name" :value="item.id" />
          </BaseSelect>
        </ElFormItem>
        <ElFormItem label="Thương hiệu" prop="brandId" class="w-full">
          <BaseSelect v-model="form.brandId" placeholder="Vui lòng chọn thương hiệu" teleported class="w-full">
            <ElOption v-for="item in listBrands" :key="item.id" :label="item.name" :value="item.id" />
          </BaseSelect>
        </ElFormItem>
      </div>
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
  </BaseDialog>
</template>

<script setup lang="ts">
  import { COLORS_TEXT_EDITOR, MAX_SIZE_IMAGE_UPLOAD } from '@/constant'
  import XCircle from '@/icons/x-circle.svg?skipsvgo'
  import { apiAdmin } from '@/services'
  import { QuillEditor } from '@vueup/vue-quill'
  import '@vueup/vue-quill/dist/vue-quill.snow.css'
  import type { FormInstance, FormItemRule, UploadFile } from 'element-plus'
  import type { Arrayable } from 'element-plus/es/utils/typescript.mjs'
  import type { QuillOptionsStatic } from 'quill'

  import type { IImagesProduct, IProductParent } from '@/types/product.types'

  import { useBaseStore } from '@/stores/base.store'

  const { listCategories, listBrands } = storeToRefs(useBaseStore())
  const { setOpenDialog } = useBaseStore()

  const { productDetail = {} as IProductParent, typeAction = 'ADD' } = defineProps<{
    productDetail: IProductParent
    typeAction: 'ADD' | 'EDIT'
  }>()

  const emit = defineEmits<{
    reload: []
  }>()
  const product = ref<IProductParent>({} as IProductParent)
  const refForm = ref<FormInstance | null>(null)
  const isLoading = ref(false)
  const isDeleteImage = ref(false)
  const isGetProductDetail = ref(false)
  const uploadedFiles = ref<UploadFile[]>([])
  const imgsProduct = ref<IImagesProduct[]>([])
  const form = ref({
    name: '',
    description: '',
    categoryId: '',
    brandId: ''
  })
  const rules: Partial<Record<string, Arrayable<FormItemRule>>> = {
    name: [{ required: true, message: 'Vui lòng nhập tên sản phẩm', trigger: ['blur', 'change'] }],
    description: [{ required: true, message: 'Vui lòng nhập mô tả sản phẩm', trigger: ['blur', 'change'] }],
    categoryId: [{ required: true, message: 'Vui lòng chọn thể loại sản phẩm', trigger: ['blur', 'change'] }],
    brandId: [{ required: true, message: 'Vui lòng chọn thương hiệu sản phẩm', trigger: ['blur', 'change'] }]
  }

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

  const getProductDetail = async () => {
    isGetProductDetail.value = true
    try {
      const { data } = await apiAdmin.getListProductsChildrenById(productDetail.id)
      product.value = data
      form.value = data
      imgsProduct.value = data.images
    } catch (error) {
      console.log(error)
    }
    isGetProductDetail.value = false
  }
  onMounted(() => {
    if (typeAction === 'EDIT') {
      getProductDetail()
    }
  })

  const isShowForm = computed(() => {
    if (typeAction === 'ADD') {
      return true
    } else {
      return !isGetProductDetail.value
    }
  })

  const handleSelectFiles = (file: UploadFile) => {
    if (file.size! > MAX_SIZE_IMAGE_UPLOAD) {
      ElMessage.error('File size is too large')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      uploadedFiles.value.push({
        ...file,
        url: reader.result as string
      })
    }
    reader.readAsDataURL(file.raw!)
  }

  const removeFile = (index: number) => {
    uploadedFiles.value.splice(index, 1)
  }

  const handleAddOrEditProduct = async () => {
    if (typeAction === 'ADD') {
      await addProduct()
    } else {
      await editProduct()
    }
  }

  const addProduct = async () => {
    isLoading.value = true
    const _images = uploadedFiles.value.map(item => item.raw)
    try {
      const valid = await refForm.value?.validate()
      if (!valid) return
      const formData = new FormData()
      formData.append('name', form.value.name)
      formData.append('description', form.value.description)
      formData.append('categoryId', form.value.categoryId)
      formData.append('brandId', form.value.brandId)
      _images.forEach(file => {
        if (file) {
          formData.append(`images`, file as Blob)
        }
      })
      await apiAdmin.addProduct(formData)
      ElNotification({
        title: 'Success',
        message: 'Thêm mới sản phẩm thành công',
        type: 'success'
      })
      setOpenDialog('dialog-add-or-edit-product', false)
      emit('reload')
    } catch (error) {
      console.log(error)
    }
    isLoading.value = false
  }

  const handleClose = () => {
    form.value = {
      name: '',
      description: '',
      categoryId: '',
      brandId: ''
    }
    uploadedFiles.value = []
    refForm.value?.resetFields()
  }

  const addImagesProduct = async () => {
    const _images = uploadedFiles.value.map(item => item.raw)
    try {
      const valid = await refForm.value?.validate()
      if (!valid) return
      const formData = new FormData()
      formData.append('productId', productDetail.id)
      _images.forEach(file => {
        if (file) {
          formData.append(`images`, file as Blob)
        }
      })
      await apiAdmin.updateImagesProduct(productDetail.id, formData)
    } catch (error) {
      console.log(error)
    }
  }

  const editProduct = async () => {
    isLoading.value = true
    if (uploadedFiles.value.length > 0) {
      await addImagesProduct()
    }
    await apiAdmin.editProduct({ ...form.value, productId: product.value.id })
    isLoading.value = false
    ElNotification({
      title: 'Success',
      message: 'Cập nhật sản phẩm thành công',
      type: 'success'
    })
    setOpenDialog('dialog-add-or-edit-product', false)
    emit('reload')
  }

  const removeImage = async (id: string) => {
    isDeleteImage.value = true
    await apiAdmin.deleteProductImage(id)
    getProductDetail()
    isDeleteImage.value = false
  }
</script>

<style scoped lang="scss">
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
  .filter-container {
    :deep(.el-tag) {
      height: 32px;
      padding: 0 12px;
      font-size: 14px;
      border-radius: 4px;
      background-color: #f0f5ff;
      color: #606266;
      margin-right: 8px;
      cursor: pointer;
      transition: all 0.3s;
    }

    :deep(.el-tag):hover {
      background-color: #e9e9eb;
    }

    :deep(.el-tag .el-tag__close) {
      color: #909399;
      font-weight: bold;
    }

    :deep(.el-tag .el-tag__close:hover) {
      color: #606266;
      background-color: transparent;
    }
  }
  .upload-image-product {
    :deep(.el-upload) {
      .el-upload-dragger {
        height: 200px;
      }
    }
  }
</style>

<style lang="scss">
  $max-indent: 9;
  $indent-step: 3em;
  .dialog-add-or-edit-product {
    .popup-content {
      div {
        blockquote {
          margin-top: 1em !important;
          margin-bottom: 1em !important;
          margin-left: 40px !important;
          margin-right: 40px !important;
        }
        .ql-syntax {
          background-color: #23241f;
          color: #f8f8f2;
          overflow: visible;
          border-radius: 3px;
          white-space: pre-wrap;
          margin-bottom: 5px;
          margin-top: 5px;
          padding: 5px 10px;
        }
        h1 {
          font-size: 2em !important;
          font-weight: bold !important;
        }
        h2 {
          font-size: 1.5em !important;
          font-weight: bold !important;
        }
        h3 {
          font-size: 1.17em !important;
          font-weight: bold !important;
        }
        h4 {
          font-size: 1em !important;
          font-weight: bold !important;
        }
        h5 {
          font-size: 0.83em !important;
          font-weight: bold !important;
        }
        h6 {
          font-size: 0.67em !important;
          font-weight: bold !important;
        }
        /* ol {
          list-style-type: decimal;
          list-style: none;
          li {
            counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
            counter-increment: list-0;

            padding-left: 1.5em;
            &::before {
              margin-left: -1.5em;
              margin-right: 0.3em;
              text-align: right;
              content: counter(list-0, decimal) '. ';
              display: inline-block;
              white-space: nowrap;
              width: 1.2em;
            }
          }
        }
        ul {
          list-style: none;
          padding-left: 1.5em;
          li {
            padding-left: 1.5em;
            &::before {
              content: '\2022';
              margin-left: -1.5em;
              margin-right: 0.3em;
              text-align: right;
              display: inline-block;
              white-space: nowrap;
              width: 1.2em;
            }
          }
        } */

        .ql-align-right {
          text-align: right;
        }
        .ql-size-small {
          font-size: 0.75em;
        }
        .ql-size-large {
          font-size: 1.5em;
        }
        .ql-size-huge {
          font-size: 2.5em;
        }
        .ql-align-center {
          text-align: center;
        }
        .ql-align-right {
          text-align: right;
        }
        .ql-align-justify {
          text-align: justify;
        }
        .ql-video {
          display: block;
          max-width: 100%;
        }
        .ql-video.ql-align-center {
          margin: 0 auto;
        }
        .ql-video.ql-align-right {
          margin: 0 0 0 auto;
        }
        .ql-direction-rtl {
          direction: rtl;
          text-align: inherit;
        }
        .ql-align-right {
          text-align: right;
        }
        li::before {
          display: inline-block;
          white-space: nowrap;
          width: 1.2em;
        }
        ul > li::before {
          content: '\2022';
        }
        li.ql-direction-rtl::before {
          margin-left: 0.3em;
          margin-right: -1.5em;
        }
        ol li.ql-direction-rtl,
        ul li.ql-direction-rtl {
          padding-right: 1.5em;
        }
        ol li:before {
          content: counter(list-0, decimal) '. ';
        }
        ol li {
          counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
          counter-increment: list-0;
        }

        @for $i from 1 through $max-indent {
          .ql-indent-#{$i}.ql-direction-rtl.ql-align-right {
            padding-right: $indent-step * $i;
          }
        }
        @for $i from 1 through $max-indent {
          .ql-indent-#{$i} {
            padding-left: $indent-step * $i;
          }
        }
      }
    }
  }
</style>
