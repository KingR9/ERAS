// Theme System

import { AppState, saveState } from './state.js';

// Set the current theme
export function setTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    AppState.currentTheme = themeName;
    saveState();
    
    console.log(`🎨 Era changed to: ${themeName}`);
}

// Initialize theme system
export function initTheme() {
    // Load saved theme or use default
    const savedTheme = AppState.currentTheme || 'lover';
    setTheme(savedTheme);
    
    // Setup theme buttons
    const themeButtons = document.querySelectorAll('.theme-btn');
    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            setTheme(theme);
            
            // Visual feedback
            btn.style.transform = 'scale(1.2)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 200);
        });
    });
    
    // Highlight active theme button
    updateActiveThemeButton();
}

// Update which theme button appears active
function updateActiveThemeButton() {
    const themeButtons = document.querySelectorAll('.theme-btn');
    themeButtons.forEach(btn => {
        if (btn.dataset.theme === AppState.currentTheme) {
            btn.style.background = 'rgba(255, 255, 255, 0.35)';
            btn.style.transform = 'scale(1.05)';
        } else {
            btn.style.background = '';
            btn.style.transform = '';
        }
    });
}

// Get theme colors for use in canvas/animations
export function getThemeColors() {
    const theme = AppState.currentTheme;
    
    const themeColors = {
        lover: {
            primary: '#ff9ad5',
            secondary: '#9ad6ff',
            accent: '#ff6ec7'
        },
        folklore: {
            primary: '#e8e4df',
            secondary: '#8b7355',
            accent: '#5a4a3a'
        },
        reputation: {
            primary: '#0f0f0f',
            secondary: '#333',
            accent: '#888'
        },
        midnights: {
            primary: '#0b1d3a',
            secondary: '#1b294a',
            accent: '#c9a227'
        }
    };
    
    return themeColors[theme] || themeColors.lover;
}