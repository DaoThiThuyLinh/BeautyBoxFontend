<template>
  <BaseDialog :title="props.title" :name="props.name" :width="props.width">
    <slot></slot>
    <template #footer>
      <div class="flex justify-end space-x-5">
        <BaseButton type="outline" round-size="lg" class="w-24" @click="setOpenDialog(props.name, false)">Hủy</BaseButton>
        <BaseButton
          :is-loading="props.isLoading"
          type="secondary"
          round-size="lg"
          :class="classButtonPrimary"
          @click="emit('confirm')"
          >{{ props.nameButtonPrimary }}</BaseButton
        >
      </div>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
  import type { DIALOG_NAME } from '@/types/dialog.types'

  import { useBaseStore } from '@/stores/base.store'

  interface IProp {
    width?: string
    name?: DIALOG_NAME
    isLoading: boolean
    title: string
    nameButtonPrimary: string
    classButtonPrimary?: string
  }
  const props = withDefaults(defineProps<IProp>(), {
    isLoading: false,
    width: '450',
    name: 'dialog-confirm',
    title: '',
    nameButtonPrimary: 'Xác nhận',
    classButtonPrimary: 'w-24'
  })
  const emit = defineEmits<{
    confirm: []
  }>()

  const { setOpenDialog } = useBaseStore()
</script>

<style scoped></style>
