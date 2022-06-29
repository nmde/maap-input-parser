<template>
  <div class="surface-section h-screen border-right-1 surface-border flex flex-column w-18rem select-none absolute left-0 top-0">
    <div class="overflow-y-auto">
      <ul class="list-none p-2 m-0">
        <li
          v-for="(item, i) in items"
          :key="i"
        >
          <a
            v-ripple
            class="flex align-items-center cursor-pointer p-3 text-blue-500 hover:surface-100 border-round transition-colors transition-duration-150 p-ripple"
          >
            <i
              v-if="item.icon"
              :class="`pi pi-${item.icon} mr-2`"
            />
            <span class="font-medium">{{ item.title }}</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { default as vRipple } from 'primevue/ripple';

const props = defineProps<{
  items: {
    href: string;
    icon?: string;
    title: string;
  }[];
}>();

console.log(props.items);
</script>

<style scoped>
</style>
