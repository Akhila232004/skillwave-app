# Advanced RSC Patterns

- Keep server/client boundaries small and deliberate.
- Avoid passing large objects/functions across the boundary.
- Invalidate caches correctly (`revalidatePath`, `revalidateTag`).

```ts
import { revalidatePath } from "next/cache";
export async function action(){ /* mutate */ revalidatePath("/"); }
```
**Expected result:** Fresh UI after mutations without full rebuilds.
