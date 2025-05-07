<template>
  <div class="container">
    <BaseLoading v-if="isLoading" />

    <template v-else>
      <div class="my-10 flex w-full items-start justify-between gap-10 max-sm:block">
        <div class="left w-1/2 space-y-6 max-sm:w-full">
          <div class="h-[500px] w-full max-sm:h-[260px]">
            <Swiper
              v-if="productImage.length > 0"
              ref="mainSwiperRef"
              :modules="modules"
              :navigation="true"
              :loop="false"
              :initialSlide="0"
              :cssMode="true"
              :slidesPerView="1"
              :spaceBetween="0"
              :observer="true"
              :observeParents="true"
              :watchSlidesProgress="true"
              :thumbs="{ swiper: thumbsSwiper }"
              @swiper="onSwiper"
              @slideNextTransitionStart="handleNext"
              @slidePrevTransitionStart="handlePrev"
              class="mySwiper my-swiper-product-detail h-full w-full"
            >
              <SwiperSlide v-for="(item, index) in productImage" :key="index">
                <img :src="item.image" alt="" class="h-full w-full rounded-xl" loading="lazy" />
              </SwiperSlide>
            </Swiper>
          </div>

          <div class="h-[200px] w-full max-sm:h-[120px]">
            <Swiper
              v-if="productImage.length > 0"
              ref="thumbsSwiperRef"
              :modules="modules"
              :navigation="true"
              :loop="false"
              :initialSlide="0"
              :cssMode="true"
              :slidesPerView="4"
              :spaceBetween="24"
              :observer="true"
              :observeParents="true"
              :watchSlidesProgress="true"
              @swiper="setThumbsSwiper"
              class="mySwiper my-swiper-product-detail h-full w-full"
            >
              <SwiperSlide v-for="(item, index) in productImage" :key="index" @click="handleThumbClick(index)">
                <img
                  :src="item.image"
                  alt=""
                  class="h-full w-full cursor-pointer rounded-xl"
                  :class="{ 'border-2 border-blue-500': currentSlideIndex === index }"
                  loading="lazy"
                />
              </SwiperSlide>
            </Swiper>
          </div>
        </div>

        <div class="w-full max-sm:mt-6">
          <div class="flex w-full flex-col space-y-3">
            <p class="text-sm font-bold text-[#b0100f] uppercase">
              {{ productDetail.brandName }}
            </p>
            <p class="text-sm font-bold uppercase">{{ productDetail.name }}</p>

            <div class="-mt-1 flex items-center justify-start">
              <!-- eslint-disable-next-line vue/no-mutating-props -->
              <ElRate v-model="productDetail.reviewsResponse.averageRating" disabled text-color="#ff9900" class="rate" />
              <span class="text-sm">({{ productDetail.reviewsResponse.totalNumRating || 0 }})</span>
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
            <p class="flex items-center justify-start space-x-2 text-sm">
              <span
                v-for="(item, index) in productDetail.details"
                :key="index"
                class="cursor-pointer rounded-md border border-dashed border-[#dbdbdb] px-2 py-1 hover:bg-gray-100"
                :class="{ active: productIdActive === item.id }"
                @click="handleProductNameClick(item)"
                >{{ item.name }}</span
              >
            </p>
            <p v-if="stockLeft && productIdActive" class="text-sm text-[#c73130]">Còn: {{ formatNumber(stockLeft) }} sản phẩm</p>

            <div class="my-10 mt-6 flex w-full items-center justify-between max-sm:mt-0 max-sm:block">
              <div class="flex items-center space-x-2 max-sm:mb-6">
                <QuantityInput v-model="num" />
              </div>
              <div class="flex items-center space-x-4">
                <!-- <BaseButton type="tertiary" class="w-68" size="medium">
                  <div class="flex items-center justify-center space-x-2">
                    <BaseIcon name="add-to-card" class="mb-1" />
                    <span>Thêm vào giỏ hàng</span>
                  </div>
                </BaseButton> -->

                <BaseButton
                  type="tertiary"
                  :is-disabled="!productIdActive"
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
                  :is-disabled="!productIdActive || stockLeft < num"
                  size="medium"
                  class="w-40"
                  @click="handleBuyNow"
                  >MUA NGAY</BaseButton
                >
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
              <div class="flex items-center justify-start space-x-2">
                <BaseIcon name="start" />
                <p class="text-sm">Nhận <span class="font-bold">HSV Point</span> cho mỗi lần mua</p>
              </div>
              <div class="flex items-center justify-start space-x-2">
                <BaseIcon name="commit" />
                <p class="text-sm">Cam kết <span class="font-bold">hàng chính hãng</span></p>
              </div>
              <div class="flex items-center justify-start space-x-2">
                <BaseIcon name="car-shipping" />
                <p class="text-sm"><span class="font-bold">Miễn phí giao hàng</span> 24h</p>
              </div>
              <div class="flex items-center justify-start space-x-2">
                <BaseIcon name="return" />
                <p class="text-sm">
                  Đổi/trả hàng trong
                  <span class="font-bold">7 ngày</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="my-20 flex items-start gap-6 max-sm:block">
        <p class="w-1/3 text-2xl font-bold max-sm:mb-4 max-sm:w-full max-sm:text-lg">Giới thiệu</p>
        <div class="w-2/3 max-sm:w-full">
          <div
            ref="descriptionContainer"
            v-html="productDetail.description"
            :class="{ 'description-collapsed': !showFullDescription && descriptionContainer?.scrollHeight! > 300 }"
            class="prose prose-sm max-w-none transition-all duration-300"
          ></div>

          <p
            v-if="descriptionContainer?.scrollHeight! > 300"
            @click="showFullDescription = !showFullDescription"
            class="mt-2 cursor-pointer text-center font-semibold text-[var(--color-primary-light)] hover:underline"
          >
            {{ showFullDescription ? 'Thu gọn' : 'Xem thêm' }}
          </p>
        </div>
      </div>
      <p class="my-12 border-b border-b-[#0000000F]"></p>
      <div class="mb-12 flex w-full items-start justify-between gap-6 max-sm:block">
        <div class="w-1/3 space-y-5 max-sm:w-full">
          <p class="text-2xl font-bold">{{ formatNumber(productDetail.reviewsResponse.totalNumRating) }} đánh giá</p>

          <ElRate v-model="productDetail.reviewsResponse.averageRating" disabled text-color="#ff9900" class="rate-review rate" />
          <div class="flex w-full space-x-6">
            <span class="text-xl font-semibold">5</span>
            <ElProgress
              class="w-full"
              :percentage="productDetail.reviewsResponse.details['5']"
              :format="() => `(${productDetail.reviewsResponse.details['5']})`"
            />
          </div>
          <div class="flex w-full space-x-6">
            <span class="text-xl font-semibold">4</span>
            <ElProgress
              class="w-full"
              :percentage="productDetail.reviewsResponse.details['4']"
              :format="() => `(${productDetail.reviewsResponse.details['4']})`"
            />
          </div>
          <div class="flex w-full space-x-6">
            <span class="text-xl font-semibold">3</span>
            <ElProgress
              class="w-full"
              :percentage="productDetail.reviewsResponse.details['3']"
              :format="() => `(${productDetail.reviewsResponse.details['3']})`"
            />
          </div>
          <div class="flex w-full space-x-6">
            <span class="text-xl font-semibold">2</span>
            <ElProgress
              class="w-full"
              :percentage="productDetail.reviewsResponse.details['2']"
              :format="() => `(${productDetail.reviewsResponse.details['2']})`"
            />
          </div>
          <div class="flex w-full space-x-6">
            <span class="text-xl font-semibold">1</span>
            <ElProgress
              class="w-full"
              :percentage="productDetail.reviewsResponse.details['1']"
              :format="() => `(${productDetail.reviewsResponse.details['1']})`"
            />
          </div>
        </div>
        <div class="w-2/3 max-sm:mt-6 max-sm:w-full">
          <div class="mb-10">
            <div v-for="item in productDetail.reviewsResponse.reviews" :key="item.id">
              <p class="text-sm font-medium">{{ item.userName }}</p>
              <div class="flex items-center gap-x-5">
                <ElRate v-model="item.rating" disabled text-color="#ff9900" class="rate" />
                <p class="text-sm text-[#828282]">{{ dateFormat(item.createdDate, 'DD/MM/YYYY HH:mm') }}</p>
              </div>
              <div
                class="flex items-center justify-start gap-x-4"
                @mouseenter="hoveredItem = item.id"
                @mouseleave="hoveredItem = null"
              >
                <p class="text-sm">{{ item.comment }}</p>
                <BaseIcon
                  v-if="hoveredItem === item.id && isAdmin"
                  name="reply"
                  class="cursor-pointer text-[var(--color-secondary)] hover:text-[var(--color-icon-hover)]"
                  @click="handleClickReply(item.id)"
                />
              </div>
              <div v-for="reply in item.replies" :key="reply.id" class="mt-4 ml-10">
                <p class="flex items-center gap-5 text-sm">
                  <span class="font-bold text-[var(--color-primary)]">{{ reply.userName }}</span>
                  <span class="text-[#828282]">{{ dateFormat(reply.createdDate, 'DD/MM/YYYY HH:mm') }}</span>
                </p>
                <p>{{ reply.comment }}</p>
              </div>
            </div>
          </div>

          <div v-if="isShowReview" class="relative space-y-4 rounded-lg border border-solid border-[var(--border-primary)] p-4">
            <div>
              <p>Đánh giá chung</p>
              <ElRate v-model="review.rating" text-color="#ff9900" class="rate-review rate" />
            </div>
            <div class="space-y-1">
              <p>Đánh giá chi tiết</p>
              <BaseInput
                v-model="review.comment"
                placeholder="Nhập đánh giá của bạn"
                :show-suffix="true"
                borderRadius="8px"
                class="w-full"
                @click="handleWriteReview"
                @keyup.enter="handleSendReview"
              >
                <template #suffix>
                  <div v-if="isSendReview" class="is-loading">
                    <BaseIcon name="loading" />
                  </div>
                  <BaseIcon v-else name="send-message" class="text-[var(--color-primary-dashboard)]" @click="handleSendReview" />
                </template>
              </BaseInput>
              <x-circle v-if="isAdmin" class="absolute -top-2 -right-2 cursor-pointer" @click="isShowReply = false" />
            </div>
          </div>
        </div>
      </div>
      <p class="my-12 border-b border-b-[#0000000F]"></p>
      <div class="mb-12 flex w-full items-center justify-between gap-10">
        <div class="w-1/3 space-y-5 max-sm:w-fit">
          <p class="text-2xl font-bold max-sm:text-lg">Hỏi đáp</p>
          <p v-if="!isLoggedIn">
            Vui lòng <span class="cursor-pointer font-bold underline" @click="setOpenDialog('dialog-login')">Đăng nhập</span> để
            được giải đáp thắc mắc về sản phẩm
          </p>
        </div>
        <div class="w-2/3 max-sm:w-fit">
          <BaseInput
            v-model="question"
            placeholder="Có câu hỏi? Tìm lời giải đáp nhanh chóng"
            borderRadius="8px"
            class="w-full"
            showIcon
            @click="handleInputFocus"
          />
        </div>
      </div>
    </template>
  </div>
  <DialogLogin />
  <DialogRegister />
  <CartView :drawer="drawer" @close="handleCloseCart" />
