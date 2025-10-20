#!/bin/bash

# Quick test script to verify auto-update functionality

echo "🧪 Testing Auto-Update System..."
echo ""

# Check if required files exist
echo "1️⃣  Checking required files..."

if [ ! -f "build-projects.js" ]; then
    echo "❌ build-projects.js not found!"
    exit 1
fi

if [ ! -f "watch-projects.js" ]; then
    echo "❌ watch-projects.js not found!"
    exit 1
fi

if [ ! -f "build.sh" ]; then
    echo "❌ build.sh not found!"
    exit 1
fi

if [ ! -d "projects" ]; then
    echo "❌ projects/ directory not found!"
    exit 1
fi

echo "✅ All required files exist"
echo ""

# Test build script
echo "2️⃣  Testing build script..."
node build-projects.js > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Build script works"
else
    echo "❌ Build script failed!"
    exit 1
fi
echo ""

# Check if projects.json was created
echo "3️⃣  Checking projects.json..."
if [ ! -f "projects/projects.json" ]; then
    echo "❌ projects/projects.json was not created!"
    exit 1
fi

echo "✅ projects.json exists"
echo ""

# Validate JSON
echo "4️⃣  Validating JSON format..."
node -e "JSON.parse(require('fs').readFileSync('projects/projects.json', 'utf8'))" 2> /dev/null

if [ $? -eq 0 ]; then
    echo "✅ projects.json is valid JSON"
else
    echo "❌ projects.json is invalid JSON!"
    exit 1
fi
echo ""

# Count projects
echo "5️⃣  Counting projects..."
PROJECT_COUNT=$(node -e "console.log(JSON.parse(require('fs').readFileSync('projects/projects.json', 'utf8')).projects.length)")
echo "📊 Found $PROJECT_COUNT project(s)"
echo ""

# List projects
echo "6️⃣  Project list:"
node -e "
const data = JSON.parse(require('fs').readFileSync('projects/projects.json', 'utf8'));
data.projects.forEach((p, i) => {
    console.log('   ' + (i+1) + '. ' + p.title + ' (' + p.file + ')');
});
"
echo ""

# Test watch script exists
echo "7️⃣  Checking watch script..."
if [ -x "watch-projects.js" ] || [ -f "watch-projects.js" ]; then
    echo "✅ watch-projects.js is ready"
else
    echo "⚠️  watch-projects.js might need execution permission"
    echo "   Run: chmod +x watch-projects.js"
fi
echo ""

# Summary
echo "═══════════════════════════════════════════════════════════"
echo "✅ AUTO-UPDATE SYSTEM IS READY!"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "📝 To use auto-update mode:"
echo "   Terminal 1: ./build.sh watch"
echo "   Terminal 2: python3 -m http.server 8000"
echo ""
echo "📖 For more info, see: AUTO_UPDATE_GUIDE.md"
echo ""
