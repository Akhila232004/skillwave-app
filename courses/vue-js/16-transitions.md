# Transitions & Animations

Use `<Transition>` with class hooks; `<TransitionGroup>` for lists.

```vue
<template>
  <Transition name="fade">
    <p v-if="show">Hello</p>
  </Transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .2s }
.fade-enter-from, .fade-leave-to { opacity: 0 }
</style>
```
**Expected output:** Paragraph fades in/out when `show` toggles.
