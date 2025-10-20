#!/usr/bin/env node

/**
 * AUTO-WATCH AND REBUILD PROJECTS.JSON
 * 
 * This script watches the /projects/ folder for changes and automatically
 * regenerates projects.json whenever a .md file is added, modified, or deleted.
 * 
 * Usage: node watch-projects.js
 * Or: npm run watch (if added to package.json)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECTS_DIR = path.join(__dirname, 'projects');
const BUILD_SCRIPT = path.join(__dirname, 'build-projects.js');

// Debounce timer to avoid rebuilding on rapid file changes
let rebuildTimer = null;
const DEBOUNCE_MS = 500;

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║         AUTO-WATCH MODE FOR PROJECTS                      ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');
console.log(`📁 Watching directory: ${PROJECTS_DIR}`);
console.log('🔄 Projects will auto-rebuild when you add/edit .md files\n');
console.log('Press Ctrl+C to stop watching\n');
console.log('─'.repeat(60) + '\n');

/**
 * Rebuild projects.json using the existing build script
 */
function rebuildProjects() {
    try {
        console.log('🔨 Rebuilding projects.json...');
        execSync(`node "${BUILD_SCRIPT}"`, { 
            stdio: 'inherit',
            cwd: __dirname 
        });
        console.log('✅ Projects updated successfully!');
        console.log('💡 Refresh your browser to see changes\n');
        console.log('─'.repeat(60) + '\n');
    } catch (error) {
        console.error('❌ Error rebuilding projects:', error.message);
    }
}

/**
 * Debounced rebuild - waits for rapid changes to settle
 */
function scheduleRebuild(filename) {
    // Clear existing timer
    if (rebuildTimer) {
        clearTimeout(rebuildTimer);
    }
    
    console.log(`📝 Detected change: ${filename}`);
    
    // Schedule new rebuild after debounce period
    rebuildTimer = setTimeout(() => {
        rebuildProjects();
    }, DEBOUNCE_MS);
}

/**
 * Watch the projects directory for changes
 */
function startWatching() {
    // Initial build
    rebuildProjects();
    
    // Watch for changes
    fs.watch(PROJECTS_DIR, { recursive: false }, (eventType, filename) => {
        // Only process .md files
        if (filename && filename.endsWith('.md') && filename !== 'README.md') {
            scheduleRebuild(filename);
        }
    });
    
    console.log('👀 Watching for changes...\n');
}

/**
 * Handle graceful shutdown
 */
process.on('SIGINT', () => {
    console.log('\n\n👋 Stopping watch mode...');
    console.log('✅ Projects watch stopped.\n');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n\n👋 Stopping watch mode...');
    process.exit(0);
});

// Start watching
try {
    // Check if projects directory exists
    if (!fs.existsSync(PROJECTS_DIR)) {
        console.error('❌ Error: projects/ directory not found!');
        process.exit(1);
    }
    
    // Check if build script exists
    if (!fs.existsSync(BUILD_SCRIPT)) {
        console.error('❌ Error: build-projects.js not found!');
        process.exit(1);
    }
    
    startWatching();
    
} catch (error) {
    console.error('❌ Failed to start watch mode:', error.message);
    process.exit(1);
}
