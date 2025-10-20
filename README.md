# TUI Portfolio Website

A modern, elegant portfolio website styled like a Terminal User Interface (TUI), inspired by system monitoring tools like btop. Built with vanilla HTML, CSS, and JavaScript for easy deployment to GitHub Pages.

![Portfolio Screenshot](https://via.placeholder.com/1200x600?text=TUI+Portfolio+Screenshot)

## ✨ Features

- **🔄 Auto-Update Projects**: Add markdown files and watch them appear automatically (NEW!)
- **🎨 Terminal Aesthetic**: Authentic TUI look with box-drawing characters and monospace fonts
- **🌓 Time-Based Themes**: Automatic light/dark mode switching based on time of day
  - Light mode: 6:00 AM - 6:00 PM
  - Dark mode: 6:00 PM - 6:00 AM
- **📝 Markdown Content**: Write your content in simple markdown files
- **💻 Syntax Highlighting**: Beautiful code blocks with Prism.js
- **🚀 No Build Step**: Pure HTML/CSS/JS - ready to deploy
- **⌨️ Keyboard Navigation**: Full keyboard support with Alt+Key shortcuts
- **📱 Responsive**: Works seamlessly on desktop and mobile
- **♿ Accessible**: Semantic HTML and ARIA labels
- **⚡ Fast**: Lightweight and performant

## 🎯 Quick Start

### Option 1: Use This Template (Recommended)

1. Click the "Use this template" button at the top of this repository
2. Clone your new repository:
   ```bash
   git clone https://github.com/yourusername/your-portfolio.git
   cd your-portfolio
   ```

### Option 2: Manual Setup

1. **Clone this repository**
   ```bash
   git clone https://github.com/yourusername/tui-portfolio.git
   cd tui-portfolio
   ```

2. **Customize content**
   - Edit `content/about.md` with your information
   - Edit `content/skills.md` with your skills
   - Edit `content/contact.md` with your contact details
   - Update `index.html` with your name/title

3. **Add your projects**
   - Create markdown files in `projects/` directory
   - Update `projects/projects.json` with project entries

4. **Test locally**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```
   
   Open `http://localhost:8000` in your browser

5. **Deploy to GitHub Pages** (see deployment section below)

## 📁 Project Structure

```
tui-portfolio/
├── index.html              # Main HTML file
├── css/
│   └── styles.css         # All styles with theme variables
├── js/
│   ├── main.js            # Navigation and routing logic
│   ├── theme-manager.js   # Theme switching functionality
│   └── markdown-loader.js # Content loading and parsing
├── projects/
│   ├── projects.json      # Project index (required)
│   ├── project-template.md # Template for new projects
│   ├── example-project-1.md
│   └── example-project-2.md
├── content/
│   ├── about.md           # About page content
│   ├── skills.md          # Skills page content
│   └── contact.md         # Contact page content
└── README.md              # This file
```

## 🎨 Customization Guide

### 1. Update Personal Information

Edit `index.html` and update the header title:

```html
<span class="header-title" id="headerTitle">Your Name</span>
```

### 2. Customize Colors

Edit `css/styles.css` and modify the CSS custom properties:

```css
:root {
    /* Customize your color scheme */
    --dark-accent-red: #ff6b6b;
    --dark-accent-green: #51cf66;
    --dark-accent-blue: #58a6ff;
    /* ... more colors ... */
}
```

### 3. Edit Content Pages

Update the markdown files in the `content/` directory:

- **about.md**: Your bio, background, and interests
- **skills.md**: Technical skills and proficiencies
- **contact.md**: Contact information and social links

### 4. Customize Fonts

To change the font, update the Google Fonts link in `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=Your+Font:wght@400;500;600;700&display=swap" rel="stylesheet">
```

And update the CSS:

```css
body {
    font-family: 'Your Font', 'Courier New', monospace;
}
```

## 📝 Adding New Projects

### 🚀 NEW: Automatic Project Updates!

Your portfolio now automatically detects and updates when you add new projects! See [AUTO_UPDATE_GUIDE.md](AUTO_UPDATE_GUIDE.md) for full details.

#### Quick Start (Auto Mode - Recommended)

1. **Start watch mode** (in Terminal 1):
   ```bash
   ./build.sh watch
   ```

2. **Start web server** (in Terminal 2):
   ```bash
   python3 -m http.server 8000
   ```

3. **Add your project** - Just create a markdown file:
   ```bash
   touch projects/my-awesome-project.md
   ```

4. **Edit the file** with your project content:
   ```markdown
   ---
   title: My Awesome Project
   date: 2024-10-20
   tags: [javascript, web, react]
   github: https://github.com/yourusername/project
   demo: https://project-demo.com
   ---

   ## Overview
   Your project description...
   ```

5. **Watch it appear!** ✨
   - Watch mode rebuilds `projects.json` automatically
   - Browser detects changes within 2 seconds
   - No manual refresh needed!

#### Manual Mode (Old Way)

If you prefer the manual approach:

**Step 1: Create Project File**

Create `projects/my-awesome-project.md` with frontmatter and content.

**Step 2: Run Build Script**

```bash
./build.sh
# or
node build-projects.js
```

**Step 3: Commit and Deploy**

```bash
git add .
git commit -m "Add new project: My Awesome Project"
git push
```

### Project File Requirements

Each project needs YAML frontmatter:

```markdown
---
title: Your Project Title       # REQUIRED
date: 2024-10-20               # REQUIRED (YYYY-MM-DD)
tags: [tag1, tag2, tag3]       # Optional
github: https://github.com/... # Optional
demo: https://demo-url.com     # Optional
---

Your markdown content here...
```

**📖 For detailed instructions, see [AUTO_UPDATE_GUIDE.md](AUTO_UPDATE_GUIDE.md)**

## 🚀 Deployment

### Deploy to GitHub Pages

1. **Enable GitHub Pages**
   - Go to your repository settings
   - Navigate to "Pages" section
   - Select "Deploy from a branch"
   - Choose `main` branch and `/ (root)` directory
   - Click "Save"

2. **Wait for deployment**
   - GitHub will build and deploy your site
   - Usually takes 1-2 minutes

3. **Access your site**
   - Your site will be live at `https://yourusername.github.io/repository-name`

### Custom Domain (Optional)

1. **Add CNAME file**
   ```bash
   echo "yourdomain.com" > CNAME
   git add CNAME
   git commit -m "Add custom domain"
   git push
   ```

2. **Configure DNS**
   - Add A records pointing to GitHub's IPs:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - Or add CNAME record: `yourusername.github.io`

3. **Enable HTTPS**
   - In GitHub Pages settings, check "Enforce HTTPS"

### Alternative Deployment Options

#### Netlify
1. Connect your GitHub repository
2. Build command: (leave empty)
3. Publish directory: `/`
4. Deploy!

#### Vercel
1. Import your GitHub repository
2. Framework: Other
3. Build command: (leave empty)
4. Output directory: `./`
5. Deploy!

## ⌨️ Keyboard Shortcuts

The site includes convenient keyboard shortcuts:

- `Alt + H` → Home
- `Alt + A` → About
- `Alt + S` → Skills
- `Alt + P` → Toggle Projects
- `Alt + C` → Contact
- `Alt + T` → Toggle Theme

## 🎨 Theme System

### Automatic Theme Switching

The theme automatically switches based on local time:
- **Light mode**: 6:00 AM - 6:00 PM
- **Dark mode**: 6:00 PM - 6:00 AM

### Manual Toggle

Click the theme indicator (🌙/☀️) in the header to manually toggle themes. The selection is saved to localStorage and persists across sessions.

### Reset to Automatic

To reset to automatic time-based switching, open browser console and run:

```javascript
window.themeManager.resetToAuto();
```

## 🛠️ Development

### Local Development

No build tools required! Just open `index.html` in a browser or use a local server:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (http-server)
npx http-server

# Node.js (live-server with auto-reload)
npx live-server
```

### Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ❌ IE11 (not supported)

### Testing

Test your changes in multiple scenarios:

1. **Different themes**: Toggle between light and dark
2. **Different screen sizes**: Test responsive behavior
3. **Navigation**: Test all navigation routes
4. **Content loading**: Verify markdown renders correctly
5. **Code highlighting**: Check syntax highlighting works

## 📋 Markdown Features

The markdown loader supports:

### Frontmatter
```yaml
---
title: Your Title
date: 2024-10-20
tags: [tag1, tag2]
github: https://github.com/...
demo: https://demo.com
---
```

### Headings
```markdown
# H1
## H2
### H3
```

### Emphasis
```markdown
**bold** *italic* `code`
```

### Lists
```markdown
- Item 1
- Item 2
  - Nested item

1. Numbered
2. List
```

### Links & Images
```markdown
[Link text](https://example.com)
![Alt text](image.jpg)
```

### Code Blocks
````markdown
```javascript
const code = 'highlighted';
```
````

### Tables
```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
```

### Blockquotes
```markdown
> This is a quote
```

## 🔧 Troubleshooting

### Content Not Loading

**Problem**: Markdown files aren't loading

**Solutions**:
- Check browser console for errors
- Verify file paths in `projects.json` are correct
- Ensure you're running a local server (not `file://`)
- Check for CORS issues

### Theme Not Switching

**Problem**: Theme doesn't change automatically

**Solutions**:
- Check browser console for JavaScript errors
- Clear localStorage: `localStorage.clear()`
- Verify `theme-manager.js` is loading correctly

### Syntax Highlighting Not Working

**Problem**: Code blocks aren't highlighted

**Solutions**:
- Check that Prism.js is loading (CDN might be blocked)
- Verify language class on code blocks (e.g., `language-javascript`)
- Check browser console for errors

### Projects Not Appearing

**Problem**: Projects don't show in sidebar

**Solutions**:
- Verify `projects/projects.json` format is correct (valid JSON)
- Check file paths in JSON match actual filenames
- Open browser console to see any fetch errors

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Areas for Contribution

- [ ] Additional themes (cyberpunk, retro, etc.)
- [ ] More keyboard shortcuts
- [ ] Search functionality
- [ ] Blog section
- [ ] Project filtering by tags
- [ ] Dark/light theme preview
- [ ] Animation improvements
- [ ] Accessibility enhancements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

You are free to:
- ✅ Use this for personal portfolios
- ✅ Modify and customize
- ✅ Create your own themes
- ✅ Use commercially
- ✅ Distribute copies

## 🙏 Acknowledgments

- Inspired by [btop](https://github.com/aristocratos/btop) system monitor
- [Marked.js](https://marked.js.org/) for markdown parsing
- [Prism.js](https://prismjs.com/) for syntax highlighting
- [JetBrains Mono](https://www.jetbrains.com/lp/mono/) font

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/tui-portfolio/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/tui-portfolio/discussions)
- **Email**: your.email@example.com

## 🗺️ Roadmap

Future enhancements planned:

- [ ] Command palette (Ctrl+K)
- [ ] Blog section with RSS
- [ ] Project timeline view
- [ ] Tag-based filtering
- [ ] Search across all content
- [ ] Animated terminal cursor
- [ ] More theme options
- [ ] i18n support

## ⭐ Show Your Support

If you like this project, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 🤝 Contributing code
- 📢 Sharing with others

---

