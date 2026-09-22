# SkillWave

> Your complete learning workspace for tech careers.

SkillWave is a learning platform for students and technology professionals. It brings technical courses, interview preparation, training videos, slideshows, and audio learning resources together in one application.

## Features

- Technical learning courses
- Interview questions and answers
- Training videos
- Slide-based learning resources
- Audio learning resources
- Dynamic content loaded from a dedicated GitHub repository
- Google authentication
- Dashboard-based learning experience
- Centralized branding and UI configuration

## Technology Stack

- **Frontend:** React, Next.js, TypeScript
- **Application:** Next.js Pages Router and **API** routes
- **Authentication:** NextAuth with Google OAuth
- **Content:** Markdown and **YAML**
- **Content Repository:** GitHub
- **Runtime:** Node.js
- **Deployment:** Railway

## Prerequisites

- Node.js 20.x or 22.x
- npm
- Git

Verify:

``` node --version npm --version git --version ```

## Download and Installation

Clone the application:

```git clone repo link ```
```cd skillwave ```

Install dependencies:

```npm install ```

For a clean installation from the lock file:

```npm ci ```

## Environment Configuration

Create `.env.local` in the project root:

```env CONTENT_REPO_OWNER=Owner GITID  CONTENT_REPO_NAME=content rpo_name , CONTENT_REPO_BRANCH=main

GOOGLE_CLIENT_ID=your_google_client_id GOOGLE_CLIENT_SECRET=your_google_client_secret

NEXTAUTH_SECRET=your_nextauth_secret NEXTAUTH_URL=[http://localhost:**3001**](http://localhost:**3001**) ```

| Variable               | Purpose                                |
| ---------------------- | -------------------------------------- |
| `CONTENT_REPO_OWNER`   | GitHub owner of the content repository |
| `CONTENT_REPO_NAME`    | Content repository name                |
| `CONTENT_REPO_BRANCH`  | Content branch                         |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID                 |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret             |
| `NEXTAUTH_SECRET`      | NextAuth secret                        |
| `NEXTAUTH_URL`         | Application base URL                   |

> Never commit `.env.local` or expose secret values in source control.

## Google OAuth Setup

For local development, configure the Google OAuth application with:

**Authorized JavaScript origin**

## Run Locally

Standard development command:

``` npm run dev ```

## Production Build

Create a production build:

```npm run build ```

Start the production server:

```npm start ```


## Common Commands

```# Install dependencies npm install

# Clean installation

npm ci

# Start development server

npm run dev

# Start Next.js directly on port 3001

npx next dev -p **3001**

# Create production build

npm run build

# Start production server

npm start

# Check Git status

git status

# View configured remotes

git remote -v ```

Deployment flow:

```text
### Application Repository
    |
    v
    Railway
    |
    v
SkillWave Application
    |
    v
### Content Repository
```

## Git Workflow

Check changes:

```powershell git status git diff ```

Stage changes:

```powershell git add . ```

Commit:

```powershell git commit -m *Describe the change* ```

Push:

```powershell git push origin main ```

## Updating Content

Learning content is maintained separately from the application.

Typical areas:

```text courses/ interview/ cbt/ dashboard/ branding/ design/ ```

After content changes:

## Update the required Markdown or YAML files.

## Validate the content. ## Commit the changes. ## Push to the configured branch. ## Verify the updated content in SkillWave.

### Content is not loading

Verify:

```env CONTENT_REPO_OWNER, CONTENT_REPO_NAME, CONTENT_REPO_BRANCH=main ```

Also verify that the configured repository and branch contain the expected content.

### Build errors

Run:

```powershell npm install npm run build ```

Resolve the first reported build error before addressing secondary errors.

## Security

- Never commit **API** keys, OAuth secrets, passwords, or other credentials.
- Keep `.env.local` out of source control.
- Store production secrets in Railway environment variables.
- Use **HTTPS** in production.
- Keep Google OAuth redirect URIs restricted to required application domains.

## Production Checklist

- [ ] Dependencies install successfully.
- [ ] `npm run build` completes successfully.
- [ ] Required environment variables are configured.
- [ ] Google OAuth credentials are configured.
- [ ] `NEXTAUTH_URL` matches the deployment **URL**.
- [ ] Google OAuth redirect **URI** matches the deployment **URL**.
- [ ] Content repository configuration is correct.
- [ ] Required content is available.
- [ ] Authentication works.
- [ ] Courses and learning resources load correctly.

## License

The project license should be defined by the repository maintainers.

---