</template>

<script setup lang="ts">
  import XCircle from '@/icons/x-circle.svg?skipsvgo'
  import router from '@/router'
  import { apiAdmin, apiCart, apiReview } from '@/services'
  import type { Swiper as SwiperType } from 'swiper'
  import 'swiper/css'
  import 'swiper/css'
  import 'swiper/css'
  import 'swiper/css/effect-fade'
  import 'swiper/css/free-mode'
  import 'swiper/css/navigation'
  import 'swiper/css/navigation'
  import 'swiper/css/pagination'
  import 'swiper/css/thumbs'
  import { Autoplay, Navigation, Pagination, Thumbs } from 'swiper/modules'
  import { Swiper, SwiperSlide } from 'swiper/vue'

  import type { IProductDetail } from '@/types/cart.types'
  import type { IImagesProduct, IProductParent } from '@/types/product.types'

  import CartView from '@/components/cart/CartView.vue'
  import DialogLogin from '@/components/dialog/DialogLogin.vue'
  import DialogRegister from '@/components/dialog/DialogRegister.vue'

  import dateFormat from '@/utils/dateFormat'
  import formatCurrency from '@/utils/formatCurrency'
  import formatNumber from '@/utils/formatNumber'

  import { useAuthStore } from '@/stores/auth.store'
  import { useBaseStore } from '@/stores/base.store'

  const { isLoggedIn, isAdmin } = storeToRefs(useAuthStore())
  const { setOpenDialog } = useBaseStore()
  const { listProductOrder } = storeToRefs(useBaseStore())
  const route = useRoute()

  const hoveredItem = ref<string | null>(null)
  const productIdActive = ref<string>('')
  const stockLeft = ref<number>(0)
  const num = ref<number>(1)
  const thumbsSwiper = ref<SwiperType | null>(null)
  const modules = [Pagination, Navigation, Autoplay, Thumbs]
  const productId = computed(() => route.params.id)
  const isLoading = ref(false)
  const productDetail = ref<IProductParent>({} as IProductParent)
  const productImage = ref<IImagesProduct[]>([])
  const mainSwiperRef = ref<any>(null)
  const thumbsSwiperRef = ref<any>(null)
  let mainSwiper: any = null
  const currentSlideIndex = ref(0)
  const showFullDescription = ref(false)
  const descriptionContainer = ref<HTMLElement | null>(null)
  const question = ref('')
  const productActive = ref<IProductDetail>({} as IProductDetail)
  const isAddToCart = ref(false)
  const drawer = ref(false)
  const review = ref({ rating: 5, comment: '', orderItemId: route.query.orderId })
  const isSendReview = ref(false)
  const isShowReply = ref(false)
  const formAdminReply = ref({
    reviewId: '',
    comment: ''
  })

  const isShowReview = computed(() => {
    return !isAdmin.value || (isAdmin.value && isShowReply.value)
  })

  const getProductDetail = async () => {
    isLoading.value = true
    try {
      const { data } = await apiAdmin.getListProductsChildrenById(productId.value as string)
      productDetail.value = data
      productActive.value = data.details[0] as IProductDetail
      productImage.value = data.images
      const _productImages = data.details.map(item => {
        return {
          id: item.id,
          image: item.image
        }
      })
      productImage.value.push(..._productImages)
    } catch (error) {
      console.log(error)
    }
    isLoading.value = false
  }
  getProductDetail()

  const onSwiper = (instance: any) => {
    mainSwiper = instance
    if (mainSwiper) {
      mainSwiper.on('slideChange', () => {
        const activeIndex = mainSwiper.activeIndex
        currentSlideIndex.value = activeIndex
        if (thumbsSwiper.value) {
          thumbsSwiper.value.slideTo(activeIndex, 300, false)
        }
      })
    }
  }

  const handleProductNameClick = async (_item: IProductDetail) => {
    productIdActive.value = _item.id
    productActive.value = _item
    const index = productImage.value.findIndex(item => item.id === _item.id)
    if (mainSwiper) {
      mainSwiper.slideTo(index, 300, false)
    }
    stockLeft.value = _item.stock - _item.totalSold
  }

  const handleThumbClick = (index: number) => {
    currentSlideIndex.value = index
    if (mainSwiper) {
      mainSwiper.slideTo(index, 300, false)
    }
  }

  const setThumbsSwiper = (instance: any) => {
    thumbsSwiper.value = instance
  }

  const handleNext = () => {
    if (mainSwiper && mainSwiper.activeIndex < productImage.value.length - 1) {
      const nextIndex = mainSwiper.activeIndex + 1
      currentSlideIndex.value = nextIndex
      if (thumbsSwiper.value) {
        thumbsSwiper.value.slideTo(nextIndex, 300, false)
      }
    }
  }

  const handlePrev = () => {
    if (mainSwiper && mainSwiper.activeIndex > 0) {
      const prevIndex = mainSwiper.activeIndex - 1
      currentSlideIndex.value = prevIndex
      if (thumbsSwiper.value) {
        thumbsSwiper.value.slideTo(prevIndex, 300, false)
      }
    }
  }

  const handleInputFocus = () => {
    if (!isLoggedIn.value) {
      setOpenDialog('dialog-login')
    }
  }

  const handleBuyNow = () => {
    if (!isLoggedIn.value) {
      setOpenDialog('dialog-login')
      return
    }
    listProductOrder.value = [
      {
        idParnet: productDetail.value.id,
        idProduct: productIdActive.value,
        quantity: num.value,
        price: productActive.value.newPrice
      }
    ]
    router.push({
      name: 'Order'
    })
  }
  const handleCloseCart = () => {
    drawer.value = false
  }

  const handleAddToCart = async () => {
    isAddToCart.value = true
    try {
      const body = {
        productDetailId: productIdActive.value,
        quantity: num.value
      }
      await apiCart.addToCart(body)
      drawer.value = true
    } catch (error) {
      console.log(error)
    }
    isAddToCart.value = false
  }
  const handleWriteReview = () => {
    if (!isLoggedIn.value) {
      setOpenDialog('dialog-login')
      return
    }
  }
  const handleSendReview = async () => {
    if (isShowReply.value) {
      formAdminReply.value.comment = review.value.comment
      isSendReview.value = true

      try {
        await apiReview.replyReview(formAdminReply.value)
        ElNotification({
          title: 'Thành công',
          message: 'Phản hồi đánh giá sản phẩm thành công',
          type: 'success'
        })
      } catch (error) {
        console.log(error)
      }
      isShowReply.value = false
      isSendReview.value = false
    } else {
      if (!route.query.orderId) {
        ElMessage.error('Vui lòng mua hàng để đánh giá')
        return
      }
      isSendReview.value = true
      try {
        await apiReview.addReview(review.value)
        ElNotification({
          title: 'Thành công',
          message: 'Cảm ơn bạn đã phản hồi sản phẩm',
          type: 'success'
        })
      } catch (error) {
        console.log(error)
      }
      isSendReview.value = false
    }
    getProductDetail()
  }
  const handleClickReply = (id: string) => {
    formAdminReply.value.reviewId = id
    isShowReply.value = true
  }
</script>

<style lang="scss">
  .my-swiper-product-detail.swiper {
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
    .swiper-slide-thumb-active {
      opacity: 1;
    }
  }
</style>

<style scoped lang="scss">
  .rate {
    :deep(.el-rate__item) {
      .el-rate__icon {
        color: #c1c1c1;
      }
      .is-active {
        color: #f7ba2a;
      }
    }
  }
  .rate-review {
    :deep(.el-rate__item) {
      .el-rate__icon {
        font-size: 32px;
      }
    }
  }
  .is-loading {
    color: var(--color-text-primary);
    margin-right: 6px;
    cursor: default;
    pointer-events: none;
    animation: rotating 2s linear infinite;
  }

  @keyframes rotating {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
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
  .description-collapsed {
    max-height: 300px;
    overflow: hidden;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100px;
      background: linear-gradient(transparent, white);
    }
  }
  :deep(.el-progress-bar__inner) {
    background-color: var(--color-primary-dashboard);
  }
</style>
