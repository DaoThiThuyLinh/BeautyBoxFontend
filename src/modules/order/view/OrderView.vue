<template>
  <div class="container mt-12 flex justify-between space-x-10 max-sm:block">
    <div class="w-1/2 max-sm:w-full">
      <ElForm ref="refForm" label-position="top" :model="form" :rules="rules">
        <p class="text-2xl font-bold max-sm:text-lg">Thông tin thanh toán</p>
        <p class="mt-5 mb-3 text-lg font-bold max-sm:text-base">Thông tin người mua hàng</p>
        <p class="mb-9 text-base max-sm:text-sm">
          Bạn đã đăng nhập với tài khoản <span class="underline">{{ userInfo.email }}.</span>
          <span class="cursor-pointer" @click="logout"> Đăng xuất</span>
        </p>
        <div class="grid grid-cols-2 gap-x-4 gap-y-[18px] max-sm:grid-cols-1">
          <BaseInput v-model="userInfo.name" borderRadius="8px" class="w-full" disabled />
          <BaseInput :model-value="userInfo.gender === 'MALE' ? 'Nam' : 'Nữ'" borderRadius="8px" class="w-full" disabled />
          <BaseInput v-model="userInfo.email" borderRadius="8px" class="w-full" disabled />
          <BaseInput v-model="userInfo.phone" borderRadius="8px" class="w-full" disabled />
        </div>

        <template v-if="defaultAddress">
          <div class="mt-8 h-fit space-y-1 rounded-lg border border-gray-200 p-4">
            <p class="flex items-center justify-between">
              <span class="text-sm font-semibold"
                >{{ defaultAddress.recipientName }} | {{ defaultAddress.recipientPhoneNumber }}</span
              >
              <span class="cursor-pointer text-sm text-[#2d89de]" @click="setOpenDialog('dialog-choose-address')">Thay đổi</span>
            </p>
            <div class="text-sm">
              {{ defaultAddress.name }} | {{ defaultAddress.detailAddress }}, {{ defaultAddress.commune }},
              {{ defaultAddress.district }},
              {{ defaultAddress.province }}
            </div>
          </div>
        </template>
        <template v-else>
          <ElCheckbox v-model="checked" size="large" class="checkbox-order mt-8">
            <p class="text-base font-normal">Người nhận là người khác</p>
          </ElCheckbox>
          <div v-if="checked" class="mt-5 grid grid-cols-2 gap-x-4 gap-y-[18px]">
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
          <div class="mt-5 mb-3 text-lg font-bold">
            <p>Thông tin nhận hàng</p>
          </div>
          <ElFormItem class="w-full" prop="province">
            <BaseSelect
              v-model="form.province"
              placeholder="Tỉnh/thành phố"
              teleported
              class="w-full"
              @change="handleSelectProvince"
            >
              <ElOption v-for="item in listProvinces" :key="item.code" :value="item.code" :label="item.name" />
            </BaseSelect>
          </ElFormItem>
          <div class="grid grid-cols-2 gap-x-4">
            <ElFormItem class="w-full" prop="district">
              <BaseSelect
                v-model="form.district"
                placeholder="Quận/huyện"
                teleported
                class="w-full"
                @change="handleSelectDistrict"
              >
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
        </template>
      </ElForm>

      <div class="mt-5 mb-3 text-lg font-bold">
        <p>Phương thức thanh toán</p>
      </div>
      <div class="mb-10 w-full">
        <ElRadioGroup v-model="form.paymentType" class="radio-payment flex w-full flex-col gap-y-[18px]">
          <ElRadio value="1" size="large" border class="w-full" style="margin-right: 0">
            Trả tiền mặt khi nhận hàng (COD)</ElRadio
          >
          <ElRadio value="2" size="large" border class="w-full"> Trả tiền qua ngân hàng (Online)</ElRadio>
        </ElRadioGroup>
      </div>

      <div class="mt-5 mb-3 text-lg font-bold">
        <p>Phương thức vận chuyển</p>
      </div>
      <div class="mb-10 w-full">
        <ElRadioGroup v-model="form.shippingMethod" class="radio-payment flex w-full flex-col gap-y-[18px]">
          <ElRadio value="1" size="large" border class="w-full" style="margin-right: 0">
            Giao hàng tiêu chuẩn (3 - 6 ngày)
          </ElRadio>
          <ElRadio value="2" size="large" border class="w-full"> Giao hàng trong 24h</ElRadio>
        </ElRadioGroup>
      </div>
      <div class="mt-5 mb-3 text-lg font-bold">
        <p>Ghi chú</p>
      </div>
      <BaseInput v-model="form.note" type="textarea" borderRadius="8px" class="mb-10 w-full" placeholder="Ghi chú" />
    </div>
    <div class="h-fit w-1/2 space-y-4 rounded-lg border border-solid border-[#0000000f] py-4 max-sm:mb-6 max-sm:w-full">
      <BaseLoading v-if="isLoading" />
      <template v-else>
        <div class="space-y-4 px-4">
          <p class="my- text-sm font-bold">Đơn hàng</p>
          <div v-for="item in listProductBuy" :key="item.id" class="flex w-full items-start gap-x-4">
            <img :src="item.image" alt="" class="h-[100px] w-1/3 rounded-lg" loading="lazy" />
            <div class="w-full space-y-6 max-sm:space-y-4">
              <div class="space-y-2">
                <p class="max-sm:text-sm">{{ item.name }}</p>
                <p class="text-sm max-sm:text-xs">{{ item.name }}</p>
              </div>
              <div class="flex items-center justify-between max-sm:block">
                <div class="flex w-full items-center justify-between">
                  <div class="flex items-center">
                    <QuantityInput
                      :model-value="listProductOrder.find(_item => _item.idProduct === item.id)?.quantity ?? 1"
                      @update:model-value="value => handleQuantityChange(item.id, value)"
                    />
                  </div>
                </div>
                <p class="flex items-center gap-x-2">
                  <span class="text-sm font-semibold line-through opacity-50 max-sm:text-xs">{{
                    formatCurrency(item.price)
                  }}</span>
                  <span class="text-base font-semibold text-[var(--color-text-error)] max-sm:text-sm">{{
                    formatCurrency(item.newPrice)
                  }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <p class="border-b border-b-[#0000000F]"></p>
        <div class="space-y-4 px-4">
          <p class="flex items-center justify-between">
            <span class="max-sm:text-sm">Tổng giá trị đơn hàng</span>
            <span class="text-base font-semibold text-[var(--color-text-error)] max-sm:text-sm">{{
              formatCurrency(calculateTotalPrice(listProductBuy, listProductOrder as IProductOrder[]))
            }}</span>
          </p>
          <p class="flex items-center justify-between max-sm:text-sm">
            <span>Phí vận chuyển: </span>
            <span>Miễn phí</span>
          </p>
          <p class="border-b border-b-[#0000000F]"></p>
          <p class="flex items-center justify-between max-sm:text-sm">
            <span>Tổng (đã bao gồm VAT): </span>
            <span class="text-base font-semibold text-[var(--color-text-error)] max-sm:text-sm"
              >{{ formatCurrency(calculateTotalPrice(listProductBuy, listProductOrder as IProductOrder[])) }}
            </span>
          </p>
          <BaseButton type="primary" :is-loading="isOrder" class="w-full" @click="handleOrder">
            <span class="font-bold">ĐẶT HÀNG</span>
          </BaseButton>
        </div>
      </template>
    </div>
  </div>
  <DialogChooseAddress @choose-address="handleChooseAddress" />
</template>

<script setup lang="ts">
  import router from '@/router'
  import { apiAdmin, apiCart, apiOrder } from '@/services'
  import type { FormInstance, FormItemRule } from 'element-plus'
  import type { Arrayable } from 'element-plus/es/utils/typescript.mjs'

  import type { IProductOrder } from '@/types/cart.types'
  import type { IProductChildren } from '@/types/product.types'
  import type { IAddress } from '@/types/profile.types'

  import QuantityInput from '@/components/base/quantity/QuantityInput.vue'

  import DialogChooseAddress from '@/modules/order/components/DialogChoooseAdress.vue'

  import formatCurrency from '@/utils/formatCurrency'
  import isPhoneNumberValid from '@/utils/isPhoneNumberValid'

  import { useAuthStore } from '@/stores/auth.store'
  import { useBaseStore } from '@/stores/base.store'

  const { logout } = useAuthStore()
  const { userInfo } = storeToRefs(useAuthStore())
  const checked = ref(false)

  const { getListProvince, getListDistrict, getListWards, getAddress, setOpenDialog } = useBaseStore()
  const { listProvinces, listDistricts, listWards, listAddress, listProductOrder } = storeToRefs(useBaseStore())
  localStorage.setItem('listProductOrder', JSON.stringify(listProductOrder.value))

  const isLoading = ref(false)
  const refForm = ref<FormInstance | null>(null)
  const isOrder = ref(false)
  const deliveryAddress = ref({} as IAddress)
  const listProductChildren = ref<IProductChildren[]>([])
  const listProductBuy = ref<IProductChildren[]>([])

  const form = ref<{
    note: string
    paymentType: string
    commune: string
    district: string
    province: string
    detailAddress: string
    recipientName: string
    recipientPhoneNumber: string
    shippingMethod: string
    orderItems: { productDetailId: string; quantity: number }[]
  }>({
    note: '',
    paymentType: '',
    commune: '',
    district: '',
    province: '',
    detailAddress: '',
    recipientName: userInfo.value.name,
    recipientPhoneNumber: userInfo.value.phone,
    shippingMethod: '',
    orderItems: []
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

  onMounted(() => Promise.all([getListProvince(), getAddress()]))

  const savedOrder = localStorage.getItem('listProductOrder')
  if (savedOrder) {
    try {
      listProductOrder.value = JSON.parse(savedOrder)
    } catch (_e) {
      listProductOrder.value = []
    }
  }

  const defaultAddress = computed(() => {
    if (deliveryAddress.value.id) return deliveryAddress.value
    return listAddress.value.find(item => item.isDefault) as IAddress
  })

  const listIdProduct = computed(() => {
    return [...new Set(listProductOrder.value.map(item => item.idProduct))]
  })

  const validatePhoneNumber = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
    if (value === '') {
      callback(new Error('Vui lòng nhập số điện thoại người nhận'))
    } else if (!isPhoneNumberValid(value)) {
      callback(new Error('Số điện thoại không hợp lệ'))
    } else {
      callback()
    }
  }

  const rules: Partial<Record<string, Arrayable<FormItemRule>>> = {
    province: [{ required: true, message: 'Vui lòng chọn tỉnh/thành phố', trigger: ['blur', 'change'] }],
    district: [{ required: true, message: 'Vui lòng chọn quận/huyện', trigger: ['blur', 'change'] }],
    commune: [{ required: true, message: 'Vui lòng chọn phường/xã', trigger: ['blur', 'change'] }],
    detailAddress: [{ required: true, message: 'Vui lòng nhập địa chỉ chi tiết', trigger: ['blur', 'change'] }],
    recipientName: [{ required: true, message: 'Vui lòng nhập tên người nhận', trigger: ['blur', 'change'] }],
    recipientPhoneNumber: [{ required: true, validator: validatePhoneNumber, trigger: ['blur', 'change'] }]
  }

  const getProductDetail = async () => {
    isLoading.value = true
    try {
      const rs = await Promise.all(listProductOrder.value.map(item => apiAdmin.getListProductsChildrenById(item.idParnet)))
      listProductChildren.value = rs.map(item => item.data.details).flat()
      const seen = new Set()
      listProductBuy.value = listProductChildren.value.filter(item => {
        const inArr1 = listIdProduct.value.includes(item.id)
        const notSeen = !seen.has(item.id)
        if (inArr1 && notSeen) {
          seen.add(item.id)
          return true
        }
        return false
      })
    } catch (error) {
      console.log(error)
    }
    isLoading.value = false
  }
  getProductDetail()

  const handleOrder = async () => {
    const valid = await refForm.value?.validate()
    if (!valid) return
    isOrder.value = true
    const body = {
      ...form.value,
      orderItems: listProductOrder.value.map(item => ({
        productDetailId: item.idProduct,
        quantity: item.quantity
      })),
      district: defaultAddress.value
        ? defaultAddress.value?.district
        : listDistricts.value.find(item => item.code === +form.value.district)?.name,

      province: defaultAddress.value
        ? defaultAddress.value?.province
        : listProvinces.value.find(item => item.code === +form.value.province)?.name,
      commune: defaultAddress.value
        ? defaultAddress.value?.commune
        : listWards.value.find(item => item.code === +form.value.commune)?.name,
      recipientName: defaultAddress.value ? defaultAddress.value?.recipientName : form.value.recipientName,
      recipientPhoneNumber: defaultAddress.value ? defaultAddress.value?.recipientPhoneNumber : form.value.recipientPhoneNumber,
      detailAddress: defaultAddress.value ? defaultAddress.value?.detailAddress : form.value.detailAddress
    }

    try {
      const rs = await apiOrder.createOrder(body)
      ElNotification({
        title: 'Success',
        message: rs.message,
        type: 'success'
      })
      await deleteProductToCart()
      if (rs.data) window.open(String(rs.data), '_self', 'noopener,noreferrer')
      router.push(`/profile/${userInfo.value.id}?blockActive=order&tabActive=ALL`)
      localStorage.removeItem('listProductOrder')
      listProductOrder.value = []
    } catch (error) {
      console.log(error)
    }
    isOrder.value = false
  }
  const deleteProductToCart = async () => {
    await Promise.all(
      listProductOrder.value.map(item => {
        if (item.id) {
          apiCart.deleteCart(item.id)
        }
      })
    )
  }
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
  const handleChooseAddress = (id: string) => {
    const address = listAddress.value.find(item => item.id === id)
    deliveryAddress.value = address as IAddress
    if (address) {
      form.value.province = address.province
      form.value.district = address.district
      form.value.commune = address.commune
      form.value.detailAddress = address.detailAddress
      form.value.recipientName = address.recipientName
      form.value.recipientPhoneNumber = address.recipientPhoneNumber
    }
  }
  const handleQuantityChange = (idProduct: string, value: number) => {
    // Update the quantity in listProductOrder for the given idProduct
    const product = listProductOrder.value.find(item => item.idProduct === idProduct)
    if (product) {
      product.quantity = value
    }
  }

  const calculateTotalPrice = (products: IProductChildren[], orderList: IProductOrder[]) => {
    return products.reduce((total, product) => {
      const order = orderList.find((item: IProductOrder) => item.idProduct === product.id)
      const quantity = order?.quantity ?? 1
      return total + (product.newPrice || 0) * quantity
    }, 0)
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
  .radio-payment {
    .el-radio {
      border: 1px solid #0000000f;
      border-radius: 8px;
    }
    :deep(.el-radio__input.is-checked) {
      .el-radio__inner {
        background-color: var(--color-primary) !important;
        border-color: var(--color-primary) !important;
      }
    }
    :deep(.el-radio__input.is-checked + .el-radio__label) {
      color: var(--color-text-primary) !important;
    }
  }

  :deep(.el-textarea__inner) {
    border-radius: 8px !important;
    color: var(--color-text-primary);
    font-size: 16px;
  }
</style>
