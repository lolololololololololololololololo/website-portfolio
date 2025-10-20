# 🚀 Auto-Update Projects Setup Guide

Your portfolio website now has **automatic project updates**! When you add or modify a project markdown file, it will automatically appear on your website.

## ✨ How It Works

The system has 3 components working together:

1. **`watch-projects.js`** - Watches the `/projects/` folder for changes
2. **`build-projects.js`** - Rebuilds `projects.json` from markdown files
3. **TUI App** - Auto-detects `projects.json` changes and refreshes the UI

## 🎯 Quick Start

### Option 1: One-Time Build (Manual)

Build projects once:
```bash
./build.sh
```

Or:
```bash
node build-projects.js
```

### Option 2: Auto-Watch Mode (Recommended)

Build and watch for changes automatically:
```bash
./build.sh watch
```

Or:
```bash
node watch-projects.js
```

This will:
- ✅ Rebuild projects.json whenever you add/edit/delete .md files
- ✅ Keep running in the background
- ✅ Show you when changes are detected
- ⚠️  Press `Ctrl+C` to stop

## 📝 Workflow: Adding a New Project

### Step 1: Start Watch Mode (in Terminal 1)
```bash
./build.sh watch
```

### Step 2: Start Web Server (in Terminal 2)
```bash
python3 -m http.server 8000
```

### Step 3: Open Browser
Navigate to: http://localhost:8000

### Step 4: Create Your Project
Create a new markdown file in `/projects/`:

```bash
touch projects/my-awesome-project.md
```

Edit the file with your project details:

```markdown
---
title: My Awesome Project
date: 2024-10-20
tags: [web, javascript, react]
github: https://github.com/username/awesome-project
demo: https://awesome-project.vercel.app
---

## Overview

This is my awesome project that does amazing things!

## Features

- Feature 1
- Feature 2
- Feature 3

## Technologies Used

- React
- Node.js
- MongoDB
```

### Step 5: Watch the Magic! ✨

1. **Watch Mode** (Terminal 1) will detect the change and rebuild
2. **Browser** will auto-refresh the projects list (every 2 seconds)
3. Your new project appears in the navigation menu!
4. Click on it to view the full details

## 🔧 Technical Details

### Auto-Watch Features

The watch system includes:
- **Debouncing**: Waits 500ms after changes settle before rebuilding
- **Smart Filtering**: Only processes `.md` files (ignores `README.md`)
- **Error Handling**: Shows clear error messages if something goes wrong
- **Graceful Shutdown**: Properly stops when you press Ctrl+C

### Browser Auto-Refresh

The TUI app:
- **Polls** `projects.json` every 2 seconds for changes
- **Compares** the `last-modified` header to detect updates
- **Reloads** projects list when changes are detected
- **Clears Cache** for project content to ensure fresh data
- **Validates** current view (returns home if viewing deleted project)

## 📋 Project File Requirements

Each project markdown file needs frontmatter at the top:

```markdown
---
title: Your Project Title       # REQUIRED
date: 2024-10-20               # REQUIRED
tags: [tag1, tag2, tag3]       # Optional
github: https://github.com/... # Optional
demo: https://demo-url.com     # Optional
---

Your project content here...
```

### Required Fields
- **title**: The project name (shown in navigation)
- **date**: Publication date (format: YYYY-MM-DD)

### Optional Fields
- **tags**: Array of tags/categories
- **github**: Link to GitHub repository
- **demo**: Link to live demo

## 🎨 Project Template

Use this template for new projects:

```bash
cp projects/project-template.md projects/your-new-project.md
```

Then edit `your-new-project.md` with your details.

## 🐛 Troubleshooting

### Projects Not Updating?

**Check watch mode is running:**
```bash
# Should show "👀 Watching for changes..."
ps aux | grep watch-projects
```

**Manually rebuild:**
```bash
node build-projects.js
```

**Check projects.json was created:**
```bash
cat projects/projects.json
```

### Browser Not Refreshing?

**Hard refresh the page:**
- Mac: `Cmd + Shift + R`
- Windows/Linux: `Ctrl + Shift + R`

**Check console for errors:**
- Open browser DevTools (F12)
- Look for errors in the Console tab

**Verify auto-refresh is enabled:**
- Should see "🔄 Auto-refresh enabled for projects" in console

### Watch Mode Errors?

**Make sure Node.js is installed:**
```bash
node --version  # Should show v14 or higher
```

**Check file permissions:**
```bash
chmod +x build.sh
chmod +x watch-projects.js
```

## 💡 Tips & Best Practices

### Organize Your Projects

Use clear, descriptive filenames:
- ✅ `portfolio-website.md`
- ✅ `task-manager-app.md`
- ✅ `machine-learning-project.md`
- ❌ `proj1.md`
- ❌ `test.md`

### Date Sorting

Projects are automatically sorted by date (newest first). Use the `date` field to control order:

```markdown
date: 2024-10-20  # Most recent = appears first
```

### Use Tags for Filtering

Consistent tags help organize projects:
```markdown
tags: [web, react, typescript]  # Frontend
tags: [backend, node.js, api]   # Backend
tags: [ml, python, tensorflow]  # Data Science
```

### Test Before Committing

1. Add your project file
2. Wait for watch mode to rebuild
3. Check browser to verify it looks correct
4. Make any edits needed
5. Commit when happy

## 🚦 Development Workflow

### Two-Terminal Setup (Recommended)

**Terminal 1 - Watch Mode:**
```bash
cd /path/to/website
./build.sh watch
# Leave running...
```

**Terminal 2 - Web Server:**
```bash
cd /path/to/website
python3 -m http.server 8000
# Leave running...
```

Now you can:
- Edit project files in your editor
- See instant rebuilds in Terminal 1
- See auto-updates in browser (within 2 seconds)

### Single-Terminal Alternative

Use a terminal multiplexer like `tmux` or run processes in background:

```bash
# Start both in background
./build.sh watch &
python3 -m http.server 8000 &

# Stop both when done
killall node python3
```

## 📚 Commands Reference

| Command | Description |
|---------|-------------|
| `./build.sh` | Build once (manual) |
| `./build.sh watch` | Build and watch for changes |
| `node build-projects.js` | Build projects.json |
| `node watch-projects.js` | Watch mode directly |
| `python3 -m http.server 8000` | Start web server |

## 🎉 You're All Set!

Your portfolio now automatically updates when you add projects. Just:

1. Start watch mode: `./build.sh watch`
2. Start web server: `python3 -m http.server 8000`
3. Add/edit project files
4. Watch them appear automatically! ✨

---

**Questions?** Check the main README.md or inspect the code in `watch-projects.js`
