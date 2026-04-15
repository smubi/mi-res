# Deploying to Cloudflare Workers

This project is configured to be deployed to Cloudflare Workers using [OpenNext for Cloudflare](https://opennext.js.org/cloudflare).

## Prerequisites

1. A Cloudflare account.
2. Cloudflare Account ID and API Token (with "Cloudflare Workers" permissions).

## Local Development & Preview

To preview the production build locally using Wrangler:

```bash
npm run preview
```

## Manual Deployment

To deploy manually from your terminal:

```bash
npm run deploy
```

You will be prompted to log in to Cloudflare if you haven't already.

## Automated Deployment (GitHub Actions)

A GitHub Action is provided in `.github/workflows/deploy.yml`. To use it:

1. Go to your GitHub repository settings.
2. Navigate to **Secrets and variables** > **Actions**.
3. Add the following secrets:
   - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token.
   - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID.

Every push to the `main` branch will now automatically deploy your app.

## Configuration Notes

- **Images**: `next/image` is set to `unoptimized: true` in `next.config.js` for compatibility with Cloudflare Workers.
- **Node.js Compatibility**: The `nodejs_compat` flag is enabled in `wrangler.toml` to support Next.js features.
- **Minification**: `minify = true` is enabled in `wrangler.toml` to keep the worker size within limits.
