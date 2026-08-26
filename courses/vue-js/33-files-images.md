# File & Image Handling

Implement uploads with progress/cancel; use signed URLs for S3/GCS.

```ts
const fd = new FormData()
fd.append('file', file)
await fetch('/upload', { method: 'POST', body: fd })
```
**Expected output:** Progress bars show; user can cancel; server returns URLs for use in UI.
