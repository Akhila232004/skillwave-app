# Performance Optimization

Identify hotspots, prefer computed/derived state, split code, and virtualize large lists.

```vue
<!-- v-memo example -->
<template>
  <div v-memo="[id]">{{ renderHeavy(id) }}</div>
</template>
```
**Expected output:** Block only re-renders when reactive deps change; lighter UI under interaction.
