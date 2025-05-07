<template>
  <div class="flex flex-col space-y-3">
    <div class="bg-muted h-72 max-w-[250px] animate-pulse rounded-xl"></div>
    <div class="space-y-2">
      <div class="bg-muted h-4 max-w-[250px] animate-pulse rounded-md"></div>
      <div class="bg-muted h-4 max-w-[200px] animate-pulse rounded-md"></div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
  .bg-muted {
    background: #ddd;
  }
  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.3;
    }
  }
</style>
