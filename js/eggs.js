// Easter Egg System

import { AppState, saveState } from './state.js';
import { checkVault } from './vault.js';

// Initialize Easter egg system
export function initEasterEggs() {
    registerEggClicks();
    updateCounter();
    markFoundEggs();
}

// Register click handlers for all eggs
function registerEggClicks() {
    document.querySelectorAll('[data-egg]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            const eggId = el.dataset.egg;
            collectEgg(eggId, el);
        });
    });
}

// Collect an Easter egg
function collectEgg(eggId, element) {
    if (AppState.eggsFound.has(eggId)) {
        return; // Already found
    }
    
    // Add to found eggs
    AppState.eggsFound.add(eggId);
    
    // Visual feedback
    element.classList.add('collecting');
    
    // Play collection effect
    setTimeout(() => {
        element.classList.add('found');
        element.classList.remove('collecting');
    }, 600);
    
    // Update UI
    updateCounter();
    
    // Save state
    saveState();
    
    // Check if vault should unlock
    checkVault();
    
    // Log to console
    console.log(`🥚 Easter egg found: ${eggId} (${AppState.eggsFound.size}/${AppState.totalEggs})`);
}

// Update the egg counter display
export function updateCounter() {
    const counter = document.getElementById('eggCounter');
    if (counter) {
        counter.textContent = `${AppState.eggsFound.size} / ${AppState.totalEggs}`;
        
        // Add pulse animation when close to completion
        if (AppState.eggsFound.size >= 10 && AppState.eggsFound.size < 13) {
            counter.style.animation = 'pulse 1s ease-in-out infinite';
        } else if (AppState.eggsFound.size === 13) {
            counter.style.animation = 'glowPulse 1s ease-in-out infinite';
        }
    }
}

// Mark already found eggs
function markFoundEggs() {
    document.querySelectorAll('[data-egg]').forEach(el => {
        const eggId = el.dataset.egg;
        if (AppState.eggsFound.has(eggId)) {
            el.classList.add('found');
        }
    });
}

// Initialize the star field with clickable stars
export function initStarField() {
    const starField = document.getElementById('starField');
    if (!starField) return;
    
    const starCount = 50;
    const stars = [];
    
    // Create stars
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        starField.appendChild(star);
        stars.push(star);
    }
    
    // Make 13 stars special (clickable Easter eggs)
    const specialStarIndices = [3, 7, 13, 21, 34]; // 5 special stars
    const starEggIds = ['star1', 'star2', 'star3', 'star4', 'star5'];
    
    specialStarIndices.forEach((index, i) => {
        const star = stars[index];
        const eggId = starEggIds[i];
        
        star.dataset.egg = eggId;
        star.style.cursor = 'pointer';
        
        // Add glow effect to hint they're special
        star.style.boxShadow = '0 0 8px rgba(255, 255, 255, 0.8)';
        
        star.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!AppState.eggsFound.has(eggId)) {
                star.classList.add('clicked');
                collectEgg(eggId, star);
            }
        });
        
        // Mark if already found
        if (AppState.eggsFound.has(eggId)) {
            star.classList.add('clicked');
        }
    });
}

// Animate stars gently
export function animateStars() {
    const stars = document.querySelectorAll('.star');
    
    function twinkle() {
        stars.forEach(star => {
            if (Math.random() > 0.98) {
                star.style.opacity = Math.random() * 0.5 + 0.5;
            }
        });
        requestAnimationFrame(twinkle);
    }
    
    twinkle();
}