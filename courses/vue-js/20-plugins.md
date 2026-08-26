# Plugins (Use & Build)

Register third-party plugins or create your own via `app.use()`.

```ts
export default {
  install(app:any){
    app.config.globalProperties.$log = (...a:any[]) => console.log('[app]', ...a)
  }
}
```
**Expected output:** After `app.use(plugin)`, `this.$log()` is available in components (Options API) or via `getCurrentInstance`.
