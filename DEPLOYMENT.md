# Deployment Guide

## 🚀 Production URLs

### Main Application

**Project**: cheshirecode-challenge-nesto-frontend-app
**Latest URL**: https://cheshirecode-challenge-nesto-frontend-r45z7e7v9.vercel.app

### Storybook Documentation

**Project**: storybook-static
**Latest URL**: https://storybook-static-hiqcyf92b-dac4158s-projects.vercel.app

> **Note**: Deployment URLs change with each deploy (unique hash). Use Vercel dashboard to see deployment history.

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

#### 3. Deploy App to Vercel

```bash
npm run deploy
# or
vercel --prod --yes
```

#### 4. Deploy Storybook to Vercel

```bash
npm run build-storybook
cd storybook-static
vercel --prod --yes
cd ..
```

#### Quick Deploy (All Steps - App + Storybook)

```bash
git push origin master && \
vercel --prod --yes && \
npm run build-storybook && \
cd storybook-static && \
vercel --prod --yes && \
cd ..
```

---

## 🔄 Deployment Commands

| Command                   | Description                      |
| ------------------------- | -------------------------------- |
| `npm run deploy`          | Deploy app to production         |
| `npm run build-storybook` | Build Storybook static files     |
| `vercel --prod --yes`     | Deploy current directory to prod |
| `npm run deploy:preview`  | Deploy to preview (staging)      |
| `vercel ls --prod`        | List production deployments      |
| `vercel inspect <url>`    | View deployment details          |

**Deployment Workflow (Both Targets)**:

1. Deploy app: `vercel --prod --yes` (from project root)
2. Deploy Storybook: `cd storybook-static && vercel --prod --yes && cd ..`

---

## 🌐 Deployment URLs

### Production

#### Main Application

- **Latest**: https://cheshirecode-challenge-nesto-frontend-r45z7e7v9.vercel.app
- **Pattern**: `https://cheshirecode-challenge-nesto-frontend-{hash}.vercel.app`
- **Project**: cheshirecode-challenge-nesto-frontend-app

#### Storybook

- **Latest**: https://storybook-static-hiqcyf92b-dac4158s-projects.vercel.app
- **Pattern**: `https://storybook-static-{hash}-dac4158s-projects.vercel.app`
- **Project**: storybook-static

Each deployment gets a unique hash. Both targets are deployed independently after each major change.

---

## 📊 Deployment Status

### Latest Deployment

- **Status**: ✅ Live (both App + Storybook)
- **Build Time**: ~3-5 seconds (app), ~4 seconds (Storybook)
- **Bundle Size**: 68.64 KB total (app with vendor chunks)
- **Node Version**: >=20.3.0
- **Framework**: Vite (auto-detected)
- **Last Deploy**: October 15, 2025 @ 4:03 PM

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

- [ ] All tests passing: `npm test -- --run`
- [ ] **Build validation passing**: `npm run validate` ✨ **REQUIRED**
  - Checks for React duplication
  - Verifies critical dependencies in bundle
  - Validates bundle structure
- [ ] Linting clean: `npm run lint`
- [ ] Commits pushed: `git push origin master`
- [ ] Environment variables configured

**If validation fails:**

1. Read error message carefully
2. Apply suggested fix
3. Run `npm run validate` again
4. Retry up to 2 times
5. If still failing, investigate deeper

After deploying (both App + Storybook):

- [ ] App production URL accessible
- [ ] Storybook production URL accessible
- [ ] No console errors in either (check browser DevTools)
- [ ] Features working as expected
- [ ] Theme toggle functional
- [ ] i18n switching works
- [ ] Test production build locally first: `npm run preview`

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

## 🔍 Recent Deployments

### October 15, 2025 @ 4:03 PM

- **Commit**: `099fd7e` - fix: remove @storybook/test from Story files
- **App**: https://cheshirecode-challenge-nesto-frontend-r45z7e7v9.vercel.app
- **Storybook**: https://storybook-static-hiqcyf92b-dac4158s-projects.vercel.app
- **Changes**: Fixed production error (jotai dependency), removed @storybook/test

### October 15, 2025 @ 3:56 PM

- **Commit**: `ed71dc0` - feat: implement products page with SWR and parameterization
- **Changes**: ProductsPage with best products, parameterization principle added

---

**Last Updated**: October 15, 2025
**Current Version**: 1.0.0
**Deployment Type**: Manual via CLI (both App + Storybook)
