<template>
  <div class="container">
    <BaseLoadingCard
      v-if="isLoading"
      :number-card-loading="isDesktop ? 5 : 2"
      :grid-class="isDesktop ? 'grid-cols-5' : 'grid-cols-2'"
    />
    <BaseEmpty v-else-if="products.length === 0" />
    <div v-else-if="isDesktop" class="grid grid-cols-5 gap-6 max-lg:grid-cols-4 max-md:grid-cols-3 max-sm:grid-cols-2">
      <div
        v-for="(item, index) in products"
        :key="item.id"
        class="fade-in transform cursor-pointer space-y-1 rounded-lg bg-[#fafafa] p-4 transition duration-500 hover:scale-105 hover:bg-[#ffebd6]"
        :style="{ animationDelay: `${index * 200}ms` }"
        @click="emit('view-product-info', item)"
      >
        <div class="flex items-center justify-center">
          <div
            class="relative flex h-[260px] w-[260px] items-center justify-center overflow-hidden rounded-lg"
            @mouseenter="hoveredItem = item.id"
            @mouseleave="hoveredItem = null"
          >
            <div class="image-container" :class="{ 'slide-active': hoveredItem === item.id }">
              <img
                :src="item.images[0].image"
                :alt="item.name"
                class="first-image absolute top-0 left-0 h-[260px] w-[260px] object-cover"
              />
              <img
                v-if="item.images.length > 1"
                :src="item.images[1].image"
                :alt="item.name"
                class="second-image absolute top-0 left-0 h-[260px] w-[260px] object-cover"
              />
            </div>
          </div>
        </div>
        <p class="mt-2 line-clamp-2 text-center text-sm font-semibold uppercase">{{ item.name }}</p>
        <p v-html="item.description" class="line-clamp-3 text-sm text-gray-600"></p>
        <template v-if="item.details[0]?.discount">
          <p class="text-base font-bold text-[var(--color-text-error)]">{{ formatCurrency(item.details[0]?.newPrice) }}</p>
          <div class="flex items-center justify-start space-x-2 text-sm">
            <span class="line-through opacity-50">{{ formatCurrency(item.details[0]?.price) }}</span>
            <div class="sc-9da02b87-0 eZooTa">
              <span class="tag"> -{{ item.details[0]?.discount }}%</span>
              <span class="price"> -{{ item.details[0]?.discount }}%</span>
            </div>
          </div>
        </template>
        <template v-else>
          <span class="text-base font-bold">{{ formatCurrency(item.details[0]?.price) }}</span>
        </template>
        <p class="text-sm">
          Đã bán: <span>{{ item.totalSold }}</span>
        </p>
        <div class="-mt-1 flex items-center justify-start">
          <ElRate v-model="item.reviewsResponse.averageRating" disabled text-color="#ff9900" class="rate" />
          <span class="text-sm">({{ item.reviewsResponse.totalNumRating }})</span>
        </div>
      </div>
    </div>

    <template v-else>
      <Swiper
        ref="{swiperRef}"
        :modules="modules"
        :navigation="true"
        :cssMode="true"
        :slidesPerView="2"
        :spaceBetween="12"
        class="mySwiper my-swiper-mb"
      >
        <SwiperSlide
          v-for="(item, index) in products"
          :key="item.id"
          class="fade-in transform cursor-pointer space-y-1 rounded-lg bg-[#fafafa] p-4 transition duration-500 hover:scale-105 hover:bg-[#ffebd6]"
          :style="{ animationDelay: `${index * 200}ms` }"
          @click="emit('view-product-info', item)"
        >
          <div class="flex items-center justify-center">
            <div
              class="relative flex h-[260px] w-[260px] items-center justify-center overflow-hidden rounded-lg"
              @mouseenter="hoveredItem = item.id"
              @mouseleave="hoveredItem = null"
            >
              <div class="image-container" :class="{ 'slide-active': hoveredItem === item.id }">
                <img
                  :src="item.images[0].image"
                  :alt="item.name"
                  class="first-image absolute top-0 left-0 h-[260px] w-[260px] object-cover"
                />
                <img
                  v-if="item.images.length > 1"
                  :src="item.images[1].image"
                  :alt="item.name"
                  class="second-image absolute top-0 left-0 h-[260px] w-[260px] object-cover"
                />
              </div>
            </div>
          </div>
          <p class="mt-2 line-clamp-2 text-center text-sm font-semibold uppercase">{{ item.name }}</p>
          <p v-html="item.description" class="line-clamp-3 text-sm text-gray-600 max-sm:text-start"></p>
          <template v-if="item.details[0]?.discount">
            <p class="text-base font-bold text-[var(--color-text-error)] max-sm:text-start">
              {{ formatCurrency(item.details[0]?.newPrice) }}
            </p>
            <div class="flex items-center justify-start space-x-2 text-sm max-sm:text-start">
              <span class="line-through opacity-50 max-sm:text-xs">{{ formatCurrency(item.details[0]?.price) }}</span>
              <div class="sc-9da02b87-0 eZooTa max-sm:text-xs">
                <span class="tag"> -{{ item.details[0]?.discount }}%</span>
                <span class="price"> -{{ item.details[0]?.discount }}%</span>
              </div>
            </div>
          </template>
          <template v-else>
            <span class="text-base font-bold max-sm:text-start max-sm:text-xs">{{ formatCurrency(item.details[0]?.price) }}</span>
          </template>
          <p class="text-sm max-sm:text-start max-sm:text-xs">
            Đã bán: <span>{{ item.totalSold }}</span>
          </p>
          <div class="-mt-1 flex items-center justify-start">
            <ElRate v-model="item.reviewsResponse.averageRating" disabled text-color="#ff9900" class="rate" />
            <span class="text-sm">({{ item.reviewsResponse.totalNumRating }})</span>
          </div>
        </SwiperSlide>
      </Swiper>
    </template>
  </div>
  <div v-if="type !== 'bestseller'" class="mt-10 flex justify-center">
    <ElPagination
      layout="prev, pager, next"
      :current-page="queryProduct.pageIndex"
      :page-size="queryProduct.pageSize"
      :pager-count="
        (() => {
          if (isDesktop) return 5
          else return 3
        })()
      "
      :total="queryProduct.total"
      class="pagination"
      @current-change="handleChange('pageIndex', $event)"
    />
  </div>
