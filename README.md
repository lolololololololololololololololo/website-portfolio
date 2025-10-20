# TUI Portfolio Website

A modern, elegant portfolio website styled like a Terminal User Interface (TUI), inspired by system monitoring tools like btop. Built with vanilla HTML, CSS, and JavaScript for easy deployment to GitHub Pages.

![Portfolio Screenshot](https://via.placeholder.com/1200x600?text=TUI+Portfolio+Screenshot)

## ✨ Features

- **🔄 Auto-Update Projects**: Add markdown files and watch them appear automatically
- **🖼️ Image Support**: Display images with clickable preview boxes (NEW!)
- **📺 Video Integration**: Embed YouTube videos and other video links (NEW!)
- **📱 Mobile Optimized**: Responsive layout that works perfectly on iOS and mobile devices (NEW!)
- **🎨 Terminal Aesthetic**: Authentic TUI look with box-drawing characters and monospace fonts
- **🌓 Time-Based Themes**: Automatic light/dark mode switching based on time of day
  - Light mode: 6:00 AM - 6:00 PM
  - Dark mode: 6:00 PM - 6:00 AM
- **📝 Markdown Content**: Write your content in simple markdown files
- **💻 Syntax Highlighting**: Beautiful code blocks with Prism.js
- **🚀 No Build Step**: Pure HTML/CSS/JS - ready to deploy
- **⌨️ Keyboard Navigation**: Full keyboard support with Alt+Key shortcuts
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
│   ├── tui-app.js         # Main TUI application logic
│   ├── theme-manager.js   # Theme switching functionality (legacy)
│   ├── markdown-loader.js # Content loading and parsing (legacy)
│   └── main.js            # Navigation and routing (legacy)
├── media/                 # NEW: Media assets directory
│   ├── images/           # Project images and screenshots
│   └── videos/           # Video thumbnails (videos hosted on YouTube)
├── projects/
│   ├── projects.json      # Project index (auto-generated)
│   ├── PROJECT_TEMPLATE.md # Template for new projects
│   ├── example-project-1.md
│   └── example-project-2.md
├── content/
│   ├── about.md           # About page content
│   ├── skills.md          # Skills page content
│   └── contact.md         # Contact page content
├── CONTRIBUTING.md        # Detailed contribution guide
├── QUICK_START.md         # Quick reference for getting started
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

Your portfolio automatically detects and updates when you add new projects!

### 🚀 Quick Start

See [QUICK_START.md](QUICK_START.md) for the fastest way to get started!

### Detailed Guide

See [CONTRIBUTING.md](CONTRIBUTING.md) for comprehensive instructions on:
- Adding projects with images and videos
- Using markdown features
- Testing your changes
- Troubleshooting

### Quick Reference

**Start development**:
```bash
./build.sh watch              # Terminal 1: Auto-rebuild
python3 -m http.server 8000   # Terminal 2: Web server
```

**Add a project**:
```bash
cp PROJECT_TEMPLATE.md projects/my-project.md
# Edit the file, watch it appear automatically!
```

**Add media**:
```markdown
# Images (on their own line)
![Screenshot](../media/images/screenshot.png)

# YouTube videos
[VIDEO: Demo](https://www.youtube.com/watch?v=VIDEO_ID)
```

### New Media Features

#### 🖼️ Images

Images display in a styled TUI box with a clickable [VIEW] button:

```markdown
![Project Screenshot](../media/images/my-screenshot.png)
```

**Supported formats**: PNG, JPG, GIF, SVG, WebP

**Best practices**:
- Store images in `/media/images/`
- Use relative paths: `../media/images/filename.png`
- Keep file sizes under 1MB
- Use descriptive filenames

#### 📺 Videos

YouTube videos display with a [▶ PLAY] button:

```markdown
[VIDEO: Project Demo](https://www.youtube.com/watch?v=dQw4w9WgXcQ)
```

**Features**:
- Automatic YouTube detection
- Clickable play button
- Opens in new tab
- Shows video URL

**Supported**:
- YouTube (`youtube.com` or `youtu.be`)
- Other video links (opens URL directly)

### 📱 Mobile Support

The website now fully supports mobile and iOS devices:

**Responsive Layout**:
- **Desktop**: Sidebar on right (32 columns)
- **Tablet**: Narrower sidebar on right (28 columns)  
- **Mobile**: Compact sidebar at bottom (12 rows)

**Touch Controls**:
- **Tap**: Navigate menu or click links
- **Swipe Up/Down**: Scroll content
- **Pinch**: Handled by browser (zoom)

**iOS Optimizations**:
- Proper viewport settings for iOS Safari
- Touch event handling with momentum
- No zoom on tap (better UX)
- Full-screen web app mode supported

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

The TUI app supports extensive markdown formatting. See [CONTRIBUTING.md](CONTRIBUTING.md) for full details.

### Quick Reference

**Text Formatting**:
```markdown
**bold** *italic* `code`
```

**Links & Media**:
```markdown
[Link text](https://example.com)
![Image](../media/images/image.png)
[VIDEO: Title](https://youtube.com/watch?v=ID)
```

**Code Blocks**:
````markdown
```javascript
const code = 'highlighted';
```
````

**Lists & Tables**:
```markdown
- Bullet list
1. Numbered list

| Header | Header |
|--------|--------|
| Cell   | Cell   |
```

### New Features

- **Images**: Display in styled boxes with [VIEW] button
- **Videos**: YouTube integration with [▶ PLAY] button  
- **Code Blocks**: [COPY] button to copy code
- **Links**: Clickable with → indicator
- **Mobile**: Touch-friendly interaction

## 🔧 Troubleshooting

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed troubleshooting.

### Quick Fixes

**Content Not Loading**:
- Run `./build.sh` to rebuild
- Check browser console for errors
- Verify you're using a local server (not `file://`)

**Theme Not Switching**:
- Clear localStorage: `localStorage.clear()`
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

**Projects Not Appearing**:
- Verify frontmatter format is correct
- Run `./build.sh` to regenerate projects.json
- Check console for fetch errors

**Mobile Layout Issues**:
- Clear browser cache
- Check viewport meta tag is present
- Test in different mobile browsers

**Images/Videos Not Working**:
- Verify file paths are correct (relative from project file)
- Check files exist in `/media/images/` or `/media/videos/`
- For videos, ensure YouTube URL format is correct

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

- **Quick Start**: [QUICK_START.md](QUICK_START.md)
- **Contributing Guide**: [CONTRIBUTING.md](CONTRIBUTING.md)
- **Auto-Update Guide**: [AUTO_UPDATE_GUIDE.md](AUTO_UPDATE_GUIDE.md)
- **Issues**: [GitHub Issues](https://github.com/yourusername/tui-portfolio/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/tui-portfolio/discussions)

## 🗺️ Roadmap

Recent additions (October 2024):
- ✅ Image support with clickable previews
- ✅ YouTube video integration
- ✅ Full mobile/iOS optimization
- ✅ Touch gesture support
- ✅ Consolidated documentation

Future enhancements planned:
- [ ] Command palette (Ctrl+K)
- [ ] Blog section with RSS
- [ ] Project timeline view
- [ ] Tag-based filtering
- [ ] Search across all content
- [ ] Gallery view for images
- [ ] Video playlist support
- [ ] Dark mode customization
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

