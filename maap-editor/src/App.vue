<template>
  <NavigationSidebar :items="sidebarItems" />
</template>

<script setup lang="ts">
import NavigationSidebar from './components/NavigationSidebar.vue';

const sidebarItems = [
  {
    href: 'parameters',
    icon: 'sliders-h',
    title: 'Parameters',
  },
  {
    href: 'initiators',
    icon: 'sliders-v',
    title: 'Initiators',
  },
];
</script>

<style>
body {
  font-family: var(--font-family);
}
</style>