</template>

<script setup lang="ts">
  import 'swiper/css'
  import 'swiper/css'
  import 'swiper/css/effect-fade'
  import 'swiper/css/navigation'
  import 'swiper/css/pagination'
  import { Autoplay, Navigation, Pagination } from 'swiper/modules'
  import { Swiper, SwiperSlide } from 'swiper/vue'

  import type { IProductParent } from '@/types/product.types'

  import formatCurrency from '@/utils/formatCurrency'

  import { useBaseStore } from '@/stores/base.store'

  const modules = [Pagination, Navigation, Autoplay]

  const hoveredItem = ref<string | null>(null)

  const { isLoading, products, type } = defineProps<{
    isLoading: boolean
    products: IProductParent[]
    type?: 'bestseller'
  }>()

  const { isDesktop, queryProduct } = storeToRefs(useBaseStore())
  const { getListProducts } = useBaseStore()
  const emit = defineEmits<{
    'view-product-info': [product: IProductParent]
  }>()

  const handleChange = (field: 'pageIndex' | 'pageSize', value: number) => {
    queryProduct.value = {
      ...queryProduct.value,
      [field]: value
    }
    getListProducts()
  }
</script>

<style scoped lang="scss">
  .image-container {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.4s ease;
  }

  .first-image,
  .second-image {
    transition: transform 0.4s ease;
  }

  .second-image {
    transform: translateX(100%);
  }

  .slide-active .first-image {
    transform: translateX(-100%);
  }

  .slide-active .second-image {
    transform: translateX(0);
  }
  .fade-in {
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.8s ease-out forwards;
  }

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
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
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
  .pagination {
    :deep(.el-pager) {
      .is-active {
        color: var(--color-primary-dashboard);
      }
    }
  }
</style>

<style lang="scss">
  .my-swiper-mb.swiper {
    text-align: center;
    .swiper-button-prev:after,
    .swiper-button-next:after {
      font-size: 16px !important;
    }
    .swiper-button-next,
    .swiper-rtl .swiper-button-prev {
      color: black;
      right: var(--swiper-navigation-sides-offset, -24px);
      font-weight: 700;
      border: 1px solid #ffffff;
      border-radius: 100%;
      margin-right: 24px;
      width: 36px;
      height: 36px;
      background-color: #ffffff;
    }
    .swiper-button-prev,
    .swiper-rtl .swiper-button-next {
      color: black;
      left: var(--swiper-navigation-sides-offset, -24px);
      font-weight: 700;
      border: 1px solid #ffffff;
      border-radius: 100%;
      margin-left: 24px;
      width: 36px;
      height: 36px;
      background-color: #ffffff;
    }
    .swiper-pagination-bullet-active {
      background: #2b2b2b;
    }
  }
</style>
