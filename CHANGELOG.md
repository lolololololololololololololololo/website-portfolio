# CHANGELOG

All notable changes to this project will be documented in this file.

## [2.0.0] - 2024-10-20

### 🎉 Major Features Added

#### Image Support
- **NEW**: Display images in styled TUI boxes with magenta borders
- **NEW**: Clickable [VIEW] button to open images in new tab
- **NEW**: Support for PNG, JPG, GIF, SVG, WebP formats
- **NEW**: Dedicated `/media/images/` directory for storing project images
- **Format**: `![Description](../media/images/image.png)` on its own line

#### Video Integration
- **NEW**: YouTube video support with [▶ PLAY] button
- **NEW**: Automatic YouTube video ID detection and extraction
- **NEW**: Red-bordered video boxes with platform indicators
- **NEW**: Support for non-YouTube video links
- **Format**: `[VIDEO: Title](https://www.youtube.com/watch?v=ID)`

#### Mobile & iOS Optimization
- **NEW**: Fully responsive layout that adapts to screen size
- **NEW**: Mobile layout with sidebar at bottom (< 768px)
- **NEW**: Tablet layout with narrower sidebar (768px - 1024px)
- **NEW**: Touch gesture support (swipe to scroll, tap to interact)
- **NEW**: iOS-specific meta tags and optimizations
- **NEW**: Touch event handlers with momentum scrolling
- **NEW**: No-zoom on tap for better mobile UX

### 📚 Documentation Improvements

#### New Documentation
- **NEW**: `CONTRIBUTING.md` - Comprehensive contribution guide
- **NEW**: `PROJECT_TEMPLATE.md` - Complete project template
- **NEW**: `QUICK_START.md` - 5-minute quick start guide
- **NEW**: `UPDATE_SUMMARY.md` - Detailed summary of all changes
- **NEW**: `media/README.md` - Media usage guide
- **NEW**: `CHANGELOG.md` - This file

#### Removed Files
- **REMOVED**: `AI_INSTRUCTIONS_CREATE_BLOG_POST.txt` (consolidated into CONTRIBUTING.md)
- **REMOVED**: `QUICK_REFERENCE.txt` (replaced by QUICK_START.md)

#### Updated Documentation
- **UPDATED**: `README.md` - Added new features, reorganized structure
- **UPDATED**: `AUTO_UPDATE_GUIDE.md` - References to new docs

### 🔧 Technical Changes

#### JavaScript (`js/tui-app.js`)
- **NEW**: `renderImage()` function for image display
- **NEW**: `renderVideo()` function for video display
- **NEW**: `handleTouchStart()` for touch tracking
- **NEW**: `handleTouchMove()` for swipe scrolling
- **NEW**: `handleTouchEnd()` for tap detection
- **UPDATED**: `parseMarkdownToTUI()` - Added image and video detection
- **UPDATED**: `handleClick()` - Added image/video button handling
- **UPDATED**: `updatePanelLayout()` - Added responsive breakpoints
- **UPDATED**: `processInlineFormatting()` - Removed inline image handling

#### HTML (`index.html`)
- **UPDATED**: Added iOS-specific meta tags
- **UPDATED**: Improved viewport configuration for mobile
- **UPDATED**: Added web app capability meta tags

#### Project Structure
- **NEW**: `/media/` directory for media assets
- **NEW**: `/media/images/` for project images
- **NEW**: `/media/videos/` for video thumbnails (optional)
- **NEW**: `projects/example-with-media.md` - Example with images/videos

### 🎨 Visual Changes

#### New UI Elements
- Image boxes with magenta borders and 🖼️ icon
- Video boxes with red borders and 📺/🎬 icons
- [VIEW] button for images
- [▶ PLAY] button for videos
- Clickable URL display inside boxes

#### Responsive Layout
- Desktop: Sidebar 32 columns on right
- Tablet: Sidebar 28 columns on right
- Mobile: Sidebar 12 rows at bottom, full-width

### 🚀 Performance

#### Improvements
- Touch events use passive: false for scroll prevention
- Canvas rendering unchanged (no performance impact)
- Images lazy-load (open on click, not embedded)
- Videos external (no iframe overhead)

#### Metrics
- Bundle size increase: ~200 lines in tui-app.js
- Runtime overhead: Minimal (O(n) click detection)
- Load time: Unchanged (no new dependencies)

### 🐛 Bug Fixes
- None (this is a feature release)

### 🔄 Breaking Changes
- **NONE**: Fully backward compatible
- Existing projects work without modification
- New features are opt-in

### 📱 Compatibility

#### Tested On
- ✅ Chrome/Edge (latest) - Desktop & Mobile
- ✅ Firefox (latest) - Desktop & Mobile
- ✅ Safari (latest) - Desktop & iOS
- ✅ iOS Safari - Touch gestures
- ✅ Android Chrome - Touch gestures

#### Not Supported
- ❌ IE11 (not supported in v1.0 either)

### 🎯 Migration Guide

#### For Existing Users
No action required! Your existing projects work as-is.

**To use new features:**
1. Add images: Copy to `/media/images/`, reference with `![]()`
2. Add videos: Use `[VIDEO: Title](URL)` syntax
3. Test on mobile devices

#### For New Users
1. Follow [QUICK_START.md](QUICK_START.md)
2. Use [PROJECT_TEMPLATE.md](PROJECT_TEMPLATE.md)
3. See [CONTRIBUTING.md](CONTRIBUTING.md) for full guide

### 📋 Checklist for Users

After updating, verify:
- [ ] Run `./build.sh` to rebuild projects
- [ ] Test image syntax in a project
- [ ] Test video syntax in a project
- [ ] Test on mobile device or Chrome DevTools mobile view
- [ ] Verify touch scrolling works
- [ ] Verify tap navigation works
- [ ] Check that existing projects still work

### 🙏 Acknowledgments
- btop - Terminal UI inspiration
- iOS Safari - Mobile web standards
- Community feedback for feature requests

---

## [1.0.0] - 2024-10-XX

### Initial Release
- TUI-style portfolio website
- Markdown content support
- Auto-update with watch mode
- Time-based themes
- Syntax highlighting
- Keyboard navigation
- Project management system

---

## Future Releases

### Planned for v2.1.0
- [ ] Image gallery/lightbox view
- [ ] Video playlist support
- [ ] Image optimization tips
- [ ] More mobile gestures
- [ ] Command palette (Ctrl+K)

### Planned for v3.0.0
- [ ] Blog section with RSS
- [ ] Tag-based filtering
- [ ] Search functionality
- [ ] Timeline view
- [ ] i18n support

---

**Note**: This project follows [Semantic Versioning](https://semver.org/).

---

*Last Updated: October 20, 2024*
