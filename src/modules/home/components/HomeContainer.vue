<template>
  <BaseLoading v-if="props.isLoadingBanner" />
  <div v-else class="container flex gap-4">
    <div class="h-full" :class="isDesktop ? 'w-4/6' : 'w-full'">
      <Swiper
        ref="{swiperRef}"
        :modules="modules"
        :navigation="true"
        :loop="true"
        :effect="'fade'"
        :cssMode="true"
        :pagination="{
          clickable: true
        }"
        :autoplay="{
          delay: 3000,
          disableOnInteraction: false
        }"
        class="mySwiper my-swiper"
      >
        <SwiperSlide v-for="(item, index) in props.imagesBanner" :key="index">
          <img :src="`https://image.hsv-tech.io/1920x0/${item.image}`" alt="" class="rounded-xl" loading="lazy" />
        </SwiperSlide>
      </Swiper>
    </div>
    <div v-if="isDesktop" class="flex flex-col gap-3.5">
      <img
        src="https://image.hsv-tech.io/1920x0/bbx/common/e5212597-0aaa-4d68-9d30-55b0346698f2.webp"
        alt=""
        class="rounded-xl"
        loading="lazy"
      />
      <img
        src="https://image.hsv-tech.io/1920x0/bbx/common/d9719776-39d9-44d4-9a3c-98168a574ba1.webp"
        alt=""
        class="rounded-xl"
        loading="lazy"
      />
    </div>
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

  import { useBaseStore } from '@/stores/base.store'

  const { isDesktop } = storeToRefs(useBaseStore())
  const modules = [Pagination, Navigation, Autoplay]

  const props = defineProps<{
    imagesBanner: any[]
    isLoadingBanner: boolean
  }>()
</script>

<style lang="scss">
  .my-swiper.swiper {
    text-align: center;
    .swiper-button-prev:after,
    .swiper-button-next:after {
      font-size: 20px !important;
    }
    .swiper-button-next,
    .swiper-rtl .swiper-button-prev {
      color: black;
      right: var(--swiper-navigation-sides-offset, -8px);
      font-weight: 700;
      border: 1px solid #ffffff;
      border-radius: 100%;
      margin-right: 24px;
      width: 48px;
      height: 48px;
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
      width: 48px;
      height: 48px;
      background-color: #ffffff;
    }
    .swiper-pagination-bullet-active {
      background: #2b2b2b;
    }
  }
</style>
