const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

// Set canvas size to window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Matrix characters - mix of katakana, numbers, and symbols
const defaultMatrixChars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*()_+-=[]{}|;:,.<>?';
let chars = defaultMatrixChars.split('');

// Font size and columns
const fontSize = 16;
const columns = canvas.width / fontSize;

// Array to store the y position of each column
const drops = [];

// Initialize drops array
for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * -100;
}

// --- Color Palettes ---
const palettes = {
    charm: [
        '#ff6b9d', '#c66ef1', '#7ee3f0', '#a8e6cf',
        '#ffd3b6', '#ffaaa5', '#b4a7d6', '#8fcaca',
    ],
    matrix: [
        '#00ff41', '#00ff00', '#00e100', '#00c100',
        '#00a100', '#008100'
    ],
    cyberpunk: [
        '#ff00ff', '#00ffff', '#ffff00', '#ff0000',
        '#00ff00', '#0000ff'
    ],
    pastel: [
        '#f1c40f', '#e67e22', '#e74c3c', '#ecf0f1',
        '#9b59b6', '#3498db', '#2ecc71', '#1abc9c'
    ]
};

let currentPalette = palettes.charm;

// Track color for each column
const columnColors = [];
for (let i = 0; i < columns; i++) {
    columnColors[i] = currentPalette[Math.floor(Math.random() * currentPalette.length)];
}

// Track animation direction (1 = normal, -1 = reverse)
let animationDirection = 1;

// --- Functions ---

function setPalette(paletteName) {
    if (palettes[paletteName]) {
        currentPalette = palettes[paletteName];
        // Recolor existing columns
        for (let i = 0; i < columns; i++) {
            columnColors[i] = currentPalette[Math.floor(Math.random() * currentPalette.length)];
        }
        // Update active button style
        document.querySelectorAll('#palette-switcher button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-palette="${paletteName}"]`).classList.add('active');
    }
}

// Draw function
function draw() {
    // Add dark background with opacity for fade effect
    ctx.fillStyle = 'rgba(10, 10, 15, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set text style
    ctx.font = fontSize + 'px monospace';
    
    // Draw characters
    for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        
        const opacity = Math.min(1, (drops[i] * fontSize) / (canvas.height * 0.5));
        const color = columnColors[i];
        
        ctx.fillStyle = color + Math.floor(opacity * 255).toString(16).padStart(2, '0');
        ctx.fillText(text, x, y);
        
        if (drops[i] > 0) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = color;
            ctx.fillStyle = '#ffffff';
            ctx.fillText(text, x, y);
            ctx.shadowBlur = 0;
        }
        
        if (Math.random() > 0.995) {
            columnColors[i] = currentPalette[Math.floor(Math.random() * currentPalette.length)];
        }
        
        if (animationDirection === 1) {
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        } else {
            if (drops[i] < -10 && Math.random() > 0.975) {
                drops[i] = canvas.height / fontSize;
            }
            drops[i]--;
        }
    }
}

// --- Event Listeners & Initialization ---

// Animation loop
setInterval(draw, 33);

// Handle click to reverse animation
canvas.addEventListener('click', () => {
    animationDirection *= -1;
});

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const newColumns = canvas.width / fontSize;
    const newDrops = [];
    const newColors = [];
    
    for (let i = 0; i < newColumns; i++) {
        newDrops[i] = drops[i] || Math.random() * -100;
        newColors[i] = columnColors[i] || currentPalette[Math.floor(Math.random() * currentPalette.length)];
    }
    
    drops.length = 0;
    drops.push(...newDrops);
    columnColors.length = 0;
    columnColors.push(...newColors);
});

// Palette switcher buttons
document.querySelectorAll('#palette-switcher button').forEach(button => {
    button.addEventListener('click', (e) => {
        const paletteName = e.target.getAttribute('data-palette');
        setPalette(paletteName);
    });
});

// Set initial active button
document.querySelector('[data-palette="charm"]').classList.add('active');

// --- Character Set Customization ---
const customCharsInput = document.getElementById('custom-chars-input');
const customCharsBtn = document.getElementById('custom-chars-btn');

customCharsBtn.addEventListener('click', () => {
    const newChars = customCharsInput.value;
    if (newChars) {
        chars = newChars.split('');
    } else {
        chars = defaultMatrixChars.split('');
    }
    customCharsInput.value = ''; // Clear input after update
});