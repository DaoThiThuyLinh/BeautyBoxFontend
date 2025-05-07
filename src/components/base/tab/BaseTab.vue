<template>
  <div class="base-tab">
    <ElScrollbar ref="scrollbarRef" horizontal class="hide-scrollbar">
      <div class="flex whitespace-nowrap">
        <div
          v-for="(tab, index) in tabs"
          :key="index"
          :ref="
            el => {
              if (tab.tabValue === model) activeTabRef = el
            }
          "
          class="tab inline-block cursor-pointer font-medium"
          :class="[tab.tabValue === model ? 'active' : null, props.isFullWidth && '!w-full']"
          @click="handleSelectTab(tab)"
        >
          {{ tab.title }}
        </div>
      </div>
    </ElScrollbar>
  </div>
</template>

<script setup lang="ts">
  import type { ITab } from '@/types/component.types'

  interface IProp {
    tabs: ITab[]
    isFullWidth?: boolean
  }

  const props = withDefaults(defineProps<IProp>(), {
    tabs: () => [],
    border: false,
    isFullWidth: false
  })

  const model = defineModel<string | number>({
    required: true,
    default: ''
  })

  const emit = defineEmits<{
    'update:modelValue': [value: string | number]
    change: [tab: ITab]
  }>()

  const scrollbarRef = ref()
  const activeTabRef = ref()

  watch(
    () => model.value,
    () => {
      nextTick(() => {
        if (activeTabRef.value) {
          scrollbarRef.value?.setScrollLeft(activeTabRef.value.offsetLeft - 20)
        }
      })
    },
    { immediate: true }
  )

  const handleSelectTab = (tab: ITab) => {
    emit('update:modelValue', tab.tabValue)
    emit('change', tab)
  }
</script>

<style scoped lang="scss">
  .base-tab {
    background-color: var(--color-dashboard-bg-light);
    border-radius: 12px;
    overflow: hidden;

    :deep(.el-scrollbar__bar.is-horizontal) {
      display: none;
    }

    .tab {
      color: var(--color-text-primary);
      padding: 12px;
      font-size: 16px;
      &:hover {
        color: var(--color-primary-dashboard);
      }
    }
    .active {
      color: var(--color-primary-dashboard) !important;
      border-bottom: 2px solid var(--color-primary-dashboard);
      font-weight: 600;
    }
  }
</style>
