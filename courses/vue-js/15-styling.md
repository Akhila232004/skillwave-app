# Styling in Vue

Choose **scoped CSS**, **CSS Modules**, or utility-first (Tailwind). Use design tokens for themes.

```vue
<style scoped>
:root { --brand: #42b883; }
.title { color: var(--brand); }
</style>
```
**Expected output:** Styles apply to the component only when scoped; tokens centralize colors.
