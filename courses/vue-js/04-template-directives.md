# Template Syntax & Directives

Core template features: interpolation, binds, events, conditionals, lists, and `v-model`.

```ts
<script setup lang="ts">
import { ref } from 'vue'
const name = ref('Ada')
const show = ref(true)
const list = ref(['one','two','three'])
const input = ref('')
</script>

<template>
  <h1>Hello, {{ name }}</h1>

  <p :class="{ highlight: show }">Conditional class</p>
  <button @click="show = !show">Toggle</button>

  <ul><li v-for="(item,i) in list" :key="i">{{ item }}</li></ul>

  <input v-model.trim="input" placeholder="Type..." />
  <p>Input: {{ input }}</p>
</template>

<style scoped>
.highlight { color: #42b883; }
</style>
```
**Expected output:** Toggle switches a class; list renders; input mirrors with trimming.
