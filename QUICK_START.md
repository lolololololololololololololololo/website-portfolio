# Quick Start Guide

Get your TUI Portfolio up and running in 5 minutes!

## 🚀 Start Development

### 1. Start Watch Mode (Auto-rebuild)
```bash
./build.sh watch
```
Automatically rebuilds when you add/edit projects.

### 2. Start Web Server
```bash
python3 -m http.server 8000
```
In a separate terminal window.

### 3. Open Browser
```
http://localhost:8000
```

## 📝 Add a Project

### Quick Method
```bash
# Copy template
cp PROJECT_TEMPLATE.md projects/my-project.md

# Edit the file
# Change title, date, tags in frontmatter
# Add your content

# Watch it appear automatically! ✨
```

### Manual Method
```bash
# Create file
touch projects/my-project.md

# Add frontmatter
---
title: My Project
date: 2024-10-20
tags: [web, react]
github: https://github.com/user/repo
demo: https://demo.com
---

# My Project

## Overview
Your project description...

# Rebuild (if not using watch mode)
./build.sh
```

## 🖼️ Add Media

### Images
```bash
# Copy image
cp image.png media/images/project-screenshot.png

# Reference in markdown
![Screenshot](../media/images/project-screenshot.png)
```

### Videos (YouTube)
```markdown
[VIDEO: Demo](https://www.youtube.com/watch?v=VIDEO_ID)
```

## 📱 Test on Mobile

The site automatically adapts:
- **Desktop**: Sidebar on right
- **Mobile**: Sidebar at bottom

## 🚢 Deploy

```bash
git add .
git commit -m "Add project: Project Name"
git push
```

GitHub Pages deploys automatically in 1-2 minutes!

## 📚 Full Guides

- **Full Setup**: See [README.md](README.md)
- **Contributing**: See [CONTRIBUTING.md](CONTRIBUTING.md)
- **Auto-Update**: See [AUTO_UPDATE_GUIDE.md](AUTO_UPDATE_GUIDE.md)

## 🐛 Quick Fixes

### Project Not Showing?
```bash
./build.sh  # Rebuild
```

### Port in Use?
```bash
lsof -ti:8000 | xargs kill -9
```

### Watch Mode Not Running?
```bash
ps aux | grep watch  # Check if running
./build.sh watch     # Restart
```

---

**Need more help?** Check [CONTRIBUTING.md](CONTRIBUTING.md) for detailed instructions!
