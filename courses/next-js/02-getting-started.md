# Getting Started

## Prerequisites
- Node.js LTS, pnpm or npm
- Git

## Create a new app
```bash
pnpm create next-app@latest my-app
cd my-app
pnpm dev
```
**Expected output:** Dev server on `http://localhost:3000` with a starter page.

## Project layout (App Router)
```
app/
  layout.tsx
  page.tsx
  (marketing)/page.tsx
public/
components/
lib/
```
**Expected result:** Routes map to folders in `app/`, `layout.tsx` wraps children.

## Scripts
```bash
pnpm dev     # run dev server
pnpm build   # production build
pnpm start   # run built app
pnpm lint    # lint code
```
**Expected output:** Build artifacts in `.next/`, server ready for deployment.
