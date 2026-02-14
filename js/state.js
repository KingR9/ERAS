// State Management - Premium Version
// Minimal, clean, intentional

export const AppState = {
    eggsFound: new Set(),
    totalEggs: 13,
    vaultUnlocked: false
};

// Easter egg definitions with their Taylor Swift meanings
export const easterEggs = {
    // Lover track - 2 eggs
    'star13': 'Lucky number 13 - Taylor\'s favorite',
    'starApril': 'April 19 - A special date',
    
    // Folklore track - 1 egg
    'threadKnot': 'Invisible string connecting hearts',
    
    // Reputation track - 2 eggs  
    'projections': 'The word that reveals truth',
    'snake': 'From snake to flower - reputation reclaimed',
    
    // Midnights track - 5 eggs
    'midnightStar1': 'Lavender haze star',
    'midnightStar2': 'Lavender haze star',
    'midnightStar3': 'Lavender haze star',
    'midnightStar4': 'Lavender haze star',
    'clock': '1:19 - April 19 at 1:19 AM',
    
    // Track 5 - 1 egg
    'corner': 'The quiet corner of understanding',
    
    // Vault - 2 eggs
    'scarf': 'All Too Well - The red scarf',
    'typewriter': 'All Too Well - Written on a typewriter'
};

// Load state from localStorage
export function loadState() {
    try {
        const saved = localStorage.getItem('erasPremiumState');
        if (saved) {
            const parsed = JSON.parse(saved);
            AppState.eggsFound = new Set(parsed.eggsFound || []);
            AppState.vaultUnlocked = parsed.vaultUnlocked || false;
            
            if (AppState.eggsFound.size > 0) {
                console.log(`%c 💫 Welcome back! ${AppState.eggsFound.size}/13 fragments recovered. `, 
                    'background: rgba(255, 182, 255, 0.2); color: rgba(255, 182, 255, 0.9); padding: 6px 12px; border-radius: 3px;');
            }
            
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

// Console messages - Taylor Swift themed
export function initConsoleMessages() {
    console.log('%c ✨ Our Eras ✨ ', 
        'background: linear-gradient(135deg, #ff9ad5, #c9a227, #9ad6ff); color: white; font-size: 18px; padding: 12px 20px; border-radius: 4px; font-weight: bold;');
    
    console.log('%c A journey through time, hidden in the stars ⭐ ', 
        'color: rgba(255, 182, 255, 0.8); font-style: italic; font-size: 13px; padding: 4px 0;');
    
    console.log('%c 13 fragments scattered across the eras. ', 
        'color: rgba(201, 162, 39, 0.7); font-size: 12px;');
    
    console.log('%c Find them all to unlock the vault. 🔐 ', 
        'color: rgba(255, 255, 255, 0.6); font-size: 11px;');
    
    console.log('');
    console.log('%c Easter Egg Guide: ', 'font-weight: bold; color: rgba(255, 182, 255, 0.9); font-size: 13px;');
    console.log('%c • Lover: Look for the special stars that form 13 ', 'color: rgba(255, 255, 255, 0.7); font-size: 11px;');
    console.log('%c • Folklore: Draw an invisible string with your mouse ', 'color: rgba(255, 255, 255, 0.7); font-size: 11px;');
    console.log('%c • Reputation: Click the underlined word & the snake ', 'color: rgba(255, 255, 255, 0.7); font-size: 11px;');
    console.log('%c • Midnights: Find the lavender haze stars & the clock ', 'color: rgba(255, 255, 255, 0.7); font-size: 11px;');
    console.log('%c • The Vault: Click the red scarf & typewriter ', 'color: rgba(255, 255, 255, 0.7); font-size: 11px;');
    console.log('');
    console.log('%c Press M to toggle background music 🎵 ', 'color: rgba(255, 182, 255, 0.6); font-size: 10px; font-style: italic;');
    console.log('');
}