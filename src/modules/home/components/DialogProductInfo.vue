<template>
  <BaseDialog
    name="dialog-product-info"
    width="1200"
    class="dialog-product-info"
    :is-show-footer="false"
    :is-show-header="false"
    header-class="hidden-header-dialog"
    @open="handleOpenDialog"
    @close="handleCloseDialog"
  >
    <div class="group flex cursor-pointer justify-end" @click="setOpenDialog('dialog-product-info', false)">
      <BaseIcon name="close" :size="16" class="text-[var(--color-secondary)] group-hover:text-[var(--color-icon-hover)]" />
    </div>
    <div class="flex w-full items-start space-x-6">
      <div class="h-[429px] w-[429px]">
        <Swiper
          v-if="productImage.length > 0"
          ref="swiperRef"
          :modules="modules"
          :navigation="true"
          :loop="false"
          :initialSlide="0"
          :cssMode="true"
          :slidesPerView="1"
          :spaceBetween="0"
          :observer="true"
          :observeParents="true"
          @swiper="onSwiper"
          class="mySwiper my-swiper-product-info h-full w-full"
        >
          <SwiperSlide v-for="(item, index) in productImage" :key="index">
            <img :src="item.image" alt="" class="h-full w-full rounded-xl" loading="lazy" />
          </SwiperSlide>
        </Swiper>
      </div>
      <div class="flex w-full flex-col space-y-3">
        <p class="text-sm font-bold text-[#b0100f] uppercase">
          {{ productInfo.brandName }}
        </p>
        <p class="text-sm font-bold uppercase">{{ productInfo.name }}</p>

        <div class="-mt-1 flex items-center justify-start">
          <!-- eslint-disable-next-line vue/no-mutating-props -->
          <ElRate v-model="productInfo.reviewsResponse.averageRating" disabled text-color="#ff9900" class="rate" />
          <span class="text-sm">({{ productInfo.reviewsResponse.totalNumRating || 0 }})</span>
        </div>

        <template v-if="productActive.discount">
          <div class="flex items-center justify-start space-x-4 text-sm">
            <p class="text-base font-bold text-[var(--color-text-error)]">
              {{ formatCurrency(productActive.newPrice) }}
            </p>
            <span class="line-through opacity-50">{{ formatCurrency(productActive.price) }}</span>
            <div class="sc-9da02b87-0 eZooTa">
              <span class="tag"> -{{ productActive.discount }}%</span>
              <span class="price"> -{{ productActive.discount }}%</span>
            </div>
          </div>
        </template>
        <template v-else>
          <span class="text-base font-bold">{{ formatCurrency(productActive.price) }}</span>
        </template>
        <div class="space-y-1">
          <p>Sản phẩm</p>
          <p class="flex items-center justify-start space-x-2 text-sm">
            <span
              v-for="(item, index) in productInfo.details"
              :key="index"
              class="cursor-pointer rounded-md border border-dashed border-[#dbdbdb] px-2 py-1 hover:bg-gray-100"
              :class="{ active: productId === item.id }"
              @click="handleProductNameClick(item)"
              >{{ item.name }}</span
            >
          </p>
        </div>
        <p v-if="stockLeft && productId" class="text-sm text-[#c73130]">Còn: {{ formatNumber(stockLeft) }} sản phẩm</p>

        <div class="flex w-full items-center justify-between">
          <div v-if="productId" class="flex items-center space-x-2">
            <QuantityInput v-model="num" />
          </div>
          <div v-else></div>
          <div class="flex items-center space-x-4">
            <BaseButton
              type="tertiary"
              :is-disabled="!productId"
              :is-loading="isAddToCart"
              class="w-68"
              size="medium"
              @click="handleAddToCart"
            >
              <div class="flex items-center justify-center space-x-2">
                <BaseIcon name="add-to-card" class="mb-1" />
                <span>Thêm vào giỏ hàng</span>
              </div>
            </BaseButton>
            <BaseButton
              type="primary"
              :is-disabled="!productId || stockLeft < num"
              size="medium"
              class="w-40"
              @click="handleBuyNow"
              >MUA NGAY</BaseButton
            >
          </div>
        </div>
        <p
          class="mt-6 cursor-pointer text-center text-base font-bold underline underline-offset-1"
          @click="handleViewProductDetail"
        >
          Xem chi tiết sản phẩm
        </p>
      </div>
    </div>
  </BaseDialog>
  <CartView :drawer="drawer" @close="handleCloseCart" />
</template>

