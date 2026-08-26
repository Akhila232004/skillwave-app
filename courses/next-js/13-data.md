# Databases & ORM

## Prisma example
```bash
pnpm add prisma @prisma/client
pnpm exec prisma init --datasource-provider sqlite
```
```prisma
// prisma/schema.prisma
datasource db { provider = "sqlite"; url = "file:./dev.db" }
generator client { provider = "prisma-client-js" }
model Todo { id Int @id @default(autoincrement()); title String }
```
```ts
// app/todos/page.tsx
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export default async function Todos(){
  const todos = await prisma.todo.findMany();
  return <ul>{todos.map(t=> <li key={t.id}>{t.title}</li>)}</ul>;
}
```
**Expected result:** Server component queries DB directly; zero client JS for list.
