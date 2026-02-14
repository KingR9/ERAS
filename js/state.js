// State Management - Premium Version
// Minimal, clean, intentional

export const AppState = {
    eggsFound: new Set(),
    totalEggs: 13,
    vaultUnlocked: false
};

// Easter egg definitions with their hidden meanings
export const easterEggs = {
    // Lover track - 2 eggs
    'star13': '',          // One star in the 13 cluster
    'starApril': '',       // Star representing April
    
    // Folklore track - 2 eggs
    'threadKnot': '',      // Where thread intersects
    'connection': '',      // Hidden in text
    
    // Reputation track - 2 eggs  
    'projections': '',     // Hover word egg
    'snake': '',           // Snake SVG click
    
    // Midnights track - 4 eggs
    'midnightStar1': '',   // Special star 1
    'midnightStar2': '',   // Special star 2
    'midnightStar3': '',   // Special star 3
    'midnightStar4': '',   // Special star 4
    'clock': '',           // 1:19 clock
    
    // Track 5 - 1 egg
    'corner': '',          // Hidden corner
    
    // Vault - 2 eggs
    'scarf': '',           // Red scarf treasure
    'typewriter': ''       // Typewriter treasure
};

// Load state from localStorage
export function loadState() {
    try {
        const saved = localStorage.getItem('erasPremiumState');
        if (saved) {
            const parsed = JSON.parse(saved);
            AppState.eggsFound = new Set(parsed.eggsFound || []);
            AppState.vaultUnlocked = parsed.vaultUnlocked || false;
            return true;
        }
    } catch (error) {
        console.error('State load failed:', error);
    }
    return false;
}

// Save state to localStorage
export function saveState() {
    try {
        const stateToSave = {
            eggsFound: Array.from(AppState.eggsFound),
            vaultUnlocked: AppState.vaultUnlocked
        };
        localStorage.setItem('erasPremiumState', JSON.stringify(stateToSave));
    } catch (error) {
        console.error('State save failed:', error);
    }
}

// Console messages - subtle and elegant
export function initConsoleMessages() {
    console.log('%c Our Eras ', 
        'background: linear-gradient(135deg, #ff9ad5, #9ad6ff); color: white; font-size: 16px; padding: 10px; border-radius: 3px;');
    
    console.log('%c Built with intention. Not for headlines. ', 
        'color: #888; font-style: italic; font-size: 12px;');
    
    console.log('%c 13 fragments scattered across time. ', 
        'color: #666; font-size: 11px;');
}