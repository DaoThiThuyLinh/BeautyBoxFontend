<template>
  <div class="layout-admin h-screen max-sm:!p-0">
    <div class="h-full rounded-2xl bg-white max-sm:rounded-none">
      <ElContainer class="h-full">
        <TheSidebar v-if="isDesktop" />
        <ElContainer direction="vertical">
          <TheHeader />
          <ElScrollbar :always="true" class="h-full">
            <ElMain style="padding: 0 24px 24px 24px">
              <RouterView />
            </ElMain>
          </ElScrollbar>
          <!-- <TheFooter class="mx-auto" /> -->
        </ElContainer>
      </ElContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useBaseStore } from '@/stores/base.store'

  // import TheFooter from './TheFooter.vue'
  import TheHeader from './TheHeader.vue'
  import TheSidebar from './TheSidebar.vue'

  const { isDesktop } = storeToRefs(useBaseStore())
</script>

<style scoped lang="scss">
  .layout-admin {
    background-color: var(--color-dashboard-bg);
    padding: 24px;
  }
</style>
