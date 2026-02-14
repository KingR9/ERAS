// Easter Egg System - Enhanced & More Discoverable
// Taylor Swift themed easter eggs with clear visual cues

import { AppState, saveState } from './state.js';

// Collect an Easter egg
export function collectEgg(eggId, element = null) {
    if (AppState.eggsFound.has(eggId)) {
        return false;
    }
    
    AppState.eggsFound.add(eggId);
    
    // Visual feedback if element provided
    if (element) {
        element.classList.add('collecting');
        setTimeout(() => {
            element.classList.add('found');
        }, 300);
    }
    
    // Update counter with animation
    updateCounter();
    
    // Save state
    saveState();
    
    // Check vault status
    checkVaultStatus();
    
    // Console message
    console.log(`%c ✨ Fragment ${AppState.eggsFound.size}/13 discovered! `, 
        'background: rgba(201, 162, 39, 0.2); color: rgba(201, 162, 39, 1); padding: 4px 8px; border-radius: 3px;');
    
    return true;
}

// Update the egg counter display
export function updateCounter() {
    const counter = document.querySelector('.counter-value');
    if (counter) {
        counter.textContent = AppState.eggsFound.size;
        
        // Pulse animation
        counter.style.transform = 'scale(1.3)';
        setTimeout(() => {
            counter.style.transform = 'scale(1)';
        }, 300);
    }
}

// Initialize all Easter eggs
export function initEasterEggs() {
    initLoverStars();
    initThreadCanvas();
    initReputationInteractions();
    initMidnightStars();
    initTrackFiveSecret();
    initVaultTreasures();
    
    // Mark already found eggs
    markFoundEggs();
    updateCounter();
    
    console.log('%c 🔍 13 Taylor Swift fragments hidden in the eras... ', 
        'color: rgba(255, 182, 255, 0.7); font-style: italic; font-size: 11px;');
}

// Track 1: Lover - 19 stars, 2 special ones form "13"
function initLoverStars() {
    const container = document.getElementById('loverStars');
    if (!container) return;
    
    const stars = [];
    
    // Create 19 stars (Taylor's favorite number + April 19)
    for (let i = 0; i < 19; i++) {
        const star = document.createElement('div');
        star.className = 'lover-star';
        
        // Random positioning
        star.style.left = `${Math.random() * 85 + 7.5}%`;
        star.style.top = `${Math.random() * 75 + 12.5}%`;
        
        // Vary animation delay for twinkling effect
        star.style.animationDelay = `${Math.random() * 3}s`;
        
        container.appendChild(star);
        stars.push(star);
    }
    
    // Stars that form "13" pattern (easier to spot)
    const specialStars = [
        { index: 12, left: '35%', top: '30%', egg: 'star13' },
        { index: 13, left: '40%', top: '32%', egg: 'starApril' }
    ];
    
    specialStars.forEach(({ index, left, top, egg }) => {
        const star = stars[index];
        star.dataset.egg = egg;
        star.style.left = left;
        star.style.top = top;
        star.title = 'Lucky number 13 ✨';
        
        star.addEventListener('click', (e) => {
            e.stopPropagation();
            if (collectEgg(egg, star)) {
                star.classList.add('found');
            }
        });
        
        // Mark if already found
        if (AppState.eggsFound.has(egg)) {
            star.classList.add('found');
        }
    });
}

