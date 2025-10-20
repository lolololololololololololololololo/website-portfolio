# Contributing Guide

Welcome! This guide will help you add content to your TUI Portfolio website.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Adding Projects](#adding-projects)
- [Adding Media (Images & Videos)](#adding-media-images--videos)
- [Editing Content Pages](#editing-content-pages)
- [Markdown Features](#markdown-features)
- [Testing Your Changes](#testing-your-changes)

## 🚀 Quick Start

### Automatic Workflow (Recommended)

1. **Start watch mode** (automatically rebuilds when you add/edit projects):
   ```bash
   ./build.sh watch
   ```

2. **Start web server** (in a new terminal):
   ```bash
   python3 -m http.server 8000
   ```

3. **Open browser**: http://localhost:8000

4. **Add content** and watch it appear automatically!

### Manual Workflow

If you prefer to rebuild manually after each change:

```bash
# Make your changes to markdown files
# Then rebuild:
./build.sh

# Refresh browser to see changes
```

## 📝 Adding Projects

Projects are markdown files in the `/projects/` folder.

### Step 1: Create Project File

Create a new file in `/projects/`:

```bash
touch projects/my-awesome-project.md
```

**Naming convention**: Use lowercase with hyphens, no spaces.
- ✅ `portfolio-website.md`
- ✅ `machine-learning-project.md`
- ❌ `My Project.md`

### Step 2: Add Frontmatter and Content

Every project needs **frontmatter** (metadata) at the top:

```markdown
---
title: My Awesome Project
date: 2024-10-20
tags: [web, react, typescript]
github: https://github.com/username/project
demo: https://demo-link.com
---

## Overview

Brief description of your project...

## Features

- Feature 1: Description
- Feature 2: Description
- Feature 3: Description

## Technical Stack

- **Frontend**: React, TypeScript
- **Backend**: Node.js, Express
- **Database**: PostgreSQL

## Code Example

\`\`\`javascript
function example() {
    console.log("Hello, World!");
}
\`\`\`

## Challenges & Solutions

Describe technical challenges and how you solved them...

## Results

Share outcomes, metrics, or what you learned...

## Links

- [Live Demo](https://demo.com)
- [GitHub](https://github.com/username/project)
```

### Frontmatter Fields

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| `title` | ✅ Yes | Project name (shown in navigation) | `My Awesome Project` |
| `date` | ✅ Yes | Publication date (format: YYYY-MM-DD) | `2024-10-20` |
| `tags` | ❌ No | Array of tags/categories | `[web, react, api]` |
| `github` | ❌ No | GitHub repository URL | `https://github.com/...` |
| `demo` | ❌ No | Live demo URL | `https://demo.com` |

### Step 3: Watch It Appear!

If watch mode is running:
- Your project appears automatically within 2 seconds
- No manual refresh needed!

If not using watch mode:
```bash
./build.sh  # Rebuild projects.json
# Then refresh browser
```

## 🖼️ Adding Media (Images & Videos)

### Images

**Step 1**: Add your image to `/media/images/`

```bash
# Copy your image
cp ~/Downloads/screenshot.png media/images/project-screenshot.png
```

**Step 2**: Reference it in your markdown (on its own line):

```markdown
![Project Screenshot](../media/images/project-screenshot.png)
```

**Result**: Displays as a clickable box in the TUI style:
```
╭─ 🖼  Project Screenshot ────────────────[VIEW]╮
│ ../media/images/project-screenshot.png        │
│ (Click VIEW or URL to open in new tab)        │
╰────────────────────────────────────────────────╯
```

**Supported formats**: PNG, JPG, GIF, SVG, WebP

### Videos

For **YouTube videos**, use this special syntax:

```markdown
[VIDEO: Demo Walkthrough](https://www.youtube.com/watch?v=VIDEO_ID)
```

**Result**: Displays as a clickable video player indicator:
```
╭─ 📺 Demo Walkthrough ──────────────[▶ PLAY]╮
│ https://youtube.com/watch?v=VIDEO_ID        │
│ (YouTube Video - Click PLAY to watch)       │
╰─────────────────────────────────────────────╯
```

For **other video links**:

```markdown
[VIDEO: Tutorial](https://vimeo.com/123456789)
```

### Media Best Practices

- **Image size**: Keep under 1MB for web performance
- **Descriptive names**: `project-name-screenshot.png` not `img1.png`
- **Relative paths**: Always use `../media/` from project files
- **YouTube preferred**: For videos, YouTube provides the best compatibility

## 📄 Editing Content Pages

Content pages are in `/content/`:

- `about.md` - Your bio and background
- `skills.md` - Technical skills and proficiencies
- `contact.md` - Contact information and social links

Edit these files directly with markdown. Changes appear after rebuilding (watch mode) or manual refresh.

## ✨ Markdown Features

### Headers

```markdown
# H1 Header (Large box with borders)
## H2 Header (Line with title)
### H3 Header (Bullet point style)
```

### Text Formatting

```markdown
**Bold text** - Appears in bright white
*Italic text* - Appears in yellow
`inline code` - Appears in green
```

### Links

```markdown
[Link text](https://example.com)
```

Links appear in cyan with a → arrow and are **clickable**.

### Lists

```markdown
Unordered:
- Item 1
- Item 2
  - Nested item

Ordered:
1. First item
2. Second item
3. Third item
```

### Code Blocks

Use triple backticks with language for syntax highlighting:

````markdown
```javascript
const greeting = "Hello, World!";
console.log(greeting);
```
````

**Features**:
- Green bordered box
- [COPY] button to copy code
- Language indicator in title

### Blockquotes

```markdown
> This is a quote
> Multiple lines work too
```

Appears in a magenta-bordered box.

### Tables

```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
| Data 4   | Data 5   | Data 6   |
```

### Horizontal Rules

```markdown
---
```

Creates a horizontal line separator.

## 🧪 Testing Your Changes

### Local Testing Checklist

Before committing:

- [ ] Project appears in navigation sidebar
- [ ] Content displays correctly
- [ ] Links are clickable (cyan with →)
- [ ] Images show with [VIEW] button
- [ ] Videos show with [▶ PLAY] button
- [ ] Code blocks have [COPY] button
- [ ] Scrolling works smoothly
- [ ] No console errors (F12 → Console tab)

### Test on Different Devices

- **Desktop**: Full sidebar on right
- **Tablet**: Narrower sidebar on right
- **Mobile**: Compact sidebar at bottom

### Browser DevTools

Press **F12** to open DevTools:
- **Console**: Check for JavaScript errors
- **Network**: Verify files are loading
- **Elements**: Inspect rendered HTML

## 🐛 Troubleshooting

### Project Not Appearing

**Problem**: New project doesn't show in sidebar

**Solution**:
```bash
# Rebuild projects.json
./build.sh

# Or check if watch mode is running
ps aux | grep watch-projects

# Restart watch mode if needed
./build.sh watch
```

### Watch Mode Not Working

**Problem**: Changes don't appear automatically

**Solution**:
```bash
# Check if watch mode is running
ps aux | grep watch-projects

# Kill old process
killall node

# Restart watch mode
./build.sh watch
```

### Images Not Loading

**Problem**: Images don't display or show broken

**Solution**:
- Check file path is correct (relative: `../media/images/...`)
- Verify image exists in `/media/images/` folder
- Check file extension matches (case-sensitive)
- Use supported formats: PNG, JPG, GIF, SVG, WebP

### Port Already in Use

**Problem**: Can't start server on port 8000

**Solution**:
```bash
# Kill process using port 8000
lsof -ti:8000 | xargs kill -9

# Or use a different port
python3 -m http.server 8080
```

### Mobile Layout Issues

**Problem**: Navigation panel blocks content on mobile

**Solution**:
- The layout automatically adapts for mobile
- Sidebar moves to bottom on small screens
- Clear browser cache and hard refresh:
  - iOS Safari: Long-press refresh button
  - Chrome: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

## 📦 Deployment

After making changes:

```bash
# Test locally first
./build.sh
python3 -m http.server 8000

# Commit changes
git add .
git commit -m "Add new project: Project Name"
git push origin main
```

GitHub Pages will automatically deploy your changes within 1-2 minutes.

## 💡 Tips & Best Practices

### Writing Great Project Descriptions

1. **Start with Overview**: Explain what it does in 1-2 sentences
2. **Highlight Features**: Use bullet points for key features
3. **Technical Details**: Share your tech stack
4. **Show Code**: Include relevant code snippets
5. **Challenges**: Discuss interesting problems you solved
6. **Results**: Share outcomes or lessons learned

### Organizing Projects

Use the `date` field to control order (newest first):

```yaml
date: 2024-10-20  # Most recent
date: 2024-09-15  # Older
date: 2024-08-01  # Oldest
```

### Using Tags Effectively

Keep tags consistent across projects:

```yaml
# Good - consistent, specific
tags: [web, react, typescript, api]
tags: [mobile, ios, swift]
tags: [ml, python, tensorflow]

# Avoid - too generic or inconsistent
tags: [stuff, things, code]
```

### Image Optimization

Before adding images:

```bash
# Resize large images (macOS)
sips -Z 1200 image.png --out media/images/image.png

# Or use online tools:
# - TinyPNG.com
# - Squoosh.app
```

## 🎓 Example Project Template

Copy this template for new projects:

```bash
cp projects/PROJECT_TEMPLATE.md projects/my-new-project.md
```

Then edit with your content!

## 🤝 Need Help?

- Check [README.md](README.md) for project overview
- See [AUTO_UPDATE_GUIDE.md](AUTO_UPDATE_GUIDE.md) for watch mode details
- Open an issue on GitHub for bugs or questions

---

**Happy Contributing! 🚀**
