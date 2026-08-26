# Styling (CSS/Tailwind)

## Global & Modules
- `app/globals.css` for app-wide styles.
- `Component.module.css` for scoped styles.

## Tailwind
```bash
pnpm add -D tailwindcss postcss autoprefixer
pnpm exec tailwindcss init -p
```
Add to `globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
**Expected result:** Utility classes available across the app.

## Themes
Use CSS variables and `data-theme` or class toggles (`dark`).

## shadcn/ui (optional)
- Quickly scaffold accessible components backed by Radix.
