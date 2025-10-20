# 🚀 GitHub Pages Deployment Guide

This guide helps you deploy your TUI Portfolio website to GitHub Pages with automatic rebuilds using a GitHub Actions workflow that publishes to the `gh-pages` branch.

## ✨ What's Set Up

Your repository now includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that:

- ✅ **Automatically triggers** on every push to the `main` branch
- ✅ **Rebuilds `projects.json`** from your markdown files using `build-projects.js`
- ✅ **Deploys your site** to GitHub Pages
- ✅ **Can be manually triggered** from the Actions tab

## 📋 Step-by-Step Setup

### Step 1: Create a GitHub Repository

If you haven't already:

```bash
# Navigate to your project directory
cd "/Users/lorenzhohn/Desktop/website test"

# If not already initialized:
git init
git add .
git commit -m "Initial commit"

# Create a new repository on GitHub (https://github.com/new)
# Then link it (replace with your actual repository URL):
git remote add origin https://github.com/yourusername/your-portfolio.git
git branch -M main
git push -u origin main
```

### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (gear icon in the top menu)
3. In the left sidebar, click **Pages** (under "Code and automation")
4. Under **Source**, select:
   - Source: **GitHub Actions**
5. Click **Save**

That's it! GitHub will automatically use your workflow.

### Step 3: Verify Deployment

1. Go to the **Actions** tab in your repository
2. You should see the "Deploy to GitHub Pages" workflow running
3. Wait for it to complete (usually 1-2 minutes)
4. Your site will be live at: `https://yourusername.github.io/repository-name`

## 🔄 How Automatic Updates Work

### When You Add a New Blog Post/Project:

1. **Create a new markdown file** in the `projects/` directory:
   ```bash
   touch projects/my-new-project.md
   ```

2. **Add content** with frontmatter:
   ```markdown
   ---
   title: My New Project
   date: 2025-10-20
   tags: [javascript, react, web]
   github: https://github.com/yourusername/project
   demo: https://demo.com
   ---

   ## Overview
   Your project description here...
   ```

3. **Commit and push**:
   ```bash
   git add projects/my-new-project.md
   git commit -m "Add new project: My New Project"
   git push
   ```

4. **Automatic deployment**:
   - GitHub Actions detects the push
   - Runs `build-projects.js` to regenerate `projects.json`
   - Deploys the updated site to GitHub Pages
   - Your new project appears on your live site! 🎉

### When You Update Content:

Same process - just edit any file and push:

```bash
# Edit any file (content/about.md, css/styles.css, etc.)
git add .
git commit -m "Update about page"
git push
```

The workflow automatically rebuilds and redeploys your site.

## 🔧 Workflow Configuration

The GitHub Actions workflow (`.github/workflows/deploy.yml`) does the following:

### Build Stage:
1. Checks out your repository code
2. Sets up Node.js 18
3. Runs `node build-projects.js` to generate `projects.json`
4. Uploads the site as an artifact

### Deploy Stage:
1. Takes the built artifact
2. Deploys it to GitHub Pages
3. Provides the deployment URL

### Triggers:
- **Automatic**: Every push to the `main` branch
- **Manual**: Click "Run workflow" in the Actions tab

### Troubleshooting: permission error when pushing to gh-pages

If you see an error like:

```
remote: Permission to <owner>/<repo>.git denied to github-actions[bot].
fatal: unable to access 'https://github.com/<owner>/<repo>.git/': The requested URL returned error: 403
Error: Action failed with "The process '/usr/bin/git' failed with exit code 128"
```

This means the workflow tried to push to the `gh-pages` branch but the Actions runner wasn't allowed to write. Fixes:

- Preferred: allow GitHub Actions to write repository contents
   1. Go to Settings → Actions in your repository
 2. Under "Workflow permissions" choose "Read and write permissions"
 3. Save changes

- Alternative (if organization policy or restrictions apply): use a Personal Access Token (PAT)
   1. Create a PAT with the "repo" scope
   2. Add it to your repo's Secrets as `ACTIONS_DEPLOY_TOKEN`
   3. Update the workflow's deploy step to use that token instead of `GITHUB_TOKEN`.

After enabling write permissions, re-run the workflow (Actions → select the workflow → Run workflow).

## 🎯 Testing Locally Before Deployment

Always test your changes locally first:

```bash
# Build projects.json
npm run build
# Then link it (replace with your actual repository URL):
git remote add origin https://github.com/lolololololololololololololololo/website-portfolio.git

# Start local server
npm run serve
# or
python3 -m http.server 8000

# View at http://localhost:8000
```

