# Advanced Components

Dynamic components, `KeepAlive` cache, and `Teleport` to move DOM to a different target.

```vue
<template>
  <KeepAlive><component :is="current" /></KeepAlive>
  <Teleport to="body"><Modal v-if="open" /></Teleport>
</template>
```
**Expected output:** Swapping preserves state via KeepAlive; modal renders at document.body.
