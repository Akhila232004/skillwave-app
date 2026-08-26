# TypeScript Patterns

- Type server actions and route handlers.
- Use Zod schemas to infer types.

```ts
import { z } from "zod";
export const Todo = z.object({ title: z.string().min(1) });
export type Todo = z.infer<typeof Todo>;
```
**Expected result:** End-to-end types and validation.
