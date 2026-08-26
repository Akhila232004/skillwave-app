# Lifecycle & Component Setup

`setup()` is the entry point for Composition API. Use hooks like `onMounted` to run side effects.

```ts
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
const time = ref('')

let id: number | undefined
onMounted(() => {
  id = window.setInterval(() => time.value = new Date().toLocaleTimeString(), 1000)
})
onUnmounted(() => clearInterval(id))
</script>

<template><p>{{ time }}</p></template>
```
**Expected output:** Time updates every second; cleared on unmount.
