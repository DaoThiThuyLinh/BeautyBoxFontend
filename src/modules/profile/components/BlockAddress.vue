<template>
  <div class="flex items-center justify-between max-sm:mt-6">
    <div class="mb-6 text-2xl font-bold max-sm:text-lg">Địa chỉ giao nhận</div>
    <BaseButton type="tertiary" class="w-40" size="medium" @click="setOpenDialog('dialog-add-address')"
      ><span class="max-sm:text-sm">+ Thêm địa chỉ</span></BaseButton
    >
  </div>
  <BaseLoading v-if="isLoadingAddress" />
  <template v-else>
    <div
      v-if="listAddress.length"
      class="mt-6 grid grid-cols-1 gap-6 space-y-4 max-sm:space-y-0 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
    >
      <div v-for="address in listAddress" :key="address.id" class="h-fit rounded-lg border border-gray-200">
        <div class="flex items-center justify-between border-b border-gray-200 p-4">
          <p class="flex items-center gap-2">
            <span class="text-sm font-semibold">{{ address.name }}</span>
            <span v-if="address.isDefault" class="text-sm text-[#2d89de]">Mặc định</span>
          </p>
          <div v-if="isDeleteLoading && address.id === deleteAddressId" class="is-loading">
            <BaseIcon name="loading" />
          </div>
          <div v-else class="flex items-center gap-2">
            <BaseIcon v-if="!address.isDefault" name="edit" class="cursor-pointer" @click="handleSetDefaultAddress(address.id)" />
            <BaseIcon name="trash" class="cursor-pointer" @click="handleDeleteAddress(address.id)" />
          </div>
        </div>
        <div class="p-4">
          <p class="text-sm font-semibold">{{ address.recipientName }}</p>
          <p class="text-sm">{{ address.recipientPhoneNumber }}</p>
          <div class="text-sm">
            {{ address.detailAddress }}, {{ address.commune }}, {{ address.district }}, {{ address.province }}
          </div>
        </div>
      </div>
    </div>

    <BaseEmpty v-else class="mt-40" />
  </template>
  <DialogConfirm
    :is-loading="isSetDefaultAddressLoading"
    title="Xác nhận thiết lập"
    name="dialog-confirm-set-address-default"
    name-button-primary="Xác nhận"
    class-button-primary="w-32"
    @confirm="handleSetDefaultAddress(setDefaultAddressId, 'CONFIRM')"
  >
    <p>Bạn chắn chắn muốn đặt địa chỉ này làm địa chỉ mặc định không</p>
  </DialogConfirm>
  <DialogAddAddress @reload="getAddress" />
</template>

<script setup lang="ts">
  import { apiProfile } from '@/services'

  import { useBaseStore } from '@/stores/base.store'

  import DialogAddAddress from './DialogAddAddress.vue'

  const { setOpenDialog, getAddress } = useBaseStore()
  const { listAddress, isLoadingAddress } = storeToRefs(useBaseStore())

  onMounted(() => {
    getAddress()
  })

  const isDeleteLoading = ref(false)
  const deleteAddressId = ref('')
  const isSetDefaultAddressLoading = ref(false)
  const setDefaultAddressId = ref('')

  const handleDeleteAddress = async (id: string) => {
    deleteAddressId.value = id
    isDeleteLoading.value = true
    try {
      await apiProfile.deleteAddress(id)
      ElNotification({
        title: 'Success',
        message: 'Đã xóa địa chỉ thành công',
        type: 'success'
      })
      getAddress()
    } catch (error) {
      console.log(error)
    }
    isDeleteLoading.value = false
  }

  const handleSetDefaultAddress = async (id: string, type?: 'CONFIRM') => {
    setDefaultAddressId.value = id
    if (type === 'CONFIRM') {
      isSetDefaultAddressLoading.value = true
      try {
        await apiProfile.setDefaultAddress(id)
        ElNotification({
          title: 'Success',
          message: 'Đã thiết lập địa chỉ mặc định thành công',
          type: 'success'
        })
        setOpenDialog('dialog-confirm-set-address-default', false)
        getAddress()
      } catch (error) {
        console.log(error)
      }
      isSetDefaultAddressLoading.value = false
    } else {
      setOpenDialog('dialog-confirm-set-address-default')
    }
  }
</script>

<style scoped lang="scss">
  .is-loading {
    color: var(--color-text-primary);
    margin-right: 6px;
    cursor: default;
    pointer-events: none;
    animation: rotating 2s linear infinite;
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
