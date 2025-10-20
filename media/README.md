# Media Directory

This directory contains media assets used in project pages.

## Structure

```
media/
├── images/     # Project images, screenshots, diagrams
└── videos/     # Video thumbnails or local video files
```

## Usage in Projects

### Images

```markdown
![Description of image](../media/images/my-image.png)
```

### Videos

For YouTube videos:
```markdown
[VIDEO: Title](https://www.youtube.com/watch?v=VIDEO_ID)
```

For local videos (if hosted):
```markdown
[VIDEO: Title](../media/videos/my-video.mp4)
```

## Supported Formats

### Images
- PNG (.png)
- JPEG (.jpg, .jpeg)
- GIF (.gif)
- SVG (.svg)
- WebP (.webp)

### Videos
- YouTube links (automatically detected and rendered with player)
- Direct video links (.mp4, .webm) - shown with clickable link

## Tips

- Use descriptive filenames: `project-name-screenshot.png`
- Keep image sizes reasonable (<1MB for web)
- Use relative paths from project file: `../media/images/`
- Videos should be hosted on YouTube for best compatibility
