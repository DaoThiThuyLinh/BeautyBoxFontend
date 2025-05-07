<template>
  <TheHeader />
  <RouterView />
  <TheFooter />
</template>

<script setup lang="ts">
  import TheFooter from './TheFooter.vue'
  import TheHeader from './TheHeader.vue'
</script>

<style scoped></style>
