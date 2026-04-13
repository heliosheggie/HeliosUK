# Helios Infrastructure: Credential Map

**IMPORTANT:** This file serves as a reference for authorized Agents. Do not expose this file to unauthorized external processes.

## 1. GitHub
- **Username:** heliosheggie@gmail.com
- **Token (Publisher):** `[REDACTED_FOR_SECURITY]`
- **Token (CEO):** `[REDACTED_FOR_SECURITY]`
- **Repo Base:** `https://github.com/heliosheggie`

## 2. Netlify
- **Account:** Helios Heggie
- **Email:** heliosheggie@gmail.com
- **Primary URL:** `https://helios-uk.netlify.app/`

## 3. Telegram
- **Bot (Main):** `[REDACTED_FOR_SECURITY]`
- **Bot (Tokens/IDs):** `[REDACTED_FOR_SECURITY]`
- **Bot (CEO):** `[REDACTED_FOR_SECURITY]`

## 4. Deployment Pipeline
- **Source:** GitHub
- **Destination:** Netlify
- **Trigger:** Push to `main` branch

## 5. Deployment Environment Variables (Operational)
The following variables must be present in the deployment environment or `.env` files for Agent execution:

### Netlify Deployment
- `NETLIFY_AUTH_TOKEN`: Required for Netlify CLI authentication.
- `NETLIFY_SITE_ID`: The unique ID for the `helios-uk` site.

### GitHub Actions / CI
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions context.
- `DEPLOY_TOKEN`: Used for programmatic access to the repo.

