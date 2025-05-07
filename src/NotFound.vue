<template>
  <div class="flex h-screen items-center justify-center bg-gray-50">
    <div class="flex h-full w-screen flex-col justify-between text-center">
      <div class="flex h-full flex-col justify-center">
        <div class="space-y-2">
          <h1
            class="animate-pulse bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-9xl font-extrabold text-transparent"
          >
            404
          </h1>
          <h2 class="mt-6 text-3xl font-bold text-gray-900">
            {{ t('pageNotFound') }}
          </h2>
          <p class="mt-2 text-sm text-gray-600">
            {{ t('pageNotFoundMessage') }}
          </p>
        </div>

        <div class="relative mt-8">
          <div class="relative">
            <div class="absolute inset-0 flex items-center" aria-hidden="true">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center">
              <span class="bg-gray-50 px-2 text-sm text-gray-500">
                {{ t('lostQuestion') }}
              </span>
            </div>
          </div>

          <div class="mt-8 flex justify-center space-x-4">
            <div
              @click="goBack"
              class="flex cursor-pointer items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
            >
              <BaseIcon name="back" class="mr-4" />
              <span> {{ t('goBack') }}</span>
            </div>

            <div
              @click="goHome"
              class="inline-flex cursor-pointer items-center rounded-md border border-transparent bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:from-purple-600 hover:to-pink-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none"
            >
              <BaseIcon name="home" class="mr-4" />
              <span>{{ t('goHome') }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-12">
        <div class="relative h-40 w-full">
          <div
            v-for="(star, index) in stars"
            :key="index"
            :style="{
              left: `${star.x}%`,
              top: `${star.y}%`,
              animationDelay: `${star.delay}s`,
              width: `${star.size}px`,
              height: `${star.size}px`
            }"
            class="animate-twinkle absolute rounded-full bg-purple-400"
          ></div>
          <div class="absolute bottom-0 w-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" class="w-full">
              <path
                fill="#8B5CF6"
                fill-opacity="0.2"
                d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,202.7C672,203,768,181,864,181.3C960,181,1056,203,1152,208C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
          <div class="absolute bottom-0 w-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" class="w-full">
              <path
                fill="#EC4899"
                fill-opacity="0.2"
                d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,229.3C672,245,768,267,864,261.3C960,256,1056,224,1152,213.3C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'

  interface Star {
    x: number
    y: number
    size: number
    delay: number
  }

  // Router setup
  const router = useRouter()

  // Navigation functions
  const goBack = () => {
    router.back()
  }

  const goHome = () => {
    router.push('/')
  }

  // Internationalization function (simplified)
  const t = (key: string): string => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        pageNotFound: 'Page Not Found',
        pageNotFoundMessage: "Sorry, we couldn't find the page you're looking for.",
        lostQuestion: 'Are you lost?',
        goBack: 'Go Back',
        goHome: 'Go Home'
      }
      // Add more languages as needed
    }

    // Get browser language or default to English
    const locale = navigator.language.split('-')[0] || 'en'
    const localeTranslations = translations[locale] || translations.en

    return localeTranslations[key] || key
  }

  // Generate random stars for the background
  const stars = ref<Star[]>([])

  onMounted(() => {
    // Generate 50 random stars
    for (let i = 0; i < 50; i++) {
      stars.value.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 5
      })
    }
  })
</script>

<style>
  @keyframes twinkle {
    0%,
    100% {
      opacity: 0.2;
      transform: scale(0.5);
    }
    50% {
      opacity: 1;
      transform: scale(1);
    }
  }

  .animate-twinkle {
    animation: twinkle 3s infinite ease-in-out;
  }
</style>