<script setup lang="ts">
  import router from '@/router'
  import { apiCart } from '@/services'
  import 'swiper/css'
  import 'swiper/css'
  import 'swiper/css/effect-fade'
  import 'swiper/css/navigation'
  import 'swiper/css/pagination'
  import { Autoplay, Navigation, Pagination } from 'swiper/modules'
  import { Swiper, SwiperSlide } from 'swiper/vue'

  import type { IProductDetail } from '@/types/cart.types'
  import type { IImagesProduct, IProductParent } from '@/types/product.types'

  import CartView from '@/components/cart/CartView.vue'

  import formatCurrency from '@/utils/formatCurrency'
  import formatNumber from '@/utils/formatNumber'

  import { useAuthStore } from '@/stores/auth.store'
  import { useBaseStore } from '@/stores/base.store'

  const modules = [Pagination, Navigation, Autoplay]
  const { listProductOrder } = storeToRefs(useBaseStore())
  const { isLoggedIn } = storeToRefs(useAuthStore())
  const { setOpenDialog } = useBaseStore()
  const { productInfo } = defineProps<{
    productInfo: IProductParent
  }>()

  const isAddToCart = ref(false)
  const productImage = ref<IImagesProduct[]>([])
  const productId = ref<string>('')
  const swiperRef = ref<any>(null)
  const stockLeft = ref<number>(0)
  const num = ref<number>(1)
  const productActive = ref<IProductDetail>({} as IProductDetail)
  let swiper: any = null
  const drawer = ref(false)

  const onSwiper = (instance: any) => {
    swiper = instance
  }
  const handleOpenDialog = async () => {
    productImage.value = productInfo.images
    productActive.value = productInfo.details[0] as IProductDetail
    const _productImages = productInfo.details.map(item => {
      return {
        id: item.id,
        image: item.image
      }
    })
    productImage.value.push(..._productImages)
  }

  const handleProductNameClick = async (_item: IProductDetail) => {
    productActive.value = _item
    productId.value = _item.id
    const index = productImage.value.findIndex(item => item.id === _item.id)
    if (swiper) {
      swiper.slideTo(index, 300, false)
    }
    stockLeft.value = _item.stock - _item.totalSold
  }

  const handleCloseDialog = () => {
    productId.value = ''
    num.value = 1
  }

  const handleViewProductDetail = () => {
    setOpenDialog('dialog-product-info', false)
    setTimeout(() => {
      router.push({ name: 'ProductDetail', params: { id: productInfo.id } })
    }, 100)
  }

  const handleAddToCart = async () => {
    isAddToCart.value = true
    try {
      const body = {
        productDetailId: productId.value,
        quantity: num.value
      }
      await apiCart.addToCart(body)
      setOpenDialog('dialog-product-info', false)
      drawer.value = true
    } catch (error) {
      console.log(error)
    }
    isAddToCart.value = false
  }

  const handleCloseCart = () => {
    drawer.value = false
  }
  const handleBuyNow = () => {
    if (!isLoggedIn.value) {
      setOpenDialog('dialog-login')
      return
    }
    listProductOrder.value = [
      {
        idParnet: productInfo.id,
        idProduct: productId.value,
        quantity: num.value,
        price: productActive.value.newPrice
      }
    ]
    router.push({
      name: 'Order'
    })
  }
</script>

<style lang="scss">
  .my-swiper-product-info.swiper {
    text-align: center;
    .swiper-button-prev:after,
    .swiper-button-next:after {
      font-size: 14px !important;
    }
    .swiper-button-next,
    .swiper-rtl .swiper-button-prev {
      color: black;
      right: var(--swiper-navigation-sides-offset, -8px);
      font-weight: 700;
      border: 1px solid #ffffff;
      border-radius: 100%;
      margin-right: 24px;
      width: 35px;
      height: 35px;
      background-color: #ffffff;
    }
    .swiper-button-prev,
    .swiper-rtl .swiper-button-next {
      color: black;
      left: var(--swiper-navigation-sides-offset, -8px);
      font-weight: 700;
      border: 1px solid #ffffff;
      border-radius: 100%;
      margin-left: 24px;
      width: 35px;
      height: 35px;
      background-color: #ffffff;
    }
    .swiper-pagination-bullet-active {
      background: #2b2b2b;
    }
  }
</style>

<style scoped lang="scss">
  .rate {
    :deep(.el-rate__item) {
      .el-rate__icon {
        color: #c1c1c1;
      }
    }
    .is-active {
      color: #f7ba2a;
    }
  }
  .eZooTa {
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
    position: relative;
    .tag {
      display: inline-block;
      height: 20px;
      width: auto;
      background-color: var(--color-text-error);
      border-radius: 3px 4px 4px 3px;
      border-left: 1px solid var(--color-text-error);
      margin-left: 19px;
      position: relative;
      color: var(--color-text-error);
      font-weight: 700;
      font-size: 12px;
      padding: 0px 5px;
      &:before {
        content: '';
        position: absolute;
        transform-origin: left top;
        transform: rotate(45deg);
        background: var(--color-text-error);
        top: -1px;
        left: 1px;
        height: 15px;
        width: 15px;
        color: white;
        border-radius: 3px;
      }
    }
    .price {
      font-weight: 700;
      font-size: 12px;
      color: white;
      position: absolute;
      right: 8px;
    }
  }
  .active {
    border-color: var(--color-primary-light);
  }
  .input-number {
    &:focus {
      border: 1px solid var(--color-primary-light);
    }
  }
</style>
