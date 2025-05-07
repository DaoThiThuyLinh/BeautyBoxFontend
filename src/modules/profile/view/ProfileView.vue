<template>
  <div class="container mx-auto my-20 flex items-start justify-between max-sm:my-10 max-sm:block">
    <div class="w-1/4 max-sm:w-full">
      <ul class="flex flex-col gap-4 max-sm:flex-row">
        <li
          class="cursor-pointer text-base hover:font-bold"
          :class="{ 'font-bold': activeBlock === 'account' }"
          @click="handleActiveBlock('account')"
        >
          Tài khoản
        </li>
        <li
          class="cursor-pointer text-base hover:font-bold"
          :class="{ 'font-bold': activeBlock === 'order' }"
          @click="handleActiveBlock('order')"
        >
          Đơn hàng
        </li>
        <li
          class="cursor-pointer text-base hover:font-bold"
          :class="{ 'font-bold': activeBlock === 'address' }"
          @click="handleActiveBlock('address')"
        >
          Địa chỉ giao nhận
        </li>
      </ul>
    </div>
    <div class="w-3/4 max-sm:w-full">
      <BlockAccount v-if="activeBlock === 'account'" />
      <BlockOrder v-if="activeBlock === 'order'" class="w-full" />
      <BlockAddress v-if="activeBlock === 'address'" class="w-full" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import pushParams from '@/utils/pushParams'

  import BlockAccount from '../components/BlockAccount.vue'
  import BlockAddress from '../components/BlockAddress.vue'
  import BlockOrder from '../components/BlockOrder.vue'

  const activeBlock = ref('account')
  const route = useRoute()
  if (route.query.blockActive) {
    activeBlock.value = route.query.blockActive as string
  }

  const handleActiveBlock = (block: string) => {
    activeBlock.value = block
    pushParams({ blockActive: block })
  }
</script>

<style scoped></style>
