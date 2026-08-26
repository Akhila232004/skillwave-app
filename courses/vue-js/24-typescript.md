# TypeScript with Vue

Use the Vue + TS template; type props, emits, and composables.

```vue
<script setup lang="ts">
type Props = { msg: string }
const props = defineProps<Props>()
</script>
```
**Expected output:** Props validated at compile-time; IDE IntelliSense works well.
