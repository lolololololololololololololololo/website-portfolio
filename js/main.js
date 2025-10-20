/**
 * Main Application
 * Handles navigation, routing, and UI interactions
 */

class PortfolioApp {
    constructor() {
        this.currentRoute = 'home';
        this.projectsExpanded = false;
        this.projects = [];
        
        // DOM elements
        this.navMenu = document.getElementById('navMenu');
        this.projectsToggle = document.getElementById('projectsToggle');
        this.projectsSubmenu = document.getElementById('projectsSubmenu');
        this.headerBreadcrumb = document.getElementById('headerBreadcrumb');
        this.headerTime = document.getElementById('headerTime');
        this.headerTitle = document.getElementById('headerTitle');
        
        this.init();
    }
    
    async init() {
        // Set up navigation listeners
        this.setupNavigation();
        
        // Load projects list
        await this.loadProjects();
        
        // Update time display
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
        
        // Load initial page (home)
        this.navigate('home');
        
        // Set up keyboard navigation
        this.setupKeyboardNav();
    }
    
    /**
     * Set up navigation event listeners
     */
    setupNavigation() {
        // Main navigation items
        const navItems = this.navMenu.querySelectorAll('.nav-item:not(.nav-expandable)');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const route = item.getAttribute('data-route');
                if (route) {
                    this.navigate(route);
                }
            });
            
            // Add keyboard support
            item.setAttribute('tabindex', '0');
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    item.click();
                }
            });
        });
        
        // Projects toggle (expandable)
        if (this.projectsToggle) {
            this.projectsToggle.addEventListener('click', () => {
                this.toggleProjects();
            });
            
            this.projectsToggle.setAttribute('tabindex', '0');
            this.projectsToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleProjects();
                }
            });
        }
    }
    
    /**
     * Toggle projects submenu
     */
    toggleProjects() {
        this.projectsExpanded = !this.projectsExpanded;
        
        if (this.projectsExpanded) {
            this.projectsToggle.classList.add('expanded');
            this.projectsSubmenu.classList.add('expanded');
        } else {
            this.projectsToggle.classList.remove('expanded');
            this.projectsSubmenu.classList.remove('expanded');
        }
    }
    
    /**
     * Load projects from projects.json
     */
    async loadProjects() {
        try {
            const response = await fetch('projects/projects.json');
            if (!response.ok) {
                console.warn('projects.json not found, using empty projects list');
                this.projects = [];
                return;
            }
            
            const data = await response.json();
            this.projects = data.projects || [];
            
            // Render projects in submenu
            this.renderProjectsMenu();
            
        } catch (error) {
            console.error('Error loading projects:', error);
            this.projects = [];
        }
    }
    
    /**
     * Render projects in the submenu
     */
    renderProjectsMenu() {
        if (!this.projectsSubmenu) return;
        
        if (this.projects.length === 0) {
            this.projectsSubmenu.innerHTML = `
                <div class="nav-subitem" style="cursor: default; color: var(--text-secondary);">
                    <span class="nav-subitem-icon">─</span>
                    <span>No projects yet</span>
                </div>
            `;
            return;
        }
        
        const projectsHTML = this.projects.map(project => `
            <div class="nav-subitem" data-project-id="${project.id}" tabindex="0">
                <span class="nav-subitem-icon">─</span>
                <span>${project.title}</span>
            </div>
        `).join('');
        
        this.projectsSubmenu.innerHTML = projectsHTML;
        
        // Add click listeners to project items
        const projectItems = this.projectsSubmenu.querySelectorAll('.nav-subitem[data-project-id]');
        projectItems.forEach(item => {
            item.addEventListener('click', () => {
                const projectId = item.getAttribute('data-project-id');
                this.navigateToProject(projectId);
            });
            
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    item.click();
                }
            });
        });
    }
    
    /**
     * Navigate to a route
     * @param {string} route - Route name
     */
    async navigate(route) {
        this.currentRoute = route;
        
        // Update active states
        this.updateActiveStates(route);
        
        // Update breadcrumb
        this.updateBreadcrumb(route);
        
        // Load content based on route
        switch (route) {
            case 'home':
                await window.markdownLoader.loadHome();
                break;
            case 'about':
                await window.markdownLoader.loadMarkdown('content/about.md', 'content');
                break;
            case 'skills':
                await window.markdownLoader.loadMarkdown('content/skills.md', 'content');
                break;
            case 'contact':
                await window.markdownLoader.loadMarkdown('content/contact.md', 'content');
                break;
            default:
                await window.markdownLoader.loadHome();
        }
    }
    
    /**
     * Navigate to a specific project
     * @param {string} projectId - Project ID
     */
    async navigateToProject(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) {
            console.error('Project not found:', projectId);
            return;
        }
        
        this.currentRoute = `project:${projectId}`;
        
        // Update active states
        this.updateActiveStates('projects', projectId);
        
        // Update breadcrumb
        this.updateBreadcrumb(`Projects / ${project.title}`);
        
        // Load project markdown
        await window.markdownLoader.loadMarkdown(
            `projects/${project.file}`,
            'project'
        );
    }
    
    /**
     * Update active navigation states
     * @param {string} route - Current route
     * @param {string} projectId - Optional project ID
     */
    updateActiveStates(route, projectId = null) {
        // Clear all active states
        const allNavItems = this.navMenu.querySelectorAll('.nav-item, .nav-subitem');
        allNavItems.forEach(item => item.classList.remove('active'));
        
        // Set active state for current route
        if (projectId) {
            // Expand projects and highlight specific project
            if (!this.projectsExpanded) {
                this.toggleProjects();
            }
            const projectItem = this.projectsSubmenu.querySelector(
                `[data-project-id="${projectId}"]`
            );
            if (projectItem) {
                projectItem.classList.add('active');
            }
            this.projectsToggle.classList.add('active');
        } else {
            const navItem = this.navMenu.querySelector(`[data-route="${route}"]`);
            if (navItem) {
                navItem.classList.add('active');
            }
        }
    }
    
    /**
     * Update breadcrumb in header
     * @param {string} text - Breadcrumb text
     */
    updateBreadcrumb(text) {
        if (this.headerBreadcrumb) {
            // Capitalize first letter
            const formatted = typeof text === 'string' 
                ? text.charAt(0).toUpperCase() + text.slice(1)
                : text;
            this.headerBreadcrumb.textContent = formatted;
        }
    }
    
    /**
     * Update time display in header
     */
    updateTime() {
        if (this.headerTime) {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            this.headerTime.textContent = `${hours}:${minutes}:${seconds}`;
        }
    }
    
    /**
     * Set up keyboard navigation
     */
    setupKeyboardNav() {
        document.addEventListener('keydown', (e) => {
            // Alt + H: Home
            if (e.altKey && e.key === 'h') {
                e.preventDefault();
                this.navigate('home');
            }
            // Alt + A: About
            if (e.altKey && e.key === 'a') {
                e.preventDefault();
                this.navigate('about');
            }
            // Alt + S: Skills
            if (e.altKey && e.key === 's') {
                e.preventDefault();
                this.navigate('skills');
            }
            // Alt + P: Toggle Projects
            if (e.altKey && e.key === 'p') {
                e.preventDefault();
                this.toggleProjects();
            }
            // Alt + C: Contact
            if (e.altKey && e.key === 'c') {
                e.preventDefault();
                this.navigate('contact');
            }
            // Alt + T: Toggle Theme
            if (e.altKey && e.key === 't') {
                e.preventDefault();
                if (window.themeManager) {
                    window.themeManager.toggleTheme();
                }
            }
        });
    }
    
    /**
     * Refresh projects list (useful after adding new projects)
     */
    async refreshProjects() {
        await this.loadProjects();
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.portfolioApp = new PortfolioApp();
    });
} else {
    window.portfolioApp = new PortfolioApp();
}
