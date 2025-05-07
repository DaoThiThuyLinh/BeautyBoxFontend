<template>
  <div v-if="isDesktop" class="flex items-center justify-between px-6">
    <div class="my-6 text-2xl font-bold">{{ route.meta.title }}</div>
    <div class="flex items-center justify-end space-x-2">
      <img src="/images/avatar-user-default.png" alt="" class="h-12 w-12 rounded-2xl" />
      <p class="flex flex-col items-start">
        <span class="font-semibold">{{ userInfo.name }}</span>
        <span class="text-text-secondary text-sm">Admin</span>
      </p>
    </div>
  </div>

  <div v-else class="mb-6 border-b border-solid border-[var(--border-primary)]">
    <div class="flex items-center justify-between p-4">
      <img
        src="/images/logo.png"
        alt=""
        class="flex h-8 cursor-pointer justify-center"
        loading="lazy"
        @click="
          () => {
            router.replace({ name: 'Home' })
          }
        "
      />
      <div class="flex items-center justify-center gap-4">
        <img src="/images/avatar-user-default.png" alt="" class="h-10 w-10 rounded-full" />
        <BaseIcon name="menu-bar" @click="drawerMenuMb = true" size="24" />
      </div>
    </div>
  </div>
  <ElDrawer :model-value="drawerMenuMb" :show-close="false" size="100%" footer-class="border-t border-gray-200" body-class="!p-0">
    <template #header>
      <div class="flex items-center justify-between">
        <img
          src="/images/logo.png"
          alt=""
          class="flex h-8 cursor-pointer justify-center"
          loading="lazy"
          @click="
            () => {
              router.replace({ name: 'Home' }), (drawerMenuMb = false)
            }
          "
        />
        <BaseIcon name="x-close" class="cursor-pointer" @click="drawerMenuMb = false" />
      </div>
    </template>

    <div class="drawer-menu p-4">
      <RouterLink
        v-for="item in LIST_MENU"
        :key="item.value"
        class="menu flex w-full cursor-pointer items-center justify-start space-x-2 p-2"
        v-slot="{ navigate, isActive }"
        :to="{ name: item.routerName }"
        custom
      >
        <div
          :class="{ 'active-link': isActive }"
          @click="
            () => {
              navigate()
              drawerMenuMb = false
            }
          "
        >
          <BaseIcon :name="item.icon" />
          <span> {{ item.label }}</span>
        </div>
      </RouterLink>
      <div class="menu flex cursor-pointer items-center justify-start space-x-2 p-2" @click="logout">
        <BaseIcon name="logout" />
        <span>Đăng xuất</span>
      </div>
    </div>
  </ElDrawer>
</template>

<script setup lang="ts">
  import { useAuthStore } from '@/stores/auth.store'
  import { useBaseStore } from '@/stores/base.store'

  import { LIST_MENU } from '@/constant/index'

  const route = useRoute()
  const { userInfo } = storeToRefs(useAuthStore())
  const { isDesktop } = storeToRefs(useBaseStore())
  const drawerMenuMb = ref(false)
  const router = useRouter()
  const { logout } = useAuthStore()
</script>

<style scoped lang="scss">
  .drawer-menu {
    padding: 24px;
    background-color: var(--color-dashboard-bg-light);
    border-top-left-radius: 8px;
    .menu {
      border-bottom-left-radius: 8px;
      margin: 8px 0;
    }
    .active-link {
      background-color: var(--color-primary-dashboard);
      color: var(--color-content);
      border-radius: 8px;
    }
    .active-link:hover {
      color: var(--color-content);
    }
  }
</style>
