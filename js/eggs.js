// Easter Eggs - Interactive Puzzles
import { AppState, saveState } from './state.js';

export function collectEgg(eggId) {
    if (AppState.eggsFound.has(eggId)) return false;
    
    AppState.eggsFound.add(eggId);
    updateProgress();
    saveState();
    checkVaultStatus();
    return true;
}

export function updateProgress() {
    const count = AppState.eggsFound.size;
    const total = AppState.totalEggs;
    const percentage = (count / total) * 100;
    
    document.getElementById('progressText').textContent = count;
    document.getElementById('progressFill').style.strokeDasharray = `${percentage}, 100`;
}

export function initEasterEggs() {
    initLoverConstellation();
    initFolkloreThread();
    initReputationMorph();
    initMidnightsSky();
    initEmotionalCore();
    initArtifacts();
    updateProgress();
}

// TRACK 1: Lover - Find constellation pattern forming "13"
function initLoverConstellation() {
    const container = document.getElementById('loverConstellation');
    if (!container) return;
    
    const stars = [];
    const totalStars = 19;
    
    // Create 19 stars
    for (let i = 0; i < totalStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.position = 'absolute';
        star.style.width = '4px';
        star.style.height = '4px';
        star.style.background = 'rgba(255, 255, 255, 0.6)';
        star.style.borderRadius = '50%';
        star.style.left = `${Math.random() * 90 + 5}%`;
        star.style.top = `${Math.random() * 85 + 5}%`;
        star.style.boxShadow = '0 0 8px rgba(255, 255, 255, 0.4)';
        star.style.cursor = 'pointer';
        star.style.transition = 'all 0.3s ease';
        
        container.appendChild(star);
        stars.push(star);
    }
    
    // Special stars that form "13" when connected
    const special = [
        { index: 12, left: '35%', top: '30%', id: 'star_1' },
        { index: 13, left: '40%', top: '28%', id: 'star_3' }
    ];
    
    special.forEach(({ index, left, top, id }) => {
        const star = stars[index];
        star.style.left = left;
        star.style.top = top;
        star.dataset.special = id;
        star.style.background = 'rgba(255, 182, 255, 0.7)';
        star.style.boxShadow = '0 0 12px rgba(255, 182, 255, 0.6)';
        star.style.width = '6px';
        star.style.height = '6px';
        
        star.addEventListener('click', () => {
            if (collectEgg(id)) {
                star.style.background = 'rgba(201, 162, 39, 1)';
                star.style.boxShadow = '0 0 20px rgba(201, 162, 39, 0.8)';
            }
        });
        
        if (AppState.eggsFound.has(id)) {
            star.style.background = 'rgba(201, 162, 39, 1)';
            star.style.boxShadow = '0 0 20px rgba(201, 162, 39, 0.8)';
        }
    });
}

