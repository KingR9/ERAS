// Main Application - Premium Version
// Cinematic scroll experience with background music
import { AppState, loadState, initConsoleMessages } from './state.js';
import { initEasterEggs, checkVaultStatus } from './eggs.js';

// Music Management
const MusicPlayer = {
    currentAudio: null,
    isPlaying: false,
    volume: 0.3,
    
    audioElements: {
        lover: null,
        folklore: null,
        reputation: null,
        midnights: null
    },
    
    init() {
        // Get audio elements
        this.audioElements.lover = document.getElementById('loverAudio');
        this.audioElements.folklore = document.getElementById('folkloreAudio');
        this.audioElements.reputation = document.getElementById('reputationAudio');
        this.audioElements.midnights = document.getElementById('midnightsAudio');
        
        // Set volume for all
        Object.values(this.audioElements).forEach(audio => {
            if (audio) {
                audio.volume = this.volume;
            }
        });
        
        // Setup music toggle button
        const musicToggle = document.getElementById('musicToggle');
        if (musicToggle) {
            musicToggle.addEventListener('click', () => this.toggleMusic());
        }
    },
    
    play(albumName) {
        const audio = this.audioElements[albumName];
        if (!audio || !this.isPlaying) return;
        
        // Fade out current audio
        if (this.currentAudio && this.currentAudio !== audio) {
            this.fadeOut(this.currentAudio, () => {
                this.currentAudio.pause();
                this.currentAudio.currentTime = 0;
            });
        }
        
        // Fade in new audio
        this.currentAudio = audio;
        audio.currentTime = 0;
        this.fadeIn(audio);
    },
    
    fadeIn(audio) {
        audio.volume = 0;
        audio.play().catch(e => console.log('Audio play prevented:', e));
        
        let vol = 0;
        const fadeInterval = setInterval(() => {
            if (vol < this.volume) {
                vol += 0.05;
                audio.volume = Math.min(vol, this.volume);
            } else {
                clearInterval(fadeInterval);
            }
        }, 100);
    },
    
    fadeOut(audio, callback) {
        let vol = audio.volume;
        const fadeInterval = setInterval(() => {
            if (vol > 0) {
                vol -= 0.05;
                audio.volume = Math.max(vol, 0);
            } else {
                clearInterval(fadeInterval);
                if (callback) callback();
            }
        }, 100);
    },
    
    toggleMusic() {
        this.isPlaying = !this.isPlaying;
        const musicToggle = document.getElementById('musicToggle');
        
        if (this.isPlaying) {
            musicToggle.classList.add('playing');
            // Play current track's music
            const currentTrack = this.getCurrentTrack();
            if (currentTrack) {
                this.play(currentTrack);
            }
        } else {
            musicToggle.classList.remove('playing');
            // Fade out and stop all music
            if (this.currentAudio) {
                this.fadeOut(this.currentAudio, () => {
                    this.currentAudio.pause();
                });
            }
        }
    },
    
    getCurrentTrack() {
        // Find which track is currently most visible
        const tracks = document.querySelectorAll('.track[data-album]');
        let mostVisible = null;
        let maxVisibility = 0;
        
        tracks.forEach(track => {
            const rect = track.getBoundingClientRect();
            const visibility = Math.max(0, Math.min(window.innerHeight, rect.bottom) - Math.max(0, rect.top));
            if (visibility > maxVisibility) {
                maxVisibility = visibility;
                mostVisible = track.dataset.album;
            }
        });
        
        return mostVisible;
    }
};

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
    MusicPlayer.init();
    
    // Check if vault already unlocked
    if (AppState.vaultUnlocked) {
        showUnlockedVault();
    }
    
    // Smooth scroll polyfill
    initSmoothScroll();
    
    // Track scroll for music changes
    initMusicScrollListener();
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

// Music scroll listener
function initMusicScrollListener() {
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (MusicPlayer.isPlaying) {
                const currentTrack = MusicPlayer.getCurrentTrack();
                if (currentTrack && MusicPlayer.currentAudio !== MusicPlayer.audioElements[currentTrack]) {
                    MusicPlayer.play(currentTrack);
                }
            }
        }, 200);
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
                bgImage.style.transform = `scale(1.05) translateY(${translateY}px)`;
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
    
    // M key to toggle music
    if (e.key === 'm' || e.key === 'M') {
        MusicPlayer.toggleMusic();
    }
});

// Log final message
console.log('%c For someone who understands theory and analysis. ✨ ', 
    'color: rgba(201, 162, 39, 0.8); font-style: italic; font-size: 11px;');

console.log('%c Hint: Press M to toggle music 🎵 ', 
    'color: rgba(255, 182, 255, 0.6); font-size: 10px;');