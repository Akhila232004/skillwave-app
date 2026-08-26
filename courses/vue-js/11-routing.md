# Routing with Vue Router

Create a router with nested routes and guards. Lazy-load routes for perf.

```ts
// src/router.ts
import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  { path: '/', component: () => import('@/pages/Home.vue') },
  { path: '/users/:id', component: () => import('@/pages/User.vue') }
]
export const router = createRouter({ history: createWebHistory(), routes })

// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
createApp(App).use(router).mount('#app')
```
**Expected output:** Navigation updates URL without page reload; params available in components.
