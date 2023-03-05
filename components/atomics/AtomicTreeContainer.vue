<script setup lang="ts">
import { ref } from 'vue'

const draggedRef = ref<HTMLElement | null>(null)
const updateDraggedRef = (el: HTMLElement | null) => {
  draggedRef.value = el
}
</script>

<template>
  <div>
    draggedRef: {{ draggedRef }}
    <slot
      :dragged-ref="draggedRef"
      :update="updateDraggedRef"
    />
  </div>
</template>