## 🛠️ Troubleshooting

### Deployment Failed

**Check the Actions tab:**
1. Go to your repository's **Actions** tab
2. Click on the failed workflow run
3. Expand the failed step to see error details

**Common issues:**

4. Your site will be live at: `https://lolololololololololololololololo.github.io/website-portfolio/` (once the workflow completes)
   - Make sure `build-projects.js` works locally
   - Check for syntax errors in markdown frontmatter
   - Verify all markdown files have valid YAML frontmatter

2. **Pages deployment failed:**
   - Ensure GitHub Pages is enabled (Settings → Pages)
   - Check that you selected "GitHub Actions" as the source
   - Verify repository is public (or you have GitHub Pro for private repos)

3. **404 on deployed site:**
   - Wait a few minutes for DNS propagation
   - Check the deployment URL in the Actions log
   - Ensure `index.html` exists in the root directory

### Site Doesn't Update

**If your changes don't appear:**

1. **Clear browser cache** (Ctrl+Shift+R / Cmd+Shift+R)
2. **Check workflow ran successfully** in Actions tab
3. **Verify files were committed** and pushed to `main` branch
4. **Wait a minute** - GitHub Pages can take 1-2 minutes to update

### Manual Trigger

If automatic deployment isn't working, manually trigger it:

1. Go to **Actions** tab
2. Click **Deploy to GitHub Pages** workflow
3. Click **Run workflow** button
4. Select `main` branch
5. Click **Run workflow**

## 🌐 Custom Domain (Optional)

To use a custom domain like `yourname.com`:

### 1. Add CNAME file

Create a file named `CNAME` (no extension) in the root directory:

```bash
echo "yourdomain.com" > CNAME
git add CNAME
git commit -m "Add custom domain"
git push
```

### 2. Configure DNS

In your domain registrar's DNS settings:

**Option A: Use A records (apex domain like `example.com`)**
```
Type: A
Name: @
Value: 185.199.108.153
```
Add three more A records with these IPs:
- `185.199.109.153`
- `185.199.110.153`
1. Commits the repository contents to the `gh-pages` branch and pushes it
2. GitHub Pages serves the `gh-pages` branch
3. The workflow prints the deployment URL in the logs
```
Type: CNAME
Name: www
Value: yourusername.github.io
```

### 3. Enable HTTPS

1. Go to Settings → Pages
2. Wait for DNS to propagate (can take 24-48 hours)
3. Check "Enforce HTTPS"

## 📊 Monitoring Deployments

### View Deployment History

1. Go to **Actions** tab
2. See all workflow runs with timestamps
3. Click any run to see detailed logs

### Deployment URL

Find your live site URL:
- Actions tab → Latest successful workflow → Deploy step → Look for URL
- Or: Settings → Pages → Your site is live at...

### Build Time

Typical deployment times:
- **Build stage**: 20-40 seconds
- **Deploy stage**: 10-20 seconds
- **Total**: ~1-2 minutes

## 🔐 Security Notes

The workflow uses GitHub's built-in tokens:
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions
- Permissions are scoped to only what's needed
- No manual token configuration required

## 📝 Customizing the Workflow

Edit `.github/workflows/deploy.yml` to customize:

### Add Build Steps

```yaml
- name: 🎨 Minify CSS
  run: |
    npm install -g csso-cli
    csso css/styles.css -o css/styles.min.css
```

### Add Tests

```yaml
- name: 🧪 Run Tests
  run: npm test
```

### Change Trigger Branch

```yaml
on:
  push:
    branches: [ develop ]  # Deploy from develop instead
```

## 🆘 Getting Help

If you encounter issues:

1. **Check this guide** first
2. **Look at Actions logs** for error messages
3. **Search GitHub Docs**: [GitHub Pages Documentation](https://docs.github.com/pages)
4. **Check Status**: [GitHub Status](https://www.githubstatus.com/)

## 🎉 You're All Set!

Your website will now automatically rebuild and deploy whenever you:
- ✅ Add new blog posts/projects
- ✅ Update content
- ✅ Change styles
- ✅ Modify any files

Just commit and push - GitHub Actions handles the rest! 🚀

---

## Quick Reference

```bash
# Add new content
touch projects/new-post.md
# Edit it, then:
git add projects/new-post.md
git commit -m "Add new post"
git push

# Update existing content
# Edit any file, then:
git add .
git commit -m "Update content"
git push

# View deployment status
# Go to: https://github.com/yourusername/repo/actions

# Your live site
# https://yourusername.github.io/repository-name
```

**Happy publishing! 🎊**
