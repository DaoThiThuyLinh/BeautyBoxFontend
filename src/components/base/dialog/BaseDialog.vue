<template>
  <ElDialog
    v-model="isOpen"
    :width="width"
    :style="{ 'max-width': '95%' }"
    :modal-class="modalClass"
    :header-class="headerClass"
    :body-class="bodyClass"
    :footer-class="footerClass"
    :append-to-body="appendBody"
    :close-on-press-escape="closePressEscape"
    :close-on-click-modal="closeClickModal"
    :top="top"
    :destroy-on-close="destroyOnClose"
    :show-close="isShowClose"
    class="base-dialog"
    @open="handleOpen"
    @close="handleClose"
    @opened="$emit('opened')"
  >
    <template v-if="isShowHeader" #header>
      <slot name="title">{{ title }}</slot>
    </template>
    <div ref="popupBody" class="popup-content" :style="{ padding }">
      <slot />
    </div>
    <template v-if="isShowFooter" #footer>
      <div class="popup-footer">
        <slot name="footer">
          <div class="flex items-center justify-between space-x-4">
            <BaseButton type="outline" round-size="lg" class="w-24" @click="emit('cancel')">{{ titleBtnSecondary }}</BaseButton>
            <BaseButton
              :is-loading="props.isLoading"
              type="secondary"
              round-size="lg"
              :class="classBtnPrimary"
              @click="emit('save')"
              >{{ titleBtnPrimary }}
            </BaseButton>
          </div>
        </slot>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import { ElDialog } from 'element-plus'
  import { findIndex } from 'lodash-es'

  import type { DIALOG_NAME } from '@/types/dialog.types'

  import { useBaseStore } from '@/stores/base.store'

  const props = defineProps({
    name: {
      type: String as () => DIALOG_NAME,
      required: true
    },
    width: {
      type: String,
      default: '600px'
    },
    appendBody: {
      type: Boolean,
      default: true
    },
    isShowClose: {
      type: Boolean,
      default: true
    },
    isShowHeader: {
      type: Boolean,
      default: true
    },
    isShowFooter: {
      type: Boolean,
      default: true
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    top: {
      type: String,
      default: '5vh'
    },
    closeClickModal: {
      type: Boolean,
      default: false
    },
    closePressEscape: {
      type: Boolean,
      default: true
    },
    padding: {
      type: String,
      default: '24px'
    },
    title: {
      type: String,
      default: ''
    },
    destroyOnClose: {
      type: Boolean,
      default: false
    },
    modalClass: {
      type: String,
      default: ''
    },
    headerClass: {
      type: String,
      default: ''
    },
    bodyClass: {
      type: String,
      default: ''
    },
    footerClass: {
      type: String,
      default: ''
    },
    titleBtnPrimary: {
      type: String,
      default: 'Thêm'
    },
    titleBtnSecondary: {
      type: String,
      default: 'Hủy'
    },
    classBtnPrimary: {
      type: String,
      default: 'w-24'
    }
  })
  const emit = defineEmits<{
    save: []
    cancel: []
    close: []
    open: []
    opened: []
  }>()
  // Store and reactive variables
  const baseStore = useBaseStore()
  const popupBody = ref<HTMLElement | null>(null)

  // Computed property for dialog visibility
  const isOpen = computed({
    get() {
      return findIndex(baseStore.dialog, value => value === props.name) !== -1
    },
    set(value: boolean) {
      baseStore.setOpenDialog(props.name, value)
    }
  })

  // Methods
  const handleOpen = () => {
    emit('open')
  }

  const handleClose = () => {
    emit('close')
  }

  // Expose popupBody for parent components
  defineExpose({ popupBody })
</script>

<style scoped>
  .popup-content {
    scroll-behavior: smooth;
  }
</style>
