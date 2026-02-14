// State Management
export const AppState = {
    eggsFound: new Set(),
    totalEggs: 13,
    vaultUnlocked: false
};

// Load state
export function loadState() {
    try {
        const saved = localStorage.getItem('erasState');
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

// Save state
export function saveState() {
    try {
        const stateToSave = {
            eggsFound: Array.from(AppState.eggsFound),
            vaultUnlocked: AppState.vaultUnlocked
        };
        localStorage.setItem('erasState', JSON.stringify(stateToSave));
    } catch (error) {
        console.error('State save failed:', error);
    }
}