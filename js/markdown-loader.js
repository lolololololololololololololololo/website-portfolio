/**
 * Markdown Loader
 * Handles loading, parsing, and rendering markdown content with frontmatter support
 */

class MarkdownLoader {
    constructor() {
        this.cache = new Map();
        this.contentArea = document.getElementById('contentArea');
        
        // Configure marked options
        if (typeof marked !== 'undefined') {
            marked.setOptions({
                breaks: true,
                gfm: true,
                headerIds: true,
                mangle: false
            });
        }
    }
    
    /**
     * Load and render markdown content
     * @param {string} path - Path to the markdown file
     * @param {string} type - Type of content ('content' or 'project')
     * @returns {Promise<void>}
     */
    async loadMarkdown(path, type = 'content') {
        try {
            // Show loading state
            this.showLoading();
            
            // Check cache first
            if (this.cache.has(path)) {
                const cached = this.cache.get(path);
                this.renderContent(cached.html, cached.metadata);
                return;
            }
            
            // Fetch markdown file
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`Failed to load content: ${response.statusText}`);
            }
            
            const markdownText = await response.text();
            
            // Parse frontmatter and content
            const { metadata, content } = this.parseFrontmatter(markdownText);
            
            // Convert markdown to HTML
            let html;
            if (typeof marked !== 'undefined') {
                html = marked.parse(content);
            } else {
                // Fallback if marked.js fails to load
                html = this.simpleMarkdownToHTML(content);
            }
            
            // Cache the result
            this.cache.set(path, { html, metadata });
            
