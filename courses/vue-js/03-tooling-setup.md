# Tooling & Project Setup

- Vite config in `vite.config.ts` (plugins, aliases).
- ESLint + Prettier for consistency.
- **Volar** extension for Vue 3 TypeScript.
- Env modes: `.env`, `.env.development`, `.env.production` (expose with `VITE_` prefix).
- Aliases via Vite `resolve.alias` (e.g., `@` to `src`).

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') }
  }
})
```
**Expected output:** Imports like `@/components/Button.vue` work; editor understands paths; ESLint/Prettier enforce style.
