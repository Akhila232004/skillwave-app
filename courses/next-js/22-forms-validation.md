# Forms, Validation & UX

- `react-hook-form` + Zod for client; validate again in server actions.

```tsx
"use client";
import { useForm } from "react-hook-form";
type T = { email: string };
export default function Form(){
  const { register, handleSubmit } = useForm<T>();
  return <form onSubmit={handleSubmit(console.log)}>
    <input {...register("email")} />
    <button>Submit</button>
  </form>;
}
```
**Expected result:** Controlled form; on submit, values logged or posted to action.
