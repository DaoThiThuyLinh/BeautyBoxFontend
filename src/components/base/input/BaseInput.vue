<template>
  <div class="base-input" :style="{ '--border-radius': _props.borderRadius }">
    <ElInput
      v-model="model"
      v-bind="_props"
      @update:model-value="debounceChange"
      @blur="emit('blur', $event)"
      @focus="emit('focus')"
      @keyup.enter="emit('keyup-enter', $event)"
    >
      <template v-if="showIcon" #prefix>
        <slot name="prefix">
          <BaseIcon name="search" />
        </slot>
      </template>
      <template v-if="showSuffix" #suffix>
        <slot name="suffix"> </slot>
      </template>
    </ElInput>
  </div>
</template>

<script setup lang="ts">
  import { debounce } from 'lodash-es'

  type TypeInput = 'text' | 'textarea' | 'password'
  interface IProps {
    type?: TypeInput
    maxlength?: number | string
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    clearable?: boolean
    showPassword?: boolean
    autofocus?: boolean
    showWordLimit?: boolean
    showIcon?: boolean
    showSuffix?: boolean
    borderRadius?: string
    formatter?: (value: string | number) => string
    parser?: (value: string) => string
  }

  const _props = withDefaults(defineProps<IProps>(), {
    type: 'text',
    maxlength: '',
    placeholder: 'Tìm kiếm',
    disabled: false,
    readonly: false,
    clearable: false,
    showPassword: false,
    autofocus: false,
    showWordLimit: false,
    showIcon: false,
    showSuffix: false,
    borderRadius: '42px',
    formatter: (value: string | number) => value.toString(),
    parser: (value: string) => value
  })

  const emit = defineEmits<{
    blur: [e: FocusEvent]
    focus: []
    change: [value: string | number]
    'keyup-enter': [e: KeyboardEvent]
  }>()

  const model = defineModel<string | number>({
    required: true,
    default: 'aaa'
  })

  const debounceChange = debounce((value: string | number) => {
    emit('change', value)
  }, 400)
</script>

<style scoped lang="scss">
  .base-input {
    :deep(.el-input) {
      font-size: 16px;
      .el-input__wrapper {
        background-color: white !important;
        padding-top: 0;
        padding-bottom: 0;
        background-color: transparent;
        border-radius: var(--border-radius, 42px);
        .el-input__inner {
          height: 40px;
        }
      }
      .el-input__wrapper.is-focus {
        box-shadow: 0 0 0 1px #ffb466 !important;
      }
    }
    :deep(.el-input.is-disabled) {
      .el-input__wrapper {
        background-color: #f5f5f5 !important;
      }
    }
  }
</style>
