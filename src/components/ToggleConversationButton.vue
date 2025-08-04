<template>
  <button class="toggle-conversation-btn" @click="$emit('click')" title="Open AI Conversation">
    <ChatBubbleLeftRightIcon class="toggle-icon" />
  </button>
</template>

<script setup lang="ts">
import { ChatBubbleLeftRightIcon } from '@heroicons/vue/24/outline'
defineEmits(['click'])
</script>

<style scoped>
.toggle-conversation-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  background: #008C8E;
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 140, 142, 0.3);
  transition: all 0.2s ease;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-conversation-btn:hover {
  background: #007a7c;
  box-shadow: 0 6px 16px rgba(0, 140, 142, 0.4);
  transform: translateY(-2px);
}

.toggle-icon {
  width: 24px;
  height: 24px;
}
</style>
