/**
 * TRUE TUI APPLICATION
 * Character-based rendering like real terminal apps (htop, vim, btop, lazygit)
 * Fixed panels, mouse navigation, no scrolling
 */

class TUIApp {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.width = 0;
        this.height = 0;
        this.charWidth = 9;
        this.charHeight = 18;
        this.cols = 0;
        this.rows = 0;
        
        // TUI State
        this.currentView = 'home';
        this.selectedItem = 0;
        this.projectsExpanded = false;
        this.projects = [];
        this.scrollOffset = 0;
        this.hoveredItem = -1;
        
        // HTML content overlay for images/videos
        this.contentOverlay = null;
        
        // Natural scrolling (removed momentum - use native browser scroll)
        this.useNativeScroll = true;
        
        // Clickable elements tracking
        this.clickableElements = []; // Store positions of links, code blocks
        this.hoveredElement = null;
        this.hoveredCodeBlock = null;
        
        // Panel definitions (inspired by btop layout) - sidebar on right
        this.panels = {
            header: { x: 0, y: 0, width: 0, height: 3, title: '' },
            content: { x: 0, y: 3, width: 0, height: 0, title: '┤ CONTENT ├' },
            sidebar: { x: 0, y: 3, width: 32, height: 0, title: '┤ NAVIGATION ├' },
            footer: { x: 0, y: 0, width: 0, height: 3, title: '' }  // Changed from 2 to 3
        };
        
        // Menu items
        this.menuItems = [
            { id: 'home', label: 'Home', type: 'item' },
            { id: 'about', label: 'About', type: 'item' },
            { id: 'skills', label: 'Skills', type: 'item' },
            { id: 'projects', label: 'Projects', type: 'expandable' },
            { id: 'contact', label: 'Contact', type: 'item' }
        ];
        
        // Theme colors (btop-inspired with gradients) - enhanced visibility
        this.colors = {
            bg: '#0a0e14',
            bgDark: '#050810',
            bgLight: '#151b24',
            fg: '#b3b1ad',
            bright: '#e6e1cf',
            dim: '#4d5566',
            green: '#7fd962',
            cyan: '#59c2ff',
            red: '#f07178',
            yellow: '#ffb454',
            blue: '#59c2ff',
            magenta: '#d2a6ff',
            // More visible borders and titles
            border: '#5a6a7a',
            borderBright: '#7d8fa3',
            // Different panel backgrounds for distinction
            panelBg: '#0f141b',
            panelBgNav: '#141920',      // Slightly different for navigation
            panelBgContent: '#0d1117',  // Slightly different for content
            highlight: '#1f2937',
            accent: '#59c2ff',
            // Panel-specific colors
            navBorder: '#4a9eff',       // Blue for navigation
            navTitle: '#6db3ff',
            contentBorder: '#7fd962',   // Green for content
            contentTitle: '#9feb7f'
        };
        
        // Box drawing characters
        this.box = {
            tl: '╭', tr: '╮', bl: '╰', br: '╯',
            h: '─', v: '│',
            tee_r: '├', tee_l: '┤', tee_d: '┬', tee_u: '┴',
            cross: '┼',
            heavy_h: '━', heavy_v: '┃',
            double_h: '═', double_v: '║'
        };
        
        // Content data
        this.content = {
            home: [
                { text: '╔════════════════════════════════════════╗', color: 'accent', type: 'border' },
                { text: '║   WELCOME TO MY PORTFOLIO              ║', color: 'bright', type: 'title' },
                { text: '╚════════════════════════════════════════╝', color: 'accent', type: 'border' },
                { text: '', color: 'fg', type: 'empty' },
                { text: '┌─ Navigation ──────────────────────────┐', color: 'cyan', type: 'box' },
                { text: '│ • Mouse: Click on menu items          │', color: 'fg', type: 'box' },
                { text: '│ • Keyboard: ↑/↓ + Enter               │', color: 'fg', type: 'box' },
                { text: '│ • Quick Keys: Alt+H/A/S/P/C           │', color: 'fg', type: 'box' },
                { text: '└───────────────────────────────────────┘', color: 'cyan', type: 'box' },
                { text: '', color: 'fg', type: 'empty' },
                { text: '┌─ Panel Layout ────────────────────────┐', color: 'cyan', type: 'box' },
                { text: '│ Fixed panels ensure clean separation  │', color: 'fg', type: 'box' },
                { text: '│ Content stays within boundaries       │', color: 'fg', type: 'box' },
                { text: '│ btop/lazygit inspired design          │', color: 'fg', type: 'box' },
                { text: '└───────────────────────────────────────┘', color: 'cyan', type: 'box' },
                { text: '', color: 'fg', type: 'empty' },
                { text: 'Select an item from the navigation panel', color: 'fg', type: 'text' },
                { text: 'to view different sections.', color: 'fg', type: 'text' },
            ],
            about: [],
            skills: [],
            contact: [],
            projects: []
        };
        
