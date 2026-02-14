// State Management System

export const AppState = {
    currentTrack: 1,
    eggsFound: new Set(),
    totalEggs: 13,
    vaultUnlocked: false,
    currentTheme: 'lover',
    isMidnightMode: false
};

// Easter egg IDs and their hidden letters for the cipher
export const easterEggs = {
    'thirteen': 'A',      // Track 1
    'knot': 'L',          // Track 2
    'snake': 'W',         // Track 3
    'star1': 'A',         // Track 4
    'star2': 'Y',         // Track 4
    'star3': 'S',         // Track 4
    'star4': '',          // Track 4 (no letter)
    'star5': '',          // Track 4 (no letter)
    'scarf': '',          // Track 6
    'typewriter': '',     // Track 6
    'clock': '',          // Track 6
    'secret': ''          // Track 6
};

// Load state from localStorage
export function loadState() {
    try {
        const saved = localStorage.getItem('erasState');
        if (saved) {
            const parsed = JSON.parse(saved);
            AppState.eggsFound = new Set(parsed.eggsFound || []);
            AppState.vaultUnlocked = parsed.vaultUnlocked || false;
            AppState.currentTheme = parsed.currentTheme || 'lover';
            return true;
        }
    } catch (error) {
        console.error('Failed to load state:', error);
    }
    return false;
}

// Save state to localStorage
export function saveState() {
    try {
        const stateToSave = {
            eggsFound: Array.from(AppState.eggsFound),
            vaultUnlocked: AppState.vaultUnlocked,
            currentTheme: AppState.currentTheme
        };
        localStorage.setItem('erasState', JSON.stringify(stateToSave));
    } catch (error) {
        console.error('Failed to save state:', error);
    }
}

// Reset state (for testing or replay)
export function resetState() {
    AppState.eggsFound.clear();
    AppState.vaultUnlocked = false;
    localStorage.removeItem('erasState');
    location.reload();
}

// Check if midnight mode should be active
export function checkMidnightMode() {
    const hour = new Date().getHours();
    AppState.isMidnightMode = (hour >= 0 && hour < 4);
    return AppState.isMidnightMode;
}

// Get the hidden message from collected eggs
export function getHiddenMessage() {
    const letters = [];
    AppState.eggsFound.forEach(eggId => {
        const letter = easterEggs[eggId];
        if (letter) {
            letters.push(letter);
        }
    });
    return letters.join('');
}

// Console Easter Eggs
export function logConsoleSecrets() {
    console.log('%c You found the real hidden track. ', 
        'background: linear-gradient(135deg, #ff9ad5, #9ad6ff); color: #fff; font-size: 16px; padding: 10px; border-radius: 5px;');
    console.log('%c This was always for you. ', 
        'background: #2d2d2d; color: #ff6ec7; font-size: 14px; padding: 8px;');
    console.log('%c No headlines. Just us. ', 
        'background: #0b1d3a; color: #c9a227; font-size: 14px; padding: 8px;');
    
    console.log('%c 🎵 Hidden Message: ' + (getHiddenMessage() || 'Keep searching...'), 
        'font-size: 12px; color: #888;');
}