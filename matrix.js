const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

// Set canvas size to window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Matrix characters - mix of katakana, numbers, and symbols
const matrixChars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*()_+-=[]{}|;:,.<>?';
const chars = matrixChars.split('');

// Font size and columns
const fontSize = 16;
const columns = canvas.width / fontSize;

// Array to store the y position of each column
const drops = [];

// Initialize drops array
for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * -100;
}

// Charm-inspired color palette
const charmColors = [
    '#ff6b9d',  // Soft pink/coral
    '#c66ef1',  // Lavender purple
    '#7ee3f0',  // Soft cyan
    '#a8e6cf',  // Mint green
    '#ffd3b6',  // Peach
    '#ffaaa5',  // Coral
    '#b4a7d6',  // Soft purple
    '#8fcaca',  // Teal
];

// Track color for each column
const columnColors = [];
for (let i = 0; i < columns; i++) {
    columnColors[i] = charmColors[Math.floor(Math.random() * charmColors.length)];
}

// Track animation direction (1 = normal, -1 = reverse)
let animationDirection = 1;

// Draw function
function draw() {
    // Add dark background with opacity for fade effect
    ctx.fillStyle = 'rgba(10, 10, 15, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set text style
    ctx.font = fontSize + 'px monospace';
    
    // Draw characters
    for (let i = 0; i < drops.length; i++) {
        // Pick a random character
        const text = chars[Math.floor(Math.random() * chars.length)];
        
        // Calculate position
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        
        // Create gradient effect based on position
        const opacity = Math.min(1, (drops[i] * fontSize) / (canvas.height * 0.5));
        const color = columnColors[i];
        
        // Apply color with varying opacity
        ctx.fillStyle = color + Math.floor(opacity * 255).toString(16).padStart(2, '0');
        ctx.fillText(text, x, y);
        
        // Add bright glow effect for the leading character
        if (drops[i] > 0) {
            // Leading character with glow
            ctx.shadowBlur = 10;
            ctx.shadowColor = color;
            ctx.fillStyle = '#ffffff';
            ctx.fillText(text, x, y);
            ctx.shadowBlur = 0;
        }
        
        // Randomly change column color occasionally
        if (Math.random() > 0.995) {
            columnColors[i] = charmColors[Math.floor(Math.random() * charmColors.length)];
        }
        
        // Reset drop to top when it reaches bottom
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        
        // Increment y position
        drops[i]++;
    }
}

// Animation loop
setInterval(draw, 33);

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Recalculate columns and drops
    const newColumns = canvas.width / fontSize;
    const newDrops = [];
    const newColors = [];
    
    for (let i = 0; i < newColumns; i++) {
        newDrops[i] = drops[i] || Math.random() * -100;
        newColors[i] = columnColors[i] || charmColors[Math.floor(Math.random() * charmColors.length)];
    }
    
    drops.length = 0;
    drops.push(...newDrops);
    columnColors.length = 0;
    columnColors.push(...newColors);
});