            // Render the content
            this.renderContent(html, metadata, type);
            
        } catch (error) {
            console.error('Error loading markdown:', error);
            this.showError(error.message);
        }
    }
    
    /**
     * Parse YAML frontmatter from markdown
     * @param {string} markdown - Raw markdown content
     * @returns {Object} { metadata, content }
     */
    parseFrontmatter(markdown) {
        const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
        const match = markdown.match(frontmatterRegex);
        
        if (!match) {
            return { metadata: {}, content: markdown };
        }
        
        const [, frontmatter, content] = match;
        const metadata = {};
        
        // Parse YAML-like frontmatter (simple key: value pairs)
        frontmatter.split('\n').forEach(line => {
            const colonIndex = line.indexOf(':');
            if (colonIndex > 0) {
                const key = line.substring(0, colonIndex).trim();
                let value = line.substring(colonIndex + 1).trim();
                
                // Handle arrays [item1, item2]
                if (value.startsWith('[') && value.endsWith(']')) {
                    value = value
                        .slice(1, -1)
                        .split(',')
                        .map(item => item.trim());
                }
                
                metadata[key] = value;
            }
        });
        
        return { metadata, content };
    }
    
    /**
     * Render HTML content with metadata
     * @param {string} html - Rendered HTML
     * @param {Object} metadata - Frontmatter metadata
     * @param {string} type - Content type
     */
    renderContent(html, metadata = {}, type = 'content') {
        if (!this.contentArea) return;
        
        let fullHTML = '';
        
        // Add metadata section for projects
        if (type === 'project' && Object.keys(metadata).length > 0) {
            fullHTML += this.renderMetadata(metadata);
        }
        
        // Add main content
        fullHTML += html;
        
        this.contentArea.innerHTML = fullHTML;
        
        // Apply syntax highlighting to code blocks
        this.highlightCode();
        
        // Scroll to top
        const contentWrapper = document.querySelector('.content-wrapper');
        if (contentWrapper) {
            contentWrapper.scrollTop = 0;
        }
    }
    
    /**
     * Render metadata section for projects
     * @param {Object} metadata - Project metadata
     * @returns {string} HTML string
     */
    renderMetadata(metadata) {
        const items = [];
        
        if (metadata.date) {
            items.push(`
                <div class="metadata-item">
                    <span class="metadata-label">Date:</span>
                    <span class="metadata-value">${metadata.date}</span>
                </div>
            `);
        }
        
        if (metadata.github) {
            items.push(`
                <div class="metadata-item">
                    <span class="metadata-label">GitHub:</span>
                    <a href="${metadata.github}" target="_blank" rel="noopener noreferrer" class="metadata-value">
                        View Repository →
                    </a>
                </div>
            `);
        }
        
        if (metadata.demo) {
            items.push(`
                <div class="metadata-item">
                    <span class="metadata-label">Demo:</span>
                    <a href="${metadata.demo}" target="_blank" rel="noopener noreferrer" class="metadata-value">
                        View Demo →
                    </a>
                </div>
            `);
        }
        
        if (metadata.tags && Array.isArray(metadata.tags)) {
            const tagsHTML = metadata.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
            items.push(`
                <div class="metadata-item">
                    <span class="metadata-label">Tags:</span>
                    <div>${tagsHTML}</div>
                </div>
            `);
        }
        
        if (items.length === 0) return '';
        
        return `<div class="project-metadata">${items.join('')}</div>`;
    }
    
    /**
     * Apply syntax highlighting to code blocks
     */
    highlightCode() {
        if (typeof Prism !== 'undefined') {
            // Use Prism for syntax highlighting
            this.contentArea.querySelectorAll('pre code').forEach(block => {
                // Auto-detect language or use data attribute
                if (!block.className.includes('language-')) {
                    block.className = 'language-javascript'; // Default
                }
                Prism.highlightElement(block);
            });
        }
    }
    
    /**
     * Show loading state
     */
    showLoading() {
        if (this.contentArea) {
            this.contentArea.innerHTML = '<div class="loading">Loading</div>';
        }
    }
    
    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        if (this.contentArea) {
            this.contentArea.innerHTML = `
                <div class="error">
                    <h3>⚠️ Error Loading Content</h3>
                    <p>${message}</p>
                    <p>Please check that the file exists and try again.</p>
                </div>
            `;
        }
    }
    
    /**
     * Load home page content
     */
    async loadHome() {
        const homeHTML = `
            <h1>Welcome to My Portfolio</h1>
            <p>This is a terminal-style portfolio website inspired by btop's aesthetic.</p>
            
            <h2>Navigation</h2>
            <p>Use the sidebar on the left to navigate through different sections:</p>
            <ul>
                <li><strong>About</strong> - Learn more about me</li>
                <li><strong>Skills</strong> - Check out my technical skills</li>
                <li><strong>Projects</strong> - Explore my work and projects</li>
                <li><strong>Contact</strong> - Get in touch with me</li>
            </ul>
            
            <h2>Features</h2>
            <ul>
                <li>🎨 Terminal UI aesthetic with time-based themes</li>
                <li>📝 Dynamic markdown content loading</li>
                <li>💻 Syntax highlighting for code blocks</li>
                <li>🎯 Clean, distraction-free reading experience</li>
            </ul>
            
            <h2>Theme System</h2>
            <p>The theme automatically switches based on time of day:</p>
            <ul>
                <li><strong>Light mode:</strong> 6:00 AM - 6:00 PM</li>
                <li><strong>Dark mode:</strong> 6:00 PM - 6:00 AM</li>
            </ul>
            <p>Click the theme indicator (${document.body.getAttribute('data-theme') === 'dark' ? '🌙' : '☀️'}) in the header to manually toggle between themes.</p>
        `;
        
        this.contentArea.innerHTML = homeHTML;
    }
    
    /**
     * Simple markdown to HTML converter (fallback)
     * @param {string} markdown - Markdown text
     * @returns {string} HTML string
     */
    simpleMarkdownToHTML(markdown) {
        return markdown
            // Headers
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            // Bold
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Italic
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Links
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
            // Line breaks
            .replace(/\n\n/g, '</p><p>')
            // Wrap in paragraphs
            .replace(/^(.+)$/gim, '<p>$1</p>');
    }
    
    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
    }
}

// Initialize markdown loader when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.markdownLoader = new MarkdownLoader();
    });
} else {
    window.markdownLoader = new MarkdownLoader();
}