        this.init();
    }
    
    async init() {
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        document.getElementById('terminal').appendChild(this.canvas);
        
        // Create content overlay for HTML elements (images, videos)
        this.contentOverlay = document.createElement('div');
        this.contentOverlay.id = 'content-overlay';
        this.contentOverlay.style.position = 'absolute';
        this.contentOverlay.style.pointerEvents = 'auto';
        this.contentOverlay.style.overflowY = 'auto';
        this.contentOverlay.style.overflowX = 'hidden';
        this.contentOverlay.style.scrollBehavior = 'smooth';
        this.contentOverlay.style.zIndex = '5';
        document.getElementById('terminal').appendChild(this.contentOverlay);
        
        console.log('Content overlay created:', this.contentOverlay);
        
        // Set up canvas
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // Position overlay initially
        this.updateContentOverlayPosition();
        
        // Keyboard input
        window.addEventListener('keydown', (e) => this.handleKey(e));
        
        // Mouse input for navigation
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('wheel', (e) => this.handleWheel(e));
        this.canvas.style.cursor = 'default';
        
        // Touch support for mobile/iOS
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
        
        // Load content
        await this.loadContent();
        
        // Set up auto-refresh for projects.json changes
        this.setupProjectsAutoRefresh();
        
        // Start render loop (60fps for smooth updates)
        this.startRenderLoop();
    }
    
    startRenderLoop() {
        this.render();
        requestAnimationFrame(() => this.startRenderLoop());
    }
    
    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        this.cols = Math.floor(this.width / this.charWidth);
        this.rows = Math.floor(this.height / this.charHeight);
        
        // Update panel dimensions based on screen size
        this.updatePanelLayout();
        
        this.render();
    }
    
    updatePanelLayout() {
        // Detect mobile/tablet screens
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
        
        // Header panel (full width, top 3 rows)
        this.panels.header.width = this.cols;
        this.panels.header.height = 3;
        
        // Footer panel (full width, bottom 3 rows for proper spacing)
        this.panels.footer.y = this.rows - 3;
        this.panels.footer.width = this.cols;
        this.panels.footer.height = 3;
        
        // Update content overlay position to match content panel
        if (this.contentOverlay) {
            this.updateContentOverlayPosition();
        }
        
        if (isMobile) {
            // Mobile layout: Stack vertically or hide sidebar initially
            // Sidebar on bottom, smaller
            this.panels.sidebar.x = 0;
            this.panels.sidebar.y = this.rows - 15; // Above footer, smaller height
            this.panels.sidebar.width = this.cols;
            this.panels.sidebar.height = 12; // Compact height
            
            // Content panel takes top area
            this.panels.content.x = 0;
            this.panels.content.y = 3;
            this.panels.content.width = this.cols;
            this.panels.content.height = this.rows - 18; // Space for sidebar + footer
            
            // Update footer to be higher
            this.panels.footer.y = this.rows - 3;
        } else if (isTablet) {
            // Tablet layout: Narrower sidebar
            this.panels.sidebar.x = this.cols - 28; // Slightly narrower
            this.panels.sidebar.y = 3;
            this.panels.sidebar.width = 28;
            this.panels.sidebar.height = this.rows - 6;
            
            // Content panel
            this.panels.content.x = 0;
            this.panels.content.y = 3;
            this.panels.content.width = this.cols - 28;
            this.panels.content.height = this.rows - 6;
        } else {
            // Desktop layout: Sidebar on right (original)
            this.panels.sidebar.x = this.cols - 32;
            this.panels.sidebar.y = 3;
            this.panels.sidebar.width = 32;
            this.panels.sidebar.height = this.rows - 6; // Between header (3) and footer (3)
            
            // Content panel (left side, remaining space)
            this.panels.content.x = 0;
            this.panels.content.y = 3;
            this.panels.content.width = this.cols - 32;
            this.panels.content.height = this.rows - 6; // Between header (3) and footer (3)
        }
    }
    
    async loadContent() {
        // Load projects with cache busting
        try {
            const response = await fetch('projects/projects.json?t=' + Date.now(), {
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });
            if (response.ok) {
                const data = await response.json();
                this.projects = data.projects || [];
                console.log(`📊 Loaded ${this.projects.length} project(s)`);
            }
        } catch (e) {
            console.log('No projects found');
        }
        
        // Load text content
        await this.loadTextContent('about', 'content/about.md');
        await this.loadTextContent('skills', 'content/skills.md');
        await this.loadTextContent('contact', 'content/contact.md');
    }
    
    async loadTextContent(key, path) {
        try {
            // Use cache busting to always get fresh content
            const response = await fetch(`${path}?t=${Date.now()}`, {
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });
            if (response.ok) {
                const text = await response.text();
                // Parse markdown with TUI styling
                const lines = this.parseMarkdownToTUI(text);
                this.content[key] = lines;
            }
        } catch (e) {
            this.content[key] = ['Content not available'];
        }
    }
    
    /**
     * Set up automatic refresh when projects.json changes
     * Polls projects.json periodically to detect changes
     */
    setupProjectsAutoRefresh() {
        let lastModified = null;
        let lastProjectsCount = this.projects.length;
        
        const checkForUpdates = async () => {
            try {
                // Check if projects.json has been modified
                const response = await fetch('projects/projects.json', {
                    method: 'HEAD', // Only get headers, not content
                    cache: 'no-cache'
                });
                
                if (response.ok) {
                    const currentModified = response.headers.get('last-modified');
                    
                    // If we have a previous timestamp and it's different, reload
                    if (lastModified && currentModified !== lastModified) {
                        console.log('🔄 Projects updated, reloading...');
                        await this.reloadProjects();
                    }
                    
                    lastModified = currentModified;
                }
            } catch (e) {
                // Silently fail - might be offline or file not found
            }
        };
        
        // Check every 2 seconds for changes
        setInterval(checkForUpdates, 2000);
        
        console.log('🔄 Auto-refresh enabled for projects');
    }
    
    /**
     * Reload projects list and update UI
     */
    async reloadProjects() {
        const oldProjectsCount = this.projects.length;
        
        try {
            // Force cache bust with timestamp
            const response = await fetch('projects/projects.json?t=' + Date.now(), {
                cache: 'no-store',  // More aggressive than 'no-cache'
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                this.projects = data.projects || [];
                
                console.log(`📊 Projects reloaded: ${oldProjectsCount} → ${this.projects.length}`);
                
                // Show notification in console
                if (this.projects.length > oldProjectsCount) {
                    console.log(`✨ ${this.projects.length - oldProjectsCount} new project(s) added!`);
                } else if (this.projects.length < oldProjectsCount) {
                    console.log(`🗑️  ${oldProjectsCount - this.projects.length} project(s) removed`);
                } else if (this.projects.length === 0 && oldProjectsCount === 0) {
                    // No change, don't spam console
                } else {
                    console.log(`🔄 Projects list updated`);
                }
                
                // Clear cached project content since projects changed
                for (const key in this.content) {
                    if (key.startsWith('project:')) {
                        delete this.content[key];
                    }
                }
                
                // If currently viewing a project that no longer exists, go home
                if (this.currentView.startsWith('project:')) {
                    const currentProjectId = this.currentView.split(':')[1];
                    const projectExists = this.projects.some(p => p.id === currentProjectId);
                    
                    if (!projectExists) {
                        console.log('⚠️  Current project no longer exists, returning home');
                        this.currentView = 'home';
                        this.scrollOffset = 0;
                    }
                }
                
                // UI will update automatically on next render
            }
        } catch (e) {
            console.error('Failed to reload projects:', e);
        }
    }
    
    /**
     * Parse markdown text into TUI-styled lines with formatting metadata
     * @param {string} markdown - Raw markdown text
     * @returns {Array} Array of line objects with text and formatting
     */
    parseMarkdownToTUI(markdown) {
        const lines = [];
        const maxWidth = 78; // Max line width for word wrapping
        
        // Remove frontmatter
        markdown = markdown.replace(/^---[\s\S]*?---\n/, '');
        
        // Split into lines for processing
        const rawLines = markdown.split('\n');
        let i = 0;
        let inCodeBlock = false;
        let codeBlockLines = [];
        let codeBlockLang = '';
        let inList = false;
        let listType = null; // 'ul' or 'ol'
        let listCounter = 1;
        
        while (i < rawLines.length) {
            let line = rawLines[i];
            
            // Handle code blocks
            if (line.trim().startsWith('```')) {
                if (!inCodeBlock) {
                    // Start code block
                    inCodeBlock = true;
                    codeBlockLang = line.trim().substring(3).trim();
                    codeBlockLines = [];
                } else {
                    // End code block - render it
                    const renderedCodeBlock = this.renderCodeBlock(codeBlockLines, codeBlockLang, maxWidth);
                    lines.push(...renderedCodeBlock);
                    inCodeBlock = false;
                    codeBlockLang = '';
                    codeBlockLines = [];
                }
                i++;
                continue;
            }
            
            if (inCodeBlock) {
                codeBlockLines.push(line);
                i++;
                continue;
            }
            
            // Handle horizontal rules
            if (line.trim().match(/^[-*_]{3,}$/)) {
                lines.push({ text: '─'.repeat(maxWidth), color: 'dim', type: 'hr' });
                i++;
                continue;
            }
            
            // Handle headers
            const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
            if (headerMatch) {
                const level = headerMatch[1].length;
                const headerText = headerMatch[2];
                const renderedHeader = this.renderHeader(headerText, level, maxWidth);
                lines.push(...renderedHeader);
                i++;
                continue;
            }
            
            // Handle blockquotes
            if (line.trim().startsWith('>')) {
                const quoteLines = [];
                while (i < rawLines.length && rawLines[i].trim().startsWith('>')) {
                    quoteLines.push(rawLines[i].trim().substring(1).trim());
                    i++;
                }
                const renderedQuote = this.renderBlockquote(quoteLines, maxWidth);
                lines.push(...renderedQuote);
                continue;
            }
            
            // Handle ordered lists
            const olMatch = line.match(/^(\s*)(\d+)\.\s+(.+)$/);
            if (olMatch) {
                const indent = olMatch[1].length;
                const number = olMatch[2];
                const content = olMatch[3];
                if (!inList || listType !== 'ol') {
                    listCounter = 1;
                    listType = 'ol';
                    inList = true;
                }
                const renderedItem = this.renderListItem(content, 'ol', listCounter, indent, maxWidth);
                lines.push(...renderedItem);
                listCounter++;
                i++;
                continue;
            }
            
            // Handle unordered lists
            const ulMatch = line.match(/^(\s*)[-*+]\s+(.+)$/);
            if (ulMatch) {
                const indent = ulMatch[1].length;
                const content = ulMatch[2];
                if (!inList || listType !== 'ul') {
                    listType = 'ul';
                    inList = true;
                }
                const renderedItem = this.renderListItem(content, 'ul', 0, indent, maxWidth);
                lines.push(...renderedItem);
                i++;
                continue;
            }
            
            // Reset list state if not in list
            if (inList && !line.trim().match(/^[-*+\d]/)) {
                inList = false;
                listType = null;
                listCounter = 1;
            }
            
            // Handle tables
            if (line.trim().startsWith('|')) {
                const tableLines = [];
                while (i < rawLines.length && rawLines[i].trim().startsWith('|')) {
                    tableLines.push(rawLines[i]);
                    i++;
                }
                const renderedTable = this.renderTable(tableLines, maxWidth);
                lines.push(...renderedTable);
                continue;
            }
            
            // Handle images
            const imageMatch = line.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
            if (imageMatch) {
                const alt = imageMatch[1];
                const url = imageMatch[2];
                const renderedImage = this.renderImage(alt, url, maxWidth);
                lines.push(...renderedImage);
                i++;
                continue;
            }
            
            // Handle video links (YouTube or direct)
            const videoMatch = line.trim().match(/^\[VIDEO:\s*([^\]]+)\]\(([^)]+)\)$/i);
            if (videoMatch) {
                const title = videoMatch[1];
                const url = videoMatch[2];
                const renderedVideo = this.renderVideo(title, url, maxWidth);
                lines.push(...renderedVideo);
                i++;
                continue;
            }
            
            // Handle empty lines
            if (line.trim() === '') {
                lines.push({ text: '', color: 'fg', type: 'empty' });
                i++;
                continue;
            }
            
            // Handle regular paragraphs with inline formatting
            const wrappedLines = this.wrapTextWithFormatting(line, maxWidth);
            lines.push(...wrappedLines);
            i++;
        }
        
        return lines;
    }
    
    /**
     * Render a header with TUI styling
     */
    renderHeader(text, level, maxWidth) {
        const lines = [];
        const processedText = this.processInlineFormatting(text);
        
        if (level === 1) {
            // H1 - Big box
            const width = Math.min(maxWidth, text.length + 4);
            lines.push({ text: '╔' + '═'.repeat(width - 2) + '╗', color: 'accent', type: 'header' });
            lines.push({ text: '║ ' + text + ' '.repeat(width - text.length - 4) + ' ║', color: 'bright', type: 'header', formatted: processedText });
            lines.push({ text: '╚' + '═'.repeat(width - 2) + '╝', color: 'accent', type: 'header' });
        } else if (level === 2) {
            // H2 - Line above and below
            lines.push({ text: '┌─ ' + text + ' ' + '─'.repeat(Math.max(0, maxWidth - text.length - 4)), color: 'cyan', type: 'header', formatted: processedText });
        } else {
            // H3-H6 - Simple with prefix
            const prefix = '▸ '.repeat(level - 2) + '■ ';
            lines.push({ text: prefix + text, color: 'yellow', type: 'header', formatted: processedText });
        }
        
        lines.push({ text: '', color: 'fg', type: 'empty' });
        return lines;
    }
    
    /**
     * Render a code block with TUI box drawing
     */
    renderCodeBlock(codeLines, lang, maxWidth) {
        const lines = [];
        const title = lang ? ` ${lang} ` : ' code ';
        
        // Add copy button to top border
        const copyButton = '[COPY]';
        const titleSection = '─' + title + '─'.repeat(Math.max(0, maxWidth - title.length - copyButton.length - 4));
        const topBorder = '╭' + titleSection + copyButton + '╮';
        
        // Store code content for copying
        const codeContent = codeLines.join('\n');
        
        lines.push({ 
            text: topBorder, 
            color: 'green', 
            type: 'code-border',
            codeContent: codeContent, // Store for copy functionality
            hasCopyButton: true
        });
        
        for (const codeLine of codeLines) {
            // Truncate or wrap code lines - fix vertical line color
            if (codeLine.length > maxWidth - 4) {
                // Truncate with ellipsis
                lines.push({ 
                    text: '│ ' + codeLine.substring(0, maxWidth - 6) + '… │', 
                    color: 'fg', 
                    colorOverrides: { '│': 'green' }, // Fix vertical line color
                    type: 'code' 
                });
            } else {
                const padding = ' '.repeat(maxWidth - codeLine.length - 4);
                lines.push({ 
                    text: '│ ' + codeLine + padding + ' │', 
                    color: 'fg',
                    colorOverrides: { '│': 'green' }, // Fix vertical line color
                    type: 'code' 
                });
            }
        }
        
        lines.push({ text: '╰' + '─'.repeat(maxWidth - 2) + '╯', color: 'green', type: 'code-border' });
        lines.push({ text: '', color: 'fg', type: 'empty' });
        
        return lines;
    }
    
    /**
     * Render a blockquote with TUI styling
     */
    renderBlockquote(quoteLines, maxWidth) {
        const lines = [];
        const innerWidth = maxWidth - 4;
        
        lines.push({ text: '┌' + '─'.repeat(maxWidth - 2) + '┐', color: 'magenta', type: 'quote-border' });
        
        for (const quoteLine of quoteLines) {
            const wrapped = this.wrapText(quoteLine, innerWidth);
            for (const wrappedLine of wrapped) {
                const padding = ' '.repeat(innerWidth - wrappedLine.length);
                lines.push({ 
                    text: '│ ' + wrappedLine + padding + ' │', 
                    color: 'dim',
                    colorOverrides: { '│': 'magenta' }, // Fix vertical line color
                    type: 'quote' 
                });
            }
        }
        
        lines.push({ text: '└' + '─'.repeat(maxWidth - 2) + '┘', color: 'magenta', type: 'quote-border' });
        lines.push({ text: '', color: 'fg', type: 'empty' });
        
        return lines;
    }
    
    /**
     * Render an image with TUI styling
     */
    renderImage(alt, url, maxWidth) {
        const lines = [];
        const title = alt ? ` 🖼  ${alt} ` : ' 🖼  Image ';
        const viewLink = '[VIEW]';
        
        // Create top border with title and view link
        const titleSection = '─' + title;
        const remainingWidth = maxWidth - titleSection.length - viewLink.length - 2;
        const topBorder = '╭' + titleSection + '─'.repeat(Math.max(0, remainingWidth)) + viewLink + '╮';
        
        lines.push({ 
            text: topBorder, 
            color: 'magenta', 
            type: 'image-border',
            hasViewButton: true,
            imageUrl: url
        });
        
        // Show URL inside box
        const urlText = url.length > maxWidth - 6 ? url.substring(0, maxWidth - 9) + '...' : url;
        const urlPadding = ' '.repeat(Math.max(0, maxWidth - urlText.length - 4));
        lines.push({
            text: '│ ' + urlText + urlPadding + ' │',
            color: 'cyan',
            colorOverrides: { '│': 'magenta' },
            type: 'image-url',
            clickable: true,
            url: url
        });
        
        // Note about TUI limitation
        const note = '(Click VIEW or URL to open in new tab)';
        const notePadding = ' '.repeat(Math.max(0, maxWidth - note.length - 4));
        lines.push({
            text: '│ ' + note + notePadding + ' │',
            color: 'dim',
            colorOverrides: { '│': 'magenta' },
            type: 'image-note'
        });
        
        lines.push({ text: '╰' + '─'.repeat(maxWidth - 2) + '╯', color: 'magenta', type: 'image-border' });
        lines.push({ text: '', color: 'fg', type: 'empty' });
        
        return lines;
    }
    
    /**
     * Render a video link with TUI styling
     */
    renderVideo(title, url, maxWidth) {
        const lines = [];
        const isYoutube = url.includes('youtube.com') || url.includes('youtu.be');
        const icon = isYoutube ? '📺' : '🎬';
        const headerTitle = ` ${icon} ${title} `;
        const playButton = isYoutube ? '[▶ PLAY]' : '[OPEN]';
        
        // Create top border with title and play button
        const titleSection = '─' + headerTitle;
        const remainingWidth = maxWidth - titleSection.length - playButton.length - 2;
        const topBorder = '╭' + titleSection + '─'.repeat(Math.max(0, remainingWidth)) + playButton + '╮';
        
        lines.push({ 
            text: topBorder, 
            color: 'red', 
            type: 'video-border',
            hasPlayButton: true,
            videoUrl: url,
            isYoutube: isYoutube
        });
        
        // Show video URL or YouTube ID
        let displayUrl = url;
        if (isYoutube) {
            // Extract YouTube video ID
            const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
            if (videoIdMatch) {
                displayUrl = `https://youtube.com/watch?v=${videoIdMatch[1]}`;
            }
        }
        
        const urlText = displayUrl.length > maxWidth - 6 ? displayUrl.substring(0, maxWidth - 9) + '...' : displayUrl;
        const urlPadding = ' '.repeat(Math.max(0, maxWidth - urlText.length - 4));
        lines.push({
            text: '│ ' + urlText + urlPadding + ' │',
            color: 'cyan',
            colorOverrides: { '│': 'red' },
            type: 'video-url',
            clickable: true,
            url: url
        });
        
        // Platform info
        const platform = isYoutube ? 'YouTube Video' : 'Video Link';
        const note = `(${platform} - Click PLAY to watch)`;
        const notePadding = ' '.repeat(Math.max(0, maxWidth - note.length - 4));
        lines.push({
            text: '│ ' + note + notePadding + ' │',
            color: 'dim',
            colorOverrides: { '│': 'red' },
            type: 'video-note'
        });
        
        lines.push({ text: '╰' + '─'.repeat(maxWidth - 2) + '╯', color: 'red', type: 'video-border' });
        lines.push({ text: '', color: 'fg', type: 'empty' });
        
        return lines;
    }
    
    /**
     * Render a list item with proper bullets/numbers
     */
    renderListItem(content, type, number, indent, maxWidth) {
        const lines = [];
        const indentStr = ' '.repeat(Math.floor(indent / 2));
        const bullet = type === 'ol' ? `${number}.` : '•';
        const prefix = indentStr + bullet + ' ';
        const innerWidth = maxWidth - prefix.length;
        
        const wrapped = this.wrapText(content, innerWidth);
        for (let i = 0; i < wrapped.length; i++) {
            if (i === 0) {
                lines.push({ 
                    text: prefix + wrapped[i], 
                    color: 'fg', 
                    type: 'list',
                    formatted: this.processInlineFormatting(wrapped[i])
                });
            } else {
                // Continuation lines are indented
                lines.push({ 
                    text: ' '.repeat(prefix.length) + wrapped[i], 
                    color: 'fg', 
                    type: 'list',
                    formatted: this.processInlineFormatting(wrapped[i])
                });
            }
        }
        
        return lines;
    }
    
    /**
     * Render a markdown table with box drawing
     */
    renderTable(tableLines, maxWidth) {
        const lines = [];
        
        // Parse table structure
        const rows = tableLines.map(line => 
            line.split('|')
                .map(cell => cell.trim())
                .filter(cell => cell.length > 0)
        );
        
        if (rows.length < 2) return lines; // Need at least header and separator
        
        // Calculate column widths
        const numCols = rows[0].length;
        const colWidths = new Array(numCols).fill(0);
        
        rows.forEach((row, idx) => {
            if (idx === 1) return; // Skip separator row
            row.forEach((cell, colIdx) => {
                colWidths[colIdx] = Math.max(colWidths[colIdx], cell.length);
            });
        });
        
        // Adjust widths to fit maxWidth
        const totalWidth = colWidths.reduce((a, b) => a + b, 0) + (numCols * 3) + 1;
        if (totalWidth > maxWidth) {
            const ratio = (maxWidth - (numCols * 3) - 1) / colWidths.reduce((a, b) => a + b, 0);
            for (let i = 0; i < colWidths.length; i++) {
                colWidths[i] = Math.floor(colWidths[i] * ratio);
            }
        }
        
        // Top border
        let topBorder = '┌';
        for (let i = 0; i < numCols; i++) {
            topBorder += '─'.repeat(colWidths[i] + 2);
            topBorder += i < numCols - 1 ? '┬' : '┐';
        }
        lines.push({ text: topBorder, color: 'blue', type: 'table-border' });
        
        // Header row
        let headerRow = '│';
        for (let i = 0; i < numCols; i++) {
            const cell = rows[0][i] || '';
            const padding = ' '.repeat(Math.max(0, colWidths[i] - cell.length));
            headerRow += ' ' + cell + padding + ' │';
        }
        lines.push({ 
            text: headerRow, 
            color: 'bright',
            colorOverrides: { '│': 'blue' }, // Fix vertical line color
            type: 'table-header' 
        });
        
        // Header separator
        let separator = '├';
        for (let i = 0; i < numCols; i++) {
            separator += '─'.repeat(colWidths[i] + 2);
            separator += i < numCols - 1 ? '┼' : '┤';
        }
        lines.push({ text: separator, color: 'blue', type: 'table-border' });
        
        // Data rows (skip separator row at index 1)
        for (let rowIdx = 2; rowIdx < rows.length; rowIdx++) {
            let dataRow = '│';
            for (let colIdx = 0; colIdx < numCols; colIdx++) {
                const cell = rows[rowIdx][colIdx] || '';
                const truncated = cell.substring(0, colWidths[colIdx]);
                const padding = ' '.repeat(Math.max(0, colWidths[colIdx] - truncated.length));
                dataRow += ' ' + truncated + padding + ' │';
            }
            lines.push({ 
                text: dataRow, 
                color: 'fg',
                colorOverrides: { '│': 'blue' }, // Fix vertical line color
                type: 'table-data' 
            });
        }
        
        // Bottom border
        let bottomBorder = '└';
        for (let i = 0; i < numCols; i++) {
            bottomBorder += '─'.repeat(colWidths[i] + 2);
            bottomBorder += i < numCols - 1 ? '┴' : '┘';
        }
        lines.push({ text: bottomBorder, color: 'blue', type: 'table-border' });
        lines.push({ text: '', color: 'fg', type: 'empty' });
        
        return lines;
    }
    
    /**
     * Process inline formatting (bold, italic, code, links)
     * Note: Standalone images and videos are handled separately by parseMarkdownToTUI
     */
    processInlineFormatting(text) {
        const segments = [];
        let currentPos = 0;
        
        // Parse inline elements in order they appear
        const patterns = [
            { regex: /\*\*(.+?)\*\*/g, type: 'bold' },
            { regex: /\*(.+?)\*/g, type: 'italic' },
            { regex: /`(.+?)`/g, type: 'code' },
            { regex: /\[([^\]]+)\]\(([^)]+)\)/g, type: 'link' }
            // Note: images are NOT processed inline, they get their own box via parseMarkdownToTUI
        ];
        
        // Find all matches
        const matches = [];
        patterns.forEach(({ regex, type }) => {
            let match;
            const re = new RegExp(regex.source, regex.flags);
            while ((match = re.exec(text)) !== null) {
                matches.push({
                    type,
                    start: match.index,
                    end: match.index + match[0].length,
                    text: match[1],
                    url: match[2] // For links and images
                });
            }
        });
        
        // Sort by position
        matches.sort((a, b) => a.start - b.start);
        
        // Build segments
        let pos = 0;
        for (const match of matches) {
            // Add text before match
            if (match.start > pos) {
                segments.push({ text: text.substring(pos, match.start), type: 'normal' });
            }
            
            // Add formatted segment
            if (match.type === 'link') {
                segments.push({ text: match.text + ' →', type: 'link', url: match.url });
            } else {
                segments.push({ text: match.text, type: match.type });
            }
            
            pos = match.end;
        }
        
        // Add remaining text
        if (pos < text.length) {
            segments.push({ text: text.substring(pos), type: 'normal' });
        }
        
        return segments.length > 0 ? segments : [{ text, type: 'normal' }];
    }
    
    /**
     * Wrap text with inline formatting preserved
     */
    wrapTextWithFormatting(text, maxWidth) {
        const lines = [];
        const segments = this.processInlineFormatting(text);
        
        let currentLine = '';
        let currentFormatted = [];
        
        for (const segment of segments) {
            const words = segment.text.split(' ');
            
            for (let i = 0; i < words.length; i++) {
                const word = words[i];
                const testLine = currentLine + (currentLine ? ' ' : '') + word;
                
                if (testLine.length > maxWidth) {
                    if (currentLine) {
                        lines.push({ 
                            text: currentLine, 
                            color: 'fg', 
                            type: 'paragraph',
                            formatted: currentFormatted
                        });
                        currentLine = word;
                        currentFormatted = [{ text: word, type: segment.type, url: segment.url }];
                    } else {
                        // Single word too long, truncate
                        lines.push({ 
                            text: word.substring(0, maxWidth), 
                            color: 'fg', 
                            type: 'paragraph',
                            formatted: [{ text: word.substring(0, maxWidth), type: segment.type, url: segment.url }]
                        });
                    }
                } else {
                    currentLine = testLine;
                    if (i === 0 && currentFormatted.length > 0 && currentFormatted[currentFormatted.length - 1].type === segment.type) {
                        // Continue previous segment
                        currentFormatted[currentFormatted.length - 1].text += ' ' + word;
                    } else {
                        currentFormatted.push({ text: (i > 0 || currentLine.length > word.length ? ' ' : '') + word, type: segment.type, url: segment.url });
                    }
                }
            }
        }
        
        if (currentLine) {
            lines.push({ 
                text: currentLine, 
                color: 'fg', 
                type: 'paragraph',
                formatted: currentFormatted
            });
        }
        
        return lines;
    }
    
    /**
     * Simple text wrapping without formatting
     */
    wrapText(text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
        
        for (const word of words) {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            if (testLine.length > maxWidth) {
                if (currentLine) {
                    lines.push(currentLine);
                    currentLine = word;
                } else {
                    lines.push(word.substring(0, maxWidth));
                }
            } else {
                currentLine = testLine;
            }
        }
        
        if (currentLine) {
            lines.push(currentLine);
        }
        
        return lines;
    }
    
    async loadProjectContent(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) {
            console.error('Project not found:', projectId);
            return [{ text: 'Project not found', color: 'red', type: 'error' }];
        }
        
        const cacheKey = `project:${projectId}`;
        
        console.log('Loading project content for:', projectId, 'from:', `projects/${project.file}`);
        
        try {
            // Always fetch fresh content with cache busting
            const response = await fetch(`projects/${project.file}?t=${Date.now()}`, {
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });
            if (response.ok) {
                const text = await response.text();
                
                // Parse frontmatter
                const frontmatterMatch = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
                let metadata = {};
                let content = text;
                
                if (frontmatterMatch) {
                    const frontmatter = frontmatterMatch[1];
                    content = text.substring(frontmatterMatch[0].length);
                    
                    // Parse metadata
                    frontmatter.split('\n').forEach(line => {
                        const colonIndex = line.indexOf(':');
                        if (colonIndex > 0) {
                            const key = line.substring(0, colonIndex).trim();
                            let value = line.substring(colonIndex + 1).trim();
                            
                            // Handle arrays [item1, item2]
                            if (value.startsWith('[') && value.endsWith(']')) {
                                value = value.slice(1, -1).split(',').map(item => item.trim());
                            }
                            
                            metadata[key] = value;
                        }
                    });
                }
                
                const lines = [];
                
                // Add metadata section with TUI styling
                if (Object.keys(metadata).length > 0) {
                    const metadataLines = this.renderMetadata(metadata);
                    lines.push(...metadataLines);
                }
                
                // Parse markdown content with TUI styling
                const parsedContent = this.parseMarkdownToTUI(content);
                lines.push(...parsedContent);
                
                // Cache the processed content
                this.content[cacheKey] = lines;
                console.log('Project content loaded successfully:', lines.length, 'lines');
                return lines;
            } else {
                console.error('Failed to fetch project file:', response.status);
                return [{ text: 'Failed to load project content', color: 'red', type: 'error' }];
            }
        } catch (e) {
            console.error('Error loading project:', e);
            return [{ text: 'Error loading project: ' + e.message, color: 'red', type: 'error' }];
        }
    }
    
    /**
     * Render metadata section with TUI styling
     */
    renderMetadata(metadata) {
        const lines = [];
        const maxWidth = 78;
        
        // Title
        if (metadata.title) {
            const width = Math.min(maxWidth, metadata.title.length + 6);
            lines.push({ text: '╔' + '═'.repeat(width - 2) + '╗', color: 'accent', type: 'metadata-border' });
            const padding = ' '.repeat(Math.max(0, width - metadata.title.length - 4));
            lines.push({ text: '║  ' + metadata.title + padding + '║', color: 'bright', type: 'metadata-title' });
            lines.push({ text: '╚' + '═'.repeat(width - 2) + '╝', color: 'accent', type: 'metadata-border' });
            lines.push({ text: '', color: 'fg', type: 'empty' });
        }
        
        // Other metadata
        if (metadata.date) {
            lines.push({ text: '📅 Date: ' + metadata.date, color: 'fg', type: 'metadata' });
        }
        if (metadata.github) {
            lines.push({ text: '🔗 GitHub: ' + metadata.github, color: 'cyan', type: 'metadata-link' });
        }
        if (metadata.demo) {
            lines.push({ text: '🌐 Demo: ' + metadata.demo, color: 'cyan', type: 'metadata-link' });
        }
        if (metadata.tags && Array.isArray(metadata.tags)) {
            lines.push({ text: '🏷️  Tags: ' + metadata.tags.join(', '), color: 'yellow', type: 'metadata' });
        }
        
        if (metadata.date || metadata.github || metadata.demo || metadata.tags) {
            lines.push({ text: '', color: 'fg', type: 'empty' });
            lines.push({ text: '─'.repeat(maxWidth), color: 'dim', type: 'hr' });
            lines.push({ text: '', color: 'fg', type: 'empty' });
        }
        
        return lines;
    }
    
    handleKey(e) {
        switch(e.key) {
            case 'ArrowUp':
                e.preventDefault();
                // If shift is held, scroll content up
                if (e.shiftKey) {
                    this.scrollContent(-1);
                } else {
                    this.selectedItem = Math.max(0, this.selectedItem - 1);
                }
                break;
                
            case 'ArrowDown':
                e.preventDefault();
                // If shift is held, scroll content down
                if (e.shiftKey) {
                    this.scrollContent(1);
                } else {
                    const maxItems = this.getMenuItemCount();
                    this.selectedItem = Math.min(maxItems - 1, this.selectedItem + 1);
                }
                break;
                
            case 'k':
                e.preventDefault();
                this.selectedItem = Math.max(0, this.selectedItem - 1);
                break;
                
            case 'j':
                e.preventDefault();
                const maxItems = this.getMenuItemCount();
                this.selectedItem = Math.min(maxItems - 1, this.selectedItem + 1);
                break;
                
            case 'PageUp':
                e.preventDefault();
                this.scrollContent(-10);
                break;
                
            case 'PageDown':
                e.preventDefault();
                this.scrollContent(10);
                break;
                
            case 'Home':
                e.preventDefault();
                this.scrollOffset = 0;
                break;
                
            case 'End':
                e.preventDefault();
                const maxHeight = this.panels.content.height - 3;
                const lines = this.getCurrentContentLines();
                this.scrollOffset = Math.max(0, lines.length - maxHeight);
                break;
                
            case 'Enter':
            case ' ':
                e.preventDefault();
                this.selectItem();
                break;
                
            case 'q':
            case 'Escape':
                e.preventDefault();
                if (this.currentView !== 'home') {
                    this.currentView = 'home';
                }
                break;
                
            case 't':
                e.preventDefault();
                this.toggleTheme();
                break;
        }
    }
    
    handleWheel(e) {
        // Let the content overlay handle scrolling naturally
        // No need to prevent default or handle manually
    }
    
    updateContentOverlayPosition() {
        if (!this.contentOverlay) return;
        
        const panel = this.panels.content;
        const pixelX = panel.x * this.charWidth;
        const pixelY = panel.y * this.charHeight;
        const pixelWidth = panel.width * this.charWidth;
        const pixelHeight = panel.height * this.charHeight;
        
        this.contentOverlay.style.left = pixelX + 'px';
        this.contentOverlay.style.top = pixelY + 'px';
        this.contentOverlay.style.width = pixelWidth + 'px';
        this.contentOverlay.style.height = pixelHeight + 'px';
        
        console.log('Overlay positioned:', { pixelX, pixelY, pixelWidth, pixelHeight });
    }
    
    scrollContent(delta) {
        // Scroll is now handled by the overlay's native scrolling
        if (this.contentOverlay) {
            this.contentOverlay.scrollTop += delta;
        }
    }
    
    getCurrentContentLines() {
        let lines = [];
        if (this.currentView.startsWith('project:')) {
            const projectId = this.currentView.split(':')[1];
            const cacheKey = `project:${projectId}`;
            lines = this.content[cacheKey] || [{ text: 'Loading project content...', color: 'dim' }];
        } else {
            lines = this.content[this.currentView] || [{ text: 'No content available', color: 'dim' }];
        }
        return lines;
    }
    
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const col = Math.floor(x / this.charWidth);
        const row = Math.floor(y / this.charHeight);
        
        // Check for hovering over clickable elements
        let foundClickable = false;
        for (const element of this.clickableElements) {
            if (row === element.row && col >= element.startCol && col <= element.endCol) {
                this.hoveredElement = element;
                this.canvas.style.cursor = 'pointer';
                foundClickable = true;
                break;
            }
        }
        
        if (!foundClickable) {
            this.hoveredElement = null;
            
            // Check if mouse is over sidebar menu items (now on the right)
            const sidebar = this.panels.sidebar;
            if (col >= sidebar.x && col < sidebar.x + sidebar.width &&
                row >= sidebar.y && row < sidebar.y + sidebar.height) {
                
                const itemIndex = this.getMenuItemAtRow(row);
                if (itemIndex >= 0) {
                    this.hoveredItem = itemIndex;
                    this.canvas.style.cursor = 'pointer';
                    return;
                }
            }
            
            this.hoveredItem = -1;
            this.canvas.style.cursor = 'default';
        }
    }
    
    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const col = Math.floor(x / this.charWidth);
        const row = Math.floor(y / this.charHeight);
        
        console.log('=== CLICK DEBUG ===');
        console.log('Click at row:', row, 'col:', col);
        console.log('Clickable elements:', this.clickableElements.length);
        
        // Check for clickable elements (links, code blocks, images, videos)
        for (const element of this.clickableElements) {
            console.log('Element:', {
                type: element.type,
                row: element.row,
                colRange: `${element.startCol}-${element.endCol}`,
                url: element.url
            });
            
            // Check if click matches this element
            const rowMatch = row === element.row;
            const colMatch = col >= element.startCol && col <= element.endCol;
            
            if (rowMatch && colMatch) {
                console.log('✓ MATCH! Type:', element.type);
                if (element.type === 'link' && element.url) {
                    // Open link in new tab
                    console.log('Opening link:', element.url);
                    window.open(element.url, '_blank', 'noopener,noreferrer');
                    return;
                } else if (element.type === 'copy-button' && element.text) {
                    // Copy code to clipboard
                    console.log('Copying code');
                    this.copyToClipboard(element.text);
                    return;
                } else if (element.type === 'view-button' && element.url) {
                    // Open image in new tab
                    console.log('Opening image:', element.url);
                    window.open(element.url, '_blank', 'noopener,noreferrer');
                    return;
                } else if (element.type === 'play-button' && element.url) {
                    // Open video in new tab
                    console.log('Opening video:', element.url);
                    window.open(element.url, '_blank', 'noopener,noreferrer');
                    return;
                } else if (element.type === 'image-url' && element.url) {
                    // Open image URL
                    console.log('Opening image URL:', element.url);
                    window.open(element.url, '_blank', 'noopener,noreferrer');
                    return;
                } else if (element.type === 'video-url' && element.url) {
                    // Open video URL
                    console.log('Opening video URL:', element.url);
                    window.open(element.url, '_blank', 'noopener,noreferrer');
                    return;
                }
            }
        }
        
        // Check if click is in sidebar (now on the right)
        const sidebar = this.panels.sidebar;
        if (col >= sidebar.x && col < sidebar.x + sidebar.width &&
            row >= sidebar.y && row < sidebar.y + sidebar.height) {
            
            const itemIndex = this.getMenuItemAtRow(row);
            if (itemIndex >= 0) {
                this.selectedItem = itemIndex;
                this.selectItem();
            }
        }
    }
    
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            // Show brief feedback
            console.log('Copied to clipboard!');
            // Could add visual feedback here
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }
    
    handleTouchStart(e) {
        this.touchStartY = e.touches[0].clientY;
        this.touchStartTime = Date.now();
        this.touchStartX = e.touches[0].clientX;
        this.isTouchScroll = false;
    }
    
    handleTouchMove(e) {
        // Let the overlay handle scrolling naturally
        if (!this.touchStartY) return;
        
        const touchY = e.touches[0].clientY;
        const deltaY = Math.abs(this.touchStartY - touchY);
        
        // If significant movement, it's a scroll not a tap
        if (deltaY > 10) {
            this.isTouchScroll = true;
        }
    }
    
    handleTouchEnd(e) {
        if (!this.touchStartX || !this.touchStartY) return;
        
        const touchDuration = Date.now() - this.touchStartTime;
        const touch = e.changedTouches[0];
        const deltaX = Math.abs(touch.clientX - this.touchStartX);
        const deltaY = Math.abs(touch.clientY - this.touchStartY);
        
        // If it was a tap (short duration, minimal movement, not a scroll), treat as click
        if (!this.isTouchScroll && touchDuration < 300 && deltaX < 10 && deltaY < 10) {
            const rect = this.canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            const col = Math.floor(x / this.charWidth);
            const row = Math.floor(y / this.charHeight);
            
            // Check for clickable elements (use same logic as handleClick)
            for (const element of this.clickableElements) {
                const rowMatch = row === element.row;
                const colMatch = col >= element.startCol && col <= element.endCol;
                
                if (rowMatch && colMatch) {
                    if ((element.type === 'link' || element.type === 'view-button' || 
                         element.type === 'play-button' || element.type === 'image-url' || 
                         element.type === 'video-url') && element.url) {
                        window.open(element.url, '_blank', 'noopener,noreferrer');
                        return;
                    } else if (element.type === 'copy-button' && element.text) {
                        this.copyToClipboard(element.text);
                        return;
                    }
                }
            }
            
            // Check sidebar navigation
            const sidebar = this.panels.sidebar;
            if (col >= sidebar.x && col < sidebar.x + sidebar.width &&
                row >= sidebar.y && row < sidebar.y + sidebar.height) {
                
                const itemIndex = this.getMenuItemAtRow(row);
                if (itemIndex >= 0) {
                    this.selectedItem = itemIndex;
                    this.selectItem();
                }
            }
        }
        
        // Reset touch tracking
        this.touchStartY = null;
        this.touchStartX = null;
        this.touchStartTime = null;
    }
    
    getMenuItemAtRow(row) {
        const startRow = this.panels.sidebar.y + 2; // After panel border and title
        let currentRow = startRow;
        let itemIndex = 0;
        
        for (const item of this.menuItems) {
            if (row === currentRow) {
                return itemIndex;
            }
            currentRow++;
            itemIndex++;
            
            if (item.id === 'projects' && this.projectsExpanded) {
                for (let i = 0; i < this.projects.length; i++) {
                    if (row === currentRow) {
                        return itemIndex;
                    }
                    currentRow++;
                    itemIndex++;
                }
            }
        }
        
        return -1;
    }
    
    getMenuItemCount() {
        let count = this.menuItems.length;
        if (this.projectsExpanded) {
            count += this.projects.length;
        }
        return count;
    }
    
    selectItem() {
        let currentIdx = 0;
        
        for (let i = 0; i < this.menuItems.length; i++) {
            const item = this.menuItems[i];
            
            if (currentIdx === this.selectedItem) {
                if (item.type === 'expandable') {
                    this.projectsExpanded = !this.projectsExpanded;
                } else {
                    this.currentView = item.id;
                    this.scrollOffset = 0;
                }
                return;
            }
            
            currentIdx++;
            
            // Check projects submenu
            if (item.id === 'projects' && this.projectsExpanded) {
                for (let j = 0; j < this.projects.length; j++) {
                    if (currentIdx === this.selectedItem) {
                        const projectId = this.projects[j].id;
                        console.log('Selected project:', projectId);
                        this.currentView = `project:${projectId}`;
                        this.scrollOffset = 0;
                        return;
                    }
                    currentIdx++;
                }
            }
        }
    }
    
    toggleTheme() {
        // Toggle between dark and light themes
        if (this.colors.bg === '#0a0e14') {
            // Light theme
            this.colors.bg = '#e6e1cf';
            this.colors.bgDark = '#d9d4c2';
            this.colors.bgLight = '#f0ebe0';
            this.colors.fg = '#4d5566';
            this.colors.bright = '#1f2937';
            this.colors.dim = '#8d93a0';
            this.colors.border = '#b3b1ad';
            this.colors.borderBright = '#a0a0a0';
            this.colors.panelBg = '#ddd8c8';
            this.colors.highlight = '#c8c3b3';
        } else {
            // Dark theme (default)
            this.colors.bg = '#0a0e14';
            this.colors.bgDark = '#050810';
            this.colors.bgLight = '#151b24';
            this.colors.fg = '#b3b1ad';
            this.colors.bright = '#e6e1cf';
            this.colors.dim = '#4d5566';
            this.colors.border = '#2d3640';
            this.colors.borderBright = '#3e4b59';
            this.colors.panelBg = '#0f141b';
            this.colors.highlight = '#1f2937';
        }
    }
    
    render() {
        // Clear screen with background
        this.ctx.fillStyle = this.colors.bg;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Setup text rendering
        this.ctx.font = `${this.charHeight}px 'Courier New', monospace`;
        this.ctx.textBaseline = 'top';
        
        // Step 1: Draw all panel backgrounds first
        this.drawPanelBackground(this.panels.header);
        this.drawPanelBackground(this.panels.content);
        this.drawPanelBackground(this.panels.sidebar);
        this.drawPanelBackground(this.panels.footer);
        
        // Step 2: Draw all panel borders
        this.drawPanelBorder(this.panels.header);
        this.drawPanelBorder(this.panels.content);
        this.drawPanelBorder(this.panels.sidebar);
        this.drawPanelBorder(this.panels.footer);
        
        // Step 3: Draw panel contents (text on top)
        this.drawHeader();
        this.drawContent();
        this.drawSidebar();
        this.drawFooter();
    }
    
    drawPanelBackground(panel) {
        const { x, y, width, height } = panel;
        
        // Choose background color based on panel type
        let bgColor = this.colors.panelBg;
        if (panel === this.panels.sidebar) {
            bgColor = this.colors.panelBgNav;
        } else if (panel === this.panels.content) {
            bgColor = this.colors.panelBgContent;
        }
        
        // Fill panel background using canvas fillRect for better performance
        this.ctx.fillStyle = bgColor;
        
        // Draw background as solid rectangle
        const pixelX = x * this.charWidth;
        const pixelY = y * this.charHeight;
        const pixelWidth = width * this.charWidth;
        const pixelHeight = height * this.charHeight;
        
        this.ctx.fillRect(pixelX, pixelY, pixelWidth, pixelHeight);
    }
    
    drawPanelBorder(panel) {
        const { x, y, width, height, title } = panel;
        
        // Choose border color based on panel type
        let borderColor = this.colors.border;
        let titleColor = this.colors.borderBright;
        
        if (panel === this.panels.sidebar) {
            borderColor = this.colors.navBorder;
            titleColor = this.colors.navTitle;
        } else if (panel === this.panels.content) {
            borderColor = this.colors.contentBorder;
            titleColor = this.colors.contentTitle;
        }
        
        // Draw corners
        this.drawChar(x, y, this.box.tl, borderColor);
        this.drawChar(x + width - 1, y, this.box.tr, borderColor);
        this.drawChar(x, y + height - 1, this.box.bl, borderColor);
        this.drawChar(x + width - 1, y + height - 1, this.box.br, borderColor);
        
        // Calculate title position and length for top border gap
        let titleStart = -1;
        let titleEnd = -1;
        if (title && title.length > 0) {
            titleStart = x + Math.floor((width - title.length) / 2);
            titleEnd = titleStart + title.length;
        }
        
        // Draw top horizontal border (with gap for title)
        for (let i = 1; i < width - 1; i++) {
            const col = x + i;
            // Skip drawing border where title will be
            if (titleStart > 0 && col >= titleStart && col < titleEnd) {
                continue; // Leave gap for title
            }
            this.drawChar(col, y, this.box.h, borderColor);
        }
        
        // Draw bottom horizontal border (no gap needed)
        for (let i = 1; i < width - 1; i++) {
            this.drawChar(x + i, y + height - 1, this.box.h, borderColor);
        }
        
        // Draw vertical borders (left and right)
        for (let i = 1; i < height - 1; i++) {
            this.drawChar(x, y + i, this.box.v, borderColor);
            this.drawChar(x + width - 1, y + i, this.box.v, borderColor);
        }
        
        // Draw panel title AFTER border, with panel-specific color
        if (title && title.length > 0 && titleStart > x && titleEnd < x + width) {
            this.drawText(titleStart, y, title, titleColor);
        }
    }
    
    drawHeader() {
        const panel = this.panels.header;
        const innerY = panel.y + 1; // Inside top border
        const innerWidth = panel.width - 4; // Account for borders and padding
        
        const title = '█ PORTFOLIO TUI █';
        const time = new Date().toLocaleTimeString('en-US', { hour12: false });
        const view = this.currentView.toUpperCase().replace(':', ' › ');
        
        // Calculate positions ensuring we don't overflow
        const titleX = panel.x + 2;
        const timeX = panel.x + Math.floor((panel.width - time.length) / 2);
        const viewX = Math.max(panel.x + 2, panel.x + panel.width - view.length - 2);
        
        // Only draw if positions are valid
        if (titleX + title.length < timeX - 1) {
            this.drawText(titleX, innerY, title, this.colors.accent);
        }
        
        if (timeX > titleX + title.length && timeX + time.length < viewX - 1) {
            this.drawText(timeX, innerY, time, this.colors.green);
        }
        
        if (viewX + view.length < panel.x + panel.width - 1) {
            this.drawText(viewX, innerY, view.substring(0, Math.min(view.length, 20)), this.colors.yellow);
        }
    }
    
    drawSidebar() {
        const panel = this.panels.sidebar;
        let y = panel.y + 2; // Start below border and title
        let currentIdx = 0;
        const maxY = panel.y + panel.height - 1; // Don't draw on bottom border
        const innerWidth = panel.width - 4; // Account for both borders and padding
        const startX = panel.x + 2; // Start inside left border
        
        for (const item of this.menuItems) {
            if (y >= maxY) break; // Don't overflow panel
            
            const isSelected = currentIdx === this.selectedItem;
            const isHovered = currentIdx === this.hoveredItem;
            let color = this.colors.fg;
            let bgColor = null;
            
            if (isSelected) {
                color = this.colors.bright;
                bgColor = this.colors.highlight;
            } else if (isHovered) {
                color = this.colors.cyan;
            }
            
            const prefix = isSelected ? '▶' : ' ';
            
            let text = '';
            if (item.type === 'expandable') {
                const icon = this.projectsExpanded ? '▼' : '▶';
                text = `${prefix} ${icon} ${item.label}`;
            } else {
                text = `${prefix} ● ${item.label}`;
            }
            
            // Truncate text to fit within panel
            text = text.substring(0, innerWidth);
            
            // Draw with background if selected
            if (bgColor) {
                // Fill the background for the entire row first
                for (let i = 1; i < panel.width - 1; i++) {
                    this.drawChar(panel.x + i, y, ' ', this.colors.fg, bgColor);
                }
            }
            // Then draw the text on top
            this.drawText(startX, y, text, color);
            
            y++;
            currentIdx++;
            
            // Draw projects submenu
            if (item.id === 'projects' && this.projectsExpanded) {
                for (const project of this.projects) {
                    if (y >= maxY) break;
                    
                    const projSelected = currentIdx === this.selectedItem;
                    const projHovered = currentIdx === this.hoveredItem;
                    let projColor = this.colors.dim;
                    let projBgColor = null;
                    
                    if (projSelected) {
                        projColor = this.colors.bright;
                        projBgColor = this.colors.highlight;
                    } else if (projHovered) {
                        projColor = this.colors.cyan;
                    }
                    
                    const projPrefix = projSelected ? '▶' : ' ';
                    let projText = `${projPrefix}  ├─ ${project.title}`;
                    
                    // Truncate to fit
                    projText = projText.substring(0, innerWidth);
                    
                    // Draw with background if selected
                    if (projBgColor) {
                        for (let i = 1; i < panel.width - 1; i++) {
                            this.drawChar(panel.x + i, y, ' ', this.colors.fg, projBgColor);
                        }
                    }
                    this.drawText(startX, y, projText, projColor);
                    y++;
                    currentIdx++;
                }
            }
        }
    }
    
    async drawContent() {
        const panel = this.panels.content;
        const startX = panel.x + 2; // Inside left border
        const startY = panel.y + 2; // Below border and title
        const maxWidth = panel.width - 4; // Account for both borders and padding
        const maxHeight = panel.height - 3; // Account for borders and title
        
        // Clear clickable elements for this frame
        this.clickableElements = [];
        
        // Get content for current view
        let lines = [];
        if (this.currentView.startsWith('project:')) {
            const projectId = this.currentView.split(':')[1];
            const cacheKey = `project:${projectId}`;
            
            // Check if content is already loaded
            if (this.content[cacheKey]) {
                lines = this.content[cacheKey];
            } else {
                // Show loading message
                lines = [{ text: 'Loading project content...', color: 'dim', type: 'loading' }];
                
                // Load content asynchronously
                this.loadProjectContent(projectId).then(loadedLines => {
                    this.content[cacheKey] = loadedLines;
                    // No need to call render here as render loop handles it
                });
            }
        } else {
            lines = this.content[this.currentView] || [{ text: 'No content available', color: 'dim', type: 'empty' }];
        }
        
        // Render HTML content in overlay for rich media
        this.renderHTMLContent(lines);
    }
    
    /**
     * Render HTML content in overlay (images, videos, formatted text)
     */
    renderHTMLContent(lines) {
        if (!this.contentOverlay) {
            console.error('No content overlay!');
            return;
        }
        
        console.log('Rendering HTML content, lines:', lines.length);
        
        // Always show something to verify overlay is working
        if (!lines || lines.length === 0) {
            this.contentOverlay.innerHTML = '<div style="padding: 20px; color: #ff6b6b;">No content loaded</div>';
            return;
        }
        
        let html = '<div style="padding: 10px 20px; font-family: \'Courier New\', monospace; font-size: 14px; line-height: 1.6; color: #b3b1ad; background: #0d1117;">';
        
        for (const lineObj of lines) {
            const line = typeof lineObj === 'string' ? lineObj : lineObj.text;
            const lineType = typeof lineObj === 'object' ? lineObj.type : null;
            const imageUrl = typeof lineObj === 'object' ? lineObj.imageUrl : null;
            const videoUrl = typeof lineObj === 'object' ? lineObj.videoUrl : null;
            const isYoutube = typeof lineObj === 'object' ? lineObj.isYoutube : false;
            const formatted = typeof lineObj === 'object' ? lineObj.formatted : null;
            const codeContent = typeof lineObj === 'object' ? lineObj.codeContent : null;
            
            // Render images as actual <img> tags
            if (lineType === 'image-border' && imageUrl) {
                html += `<div style="margin: 20px 0; text-align: center;">`;
                html += `<img src="${imageUrl}" style="max-width: 100%; height: auto; border: 2px solid #d2a6ff; border-radius: 4px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);" alt="Project image" />`;
                html += `<div style="margin-top: 8px; font-size: 12px; color: #8d93a0;">Click to open in full size</div>`;
                html += `</div>`;
                continue;
            }
            
            // Render YouTube videos as embedded iframes
            if (lineType === 'video-border' && videoUrl && isYoutube) {
                // Extract video ID
                const videoIdMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
                if (videoIdMatch) {
                    const videoId = videoIdMatch[1];
                    html += `<div style="margin: 20px 0;">`;
                    html += `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border: 2px solid #f07178; border-radius: 4px;">`;
                    html += `<iframe src="https://www.youtube.com/embed/${videoId}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                    html += `</div>`;
                    html += `</div>`;
                }
                continue;
            }
            
            // Skip other image/video metadata lines
            if (lineType && (lineType.includes('image') || lineType.includes('video'))) {
                continue;
            }
            
            // Render headers with styling
            if (lineType === 'header') {
                if (line.startsWith('╔')) {
                    html += `<div style="margin: 24px 0 8px; padding: 12px; border: 2px solid #59c2ff; border-radius: 4px; background: #151b24;">`;
                } else if (line.startsWith('┌')) {
                    html += `<h2 style="margin: 20px 0 12px; padding-bottom: 8px; border-bottom: 2px solid #59c2ff; color: #59c2ff; font-size: 1.4em;">${line.replace(/[┌─┐]/g, '').trim()}</h2>`;
                    continue;
                } else {
                    html += `<h3 style="margin: 16px 0 10px; color: #ffb454; font-size: 1.2em;">${line.replace(/[▸■]/g, '').trim()}</h3>`;
                    continue;
                }
            }
            
            // Render code blocks
            if (lineType === 'code-border' || lineType === 'code') {
                if (lineType === 'code-border' && codeContent) {
                    html += `<pre style="margin: 16px 0; padding: 16px; background: #0f141b; border: 2px solid #7fd962; border-radius: 4px; overflow-x: auto; position: relative;"><code style="color: #b3b1ad; font-family: 'Courier New', monospace;">${this.escapeHtml(codeContent)}</code></pre>`;
                }
                continue;
            }
            
            // Render regular content with formatting
            if (formatted && Array.isArray(formatted)) {
                html += '<div style="margin: 6px 0;">';
                for (const segment of formatted) {
                    let style = '';
                    let text = this.escapeHtml(segment.text);
                    
                    if (segment.type === 'bold') {
                        html += `<strong style="color: #e6e1cf;">${text}</strong>`;
                    } else if (segment.type === 'italic') {
                        html += `<em style="color: #ffb454;">${text}</em>`;
                    } else if (segment.type === 'code') {
                        html += `<code style="background: #0f141b; padding: 2px 6px; border-radius: 3px; color: #7fd962;">${text}</code>`;
                    } else if (segment.type === 'link' && segment.url) {
                        html += `<a href="${segment.url}" target="_blank" rel="noopener noreferrer" style="color: #59c2ff; text-decoration: none; border-bottom: 1px dotted #59c2ff;">${text}</a>`;
                    } else {
                        html += text;
                    }
                }
                html += '</div>';
            } else if (line && lineType !== 'empty') {
                // Simple line rendering
                let color = '#b3b1ad';
                if (line.startsWith('╔') || line.startsWith('╚') || line.startsWith('┌') || line.startsWith('└')) {
                    color = '#59c2ff';
                }
                html += `<div style="margin: 4px 0; color: ${color};">${this.escapeHtml(line)}</div>`;
            } else if (lineType === 'empty') {
                html += '<div style="height: 8px;"></div>';
            }
        }
        
        html += '</div>';
        this.contentOverlay.innerHTML = html;
        
        console.log('HTML content set, overlay visible:', this.contentOverlay.style.display !== 'none');
        
        // Add click handlers for images
        const images = this.contentOverlay.querySelectorAll('img');
        images.forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                window.open(img.src, '_blank', 'noopener,noreferrer');
            });
        });
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * Draw text with inline formatting (bold, italic, code, links)
     */
    drawFormattedText(x, y, segments, maxWidth, row) {
        let currentX = x;
        let totalLength = 0;
        
        for (const segment of segments) {
            if (totalLength >= maxWidth) break;
            
            const text = segment.text.substring(0, maxWidth - totalLength);
            let color = this.colors.fg;
            const segmentStartX = currentX;
            
            switch (segment.type) {
                case 'bold':
                    color = this.colors.bright;
                    break;
                case 'italic':
                    color = this.colors.yellow;
                    break;
                case 'code':
                    color = this.colors.green;
                    break;
                case 'link':
                    color = this.colors.cyan;
                    // Track link position for click handling
                    if (segment.url && row !== undefined) {
                        this.clickableElements.push({
                            type: 'link',
                            row: row,
                            startCol: segmentStartX,
                            endCol: segmentStartX + text.length - 1,
                            url: segment.url
                        });
                    }
                    break;
                case 'image':
                    color = this.colors.magenta;
                    break;
                default:
                    color = this.colors.fg;
            }
            
            // Draw each character
            for (let i = 0; i < text.length && currentX < x + maxWidth; i++) {
                this.drawChar(currentX, y, text[i], color);
                currentX++;
                totalLength++;
            }
        }
    }
    
    /**
     * Draw text with color overrides for specific characters
     */
    drawTextWithOverrides(x, y, text, defaultColor, overrides) {
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const color = overrides[char] ? this.colors[overrides[char]] || defaultColor : defaultColor;
            this.drawChar(x + i, y, char, color);
        }
    }
    
    drawFooter() {
        const panel = this.panels.footer;
        const innerY = panel.y + 1;
        const innerWidth = panel.width - 4;
        
        const helpText = '↑/↓:Nav │ Shift+↑/↓:Scroll │ Wheel:Scroll │ PgUp/PgDn │ q:Back │ t:Theme';
        const shortHelp = helpText.substring(0, Math.max(20, innerWidth - 15)); // Leave room for status
        
        this.drawText(panel.x + 2, innerY, shortHelp, this.colors.dim);
        
        // Draw scroll info and status indicators on the right
        const lines = this.getCurrentContentLines();
        const maxHeight = this.panels.content.height - 3;
        const scrollInfo = lines.length > maxHeight 
            ? `↕${this.scrollOffset + 1}/${lines.length} ` 
            : '';
        const status = `${scrollInfo}[${this.cols}x${this.rows}]`;
        const statusX = panel.x + panel.width - status.length - 2;
        if (statusX > panel.x + 2 && statusX > panel.x + shortHelp.length + 3) {
            this.drawText(statusX, innerY, status, this.colors.dim);
        }
    }
    
    // Drawing helpers with strict boundary checking
    drawChar(x, y, char, color, bgColor = null) {
        // Strict bounds checking - don't draw outside canvas
        if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) return;
        if (!char) return;
        
        // Draw background if specified (for highlights, etc)
        if (bgColor) {
            this.ctx.fillStyle = bgColor;
            this.ctx.fillRect(x * this.charWidth, y * this.charHeight, this.charWidth, this.charHeight);
        }
        
        // Draw character
        this.ctx.fillStyle = color || this.colors.fg;
        this.ctx.fillText(char, x * this.charWidth, y * this.charHeight);
    }
    
    drawText(x, y, text, color, bgColor = null) {
        if (!text) return;
        
        // Only draw characters that fit within the screen
        for (let i = 0; i < text.length; i++) {
            const charX = x + i;
            if (charX >= 0 && charX < this.cols && y >= 0 && y < this.rows) {
                this.drawChar(charX, y, text[i], color, bgColor);
            }
        }
    }
}

// Start the TUI app when page loads
window.addEventListener('DOMContentLoaded', () => {
    window.tuiApp = new TUIApp();
});
