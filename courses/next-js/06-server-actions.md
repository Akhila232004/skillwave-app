# Server Actions

Server Actions let you mutate data **without** explicit API routes.

```tsx
// app/actions.ts
"use server";

import { revalidatePath } from "next/cache";

export async function addTodo(formData: FormData) {
  const title = String(formData.get("title") || "");
  // await db.todo.create({ data: { title } });
  revalidatePath("/todos");
}

// app/todos/page.tsx
export default function TodosPage() {
  return (
    <form action={addTodo}>
      <input name="title" placeholder="Title" />
      <button type="submit">Add</button>
    </form>
  );
}
```
**Expected result:** Form POST hits the server action; list revalidates after insert.

### Security
- Validate inputs (Zod) server-side.
- Auth checks inside the action.