// Track 2: Folklore - Thread canvas with "invisible string" interaction
function initThreadCanvas() {
    const canvas = document.getElementById('threadCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const points = [];
    let knotDetected = false;
    let drawingActive = false;
    
    const track = document.querySelector('.track-folklore');
    if (!track) return;
    
    // Track mouse/touch movement
    const handleMove = (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        
        if (drawingActive) {
            points.push({ x, y, time: Date.now() });
            if (points.length > 50) {
                points.shift();
            }
            
            // Detect knot (thread crossing itself)
            if (!knotDetected && points.length > 25) {
                if (detectKnot(points)) {
                    knotDetected = true;
                    collectEgg('threadKnot');
                    showKnotEffect(x, y);
                }
            }
        }
    };
    
    canvas.addEventListener('mousedown', () => { drawingActive = true; });
    canvas.addEventListener('mouseup', () => { drawingActive = false; points.length = 0; });
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('touchstart', () => { drawingActive = true; });
    canvas.addEventListener('touchend', () => { drawingActive = false; points.length = 0; });
    canvas.addEventListener('touchmove', handleMove);
    
    // Draw thread
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (points.length > 1) {
            ctx.strokeStyle = 'rgba(255, 182, 255, 0.6)';
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            
            for (let i = 1; i < points.length; i++) {
                const alpha = i / points.length;
                ctx.globalAlpha = alpha * 0.8;
                ctx.lineTo(points[i].x, points[i].y);
            }
            
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
        
        requestAnimationFrame(draw);
    }
    
    draw();
    
    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Detect if thread crosses itself (forms a knot/loop)
function detectKnot(points) {
    if (points.length < 25) return false;
    
    const recent = points[points.length - 1];
    const middle = points[Math.floor(points.length / 2)];
    
    const distance = Math.hypot(recent.x - middle.x, recent.y - middle.y);
    return distance < 40; // Easier threshold
}

// Show knot effect
function showKnotEffect(x, y) {
    const canvas = document.getElementById('threadCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let alpha = 1;
    let radius = 10;
    
    function drawKnot() {
        if (alpha <= 0) return;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = 'rgba(201, 162, 39, 1)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        
        alpha -= 0.03;
        radius += 1;
        requestAnimationFrame(drawKnot);
    }
    
    drawKnot();
    
    // Show success message
    const hint = document.querySelector('.track-folklore .easter-hint');
    if (hint) {
        hint.textContent = '✨ Invisible string found!';
        hint.style.color = 'rgba(201, 162, 39, 0.8)';
    }
}

// Track 3: Reputation - Word hover and snake transformation
function initReputationInteractions() {
    const triggerWord = document.querySelector('[data-egg="projections"]');
    const snakeSvg = document.getElementById('snakeSvg');
    const flowerSvg = document.getElementById('flowerSvg');
    
    if (triggerWord && snakeSvg) {
        // Click the word to collect
        triggerWord.addEventListener('click', () => {
            if (collectEgg('projections', triggerWord)) {
                triggerWord.style.borderColor = 'rgba(201, 162, 39, 0.8)';
                triggerWord.style.background = 'rgba(201, 162, 39, 0.1)';
            }
        });
        
        // Hover to reveal snake
        triggerWord.addEventListener('mouseenter', () => {
            snakeSvg.style.opacity = '1';
        });
        
        triggerWord.addEventListener('mouseleave', () => {
            if (!AppState.eggsFound.has('snake')) {
                snakeSvg.style.opacity = '0';
            }
        });
        
        // Click snake to transform to flower
        snakeSvg.addEventListener('click', () => {
            if (collectEgg('snake', snakeSvg)) {
                setTimeout(() => {
                    snakeSvg.style.display = 'none';
                    flowerSvg.style.display = 'block';
                    flowerSvg.style.opacity = '1';
                    
                    const hint = document.querySelector('.track-reputation .easter-hint');
                    if (hint) {
                        hint.textContent = '🌸 From reputation to bloom...';
                        hint.style.color = 'rgba(255, 182, 193, 0.8)';
                    }
                }, 300);
            }
        });
        
        // Mark if already found
        if (AppState.eggsFound.has('projections')) {
            triggerWord.style.borderColor = 'rgba(201, 162, 39, 0.8)';
            triggerWord.style.background = 'rgba(201, 162, 39, 0.1)';
        }
        
        if (AppState.eggsFound.has('snake')) {
            snakeSvg.style.display = 'none';
            flowerSvg.style.display = 'block';
            flowerSvg.style.opacity = '1';
        }
    }
}

// Track 4: Midnights - Lavender haze stars and 1:19 clock
function initMidnightStars() {
    const container = document.getElementById('midnightStars');
    if (!container) return;
    
    const stars = [];
    
    // Create 19 stars
    for (let i = 0; i < 19; i++) {
        const star = document.createElement('div');
        star.className = 'midnight-star';
        
        star.style.left = `${Math.random() * 85 + 7.5}%`;
        star.style.top = `${Math.random() * 75 + 12.5}%`;
        star.style.animationDelay = `${Math.random() * 4}s`;
        
        container.appendChild(star);
        stars.push(star);
    }
    
    // Make 4 stars special (lavender haze themed)
    const specialIndices = [3, 7, 11, 15];
    const eggIds = ['midnightStar1', 'midnightStar2', 'midnightStar3', 'midnightStar4'];
    
    specialIndices.forEach((index, i) => {
        const star = stars[index];
        star.classList.add('special');
        star.dataset.egg = eggIds[i];
        star.title = 'Lavender haze ✨';
        
        star.addEventListener('click', (e) => {
            e.stopPropagation();
            if (collectEgg(eggIds[i], star)) {
                star.classList.add('found');
            }
        });
        
        // Mark if already found
        if (AppState.eggsFound.has(eggIds[i])) {
            star.classList.add('found');
        }
    });
    
    // Clock easter egg (1:19 = January 19, possible reference)
    const clock = document.querySelector('[data-egg="clock"]');
    if (clock) {
        clock.addEventListener('click', () => {
            if (collectEgg('clock', clock)) {
                clock.style.color = 'rgba(201, 162, 39, 1)';
                clock.style.borderColor = 'rgba(201, 162, 39, 1)';
                clock.style.background = 'rgba(201, 162, 39, 0.15)';
                
                const hint = document.querySelector('.track-midnights .easter-hint');
                if (hint) {
                    hint.textContent = '⏰ April 19 at 1:19 AM - a special time...';
                    hint.style.color = 'rgba(201, 162, 39, 0.8)';
                }
            }
        });
        
        if (AppState.eggsFound.has('clock')) {
            clock.style.color = 'rgba(201, 162, 39, 1)';
            clock.style.borderColor = 'rgba(201, 162, 39, 1)';
            clock.style.background = 'rgba(201, 162, 39, 0.15)';
        }
    }
}

// Track 5: Hidden corner egg
function initTrackFiveSecret() {
    const hiddenEgg = document.querySelector('[data-egg="corner"]');
    if (hiddenEgg) {
        hiddenEgg.addEventListener('click', () => {
            if (collectEgg('corner', hiddenEgg)) {
                hiddenEgg.style.background = 'rgba(201, 162, 39, 0.3)';
                hiddenEgg.style.boxShadow = '0 0 20px rgba(201, 162, 39, 0.5)';
                
                const hint = document.querySelector('.track-five .easter-hint');
                if (hint) {
                    hint.textContent = '💫 You found the quiet corner...';
                    hint.style.color = 'rgba(201, 162, 39, 0.8)';
                }
            }
        });
        
        if (AppState.eggsFound.has('corner')) {
            hiddenEgg.style.background = 'rgba(201, 162, 39, 0.3)';
            hiddenEgg.style.boxShadow = '0 0 20px rgba(201, 162, 39, 0.5)';
        }
    }
}

// Vault treasures (Taylor's Versions references)
function initVaultTreasures() {
    const treasures = document.querySelectorAll('.treasure[data-egg]');
    treasures.forEach(treasure => {
        const eggId = treasure.dataset.egg;
        
        treasure.addEventListener('click', () => {
            if (collectEgg(eggId, treasure)) {
                treasure.classList.add('found');
            }
        });
        
        // Mark if already found
        if (AppState.eggsFound.has(eggId)) {
            treasure.classList.add('found');
        }
    });
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

// Check vault unlock status
export function checkVaultStatus() {
    const remaining = AppState.totalEggs - AppState.eggsFound.size;
    const statusText = document.querySelector('.fragments-needed');
    
    if (statusText) {
        if (remaining === 0) {
            statusText.textContent = 'All fragments collected! ✨';
            statusText.style.color = 'rgba(201, 162, 39, 1)';
        } else if (remaining === 1) {
            statusText.textContent = '1 fragment remaining...';
        } else {
            statusText.textContent = `${remaining} fragments required.`;
        }
    }
    
    if (AppState.eggsFound.size === AppState.totalEggs && !AppState.vaultUnlocked) {
        setTimeout(() => {
            unlockVault();
        }, 800);
    }
}

// Unlock vault with cinematic sequence
function unlockVault() {
    AppState.vaultUnlocked = true;
    saveState();
    
    const vaultLocked = document.getElementById('vaultLocked');
    const vaultUnlocked = document.getElementById('vaultUnlocked');
    
    if (!vaultLocked || !vaultUnlocked) return;
    
    // Fade out locked state
    vaultLocked.style.transition = 'opacity 1.5s ease';
    vaultLocked.style.opacity = '0';
    
    setTimeout(() => {
        vaultLocked.style.display = 'none';
        vaultUnlocked.style.display = 'block';
        
        console.log('%c ✨ THE VAULT HAS OPENED ✨ ', 
            'background: linear-gradient(135deg, rgba(201, 162, 39, 0.3), rgba(255, 182, 255, 0.3)); color: rgba(201, 162, 39, 1); font-size: 14px; padding: 12px 20px; border-radius: 4px; font-weight: bold;');
        
        console.log('%c Long story short... I\'m still here. And I always will be. 💕 ', 
            'color: rgba(255, 182, 255, 0.9); font-style: italic; font-size: 12px;');
    }, 1500);
    
    // Setup final track button
    const playBtn = document.getElementById('playFinalTrack');
    if (playBtn) {
        playBtn.addEventListener('click', revealFinalTrack);
    }
}

// Reveal final track
function revealFinalTrack() {
    const finalTrack = document.getElementById('finalTrack');
    if (finalTrack) {
        finalTrack.style.display = 'flex';
        finalTrack.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        console.log('%c 🎵 Invisible String - Our Song 🎵 ', 
            'background: rgba(11, 29, 58, 0.5); color: rgba(255, 255, 255, 0.9); padding: 8px 16px; border-radius: 3px;');
    }
}