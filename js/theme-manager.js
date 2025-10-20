/**
 * Theme Manager
 * Handles automatic time-based theme switching (6AM-6PM: light, 6PM-6AM: dark)
 * Also provides manual theme toggle functionality
 */

class ThemeManager {
    constructor() {
        this.themeIndicator = document.getElementById('themeIndicator');
        this.currentTheme = 'dark';
        this.manualOverride = false;
        
        // Initialize theme
        this.init();
    }
    
    init() {
        // Check for saved manual override in localStorage
        const savedTheme = localStorage.getItem('theme-manual-override');
        if (savedTheme) {
            this.manualOverride = true;
            this.setTheme(savedTheme);
        } else {
            // Set initial theme based on time
            this.updateThemeByTime();
        }
        
        // Update theme every minute (in case time crosses threshold)
        setInterval(() => {
            if (!this.manualOverride) {
                this.updateThemeByTime();
            }
        }, 60000); // Check every minute
        
        // Add click listener for manual toggle
        if (this.themeIndicator) {
            this.themeIndicator.addEventListener('click', () => this.toggleTheme());
            this.themeIndicator.style.cursor = 'pointer';
            this.themeIndicator.setAttribute('title', 'Toggle theme');
        }
    }
    
    /**
     * Determine theme based on current time
     * Light mode: 6:00 AM (06:00) - 6:00 PM (18:00)
     * Dark mode: 6:00 PM (18:00) - 6:00 AM (06:00)
     */
    updateThemeByTime() {
        const now = new Date();
        const hour = now.getHours();
        
        // Light mode between 6 AM and 6 PM (6-17, since 18:00 is 6 PM)
        const shouldBeLightMode = hour >= 6 && hour < 18;
        const newTheme = shouldBeLightMode ? 'light' : 'dark';
        
        if (newTheme !== this.currentTheme) {
            this.setTheme(newTheme);
        }
    }
    
    /**
     * Manually toggle between light and dark theme
     */
    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.manualOverride = true;
        localStorage.setItem('theme-manual-override', newTheme);
        this.setTheme(newTheme);
        
        // Show notification (optional)
        this.showThemeNotification(newTheme);
    }
    
    /**
     * Set the theme
     * @param {string} theme - 'light' or 'dark'
     */
    setTheme(theme) {
        this.currentTheme = theme;
        document.body.setAttribute('data-theme', theme);
        
        // Update theme indicator icon
        if (this.themeIndicator) {
            this.themeIndicator.textContent = theme === 'dark' ? '🌙' : '☀️';
            this.themeIndicator.setAttribute('title', 
                `Current: ${theme} mode (click to toggle)`
            );
        }
        
        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme } 
        }));
    }
    
    /**
     * Show a brief notification about theme change
     * @param {string} theme - The new theme
     */
    showThemeNotification(theme) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 70px;
            right: 20px;
            padding: 12px 20px;
            background: var(--bg-secondary);
            border: 2px solid var(--border);
            border-radius: 6px;
            color: var(--text-primary);
            font-family: 'JetBrains Mono', monospace;
            font-size: 13px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        `;
        notification.textContent = `${theme === 'dark' ? '🌙' : '☀️'} ${theme.charAt(0).toUpperCase() + theme.slice(1)} mode enabled`;
        
        document.body.appendChild(notification);
        
        // Remove after 2 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
    
    /**
     * Reset to automatic time-based theme switching
     */
    resetToAuto() {
        this.manualOverride = false;
        localStorage.removeItem('theme-manual-override');
        this.updateThemeByTime();
    }
    
    /**
     * Get current theme
     * @returns {string} Current theme ('light' or 'dark')
     */
    getTheme() {
        return this.currentTheme;
    }
}

// Add animation keyframes for notification
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize theme manager when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.themeManager = new ThemeManager();
    });
} else {
    window.themeManager = new ThemeManager();
}
