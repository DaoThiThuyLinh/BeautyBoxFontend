<template>
  <BaseDialog
    name="dialog-add-or-edit-product-children"
    :title="actionType === 'ADD' ? 'THÊM SẢN PHẨM' : 'CẬP NHẬT SẢN PHẨM'"
    width="1000"
    class="dialog-add-or-edit-product-children"
    @open="handleOpen"
    @close="handleClose"
  >
    <ElForm ref="formRef" label-position="top" :model="form" :rules="rules">
      <ElFormItem label="Ảnh sản phẩm" prop="image" class="!w-full">
        <ElUpload
          v-model="form.image"
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
            <img :src="urlImgPreview" alt="" class="h-full w-full rounded-xl object-cover" loading="lazy" />
            <x-circle v-if="actionType !== 'EDIT'" class="absolute -top-3 -right-3 cursor-pointer" @click="clearImage" />
          </div>
        </div>
      </ElFormItem>
      <ElFormItem label="Tên sản phẩm" prop="name">
        <BaseInput v-model="form.name" placeholder="Nhập tên sản phẩm" borderRadius="8px" class="w-full" />
      </ElFormItem>
      <div class="grid grid-cols-2 gap-6 max-sm:grid-cols-1 max-sm:gap-0">
        <ElFormItem label="Giá sản phẩm" prop="price">
          <ElInput
            v-model="form.price"
            placeholder="Nhập giá sản phẩm"
            :formatter="(value: string) => formatNumberInput(value)"
            :parser="(value: string) => parseNumberInput(value)"
          />
        </ElFormItem>
        <ElFormItem label="% giảm giá" prop="discount">
          <ElInput
            v-model="form.discount"
            placeholder="Nhập % giảm giá"
            :formatter="(value: string) => formatNumberInput(value)"
            :parser="(value: string) => parseNumberInput(value)"
          />
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
    <template #footer>
      <div class="flex items-center justify-between space-x-4">
        <BaseButton
          type="outline"
          round-size="lg"
          class="w-24"
          @click="setOpenDialog('dialog-add-or-edit-product-children', false)"
          >Hủy</BaseButton
        >
        <BaseButton
          :is-loading="isLoading"
          type="secondary"
          round-size="lg"
          :class="actionType === 'ADD' ? 'w-24' : 'w-32'"
          @click="handleAddOrEditProductChildren"
          >{{ actionType === 'ADD' ? 'Thêm' : 'Cập nhật' }}</BaseButton
        >
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
  import type { FormInstance, UploadFile } from 'element-plus'
  import type { QuillOptionsStatic } from 'quill'

  import type { IProductChildren } from '@/types/product.types'

  import formatNumberInput from '@/utils/formatNumberInput'
  import parseNumberInput from '@/utils/parseNumberInput'

  import { useBaseStore } from '@/stores/base.store'

  const formRef = ref<FormInstance | null>(null)
  const { setOpenDialog } = useBaseStore()
  const router = useRouter()
  const {
    productId = '',
    productChildren,
    actionType
  } = defineProps<{
    productId: string
    productChildren: IProductChildren
    actionType: 'ADD' | 'EDIT'
  }>()
  const emit = defineEmits<{
    reload: []
  }>()
  const isLoading = ref(false)

  const form = ref<{
    name: string
    price: number | string
    discount: number | string
    image: Partial<UploadFile> | null
    description: string
  }>({
    name: '',
    price: '',
    discount: '',
    image: null,
    description: ''
  })

  const rules = {
    image: [
      {
        required: true,
        message: 'Vui lòng tải ảnh sản phẩm',
        trigger: ['blur', 'change']
      }
    ],
    name: [
      {
        required: true,
        message: 'Vui lòng nhập tên sản phẩm',
        trigger: ['blur', 'change']
      }
    ],
    price: [
      {
        required: true,
        message: 'Vui lòng nhập giá sản phẩm',
        trigger: ['blur', 'change']
      }
    ],
    discount: [
      {
        required: false,
        validator: (_rule: any, value: any, callback: any) => {
          if (value && (value < 0 || value > 100)) {
            callback(new Error('Phần trăm giảm giá phải nằm trong khoảng từ 0 đến 100'))
          } else {
            callback()
          }
        },
        trigger: ['blur', 'change']
      }
    ]
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

  const handleOpen = () => {
    if (actionType === 'EDIT') {
      form.value = {
        name: productChildren.name,
        price: productChildren.price,
        discount: productChildren.discount,
        image: null,
        description: productChildren.description
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
  }

  const urlImgPreview = computed(() => {
    if (actionType === 'EDIT') {
      return productChildren.image
    }
    return form.value.image?.url
  })

  const handleAddOrEditProductChildren = () => {
    if (actionType === 'ADD') {
      addProduct()
    } else {
      editProduct()
    }
  }

  const addProduct = async () => {
    isLoading.value = true
    try {
      const valid = await formRef.value?.validate()
      if (!valid) return
      const formData = new FormData()
      formData.append('name', form.value.name)
      formData.append('price', form.value.price as string)
      formData.append('discount', form.value.discount as string)
      formData.append('productId', productId)
      formData.append('description', form.value.description)
      formData.append('image', form.value.image!.raw!)
      const { data } = await apiAdmin.addProductChildren(formData)
      emit('reload')
      setOpenDialog('dialog-add-or-edit-product-children', false)
      ElNotification({
        title: 'Success',
        message: 'Thêm sản phẩm thành công',
        type: 'success'
      })
      router.push({
        name: 'WarehouseProduct',
        params: { productId: productId, productDetailId: data }
      })
    } catch (error) {
      console.log(error)
    }
    isLoading.value = false
  }

  const editProduct = async () => {
    isLoading.value = true
    try {
      form.value.image = productChildren.image as Partial<UploadFile>
      const valid = await formRef.value?.validate()
      if (!valid) return
      await apiAdmin.editProductChildren({
        id: productChildren.id,
        name: form.value.name,
        price: form.value.price as string,
        discount: form.value.discount as string,
        description: form.value.description
      })
      emit('reload')
      setOpenDialog('dialog-add-or-edit-product-children', false)
      ElNotification({
        title: 'Success',
        message: 'Cập nhật sản phẩm thành công',
        type: 'success'
      })
    } catch (error) {
      console.log(error)
    }
    isLoading.value = false
  }

  const handleClose = () => {
    form.value = {
      name: '',
      price: '',
      discount: '',
      image: null,
      description: ''
    }
    formRef.value?.resetFields()
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
</style>
