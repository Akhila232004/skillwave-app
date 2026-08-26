# Forms & Inputs

Use `v-model` with modifiers and build custom inputs that support `v-model`.

```ts
<!-- CustomInput.vue -->
<script setup lang="ts">
const model = defineModel<string>({ default: '' })
</script>
<template><input :value="model" @input="model = ($event.target as HTMLInputElement).value" /></template>

<!-- Usage -->
<CustomInput v-model.trim="name" />
```
**Expected output:** Typing updates bound value; `.trim` removes trailing/leading spaces.
