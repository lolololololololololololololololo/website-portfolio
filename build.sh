#!/bin/bash

# Build script for the TUI Portfolio Website
# Regenerates projects.json from markdown files
# 
# Usage:
#   ./build.sh        - Build once
#   ./build.sh watch  - Build and watch for changes

WATCH_MODE=false

# Check for watch flag
if [ "$1" = "watch" ] || [ "$1" = "--watch" ] || [ "$1" = "-w" ]; then
    WATCH_MODE=true
fi

if [ "$WATCH_MODE" = true ]; then
    echo "🔨 Building TUI Portfolio Website (Watch Mode)..."
    echo ""
    
    # Run the watch script
    node watch-projects.js
else
    echo "🔨 Building TUI Portfolio Website..."
    echo ""
    
    # Run the projects auto-discovery script
    node build-projects.js
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Build complete!"
        echo ""
        echo "To view your changes:"
        echo "  1. Start server: python3 -m http.server 8000"
        echo "  2. Open browser: http://localhost:8000"
        echo "  3. Or refresh if already running"
        echo ""
        echo "💡 Tip: Run './build.sh watch' to auto-rebuild on file changes"
        echo ""
    else
        echo ""
        echo "❌ Build failed!"
        echo "Check the error messages above."
        echo ""
        exit 1
    fi
fi
