// Main Application - Premium Version
// Cinematic scroll experience with intentional interactions

import { AppState, loadState, initConsoleMessages } from './state.js';
import { initEasterEggs, checkVaultStatus } from './eggs.js';

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Console messages
    initConsoleMessages();
    
    // Load saved state
    loadState();
    
    // Initialize systems
    initScrollObserver();
    initEasterEggs();
    checkVaultStatus();
    
    // Check if vault already unlocked
    if (AppState.vaultUnlocked) {
        showUnlockedVault();
    }
    
    // Smooth scroll polyfill
    initSmoothScroll();
});

// Scroll observer for fade-in effects
function initScrollObserver() {
    const options = {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, options);
    
    // Observe all tracks
    document.querySelectorAll('.track').forEach(track => {
        observer.observe(track);
    });
}

// Show unlocked vault state (for returning users)
function showUnlockedVault() {
    const vaultLocked = document.getElementById('vaultLocked');
    const vaultUnlocked = document.getElementById('vaultUnlocked');
    
    if (vaultLocked && vaultUnlocked) {
        vaultLocked.style.display = 'none';
        vaultUnlocked.style.display = 'block';
        
        // Setup final track button
        const playBtn = document.getElementById('playFinalTrack');
        if (playBtn) {
            playBtn.addEventListener('click', () => {
                const finalTrack = document.getElementById('finalTrack');
                if (finalTrack) {
                    finalTrack.style.display = 'flex';
                    finalTrack.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }
    }
}

// Smooth scroll for anchors
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        });
    });
}

// Subtle parallax effect on scroll
let lastScrollY = window.scrollY;
let ticking = false;

window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateParallax();
            ticking = false;
        });
        ticking = true;
    }
});

function updateParallax() {
    const tracks = document.querySelectorAll('.track');
    
    tracks.forEach(track => {
        const rect = track.getBoundingClientRect();
        const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        
        if (scrollProgress > 0 && scrollProgress < 1) {
            const bgImage = track.querySelector('.bg-image');
            if (bgImage) {
                const translateY = (scrollProgress - 0.5) * 20;
                bgImage.style.transform = `scale(1.1) translateY(${translateY}px)`;
            }
        }
    });
}

// Keyboard shortcuts (subtle, for power users)
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + R to reset (with confirmation)
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        if (confirm('Reset all progress? This cannot be undone.')) {
            localStorage.removeItem('erasPremiumState');
            location.reload();
        }
    }
});

// Log final message
console.log('%c For someone who understands theory and analysis. ', 
    'color: rgba(201, 162, 39, 0.6); font-style: italic; font-size: 10px;');