// TRACK 2: Folklore - Draw invisible string (thread that crosses)
function initFolkloreThread() {
    const canvas = document.getElementById('threadCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const points = [];
    let drawing = false;
    let knotFound = false;
    
    const handleMove = (e) => {
        if (!drawing) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
        const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
        
        points.push({ x, y });
        if (points.length > 60) points.shift();
        
        if (!knotFound && points.length > 30) {
            if (checkCrossing(points)) {
                knotFound = true;
                collectEgg('thread_knot');
                showKnotEffect(ctx, x, y);
            }
        }
    };
    
    canvas.addEventListener('mousedown', () => drawing = true);
    canvas.addEventListener('mouseup', () => { drawing = false; points.length = 0; });
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('touchstart', () => drawing = true);
    canvas.addEventListener('touchend', () => { drawing = false; points.length = 0; });
    canvas.addEventListener('touchmove', handleMove);
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (points.length > 1) {
            ctx.strokeStyle = 'rgba(255, 182, 255, 0.5)';
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            points.forEach((p, i) => {
                ctx.globalAlpha = i / points.length;
                ctx.lineTo(p.x, p.y);
            });
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
        
        requestAnimationFrame(animate);
    }
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

function checkCrossing(points) {
    if (points.length < 30) return false;
    const recent = points[points.length - 1];
    const middle = points[Math.floor(points.length / 2)];
    return Math.hypot(recent.x - middle.x, recent.y - middle.y) < 35;
}

function showKnotEffect(ctx, x, y) {
    let radius = 10;
    let alpha = 1;
    
    function draw() {
        if (alpha <= 0) return;
        ctx.save();
        ctx.strokeStyle = `rgba(201, 162, 39, ${alpha})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        radius += 2;
        alpha -= 0.04;
        requestAnimationFrame(draw);
    }
    draw();
}

// TRACK 3: Reputation - Hover word, watch metamorphosis
function initReputationMorph() {
    const word = document.querySelector('.interactive-word');
    const container = document.getElementById('metamorphosis');
    const svg = document.getElementById('morphSvg');
    const creature = document.getElementById('creature');
    
    if (!word || !svg) return;
    
    let hoverTime = 0;
    let hoverInterval;
    let wordCollected = false;
    let morphCollected = false;
    
    word.addEventListener('click', () => {
        if (!wordCollected && collectEgg('word_reveal')) {
            wordCollected = true;
            word.style.borderBottom = '2px solid rgba(201, 162, 39, 0.6)';
            word.style.background = 'rgba(201, 162, 39, 0.1)';
        }
    });
    
    word.addEventListener('mouseenter', () => {
        svg.classList.remove('hidden');
        svg.classList.add('visible');
        
        // Draw snake
        creature.innerHTML = `
            <path d="M50,100 Q60,80 70,70 T90,40 Q95,30 100,20" 
                  stroke="currentColor" fill="none" stroke-width="2"/>
            <circle cx="100" cy="18" r="3" fill="currentColor"/>
        `;
        
        hoverInterval = setInterval(() => {
            hoverTime += 100;
            if (hoverTime >= 2000 && !morphCollected) {
                // Morph to flower
                creature.innerHTML = `
                    <circle cx="100" cy="100" r="15" fill="none" stroke="currentColor" stroke-width="1.5"/>
                    <circle cx="100" cy="80" r="8" fill="none" stroke="currentColor" stroke-width="1"/>
                    <circle cx="120" cy="100" r="8" fill="none" stroke="currentColor" stroke-width="1"/>
                    <circle cx="100" cy="120" r="8" fill="none" stroke="currentColor" stroke-width="1"/>
                    <circle cx="80" cy="100" r="8" fill="none" stroke="currentColor" stroke-width="1"/>
                `;
                svg.style.color = 'rgba(255, 182, 193, 0.7)';
                
                if (collectEgg('metamorphosis')) {
                    morphCollected = true;
                }
                clearInterval(hoverInterval);
            }
        }, 100);
    });
    
    word.addEventListener('mouseleave', () => {
        if (!morphCollected) {
            svg.classList.add('hidden');
            svg.classList.remove('visible');
        }
        clearInterval(hoverInterval);
        hoverTime = 0;
    });
    
    if (AppState.eggsFound.has('word_reveal')) {
        wordCollected = true;
        word.style.borderBottom = '2px solid rgba(201, 162, 39, 0.6)';
    }
    
    if (AppState.eggsFound.has('metamorphosis')) {
        morphCollected = true;
        svg.classList.remove('hidden');
        svg.classList.add('visible');
        creature.innerHTML = `
            <circle cx="100" cy="100" r="15" fill="none" stroke="currentColor" stroke-width="1.5"/>
            <circle cx="100" cy="80" r="8" fill="none" stroke="currentColor" stroke-width="1"/>
            <circle cx="120" cy="100" r="8" fill="none" stroke="currentColor" stroke-width="1"/>
            <circle cx="100" cy="120" r="8" fill="none" stroke="currentColor" stroke-width="1"/>
            <circle cx="80" cy="100" r="8" fill="none" stroke="currentColor" stroke-width="1"/>
        `;
        svg.style.color = 'rgba(255, 182, 193, 0.7)';
    }
}

// TRACK 4: Midnights - Find lavender stars and time pattern
function initMidnightsSky() {
    const container = document.getElementById('skyCanvas');
    const timeKeeper = document.getElementById('timeKeeper');
    const display = timeKeeper.querySelector('.time-display');
    
    if (!container) return;
    
    container.style.position = 'absolute';
    container.style.inset = '0';
    
    // Create 19 stars
    for (let i = 0; i < 19; i++) {
        const star = document.createElement('div');
        star.style.position = 'absolute';
        star.style.width = '3px';
        star.style.height = '3px';
        star.style.background = 'rgba(224, 232, 255, 0.6)';
        star.style.borderRadius = '50%';
        star.style.left = `${Math.random() * 90 + 5}%`;
        star.style.top = `${Math.random() * 85 + 5}%`;
        star.style.boxShadow = '0 0 6px rgba(224, 232, 255, 0.4)';
        container.appendChild(star);
    }
    
    // 4 special lavender stars
    const lavenderPositions = [
        { left: '25%', top: '35%', id: 'lavender_1' },
        { left: '35%', top: '45%', id: 'lavender_2' },
        { left: '65%', top: '40%', id: 'lavender_3' },
        { left: '75%', top: '50%', id: 'lavender_4' }
    ];
    
    lavenderPositions.forEach(({ left, top, id }) => {
        const star = document.createElement('div');
        star.style.position = 'absolute';
        star.style.width = '6px';
        star.style.height = '6px';
        star.style.background = 'rgba(201, 162, 39, 0.7)';
        star.style.borderRadius = '50%';
        star.style.left = left;
        star.style.top = top;
        star.style.boxShadow = '0 0 15px rgba(201, 162, 39, 0.6)';
        star.style.cursor = 'pointer';
        star.style.transition = 'all 0.3s ease';
        star.dataset.egg = id;
        
        star.addEventListener('click', () => {
            if (collectEgg(id)) {
                star.style.background = 'rgba(201, 162, 39, 1)';
                star.style.boxShadow = '0 0 25px rgba(201, 162, 39, 0.9)';
            }
        });
        
        if (AppState.eggsFound.has(id)) {
            star.style.background = 'rgba(201, 162, 39, 1)';
            star.style.boxShadow = '0 0 25px rgba(201, 162, 39, 0.9)';
        }
        
        container.appendChild(star);
    });
    
    // Time pattern egg
    let clickCount = 0;
    display.textContent = '11:59';
    
    timeKeeper.addEventListener('click', () => {
        clickCount++;
        
        if (clickCount === 1) display.textContent = '12:00';
        else if (clickCount === 2) display.textContent = '12:19';
        else if (clickCount === 3) {
            display.textContent = '1:19';
            if (collectEgg('time_pattern')) {
                display.style.color = 'rgba(201, 162, 39, 1)';
                display.style.borderColor = 'rgba(201, 162, 39, 0.6)';
            }
        }
    });
    
    if (AppState.eggsFound.has('time_pattern')) {
        display.textContent = '1:19';
        display.style.color = 'rgba(201, 162, 39, 1)';
        display.style.borderColor = 'rgba(201, 162, 39, 0.6)';
    }
}

// TRACK 5: Emotional Core - Click "corner" word + arrange memories
function initEmotionalCore() {
    const highlight = document.querySelector('.subtle-highlight');
    const memoryBox = document.getElementById('memoryBox');
    const items = memoryBox.querySelectorAll('.memory-item');
    
    let wordFound = false;
    let sequence = [];
    
    highlight.addEventListener('click', () => {
        if (!wordFound && collectEgg('corner_word')) {
            wordFound = true;
            highlight.style.color = 'rgba(255, 182, 255, 0.9)';
        }
    });
    
    // Memory sequence puzzle: click 1, 3, 2 in order
    items.forEach(item => {
        item.addEventListener('click', () => {
            const memory = parseInt(item.dataset.memory);
            sequence.push(memory);
            item.classList.add('active');
            
            setTimeout(() => item.classList.remove('active'), 300);
            
            if (sequence.length === 3) {
                if (sequence[0] === 1 && sequence[1] === 3 && sequence[2] === 2) {
                    if (collectEgg('memory_sequence')) {
                        items.forEach(i => {
                            i.style.borderColor = 'rgba(201, 162, 39, 0.6)';
                            i.style.background = 'rgba(201, 162, 39, 0.1)';
                        });
                    }
                }
                sequence = [];
            }
        });
    });
    
    if (AppState.eggsFound.has('corner_word')) {
        wordFound = true;
        highlight.style.color = 'rgba(255, 182, 255, 0.9)';
    }
    
    if (AppState.eggsFound.has('memory_sequence')) {
        items.forEach(i => {
            i.style.borderColor = 'rgba(201, 162, 39, 0.6)';
            i.style.background = 'rgba(201, 162, 39, 0.1)';
        });
    }
}

// TRACK 6: Artifacts - Hover then double-click
function initArtifacts() {
    const artifacts = document.querySelectorAll('.artifact');
    
    artifacts.forEach(artifact => {
        const id = artifact.dataset.artifact;
        let hoverTime = 0;
        let hoverInterval;
        let readyToClick = false;
        
        artifact.addEventListener('mouseenter', () => {
            hoverInterval = setInterval(() => {
                hoverTime += 100;
                if (hoverTime >= 1500) {
                    readyToClick = true;
                    artifact.style.borderColor = 'rgba(255, 182, 255, 0.5)';
                }
            }, 100);
        });
        
        artifact.addEventListener('mouseleave', () => {
            clearInterval(hoverInterval);
            if (!AppState.eggsFound.has(`artifact_${id}`)) {
                hoverTime = 0;
                readyToClick = false;
                artifact.style.borderColor = 'rgba(255, 255, 255, 0.12)';
            }
        });
        
        artifact.addEventListener('dblclick', () => {
            if (readyToClick && collectEgg(`artifact_${id}`)) {
                artifact.classList.add('discovered');
            }
        });
        
        if (AppState.eggsFound.has(`artifact_${id}`)) {
            artifact.classList.add('discovered');
        }
    });
}

export function checkVaultStatus() {
    const remaining = AppState.totalEggs - AppState.eggsFound.size;
    const fragmentsCount = document.getElementById('fragmentsCount');
    
    if (fragmentsCount) {
        if (remaining === 0) {
            fragmentsCount.textContent = 'All fragments discovered.';
            fragmentsCount.style.color = 'rgba(201, 162, 39, 0.9)';
        } else if (remaining === 1) {
            fragmentsCount.textContent = '1 fragment remains.';
        } else {
            fragmentsCount.textContent = `${remaining} fragments await discovery.`;
        }
    }
    
    if (AppState.eggsFound.size === AppState.totalEggs && !AppState.vaultUnlocked) {
        setTimeout(unlockVault, 1000);
    }
}

function unlockVault() {
    AppState.vaultUnlocked = true;
    saveState();
    
    const locked = document.getElementById('collectionLocked');
    const unlocked = document.getElementById('collectionUnlocked');
    
    if (locked && unlocked) {
        locked.style.transition = 'opacity 2s ease';
        locked.style.opacity = '0';
        
        setTimeout(() => {
            locked.style.display = 'none';
            unlocked.style.display = 'block';
            
            document.getElementById('finalReveal').addEventListener('click', () => {
                const final = document.getElementById('finalTrack');
                if (final) {
                    final.style.display = 'flex';
                    final.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }, 2000);
    }
}