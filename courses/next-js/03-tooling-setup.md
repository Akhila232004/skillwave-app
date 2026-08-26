# Tooling & Project Setup

## TypeScript
Next.js ships with TS support; auto-generates `tsconfig.json`.

```bash
pnpm add -D typescript @types/react @types/node
```
**Expected result:** Project compiles with TypeScript, strict mode recommended.

## ESLint + Prettier
```bash
pnpm add -D eslint prettier eslint-config-next
```
Create `.eslintrc.json`:
```json
{
  "extends": ["next/core-web-vitals", "prettier"]
}
```
**Expected result:** Consistent formatting; CI can run `pnpm lint`.

## Path Aliases
`tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./*"] }
  }
}
```
**Expected result:** Import as `@/components/Button` instead of long relative paths.

## Env & Runtime Separation
- Secret server env: `.env` (never expose)
- Public env: `NEXT_PUBLIC_*`

```ts
// lib/env.ts
export const isProd = process.env.NODE_ENV === "production";
```
**Expected result:** Secrets only on server; public vars on client.
