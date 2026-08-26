# Authentication & Sessions

Use **Auth.js (NextAuth)** with App Router.

```bash
pnpm add next-auth
```
```ts
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
const handler = NextAuth({ providers: [Credentials({ name:"Email", credentials:{ email:{} }, authorize(){ return { id:"1", name:"Demo" }; } })] });
export { handler as GET, handler as POST };
```
**Expected result:** Auth endpoints available; session cookies handled for RSC.

Protect routes in server components:
```tsx
import { auth } from "next-auth"; // via auth helper in your setup
export default async function Dashboard(){
  const session = await auth();
  if(!session) return <p>Not authorized</p>;
  return <p>Welcome {session.user?.name}</p>;
}
```
**Expected result:** Private content only for signed-in users.
