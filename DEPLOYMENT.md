# Deployment Guide - BrokerPro on Netlify

This guide provides step-by-step instructions for deploying the BrokerPro application to Netlify.

## Prerequisites

- GitHub account (or GitLab/Bitbucket)
- Netlify account (free tier available)
- Project repository pushed to version control

## Pre-Deployment Checklist

- [x] `netlify.toml` configured with build settings
- [x] `.env.example` created with required environment variables
- [x] `.gitignore` configured to exclude node_modules and build files
- [x] ESLint errors fixed
- [x] Build process tested locally with `npm run build`

## Step 1: Prepare Your Repository

1. Ensure all changes are committed to your main branch:
   ```bash
   git add .
   git commit -m "Prepare for Netlify deployment"
   git push origin main
   ```

2. Create a `.env.local` file locally with your production API keys (do NOT commit this):
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual API credentials
   ```

## Step 2: Connect to Netlify

### Option A: Using Netlify Dashboard (Recommended)

1. Go to [netlify.com](https://app.netlify.com) and log in
2. Click **"Add new site"** → **"Import an existing project"**
3. Select your Git provider (GitHub, GitLab, or Bitbucket)
4. Authorize and select your repository
5. Click **"Deploy"** - Netlify will auto-detect Vite settings from `netlify.toml`

### Option B: Using Netlify CLI

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Deploy:
   ```bash
   netlify deploy --prod
   ```

## Step 3: Configure Environment Variables

1. In Netlify dashboard, go to your site's **Settings** → **Build & deploy** → **Environment**
2. Add each variable from your `.env.local`:
   - `VITE_API_BASE_URL`
   - `VITE_CHAT_API_KEY`
   - `VITE_CRYPTO_API_KEY`
   - `VITE_FOREX_API_KEY`
   - `VITE_APP_ENV` = `production`

**Important**: Never commit `.env` files with real credentials.

## Step 4: Verify Build Settings

Your `netlify.toml` automatically configures:

```toml
Build command: npm run build
Publish directory: dist
Node version: 20
```

You can override these in the dashboard under **Settings** → **Build & deploy** if needed.

## Step 5: Deploy

### From Dashboard
- Netlify automatically deploys on every push to your main branch
- View deployment status under **Deploys** tab

### Manual Deploy with CLI
```bash
netlify deploy --prod
```

## Post-Deployment

### Verify the Site
- [ ] Visit your Netlify URL (e.g., `your-site.netlify.app`)
- [ ] Test all routes (SPA routing should work - handled by `netlify.toml`)
- [ ] Check browser console for errors
- [ ] Verify API connections work

### Custom Domain
1. In Netlify dashboard, go to **Domain settings**
2. Click **Add custom domain**
3. Follow DNS configuration instructions

### HTTPS
- Automatically enabled by default on Netlify
- Free SSL certificate provided

## Troubleshooting

### Build Fails
- Check build logs in Netlify dashboard
- Ensure all environment variables are set
- Run `npm run build` locally to verify it works

### Routes Not Working
- Confirm `netlify.toml` is in project root
- Check that redirects rule is present (SPA routing)

### API Calls Fail
- Verify `VITE_API_BASE_URL` is correctly set in environment variables
- Check CORS settings on your backend API
- Ensure API endpoint is accessible from Netlify's servers

### Slow Performance
- Check **Analytics** → **Performance** in Netlify
- Consider enabling caching headers (configured in `netlify.toml`)

## Updating the Site

To update your deployed site:

```bash
git commit -am "Update feature"
git push origin main
```

Netlify automatically redeploys on every push.

## Environment-Specific Configuration

To deploy to different environments:

```toml
# netlify.toml - Production (main branch)
[build]
  command = "npm run build"
  publish = "dist"

# For preview/staging, create netlify-staging.toml
[build]
  command = "npm run build"
  publish = "dist"
  environment = { VITE_APP_ENV = "staging" }
```

## Security Best Practices

1. ✅ Never commit `.env` files with real credentials
2. ✅ Use Netlify's environment variable system
3. ✅ Enable branch protection on main branch
4. ✅ Review deployment previews before merging PRs
5. ✅ Keep dependencies updated

## Additional Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Router Deployment](https://reactrouter.com/start/deployment)

## Support

For deployment issues:
- Check Netlify build logs
- Review ESLint errors with `npm run lint`
- Test build locally: `npm run build && npm run preview`
