<template>
  <ElDrawer
    :model-value="drawer"
    :show-close="false"
    :size="isDesktop ? '50%' : '100%'"
    @open="handleOpen"
    footer-class="border-t border-gray-200"
  >
    <template #header="{ titleId, titleClass }">
      <p :id="titleId" :class="titleClass" class="!text-2xl font-bold !text-[var(--color-icon-hover)] max-sm:text-base">
        Giỏ hàng của tôi
      </p>
      <BaseIcon name="x-close" class="cursor-pointer" @click="handleClose" />
    </template>
    <BaseLoading v-if="isGetCarts" />
    <BaseEmpty v-else-if="carts.length === 0" />
    <div v-else class="h-screen">
      <ElCheckbox v-model="chooseAllProduct" size="large" class="checkbox-order -mt-3">
        <p class="text-base font-normal">Chọn tất cả</p>
      </ElCheckbox>

      <div v-for="cart in carts" :key="cart.id" class="my-6 flex items-center gap-x-2">
        <ElCheckbox
          :model-value="!!selectedProducts.find(item => item.id === cart.id)"
          @change="(checked: CheckboxValueType) => handleCheckProduct(cart, checked as boolean)"
          size="large"
          class="checkbox-order -mt-3"
        />
        <div class="flex w-full items-start gap-x-4">
          <img :src="cart.productDetail.image" alt="" class="h-[100px] w-1/3 rounded-lg max-sm:h-20 max-sm:w-20" loading="lazy" />
          <div class="flex w-full items-start justify-between">
            <div class="w-full space-y-6">
              <div class="space-y-1">
                <p class="max-sm:text-sm">{{ cart.productName }}</p>
                <p class="text-sm max-sm:text-xs">{{ cart.productDetail.name }}</p>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex w-full items-center justify-between">
                  <div class="flex items-center">
                    <QuantityInput v-model="cart.quantity" @update:model-value="value => handleQuantityChange(cart.id, value)" />
                  </div>
                </div>
                <p class="flex items-center gap-x-2">
                  <span class="text-sm font-semibold line-through opacity-50 max-sm:text-xs">{{
                    formatCurrency(cart.productDetail.price)
                  }}</span>
                  <span class="text-base font-semibold text-[var(--color-text-error)] max-sm:text-xs">{{
                    formatCurrency(cart.productDetail.newPrice)
                  }}</span>
                </p>
              </div>
            </div>
            <div
              class="flex cursor-pointer items-center justify-center rounded-full bg-[#dfdfdf] p-2 max-sm:h-6 max-sm:w-6"
              @click="handleRemove(cart.id)"
            >
              <BaseIcon name="minus" size="16" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <template #footer v-if="selectedProducts.length > 0">
      <div class="space-y-4">
        <div class="flex items-center justify-between font-semibold">
          <span>Tổng tiền</span>
          <span class="text-base font-semibold text-[var(--color-text-error)]">{{
            formatCurrency(selectedProducts.reduce((total, item) => total + item.price * item.quantity, 0))
          }}</span>
        </div>

        <BaseButton @click="handleBuy" class="font-semibold">ĐẶT HÀNG ({{ selectedProducts.length }})</BaseButton>
      </div>
    </template>
  </ElDrawer>
</template>

<script lang="ts" setup>
  import router from '@/router'
  import { apiCart } from '@/services'
  import type { CheckboxValueType } from 'element-plus'
  import { computed } from 'vue'

  import type { ICart, IProductOrder } from '@/types/cart.types'

  import formatCurrency from '@/utils/formatCurrency'

  import { useBaseStore } from '@/stores/base.store'

  const { listProductOrder, isDesktop, isGetCarts, carts } = storeToRefs(useBaseStore())
  const { getCart } = useBaseStore()
  const { drawer } = defineProps<{
    drawer: boolean
  }>()
  const emit = defineEmits(['close'])

  const handleClose = () => {
    emit('close')
  }
  const selectedProducts = ref<IProductOrder[]>([])

  const chooseAllProduct = computed({
    get() {
      return carts.value.length > 0 && selectedProducts.value.length === carts.value.length
    },
    set(checked: boolean) {
      if (checked) {
        selectedProducts.value = carts.value.map(cart => ({
          id: cart.id,
          price: cart.productDetail.newPrice,
          quantity: cart.quantity,
          idParnet: cart.productId,
          idProduct: cart.productDetail.id
        }))
      } else {
        selectedProducts.value = []
      }
    }
  })

  const handleOpen = () => {
    selectedProducts.value = []
    getCart()
  }

  const handleRemove = async (id: string) => {
    await apiCart.removeCart(id)
    ElNotification({
      title: 'Success',
      message: 'Đã xóa sản phẩm khỏi giỏ hàng',
      type: 'success'
    })
    getCart()
  }

  const handleCheckProduct = (cart: ICart, checked: boolean) => {
    if (checked) {
      if (!selectedProducts.value.find(item => item.id === cart.id)) {
        selectedProducts.value.push({
          id: cart.id,
          price: cart.productDetail.newPrice,
          quantity: cart.quantity,
          idParnet: cart.productId,
          idProduct: cart.productDetail.id
        })
      }
    } else {
      selectedProducts.value = selectedProducts.value.filter(item => item.id !== cart.id)
    }
  }

  const handleBuy = () => {
    listProductOrder.value = selectedProducts.value
    router.push({
      name: 'Order'
    })
    emit('close')
  }

  const handleQuantityChange = (cartId: string, value: number) => {
    // Update the quantity in selectedProducts if the product is selected
    const selected = selectedProducts.value.find(item => item.id === cartId)
    if (selected) {
      selected.quantity = value
    }
    // Optionally, update the quantity in carts as well (if not already reactive)
    const cart = carts.value.find(item => item.id === cartId)
    if (cart) {
      cart.quantity = value
    }
  }
</script>
