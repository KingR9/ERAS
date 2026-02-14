// Vault System

import { AppState, saveState } from './state.js';

// Check if vault should unlock
export function checkVault() {
    if (AppState.eggsFound.size === AppState.totalEggs && !AppState.vaultUnlocked) {
        unlockVault();
    } else if (AppState.eggsFound.size < AppState.totalEggs) {
        updateVaultHint();
    }
}

// Update the vault hint text
function updateVaultHint() {
    const hint = document.querySelector('.vault-hint');
    if (hint) {
        const remaining = AppState.totalEggs - AppState.eggsFound.size;
        if (remaining === 1) {
            hint.textContent = '1 Easter egg remaining...';
        } else {
            hint.textContent = `${remaining} Easter eggs remaining...`;
        }
    }
}

// Unlock the vault
function unlockVault() {
    AppState.vaultUnlocked = true;
    saveState();
    
    const vaultLocked = document.getElementById('vaultLocked');
    const vaultUnlocked = document.getElementById('vaultUnlocked');
    
    if (!vaultLocked || !vaultUnlocked) return;
    
    // Shake effect
    vaultLocked.classList.add('shaking');
    
    setTimeout(() => {
        vaultLocked.style.display = 'none';
        vaultUnlocked.style.display = 'block';
        
        // Log to console
        console.log('%c 🔓 VAULT UNLOCKED! ', 
            'background: linear-gradient(135deg, #f093fb, #f5576c); color: white; font-size: 20px; padding: 15px; border-radius: 10px;');
        console.log('%c All 13 Easter eggs found! The hidden message is revealed: ALWAYS ', 
            'font-size: 14px; color: #ff6ec7; font-weight: bold;');
    }, 500);
}

// Initialize vault on page load
export function initVault() {
    checkVault();
    
    // Check if already unlocked
    if (AppState.vaultUnlocked) {
        const vaultLocked = document.getElementById('vaultLocked');
        const vaultUnlocked = document.getElementById('vaultUnlocked');
        
        if (vaultLocked && vaultUnlocked) {
            vaultLocked.style.display = 'none';
            vaultUnlocked.style.display = 'block';
        }
    }
    
    // Setup play button
    const playBtn = document.getElementById('playFinalTrack');
    if (playBtn) {
        playBtn.addEventListener('click', revealFinalTrack);
    }
}

// Reveal the final track section
function revealFinalTrack() {
    const finalTrack = document.getElementById('finalTrack');
    
    if (finalTrack) {
        finalTrack.style.display = 'flex';
        
        // Smooth scroll to final track
        finalTrack.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Log to console
        console.log('%c 🎵 Playing the final track... ', 
            'background: linear-gradient(135deg, #ffd89b, #19547b); color: white; font-size: 16px; padding: 10px;');
    }
}

// Easter egg for developers - add a secret unlock command
export function addDevTools() {
    window.unlockVault = () => {
        // Fill all eggs
        const allEggs = ['thirteen', 'knot', 'snake', 'star1', 'star2', 'star3', 'star4', 'star5', 'scarf', 'typewriter', 'clock', 'secret'];
        allEggs.forEach(egg => AppState.eggsFound.add(egg));
        
        // Update UI
        import('./eggs.js').then(module => {
            module.updateCounter();
        });
        
        unlockVault();
        console.log('🔓 Developer mode: Vault force unlocked!');
    };
    
    console.log('%c Developer Tool Available: Type unlockVault() to unlock the vault ', 
        'background: #333; color: #0f0; font-family: monospace; padding: 5px;');
}