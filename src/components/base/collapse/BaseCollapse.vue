<template>
  <div
    class="base-collapse"
    :class="{ 'base-collapse--on-list': props.isOnList, 'el-collapse is-list': props.isShowDividerHeader }"
  >
    <ElCollapse v-model="isActive">
      <ElCollapseItem name="1">
        <template #title>
          <slot name="title" />
        </template>
        <slot />
      </ElCollapseItem>
    </ElCollapse>
  </div>
</template>

<script setup lang="ts">
  interface IProps {
    isOnList?: boolean
    isShowDividerHeader?: boolean
  }

  const props = withDefaults(defineProps<IProps>(), {
    isOnList: false,
    isShowDividerHeader: false
  })

  const isActive = defineModel<string>({
    default: '0'
  })
</script>

<style scoped lang="scss">
  .base-collapse {
    width: 100%;
    &.base-collapse--on-list {
      :deep(.el-collapse-item__arrow) {
        color: #5b616e;
      }
    }
    :deep(.el-collapse-item__header) {
      height: fit-content;
    }
  }
</style>
