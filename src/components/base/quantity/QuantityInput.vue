<template>
  <div class="flex items-center space-x-2">
    <button
      class="h-8 w-8 cursor-pointer rounded-md border border-[#dbdbdb] text-lg hover:border-[var(--color-primary-light)] max-sm:h-6 max-sm:w-6 max-sm:text-sm"
      @click="decreaseQuantity"
    >
      -
    </button>
    <input
      :value="modelValue"
      @input="updateValue($event)"
      class="input-number h-8 w-16 rounded-md border border-[#dbdbdb] text-center outline-none max-sm:h-6 max-sm:w-12 max-sm:text-sm"
      type="number"
      min="1"
    />
    <button
      class="h-8 w-8 cursor-pointer rounded-md border border-[#dbdbdb] text-lg hover:border-[var(--color-primary-light)] max-sm:h-6 max-sm:w-6 max-sm:text-sm"
      @click="increaseQuantity"
    >
      +
    </button>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    modelValue: number
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: number): void
  }>()

  const updateValue = (event: Event) => {
    const value = parseInt((event.target as HTMLInputElement).value) || 1
    emit('update:modelValue', value)
  }

  const decreaseQuantity = () => {
    if (props.modelValue > 1) {
      emit('update:modelValue', props.modelValue - 1)
    }
  }

  const increaseQuantity = () => {
    emit('update:modelValue', props.modelValue + 1)
  }
</script>

<style scoped>
  .input-number::-webkit-inner-spin-button,
  .input-number::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .input-number {
    -moz-appearance: textfield;
  }
</style>
