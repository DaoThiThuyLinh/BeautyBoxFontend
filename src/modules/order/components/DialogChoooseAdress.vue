<template>
  <BaseDialog
    name="dialog-choose-address"
    title="CHỌN ĐỊA CHỈ"
    title-btn-primary="Chọn"
    width="800"
    @open="handleOpen"
    @save="handleSave"
  >
    <div v-for="item in listAddress" :key="item.id" class="w-full">
      <ElRadioGroup v-model="selectedAddress" class="radio-address flex w-full flex-col gap-y-[18px]">
        <ElRadio :value="item.id" :border="false" size="large" class="w-full" :checked="item.isDefault">
          <p class="flex w-full items-center justify-between">
            <span class="text-sm font-semibold">{{ item.recipientName }} | {{ item.recipientPhoneNumber }}</span>
            <span v-if="item.isDefault" class="cursor-pointer text-sm text-[#2d89de]">Mặc định</span>
          </p>
          <p class="w-full text-sm break-words whitespace-normal">
            {{ item.name }} | {{ item.detailAddress }}, {{ item.commune }}, {{ item.district }},
            {{ item.province }}
          </p>
        </ElRadio>
      </ElRadioGroup>
    </div>
  </BaseDialog>
</template>

<script setup lang="ts">
  import { useBaseStore } from '@/stores/base.store'

  const { setOpenDialog } = useBaseStore()
  const { listAddress } = storeToRefs(useBaseStore())

  const selectedAddress = ref()
  const emit = defineEmits<{
    'choose-address': [string]
  }>()
  const handleOpen = () => {
    if (listAddress.value.length) {
      const defaultItem = listAddress.value.find(item => item.isDefault)
      selectedAddress.value = defaultItem ? defaultItem.id : listAddress.value[0].id
    }
  }

  const handleSave = () => {
    emit('choose-address', selectedAddress.value)
    setOpenDialog('dialog-choose-address', false)
  }
</script>

<style scoped lang="scss">
  .radio-address {
    border-bottom: 1px solid #0000000f;
    padding: 24px 0;
    :deep(.el-radio) {
      .el-radio__label {
        width: 100%;
      }
    }
  }
  :deep(.el-radio__input.is-checked) {
    .el-radio__inner {
      background-color: var(--color-primary) !important;
      border-color: var(--color-primary) !important;
    }
  }
  :deep(.el-radio__input.is-checked + .el-radio__label) {
    color: var(--color-text-primary) !important;
    width: 100%;
  }
</style>
