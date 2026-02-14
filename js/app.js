// Main Application

import { AppState, loadState, checkMidnightMode, logConsoleSecrets } from './state.js';
import { initEasterEggs, initStarField, animateStars } from './eggs.js';
import { initVault, addDevTools } from './vault.js';
import { initTheme, getThemeColors } from './theme.js';

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('%c 💕 Our Eras (Your Version) 💕 ', 
        'background: linear-gradient(135deg, #ff9ad5, #9ad6ff); color: white; font-size: 24px; padding: 20px; border-radius: 10px;');
    
    // Load saved state
    loadState();
    
    // Initialize systems
    initTheme();
    initEasterEggs();
    initStarField();
    initVault();
    initTrackObserver();
    initSpecialInteractions();
    setTimeGreeting();
    animateStars();
    
    // Easter eggs for developers
    logConsoleSecrets();
    addDevTools();
    
    console.log('%c Hunt for 13 Easter eggs to unlock the vault... ', 
        'color: #888; font-style: italic;');
});

// Track Navigation Observer
function initTrackObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const trackNum = entry.target.dataset.track;
                AppState.currentTrack = parseInt(trackNum);
                
                // Special message for Track 5
                if (trackNum === '5') {
                    console.log('%c 💔 Track 5 - The Emotional Core ', 
                        'color: #ff6ec7; font-style: italic; font-size: 12px;');
                }
            }
        });
    }, { threshold: 0.6 });
    
    document.querySelectorAll('.track').forEach(track => {
        observer.observe(track);
    });
}

// Special Interactions
function initSpecialInteractions() {
    // Snake to Flower transformation
    const truceBtn = document.getElementById('truceBtn');
    const snakeIcon = document.getElementById('snakeIcon');
    const flowerIcon = document.getElementById('flowerIcon');
    
    if (truceBtn && snakeIcon && flowerIcon) {
        truceBtn.addEventListener('click', () => {
            snakeIcon.style.display = 'none';
            flowerIcon.style.display = 'block';
            truceBtn.textContent = '✨ Truce Accepted';
            truceBtn.style.background = 'linear-gradient(135deg, #a8e6cf 0%, #88d8b0 100%)';
            
            console.log('🐍 ➜ 🌸 Reputation reclaimed');
        });
    }
    
    // Canvas thread drawing
    initThreadCanvas();
}

// Thread Canvas Animation (Track 2)
function initThreadCanvas() {
    const canvas = document.getElementById('threadCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let mouseX = 0;
    let mouseY = 0;
    const points = [];
    
    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        const track = e.target.closest('#track2');
        if (track) {
            mouseX = e.clientX;
            mouseY = e.clientY - track.offsetTop;
            
            points.push({ x: mouseX, y: mouseY });
            if (points.length > 50) {
                points.shift();
            }
        }
    });
    
    // Draw thread
    function drawThread() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (points.length > 1) {
            const colors = getThemeColors();
            
            ctx.strokeStyle = colors.accent;
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
            
            ctx.stroke();
            
            // Fade out old points
            points.forEach((point, i) => {
                const alpha = i / points.length;
                ctx.globalAlpha = alpha;
            });
            ctx.globalAlpha = 1;
        }
        
        requestAnimationFrame(drawThread);
    }
    
    drawThread();
    
    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Set time-based greeting
function setTimeGreeting() {
    const greeting = document.getElementById('timeGreeting');
    if (!greeting) return;
    
    const hour = new Date().getHours();
    let message = '';
    
    if (checkMidnightMode()) {
        message = "It's a Midnights kind of hour.";
    } else if (hour >= 5 && hour < 12) {
        message = "Good morning, Swiftie.";
    } else if (hour >= 12 && hour < 17) {
        message = "Quick break between eras?";
    } else if (hour >= 17 && hour < 22) {
        message = "Evening vibes are here.";
    } else {
        message = "Late night thoughts?";
    }
    
    greeting.textContent = message;
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Press 'R' to reset (for testing)
    if (e.key === 'r' && e.ctrlKey) {
        if (confirm('Reset all progress? This will reload the page.')) {
            import('./state.js').then(module => {
                module.resetState();
            });
        }
    }
    
    // Press numbers 1-4 to switch themes
    if (e.key >= '1' && e.key <= '4') {
        const themes = ['lover', 'folklore', 'reputation', 'midnights'];
        import('./theme.js').then(module => {
            module.setTheme(themes[parseInt(e.key) - 1]);
        });
    }
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Add glitter effect on certain interactions
function addGlitterEffect(x, y) {
    const glitter = document.createElement('div');
    glitter.textContent = '✨';
    glitter.style.position = 'fixed';
    glitter.style.left = x + 'px';
    glitter.style.top = y + 'px';
    glitter.style.pointerEvents = 'none';
    glitter.style.fontSize = '24px';
    glitter.style.zIndex = '9999';
    glitter.style.animation = 'fadeOut 1s ease-out forwards';
    
    document.body.appendChild(glitter);
    
    setTimeout(() => {
        glitter.remove();
    }, 1000);
}

// Add CSS for glitter fadeOut
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-50px);
        }
    }
`;
document.head.appendChild(style);

// Easter egg clicks create glitter
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('egg')) {
        addGlitterEffect(e.clientX, e.clientY);
    }
});

console.log('%c 💝 Built with love for a Swiftie 💝 ', 
    'background: #ff6ec7; color: white; padding: 5px; border-radius: 3px;');