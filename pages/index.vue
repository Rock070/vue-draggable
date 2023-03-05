<script setup lang="ts">
import { ref } from 'vue'

import AtomicTreeContainer from '@/components/atomics/AtomicTreeContainer.vue'
import AtomicTreeNode from '@/components/atomics/AtomicTreeNode.vue'
import type { Item } from '@/components/atomics/AtomicTreeNode.vue'

const items = ref<Item[]>([
  {
    value: '1',
    children: [
      {
        value: '1.1',
        children: [
          {
            value: '1.1.1',
          },
        ],
      },
      {
        value: '1.2',
        children: [
          {
            value: '1.2.1',
          },
        ],
      },
    ],
  },
])
</script>

<template>
  <div class="py-10">
    <AtomicTreeContainer>
      <template #default="{ draggedRef, update }">
        <AtomicTreeNode
          :items="items"
          :dragged-ref="draggedRef"
          @update:dragged-ref="update"
        />
      </template>
    </AtomicTreeContainer>
    <pre>items: {{ items }}</pre>
  </div>
</template>
