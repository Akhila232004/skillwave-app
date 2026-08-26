# Error Handling

Provide global error handlers and local try/catch; show user-friendly fallbacks.

```ts
app.config.errorHandler = (err, instance, info) => {
  console.error(err, info)
}
```
**Expected output:** Errors are logged and render a helpful UI instead of blank screens.
