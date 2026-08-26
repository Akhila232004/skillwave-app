# Components 101

Register components, pass **props**, emit events, support `v-model`, and use slots.

```ts

<!-- Counter.vue -->
<script setup lang="ts">
import { ref, defineEmits, defineProps } from 'vue'
const props = defineProps<{ step?: number }>() 
const emit = defineEmits<{ (e:'update:modelValue', v:number):void }>()
const count = ref(0)
function inc(){ count.value += props.step ?? 1; emit('update:modelValue', count.value) }
</script>
<template><button @click="inc">Count {{ count }}</button></template>

<!-- Parent.vue -->
<script setup lang="ts">
import Counter from './Counter.vue'
import { ref } from 'vue'
const value = ref(0)
</script>
<template>
  <Counter v-model="value" :step="2" />
  <p>Parent value: {{ value }}</p>
</template>
```
**Expected output:** Click increments by 2 and syncs to parent via `v-model`.
