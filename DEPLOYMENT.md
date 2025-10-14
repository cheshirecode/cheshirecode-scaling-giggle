# Deployment Guide

## 🚀 Production URL

**Primary URL**: https://nesto-frontend-v2.vercel.app

This URL automatically points to the latest production deployment.

---

## 📋 Deployment Workflow

### Current Setup

This project uses **manual deployment** to Vercel because the Git repository is hosted on CodeSubmit, which Vercel doesn't support for automatic deployments (Vercel only supports GitHub, GitLab, and Bitbucket).

### Deployment Process

#### 1. Commit Changes Locally

```bash
git add .
git commit -m "feat: your change"
```

#### 2. Push to CodeSubmit

```bash
git push origin master
```

#### 3. Deploy to Vercel

```bash
npm run deploy
# or
vercel --prod --yes
```

#### Quick Deploy (All Steps)

```bash
git push origin master && npm run deploy
```

---

## 🔄 Deployment Commands

| Command                  | Description                       |
| ------------------------ | --------------------------------- |
| `npm run deploy`         | Deploy to production              |
| `npm run deploy:preview` | Deploy to preview (staging)       |
| `vercel --prod --yes`    | Deploy to production (direct CLI) |
| `vercel ls --prod`       | List production deployments       |
| `vercel alias ls`        | List all deployment aliases       |

---

## 🌐 Deployment URLs

### Production

- **Primary**: https://nesto-frontend-v2.vercel.app (permanent)
- **Project**: https://nesto-frontend-v2-dac4158s-projects.vercel.app (permanent)
- **Deployment**: https://nesto-frontend-v2-{hash}-dac4158s-projects.vercel.app (per-deployment)

All URLs point to the same deployment. The primary URL is the cleanest and most shareable.

---

## 📊 Deployment Status

### Latest Deployment

- **Status**: ✅ Live
- **Build Time**: ~3-5 seconds
- **Bundle Size**: 141.72 KB (45.40 KB gzipped)
- **Node Version**: >=20.3.0
- **Framework**: Vite (auto-detected)

### Environment Variables

Set via Vercel dashboard or CLI:

```bash
vercel env add VITE_CANDIDATE_NAME
```

Current environments:

- `production`: Set
- `preview`: Set
- `development`: Set

---

## 🔧 Troubleshooting

### Build Fails on Vercel

1. Check build logs: `vercel inspect <deployment-url> --logs`
2. Verify environment variables are set
3. Test build locally: `npm run build`

### Environment Variable Not Working

1. Ensure it's set for the correct environment
2. Redeploy after adding: `npm run deploy`
3. Check with: `vercel env ls`

### Deployment Timeout

- Typical build time: 3-5 seconds
- If timeout occurs, check for:
  - Large dependencies
  - Infinite build loops
  - Missing dependencies

---

## 📝 Deployment Checklist

Before deploying:

- [ ] All tests passing: `npm test`
- [ ] Build successful: `npm run build`
- [ ] Linting clean: `npm run lint`
- [ ] Commits pushed: `git push origin master`
- [ ] Environment variables configured

After deploying:

- [ ] Production URL accessible
- [ ] Page title correct
- [ ] No console errors
- [ ] Features working as expected

---

## 🎯 Auto-Deployment (Future)

To enable automatic deployments in the future:

### Option 1: Mirror to GitHub

1. Create GitHub repository
2. Push to both remotes:
   ```bash
   git remote add github <github-url>
   git push github master
   ```
3. Connect Vercel to GitHub repo
4. Enable auto-deploy in Vercel dashboard

### Option 2: Webhook Integration

1. Set up webhook on CodeSubmit (if supported)
2. Configure Vercel deployment hook
3. Trigger deployment on push

---

## 📚 Resources

- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Vercel Deployment Documentation](https://vercel.com/docs/deployments/overview)
- [Project Setup Guide](./SETUP.md)

---

**Last Updated**: October 14, 2025
**Current Version**: 1.0.0
**Deployment Type**: Manual via CLI
