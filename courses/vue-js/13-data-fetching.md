# HTTP & Data Fetching

Use `fetch` or Axios. Handle loading, error, and empty states.

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
const items = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/items')
    if(!res.ok) throw new Error('Failed')
    items.value = await res.json()
  } catch(e:any){ error.value = e.message } 
  finally { loading.value = false }
})
</script>

<template>
  <p v-if="loading">Loading...</p>
  <p v-else-if="error">{{ error }}</p>
  <ul v-else><li v-for="i in items" :key="i.id">{{ i.name }}</li></ul>
</template>
```
**Expected output:** Graceful UX across states; no errors leak to console.
