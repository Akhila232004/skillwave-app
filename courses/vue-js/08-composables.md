# Reusable Logic with Composables

Extract reusable logic into `useX` functions.

```ts
// src/composables/useCounter.ts
import { ref } from 'vue'
export function useCounter(initial=0){
  const n = ref(initial)
  const inc = (s=1)=> n.value += s
  const dec = (s=1)=> n.value -= s
  return { n, inc, dec }
}
```
**Expected output:** Import `useCounter` in any component; share logic without sharing state unless designed to.
