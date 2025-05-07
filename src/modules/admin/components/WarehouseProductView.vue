<template>
  <BaseLoading v-if="isGetProduct" />

  <div v-else class="my-10 flex items-start justify-start space-y-4 gap-x-6 max-sm:mt-0 max-sm:mb-6 max-sm:block">
    <img :src="productChildren.image" alt="" class="h-[200px] w-1/2 rounded-lg object-cover max-sm:w-full" loading="lazy" />
    <div class="max-sm:space-y-2">
      <p class="text-xl font-bold">{{ product.name }}</p>
      <p class="text-sm text-gray-500">{{ productChildren.name }}</p>
      <template v-if="productChildren.discount">
        <div class="flex items-center justify-start space-x-4 text-sm">
          <p class="text-base font-bold text-[var(--color-text-error)]">
            {{ formatCurrency(productChildren.newPrice) }}
          </p>
          <span class="line-through opacity-50">{{ formatCurrency(productChildren.price) }}</span>
          <div class="sc-9da02b87-0 eZooTa">
            <span class="tag"> -{{ productChildren.discount }}%</span>
            <span class="price"> -{{ productChildren.discount }}%</span>
          </div>
        </div>
      </template>
      <template v-else>
        <span class="text-base font-bold">{{ formatCurrency(productChildren.price) }}</span>
      </template>
      <p><span class="font-semibold">Thể loại:</span> {{ product.categoryName }}</p>
      <p><span class="font-semibold">Thương hiệu:</span> {{ product.brandName }}</p>
    </div>
  </div>

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
      <ElInput v-model="form.entryPlace" placeholder="Nhập nơi nhập" />
    </ElFormItem>
    <div class="flex justify-end space-x-4">
      <BaseButton type="outline" round-size="lg" class="w-24" @click="handleCancel">Hủy</BaseButton>
      <BaseButton type="secondary" :is-loading="isLoading" round-size="lg" class="w-24" @click="handleSave">Lưu</BaseButton>
    </div>
  </ElForm>
</template>

<script setup lang="ts">
  import { apiAdmin, apiWarehouse } from '@/services'
  import { ElDatePicker, type FormInstance } from 'element-plus'

  import type { IProductChildren, IProductParent } from '@/types/product.types'
  import type { IWarehouseReq } from '@/types/warehouse.types'

  import formatCurrency from '@/utils/formatCurrency'
  import formatNumberInput from '@/utils/formatNumberInput'
  import isPhoneNumberValid from '@/utils/isPhoneNumberValid'
  import parseNumberInput from '@/utils/parseNumberInput'

  const router = useRouter()
  const route = useRoute()
  const formRef = ref<FormInstance | null>(null)
  const isLoading = ref(false)
  const isGetProduct = ref(false)
  const product = ref<IProductParent>({} as IProductParent)
  const productChildren = ref<IProductChildren>({} as IProductChildren)
  const form = ref<IWarehouseReq>({
    entryDate: '',
    entryPrice: '',
    entryPhoneNumber: '',
    entryPlace: '',
    entryQuantity: '',
    productDetailId: route.params.productDetailId as string
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

  const getListProductsChildrenById = async () => {
    isGetProduct.value = true
    try {
      const { data } = await apiAdmin.getListProductsChildrenById(route.params.productId as string)
      product.value = data
      productChildren.value = data.details.find(
        (item: IProductChildren) => item.id === route.params.productDetailId
      ) as IProductChildren
    } catch (error) {
      console.log(error)
    }
    isGetProduct.value = false
  }
  getListProductsChildrenById()

  const handleSave = async () => {
    const valid = await formRef.value?.validate()
    if (!valid) return
    isLoading.value = true
    try {
      await apiWarehouse.addWarehouse(form.value)
      ElNotification({
        title: 'Thành công',
        message: 'Thêm kho hàng thành công',
        type: 'success'
      })
      // router.push({
      //   name: 'WarehouseProductDetail',
      //   params: { productId: route.params.productId }
      // })
      router.push({
        name: 'WarehouseProductDetail',
        query: { productId: productChildren.value.id }
      })
    } catch (error) {
      console.log(error)
    } finally {
      isLoading.value = false
    }
  }

  const handleCancel = () => {
    router.push({
      name: 'WarehouseProductDetail',
      params: { productId: route.params.productId }
    })
  }
</script>

<style scoped></style>
