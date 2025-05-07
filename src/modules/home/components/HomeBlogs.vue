<template>
  <div class="container mt-8 space-y-7">
    <h1 class="text-center text-[26px] font-bold">TẠP CHÍ BEAUTYBOX</h1>
    <div class="flex items-center justify-center space-x-8 max-sm:flex-wrap max-sm:space-y-2 max-sm:space-x-4">
      <p
        v-for="item in tabs"
        :key="item.value"
        class="hover:text-primary cursor-pointer text-sm text-[#818181]"
        :class="{ '!text-bg-black font-bold': tabActive === item.value }"
        @click="handleActiveTab(item.value)"
      >
        {{ item.label }}
      </p>
    </div>
    <BaseLoading v-if="isLoading" />
    <div v-else class="mb-10">
      <div class="grid w-full grid-cols-3 gap-6 max-sm:hidden">
        <div
          v-for="(blog, index) in blogs"
          :key="blog.id"
          class="fade-in cursor-pointer"
          :style="{ animationDelay: `${index * 200}ms` }"
        >
          <img :src="`https://image.hsv-tech.io/1040x662/${blog.image}`" alt="" class="rounded-lg" />
          <p class="my-2 text-base font-semibold">{{ blog.data.graphData.title }}</p>
          <p v-html="blog.data.detail[0].shortContent" class="line-clamp-3 text-sm opacity-60"></p>
        </div>
      </div>
      <div class="hidden max-sm:block">
        <Swiper
          ref="{swiperRef}"
          :modules="modules"
          :navigation="true"
          :cssMode="true"
          :slidesPerView="1"
          :spaceBetween="24"
          class="mySwiper my-swiper-mb"
        >
          <SwiperSlide
            v-for="(blog, index) in blogs"
            :key="blog.id"
            class="fade-in cursor-pointer"
            :style="{ animationDelay: `${index * 200}ms` }"
          >
            <img :src="`https://image.hsv-tech.io/1040x662/${blog.image}`" alt="" class="rounded-lg" />
            <p class="my-2 text-base font-semibold">{{ blog.data.graphData.title }}</p>
            <p v-html="blog.data.detail[0].shortContent" class="line-clamp-3 text-sm opacity-60"></p>
          </SwiperSlide>
        </Swiper>
      </div>
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

  import type { IBlog } from '@/types/home.types'

  const modules = [Pagination, Navigation, Autoplay]
  const { blogs = [], isLoading = false } = defineProps<{
    blogs: IBlog[]
    isLoading: boolean
  }>()
  const tabActive = ref('NEWS')

  const emit = defineEmits<{
    'change-tab': [value: string]
  }>()
  const tabs = [
    {
      label: 'Tin tức',
      value: 'NEWS'
    },
    {
      label: 'Góc review',
      value: 'REVIEW'
    },
    {
      label: 'Cách chăm sóc da',
      value: 'SKIN'
    },
    {
      label: 'Sự kiện',
      value: 'EVENT'
    },
    {
      label: 'Bí quyết khỏe đẹp',
      value: 'HEALTH'
    }
  ]

  const handleActiveTab = (value: string) => {
    tabActive.value = value
    emit('change-tab', value)
  }
</script>

<style scoped lang="scss">
  .fade-in {
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.8s ease-out forwards;
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
</style>
