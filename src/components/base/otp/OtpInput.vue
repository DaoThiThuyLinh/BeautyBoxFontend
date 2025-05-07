<template>
  <div class="otp-input">
    <input
      v-for="(digit, idx) in otp"
      :key="idx"
      ref="otpInputs"
      type="text"
      inputmode="numeric"
      maxlength="1"
      class="otp-box"
      v-model="otp[idx]"
      @input="onInput(idx, $event)"
      @keydown.backspace="onBackspace(idx)"
      @paste="onPaste($event)"
      autocomplete="one-time-code"
    />
  </div>
</template>

<script setup lang="ts">
  import { nextTick, ref } from 'vue'

  const otp = ref<string[]>(['', '', '', '', '', ''])
  const otpInputs = ref<(HTMLInputElement | null)[]>([])

  const focusInput = (idx: number) => {
    nextTick(() => {
      otpInputs.value[idx]?.focus()
    })
  }

  function onInput(idx: number, event: Event) {
    const target = event.target as HTMLInputElement
    let value = target.value.replace(/\D/g, '')
    if (value.length > 1) {
      value = value[0]
    }
    otp.value[idx] = value
    if (value && idx < 5) {
      focusInput(idx + 1)
    }
    emitOtpIfComplete()
  }

  function onBackspace(idx: number) {
    if (!otp.value[idx] && idx > 0) {
      focusInput(idx - 1)
    }
  }

  function onPaste(event: ClipboardEvent) {
    const paste = event.clipboardData?.getData('text').replace(/\D/g, '')
    if (paste && paste.length === 6) {
      for (let i = 0; i < 6; i++) {
        otp.value[i] = paste[i]
      }
      nextTick(() => {
        otpInputs.value[5]?.focus()
      })
      emitOtpIfComplete()
      event.preventDefault()
    }
  }

  function emitOtpIfComplete() {
    if (otp.value.every(d => d !== '')) {
      emit('complete', otp.value.join(''))
    }
  }

  defineExpose({ otp })
  const emit = defineEmits(['complete'])
</script>

<style scoped>
  .otp-input {
    display: flex;
    gap: 8px;
  }
  .otp-box {
    width: 40px;
    height: 48px;
    font-size: 2rem;
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 6px;
    outline: none;
    transition: border-color 0.2s;
  }
  .otp-box:focus {
    border-color: #007bff;
  }
</style>
