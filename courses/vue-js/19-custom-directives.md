# Custom Directives

Directives hook into element lifecycle for low-level DOM work.

```ts
// v-focus
export const vFocus = {
  mounted(el: HTMLElement){ el.focus() }
}
```
**Expected output:** Use as `<input v-focus />` to auto-focus.
