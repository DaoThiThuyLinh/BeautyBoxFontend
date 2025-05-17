<template>
  <ElAside width="200px" class="sidebar flex flex-col items-start justify-between">
    <div>
      <img
        src="/images/logo.png"
        alt=""
        class="mb-6 h-16 cursor-pointer object-contain"
        loading="lazy"
        @click="router.replace({ name: 'Home' })"
      />
      <RouterLink
        v-for="item in LIST_MENU"
        :key="item.value"
        class="menu flex w-full cursor-pointer items-center justify-start space-x-2 p-2"
        v-slot="{ navigate, isActive }"
        :to="{ name: item.routerName }"
        custom
      >
        <div :class="{ 'active-link': isActive }" @click="navigate">
          <BaseIcon :name="item.icon" />
          <span>{{ item.label }}</span>
        </div>
      </RouterLink>
    </div>

    <div class="menu flex cursor-pointer items-center justify-start space-x-2" @click="logout">
      <BaseIcon name="logout" />
      <span>Đăng xuất</span>
    </div>
  </ElAside>
</template>

<script setup lang="ts">
  import router from '@/router'

  import { useAuthStore } from '@/stores/auth.store'

  import { LIST_MENU } from '@/constant/index'

  const { logout } = useAuthStore()
</script>

<style scoped lang="scss">
  .sidebar {
    padding: 24px;
    background-color: var(--color-dashboard-bg-light);
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    .menu {
      margin: 8px 0;
      &:hover {
        color: var(--color-primary-dashboard);
      }
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
