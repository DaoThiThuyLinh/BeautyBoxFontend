<template>
  <div
    class="base-select"
    :class="{
      'select-prefix': props.showPrefix,
      'hidden-suffix': props.hiddenSuffix,
      'hidden-border': props.hiddenBorder
    }"
  >
    <ElSelect
      v-model="model"
      :placeholder="props.placeholder"
      :popper-class="`popper-base-select ${props.popperClass}`"
      :clearable="clearable"
      :disabled="props.disabled"
      :teleported="props.teleported"
      :suffix-icon="IconArrow"
      :filterable="props.filterable"
      :remote="props.remote"
      :remote-method="remoteMethod"
      :filter-method="filterMethod"
      :reserve-keyword="reserveKeyword"
      :multiple="props.multiple"
      :multiple-limit="props.multipleLimit"
      :popper-options="props.popperOptions"
      :remote-show-suffix="props.remoteShowSuffix"
      :loading="props.loading"
      :loading-text="props.loadingText"
      :no-match-text="props.noMatchText"
      :no-data-text="props.noDataText"
      :default-first-option="props.defaultFirstOption"
      :persistent="props.persistent"
      :fit-input-width="props.fitInputWidth"
      :validate-event="props.validateEvent"
      :offset="props.offset"
      :show-arrow="props.showArrow"
      :placement="props.placement"
      :name="props.name"
      @change="handleChange"
      @blur="emit('blur', $event)"
      @focus="emit('focus')"
      @clear="emit('clear')"
      @visible-change="emit('visible-change', $event)"
    >
      <slot></slot>
    </ElSelect>
    <div v-if="props.showPrefix" class="prefix">
      <BaseIcon :name="props.nameIcon || 'search'" size="20" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import IconArrow from '@/icons/arrow.svg?component'

  import type { ISelect } from '@/types/component.types'

  interface IProps extends ISelect {
    placeholder: string
    popperClass?: string
    teleported?: boolean
    multipleLimit?: number
    nameIcon?: string
    hiddenSuffix?: boolean
    hiddenBorder?: boolean
    popperOptions?: Record<string, any>
  }
  const model = defineModel<any>({
    required: false,
    default: ''
  })
  const props = withDefaults(defineProps<IProps>(), {
    placeholder: 'Select',
    clearable: false,
    popperClass: '',
    teleported: false,
    remote: false,
    nameIcon: '',
    filterable: false,
    multiple: false,
    reserveKeyword: false,
    showPrefix: false,
    hiddenSuffix: false,
    hiddenBorder: false,
    loading: false,
    multipleLimit: 0,
    loadingText: '',
    noMatchText: '',
    noDataText: '',
    persistent: true,
    defaultFirstOption: false,
    fitInputWidth: false,
    validateEvent: false,
    offset: 12,
    showArrow: true,
    placement: 'bottom-start',
    name: 'aflsdflnsd',
    popperOptions: () => ({}),
    remoteMethod: () => '',
    filterMethod: () => '',
    remoteShowSuffix: false
  })
  const emit = defineEmits<{
    'update:modelValue': [value: any]
    blur: [e: FocusEvent]
    focus: []
    change: [value: any]
    clear: []
    'visible-change': [e: boolean]
  }>()

  const handleChange = (value: any) => {
    emit('update:modelValue', value)
    emit('change', value)
  }
</script>

<style scoped lang="scss">
  .base-select {
    :deep(.el-select) {
      width: 100%;
      .el-input {
        &:hover {
          .el-input__wrapper,
          .el-input-group__append {
            border-color: var(--color-bg-warning);
          }
        }
        .el-input__wrapper {
          border: 1px solid #31353e;
          box-shadow: none;
          border-radius: 8px;
          padding-top: 0;
          padding-bottom: 0;
          .el-input__inner {
            height: 38px;
          }
        }

        .el-input__wrapper.is-focus,
        .el-input__wrapper.is-focus + .el-input-group__append {
          border-color: var(--color-bg-warning);
          box-shadow: none !important;
        }
      }

      .el-input.is-focus {
        .el-input__wrapper {
          box-shadow: none !important;
        }
      }
      .el-input__suffix {
        i {
          font-size: 20px;
          color: #667085;
        }
      }
    }
  }
  .select-prefix {
    position: relative;
    :deep(.el-select) {
      .el-input {
        .el-input__wrapper {
          .el-input__inner {
            padding-left: 30px;
          }
        }
      }
    }
    .prefix {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      // left: 12px;
    }
  }

  .hidden-suffix {
    :deep(.el-select) {
      .el-input__suffix {
        display: none !important;
      }
    }
  }

  .hidden-border {
    :deep(.el-select) {
      .el-input__wrapper {
        border: none !important;
        .el-input__inner::placeholder {
          color: #0a0b0d;
        }
      }
    }
  }
</style>
