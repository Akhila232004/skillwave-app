# Reactivity System

Use `ref` for primitives and `reactive` for objects; derive values with `computed`; observe with `watch`/`watchEffect`.

```ts
<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'

const count = ref(0)
const state = reactive({ price: 10, qty: 2 })
const total = computed(() => state.price * state.qty)

watch(count, (n) => console.log('count ->', n))
</script>

<template>
  <button @click="count++">Count: {{ count }}</button>
  <p>Total: {{ total }}</p>
</template>
```
**Expected output:** Console logs count changes; total recomputes when `price`/`qty` change.
