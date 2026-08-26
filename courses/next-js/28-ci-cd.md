# CI/CD & Environments

- GitHub Actions: lint, test, build, preview comment.

```yaml
# .github/workflows/ci.yml
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
**Expected output:** CI validates PRs and produces build artifacts.
