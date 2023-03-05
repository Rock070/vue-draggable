<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { watch } from 'vue';

import debounce from '@/utils/debounce';

export interface Item {
  value: string | number;
  children?: Item[];
}
export interface AtomicTreeNodeProps {
  items: Item[];
  level?: number;
  draggedRef: null | HTMLElement;
}
export interface AtomicTreeNodeEmits {
  (type: 'update:draggedRef', event: HTMLElement | null): void;
}

const props = withDefaults(defineProps<AtomicTreeNodeProps>(), {
  level: 1,
});
const emits = defineEmits<AtomicTreeNodeEmits>();

const updateDragRef = (val: HTMLElement | null) => {
  emits('update:draggedRef', val);
};

const dragged = useVModel(props, 'draggedRef', emits);
const findParent = (
  node: HTMLElement,
  className: string
): HTMLElement | null => {
  let parent = node;
  let yes = false;
  while (parent !== null && !yes) {
    if (parent.classList.contains(className)) {
      yes = true;
      break;
    }
    parent = (node?.parentNode as HTMLElement) ?? null;
    if (!parent) break;
  }

  return parent;
};

watch(
  dragged,
  val => {
    // eslint-disable-next-line no-console
    console.log('watch dragged', val);
  },
  {
    immediate: true,
  }
);

const onDragStart = (e: DragEvent) => {
  const target = e.target as HTMLElement;

  dragged.value = target;
};

const onDragEnter = (e: DragEvent) => {
  const target = e.target as HTMLElement;

  const parent = findParent(target, 'dropzone');
  if (!parent) return;
  if (parent.classList.contains('dropzone')) {
    parent.classList.add('border', 'border-red-200');
  }
};

const onDragEnterImpl = debounce(onDragEnter, 200);

const onDragLeave = (e: DragEvent) => {
  const target = e.target as HTMLElement;
  const parent = findParent(target, 'dropzone');
  if (!parent) return;
  parent.classList.remove('border', 'border-red-200');
};
const onDragLeaveImpl = debounce(onDragLeave, 200);

const onDrop = (e: DragEvent) => {
  const target = e.target as HTMLElement;
  const parent = findParent(target, 'dropzone');

  // move dragged element to the selected drop target
  if (!parent || !dragged.value?.parentNode) return;

  dragged.value.parentNode.removeChild(dragged.value);
  parent.appendChild(dragged.value);

  parent.classList.remove('border', 'border-red-200');
  // emits('update:draggedRef', null);
};
</script>

<template>
  <ul
    v-for="j in items"
    :key="j.value"
    class="dropzone"
    :style="{ 'padding-left': 10 * level + 'px'}"
  >
    <li
      :key="j.value"
      draggable="true"
      class="p-2 m-2 bg-yellow-200 cursor-grab"
      @dragstart="onDragStart"
      @dragenter.prevent="onDragEnterImpl"
      @dragover.prevent
      @dragleave.prevent="onDragLeaveImpl"
      @drop.prevent="onDrop"
    >
      {{ j.value }}
    </li>
    <AtomicTreeNode
      v-if="j.children"
      :dragged-ref="draggedRef"
      :items="j.children"
      :level="level + 1"
      @update:dragged-ref="updateDragRef"
    />
  </ul>
</template>



<style scoped>
.smooth-dnd {
  &-card-ghost {
    @apply transition-all;
    @apply origin-center;
    @apply scale-75;
  }

  &-card-ghost-drop {
    transition: transform 0.18s ease-in-out;
    transform: scale(100%);
  }

  &-drop-preview {
    @apply bg-slate-200;
    @apply border border-dashed border-gray-300;
    @apply m-1;
  }
}
</style>
