<template>
  <div class="mt-6 flex gap-4 max-sm:mt-0">
    <BaseInput v-model="value" placeholder="Tìm kiếm" borderRadius="8px" @change="handleSearch" />
    <BaseSelect v-model="orderBy" placeholder="Sắp xếp" clearable teleported class="w-44" @change="emit('filter')">
      <ElOption v-for="item in ORDER_BY_USER" :key="item.value" :label="item.label" :value="item.value" />
    </BaseSelect>
  </div>
</template>

<script setup lang="ts">
  import { ORDER_BY_USER } from '@/constant'
  import { debounce } from 'lodash-es'

  const emit = defineEmits<{
    filter: []
  }>()
  const value = defineModel('value', { type: String, default: '' })
  const orderBy = defineModel('orderBy', { type: String, default: '' })

  const handleSearch = debounce(() => {
    emit('filter')
  }, 400)
</script>

<style scoped></style>
