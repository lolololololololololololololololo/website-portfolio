#!/usr/bin/env node

/**
 * AUTO-GENERATE PROJECTS.JSON
 * 
 * This script scans the /projects/ folder for all .md files,
 * reads their frontmatter, and automatically generates projects.json
 * 
 * Usage: node build-projects.js
 */

const fs = require('fs');
const path = require('path');

const PROJECTS_DIR = path.join(__dirname, 'projects');
const OUTPUT_FILE = path.join(PROJECTS_DIR, 'projects.json');

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║     AUTO-GENERATING PROJECTS.JSON FROM MARKDOWN FILES     ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

/**
 * Extract frontmatter from markdown content
 */
function extractFrontmatter(content) {
    const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
    const match = content.match(frontmatterRegex);
    
    if (!match) {
        return null;
    }
    
    const frontmatterText = match[1];
    const frontmatter = {};
    
    // Parse YAML-like frontmatter
    const lines = frontmatterText.split(/\r?\n/);
    for (const line of lines) {
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) continue;
        
        const key = line.substring(0, colonIndex).trim();
        let value = line.substring(colonIndex + 1).trim();
        
        // Handle arrays [tag1, tag2, tag3]
        if (value.startsWith('[') && value.endsWith(']')) {
            value = value.slice(1, -1)
                .split(',')
                .map(v => v.trim().replace(/^['"]|['"]$/g, ''));
        }
        
        frontmatter[key] = value;
    }
    
    // Only return if we found at least title
    return frontmatter.title ? frontmatter : null;
}

/**
 * Scan projects directory and build projects array
 */
function buildProjectsList() {
    const projects = [];
    
    // Read all files in projects directory
    const files = fs.readdirSync(PROJECTS_DIR);
    
    // Filter for .md files, excluding certain files
    const markdownFiles = files.filter(file => {
        return file.endsWith('.md') && 
               file !== 'README.md' && 
               !file.startsWith('.');
    });
    
    console.log(`📁 Found ${markdownFiles.length} markdown file(s):\n`);
    
    for (const file of markdownFiles) {
        const filePath = path.join(PROJECTS_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        
        // Extract frontmatter
        const frontmatter = extractFrontmatter(content);
        
        if (!frontmatter) {
            console.log(`⚠️  ${file} - Missing frontmatter, skipping`);
            continue;
        }
        
        // Generate ID from filename
        const id = path.basename(file, '.md');
        
        // Build project entry
        const project = {
            id: id,
            title: frontmatter.title || id,
            file: file,
            date: frontmatter.date || new Date().toISOString().split('T')[0],
            tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : []
        };
        
        // Add optional fields
        if (frontmatter.github) {
            project.github = frontmatter.github;
        }
        if (frontmatter.demo) {
            project.demo = frontmatter.demo;
        }
        
        projects.push(project);
        
        console.log(`✓ ${file}`);
        console.log(`  Title: ${project.title}`);
        console.log(`  Date:  ${project.date}`);
        console.log(`  Tags:  ${project.tags.join(', ')}`);
        console.log('');
    }
    
    // Sort by date (newest first)
    projects.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    
    return projects;
}

/**
 * Write projects.json file
 */
function writeProjectsJson(projects) {
    const data = {
        projects: projects
    };
    
    const jsonString = JSON.stringify(data, null, 2);
    fs.writeFileSync(OUTPUT_FILE, jsonString + '\n', 'utf-8');
    
    console.log('════════════════════════════════════════════════════════════');
    console.log(`✅ Successfully generated: projects/projects.json`);
    console.log(`📊 Total projects: ${projects.length}`);
    console.log('════════════════════════════════════════════════════════════\n');
}

/**
 * Main execution
 */
try {
    const projects = buildProjectsList();
    
    if (projects.length === 0) {
        console.log('⚠️  No markdown files found with valid frontmatter.');
        console.log('   Creating empty projects.json...\n');
        // Still write the file, just with empty array
    }
    
    writeProjectsJson(projects);
    
    if (projects.length === 0) {
        console.log('💡 Tip: Add .md files with frontmatter to the projects/ folder.');
        console.log('   See project-template.md for an example.\n');
    } else {
        console.log('🎉 Done! Your projects list is up to date.');
        console.log('   Refresh your browser to see changes.\n');
    }
    
} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
}
