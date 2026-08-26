# Async Components & Suspense

Wrap async components with `<Suspense>` and provide a fallback.

```vue
<template>
  <Suspense>
    <AsyncWidget />
    <template #fallback>Loading widget…</template>
  </Suspense>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
const AsyncWidget = defineAsyncComponent(() => import('./Widget.vue'))
</script>
```
**Expected output:** Fallback shows while the async component loads; then swaps to the widget.
