# CI/CD & DevOps

Automate lint/test/build and preview deployments in PRs.

```yaml
# GitHub Actions snippet
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint && pnpm test --if-present && pnpm build
```
**Expected output:** Each PR gets fast feedback; artifacts ready for preview.
