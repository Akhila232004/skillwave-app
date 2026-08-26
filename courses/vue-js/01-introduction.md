# Introduction

Vue is a progressive framework for building UIs. **Vue 3** focuses on the **Composition API**, performance, and TypeScript-friendliness.

- **SPA vs MPA vs SSR/SSG**: SPAs run mostly in the browser; SSR/SSG render HTML on the server/build for SEO/perf.
- **Options vs Composition API**: Composition organizes logic by feature, not by option blocks; enables reuse via **composables**.
- Pick **Vue** for approachability, great docs, single-file components, and flexible ecosystem (Vite, Pinia, Router, Nuxt).


<!-- Single File Component example -->
```ts
<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <button @click="count++">Clicked {{ count }} times</button>
</template>
```
**Expected output:** Button increments a reactive counter; template updates automatically.

