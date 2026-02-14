// Easter Egg System - Premium Version
// Intentional, subtle, earned

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
    
    // Update counter
    updateCounter();
    
    // Save state
    saveState();
    
    // Check vault status
    checkVaultStatus();
    
    return true;
}

// Update the egg counter display
export function updateCounter() {
    const counter = document.querySelector('.counter-value');
    if (counter) {
        counter.textContent = AppState.eggsFound.size;
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
}

// Track 1: Lover - 19 stars, 2 are eggs
function initLoverStars() {
    const container = document.getElementById('loverStars');
    if (!container) return;
    
    const stars = [];
    
    // Create 19 stars (April 19 reference)
    for (let i = 0; i < 19; i++) {
        const star = document.createElement('div');
        star.className = 'lover-star';
        
        // Position stars
        star.style.left = `${Math.random() * 90 + 5}%`;
        star.style.top = `${Math.random() * 80 + 10}%`;
        
        container.appendChild(star);
        stars.push(star);
    }
    
    // Stars 12 and 13 form a "13" cluster (Easter eggs)
    const eggStars = [stars[12], stars[13]];
    eggStars[0].dataset.egg = 'star13';
    eggStars[1].dataset.egg = 'starApril';
    
    // Position them to form "13" shape (subtle)
    eggStars[0].style.left = '30%';
    eggStars[0].style.top = '25%';
    eggStars[1].style.left = '32%';
    eggStars[1].style.top = '28%';
    
    // Make them clickable
    eggStars.forEach(star => {
        star.style.cursor = 'pointer';
        star.addEventListener('click', () => {
            const eggId = star.dataset.egg;
            if (collectEgg(eggId, star)) {
                star.classList.add('found');
            }
        });
        
        // Mark if already found
        const eggId = star.dataset.egg;
        if (AppState.eggsFound.has(eggId)) {
            star.classList.add('found');
        }
    });
}

// Track 2: Folklore - Thread canvas with knot interaction
function initThreadCanvas() {
    const canvas = document.getElementById('threadCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const points = [];
    let knotDetected = false;
    
    // Track mouse in this section only
    document.addEventListener('mousemove', (e) => {
        const track = e.target.closest('.track-folklore');
        if (track) {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            points.push({ x, y, time: Date.now() });
            if (points.length > 40) {
                points.shift();
            }
            
            // Detect if thread crosses itself (knot)
            if (!knotDetected && points.length > 20) {
                if (detectKnot(points)) {
                    knotDetected = true;
                    collectEgg('threadKnot');
                    showKnotEffect(x, y);
                }
            }
        }
    });
    
    // Draw thread
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (points.length > 1) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 1.5;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            
            for (let i = 1; i < points.length; i++) {
                const alpha = i / points.length;
                ctx.globalAlpha = alpha * 0.6;
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

// Detect if thread crosses itself (simple intersection check)
function detectKnot(points) {
    if (points.length < 20) return false;
    
    const recent = points[points.length - 1];
    const old = points[Math.floor(points.length / 2)];
    
    const distance = Math.hypot(recent.x - old.x, recent.y - old.y);
    return distance < 30;
}

// Show subtle knot effect
function showKnotEffect(x, y) {
    const canvas = document.getElementById('threadCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let alpha = 1;
    
    function drawKnot() {
        if (alpha <= 0) return;
        
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = 'rgba(255, 182, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.stroke();
        
        alpha -= 0.02;
        requestAnimationFrame(drawKnot);
    }
    
    drawKnot();
}

// Track 3: Reputation - Hover word and snake interaction
function initReputationInteractions() {
    const triggerWord = document.querySelector('[data-egg="projections"]');
    const snakeSvg = document.getElementById('snakeSvg');
    const flowerSvg = document.getElementById('flowerSvg');
    
    if (triggerWord && snakeSvg) {
        // Hover to reveal snake
        triggerWord.addEventListener('mouseenter', () => {
            snakeSvg.style.opacity = '1';
        });
        
        triggerWord.addEventListener('mouseleave', () => {
            if (!AppState.eggsFound.has('projections')) {
                snakeSvg.style.opacity = '0';
            }
        });
        
        // Click snake to collect egg and transform
        snakeSvg.addEventListener('click', () => {
            if (collectEgg('snake', snakeSvg)) {
                setTimeout(() => {
                    snakeSvg.style.display = 'none';
                    flowerSvg.style.display = 'block';
                    flowerSvg.style.opacity = '1';
                }, 300);
            }
        });
        
        // Mark if already found
        if (AppState.eggsFound.has('snake')) {
            snakeSvg.style.display = 'none';
            flowerSvg.style.display = 'block';
            flowerSvg.style.opacity = '1';
        }
    }
}

// Track 4: Midnights - 19 stars, 5 are special (4 eggs + 1 clock)
function initMidnightStars() {
    const container = document.getElementById('midnightStars');
    if (!container) return;
    
    const stars = [];
    
    // Create 19 stars (April 19 reference)
    for (let i = 0; i < 19; i++) {
        const star = document.createElement('div');
        star.className = 'midnight-star';
        
        star.style.left = `${Math.random() * 90 + 5}%`;
        star.style.top = `${Math.random() * 80 + 10}%`;
        
        container.appendChild(star);
        stars.push(star);
    }
    
    // Make 4 stars special (eggs)
    const specialIndices = [3, 7, 11, 15];
    const eggIds = ['midnightStar1', 'midnightStar2', 'midnightStar3', 'midnightStar4'];
    
    specialIndices.forEach((index, i) => {
        const star = stars[index];
        star.classList.add('special');
        star.dataset.egg = eggIds[i];
        
        star.addEventListener('click', () => {
            const eggId = star.dataset.egg;
            if (collectEgg(eggId, star)) {
                star.classList.add('found');
            }
        });
        
        // Mark if already found
        if (AppState.eggsFound.has(eggIds[i])) {
            star.classList.add('found');
        }
    });
    
    // Clock easter egg
    const clock = document.querySelector('[data-egg="clock"]');
    if (clock) {
        clock.addEventListener('click', () => {
            collectEgg('clock', clock);
            clock.style.color = 'rgba(201, 162, 39, 0.9)';
        });
        
        if (AppState.eggsFound.has('clock')) {
            clock.style.color = 'rgba(201, 162, 39, 0.9)';
        }
    }
}

// Track 5: Hidden corner egg
function initTrackFiveSecret() {
    const hiddenEgg = document.querySelector('[data-egg="corner"]');
    if (hiddenEgg) {
        hiddenEgg.addEventListener('click', () => {
            if (collectEgg('corner', hiddenEgg)) {
                hiddenEgg.style.background = 'rgba(255, 255, 255, 0.1)';
            }
        });
        
        if (AppState.eggsFound.has('corner')) {
            hiddenEgg.style.background = 'rgba(255, 255, 255, 0.1)';
        }
    }
}

// Vault treasures
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
function checkVaultStatus() {
    const remaining = AppState.totalEggs - AppState.eggsFound.size;
    const statusText = document.querySelector('.fragments-needed');
    
    if (statusText) {
        if (remaining === 0) {
            statusText.textContent = 'All fragments collected.';
        } else if (remaining === 1) {
            statusText.textContent = '1 fragment remaining.';
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
        
        console.log('%c Vault Unlocked ', 
            'background: rgba(201, 162, 39, 0.3); color: rgba(201, 162, 39, 1); padding: 8px; border-radius: 3px;');
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
    }
}

export { checkVaultStatus };