# Testing

## Unit (Vitest/Jest) + RTL
```bash
pnpm add -D vitest @testing-library/react jsdom
```
```ts
// Example.test.tsx
import { render, screen } from "@testing-library/react";
function Hello(){ return <h1>Hello</h1>; }
test("renders", ()=>{
  render(<Hello/>);
  expect(screen.getByText("Hello")).toBeInTheDocument();
});
```
**Expected output:** Test passes in CI.

## E2E (Playwright)
```bash
pnpm add -D @playwright/test
```
**Expected result:** Cross-browser E2E with fixtures and auth helpers.
