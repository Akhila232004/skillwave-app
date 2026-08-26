# Deployment

Static hosting on Netlify/Vercel for SPAs; SSR with Node/Nitro. Add Docker + Nginx if needed, and set proper cache headers.

```dockerfile
# Dockerfile (SPA build served by nginx)
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json pnpm-lock.yaml* ./
RUN npm i -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```
**Expected output:** Container serves the built SPA on port 80 via Nginx.
