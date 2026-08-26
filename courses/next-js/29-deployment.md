# Deployment

## Vercel
- Zero-config; supports Edge/Node routes and RSC.

## Docker
```dockerfile
# Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json pnpm-lock.yaml* ./
RUN npm i -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm","start"]
```
**Expected result:** Container runs production build on port 3000.

## Static export
- `output: "export"` for pure static—but note server features won't work.
