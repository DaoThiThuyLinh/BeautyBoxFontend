import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/es/components/message/style/css'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

import App from './App.vue'
import './assets/styles/index.scss'
import './assets/styles/tailwind.css'
import router from './router'
import { useAuthStore } from './stores/auth.store'
import { useBaseStore } from './stores/base.store'

const app = createApp(App)
app.use(ElementPlus)
app.use(VueApexCharts)
app.use(createPinia())

// Configure NProgress
NProgress.configure({
  showSpinner: false,
  minimum: 0.3,
  easing: 'ease',
  speed: 500
})

// Router navigation guards for NProgress
router.beforeEach((_to, _from, next) => {
  NProgress.start()
  next()
})

router.afterEach(() => {
  NProgress.done()
})

const init = async () => {
  const { isLoggedIn } = storeToRefs(useAuthStore())
  const { isDesktop, screenWidth } = storeToRefs(useBaseStore())
  const { getUserInfo } = useAuthStore()
  if (isLoggedIn.value) {
    await getUserInfo()
  }

  isDesktop.value = window.innerWidth > 1023
  // add event resize window
  window.addEventListener('resize', () => {
    screenWidth.value = window.innerWidth
    isDesktop.value = window.innerWidth > 1023
  })
  app.use(router)
  app.mount('#app')
}
init()
