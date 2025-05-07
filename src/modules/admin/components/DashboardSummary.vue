<template>
  <BaseLoading v-if="isLoading" />
  <Swiper
    v-else-if="isDesktop"
    ref="{swiperRef}"
    :modules="modules"
    :navigation="true"
    :cssMode="true"
    :slidesPerView="4"
    :spaceBetween="24"
    class="mySwiper my-swiper"
  >
    <SwiperSlide v-for="(item, index) in summaries" :key="index">
      <div class="space-y-6 rounded-lg bg-[var(--color-dashboard-bg-light)] p-6">
        <div class="flex items-center justify-between">
          <span class="opacity-60">{{ item.title }}</span>
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
            <BaseIcon :name="item.icon" class="opacity-80" :style="{ color: item.color }" />
          </div>
        </div>
        <p class="text-left text-xl font-bold">
          {{ item.isCurrency ? formatCurrency(item.value) : formatNumber(item.value) }}
        </p>
      </div>
    </SwiperSlide>
  </Swiper>
  <template v-else>
    <div v-for="item in summaries" :key="item.value">
      <div class="rounded-lg border border-solid border-[#DBDBDB] px-4 py-6">
        <div class="mb-2 flex items-center justify-between">
          <span class="text-[#5B616E] sm:text-xs">{{ item.title }}</span>
          <base-icon
            :name="item.icon"
            :size="isDesktop ? 24 : 20"
            :style="{ color: item.color }"
            :class="{ 'fix-icon': item.fixIcon }"
          />
        </div>
        <p class="text-left text-xl font-bold">
          {{ item.isCurrency ? formatCurrency(item.value) : formatNumber(item.value) }}
        </p>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
  import 'swiper/css'
  import 'swiper/css'
  import 'swiper/css/effect-fade'
  import 'swiper/css/navigation'
  import 'swiper/css/pagination'
  import { Autoplay, Navigation, Pagination } from 'swiper/modules'
  import { Swiper, SwiperSlide } from 'swiper/vue'

  import type { ISummary } from '@/types/dashboard.types'

  import formatCurrency from '@/utils/formatCurrency'
  import formatNumber from '@/utils/formatNumber'

  import { useBaseStore } from '@/stores/base.store'

  const modules = [Pagination, Navigation, Autoplay]
  const { isDesktop } = storeToRefs(useBaseStore())
  const { summaries, isLoading } = defineProps<{
    summaries: ISummary[]
    isLoading: boolean
  }>()
</script>

<style lang="scss">
  .my-swiper.swiper {
    text-align: center;
    padding: 0 24px;

    .swiper-button-prev:after,
    .swiper-button-next:after {
      font-size: 20px !important;
    }
    .swiper-button-next,
    .swiper-rtl .swiper-button-prev {
      color: var(--color-text-primary);
      font-weight: 700;
      border: 1px solid #ffffff;
      border-radius: 100%;
      margin-right: -12px;
      width: 48px;
      height: 48px;
      background-color: #ffffff;
    }
    .swiper-button-prev,
    .swiper-rtl .swiper-button-next {
      color: var(--color-text-primary);
      font-weight: 700;
      border: 1px solid #ffffff;
      border-radius: 100%;
      margin-left: -12px;
      width: 48px;
      height: 48px;
      background-color: #ffffff;
    }
    .swiper-pagination-bullet-active {
      background: #2b2b2b;
    }
  }
</style>
