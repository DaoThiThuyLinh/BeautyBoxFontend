<template>
  <div
    class="button rounded-full"
    :class="[
      `button--${size}`,
      `button--${type}`,
      `rounded-${roundSize}`,
      { 'button--loading': isLoading, 'button--disabled': isDisabled }
    ]"
    @click="handleClick"
  >
    <div v-if="isLoading" class="is-loading">
      <BaseIcon name="loading" />
    </div>
    <div class="title">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { debounce } from 'lodash-es'

  type Size = 'large' | 'medium' | 'small'
  type Type = 'primary' | 'secondary' | 'plain' | 'disabled' | 'linear' | 'outline' | 'tertiary'

  interface IProps {
    size?: Size
    type?: Type
    isDisabled?: boolean
    isLoading?: boolean
    roundSize?: string
  }

  const props = withDefaults(defineProps<IProps>(), {
    size: 'small',
    type: 'primary',
    disabled: false,
    loading: false,
    roundSize: 'full'
  })

  const emit = defineEmits<{
    click: []
  }>()

  const handleClick = debounce(() => {
    if (props.isLoading) {
      return
    }
    emit('click')
  }, 300)
</script>

<style scoped lang="scss">
  .button {
    @apply flex cursor-pointer items-center justify-center rounded-lg border border-solid bg-transparent select-none;

    .is-loading {
      margin-right: 6px;
    }

    .title {
      font-size: 16px;
    }
  }

  .button {
    &--large {
      height: 56px;
    }

    &--medium {
      height: 44px;
    }

    &--small {
      height: 40px;
    }

    &--primary {
      transition: 0.2s ease-in-out 0s;
      background: var(--color-bg-gradient);
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      &:hover {
        transform: scale(1.05);
      }
      .title {
        color: var(--color-content);
      }
    }

    &--disabled {
      cursor: not-allowed;
      pointer-events: none;
      opacity: 0.5;
      // background: var(--color-bg-gradient-disable);
    }

    &--loading {
      color: var(--color-content);
      cursor: default;
      pointer-events: none;
      .is-loading {
        animation: rotating 2s linear infinite;
      }
    }
    &--secondary {
      transition: 0.2s ease-in-out 0s;
      background: var(--color-primary-dashboard);
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      &:hover {
        transform: scale(1.05);
      }
      .title {
        color: var(--color-content);
      }
    }
    &--tertiary {
      transition: 0.2s ease-in-out 0s;
      background-color: var(--color-text-primary);
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      &:hover {
        transform: scale(1.05);
      }
      .title {
        color: white;
      }
    }
    &--outline {
      transition: 0.2s ease-in-out 0s;
      background-color: transparent;
      border: 1px solid var(--border-primary);
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      &:hover {
        transform: scale(1.05);
        border: 1px solid var(--color-primary-dashboard);
      }
    }
  }

  @keyframes rotating {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
