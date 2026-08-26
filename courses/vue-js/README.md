# Vue.js Tutorial (Vue 3 + Composition API)
![Vue Logo](favicon_new.png)

## [projectsetup](./projectsetup.md) 
## 📘 [Introduction](./01-introduction.md)
- What is Vue? Why Vue 3?
- SPA vs MPA vs SSR/SSG
- Options API vs Composition API
- When to pick Vue over React/Angular
---
## 🚀 [Getting Started](./02-getting-started.md)
- Prereqs (Node, npm/pnpm)
- Create with Vite (`npm create vite@latest`)
- Project structure overview
- Dev server, build, preview
---
## 🧰 [Tooling & Project Setup](./03-tooling-setup.md)
- Vite config basics
- ESLint + Prettier
- Editor setup (Volar)
- Environment variables & modes
- Aliases (`@`) and path imports
--- 
## 🧩 [Template Syntax & Directives](./04-template-directives.md)
- Interpolation `{{ }}`
- `v-bind`, `:class`, `:style`
- Events `v-on` / `@click` (+ modifiers)
- Conditionals `v-if` / `v-show`
- Lists `v-for` & keys
- Two-way binding with `v-model` (+ modifiers)
---
## ⚙️ [Reactivity System](./05-reactivity-basics.md)
- `ref`, `reactive`, `shallowRef`, `shallowReactive`
- `computed` & caching
- `watch` vs `watchEffect`
- Deep watching & cleanup
- Reactivity caveats (set/delete, arrays, objects)
---
## 🧠 [Lifecycle & Component Setup](./06-lifecycle-composition.md)
- `setup()` & returned bindings
- Hooks: `onMounted`, `onUpdated`, `onUnmounted`, etc.
- Template refs & DOM access
- Effect scopes
---
## 🧱 [Components 101](./07-components-basics.md)
- Creating & registering components
- Props (types, defaults, validation)
- Emits & custom events
- `v-model` on components
- Slots (default, named, scoped)
---
## 🧵 [Reusable Logic with Composables](./08-composables.md)
- Creating composables
- Parameters, returns, and typing
- Provide/Inject patterns
- Organizing a `composables/` folder
---
## 📝 [Forms & Inputs](./09-forms.md)
- Native inputs & `v-model`
- Controlled vs uncontrolled patterns
- Custom inputs
- Number/text/checkbox/radio/select
- IME & locale considerations
---
## ✅ [Form Validation](./10-validation.md)
- Native validation vs libraries
- VeeValidate + Yup basics
- Error handling UX patterns
- Async validation
---
## 🧭 [Routing with Vue Router](./11-routing.md)
- Install & configure
- Routes, params, queries
- Nested routes & layouts
- Programmatic navigation
- Navigation guards (global/per-route/in-component)
- Lazy loading routes & code splitting
---
## 🗂️ [State Management with Pinia](./12-pinia.md)
- Why Pinia (vs Vuex)
- Defining stores
- State / getters / actions
- Using stores in components
- Store plugins & persistence
---
## 🌐 [HTTP & Data Fetching](./13-data-fetching.md)
- Fetch vs Axios
- Loading, error, empty states
- Caching patterns
- Retrying & backoff
- Cancel tokens / aborting
---
## ⏳ [Async Components & Suspense](./14-suspense-error-boundaries.md)
- Async components
- `<Suspense>` usage
- Error boundaries & fallback UIs
---
## 🎨 [Styling in Vue](./15-styling.md)
- Scoped CSS & global styles
- CSS Modules
- Tailwind CSS + Vue
- Design tokens & theming
---
## 🎛️ [Transitions & Animations](./16-transitions.md)
- `<Transition>` & `<TransitionGroup>`
- Enter/leave classes
- Route transitions
- Integrating animation libraries
---
## 🧲 [Advanced Components](./17-advanced-components.md)
- Dynamic & async components
- `KeepAlive` for caching
- `Teleport` for portals/modals
- Render performance tips
---
## 🧱 [Render Functions & JSX](./18-render-jsx.md)
- When/why to use render functions
- JSX setup with Vite
- Slots & attrs in render functions
---
## 🧪 [Custom Directives](./19-custom-directives.md)
- Directive lifecycle hooks
- Simple examples (focus, click-outside)
- Arguments & modifiers
- Reusability patterns
---
## 🔌 [Plugins (Use & Build)](./20-plugins.md)
- Using community plugins
- Building your own plugin
- Global properties & injections
- Plugin testing
---
## 🌍 [Internationalization (i18n)](./21-i18n.md)
- Vue I18n setup
- Messages, plurals, dates, numbers
- Lazy loading locales
- SEO & i18n routing notes
---
## ♿ [Accessibility (A11y)](./22-accessibility.md)
- Semantics in templates
- Focus management
- Keyboard navigation
- ARIA with Vue patterns
---
## 🧷 [Security & Hardening](./23-security.md)
- XSS, template injection & escaping
- Safe HTML with `v-html` (when & how)
- Auth basics (JWT/OAuth), CSRF notes
- Route-level auth guards
- Secrets & env handling
---
## 🧮 [TypeScript with Vue](./24-typescript.md)
- TS project setup
- Typing props, emits, refs, stores
- DefineComponent & Volar tips
- Composables with generics
---
## 🧪 [Testing Suite](./25-testing.md)
- Unit tests with Vitest + Vue Test Utils
- Snapshot tests
- Mocking router/pinia/axios
- E2E with Cypress/Playwright
- Testing async & transitions
---
## ⚡ [Performance Optimization](./26-performance.md)
- Re-render hotspots & memoization
- `defineComponent`, hoisting, `v-memo`
- Virtualized lists
- Code-splitting & prefetch
- Image optimization
- Profiling with Devtools
---
## 📦 [Modules & Architecture](./27-architecture.md)
- Feature-folder structure
- Design system components
- Large-app conventions
- Dependency boundaries
---
## 🧱 [Micro-Frontends & Monorepos](./28-mfe-monorepo.md)
- When to consider MFEs
- Module Federation basics (Vite/Rspack)
- PNPM workspaces & Turbo
---
## 📚 [UI Libraries & Ecosystem](./29-ui-ecosystem.md)
- Vuetify, Element Plus, PrimeVue
- Headless UI patterns
- Storybook setup for Vue
- Building a design system
---
## 📊 [Charts, Tables, Maps](./30-charts-dataviz.md)
- Charting (Chart.js/ECharts)
- Data tables (AG Grid, TanStack Table)
- Maps (Leaflet/Mapbox)
- Infinite scroll & virtualization
---
## 🔁 [Real-Time Apps](./31-realtime.md)
- WebSockets basics
- SSE & WebRTC notes
- State sync and presence
- Optimistic UI patterns
---
## 🔺 [GraphQL with Vue](./32-graphql.md)
- Apollo Client setup
- Queries, mutations, subscriptions
- Caching & normalization
- Error & loading states
---
## 📦 [File & Image Handling](./33-files-images.md)
- File uploads (native/Dropzone)
- Previews, progress, cancel
- Image cropping/compression
- S3/GCS signed URLs patterns
---
## 📈 [Analytics & Monitoring](./34-analytics-monitoring.md)
- Page & event analytics
- Logging & user timing
- Sentry/TrackJS integration
- RUM metrics (CLS/LCP/TTI)
---
## 🔎 [SEO & Meta](./35-seo-meta.md)
- Meta tags & social cards
- Sitemap & robots
- SPA SEO limitations
- Prerendering strategies
---
## 📱 [PWA & Offline](./36-pwa.md)
- Service workers
- Caching & offline patterns
- Push notifications
- App manifests
---
## 🏗️ [SSR/SSG with Nuxt 3 (Optional)](./37-nuxt-ssr-ssg.md)
- Nuxt architecture (pages/layouts)
- Data fetching (`useAsyncData`, `useFetch`)
- Nitro server routes
- Runtime config & envs
- Deploy SSR vs SSG
---
## 🔁 [Migrations & Upgrades](./38-migrations.md)
- Vue 2 → Vue 3 migration notes
- Options API → Composition API tips
- Deprecations & compatibility
---
## 🧯 [Error Handling](./39-error-handling.md)
- Global error handlers
- Component-level try/catch patterns
- UX for broken states & retries
---
## 🛠️ [CI/CD & DevOps](./40-ci-cd.md)
- Lint/test/build pipelines
- Preview deployments
- Versioning & changelogs
- Feature flags
---
## 🚢 [Deployment](./41-deployment.md)
- Static hosting (Netlify/Vercel)
- SSR hosting (Node, Nitro adapters)
- Docker + Nginx basics
- Caching/CDN best practices
---
## 🧩 [Advanced Patterns](./42-advanced-patterns.md)
- Renderless components
- State machines (XState) in Vue
- RxJS with Vue for streams
- Inversion of Control patterns
---
## 🎓 [Capstone Projects](./43-capstones.md)
- 1) CRUD Admin + Auth (SPA)
- 2) Ecommerce Front (Pinia + Router)
- 3) Realtime Chat (WebSockets)
- 4) Analytics Dashboard (Charts + Virtualized lists)
- 5) Nuxt 3 Blog (SSG + i18n + SEO) 
---
### 📘 Conclusion
Master the **Composition API**, routing, and state with Pinia; layer in testing, performance, security, and deployment to produce production-grade Vue apps.

> © TINITIATE.COM
