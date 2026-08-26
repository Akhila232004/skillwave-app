# Advanced Patterns

Renderless components via slots, state machines with XState, and RxJS streams for advanced interactions.

```vue
<!-- Renderless pattern -->
<template><slot :open="open" :toggle="toggle" /></template>
```
**Expected output:** Consumers provide their own markup while reusing logic.
