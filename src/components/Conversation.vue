<template>
  <transition name="slide-panel">
    <div v-if="open" class="conversation-panel">
      <button class="close-btn" @click="$emit('close')">×</button>
      <div class="conversation-content">
        <!-- Existing conversation UI -->
        <slot />
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
const props = defineProps({
  open: { type: Boolean, default: false }
})
defineEmits(['close'])
</script>

<style scoped>
.conversation-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 420px;
  height: 100vh;
  background: #fff;
  box-shadow: -2px 0 8px rgba(0,0,0,0.08);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s cubic-bezier(.4,0,.2,1);
}
.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #888;
  z-index: 10;
}
.conversation-content {
  padding: 48px 24px 24px 24px;
  flex: 1;
  overflow-y: auto;
}
.slide-panel-enter-active, .slide-panel-leave-active {
  transition: transform 0.3s cubic-bezier(.4,0,.2,1);
}
.slide-panel-enter-from, .slide-panel-leave-to {
  transform: translateX(100%);
}
.slide-panel-enter-to, .slide-panel-leave-from {
  transform: translateX(0);
}
</style>
