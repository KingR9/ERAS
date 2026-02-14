// Main Application
import { AppState, loadState } from './state.js';
import { initEasterEggs, checkVaultStatus } from './eggs.js';

// Music Player
const MusicPlayer = {
    currentAudio: null,
    nextAudio: null,
    isPlaying: false,
    volume: 0.25,
    transitioning: false,
    
    audioElements: {
        lover: null,
        folklore: null,
        reputation: null,
        midnights: null
    },
    
    init() {
        this.audioElements.lover = document.getElementById('loverAudio');
        this.audioElements.folklore = document.getElementById('folkloreAudio');
        this.audioElements.reputation = document.getElementById('reputationAudio');
        this.audioElements.midnights = document.getElementById('midnightsAudio');
        
        Object.values(this.audioElements).forEach(audio => {
            if (audio) {
                audio.volume = this.volume;
                audio.load();
            }
        });
        
        const control = document.getElementById('musicControl');
        control.addEventListener('click', () => this.toggle());
    },
    
    toggle() {
        this.isPlaying = !this.isPlaying;
        const control = document.getElementById('musicControl');
        
        if (this.isPlaying) {
            control.classList.add('playing');
            const currentAlbum = this.getCurrentAlbum();
            if (currentAlbum) this.play(currentAlbum);
        } else {
            control.classList.remove('playing');
            if (this.currentAudio) {
                this.fadeOut(this.currentAudio, () => {
                    this.currentAudio.pause();
                    this.currentAudio.currentTime = 0;
                });
            }
        }
    },
    
    getCurrentAlbum() {
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
    },
    
    play(albumName) {
        if (!this.isPlaying || this.transitioning) return;
        
        const newAudio = this.audioElements[albumName];
        if (!newAudio || newAudio === this.currentAudio) return;
        
        this.transitioning = true;
        this.nextAudio = newAudio;
        
        if (this.currentAudio) {
            // Crossfade
            this.fadeOut(this.currentAudio, () => {
                this.currentAudio.pause();
                this.currentAudio.currentTime = 0;
                this.startNewTrack();
            });
        } else {
            this.startNewTrack();
        }
    },
    
    startNewTrack() {
        if (!this.nextAudio) {
            this.transitioning = false;
            return;
        }
        
        this.currentAudio = this.nextAudio;
        this.nextAudio = null;
        
        this.currentAudio.currentTime = 0;
        this.currentAudio.volume = 0;
        
        this.currentAudio.play().then(() => {
            this.fadeIn(this.currentAudio, () => {
                this.transitioning = false;
            });
        }).catch(err => {
            console.log('Playback prevented:', err);
            this.transitioning = false;
        });
    },
    
    fadeIn(audio, callback) {
        let vol = 0;
        const fadeInterval = setInterval(() => {
            if (vol < this.volume) {
                vol += 0.02;
                audio.volume = Math.min(vol, this.volume);
            } else {
                clearInterval(fadeInterval);
                if (callback) callback();
            }
        }, 50);
    },
    
    fadeOut(audio, callback) {
        let vol = audio.volume;
        const fadeInterval = setInterval(() => {
            if (vol > 0) {
                vol -= 0.02;
                audio.volume = Math.max(vol, 0);
            } else {
                clearInterval(fadeInterval);
                if (callback) callback();
            }
        }, 50);
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    initScrollObserver();
    initEasterEggs();
    checkVaultStatus();
    MusicPlayer.init();
    initHintSystem();
    
    if (AppState.vaultUnlocked) {
        showUnlockedVault();
    }
    
    // Track scroll for music
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (MusicPlayer.isPlaying && !MusicPlayer.transitioning) {
                const currentAlbum = MusicPlayer.getCurrentAlbum();
                if (currentAlbum) {
                    MusicPlayer.play(currentAlbum);
                }
            }
        }, 300);
    });
});

// Scroll observer
function initScrollObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });
    
    document.querySelectorAll('.track').forEach(track => observer.observe(track));
}

// Hint system
function initHintSystem() {
    document.querySelectorAll('.hint-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const hintId = btn.dataset.hint;
            const panel = document.getElementById(`hint-${hintId}`);
            
            // Close all other hints
            document.querySelectorAll('.hint-panel').forEach(p => {
                if (p !== panel) p.classList.remove('active');
            });
            
            panel.classList.toggle('active');
        });
    });
    
    // Close hints when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.hint-toggle') && !e.target.closest('.hint-panel')) {
            document.querySelectorAll('.hint-panel').forEach(p => p.classList.remove('active'));
        }
    });
}

// Show unlocked vault
function showUnlockedVault() {
    const locked = document.getElementById('collectionLocked');
    const unlocked = document.getElementById('collectionUnlocked');
    
    if (locked && unlocked) {
        locked.style.display = 'none';
        unlocked.style.display = 'block';
        
        document.getElementById('finalReveal')?.addEventListener('click', () => {
            const final = document.getElementById('finalTrack');
            if (final) {
                final.style.display = 'flex';
                final.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// Parallax effect
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            document.querySelectorAll('.track').forEach(track => {
                const rect = track.getBoundingClientRect();
                const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                
                if (progress > 0 && progress < 1) {
                    const bg = track.querySelector('.bg-image');
                    if (bg) {
                        const translateY = (progress - 0.5) * 15;
                        bg.style.transform = `scale(1.05) translateY(${translateY}px)`;
                    }
                }
            });
            ticking = false;
        });
        ticking = true;
    }
});

// Reset
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        if (confirm('Reset all progress?')) {
            localStorage.removeItem('erasState');
            location.reload();
        }
    }
});