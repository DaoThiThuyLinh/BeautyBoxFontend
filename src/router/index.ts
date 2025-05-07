import LIST_ROUTER from '@/modules'
import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '@/stores/auth.store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...LIST_ROUTER.flat(),
    {
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: () => import('../NotFound.vue')
    }
  ]
})

router.beforeEach((to, _from, next) => {
  const { isLoggedIn, isAdmin } = storeToRefs(useAuthStore())
  const containsAdmin = computed(() => to.fullPath.includes('/admin'))

  if (!isLoggedIn.value) {
    if (to.meta.auth) {
      ElMessage.error('Bạn không có quyền truy cập vào trang này. Vui lòng đăng nhập!')
      return next({ name: 'Home' })
    }
  } else {
    if (to.path === '/login') {
      return next({ name: 'Home' })
    }

    if (containsAdmin.value && (!to.meta.auth || !isAdmin.value)) {
      ElMessage.error('Bạn không có quyền truy cập vào trang này')
      return next({ name: 'Home' })
    }
  }

  next()
})

export default router
