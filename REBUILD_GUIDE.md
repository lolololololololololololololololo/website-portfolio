# 🔄 When to Rebuild vs Auto-Update

## Understanding the System

Your portfolio has **two types of content**:

### 1. **Project List** (projects.json)
- Lists all available projects
- Shows in navigation menu
- **Needs rebuild** when you add/delete/rename projects

### 2. **Project Content** (.md files)
- The actual markdown content of each project
- Fetched directly by browser
- **No rebuild needed** - just refresh browser!

---

## ✅ When You DON'T Need to Rebuild

### Editing Existing Content
If you **edit the content** of an existing project:

```bash
# You edit this file:
projects/my-project.md

# Change some text, add features, fix typos, etc.
```

**What to do:**
1. Save the file
2. Refresh browser: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
3. Content updates immediately! ✨

**Why:** The browser fetches the .md file directly with cache busting.

---

## 🔨 When You NEED to Rebuild

### Adding a New Project
If you **create a new project file**:

```bash
# You create a new file:
touch projects/new-project.md
```

**What to do:**
1. Create the .md file with frontmatter
2. Run: `node build-projects.js` (or use watch mode)
3. Wait 2 seconds (if auto-refresh is on) or refresh browser
4. New project appears in menu! ✨

**Why:** projects.json needs to be updated with the new project entry.

### Deleting a Project
If you **delete a project file**:

```bash
# You delete a file:
rm projects/old-project.md
```

**What to do:**
1. Delete the .md file
2. Run: `node build-projects.js`
3. Wait 2 seconds or refresh browser
4. Project disappears from menu! ✨

**Why:** projects.json needs to remove the deleted project.

### Changing Frontmatter Metadata
If you **change title, date, or tags** in frontmatter:

```markdown
---
title: My New Title  ← Changed this
date: 2024-10-21     ← Or this
tags: [new, tags]    ← Or this
---
```

**What to do:**
1. Edit frontmatter
2. Run: `node build-projects.js`
3. Wait 2 seconds or refresh browser
4. Changes appear in menu! ✨

**Why:** This metadata is stored in projects.json for the navigation menu.

---

## 📋 Quick Reference

| What You're Doing | Need Rebuild? | Command |
|-------------------|---------------|---------|
| Edit markdown content | ❌ No | Just refresh browser |
| Add new project | ✅ Yes | `node build-projects.js` |
| Delete project | ✅ Yes | `node build-projects.js` |
| Change title/date/tags | ✅ Yes | `node build-projects.js` |
| Fix typos in content | ❌ No | Just refresh browser |
| Add sections/features | ❌ No | Just refresh browser |
| Change code examples | ❌ No | Just refresh browser |
| Rename project file | ✅ Yes | `node build-projects.js` |

---

## 🎯 Your Current Issue - FIXED!

**What you did:**
```bash
# 1. Edited test-project.md (added "JEAAAAAAA")
vim projects/test-project.md

# 2. Rebuilt (not needed for content changes!)
node build-projects.js

# 3. Expected to see changes - but browser cached old content
```

**Why it didn't work before:**
- Browser was caching the .md file
- `build-projects.js` only updates projects.json (not content)
- Needed cache busting on markdown file loading

**What I fixed:**
- ✅ Added cache busting to `loadProjectContent()`
- ✅ Added cache busting to `loadTextContent()`
- ✅ Browser now always fetches fresh .md files

**Now it works:**
1. Edit `projects/test-project.md`
2. Save the file
3. **Hard refresh browser:** `Cmd+Shift+R` or `Ctrl+Shift+R`
4. See your changes immediately! ✨

---

## 💡 Pro Tips

### Development Workflow

**Option 1: Watch Mode (Recommended)**
```bash
# Terminal 1
./build.sh watch

# Terminal 2
python3 -m http.server 8000

# Now:
# - Add/delete projects → auto-rebuilds
# - Edit content → just refresh browser
```

**Option 2: Manual Mode**
```bash
# Start server
python3 -m http.server 8000

# When you add/delete projects:
node build-projects.js

# When you edit content:
# Just refresh browser (Cmd+Shift+R)
```

### Always Use Hard Refresh

Regular refresh (`F5` or `Cmd+R`) might still use cache.
Always use **hard refresh**:
- **Mac:** `Cmd + Shift + R`
- **Windows/Linux:** `Ctrl + Shift + R`

### Disable Cache in DevTools (Best for Development)

1. Open DevTools (`F12`)
2. Go to Network tab
3. Check "Disable cache"
4. Keep DevTools open while developing
5. Now regular refresh works!

---

## 🧪 Test It Now

1. **Edit test-project.md:**
   ```bash
   echo "## New Section

   This is brand new content!" >> projects/test-project.md
   ```

2. **DON'T rebuild** (not needed for content changes)

3. **Hard refresh browser:**
   - Mac: `Cmd + Shift + R`
   - Windows: `Ctrl + Shift + R`

4. **Check the project:**
   - Click "Test Project" in menu
   - Scroll down
   - You should see "New Section" with your content!

---

## ✅ Summary

**Content changes (95% of the time):**
- ✏️ Edit the .md file
- 🔄 Hard refresh browser
- ✨ See changes immediately

**Structure changes (rare):**
- ➕ Add/delete/rename project files
- 🔨 Run `node build-projects.js`
- 🔄 Wait 2 seconds or refresh browser
- ✨ Menu updates

**You're all set! The cache busting is now in place.** 🎉
