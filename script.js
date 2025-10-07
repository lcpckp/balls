// Matter.js modules
const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Events = Matter.Events;

// =============================================================================
// CENTRALIZED CONFIGURATION - Single Source of Truth
// =============================================================================

// Zone placement configuration
const ZONE_PLACEMENT = {
    minDistance: 75 // Minimum distance between zone centers
};

// Color palette - all colors used throughout the application
const COLORS = {
    // UI Colors
    primary: '#1a1a1a',
    white: '#e0e0e0',
    black: '#000000',
    gray: '#e0e0e0',
    lightGray: '#b0b0b0',
    border: '#404040',
    
    // Tool Colors
    wallTool: '#ffa502',
    wallToolActive: '#ff6b6b',
    multiplierTool: '#9c88ff',
    multiplierToolActive: '#ff6b6b',
    removerTool: '#ff4757',
    removerToolActive: '#ff6b6b',
    portalTool: '#00b894',
    portalToolActive: '#ff6b6b',
    cashTool: '#2ed573',
    cashToolActive: '#ff6b6b',
    levelUpTool: '#ff6b35',
    levelUpToolActive: '#ff6b6b',
    
    
    // Physics Object Colors
    wall: '#a0a0a0',
    ball: '#e0e0e0',
    ballPortal: '#000000',
    testBall: '#ff6b6b', // Red color for test balls
    
    // Zone Colors
    multiplierZone: 'rgba(156, 136, 255, 0.3)',
    multiplierZoneBorder: '#9c88ff',
    portalBlue: 'rgba(0, 123, 255, 0.3)',
    portalBlueBorder: '#007bff',
    portalOrange: 'rgba(255, 165, 0, 0.3)',
    portalOrangeBorder: '#ffa500',
    cashZone: 'rgba(46, 213, 115, 0.3)',
    cashZoneBorder: '#2ed573',
    levelUpZone: 'rgba(255, 107, 53, 0.3)',
    levelUpZoneBorder: '#ff6b35',
    antiGravityZone: 'rgba(255, 0, 255, 0.3)',
    antiGravityZoneBorder: '#ff00ff',
    
    // Hover/Selection Colors
    hover: '#ff4757',
    
    // Button Colors
    buttonSuccess: '#2ed573',
    buttonDanger: '#ff4757',
    buttonPrimary: '#3742fa',
    buttonSecondary: '#ffa502'
};

// Ball level color configuration - cycles through these colors as levels increase
const BALL_LEVEL_COLORS = [
    '#e0e0e0', // Level 1 - Light Gray
    '#ffd700', // Level 2 - Gold
    '#ff6b6b', // Level 3 - Red
    '#4ecdc4', // Level 4 - Teal
    '#45b7d1', // Level 5 - Blue
    '#96ceb4', // Level 6 - Green
    '#feca57', // Level 7 - Yellow
    '#ff9ff3', // Level 8 - Pink
    '#54a0ff', // Level 9 - Light Blue
    '#5f27cd', // Level 10 - Purple
    '#00d2d3', // Level 11 - Cyan
    '#ff9f43', // Level 12 - Orange
    '#a55eea', // Level 13 - Violet
    '#26de81', // Level 14 - Bright Green
    '#fd79a8', // Level 15 - Hot Pink
    '#fdcb6e', // Level 16 - Peach
    '#6c5ce7', // Level 17 - Indigo
    '#a29bfe', // Level 18 - Lavender
    '#fd79a8', // Level 19 - Rose
    '#00b894'  // Level 20 - Emerald
];

// Function to get ball color for a given level (cycles through the color list)
function getBallColorForLevel(level) {
    if (level <= 0) return BALL_LEVEL_COLORS[0];
    // Use modulo to cycle through colors when level exceeds available colors
    const colorIndex = (level - 1) % BALL_LEVEL_COLORS.length;
    return BALL_LEVEL_COLORS[colorIndex];
}

// Canvas and layout configuration
const CANVAS_CONFIG = {
    width: 800,
    height: 800,
    borderWidth: 2,
    borderRadius: 8,
    shadow: '0 4px 8px rgba(0,0,0,0.1)'
};

// Wall configuration
const WALL_CONFIG = {
    thickness: 20,
    color: COLORS.wall,
    previewDash: [8, 4],
    previewLineWidth: 2
};

// Tank walls configuration
const TANK_CONFIG = {
    leftWall: { x: 10, y: 400, width: 20, height: 800 },
    rightWall: { x: 790, y: 400, width: 20, height: 800 },
    topWall: { x: 400, y: 10, width: 800, height: 20 },
    bottomWall: { x: 400, y: 790, width: 800, height: 20 }
};

// Ball spawning configuration
const BALL_SPAWN_CONFIG = {
    margin: 30,
    topMargin: 30,
    bottomMargin: 50,
    fallenBuffer: 50
};

// Zone configuration
const ZONE_CONFIG = {
    multiplier: {
        width: 90,
        height: 20,
        color: COLORS.multiplierZone,
        borderColor: COLORS.multiplierZoneBorder,
        dash: [5, 5],
        lineWidth: 2
    },
    portal: {
        width: 90,
        height: 20,
        colors: {
            blue: COLORS.portalBlue,
            orange: COLORS.portalOrange
        },
        borders: {
            blue: COLORS.portalBlueBorder,
            orange: COLORS.portalOrangeBorder
        },
        dash: [5, 5],
        lineWidth: 2
    },
    cash: {
        width: 90,
        height: 20,
        color: COLORS.cashZone,
        borderColor: COLORS.cashZoneBorder,
        dash: [5, 5],
        lineWidth: 2
    },
    levelUp: {
        width: 90,
        height: 20,
        color: COLORS.levelUpZone,
        borderColor: COLORS.levelUpZoneBorder,
        dash: [5, 5],
        lineWidth: 2
    },
    antiGravity: {
        width: 90,
        height: 200, // 10 times the height of other zones (20 * 10)
        color: COLORS.antiGravityZone,
        borderColor: COLORS.antiGravityZoneBorder,
        dash: [5, 5],
        lineWidth: 2
    }
};

// Tool mode configuration
const TOOL_MODES = {
    wallDrawing: {
        name: 'Wall Drawing Tool',
        activeName: 'Exit Wall Tool',
        color: COLORS.wallTool,
        activeColor: COLORS.wallToolActive,
        cursor: 'crosshair'
    },
    multiplier: {
        name: 'Multiplier Zone Tool',
        activeName: 'Exit Multiplier Tool',
        color: COLORS.multiplierTool,
        activeColor: COLORS.multiplierToolActive,
        cursor: 'none'
    },
    remover: {
        name: 'Remover Tool',
        activeName: 'Exit Remover Tool',
        color: COLORS.removerTool,
        activeColor: COLORS.removerToolActive,
        cursor: 'crosshair'
    },
    portal: {
        name: 'Portal Tool',
        activeName: 'Exit Portal Tool',
        color: COLORS.portalTool,
        activeColor: COLORS.portalToolActive,
        cursor: 'crosshair'
    },
    cash: {
        name: 'Cash Zone Tool',
        activeName: 'Exit Cash Tool',
        color: COLORS.cashTool,
        activeColor: COLORS.cashToolActive,
        cursor: 'crosshair'
    },
    levelUp: {
        name: 'Level Up Zone Tool',
        activeName: 'Exit Level Up Tool',
        color: COLORS.levelUpTool,
        activeColor: COLORS.levelUpToolActive,
        cursor: 'crosshair'
    }
};


// Button styling configuration
const BUTTON_STYLES = {
    primary: 'width: 100%; padding: 10px; color: white; border: none; border-radius: 4px; cursor: pointer;',
    shop: 'padding: 8px 16px; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: bold;',
    shopLarge: 'padding: 10px 20px; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; font-weight: bold;'
};

// Create engine
const engine = Engine.create();
const world = engine.world;

// Add collision event listener for zones
Events.on(engine, 'collisionStart', function(event) {
    const pairs = event.pairs;
    
    for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];
        const bodyA = pair.bodyA;
        const bodyB = pair.bodyB;
        
        // Check if one is a ball and the other is a zone
        let ball = null;
        let zone = null;
        
        if (bodyA.circleRadius && bodyB.isSensor) {
            ball = bodyA;
            zone = bodyB;
        } else if (bodyB.circleRadius && bodyA.isSensor) {
            ball = bodyB;
            zone = bodyA;
        }
        
        if (ball && zone) {
            // Find which zone this body belongs to
            const multiplierZone = multiplierZones.find(r => r.body === zone);
            const portalZone = portalZones.find(r => r.body === zone);
            const cashZone = cashZones.find(r => r.body === zone);
            const levelUpZone = levelUpZones.find(r => r.body === zone);
            const antiGravityZone = antiGravityZones.find(r => r.body === zone);
            const permanentCashZone = permanentBottomCashZone && permanentBottomCashZone.body === zone;
            
            if (multiplierZone) {
                handleMultiplierCollision(ball, multiplierZone);
            } else if (portalZone) {
                handlePortalCollision(ball, portalZone);
            } else if (cashZone) {
                handleCashCollision(ball, cashZone);
            } else if (levelUpZone) {
                handleLevelUpCollision(ball, levelUpZone);
            } else if (antiGravityZone) {
                handleAntiGravityCollision(ball, antiGravityZone);
            } else if (permanentCashZone) {
                handleCashCollision(ball, permanentBottomCashZone);
            }
        }
    }
});

// Add collision end event listener for anti-gravity zones
Events.on(engine, 'collisionEnd', function(event) {
    const pairs = event.pairs;
    
    for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];
        const bodyA = pair.bodyA;
        const bodyB = pair.bodyB;
        
        // Check if one is a ball and the other is an anti-gravity zone
        let ball = null;
        let zone = null;
        
        if (bodyA.circleRadius && bodyB.isSensor) {
            ball = bodyA;
            zone = bodyB;
        } else if (bodyB.circleRadius && bodyA.isSensor) {
            ball = bodyB;
            zone = bodyA;
        }
        
        if (ball && zone) {
            // Check if this is an anti-gravity zone
            const antiGravityZone = antiGravityZones.find(r => r.body === zone);
            
            if (antiGravityZone && ball.inAntiGravityZone === antiGravityZone.id) {
                // Ball has left the anti-gravity zone
                ball.inAntiGravityZone = null;
            }
        }
    }
});

// Get canvas and context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Disable right-click context menu on canvas
canvas.addEventListener('contextmenu', function(event) {
    event.preventDefault();
    return false;
});

// Physics settings (will be controlled by sliders)
let physicsSettings = {
    gravity: 0.2,
    airResistance: 0, // Fixed at 0 - no air resistance
    circleSize: 5,
    bounciness: 0.6, // Natural bouncing with moderate energy retention
    friction: 0,
    density: 0.001,
    spawnDelay: 250,
    multiplierZoneWidth: 60, // Fixed width for multiplier zones
    multiplierZoneHeight: 20, // Fixed height for multiplier zones
    ballLevel: 1 // Default ball level
};

// Ball inventory system removed - balls are spawned directly via canvas clicks

// Wallet system
let wallet = {
    money: 0,    // Starting money amount
    diamonds: 0, // Starting diamonds amount
    keys: 0      // Starting keys amount
};

// Reset wallet money if it's NaN (fix for existing NaN values)
if (isNaN(wallet.money)) {
    wallet.money = 0;
}


// Number formatting function for short notation
function numberFormatShort(num) {
    if (num >= 1000) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'm';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
    }
    return num.toString();
}

// Drop button state
let isDropped = true; // Track if tank bottom is dropped (starts as dropped/off by default)

// Turn system state
let currentTurn = 1;
let isDropButtonEnabled = true;
let lastTurnEarnings = 0; // Track earnings from the last turn
let turnStartMoney = 0; // Track money at the start of a turn

// Ball upgrade system state
let currentBallLevel = 1; // Current level of balls dropped by drop button
let currentBallCount = 10; // Current number of balls dropped by drop button

// Ball spawn position for current turn
let currentSpawnX = null; // X position where balls will spawn this turn

// Test ball system
let testBallCount = 0;
let testMoneyEarned = 0; // Track money that would be earned during test
let testBallMaxLevel = 1; // Track highest level achieved by test balls
let hadTestBallsInPreviousState = false;
let testBallTimeouts = []; // Track timeout IDs for test ball drops

// First test ball path tracking
let firstTestBall = null; // Reference to the first test ball
let firstTestBallPath = []; // Array to store path positions {x, y}
let skipPathRecording = false; // Flag to skip path recording during portal teleportation

// Stuck ball detection state
let lastBallDeletionTime = 0;
let stuckThreshold = 5000; // 5 seconds in milliseconds (kept for fallback)
let velocityThreshold = 0.5; // Minimum total velocity to consider balls as moving
let velocityDebounceTime = 1000; // 1 second debounce for velocity-based stuck detection
let lastVelocityCheckTime = 0;
let isStuck = false;

// Test button state
let isEndingTest = false; // Flag to prevent turn increment when ending test

// Simulation state
let isPaused = false;
let objectCount = 0;
let fps = 60;
let lastTime = 0;
let frameCount = 0;

// Wall drawing state
let wallDrawingMode = false;
let isDrawingWall = false;
let wallStartX = 0;
let wallStartY = 0;
let wallEndX = 0;
let wallEndY = 0;

// Multiplier zone state
let multiplierPlacementMode = false;
let multiplierFactor = 2;
let multiplierZones = []; // Array to store multiplier zones

// Remover tool state
let removerMode = false;

// Portal tool state
let portalMode = false;
let portalZones = []; // Array to store portal zones

// Cash tool state
let cashMode = false;
let cashZones = []; // Array to store cash zones

// Level up tool state
let levelUpMode = false;
let levelUpZones = []; // Array to store level up zones

// Anti-gravity tool state
let antiGravityMode = false;
let antiGravityZones = []; // Array to store anti-gravity zones

// Money animation system
class MoneyAnimation {
    constructor(x, y, amount) {
        this.x = x;
        this.y = y;
        this.amount = amount;
        this.life = 1.0; // Start at full life
        this.velocity = -2; // Move upward
        this.alpha = 1.0;
        this.scale = 1.0;
    }
    
    update() {
        // Move upward
        this.y += this.velocity;
        
        // Fade out over time
        this.life -= 0.02;
        this.alpha = Math.max(0, this.life);
        
        // Slight scale animation
        this.scale = 0.8 + (1.0 - this.life) * 0.4;
        
        // Return true if still alive
        return this.life > 0;
    }
    
    draw(ctx) {
        if (this.alpha <= 0) return;
        
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.translate(this.x, this.y);
        ctx.scale(this.scale, this.scale);
        
        // Draw the money text with a nice style
        ctx.font = 'bold 18px Arial';
        ctx.fillStyle = '#2ed573'; // Green color to match cash zones
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 2;
        
        const text = '+$';
        const textMetrics = ctx.measureText(text);
        const textWidth = textMetrics.width;
        
        // Draw text with outline
        ctx.strokeText(text, -textWidth/2, 0);
        ctx.fillText(text, -textWidth/2, 0);
        
        // Add a subtle glow effect
        ctx.shadowColor = '#2ed573';
        ctx.shadowBlur = 8;
        ctx.fillText(text, -textWidth/2, 0);
        
        ctx.restore();
    }
}

let moneyAnimations = []; // Array to store active money animations

// Item dropping animation system
class DroppingAnimation {
    constructor(itemType, startX, startY, endX, endY, itemData) {
        this.itemType = itemType;
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.itemData = itemData;
        this.progress = 0;
        this.duration = 1000; // 1 second animation
        this.startTime = Date.now();
        this.scale = 1.5; // Start scaled up
        this.opacity = 0; // Start with 0 opacity
        this.body = null; // Will be set when animation completes
        
        // Get final opacity for this item type
        this.finalOpacity = this.getFinalOpacity();
    }
    
    getFinalOpacity() {
        // Return the final opacity that this item type should have
        switch (this.itemType) {
            case 'cash':
                return 0.3; // rgba(46, 213, 115, 0.3)
            case 'multiplier':
                return 0.3; // rgba(156, 136, 255, 0.3) - assuming similar to cash
            case 'levelUp':
                return 0.3; // rgba(255, 107, 53, 0.3) - assuming similar to cash
            case 'antiGravity':
                return 0.3; // rgba(255, 0, 255, 0.3) - antigravity zone opacity
            case 'wallSquare':
            case 'wallCircle':
            case 'wallTriangle':
            case 'wallHexagon':
                return 1.0; // Walls are fully opaque
            default:
                return 1.0; // Default to fully opaque
        }
    }
    
    update() {
        const elapsed = Date.now() - this.startTime;
        this.progress = Math.min(elapsed / this.duration, 1);
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - this.progress, 3);
        
        // Update scale (from 1.5 to 1.0)
        this.scale = 1.5 - (0.5 * easeOutCubic);
        
        // Update opacity (from 0 to final opacity)
        this.opacity = this.finalOpacity * easeOutCubic;
        
        // Update position (from start to end)
        this.currentX = this.startX + (this.endX - this.startX) * easeOutCubic;
        this.currentY = this.startY + (this.endY - this.startY) * easeOutCubic;
        
        return this.progress >= 1;
    }
    
    draw(ctx) {
        if (this.progress >= 1) return;
        
        ctx.save();
        ctx.globalAlpha = this.opacity;
        
        // Draw the item at current position with current scale
        this.drawItem(ctx, this.currentX, this.currentY, this.scale);
        
        ctx.restore();
    }
    
    drawItem(ctx, x, y, scale) {
        // Draw different items based on type
        switch (this.itemType) {
            case 'wallSquare':
                this.drawSquareWall(ctx, x, y, scale);
                break;
            case 'wallCircle':
                this.drawCircleWall(ctx, x, y, scale);
                break;
            case 'wallTriangle':
                this.drawTriangleWall(ctx, x, y, scale);
                break;
            case 'wallHexagon':
                this.drawHexagonWall(ctx, x, y, scale);
                break;
            case 'cash':
                this.drawCashZone(ctx, x, y, scale);
                break;
            case 'multiplier':
                this.drawMultiplierZone(ctx, x, y, scale);
                break;
            case 'levelUp':
                this.drawLevelUpZone(ctx, x, y, scale);
                break;
            case 'antiGravity':
                this.drawAntiGravityZone(ctx, x, y, scale);
                break;
        }
    }
    
    drawSquareWall(ctx, x, y, scale) {
        const size = 80 * scale;
        ctx.fillStyle = WALL_CONFIG.color;
        ctx.fillRect(x - size/2, y - size/2, size, size);
    }
    
    drawCircleWall(ctx, x, y, scale) {
        const radius = 50 * scale;
        ctx.fillStyle = WALL_CONFIG.color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    drawTriangleWall(ctx, x, y, scale) {
        const size = 120 * scale;
        const halfSize = size / 2;
        ctx.fillStyle = WALL_CONFIG.color;
        ctx.beginPath();
        ctx.moveTo(x, y - halfSize);
        ctx.lineTo(x - halfSize * Math.cos(Math.PI / 6), y + halfSize * Math.sin(Math.PI / 6));
        ctx.lineTo(x + halfSize * Math.cos(Math.PI / 6), y + halfSize * Math.sin(Math.PI / 6));
        ctx.closePath();
        ctx.fill();
    }
    
    drawHexagonWall(ctx, x, y, scale) {
        const radius = 50 * scale;
        ctx.fillStyle = WALL_CONFIG.color;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = i * Math.PI / 3;
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
    }
    
    drawCashZone(ctx, x, y, scale) {
        const width = 90 * scale;
        const height = 20 * scale;
        
        // Use the exact same color as the final cash zone
        ctx.fillStyle = 'rgba(46, 213, 115, 0.3)';
        ctx.fillRect(x - width/2, y - height/2, width, height);
        
        // Draw border
        ctx.strokeStyle = '#2ed573';
        ctx.lineWidth = 2 * scale;
        ctx.setLineDash([5 * scale, 5 * scale]);
        ctx.strokeRect(x - width/2, y - height/2, width, height);
        ctx.setLineDash([]);
        
        // Draw money symbol
        ctx.fillStyle = '#ffffff';
        ctx.font = `${12 * scale}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('💵', x, y);
    }
    
    drawMultiplierZone(ctx, x, y, scale) {
        const width = 90 * scale;
        const height = 20 * scale;
        
        // Use the exact same color as the final multiplier zone
        ctx.fillStyle = 'rgba(156, 136, 255, 0.3)';
        ctx.fillRect(x - width/2, y - height/2, width, height);
        
        // Draw border
        ctx.strokeStyle = '#9c88ff';
        ctx.lineWidth = 2 * scale;
        ctx.setLineDash([5 * scale, 5 * scale]);
        ctx.strokeRect(x - width/2, y - height/2, width, height);
        ctx.setLineDash([]);
        
        // Draw multiplier symbol
        ctx.fillStyle = '#ffffff';
        ctx.font = `${12 * scale}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⚡', x, y);
    }
    
    drawLevelUpZone(ctx, x, y, scale) {
        const width = 90 * scale;
        const height = 20 * scale;
        
        // Use the exact same color as the final level up zone
        ctx.fillStyle = 'rgba(255, 107, 53, 0.3)';
        ctx.fillRect(x - width/2, y - height/2, width, height);
        
        // Draw border
        ctx.strokeStyle = '#ff6b35';
        ctx.lineWidth = 2 * scale;
        ctx.setLineDash([5 * scale, 5 * scale]);
        ctx.strokeRect(x - width/2, y - height/2, width, height);
        ctx.setLineDash([]);
        
        // Draw level up symbol
        ctx.fillStyle = '#ffffff';
        ctx.font = `${12 * scale}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('➕', x, y);
    }
    
    drawAntiGravityZone(ctx, x, y, scale) {
        const width = 90 * scale;
        const height = 20 * scale;
        
        // Use the exact same color as the final antigravity zone
        ctx.fillStyle = 'rgba(255, 0, 255, 0.3)';
        ctx.fillRect(x - width/2, y - height/2, width, height);
        
        // Draw border
        ctx.strokeStyle = '#ff00ff';
        ctx.lineWidth = 2 * scale;
        ctx.setLineDash([5 * scale, 5 * scale]);
        ctx.strokeRect(x - width/2, y - height/2, width, height);
        ctx.setLineDash([]);
        
        // Draw antigravity symbol
        ctx.fillStyle = '#ffffff';
        ctx.font = `${12 * scale}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('↑↓', x, y);
    }
}

let droppingAnimations = []; // Array to store active dropping animations

// Function to create the actual item when animation completes
function createActualItem(animation) {
    const { itemType, endX, endY, itemData } = animation;
    
    if (itemType.includes('wall')) {
        // Create wall
        let wall;
        switch (itemType) {
            case 'wallSquare':
                wall = createSquareWall(endX, endY, 80, itemData.rotation);
                break;
            case 'wallCircle':
                wall = createCircleWall(endX, endY, 50);
                break;
            case 'wallTriangle':
                wall = createTriangleWall(endX, endY, 120, itemData.rotation);
                break;
            case 'wallHexagon':
                wall = createHexagonWall(endX, endY, 100, itemData.rotation);
                break;
        }
        
        if (wall) {
            World.add(world, wall);
            console.log(`Created actual ${itemType} at (${endX.toFixed(1)}, ${endY.toFixed(1)})`);
        }
    } else {
        // Create zone
        switch (itemType) {
            case 'cash':
                createCashZone(endX, endY, itemData.rotation);
                break;
            case 'multiplier':
                createMultiplierZone(endX, endY, 2, itemData.rotation);
                break;
            case 'levelUp':
                createLevelUpZone(endX, endY, itemData.rotation);
                break;
            case 'antiGravity':
                // Anti-gravity zones always use 0 rotation (locked)
                createAntiGravityZone(endX, endY, 0);
                break;
        }
        
        console.log(`Created actual ${itemType} at (${endX.toFixed(1)}, ${endY.toFixed(1)})`);
    }
}

// Item system state
let items = {
    wallSquare: { available: true, used: false },
    wallCircle: { available: true, used: false },
    wallTriangle: { available: true, used: false },
    wallHexagon: { available: true, used: false },
    cash: { available: true, used: false },
    multiplier: { available: true, used: false },
    levelUp: { available: true, used: false },
    antiGravity: { available: true, used: false },
    ballLevel: { available: true, used: false },
    ballCount: { available: true, used: false },
    // New dragging permission items
    moveMultiplierZone: { available: true, used: false },
    moveLevelUpZone: { available: true, used: false },
    moveCashZone: { available: true, used: false },
    movePortalIn: { available: true, used: false },
    movePortalOut: { available: true, used: false },
    // Resize permission items
    resizeAntiGravity: { available: true, used: false }
};
let currentItemMode = null; // 'wallSquare', 'wallCircle', 'wallTriangle', 'wallHexagon', 'cash', 'multiplier', 'levelUp', or null

// Modal system state
let isModalOpen = false;
let isPlacingItem = false; // True when user is in placement mode for walls/zones
let isShopHidden = false; // True when shop is hidden (transparent/blurred)

// Wall item preview state
let wallItemPreviewX = 0;
let wallItemPreviewY = 0;
let wallItemRotation = Math.PI / 4; // Default to 45 degrees
let zoneItemRotation = 0; // Default to 0 degrees for zone items

// Wall dragging state
let isDraggingWall = false;
let draggedWall = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

// Anti-gravity zone dragging state
let isDraggingAntiGravityZone = false;
let draggedAntiGravityZone = null;
let antiGravityZoneDragOffsetX = 0;
let antiGravityZoneDragOffsetY = 0;
let antiGravityZoneLastValidPosition = { x: 0, y: 0 };

// Anti-gravity zone resizing state
let isResizingAntiGravityZone = false;
let resizedAntiGravityZone = null;
let resizeEdge = null; // 'top', 'bottom', 'left', 'right'
let resizeStartX = 0;
let resizeStartY = 0;
let resizeStartWidth = 0;
let resizeStartHeight = 0;
let resizeStartCenterX = 0;
let resizeStartCenterY = 0;

// Multiplier zone dragging state
let isDraggingMultiplierZone = false;
let draggedMultiplierZone = null;
let multiplierZoneDragOffsetX = 0;
let multiplierZoneDragOffsetY = 0;
let multiplierZoneLastValidPosition = { x: 0, y: 0 };

// Portal zone dragging state
let isDraggingPortalZone = false;
let draggedPortalZone = null;
let portalZoneDragOffsetX = 0;
let portalZoneDragOffsetY = 0;
let portalZoneLastValidPosition = { x: 0, y: 0 };

// Cash zone dragging state
let isDraggingCashZone = false;
let draggedCashZone = null;
let cashZoneDragOffsetX = 0;
let cashZoneDragOffsetY = 0;
let cashZoneLastValidPosition = { x: 0, y: 0 };

// Level up zone dragging state
let isDraggingLevelUpZone = false;
let draggedLevelUpZone = null;
let levelUpZoneDragOffsetX = 0;
let levelUpZoneDragOffsetY = 0;
let levelUpZoneLastValidPosition = { x: 0, y: 0 };

// Dragging permissions (default to false - must be purchased)
let draggingPermissions = {
    multiplierZone: false,
    levelUpZone: false,
    cashZone: false,
    antiGravityZone: false,
    portalIn: false,
    portalOut: false
};

// Resize permissions (default to false - must be purchased)
let resizingPermissions = {
    antiGravityZone: false
};


// Permanent bottom cash zone
let permanentBottomCashZone = null;



// Function to exit all tool modes (but not item modes)
function exitAllToolModes() {
    // Reset all tool mode flags
    wallDrawingMode = false;
    multiplierPlacementMode = false;
    removerMode = false;
    portalMode = false;
    cashMode = false;
    levelUpMode = false;
    antiGravityMode = false;
    
    // Reset tool button text and colors
    wallToolButton.textContent = 'Wall Drawing Tool';
    wallToolButton.style.background = '#ffa502';
    multiplierToolButton.textContent = 'Multiplier Zone Tool';
    multiplierToolButton.style.background = '#9c88ff';
    removerToolButton.textContent = 'Remover Tool';
    removerToolButton.style.background = '#ff4757';
    portalToolButton.textContent = 'Portal Tool';
    portalToolButton.style.background = '#00b894';
    cashToolButton.textContent = 'Cash Zone Tool';
    cashToolButton.style.background = '#2ed573';
    levelUpToolButton.textContent = 'Level Up Zone Tool';
    levelUpToolButton.style.background = '#ff6b35';
    antiGravityToolButton.textContent = 'Anti-Gravity Zone Tool';
    antiGravityToolButton.style.background = '#ff00ff';
    
    // Hide multiplier factor display
    multiplierFactorDisplay.style.display = 'none';
}

// Function to exit all modes and reset UI
function exitAllModes() {
    // Exit all tool modes
    exitAllToolModes();
    
    // Reset item mode
    currentItemMode = null;
    
    // Reset item button states
    updateItemButtonStates();
    
    // Reset cursor to crosshair
    canvas.style.cursor = 'crosshair';
}



// Mouse position tracking for cursor preview
let mouseX = 0;
let mouseY = 0;
let isMouseOnCanvas = false;

// Hover tracking for remover tool
let hoveredWall = null;
let hoveredMultiplierZone = null;
let hoveredPortalZone = null;
let hoveredCashZone = null;
let hoveredLevelUpZone = null;
let hoveredAntiGravityZone = null;

// Get DOM elements
const gravitySlider = document.getElementById('gravitySlider');
const gravityValue = document.getElementById('gravityValue');
const sizeSlider = document.getElementById('sizeSlider');
const sizeValue = document.getElementById('sizeValue');
const bounceSlider = document.getElementById('bounceSlider');
const bounceValue = document.getElementById('bounceValue');
const frictionSlider = document.getElementById('frictionSlider');
const frictionValue = document.getElementById('frictionValue');
const densitySlider = document.getElementById('densitySlider');
const densityValue = document.getElementById('densityValue');
// ballInventoryValue removed - no longer needed
const moneyValue = document.getElementById('moneyValue');
const diamondsValue = document.getElementById('diamondsValue');
const keysValue = document.getElementById('keysValue');
const spawnDelaySlider = document.getElementById('spawnDelaySlider');
const spawnDelayValue = document.getElementById('spawnDelayValue');
const objectCountElement = document.getElementById('objectCount');
const fpsCounter = document.getElementById('fpsCounter');
const clearButton = document.getElementById('clearButton');
const pauseButton = document.getElementById('pauseButton');
const wallToolButton = document.getElementById('wallToolButton');
const multiplierToolButton = document.getElementById('multiplierToolButton');
const multiplierSlider = document.getElementById('multiplierSlider');
const multiplierValue = document.getElementById('multiplierValue');
const multiplierFactorDisplay = document.getElementById('multiplierFactorDisplay');
const wallControls = document.getElementById('wallControls');
const removerToolButton = document.getElementById('removerToolButton');

// Modal elements
const itemModal = document.getElementById('itemModal');
const itemModalBackdrop = document.getElementById('itemModalBackdrop');
const hideShopButton = document.getElementById('hideShopButton');
const shopHiddenMessage = document.getElementById('shopHiddenMessage');
const portalToolButton = document.getElementById('portalToolButton');
const cashToolButton = document.getElementById('cashToolButton');
const levelUpToolButton = document.getElementById('levelUpToolButton');
const antiGravityToolButton = document.getElementById('antiGravityToolButton');
const dropButton = document.getElementById('dropButton');
const drop10Button = document.getElementById('drop10Button');
const dropTestButton = document.getElementById('dropTestButton');
const turnValue = document.getElementById('turnValue');
const testBallCountElement = document.getElementById('testBallCount');
const ballLevelInput = document.getElementById('ballLevelInput');
const ballLevelValue = document.getElementById('ballLevelValue');
const currentBallLevelValue = document.getElementById('currentBallLevelValue');

// Create tank walls using centralized configuration
const leftWall = Bodies.rectangle(
    TANK_CONFIG.leftWall.x, 
    TANK_CONFIG.leftWall.y, 
    TANK_CONFIG.leftWall.width, 
    TANK_CONFIG.leftWall.height, 
    { 
        isStatic: true,
        render: { fillStyle: TANK_CONFIG.leftWall.color || WALL_CONFIG.color }
    }
);

const rightWall = Bodies.rectangle(
    TANK_CONFIG.rightWall.x, 
    TANK_CONFIG.rightWall.y, 
    TANK_CONFIG.rightWall.width, 
    TANK_CONFIG.rightWall.height, 
    { 
        isStatic: true,
        render: { fillStyle: TANK_CONFIG.rightWall.color || WALL_CONFIG.color }
    }
);

const tankTopWall = Bodies.rectangle(
    TANK_CONFIG.topWall.x, 
    TANK_CONFIG.topWall.y, 
    TANK_CONFIG.topWall.width, 
    TANK_CONFIG.topWall.height, 
    { 
        isStatic: true,
        render: { fillStyle: TANK_CONFIG.topWall.color || WALL_CONFIG.color }
    }
);

const tankWall = Bodies.rectangle(
    TANK_CONFIG.bottomWall.x, 
    TANK_CONFIG.bottomWall.y, 
    TANK_CONFIG.bottomWall.width, 
    TANK_CONFIG.bottomWall.height, 
    { 
        isStatic: true,
        render: { fillStyle: TANK_CONFIG.bottomWall.color || WALL_CONFIG.color }
    }
);

// Add walls to world (tank floor is off by default)
World.add(world, [leftWall, rightWall, tankTopWall]);

// Function to create a circle at position
function createCircle(x, y, isTestBall = false, level = 1, radius = null) {
    // Determine ball color based on level
    let ballColor;
    if (isTestBall) {
        ballColor = COLORS.testBall;
    } else {
        ballColor = getBallColorForLevel(level);
    }
    
    // Use provided radius or default to physicsSettings.circleSize
    const ballRadius = radius !== null ? radius : physicsSettings.circleSize;
    
    const circle = Bodies.circle(x, y, ballRadius, {
        restitution: physicsSettings.bounciness,
        friction: physicsSettings.friction,
        density: physicsSettings.density,
        frictionAir: 0, // No air resistance
        angularDamping: 0, // No angular damping for natural spinning
        linearDamping: 0, // No linear damping for natural bouncing
        render: {
            fillStyle: ballColor
        }
    });
    
    // Add portal status tracking
    circle.hasUsedPortal = false;
    
    // Mark as test ball if specified
    circle.isTestBall = isTestBall;
    
    // Add level property
    circle.level = level;
    
    World.add(world, circle);
    objectCount++;
    objectCountElement.textContent = objectCount;
    
    // Update drop button state when a ball is created
    updateDropButtonState();
    updateDropTestButtonState();
    
    return circle;
}

// Function to drop a specified number of balls from the pre-calculated spawn position
function dropBalls(count) {
    const ballRadius = physicsSettings.circleSize;
    const topMargin = BALL_SPAWN_CONFIG.topMargin;
    const spawnY = topMargin + ballRadius;
    
    // Use the pre-calculated spawn position for this turn
    if (currentSpawnX === null) {
        console.warn('Spawn position not calculated, falling back to random position');
        const canvasWidth = CANVAS_CONFIG.width;
        const sideMargin = BALL_SPAWN_CONFIG.margin;
        const spawnStartX = sideMargin + ballRadius;
        const spawnEndX = canvasWidth - sideMargin - ballRadius;
        currentSpawnX = spawnStartX + Math.random() * (spawnEndX - spawnStartX);
    }
    
    // Clear first test ball tracking when doing a real drop
    firstTestBall = null;
    firstTestBallPath = [];
    skipPathRecording = false;
    
    // Drop balls from the pre-calculated position with spawn delay
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            createCircle(currentSpawnX, spawnY, false, currentBallLevel);
        }, i * physicsSettings.spawnDelay);
    }
}

// Function to drop balls using current ball count (convenience function)
function drop10Balls() {
    dropBalls(currentBallCount);
}

// Function to drop test balls using current ball count
function dropTestBalls() {
    const ballRadius = physicsSettings.circleSize;
    const topMargin = BALL_SPAWN_CONFIG.topMargin;
    const spawnY = topMargin + ballRadius;
    
    // Use the pre-calculated spawn position for this turn
    if (currentSpawnX === null) {
        console.warn('Spawn position not calculated, falling back to random position');
        const canvasWidth = CANVAS_CONFIG.width;
        const sideMargin = BALL_SPAWN_CONFIG.margin;
        const spawnStartX = sideMargin + ballRadius;
        const spawnEndX = canvasWidth - sideMargin - ballRadius;
        currentSpawnX = spawnStartX + Math.random() * (spawnEndX - spawnStartX);
    }
    
    // Reset test ball counter and money
    testBallCount = currentBallCount;
    testMoneyEarned = 0;
    testBallMaxLevel = 1;
    updateTestBallDisplay();
    
    // Clear any existing test ball timeouts
    testBallTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    testBallTimeouts = [];
    
    // Reset first test ball tracking
    firstTestBall = null;
    firstTestBallPath = [];
    skipPathRecording = false;
    
    // Drop test balls from the pre-calculated position with spawn delay
    for (let i = 0; i < currentBallCount; i++) {
        const timeoutId = setTimeout(() => {
            const ball = createCircle(currentSpawnX, spawnY, true, 1); // Test balls are always level 1
            // Mark the first test ball
            if (i === 0) {
                firstTestBall = ball;
                ball.isFirstTestBall = true;
            }
        }, i * physicsSettings.spawnDelay);
        testBallTimeouts.push(timeoutId);
    }
    
    // Update drop test button state
    updateDropTestButtonState();
}


// Function to create a wall from start to end coordinates
function createWall(startX, startY, endX, endY) {
    const length = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
    const wallThickness = WALL_CONFIG.thickness;
    
    // Calculate the angle to determine orientation
    const angle = Math.atan2(endY - startY, endX - startX);
    const absAngle = Math.abs(angle);
    
    let vertices;
    
    // If more horizontal than vertical (angle closer to 0 or π)
    if (absAngle < Math.PI / 4 || absAngle > 3 * Math.PI / 4) {
        // Vertical sides (left and right edges are vertical)
        vertices = [
            { x: startX, y: startY - wallThickness/2 },
            { x: endX, y: endY - wallThickness/2 },
            { x: endX, y: endY + wallThickness/2 },
            { x: startX, y: startY + wallThickness/2 }
        ];
    } else {
        // Horizontal sides (top and bottom edges are horizontal)
        vertices = [
            { x: startX - wallThickness/2, y: startY },
            { x: startX + wallThickness/2, y: startY },
            { x: endX + wallThickness/2, y: endY },
            { x: endX - wallThickness/2, y: endY }
        ];
    }
    
    const wall = Bodies.fromVertices(
        (startX + endX) / 2, 
        (startY + endY) / 2, 
        [vertices], 
        {
            isStatic: true,
            render: { fillStyle: WALL_CONFIG.color }
        }
    );
    
    World.add(world, wall);
    objectCount++;
    objectCountElement.textContent = objectCount;
    
    return wall;
}

// Function to draw a rotated rectangle
function drawRotatedRect(ctx, centerX, centerY, width, height, rotation, fillStyle, strokeStyle, lineWidth, dash) {
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);
    
    ctx.beginPath();
    ctx.rect(-width / 2, -height / 2, width, height);
    
    if (fillStyle) {
        ctx.fillStyle = fillStyle;
        ctx.fill();
    }
    
    if (strokeStyle) {
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth || 1;
        if (dash) {
            ctx.setLineDash(dash);
        }
        ctx.stroke();
        ctx.setLineDash([]); // Reset line dash
    }
    
    ctx.restore();
}

// Function to create a fixed-size wall with rotation
function createFixedWall(centerX, centerY, length, rotation) {
    const wallThickness = WALL_CONFIG.thickness;
    const halfLength = length / 2;
    
    // Calculate the end points based on rotation
    const endX = centerX + Math.cos(rotation) * halfLength;
    const endY = centerY + Math.sin(rotation) * halfLength;
    const startX = centerX - Math.cos(rotation) * halfLength;
    const startY = centerY - Math.sin(rotation) * halfLength;
    
    // Calculate perpendicular offset for wall thickness
    const perpX = -Math.sin(rotation) * wallThickness / 2;
    const perpY = Math.cos(rotation) * wallThickness / 2;
    
    // Create vertices for the wall
    const vertices = [
        { x: startX + perpX, y: startY + perpY },
        { x: endX + perpX, y: endY + perpY },
        { x: endX - perpX, y: endY - perpY },
        { x: startX - perpX, y: startY - perpY }
    ];
    
    const wall = Bodies.fromVertices(
        centerX, 
        centerY, 
        [vertices], 
        {
            isStatic: true,
            render: { fillStyle: WALL_CONFIG.color }
        }
    );
    
    World.add(world, wall);
    objectCount++;
    objectCountElement.textContent = objectCount;
    
    return wall;
}

// Function to create a square wall
function createSquareWall(centerX, centerY, size, rotation) {
    const wall = Bodies.rectangle(
        centerX, 
        centerY, 
        size, 
        size, 
        {
            isStatic: true,
            angle: rotation,
            render: { fillStyle: WALL_CONFIG.color }
        }
    );
    
    // Mark as a wall object to prevent ball detection
    wall.isWall = true;
    
    World.add(world, wall);
    objectCount++;
    objectCountElement.textContent = objectCount;
    
    return wall;
}

// Function to create a circular wall
function createCircleWall(centerX, centerY, radius) {
    const wall = Bodies.circle(
        centerX, 
        centerY, 
        radius, 
        {
            isStatic: true,
            render: { fillStyle: WALL_CONFIG.color }
        }
    );
    
    // Mark as a wall object to prevent ball detection
    wall.isWall = true;
    
    World.add(world, wall);
    objectCount++;
    objectCountElement.textContent = objectCount;
    
    return wall;
}

// Function to create a triangular wall
function createTriangleWall(centerX, centerY, size, rotation) {
    const halfSize = size / 2;
    
    // Calculate triangle vertices (equilateral triangle)
    const vertices = [
        { x: centerX, y: centerY - halfSize }, // Top vertex
        { x: centerX - halfSize * Math.cos(Math.PI / 6), y: centerY + halfSize * Math.sin(Math.PI / 6) }, // Bottom left
        { x: centerX + halfSize * Math.cos(Math.PI / 6), y: centerY + halfSize * Math.sin(Math.PI / 6) }  // Bottom right
    ];
    
    // Apply rotation to all vertices
    const rotatedVertices = vertices.map(vertex => {
        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);
        const dx = vertex.x - centerX;
        const dy = vertex.y - centerY;
        return {
            x: centerX + dx * cos - dy * sin,
            y: centerY + dx * sin + dy * cos
        };
    });
    
    const wall = Bodies.fromVertices(
        centerX, 
        centerY, 
        [rotatedVertices], 
        {
            isStatic: true,
            render: { fillStyle: WALL_CONFIG.color }
        }
    );
    
    // Mark as a wall object to prevent ball detection
    wall.isWall = true;
    
    World.add(world, wall);
    objectCount++;
    objectCountElement.textContent = objectCount;
    
    return wall;
}

// Function to create a hexagon wall
function createHexagonWall(centerX, centerY, size, rotation) {
    const radius = size / 2;
    const vertices = [];
    
    // Create hexagon vertices (6 sides)
    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI / 3) + rotation;
        vertices.push({
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius
        });
    }
    
    const wall = Bodies.fromVertices(
        centerX, 
        centerY, 
        [vertices], 
        {
            isStatic: true,
            render: { fillStyle: WALL_CONFIG.color }
        }
    );
    
    // Mark as a wall object to prevent ball detection
    wall.isWall = true;
    
    World.add(world, wall);
    objectCount++;
    objectCountElement.textContent = objectCount;
    
    return wall;
}


// Function to create a rectangular wall (200x20)
function createWallRect(centerX, centerY, rotation) {
    const wall = Bodies.rectangle(
        centerX, 
        centerY, 
        200, // width
        20,  // height
        {
            isStatic: true,
            angle: rotation,
            render: { fillStyle: WALL_CONFIG.color }
        }
    );
    
    // Mark as a wall object to prevent ball detection
    wall.isWall = true;
    
    World.add(world, wall);
    objectCount++;
    objectCountElement.textContent = objectCount;
    
    return wall;
}

// Function to draw placement restriction circles around existing zones
function drawPlacementRestrictionCircles(zoneType) {
    const minDistance = ZONE_PLACEMENT.minDistance;
    
    // Draw circles around all existing zones
    const allZones = [
        ...multiplierZones.map(r => ({...r, type: 'multiplier'})),
        ...cashZones.map(r => ({...r, type: 'cash'})),
        ...levelUpZones.map(r => ({...r, type: 'levelUp'})),
        ...antiGravityZones.map(r => ({...r, type: 'antiGravity'})),
        ...portalZones.map(r => ({...r, type: 'portal'}))
    ];
    
    // Add permanent bottom cash zone if it exists
    if (permanentBottomCashZone) {
        allZones.push({
            ...permanentBottomCashZone,
            type: 'permanent_cash'
        });
    }
    
    allZones.forEach(zone => {
        // Use different colors based on zone type
        if (zone.type === zoneType) {
            // Green for same type (level up opportunity)
            ctx.fillStyle = 'rgba(0, 255, 0, 0.3)'; // Semi-transparent green
        } else if (zoneType === 'cash' && zone.type === 'portal') {
            // Red for portal zones when placing cash zones (hard conflict)
            ctx.fillStyle = 'rgba(255, 0, 0, 0.3)'; // Semi-transparent red
        } else if (zoneType === 'cash' && zone.type === 'permanent_cash') {
            // Special handling for permanent cash zone - draw the actual zone bounds
            ctx.fillStyle = 'rgba(255, 0, 0, 0.3)'; // Semi-transparent red
            ctx.fillRect(zone.x1, zone.y1, zone.x2 - zone.x1, zone.y2 - zone.y1);
            return; // Skip the circle drawing for permanent cash zone
        } else {
            // Red for different type (conflict)
            ctx.fillStyle = 'rgba(255, 0, 0, 0.3)'; // Semi-transparent red
        }
        
        // Draw circle for regular zones
        const centerX = (zone.x1 + zone.x2) / 2;
        const centerY = (zone.y1 + zone.y2) / 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, minDistance, 0, 2 * Math.PI);
        ctx.fill();
    });
}

// Function to check zone placement and return collision info
function checkZonePlacement(centerX, centerY, zoneType) {
    const minDistance = ZONE_PLACEMENT.minDistance;
    const result = {
        canPlace: true,
        levelUpTarget: null,
        hasConflict: false
    };
    
    // Anti-gravity zones are exempt from overlap rules
    if (zoneType === 'antiGravity') {
        return result; // Always allow placement
    }
    
    // Check all existing zones
    const allZones = [
        ...multiplierZones.map(r => ({...r, type: 'multiplier', original: r})),
        ...cashZones.map(r => ({...r, type: 'cash', original: r})),
        ...levelUpZones.map(r => ({...r, type: 'levelUp', original: r})),
        ...antiGravityZones.map(r => ({...r, type: 'antiGravity', original: r})),
        ...portalZones.map(r => ({...r, type: 'portal', original: r}))
    ];
    
    // Add permanent bottom cash zone if it exists
    if (permanentBottomCashZone) {
        allZones.push({
            ...permanentBottomCashZone,
            type: 'permanent_cash',
            original: permanentBottomCashZone
        });
    }
    
    // First pass: check for same-type zones (upgrade opportunities)
    for (const zone of allZones) {
        if (zone.type === zoneType) {
            // Check if the new zone would overlap with the buffer area around the existing same-type zone
            if (checkZoneOverlapWithBuffer(centerX, centerY, zoneType, zone, minDistance)) {
                // Found a same-type zone nearby - this is an upgrade opportunity
                result.levelUpTarget = zone.original; // Return reference to original zone
                result.canPlace = true; // Can place for level up
                return result; // Return immediately - upgrade overrides all other conflicts
            }
        }
    }
    
    // Second pass: check for conflicts with different-type zones
    for (const zone of allZones) {
        // Skip anti-gravity zones - they don't conflict with other zones
        if (zone.type === 'antiGravity') {
            continue;
        }
        
        // Special handling for permanent cash zone - always check for overlap regardless of distance
        if (zoneType === 'cash' && zone.type === 'permanent_cash') {
            if (checkRectangularOverlap(centerX, centerY, zoneType, zone)) {
                result.canPlace = false;
                result.hasConflict = true;
                return result; // Return immediately - this is a hard conflict
            }
            continue; // Skip the distance-based check for permanent cash zone
        }
        
        // Check for geometric overlap with the restricted area (minDistance buffer around existing zones)
        if (checkZoneOverlapWithBuffer(centerX, centerY, zoneType, zone, minDistance)) {
            // Check if this is a special case where cash zones cannot overlap
            if (zoneType === 'cash' && zone.type === 'portal') {
                // Cash zones cannot overlap with portal zones
                result.canPlace = false;
                result.hasConflict = true;
                return result; // Return immediately - this is a hard conflict
            } else if (zone.type !== zoneType) {
                // Found a different-type zone nearby - this is a conflict
                result.canPlace = false;
                result.hasConflict = true;
            }
        }
    }
    
    return result;
}

// Function to check for rectangular overlap between a new zone and an existing zone
function checkRectangularOverlap(centerX, centerY, zoneType, existingZone) {
    // Get dimensions for the new zone based on type
    let newWidth, newHeight;
    if (zoneType === 'cash') {
        newWidth = ZONE_CONFIG.cash.width;
        newHeight = ZONE_CONFIG.cash.height;
    } else {
        // Default dimensions for other zone types
        newWidth = 100;
        newHeight = 50;
    }
    
    // Calculate bounds for the new zone
    const newLeft = centerX - newWidth / 2;
    const newRight = centerX + newWidth / 2;
    const newTop = centerY - newHeight / 2;
    const newBottom = centerY + newHeight / 2;
    
    // Get bounds for the existing zone
    const existingLeft = existingZone.x1;
    const existingRight = existingZone.x2;
    const existingTop = existingZone.y1;
    const existingBottom = existingZone.y2;
    
    // Check for overlap using standard rectangle overlap algorithm
    return !(newRight < existingLeft || 
             newLeft > existingRight || 
             newBottom < existingTop || 
             newTop > existingBottom);
}

// Function to check if a new zone would overlap with the circular buffer area around an existing zone
function checkZoneOverlapWithBuffer(centerX, centerY, zoneType, existingZone, bufferDistance) {
    // Get dimensions for the new zone based on type
    let newWidth, newHeight;
    if (zoneType === 'cash') {
        newWidth = ZONE_CONFIG.cash.width;
        newHeight = ZONE_CONFIG.cash.height;
    } else if (zoneType === 'multiplier') {
        newWidth = ZONE_CONFIG.multiplier.width;
        newHeight = ZONE_CONFIG.multiplier.height;
    } else if (zoneType === 'levelUp') {
        newWidth = ZONE_CONFIG.levelUp.width;
        newHeight = ZONE_CONFIG.levelUp.height;
    } else {
        // Default dimensions for other zone types
        newWidth = 100;
        newHeight = 50;
    }
    
    // Get the center of the existing zone
    const existingCenterX = (existingZone.x1 + existingZone.x2) / 2;
    const existingCenterY = (existingZone.y1 + existingZone.y2) / 2;
    
    // Calculate bounds for the new zone
    const newLeft = centerX - newWidth / 2;
    const newRight = centerX + newWidth / 2;
    const newTop = centerY - newHeight / 2;
    const newBottom = centerY + newHeight / 2;
    
    // Check if any corner of the new zone is within the circular buffer area
    const corners = [
        { x: newLeft, y: newTop },     // Top-left
        { x: newRight, y: newTop },    // Top-right
        { x: newLeft, y: newBottom },  // Bottom-left
        { x: newRight, y: newBottom }  // Bottom-right
    ];
    
    for (const corner of corners) {
        const distance = Math.sqrt(
            Math.pow(corner.x - existingCenterX, 2) + 
            Math.pow(corner.y - existingCenterY, 2)
        );
        if (distance < bufferDistance) {
            return true; // At least one corner is within the circular buffer
        }
    }
    
    // Also check if the existing zone's center is within the new zone
    // (in case the new zone is large enough to contain the existing zone's center)
    if (existingCenterX >= newLeft && existingCenterX <= newRight &&
        existingCenterY >= newTop && existingCenterY <= newBottom) {
        return true;
    }
    
    return false;
}

// Function to check if a new multiplier zone placement conflicts with existing zones
function checkMultiplierZoneCollision(centerX, centerY) {
    const result = checkZonePlacement(centerX, centerY, 'multiplier');
    return !result.canPlace;
}

// Function to create a multiplier zone at the specified position
function createMultiplierZone(centerX, centerY, factor, rotation = 0) {
    // Use centralized dimensions
    const width = ZONE_CONFIG.multiplier.width;
    const height = ZONE_CONFIG.multiplier.height;
    
    // Create Matter.js body for collision detection
    const body = Bodies.rectangle(centerX, centerY, width, height, {
        isStatic: true,
        isSensor: true, // Sensor bodies don't have physical collision response
        angle: rotation, // Apply rotation to the body
        render: {
            visible: false // We'll draw it manually in the render function
        }
    });
    
    // Create zone object with Matter.js body reference
    const zone = {
        x1: centerX - width / 2,
        y1: centerY - height / 2,
        x2: centerX + width / 2,
        y2: centerY + height / 2,
        centerX: centerX,
        centerY: centerY,
        width: width,
        height: height,
        rotation: rotation,
        factor: factor,
        level: 1, // Start at level 1
        id: Date.now() + Math.random(), // Unique ID for tracking
        body: body // Reference to Matter.js body
    };
    
    // Add body to world
    World.add(world, body);
    objectCount++;
    objectCountElement.textContent = objectCount;
    
    multiplierZones.push(zone);
    return zone;
}

// Function to create a portal zone at the specified position
function createPortalZone(centerX, centerY, color) {
    // Remove any existing portal of the same color
    for (let i = portalZones.length - 1; i >= 0; i--) {
        if (portalZones[i].color === color) {
            // Remove the old body from world
            World.remove(world, portalZones[i].body);
            objectCount--;
            portalZones.splice(i, 1);
        }
    }
    
    // Use centralized dimensions
    const width = ZONE_CONFIG.portal.width;
    const height = ZONE_CONFIG.portal.height;
    
    // Create Matter.js body for collision detection
    const body = Bodies.rectangle(centerX, centerY, width, height, {
        isStatic: true,
        isSensor: true, // Sensor bodies don't have physical collision response
        render: {
            visible: false // We'll draw it manually in the render function
        }
    });
    
    // Create zone object with Matter.js body reference
    const zone = {
        x1: centerX - width / 2,
        y1: centerY - height / 2,
        x2: centerX + width / 2,
        y2: centerY + height / 2,
        centerX: centerX,
        centerY: centerY,
        width: width,
        height: height,
        color: color, // 'blue' or 'orange'
        id: Date.now() + Math.random(), // Unique ID for tracking
        body: body // Reference to Matter.js body
    };
    
    // Add body to world
    World.add(world, body);
    objectCount++;
    objectCountElement.textContent = objectCount;
    
    portalZones.push(zone);
    return zone;
}

// Function to check if a new cash zone placement conflicts with existing zones
function checkCashZoneCollision(centerX, centerY) {
    const result = checkZonePlacement(centerX, centerY, 'cash');
    return !result.canPlace;
}

// Function to create a cash zone at the specified position
function createCashZone(centerX, centerY, rotation = 0) {
    // Use centralized dimensions
    const width = ZONE_CONFIG.cash.width;
    const height = ZONE_CONFIG.cash.height;
    
    // Create Matter.js body for collision detection
    const body = Bodies.rectangle(centerX, centerY, width, height, {
        isStatic: true,
        isSensor: true, // Sensor bodies don't have physical collision response
        angle: rotation, // Apply rotation to the body
        render: {
            visible: false // We'll draw it manually in the render function
        }
    });
    
    // Create zone object with Matter.js body reference
    const zone = {
        x1: centerX - width / 2,
        y1: centerY - height / 2,
        x2: centerX + width / 2,
        y2: centerY + height / 2,
        centerX: centerX,
        centerY: centerY,
        width: width,
        height: height,
        rotation: rotation,
        level: 1, // Start at level 1
        id: Date.now() + Math.random(), // Unique ID for tracking
        body: body // Reference to Matter.js body
    };
    
    // Add body to world
    World.add(world, body);
    objectCount++;
    objectCountElement.textContent = objectCount;
    
    cashZones.push(zone);
    return zone;
}

// Function to check if a new level up zone placement conflicts with existing zones
function checkLevelUpZoneCollision(centerX, centerY) {
    const result = checkZonePlacement(centerX, centerY, 'levelUp');
    return !result.canPlace;
}

// Function to create a level up zone at the specified position
function createLevelUpZone(centerX, centerY, rotation = 0) {
    // Use centralized dimensions
    const width = ZONE_CONFIG.levelUp.width;
    const height = ZONE_CONFIG.levelUp.height;
    
    // Create Matter.js body for collision detection
    const body = Bodies.rectangle(centerX, centerY, width, height, {
        isStatic: true,
        isSensor: true, // Sensor bodies don't have physical collision response
        angle: rotation, // Apply rotation to the body
        render: {
            visible: false // We'll draw it manually in the render function
        }
    });
    
    // Create zone object with Matter.js body reference
    const zone = {
        x1: centerX - width / 2,
        y1: centerY - height / 2,
        x2: centerX + width / 2,
        y2: centerY + height / 2,
        centerX: centerX,
        centerY: centerY,
        width: width,
        height: height,
        rotation: rotation,
        level: 1, // Start at level 1
        id: Date.now() + Math.random(), // Unique ID for tracking
        body: body // Reference to Matter.js body
    };
    
    // Add body to world
    World.add(world, body);
    objectCount++;
    objectCountElement.textContent = objectCount;
    
    levelUpZones.push(zone);
    return zone;
}

// Function to create an anti-gravity zone at the specified position
function createAntiGravityZone(centerX, centerY, rotation = 0) {
    // Use centralized dimensions
    const width = ZONE_CONFIG.antiGravity.width;
    const height = ZONE_CONFIG.antiGravity.height;
    
    // Create Matter.js body for collision detection
    // Rotation is locked at 0 for anti-gravity zones
    const body = Bodies.rectangle(centerX, centerY, width, height, {
        isStatic: true,
        isSensor: true, // Sensor bodies don't have physical collision response
        angle: 0, // Anti-gravity zones are always locked at 0 rotation
        render: {
            visible: false // We'll draw it manually in the render function
        }
    });
    
    // Create zone object with Matter.js body reference
    const zone = {
        x1: centerX - width / 2,
        y1: centerY - height / 2,
        x2: centerX + width / 2,
        y2: centerY + height / 2,
        centerX: centerX,
        centerY: centerY,
        width: width,
        height: height,
        rotation: 0, // Anti-gravity zones are always locked at 0 rotation
        level: 1, // Start at level 1
        id: Date.now() + Math.random(), // Unique ID for tracking
        body: body // Reference to Matter.js body
    };
    
    // Add body to world
    World.add(world, body);
    objectCount++;
    objectCountElement.textContent = objectCount;
    
    antiGravityZones.push(zone);
    return zone;
}

// Function to create the permanent bottom cash zone
function createPermanentBottomCashZone() {
    // Create a zone that occupies only the middle 50% of the canvas width
    const canvasWidth = CANVAS_CONFIG.width;
    const width = canvasWidth * 0.5; // 50% of canvas width
    const height = 30; // Make it a bit taller than regular cash zones
    const centerX = canvasWidth / 2; // Center of canvas
    const centerY = CANVAS_CONFIG.height - height / 2; // Position at bottom of canvas
    
    // Create Matter.js body for collision detection
    const body = Bodies.rectangle(centerX, centerY, width, height, {
        isStatic: true,
        isSensor: true, // Sensor bodies don't have physical collision response
        render: {
            visible: false // We'll draw it manually in the render function
        }
    });
    
    // Create zone object with Matter.js body reference
    const zone = {
        x1: centerX - width / 2,
        y1: centerY - height / 2,
        x2: centerX + width / 2,
        y2: centerY + height / 2,
        level: 1, // Start at level 1
        id: 'permanent_bottom_cash', // Special ID for the permanent zone
        body: body, // Reference to Matter.js body
        isPermanent: true // Flag to identify this as the permanent zone
    };
    
    // Add body to world
    World.add(world, body);
    objectCount++;
    objectCountElement.textContent = objectCount;
    
    permanentBottomCashZone = zone;
    return zone;
}

// Function to check if a point is inside a wall body
function isPointInWall(x, y, wall) {
    // Handle circle walls
    if (wall.circleRadius) {
        const dx = x - wall.position.x;
        const dy = y - wall.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= wall.circleRadius;
    }
    
    // Handle polygonal walls
    const vertices = wall.vertices;
    if (vertices.length < 3) return false;
    
    // Use ray casting algorithm to check if point is inside polygon
    let inside = false;
    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
        if (((vertices[i].y > y) !== (vertices[j].y > y)) &&
            (x < (vertices[j].x - vertices[i].x) * (y - vertices[i].y) / (vertices[j].y - vertices[i].y) + vertices[i].x)) {
            inside = !inside;
        }
    }
    return inside;
}

// Function to check if a point is inside a multiplier zone
function isPointInMultiplierZone(x, y, zone) {
    return x >= zone.x1 && x <= zone.x2 && y >= zone.y1 && y <= zone.y2;
}

// Function to check if a point is inside a portal zone
function isPointInPortalZone(x, y, zone) {
    return x >= zone.x1 && x <= zone.x2 && y >= zone.y1 && y <= zone.y2;
}

// Function to check if a point is inside a cash zone
function isPointInCashZone(x, y, zone) {
    return x >= zone.x1 && x <= zone.x2 && y >= zone.y1 && y <= zone.y2;
}

// Function to check if a point is inside a level up zone
function isPointInLevelUpZone(x, y, zone) {
    return x >= zone.x1 && x <= zone.x2 && y >= zone.y1 && y <= zone.y2;
}

// Function to check if a point is inside an anti-gravity zone
function isPointInAntiGravityZone(x, y, zone) {
    return x >= zone.x1 && x <= zone.x2 && y >= zone.y1 && y <= zone.y2;
}

// Function to check what object is being hovered over
function getHoveredObject(x, y) {
    // First check portal zones (they're drawn on top)
    for (let i = portalZones.length - 1; i >= 0; i--) {
        const zone = portalZones[i];
        if (isPointInPortalZone(x, y, zone)) {
            return { type: 'portal', object: zone };
        }
    }
    
    // Then check level up zones
    for (let i = levelUpZones.length - 1; i >= 0; i--) {
        const zone = levelUpZones[i];
        if (isPointInLevelUpZone(x, y, zone)) {
            return { type: 'levelUp', object: zone };
        }
    }
    
    // Then check anti-gravity zones
    for (let i = antiGravityZones.length - 1; i >= 0; i--) {
        const zone = antiGravityZones[i];
        if (isPointInAntiGravityZone(x, y, zone)) {
            return { type: 'antiGravity', object: zone };
        }
    }
    
    // Then check cash zones
    for (let i = cashZones.length - 1; i >= 0; i--) {
        const zone = cashZones[i];
        if (isPointInCashZone(x, y, zone)) {
            return { type: 'cash', object: zone };
        }
    }
    
    // Then check multiplier zones
    for (let i = multiplierZones.length - 1; i >= 0; i--) {
        const zone = multiplierZones[i];
        if (isPointInMultiplierZone(x, y, zone)) {
            return { type: 'multiplier', object: zone };
        }
    }
    
    // Then check walls (excluding the main tank walls)
    const bodies = Matter.Composite.allBodies(world);
    for (let i = bodies.length - 1; i >= 0; i--) {
        const body = bodies[i];
        // Skip main tank walls and balls
        // Allow circle walls (body.circleRadius && body.isWall) to be hovered
        if (body === leftWall || body === rightWall || body === tankWall || body === tankTopWall || 
            (body.circleRadius && !body.isWall)) {
            continue;
        }
        
        if (isPointInWall(x, y, body)) {
            return { type: 'wall', object: body };
        }
    }
    
    return null;
}

// Function to find a wall at the given coordinates
function findWallAt(x, y) {
    const bodies = Matter.Composite.allBodies(world);
    for (let i = bodies.length - 1; i >= 0; i--) {
        const body = bodies[i];
        // Skip main tank walls, balls, and zone bodies
        // Allow circle walls (body.circleRadius && body.isWall) to be found
        if (body === leftWall || body === rightWall || body === tankWall || body === tankTopWall || 
            (body.circleRadius && !body.isWall) || body.isSensor) {
            continue;
        }
        
        if (isPointInWall(x, y, body)) {
            return body;
        }
    }
    return null;
}

// Function to find an anti-gravity zone at the given coordinates
function findAntiGravityZoneAt(x, y) {
    for (let i = antiGravityZones.length - 1; i >= 0; i--) {
        const zone = antiGravityZones[i];
        if (isPointInAntiGravityZone(x, y, zone)) {
            return zone;
        }
    }
    return null;
}

// Function to find a multiplier zone at the given coordinates
function findMultiplierZoneAt(x, y) {
    for (let i = multiplierZones.length - 1; i >= 0; i--) {
        const zone = multiplierZones[i];
        if (isPointInMultiplierZone(x, y, zone)) {
            return zone;
        }
    }
    return null;
}

// Function to find a portal zone at the given coordinates
function findPortalZoneAt(x, y) {
    for (let i = portalZones.length - 1; i >= 0; i--) {
        const zone = portalZones[i];
        if (isPointInPortalZone(x, y, zone)) {
            return zone;
        }
    }
    return null;
}

// Function to find a cash zone at the given coordinates
function findCashZoneAt(x, y) {
    for (let i = cashZones.length - 1; i >= 0; i--) {
        const zone = cashZones[i];
        if (isPointInCashZone(x, y, zone)) {
            return zone;
        }
    }
    return null;
}

// Function to find a level up zone at the given coordinates
function findLevelUpZoneAt(x, y) {
    for (let i = levelUpZones.length - 1; i >= 0; i--) {
        const zone = levelUpZones[i];
        if (isPointInLevelUpZone(x, y, zone)) {
            return zone;
        }
    }
    return null;
}

// Function to remove wall, multiplier zone, portal zone, cash zone, or level up zone at click point
function removeObjectAt(x, y) {
    // First check portal zones (they're drawn on top)
    for (let i = portalZones.length - 1; i >= 0; i--) {
        const zone = portalZones[i];
        if (isPointInPortalZone(x, y, zone)) {
            // Remove the Matter.js body
            World.remove(world, zone.body);
            objectCount--;
            objectCountElement.textContent = objectCount;
            portalZones.splice(i, 1);
            console.log('Removed portal zone');
            return true;
        }
    }
    
    // Then check level up zones
    for (let i = levelUpZones.length - 1; i >= 0; i--) {
        const zone = levelUpZones[i];
        if (isPointInLevelUpZone(x, y, zone)) {
            // Remove the Matter.js body
            World.remove(world, zone.body);
            objectCount--;
            objectCountElement.textContent = objectCount;
            levelUpZones.splice(i, 1);
            console.log('Removed level up zone');
            return true;
        }
    }
    
    // Then check anti-gravity zones
    for (let i = antiGravityZones.length - 1; i >= 0; i--) {
        const zone = antiGravityZones[i];
        if (isPointInAntiGravityZone(x, y, zone)) {
            // Remove the Matter.js body
            World.remove(world, zone.body);
            objectCount--;
            objectCountElement.textContent = objectCount;
            antiGravityZones.splice(i, 1);
            console.log('Removed anti-gravity zone');
            return true;
        }
    }
    
    // Then check cash zones
    for (let i = cashZones.length - 1; i >= 0; i--) {
        const zone = cashZones[i];
        if (isPointInCashZone(x, y, zone)) {
            // Remove the Matter.js body
            World.remove(world, zone.body);
            objectCount--;
            objectCountElement.textContent = objectCount;
            cashZones.splice(i, 1);
            console.log('Removed cash zone');
            return true;
        }
    }
    
    // Then check multiplier zones
    for (let i = multiplierZones.length - 1; i >= 0; i--) {
        const zone = multiplierZones[i];
        if (isPointInMultiplierZone(x, y, zone)) {
            // Remove the Matter.js body
            World.remove(world, zone.body);
            objectCount--;
            objectCountElement.textContent = objectCount;
            multiplierZones.splice(i, 1);
            console.log('Removed multiplier zone');
            return true;
        }
    }
    
    // Then check walls (excluding the main tank walls)
    const bodies = Matter.Composite.allBodies(world);
    for (let i = bodies.length - 1; i >= 0; i--) {
        const body = bodies[i];
        // Skip main tank walls, balls, and zone bodies
        // Allow circle walls (body.circleRadius && body.isWall) to be removed
        if (body === leftWall || body === rightWall || body === tankWall || body === tankTopWall || 
            (body.circleRadius && !body.isWall) || body.isSensor) {
            continue;
        }
        
        if (isPointInWall(x, y, body)) {
            World.remove(world, body);
            objectCount--;
            objectCountElement.textContent = objectCount;
            console.log('Removed wall');
            return true;
        }
    }
    
    return false;
}

// Function to clear all objects except walls
function clearAllObjects() {
    const bodies = Matter.Composite.allBodies(world);
    bodies.forEach(body => {
        if (body !== leftWall && body !== rightWall && body !== tankWall && body !== tankTopWall && 
            body !== permanentBottomCashZone?.body) {
            World.remove(world, body);
        }
    });
    // Clear multiplier zones, portal zones, cash zones, level up zones, and anti-gravity zones arrays
    multiplierZones = [];
    portalZones = [];
    cashZones = [];
    levelUpZones = [];
    antiGravityZones = [];
    objectCount = 1; // Keep count of 1 for the permanent bottom cash zone
    objectCountElement.textContent = objectCount;
    
    // Reset drop button state and restore floor to default state (dropped/off)
    if (!isDropped) {
        isDropped = true;
        World.remove(world, tankWall);
        dropButton.textContent = 'Replace Floor';
        dropButton.style.background = '#2ed573';
    }
    
    // Reset test ball state
    testBallCount = 0;
    testBallMaxLevel = 1;
    updateTestBallDisplay();
    
    // Reset test ball tracking state
    hadTestBallsInPreviousState = false;
    
    // Clear first test ball tracking
    firstTestBall = null;
    firstTestBallPath = [];
    skipPathRecording = false;
}

// Function to check if any balls are currently on the canvas
function hasBallsOnCanvas() {
    const bodies = Matter.Composite.allBodies(world);
    return bodies.some(body => 
        body.circleRadius && 
        body !== leftWall && 
        body !== rightWall && 
        body !== tankWall && 
        body !== tankTopWall &&
        !body.isWall
    );
}

// Function to check if any test balls are currently on the canvas
function hasTestBallsOnCanvas() {
    const bodies = Matter.Composite.allBodies(world);
    return bodies.some(body => 
        body.circleRadius && 
        body.isTestBall && 
        body !== leftWall && 
        body !== rightWall && 
        body !== tankWall && 
        body !== tankTopWall &&
        !body.isWall
    );
}

// Function to end test (clear only test balls, don't affect turn system)
function endTest() {
    const bodies = Matter.Composite.allBodies(world);
    
    // Set flag to prevent turn increment
    isEndingTest = true;
    
    // Clear all pending test ball timeouts
    testBallTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    testBallTimeouts = [];
    
    bodies.forEach(body => {
        // Only remove test balls
        if (body.circleRadius && body.isTestBall && body !== leftWall && body !== rightWall && body !== tankWall && body !== tankTopWall && !body.isWall) {
            World.remove(world, body);
            objectCount--;
        }
    });
    
    // Reset stuck state
    isStuck = false;
    lastBallDeletionTime = 0;
    
    // Update displays
    objectCountElement.textContent = objectCount;
    updateDisplayValues();
    
    // Reset test ball tracking state (but keep test results displayed)
    hadTestBallsInPreviousState = false;
    
    // Clear first test ball reference (but keep the path visible)
    firstTestBall = null;
    // Don't clear firstTestBallPath or skipPathRecording - keep the line visible until next test/drop
    
    // Update button state after a small delay to ensure Matter.js has processed removals
    setTimeout(() => {
        updateDropButtonState();
        updateDropTestButtonState();
        // Clear the flag after button states are updated
        isEndingTest = false;
    }, 10);
}

// Function to force clear all balls (for stuck ball recovery)
function forceClearBalls() {
    const bodies = Matter.Composite.allBodies(world);
    let regularBallCount = 0;
    
    bodies.forEach(body => {
        // Only remove balls, keep walls and zones
        if (body.circleRadius && body !== leftWall && body !== rightWall && body !== tankWall && body !== tankTopWall && !body.isWall) {
            World.remove(world, body);
            objectCount--;
            
            // Only count regular balls for money, not test balls
            if (!body.isTestBall) {
                regularBallCount++;
            }
        }
    });
    
    // Give money only for regular balls deleted, not test balls
    wallet.money += regularBallCount;
    
    // Reset stuck state
    isStuck = false;
    lastBallDeletionTime = 0;
    
    // Update displays
    objectCountElement.textContent = objectCount;
    updateDisplayValues();
    
    // Reset test ball state
    testBallCount = 0;
    testMoneyEarned = 0;
    testBallMaxLevel = 1;
    updateTestBallDisplay();
    
    // Reset test ball tracking state
    hadTestBallsInPreviousState = false;
    
    // Clear first test ball tracking
    firstTestBall = null;
    firstTestBallPath = [];
    skipPathRecording = false;
    
    // Update button state after a small delay to ensure Matter.js has processed removals
    setTimeout(() => {
        updateDropButtonState();
        updateDropTestButtonState();
    }, 10);
}

// Function to update drop test button state
function updateDropTestButtonState() {
    const hasTestBalls = hasTestBallsOnCanvas();
    const hasRegularBalls = hasBallsOnCanvas() && !hasTestBalls;
    
    // Check if modal is open or if we're in placement mode
    if (isModalOpen || isPlacingItem) {
        dropTestButton.disabled = true;
        dropTestButton.style.background = '#cccccc';
        dropTestButton.style.cursor = 'not-allowed';
        dropTestButton.textContent = 'Test';
        return;
    }
    
    if (hasTestBalls) {
        // Testing mode - show "End Test"
        dropTestButton.disabled = false;
        dropTestButton.style.background = '#ff4757';
        dropTestButton.style.cursor = 'pointer';
        dropTestButton.textContent = 'End Test';
    } else if (hasRegularBalls) {
        // Regular dropping mode - disable test button
        dropTestButton.disabled = true;
        dropTestButton.style.background = '#cccccc';
        dropTestButton.style.cursor = 'not-allowed';
        dropTestButton.textContent = 'Test';
    } else {
        // Ready mode - enable test button
        dropTestButton.disabled = false;
        dropTestButton.style.background = '#ff6b6b';
        dropTestButton.style.cursor = 'pointer';
        dropTestButton.textContent = 'Test';
    }
}

// Function to update drop button state based on whether balls are present
function updateDropButtonState() {
    const hasBalls = hasBallsOnCanvas();
    const hasTestBalls = hasTestBallsOnCanvas();
    const hasRegularBalls = hasBalls && !hasTestBalls;
    const wasEnabled = isDropButtonEnabled;
    isDropButtonEnabled = !hasBalls;
    
    // Check if modal is open or if we're in placement mode
    if (isModalOpen || isPlacingItem) {
        drop10Button.disabled = true;
        drop10Button.style.background = '#cccccc';
        drop10Button.style.cursor = 'not-allowed';
        return;
    }
    
    if (hasTestBalls) {
        // Testing mode - disable drop button
        drop10Button.disabled = true;
        drop10Button.style.background = '#cccccc';
        drop10Button.style.cursor = 'not-allowed';
        drop10Button.textContent = 'Drop 10';
        // Track that we have test balls for turn increment logic
        hadTestBallsInPreviousState = true;
    } else if (hasRegularBalls) {
        if (isStuck) {
            // Regular dropping mode - stuck, show "Next Turn"
            drop10Button.disabled = false;
            drop10Button.style.background = '#ff4757';
            drop10Button.style.cursor = 'pointer';
            drop10Button.textContent = 'Next Turn';
        } else {
            // Regular dropping mode - active, show "Dropping..."
            drop10Button.disabled = true;
            drop10Button.style.background = '#cccccc';
            drop10Button.style.cursor = 'not-allowed';
            drop10Button.textContent = 'Dropping...';
        }
        // Track for turn increment
        hadTestBallsInPreviousState = false;
    } else {
        // Ready mode - enable drop button
        drop10Button.disabled = false;
        drop10Button.style.background = '#ff6b35';
        drop10Button.style.cursor = 'pointer';
        updateDropButtonText();
        
        // Increment turn when transitioning from disabled to enabled (only for regular drops)
        if (!wasEnabled && isDropButtonEnabled && !hadTestBallsInPreviousState && !isEndingTest) {
            // Calculate earnings from last turn before incrementing
            lastTurnEarnings = wallet.money - turnStartMoney;
            
            currentTurn++;
            updateTurnDisplay();
            resetItemsForNewTurn();
            
            // Show item selection modal starting from turn 2
            if (currentTurn >= 2) {
                showItemModal();
            }
        }
    }
}

// Function to check for balls that have fallen off the bottom of the screen
function checkForFallenBalls() {
    const bodies = Matter.Composite.allBodies(world);
    const fallenBalls = [];
    
    bodies.forEach(body => {
        // Check if it's a ball (has circleRadius) and not a wall
        if (body.circleRadius && body !== leftWall && body !== rightWall && body !== tankWall && body !== tankTopWall && !body.isWall) {
            // Check if ball has fallen below the canvas height
            if (body.position.y > canvas.height + BALL_SPAWN_CONFIG.fallenBuffer) {
                fallenBalls.push(body);
            }
        }
    });
    
    // Remove fallen balls (no longer gives money - handled by cash zone)
    fallenBalls.forEach(ball => {
        // Check if this is the first test ball before removing
        if (ball === firstTestBall) {
            firstTestBall = null;
        }
        World.remove(world, ball);
        objectCount--;
    });
    
    // Update last ball deletion time if any balls were removed
    if (fallenBalls.length > 0) {
        lastBallDeletionTime = Date.now();
        objectCountElement.textContent = objectCount;
        updateDisplayValues();
    }
    
    // Check if all balls have fallen off (no balls left in world)
    const remainingBalls = bodies.filter(body => 
        body.circleRadius && body !== leftWall && body !== rightWall && body !== tankWall && body !== tankTopWall && !body.isWall
    );
    
    // Update drop button state based on whether balls are present
    updateDropButtonState();
    updateDropTestButtonState();
    
}

// Function to calculate total vertical velocity of all balls
function getTotalBallVelocity() {
    const bodies = Matter.Composite.allBodies(world);
    let totalVelocity = 0;
    
    bodies.forEach(body => {
        // Check if it's a ball (has circleRadius) and not a wall
        if (body.circleRadius && body !== leftWall && body !== rightWall && body !== tankWall && body !== tankTopWall && !body.isWall) {
            // Use absolute value of vertical velocity (y-component)
            const verticalVelocity = Math.abs(body.velocity.y);
            totalVelocity += verticalVelocity;
        }
    });
    
    return totalVelocity;
}

// Function to check for stuck balls
function checkForStuckBalls() {
    const hasBalls = hasBallsOnCanvas();
    const currentTime = Date.now();
    
    if (hasBalls) {
        // Calculate total velocity of all balls
        const totalVelocity = getTotalBallVelocity();
        
        // Check if total velocity is below threshold
        if (totalVelocity < velocityThreshold) {
            // Start or continue debounce timer
            if (lastVelocityCheckTime === 0) {
                lastVelocityCheckTime = currentTime;
            }
            
            // Check if we've been below threshold long enough
            if (currentTime - lastVelocityCheckTime >= velocityDebounceTime) {
                if (!isStuck) {
                    isStuck = true;
                    updateDropButtonState();
                    updateDropTestButtonState();
                }
            }
        } else {
            // Reset debounce timer and stuck state when velocity is above threshold
            lastVelocityCheckTime = 0;
            if (isStuck) {
                isStuck = false;
                updateDropButtonState();
                updateDropTestButtonState();
            }
        }
    } else {
        // Reset stuck state and debounce timer when no balls are present
        isStuck = false;
        lastVelocityCheckTime = 0;
    }
}

// Function to handle multiplier zone collision
function handleMultiplierCollision(ball, zone) {
    // Check if this ball hasn't been multiplied by this zone yet
    if (!ball.multipliedBy) {
        ball.multipliedBy = new Set();
    }
    
    if (!ball.multipliedBy.has(zone.id)) {
        const newBallCount = zone.factor - 1; // -1 because the original ball already exists
        const ballX = ball.position.x;
        const ballY = ball.position.y;
        const ballRadius = ball.circleRadius;
        
        for (let i = 0; i < newBallCount; i++) {
            // Create new ball with slight offset to avoid overlap
            const offsetX = (Math.random() - 0.5) * ballRadius * 2;
            const offsetY = (Math.random() - 0.5) * ballRadius * 2;
            const newBall = createCircle(ballX + offsetX, ballY + offsetY, ball.isTestBall, ball.level, ballRadius);
            
            // Give the new ball some velocity similar to the original
            const velocityMultiplier = 0.5 + Math.random() * 0.5; // 0.5 to 1.0
            Body.setVelocity(newBall, {
                x: ball.velocity.x * velocityMultiplier,
                y: ball.velocity.y * velocityMultiplier
            });
            
            // Mark the new ball as multiplied by this zone
            if (!newBall.multipliedBy) {
                newBall.multipliedBy = new Set();
            }
            newBall.multipliedBy.add(zone.id);
            
            // Inherit portal status from parent ball
            newBall.hasUsedPortal = ball.hasUsedPortal;
            newBall.render.fillStyle = ball.render.fillStyle;
            
            // If this is a test ball, increment the counter and track max level
            if (ball.isTestBall) {
                testBallCount++;
                if (ball.level > testBallMaxLevel) {
                    testBallMaxLevel = ball.level;
                }
                updateTestBallDisplay();
            }
        }
        
        // Mark the original ball as multiplied by this zone
        ball.multipliedBy.add(zone.id);
    }
}

// Function to handle portal zone collision
function handlePortalCollision(ball, zone) {
    if (zone.color === 'blue' && !ball.hasUsedPortal) {
        // Find the corresponding orange portal
        const orangePortal = portalZones.find(p => p.color === 'orange');
        
        if (orangePortal) {
            // If this is the first test ball, skip path recording during teleportation
            if (ball === firstTestBall) {
                skipPathRecording = true;
            }
            
            // Calculate the center of the orange portal
            const orangeCenterX = (orangePortal.x1 + orangePortal.x2) / 2;
            const orangeCenterY = (orangePortal.y1 + orangePortal.y2) / 2;
            
            // Preserve the ball's velocity
            const velocityX = ball.velocity.x;
            const velocityY = ball.velocity.y;
            
            // Mark the ball as having used a portal
            ball.hasUsedPortal = true;
            
            // Change the ball's color to black
            ball.render.fillStyle = COLORS.ballPortal;
            
            // Reset the ball's multiplier status so it can go through zones again
            ball.multipliedBy = new Set();
            
            // Teleport the ball to the orange portal center
            Body.setPosition(ball, {
                x: orangeCenterX,
                y: orangeCenterY
            });
            
            // Restore the velocity
            Body.setVelocity(ball, {
                x: velocityX,
                y: velocityY
            });
        }
    }
}

// Sound throttling system
let lastSoundPlayTime = 0;
const SOUND_THROTTLE_MS = 50; // Minimum milliseconds between sounds (20 sounds per second max)

// Function to play a random pop sound (with throttling)
function playRandomPopSound() {
    try {
        const currentTime = Date.now();
        
        // Check if enough time has passed since last sound
        if (currentTime - lastSoundPlayTime < SOUND_THROTTLE_MS) {
            return; // Skip this sound to avoid overwhelming the audio system
        }
        
        // Update last play time
        lastSoundPlayTime = currentTime;
        
        // Generate random number between 1 and 5
        const soundNumber = Math.floor(Math.random() * 5) + 1;
        const soundFile = `sounds/pop${soundNumber}.mp3`;
        
        // Create and play audio
        const audio = new Audio(soundFile);
        audio.volume = 0.3; // Set volume to 30% to avoid being too loud
        audio.play().catch(error => {
            console.log('Could not play sound:', error);
        });
    } catch (error) {
        console.log('Error playing sound:', error);
    }
}

// Function to handle cash zone collision
function handleCashCollision(ball, zone) {
    // Check if this ball hasn't triggered this cash zone yet
    if (!ball.cashTriggeredBy) {
        ball.cashTriggeredBy = new Set();
    }
    
    if (!ball.cashTriggeredBy.has(zone.id)) {
        // Add money equal to ball level * zone level (e.g., level 2 ball in level 3 zone = 6 dollars)
        
        // Safety check to prevent NaN values
        const ballLevel = ball.level || 1;
        const zoneLevel = zone.level || 1;
        const moneyToAdd = ballLevel * zoneLevel;
        
        // For test balls, only track the money (don't add to wallet)
        if (ball.isTestBall) {
            testMoneyEarned += moneyToAdd;
            updateTestBallDisplay();
        } else {
            // For regular balls, add money to wallet
            wallet.money += moneyToAdd;
            
            // Play random pop sound when money is earned
            playRandomPopSound();
            
            // Create money animation at ball position
            const ballPos = ball.position;
            moneyAnimations.push(new MoneyAnimation(ballPos.x, ballPos.y, moneyToAdd));
        }
        
        // Mark this ball as having triggered this cash zone
        ball.cashTriggeredBy.add(zone.id);
        
        // Update display
        updateDisplayValues();
    }
}

// Function to handle level up zone collision
function handleLevelUpCollision(ball, zone) {
    // Check if this ball hasn't been leveled up by this zone yet
    if (!ball.leveledUpBy) {
        ball.leveledUpBy = new Set();
    }
    
    if (!ball.leveledUpBy.has(zone.id)) {
        // Calculate scale factor based on zone level
        // Each level increases the ball size by 15%
        const scaleFactor = 1 + (zone.level * 0.15);
        
        // Scale the ball's size
        Body.scale(ball, scaleFactor, scaleFactor);
        
        // Level up the ball by the zone's level amount
        ball.level += zone.level;
        
        // Mark this ball as having been leveled up by this zone
        ball.leveledUpBy.add(zone.id);
        
        // If this is a test ball, track the max level
        if (ball.isTestBall && ball.level > testBallMaxLevel) {
            testBallMaxLevel = ball.level;
            updateTestBallDisplay();
        }
        
        // Update display
        updateDisplayValues();
    }
}

// Function to handle anti-gravity zone collision
function handleAntiGravityCollision(ball, zone) {
    // Check if this ball hasn't been affected by this anti-gravity zone yet
    if (!ball.antiGravityAffectedBy) {
        ball.antiGravityAffectedBy = new Set();
    }
    
    if (!ball.antiGravityAffectedBy.has(zone.id)) {
        // Reverse the ball's gravity by applying upward force
        // We'll apply a constant upward force while the ball is in the zone
        ball.inAntiGravityZone = zone.id;
        
        // Mark this ball as having been affected by this zone
        ball.antiGravityAffectedBy.add(zone.id);
    }
}

// Function to update physics settings
function updatePhysicsSettings() {
    // Update gravity
    engine.world.gravity.y = physicsSettings.gravity;
    
    // Air resistance is fixed at 0 - no need to update
}

// Function to update turn display
function updateTurnDisplay() {
    turnValue.textContent = 'Turn: ' + currentTurn;
}

// Function to calculate spawn position for the current turn
function calculateSpawnPosition() {
    const canvasWidth = CANVAS_CONFIG.width;
    const ballRadius = physicsSettings.circleSize;
    const sideMargin = BALL_SPAWN_CONFIG.margin;
    
    // Calculate the spawn area (between the side walls)
    const spawnStartX = sideMargin + ballRadius;
    const spawnEndX = canvasWidth - sideMargin - ballRadius;
    
    // Choose one random location for all balls in this turn
    currentSpawnX = spawnStartX + Math.random() * (spawnEndX - spawnStartX);
}

// Function to draw the spawn indicator (down arrow/chevron)
function drawSpawnIndicator() {
    // Only show indicator when drop button is enabled (no balls active)
    if (currentSpawnX === null || !isDropButtonEnabled) return;
    
    const spawnY = BALL_SPAWN_CONFIG.topMargin + physicsSettings.circleSize;
    const arrowSize = 20;
    const textHeight = 20;
    const arrowY = spawnY;
    
    ctx.save();
    
    // Draw subtle glowing effect behind the indicator with breathing animation
    const baseGlowRadius = 35;
    const breathingIntensity = 0.1; // How much the radius changes (10%)
    const breathingSpeed = 0.003; // How fast it breathes
    const glowRadius = baseGlowRadius + Math.sin(Date.now() * breathingSpeed) * breathingIntensity * baseGlowRadius;
    
    const glowGradient = ctx.createRadialGradient(
        currentSpawnX, arrowY, 0,
        currentSpawnX, arrowY, glowRadius
    );
    glowGradient.addColorStop(0, 'rgba(255, 255, 255, 0.18)');
    glowGradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.12)');
    glowGradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.06)');
    glowGradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.02)');
    glowGradient.addColorStop(0.9, 'rgba(255, 255, 255, 0.005)');
    glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(currentSpawnX, arrowY, glowRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw "DROP" text above the arrow
    ctx.font = 'bold 10px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Draw text with black outline
    ctx.strokeText('DROP', currentSpawnX, arrowY - 5);
    ctx.fillText('DROP', currentSpawnX, arrowY - 5);
    
    // Draw arrow pointing down
    ctx.beginPath();
    ctx.moveTo(currentSpawnX, arrowY + arrowSize); // Start at bottom point
    ctx.lineTo(currentSpawnX - arrowSize/2, arrowY); // Left wing
    ctx.lineTo(currentSpawnX + arrowSize/2, arrowY); // Right wing
    ctx.closePath();
    
    // Style the arrow
    ctx.fillStyle = '#ffffff'; // White color
    ctx.fill();
    ctx.strokeStyle = '#000000'; // Black border
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.restore();
}

// Function to reset items for a new turn
function resetItemsForNewTurn() {
    items.wallSquare.available = true;
    items.wallSquare.used = false;
    items.wallCircle.available = true;
    items.wallCircle.used = false;
    items.wallTriangle.available = true;
    items.wallTriangle.used = false;
    items.wallHexagon.available = true;
    items.wallHexagon.used = false;
    items.cash.available = true;
    items.cash.used = false;
    items.multiplier.available = true;
    items.multiplier.used = false;
    items.levelUp.available = true;
    items.levelUp.used = false;
    items.ballLevel.available = true;
    items.ballLevel.used = false;
    items.ballCount.available = true;
    items.ballCount.used = false;
    
    // Reset dragging permission items
    items.moveMultiplierZone.available = true;
    items.moveMultiplierZone.used = false;
    items.moveLevelUpZone.available = true;
    items.moveLevelUpZone.used = false;
    items.moveCashZone.available = true;
    items.moveCashZone.used = false;
    items.movePortalIn.available = true;
    items.movePortalIn.used = false;
    items.movePortalOut.available = true;
    items.movePortalOut.used = false;
    
    // Reset resize permission items
    items.resizeAntiGravity.available = true;
    items.resizeAntiGravity.used = false;
    
    // Reset dragging permissions for next turn
    draggingPermissions.multiplierZone = false;
    draggingPermissions.levelUpZone = false;
    draggingPermissions.cashZone = false;
    draggingPermissions.portalIn = false;
    draggingPermissions.portalOut = false;
    
    // Reset resizing permissions for next turn
    resizingPermissions.antiGravityZone = false;
    
    // Reset current item mode
    currentItemMode = null;
    
    // Calculate new spawn position for this turn
    calculateSpawnPosition();
    
    // Update button states
    updateItemButtonStates();
}

// Function to update item button states (simplified for modal system)
function updateItemButtonStates() {
    // This function is kept for compatibility but simplified since we're using modal now
    // The modal handles item availability and selection
}

// =============================================================================
// MODAL SYSTEM FUNCTIONS
// =============================================================================

// Function to show the item selection modal
function showItemModal() {
    if (isModalOpen) return;
    
    isModalOpen = true;
    
    // Reset shop hidden state when opening modal
    isShopHidden = false;
    itemModal.classList.remove('hidden-shop');
    itemModalBackdrop.classList.remove('shop-hidden');
    if (shopHiddenMessage) {
        shopHiddenMessage.classList.remove('show');
    }
    if (hideShopButton) {
        hideShopButton.textContent = 'Hide Shop';
    }
    
    // Show all available items instead of random selection
    showAllItemsInModal();
    
    // Update wallet display
    updateShopWalletDisplay();
    
    // Show modal with animation
    itemModalBackdrop.classList.add('show');
    itemModal.classList.add('show');
    
    // Update drop button state to reflect modal being open
    updateDropButtonState();
}

// Function to hide the item selection modal
function hideItemModal() {
    if (!isModalOpen) return;
    
    isModalOpen = false;
    
    // Hide modal with animation
    itemModalBackdrop.classList.remove('show');
    itemModal.classList.remove('show');
    
    // Re-enable drop button if not placing an item
    if (!isPlacingItem) {
        updateDropButtonState();
    }
}

// Function to hide the shop (make it transparent and blurred)
function hideShop() {
    if (!isModalOpen) return;
    
    isShopHidden = true;
    
    // Add classes for transparent/blurred state
    itemModal.classList.add('hidden-shop');
    itemModalBackdrop.classList.add('shop-hidden');
    
    // Show the "Click to return to Shop" message
    if (shopHiddenMessage) {
        shopHiddenMessage.classList.add('show');
    }
    
    // Update button text
    if (hideShopButton) {
        hideShopButton.textContent = 'Show Shop';
    }
}

// Function to show the shop (restore from transparent/blurred state)
function showShop() {
    if (!isModalOpen || !isShopHidden) return;
    
    isShopHidden = false;
    
    // Remove classes for transparent/blurred state
    itemModal.classList.remove('hidden-shop');
    itemModalBackdrop.classList.remove('shop-hidden');
    
    // Hide the "Click to return to Shop" message
    if (shopHiddenMessage) {
        shopHiddenMessage.classList.remove('show');
    }
    
    // Update button text
    if (hideShopButton) {
        hideShopButton.textContent = 'Hide Shop';
    }
}

// Function to find a random position within the game area
function findRandomPosition(itemType) {
    const canvasWidth = CANVAS_CONFIG.width;
    const canvasHeight = CANVAS_CONFIG.height;
    
    // Define safe margins from edges
    const margin = 50;
    
    // Define item sizes based on type
    let itemSize = 50; // default
    if (itemType.includes('wall')) {
        if (itemType === 'wallSquare') itemSize = 80;
        else if (itemType === 'wallCircle') itemSize = 50;
        else if (itemType === 'wallTriangle') itemSize = 120;
        else if (itemType === 'wallHexagon') itemSize = 100;
    } else if (itemType === 'cash' || itemType === 'multiplier' || itemType === 'levelUp') {
        itemSize = 60; // zone size
    }
    
    // Calculate safe area
    const minX = margin + itemSize / 2;
    const maxX = canvasWidth - margin - itemSize / 2;
    const minY = margin + itemSize / 2;
    const maxY = canvasHeight - margin - itemSize / 2;
    
    // Generate random position
    const x = minX + Math.random() * (maxX - minX);
    const y = minY + Math.random() * (maxY - minY);
    
    return { x, y };
}

// Function to find a random position for a zone that avoids existing zones
function findRandomZonePosition(itemType) {
    const canvasWidth = CANVAS_CONFIG.width;
    const canvasHeight = CANVAS_CONFIG.height;
    
    // Define safe margins from edges
    const margin = 50;
    
    // Define zone size based on type
    let zoneSize = 60; // default zone size
    if (itemType === 'antiGravity') {
        zoneSize = ZONE_CONFIG.antiGravity.width; // Use actual zone config
    } else if (itemType === 'cash') {
        zoneSize = ZONE_CONFIG.cash.width;
    } else if (itemType === 'multiplier') {
        zoneSize = ZONE_CONFIG.multiplier.width;
    } else if (itemType === 'levelUp') {
        zoneSize = ZONE_CONFIG.levelUp.width;
    }
    
    // Calculate safe area
    const minX = margin + zoneSize / 2;
    const maxX = canvasWidth - margin - zoneSize / 2;
    const minY = margin + zoneSize / 2;
    const maxY = canvasHeight - margin - zoneSize / 2;
    
    // Try to find a position that doesn't overlap with existing zones
    const maxAttempts = 50;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const x = minX + Math.random() * (maxX - minX);
        const y = minY + Math.random() * (maxY - minY);
        
        // For anti-gravity zones, don't check for overlap with other zones
        if (itemType === 'antiGravity') {
            return { x, y };
        }
        
        // Check if this position conflicts with existing zones
        if (!isPositionOccupiedByZone(x, y, zoneSize)) {
            return { x, y };
        }
    }
    
    // If we couldn't find a non-overlapping position, return a random position anyway
    console.log(`Warning: Could not find non-overlapping position for ${itemType} zone after ${maxAttempts} attempts`);
    const x = minX + Math.random() * (maxX - minX);
    const y = minY + Math.random() * (maxY - minY);
    return { x, y };
}

// Function to check if a position is occupied by any existing zone
function isPositionOccupiedByZone(x, y, zoneSize, excludeAntiGravity = false) {
    const minDistance = ZONE_PLACEMENT.minDistance || 80; // Minimum distance between zones
    
    // Check all existing zones
    const allZones = [
        ...cashZones,
        ...multiplierZones,
        ...levelUpZones,
        ...(excludeAntiGravity ? [] : antiGravityZones) // Exclude anti-gravity zones if requested
    ];
    
    for (const zone of allZones) {
        const distance = Math.sqrt(
            Math.pow(x - zone.centerX, 2) + Math.pow(y - zone.centerY, 2)
        );
        
        if (distance < minDistance) {
            return true; // Position is too close to existing zone
        }
    }
    
    return false; // Position is clear
}

// Function to automatically place a wall item
function autoPlaceWall(itemType) {
    const position = findRandomPosition(itemType);
    
    // Create dropping animation starting from top of screen
    const startX = position.x;
    const startY = 50; // Start from top of screen
    const endX = position.x;
    const endY = position.y;
    
    const animation = new DroppingAnimation(itemType, startX, startY, endX, endY, {
        rotation: 0 // No rotation - keep default angle
    });
    
    droppingAnimations.push(animation);
    
    console.log(`Started dropping animation for ${itemType} to (${position.x.toFixed(1)}, ${position.y.toFixed(1)})`);
}

// Function to automatically place a zone item
function autoPlaceZone(itemType) {
    console.log(`autoPlaceZone called for: ${itemType}`);
    const position = findRandomZonePosition(itemType);
    console.log(`Found position: (${position.x}, ${position.y})`);
    
    // Create dropping animation starting from top of screen
    const startX = position.x;
    const startY = 50; // Start from top of screen
    const endX = position.x;
    const endY = position.y;
    
    const animation = new DroppingAnimation(itemType, startX, startY, endX, endY, {
        rotation: 0 // No rotation - keep default angle
    });
    
    droppingAnimations.push(animation);
    
    console.log(`Started dropping animation for ${itemType} zone to (${position.x.toFixed(1)}, ${position.y.toFixed(1)})`);
}

// Function to automatically upgrade a zone item
function autoUpgradeZone(itemType) {
    console.log(`autoUpgradeZone called for: ${itemType}`);
    
    // For antigravity zones, always create new ones instead of upgrading
    if (itemType === 'antiGravity') {
        console.log(`Creating new antigravity zone (always create new, don't upgrade)`);
        autoPlaceZone(itemType);
        return;
    }
    
    const success = upgradeRandomZone(itemType);
    console.log(`upgradeRandomZone success: ${success}`);
    
    if (!success) {
        console.log(`No existing ${itemType} zones found - creating new one`);
        // If no existing zones, create a new one
        autoPlaceZone(itemType);
    }
}

// Function to upgrade a random existing zone of the specified type
function upgradeRandomZone(itemType) {
    let zones = [];
    
    // Get the appropriate zone array based on type
    if (itemType === 'cash') {
        zones = cashZones;
    } else if (itemType === 'multiplier') {
        zones = multiplierZones;
    } else if (itemType === 'levelUp') {
        zones = levelUpZones;
    } else if (itemType === 'antiGravity') {
        zones = antiGravityZones;
    }
    
    // Check if there are any existing zones of this type
    if (zones.length === 0) {
        return false;
    }
    
    // For multiplier zones, filter out zones that are already at max level (level 4 = 5x)
    // For level up zones, filter out zones that are already at max level (level 5 = +5)
    let eligibleZones = zones;
    if (itemType === 'multiplier') {
        const MAX_MULTIPLIER_LEVEL = 4; // Level 4 = 5x (factor = level + 1)
        eligibleZones = zones.filter(zone => zone.level < MAX_MULTIPLIER_LEVEL);
        
        // If no zones can be upgraded, return false
        if (eligibleZones.length === 0) {
            return false;
        }
    } else if (itemType === 'levelUp') {
        const MAX_LEVEL_UP_LEVEL = 5; // Level 5 = +5
        eligibleZones = zones.filter(zone => zone.level < MAX_LEVEL_UP_LEVEL);
        
        // If no zones can be upgraded, return false
        if (eligibleZones.length === 0) {
            return false;
        }
    }
    
    // Select a random zone to upgrade from eligible zones
    const randomIndex = Math.floor(Math.random() * eligibleZones.length);
    const zoneToUpgrade = eligibleZones[randomIndex];
    
    // Upgrade the zone
    zoneToUpgrade.level++;
    
    // For multiplier zones, also update the factor
    if (itemType === 'multiplier') {
        zoneToUpgrade.factor = zoneToUpgrade.level + 1; // factor = level + 1
    }
    
    console.log(`Upgraded ${itemType} zone to level ${zoneToUpgrade.level}`);
    
    // Mark ALL items as used for this turn
    markAllItemsAsUsed();
    
    return true;
}

// Function to handle item selection from modal
function selectItemFromModal(itemType) {
    console.log(`Attempting to select item: ${itemType}`);
    console.log(`Item available: ${items[itemType]?.available}`);
    console.log(`Can afford: ${canAffordItem(itemType)}`);
    console.log(`Current wallet: $${wallet.money}`);
    
    if (!items[itemType].available) return;
    
    // Check if player can afford the item
    if (!canAffordItem(itemType)) {
        console.log(`Cannot afford ${itemType} - need $${itemPrices[itemType]}, have $${wallet.money}`);
        return;
    }
    
    // Purchase the item
    if (!purchaseItem(itemType)) {
        console.log(`Failed to purchase ${itemType}`);
        return;
    }
    
    console.log(`Purchased ${itemType} for $${itemPrices[itemType]}`);
    
    // Close modal first
    hideItemModal();
    
    // Categorize items into immediate effects vs auto-placed items
    const immediateEffectItems = ['ballLevel', 'ballCount'];
    const wallItems = ['wallSquare', 'wallCircle', 'wallTriangle', 'wallHexagon'];
    const zoneItems = ['cash', 'multiplier', 'levelUp', 'antiGravity'];
    const draggingPermissionItems = ['moveMultiplierZone', 'moveLevelUpZone', 'moveCashZone', 'movePortalIn', 'movePortalOut'];
    const resizingPermissionItems = ['resizeAntiGravity'];
    
    if (immediateEffectItems.includes(itemType)) {
        // Apply immediate effect
        if (itemType === 'ballLevel') {
            useBallLevelItem();
        } else if (itemType === 'ballCount') {
            useBallCountItem();
        }
    } else if (wallItems.includes(itemType)) {
        // Auto-place wall
        autoPlaceWall(itemType);
    } else if (zoneItems.includes(itemType)) {
        // Auto-upgrade zone
        autoUpgradeZone(itemType);
    } else if (draggingPermissionItems.includes(itemType)) {
        // Grant dragging permission
        grantDraggingPermission(itemType);
    } else if (resizingPermissionItems.includes(itemType)) {
        // Grant resizing permission
        grantResizingPermission(itemType);
    }
}

// Function to check if a dragged zone can be placed at a new position
function canPlaceDraggedZone(centerX, centerY, draggedZone, zoneType) {
    const minDistance = ZONE_PLACEMENT.minDistance;
    
    // Anti-gravity zones are exempt from overlap rules
    if (zoneType === 'antiGravity') {
        return true; // Always allow placement
    }
    
    // Get all existing zones except the one being dragged
    const allZones = [
        ...multiplierZones.filter(z => z !== draggedZone).map(r => ({...r, type: 'multiplier', original: r})),
        ...cashZones.filter(z => z !== draggedZone).map(r => ({...r, type: 'cash', original: r})),
        ...levelUpZones.filter(z => z !== draggedZone).map(r => ({...r, type: 'levelUp', original: r})),
        ...antiGravityZones.filter(z => z !== draggedZone).map(r => ({...r, type: 'antiGravity', original: r})),
        ...portalZones.filter(z => z !== draggedZone).map(r => ({...r, type: 'portal', original: r}))
    ];
    
    // Add permanent bottom cash zone if it exists
    if (permanentBottomCashZone) {
        allZones.push({
            ...permanentBottomCashZone,
            type: 'permanent_cash',
            original: permanentBottomCashZone
        });
    }
    
    // Check for conflicts with other zones
    for (const zone of allZones) {
        // Skip anti-gravity zones - they don't conflict with other zones
        if (zone.type === 'antiGravity') {
            continue;
        }
        
        // Special handling for permanent cash zone - always check for overlap regardless of distance
        if (zoneType === 'cash' && zone.type === 'permanent_cash') {
            if (checkRectangularOverlap(centerX, centerY, zoneType, zone)) {
                return false; // Hard conflict
            }
            continue; // Skip the distance-based check for permanent cash zone
        }
        
        // Check for geometric overlap with the restricted area (minDistance buffer around existing zones)
        if (checkZoneOverlapWithBuffer(centerX, centerY, zoneType, zone, minDistance)) {
            // When dragging, prevent ALL overlaps regardless of zone type
            return false; // Any overlap is a conflict when dragging
        }
    }
    
    return true; // Can place the zone
}

// Function to grant dragging permission for a specific item type
function grantDraggingPermission(itemType) {
    switch (itemType) {
        case 'moveMultiplierZone':
            draggingPermissions.multiplierZone = true;
            console.log('Granted permission to move multiplier zones');
            break;
        case 'moveLevelUpZone':
            draggingPermissions.levelUpZone = true;
            console.log('Granted permission to move level up zones');
            break;
        case 'moveCashZone':
            draggingPermissions.cashZone = true;
            console.log('Granted permission to move cash zones');
            break;
        case 'movePortalIn':
            draggingPermissions.portalIn = true;
            console.log('Granted permission to move IN portals');
            break;
        case 'movePortalOut':
            draggingPermissions.portalOut = true;
            console.log('Granted permission to move OUT portals');
            break;
    }
}

// Function to grant resizing permission for a specific item type
function grantResizingPermission(itemType) {
    console.log(`grantResizingPermission called for: ${itemType}`);
    
    switch (itemType) {
        case 'resizeAntiGravity':
            resizingPermissions.antiGravityZone = true;
            console.log('Granted permission to resize anti-gravity zones');
            break;
    }
}

// Function to check if mouse is near an edge of an anti-gravity zone
function getAntiGravityZoneEdgeAt(x, y, zone) {
    const edgeThreshold = 10; // pixels from edge to detect
    
    // Calculate zone boundaries
    const left = zone.centerX - zone.width / 2;
    const right = zone.centerX + zone.width / 2;
    const top = zone.centerY - zone.height / 2;
    const bottom = zone.centerY + zone.height / 2;
    
    // Check if mouse is within the zone area (with some margin)
    const margin = edgeThreshold;
    if (x < left - margin || x > right + margin || y < top - margin || y > bottom + margin) {
        return null; // Not near this zone
    }
    
    // Check which edge is closest
    const distToLeft = Math.abs(x - left);
    const distToRight = Math.abs(x - right);
    const distToTop = Math.abs(y - top);
    const distToBottom = Math.abs(y - bottom);
    
    // Find the minimum distance
    const minDist = Math.min(distToLeft, distToRight, distToTop, distToBottom);
    
    // If within threshold, return the edge
    if (minDist <= edgeThreshold) {
        if (minDist === distToLeft) return 'left';
        if (minDist === distToRight) return 'right';
        if (minDist === distToTop) return 'top';
        if (minDist === distToBottom) return 'bottom';
    }
    
    return null;
}

// Function to find an anti-gravity zone edge at the given position
function findAntiGravityZoneEdgeAt(x, y) {
    if (!resizingPermissions.antiGravityZone) return null;
    
    for (const zone of antiGravityZones) {
        const edge = getAntiGravityZoneEdgeAt(x, y, zone);
        if (edge) {
            return { zone, edge };
        }
    }
    return null;
}

// Item pricing configuration
const itemPrices = {
    wallSquare: 100,
    wallCircle: 25,
    wallTriangle: 100,
    wallHexagon: 50,
    cash: 100,
    multiplier: 400,
    levelUp: 200,
    antiGravity: 1000,
    ballLevel: 1000,
    ballCount: 0,
    // New dragging permission items
    moveMultiplierZone: 400,
    moveLevelUpZone: 200,
    moveCashZone: 100,
    movePortalIn: 800,
    movePortalOut: 800,
    // Resize permission items
    resizeAntiGravity: 1000
};

// Function to check if player can afford an item
function canAffordItem(itemType) {
    const price = itemPrices[itemType];
    
    // For multiplier upgrades, also check if there are any zones that can be upgraded
    if (itemType === 'multiplier') {
        const MAX_MULTIPLIER_LEVEL = 4; // Level 4 = 5x (factor = level + 1)
        const canUpgrade = multiplierZones.length > 0 && 
                          multiplierZones.some(zone => zone.level < MAX_MULTIPLIER_LEVEL);
        return wallet.money >= price && canUpgrade;
    }
    
    // For level up upgrades, also check if there are any zones that can be upgraded
    if (itemType === 'levelUp') {
        const MAX_LEVEL_UP_LEVEL = 5; // Level 5 = +5
        const canUpgrade = levelUpZones.length > 0 && 
                          levelUpZones.some(zone => zone.level < MAX_LEVEL_UP_LEVEL);
        return wallet.money >= price && canUpgrade;
    }
    
    // For resize anti-gravity, check if there are any anti-gravity zones
    if (itemType === 'resizeAntiGravity') {
        return wallet.money >= price && antiGravityZones.length > 0;
    }
    
    return wallet.money >= price;
}

// Function to purchase an item
function purchaseItem(itemType) {
    const price = itemPrices[itemType];
    if (canAffordItem(itemType)) {
        wallet.money -= price;
        updateMoneyDisplay();
        return true;
    }
    return false;
}

// Function to update item affordability display
function updateItemAffordability() {
    const itemOptions = document.querySelectorAll('.item-option');
    const zoneOptions = document.querySelectorAll('.zone-option');
    
    itemOptions.forEach(option => {
        const itemType = option.getAttribute('data-item');
        const price = parseInt(option.getAttribute('data-price'));
        
        if (canAffordItem(itemType)) {
            option.classList.remove('unaffordable');
        } else {
            option.classList.add('unaffordable');
        }
    });
    
    zoneOptions.forEach(option => {
        const itemType = option.getAttribute('data-item');
        const price = parseInt(option.getAttribute('data-price'));
        const priceElement = option.querySelector('.zone-price');
        
        // Check if multiplier is sold out (all zones maxed)
        if (itemType === 'multiplier') {
            const MAX_MULTIPLIER_LEVEL = 4; // Level 4 = 5x (factor = level + 1)
            const allMaxed = multiplierZones.length > 0 && 
                           multiplierZones.every(zone => zone.level >= MAX_MULTIPLIER_LEVEL);
            
            if (allMaxed) {
                priceElement.textContent = 'Sold Out';
                option.classList.add('unaffordable');
                return;
            } else {
                // Reset to original price if not sold out
                priceElement.textContent = `$${price}`;
            }
        }
        
        // Check if level up is sold out (all zones maxed)
        if (itemType === 'levelUp') {
            const MAX_LEVEL_UP_LEVEL = 5; // Level 5 = +5
            const allMaxed = levelUpZones.length > 0 && 
                           levelUpZones.every(zone => zone.level >= MAX_LEVEL_UP_LEVEL);
            
            if (allMaxed) {
                priceElement.textContent = 'Sold Out';
                option.classList.add('unaffordable');
                return;
            } else {
                // Reset to original price if not sold out
                priceElement.textContent = `$${price}`;
            }
        }
        
        if (canAffordItem(itemType)) {
            option.classList.remove('unaffordable');
        } else {
            option.classList.add('unaffordable');
        }
    });
}

// Function to show all available items in the modal
function showAllItemsInModal() {
    const itemOptions = document.querySelectorAll('.item-option');
    
    // Show all items - they're all available now
    itemOptions.forEach(option => {
        option.style.display = 'flex';
    });
    
    // Update affordability display
    updateItemAffordability();
}




// Function to exit item mode
function exitItemMode() {
    currentItemMode = null;
    canvas.style.cursor = 'crosshair';
    updateItemButtonStates();
    
    // Also exit placement mode if we're in it
    if (isPlacingItem) {
        exitItemPlacementMode();
    }
}

// Function to place a square wall item
function placeSquareWallItem(x, y) {
    if (!items.wallSquare.available) return false;
    
    // Create a square wall of predetermined size (80 pixels) with current rotation
    const wallSize = 80;
    const wall = createSquareWall(x, y, wallSize, wallItemRotation);
    
    // Mark ALL items as used for this turn
    markAllItemsAsUsed();
    
    // Exit item mode
    exitItemMode();
    
    return true;
}

// Function to place a circle wall item
function placeCircleWallItem(x, y) {
    if (!items.wallCircle.available) return false;
    
    // Create a circular wall of predetermined radius (50 pixels)
    const wallRadius = 50;
    const wall = createCircleWall(x, y, wallRadius);
    
    // Mark ALL items as used for this turn
    markAllItemsAsUsed();
    
    // Exit item mode
    exitItemMode();
    
    return true;
}

// Function to place a triangle wall item
function placeTriangleWallItem(x, y) {
    if (!items.wallTriangle.available) return false;
    
    // Create a triangular wall of predetermined size (120 pixels) with current rotation
    const wallSize = 120;
    const wall = createTriangleWall(x, y, wallSize, wallItemRotation);
    
    // Mark ALL items as used for this turn
    markAllItemsAsUsed();
    
    // Exit item mode
    exitItemMode();
    
    return true;
}

// Function to place a hexagon wall item
function placeHexagonWallItem(x, y) {
    if (!items.wallHexagon.available) return false;
    
    // Create a hexagon wall of predetermined size (100 pixels) with current rotation
    const wallSize = 100;
    const wall = createHexagonWall(x, y, wallSize, wallItemRotation);
    
    // Mark ALL items as used for this turn
    markAllItemsAsUsed();
    
    // Exit item mode
    exitItemMode();
    
    return true;
}



// Function to place a rectangular wall item
function placeWallRectItem(x, y) {
    if (!items.wallRect.available) return false;
    
    // Create a rectangular wall of predetermined size (200x20) with current rotation
    const wall = createWallRect(x, y, wallItemRotation);
    
    // Mark ALL items as used for this turn
    markAllItemsAsUsed();
    
    // Exit item mode
    exitItemMode();
    
    return true;
}

// Helper function to mark all items as used
function markAllItemsAsUsed() {
    items.wallSquare.available = false;
    items.wallSquare.used = true;
    items.wallCircle.available = false;
    items.wallCircle.used = true;
    items.wallTriangle.available = false;
    items.wallTriangle.used = true;
    items.wallHexagon.available = false;
    items.wallHexagon.used = true;
    items.cash.available = false;
    items.cash.used = true;
    items.multiplier.available = false;
    items.multiplier.used = true;
}

// Zone placement functions removed - zones now upgrade existing ones automatically

// Function to use ball level upgrade item
function useBallLevelItem() {
    if (!items.ballLevel.available) return false;
    
    // Upgrade ball level
    upgradeBallLevel();
    
    // Mark ALL items as used for this turn
    markAllItemsAsUsed();
    
    // Exit item mode
    exitItemMode();
    
    return true;
}

// Function to use ball count upgrade item
function useBallCountItem() {
    if (!items.ballCount.available) return false;
    
    // Upgrade ball count
    upgradeBallCount();
    
    // Mark ALL items as used for this turn
    markAllItemsAsUsed();
    
    // Exit item mode
    exitItemMode();
    
    return true;
}

// Function to update test ball count display
function updateTestBallDisplay() {
    testBallCountElement.innerHTML = '🔴 ' + testBallCount + '<br>💵 $' + numberFormatShort(testMoneyEarned) + '<br>📊 Max Level: ' + testBallMaxLevel;
}


// Function to update ball level display with color preview
function updateBallLevelDisplay() {
    const level = physicsSettings.ballLevel;
    const color = getBallColorForLevel(level);
    const value = level;
    
    // Update the input value
    ballLevelInput.value = level;
    
    // Update the display with color and value
    ballLevelValue.textContent = value;
    ballLevelValue.style.color = color;
    ballLevelValue.style.fontWeight = 'bold';
}

// Function to upgrade ball level
function upgradeBallLevel() {
    currentBallLevel++;
    updateBallLevelDisplay();
    updateCurrentBallLevelDisplay();
    updateDisplayValues();
}

// Function to upgrade ball count
function upgradeBallCount() {
    currentBallCount++;
    updateDropButtonText();
    updateDisplayValues();
}

// Function to update drop button text to show current ball count
function updateDropButtonText() {
    drop10Button.textContent = `Drop ${currentBallCount}`;
}

// Function to update current ball level display
function updateCurrentBallLevelDisplay() {
    const color = getBallColorForLevel(currentBallLevel);
    currentBallLevelValue.textContent = `Ball Level: ${currentBallLevel}`;
    currentBallLevelValue.style.color = color;
    currentBallLevelValue.style.fontWeight = 'bold';
}

// Function to update money display and affordability
function updateMoneyDisplay() {
    moneyValue.textContent = '💵 $' + numberFormatShort(wallet.money);
    diamondsValue.textContent = '💎 ' + numberFormatShort(wallet.diamonds);
    keysValue.textContent = '🗝️ ' + numberFormatShort(wallet.keys);
    
    // Update shop wallet display if modal is open
    if (isModalOpen) {
        updateShopWalletDisplay();
    }
    
    // Update affordability if modal is open
    if (isModalOpen) {
        updateItemAffordability();
    }
}

// Function to update the wallet display in the shop modal
function updateShopWalletDisplay() {
    const shopWalletDisplay = document.getElementById('shopWalletDisplay');
    if (shopWalletDisplay) {
        shopWalletDisplay.textContent = `$${numberFormatShort(wallet.money)}`;
    }
    
    const lastTurnDisplay = document.getElementById('lastTurnDisplay');
    if (lastTurnDisplay) {
        lastTurnDisplay.textContent = `$${numberFormatShort(lastTurnEarnings)}`;
    }
}

// Function to update display values
function updateDisplayValues() {
    gravityValue.textContent = physicsSettings.gravity.toFixed(1);
    sizeValue.textContent = physicsSettings.circleSize;
    bounceValue.textContent = physicsSettings.bounciness.toFixed(1);
    frictionValue.textContent = physicsSettings.friction.toFixed(1);
    densityValue.textContent = physicsSettings.density.toFixed(3);
    // Ball inventory display removed
    updateMoneyDisplay();
    spawnDelayValue.textContent = physicsSettings.spawnDelay;
    multiplierValue.textContent = multiplierFactor;
    updateBallLevelDisplay();
    updateTurnDisplay();
}


// Wait for DOM to be fully loaded before adding event listeners
document.addEventListener('DOMContentLoaded', function() {
    
    // Side panel functionality
    const settingsButton = document.getElementById('settingsButton');
    const sidePanel = document.getElementById('sidePanel');
    const panelClose = document.getElementById('panelClose');
    const panelBackdrop = document.getElementById('panelBackdrop');
    const container = document.querySelector('.container');
    
    // Open side panel
    settingsButton.addEventListener('click', function() {
        sidePanel.classList.add('show');
        panelBackdrop.classList.add('show');
    });
    
    // Close side panel
    function closePanel() {
        sidePanel.classList.remove('show');
        panelBackdrop.classList.remove('show');
    }
    
    panelClose.addEventListener('click', closePanel);
    
    // Close panel when clicking backdrop
    panelBackdrop.addEventListener('click', closePanel);
    
    // Close panel with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidePanel.classList.contains('show')) {
            closePanel();
        }
    });
    
    // Modal functionality
    const itemOptions = document.querySelectorAll('.item-option');
    const zoneOptions = document.querySelectorAll('.zone-option');
    
    // Add click listeners to all item options
    itemOptions.forEach(option => {
        option.addEventListener('click', function() {
            const itemType = this.getAttribute('data-item');
            selectItemFromModal(itemType);
        });
    });
    
    // Add click listeners to all zone options
    zoneOptions.forEach(option => {
        option.addEventListener('click', function() {
            const itemType = this.getAttribute('data-item');
            selectItemFromModal(itemType);
        });
    });
    
    // Close modal when clicking backdrop
    itemModalBackdrop.addEventListener('click', function() {
        // If shop is hidden, show it again on click
        if (isShopHidden) {
            showShop();
        }
        // Don't close modal on backdrop click - user must select an item
    });
    
    // Hide shop button functionality
    if (hideShopButton) {
        hideShopButton.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event from bubbling to modal
            if (isShopHidden) {
                showShop();
            } else {
                hideShop();
            }
        });
    }
    
    // Event listeners for sliders
    gravitySlider.addEventListener('input', (e) => {
        physicsSettings.gravity = parseFloat(e.target.value);
        updatePhysicsSettings();
        updateDisplayValues();
    });


sizeSlider.addEventListener('input', (e) => {
    physicsSettings.circleSize = parseInt(e.target.value);
    updateDisplayValues();
});

bounceSlider.addEventListener('input', (e) => {
    physicsSettings.bounciness = parseFloat(e.target.value);
    updateDisplayValues();
});

frictionSlider.addEventListener('input', (e) => {
    physicsSettings.friction = parseFloat(e.target.value);
    updateDisplayValues();
});

densitySlider.addEventListener('input', (e) => {
    physicsSettings.density = parseFloat(e.target.value);
    updateDisplayValues();
});

spawnDelaySlider.addEventListener('input', (e) => {
    physicsSettings.spawnDelay = parseInt(e.target.value);
    updateDisplayValues();
});

ballLevelInput.addEventListener('input', (e) => {
    const level = Math.max(1, parseInt(e.target.value) || 1);
    physicsSettings.ballLevel = level;
    updateBallLevelDisplay();
    updateDisplayValues();
});




// Button event listeners
clearButton.addEventListener('click', clearAllObjects);

pauseButton.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
    pauseButton.style.background = isPaused ? '#2ed573' : '#3742fa';
});

// Debug function to upgrade all zones to max and add objects
function upgradeMaxDebug() {
    console.log('Debug: Upgrade Max activated');
    
    // 1. Upgrade all multiplier zones to level 4 (5x)
    multiplierZones.forEach(zone => {
        zone.level = 4;
        zone.factor = 5; // level + 1
        console.log(`Upgraded multiplier zone to level 4 (5x)`);
    });
    
    // 2. Upgrade all level up zones to level 5 (+5)
    levelUpZones.forEach(zone => {
        zone.level = 5;
        console.log(`Upgraded level up zone to level 5 (+5)`);
    });
    
    // 3. Upgrade all cash zones to level 5
    cashZones.forEach(zone => {
        zone.level = 5;
        console.log(`Upgraded cash zone to level 5`);
    });
    
    // 4. Create 10 random wall shapes
    const wallTypes = ['wallSquare', 'wallCircle', 'wallTriangle', 'wallHexagon'];
    const canvasWidth = CANVAS_CONFIG.width;
    const canvasHeight = CANVAS_CONFIG.height;
    const margin = 50;
    
    for (let i = 0; i < 10; i++) {
        // Random position
        const x = margin + Math.random() * (canvasWidth - 2 * margin);
        const y = margin + Math.random() * (canvasHeight - 2 * margin);
        const rotation = Math.random() * Math.PI * 2;
        
        // Random wall type
        const wallType = wallTypes[Math.floor(Math.random() * wallTypes.length)];
        
        // Create wall
        let wall;
        switch (wallType) {
            case 'wallSquare':
                wall = createSquareWall(x, y, 80, rotation);
                break;
            case 'wallCircle':
                wall = createCircleWall(x, y, 50);
                break;
            case 'wallTriangle':
                wall = createTriangleWall(x, y, 120, rotation);
                break;
            case 'wallHexagon':
                wall = createHexagonWall(x, y, 100, rotation);
                break;
        }
        
        console.log(`Created random ${wallType} at (${x.toFixed(1)}, ${y.toFixed(1)})`);
    }
    
    // 5. Create 1 anti-gravity zone at a random position
    const agX = margin + Math.random() * (canvasWidth - 2 * margin);
    const agY = margin + Math.random() * (canvasHeight - 2 * margin);
    // Anti-gravity zones are always created with 0 rotation (locked)
    createAntiGravityZone(agX, agY, 0);
    console.log(`Created anti-gravity zone at (${agX.toFixed(1)}, ${agY.toFixed(1)})`);
    
    // 6. Grant all dragging permissions
    draggingPermissions.multiplierZone = true;
    draggingPermissions.levelUpZone = true;
    draggingPermissions.cashZone = true;
    draggingPermissions.antiGravityZone = true;
    draggingPermissions.portalIn = true;
    draggingPermissions.portalOut = true;
    console.log('Granted all dragging permissions');
    
    // 7. Grant all resizing permissions
    resizingPermissions.antiGravityZone = true;
    console.log('Granted all resizing permissions');
    
    console.log('Debug: Upgrade Max complete!');
}

// Debug money button
const debugMoneyButton = document.getElementById('debugMoneyButton');
debugMoneyButton.addEventListener('click', () => {
    wallet.money += 100000;
    updateMoneyDisplay();
    console.log(`Debug: Added $100,000 to wallet. New total: $${wallet.money}`);
});

// Upgrade max button
const upgradeMaxButton = document.getElementById('upgradeMaxButton');
upgradeMaxButton.addEventListener('click', () => {
    upgradeMaxDebug();
});




// Drop button event listener
dropButton.addEventListener('click', () => {
    isDropped = !isDropped;
    
    if (isDropped) {
        // Remove the tank bottom wall
        World.remove(world, tankWall);
        dropButton.textContent = 'Replace Floor';
        dropButton.style.background = '#2ed573'; // Green when floor is dropped
    } else {
        // Add the tank bottom wall back
        World.add(world, tankWall);
        dropButton.textContent = 'Drop';
        dropButton.style.background = '#ff4757'; // Red when floor is present
    }
});

// Drop 10 button event listener
drop10Button.addEventListener('click', () => {
    if (isPaused) return;
    
    // Don't allow dropping if modal is open or placing item
    if (isModalOpen || isPlacingItem) {
        return;
    }
    
    if (isStuck) {
        // Force clear balls - turn will be incremented when button becomes ready
        forceClearBalls();
    } else if (isDropButtonEnabled) {
        // Normal turn - drop balls using current count (don't increment turn here)
        
        // Reset stuck state for new turn
        isStuck = false;
        lastBallDeletionTime = 0;
        
        // Track money at the start of this turn
        turnStartMoney = wallet.money;
        
        dropBalls(currentBallCount);
        
        // Set initial time for stuck detection (when balls are first dropped)
        lastBallDeletionTime = Date.now(); // Start counting from when balls are dropped
        
        // Immediately disable the button since balls are now active
        updateDropButtonState();
    }
});

// Drop test button event listener
dropTestButton.addEventListener('click', () => {
    if (isPaused) return;
    
    // Don't allow dropping if modal is open or placing item
    if (isModalOpen || isPlacingItem) {
        return;
    }
    
    const hasTestBalls = hasTestBallsOnCanvas();
    
    // If we have test balls, end the test
    if (hasTestBalls) {
        // Clear only test balls (don't affect turn system)
        endTest();
        return;
    }
    
    // Drop test balls using current ball count
    dropTestBalls();
});

// Wall tool button event listener
wallToolButton.addEventListener('click', () => {
    if (wallDrawingMode) {
        // Toggle off wall drawing mode
        wallDrawingMode = false;
        wallToolButton.textContent = 'Wall Drawing Tool';
        wallToolButton.style.background = '#ffa502';
        wallControls.style.display = 'none';
        canvas.style.cursor = 'crosshair';
    } else {
        // Exit all other modes first
        exitAllModes();
        
        // Enter wall drawing mode
        wallDrawingMode = true;
        wallToolButton.textContent = 'Exit Wall Tool';
        wallToolButton.style.background = '#ff6b6b';
        wallControls.style.display = 'block';
        canvas.style.cursor = 'crosshair';
    }
});

// Multiplier tool button event listener
multiplierToolButton.addEventListener('click', () => {
    if (multiplierPlacementMode) {
        // Toggle off multiplier placement mode
        multiplierPlacementMode = false;
        multiplierToolButton.textContent = 'Multiplier Zone Tool';
        multiplierToolButton.style.background = '#9c88ff';
        multiplierFactorDisplay.style.display = 'none';
        canvas.style.cursor = 'crosshair';
    } else {
        // Exit all other modes first
        exitAllModes();
        
        // Enter multiplier placement mode
        multiplierPlacementMode = true;
        multiplierToolButton.textContent = 'Exit Multiplier Tool';
        multiplierToolButton.style.background = '#ff6b6b';
        multiplierFactorDisplay.style.display = 'block';
        canvas.style.cursor = 'none';
    }
});

// Remover tool button event listener
removerToolButton.addEventListener('click', () => {
    if (removerMode) {
        // Toggle off remover mode
        removerMode = false;
        removerToolButton.textContent = 'Remover Tool';
        removerToolButton.style.background = '#ff4757';
        canvas.style.cursor = 'crosshair';
    } else {
        // Exit all other modes first
        exitAllModes();
        
        // Enter remover mode
        removerMode = true;
        removerToolButton.textContent = 'Exit Remover Tool';
        removerToolButton.style.background = '#ff6b6b';
        canvas.style.cursor = 'crosshair';
    }
});

// Portal tool button event listener
portalToolButton.addEventListener('click', () => {
    if (portalMode) {
        // Toggle off portal mode
        portalMode = false;
        portalToolButton.textContent = 'Portal Tool';
        portalToolButton.style.background = '#00b894';
        canvas.style.cursor = 'crosshair';
    } else {
        // Exit all other modes first
        exitAllModes();
        
        // Enter portal mode
        portalMode = true;
        portalToolButton.textContent = 'Exit Portal Tool';
        portalToolButton.style.background = '#ff6b6b';
        canvas.style.cursor = 'none';
    }
});

// Cash tool button event listener
cashToolButton.addEventListener('click', () => {
    if (cashMode) {
        // Toggle off cash mode
        cashMode = false;
        cashToolButton.textContent = 'Cash Zone Tool';
        cashToolButton.style.background = '#2ed573';
        canvas.style.cursor = 'crosshair';
    } else {
        // Exit all other modes first
        exitAllModes();
        
        // Enter cash mode
        cashMode = true;
        cashToolButton.textContent = 'Exit Cash Tool';
        cashToolButton.style.background = '#ff6b6b';
        canvas.style.cursor = 'none';
    }
});

// Level up tool button event listener
levelUpToolButton.addEventListener('click', () => {
    if (levelUpMode) {
        // Toggle off level up mode
        levelUpMode = false;
        levelUpToolButton.textContent = 'Level Up Zone Tool';
        levelUpToolButton.style.background = '#ff6b35';
        canvas.style.cursor = 'crosshair';
    } else {
        // Exit all other modes first
        exitAllModes();
        
        // Enter level up mode
        levelUpMode = true;
        levelUpToolButton.textContent = 'Exit Level Up Tool';
        levelUpToolButton.style.background = '#ff6b6b';
        canvas.style.cursor = 'none';
    }
});

antiGravityToolButton.addEventListener('click', () => {
    if (antiGravityMode) {
        // Toggle off anti-gravity mode
        antiGravityMode = false;
        antiGravityToolButton.textContent = 'Anti-Gravity Zone Tool';
        antiGravityToolButton.style.background = '#ff00ff';
        canvas.style.cursor = 'crosshair';
    } else {
        // Exit all other modes first
        exitAllModes();
        
        // Enter anti-gravity mode
        antiGravityMode = true;
        antiGravityToolButton.textContent = 'Exit Anti-Gravity Tool';
        antiGravityToolButton.style.background = '#ff6b6b';
        canvas.style.cursor = 'none';
    }
});

// Old item button event listeners removed - now using modal system

// Multiplier factor slider event listener
multiplierSlider.addEventListener('input', (e) => {
    multiplierFactor = parseInt(e.target.value);
    multiplierValue.textContent = multiplierFactor;
});


// Multiplier shop button event listeners - DISABLED (buttons don't exist in HTML)
// if (mult2xButton) {
//     mult2xButton.addEventListener('click', () => {
//     if (multiplierShopMode && selectedMultiplierFactor === 2) {
//         // Toggle off if already in 2x multiplier mode
//         multiplierShopMode = false;
//         canvas.style.cursor = 'crosshair';
//     } else {
//         // Exit all other modes first
//         exitAllModes();
//         
//         // Enter 2x multiplier mode
//         multiplierShopMode = true;
//         selectedMultiplierFactor = 2;
//         canvas.style.cursor = 'none';
//     }
//     });
// }

// if (mult3xButton) {
//     mult3xButton.addEventListener('click', () => {
//     if (multiplierShopMode && selectedMultiplierFactor === 3) {
//         // Toggle off if already in 3x multiplier mode
//         multiplierShopMode = false;
//         canvas.style.cursor = 'crosshair';
//     } else {
//         // Exit all other modes first
//         exitAllModes();
//         
//         // Enter 3x multiplier mode
//         multiplierShopMode = true;
//         selectedMultiplierFactor = 3;
//         canvas.style.cursor = 'none';
//     }
//     });
// }

// if (mult4xButton) {
//     mult4xButton.addEventListener('click', () => {
//     if (multiplierShopMode && selectedMultiplierFactor === 4) {
//         // Toggle off if already in 4x multiplier mode
//         multiplierShopMode = true;
//         selectedMultiplierFactor = 4;
//         canvas.style.cursor = 'none';
//     }
//     });
// }



}); // End of DOMContentLoaded event listener


// Click handler for spawning circles or starting wall/multiplier/portal drawing
canvas.addEventListener('mousedown', function(event) {
    if (isPaused) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Check if clicking on a wall or any zone for dragging (only when not in any tool mode and no balls are active)
    if (!removerMode && !wallDrawingMode && !multiplierPlacementMode && !portalMode && !cashMode && !levelUpMode && !currentItemMode) {
        // Don't allow dragging if there are any balls (test or regular) on the canvas
        if (hasBallsOnCanvas()) {
            return;
        }
        
        const wall = findWallAt(x, y);
        if (wall) {
            // Start dragging the wall
            isDraggingWall = true;
            draggedWall = wall;
            dragOffsetX = x - wall.position.x;
            dragOffsetY = y - wall.position.y;
            return;
        }
        
        // Check for anti-gravity zone edge resizing first (if permission is granted)
        const edgeResult = findAntiGravityZoneEdgeAt(x, y);
        if (edgeResult) {
            // Start resizing the anti-gravity zone
            isResizingAntiGravityZone = true;
            resizedAntiGravityZone = edgeResult.zone;
            resizeEdge = edgeResult.edge;
            resizeStartX = x;
            resizeStartY = y;
            resizeStartWidth = edgeResult.zone.width;
            resizeStartHeight = edgeResult.zone.height;
            resizeStartCenterX = edgeResult.zone.centerX;
            resizeStartCenterY = edgeResult.zone.centerY;
            return;
        }
        
        const antiGravityZone = findAntiGravityZoneAt(x, y);
        if (antiGravityZone) {
            // Start dragging the anti-gravity zone (no permission required)
            isDraggingAntiGravityZone = true;
            draggedAntiGravityZone = antiGravityZone;
            antiGravityZoneDragOffsetX = x - antiGravityZone.centerX;
            antiGravityZoneDragOffsetY = y - antiGravityZone.centerY;
            // Initialize last valid position to current position
            antiGravityZoneLastValidPosition.x = antiGravityZone.centerX;
            antiGravityZoneLastValidPosition.y = antiGravityZone.centerY;
            return;
        }
        
        const multiplierZone = findMultiplierZoneAt(x, y);
        if (multiplierZone) {
            // Check if player has permission to drag multiplier zones
            if (!draggingPermissions.multiplierZone) {
                return; // No permission to drag
            }
            // Start dragging the multiplier zone
            isDraggingMultiplierZone = true;
            draggedMultiplierZone = multiplierZone;
            multiplierZoneDragOffsetX = x - multiplierZone.centerX;
            multiplierZoneDragOffsetY = y - multiplierZone.centerY;
            // Initialize last valid position to current position
            multiplierZoneLastValidPosition.x = multiplierZone.centerX;
            multiplierZoneLastValidPosition.y = multiplierZone.centerY;
            return;
        }
        
        const portalZone = findPortalZoneAt(x, y);
        if (portalZone) {
            // Check if player has permission to drag portal zones
            const hasPermission = (portalZone.color === 'blue' && draggingPermissions.portalIn) || 
                                 (portalZone.color === 'orange' && draggingPermissions.portalOut);
            if (!hasPermission) {
                return; // No permission to drag this portal type
            }
            // Start dragging the portal zone
            isDraggingPortalZone = true;
            draggedPortalZone = portalZone;
            portalZoneDragOffsetX = x - portalZone.centerX;
            portalZoneDragOffsetY = y - portalZone.centerY;
            // Initialize last valid position to current position
            portalZoneLastValidPosition.x = portalZone.centerX;
            portalZoneLastValidPosition.y = portalZone.centerY;
            return;
        }
        
        const cashZone = findCashZoneAt(x, y);
        if (cashZone) {
            // Check if player has permission to drag cash zones
            if (!draggingPermissions.cashZone) {
                return; // No permission to drag
            }
            // Start dragging the cash zone
            isDraggingCashZone = true;
            draggedCashZone = cashZone;
            cashZoneDragOffsetX = x - cashZone.centerX;
            cashZoneDragOffsetY = y - cashZone.centerY;
            // Initialize last valid position to current position
            cashZoneLastValidPosition.x = cashZone.centerX;
            cashZoneLastValidPosition.y = cashZone.centerY;
            return;
        }
        
        const levelUpZone = findLevelUpZoneAt(x, y);
        if (levelUpZone) {
            // Check if player has permission to drag level up zones
            if (!draggingPermissions.levelUpZone) {
                return; // No permission to drag
            }
            // Start dragging the level up zone
            isDraggingLevelUpZone = true;
            draggedLevelUpZone = levelUpZone;
            levelUpZoneDragOffsetX = x - levelUpZone.centerX;
            levelUpZoneDragOffsetY = y - levelUpZone.centerY;
            // Initialize last valid position to current position
            levelUpZoneLastValidPosition.x = levelUpZone.centerX;
            levelUpZoneLastValidPosition.y = levelUpZone.centerY;
            return;
        }
    }
    
    if (removerMode) {
        // Remove object at click point
        removeObjectAt(x, y);
    } else if (wallDrawingMode) {
        // Start drawing a wall
        isDrawingWall = true;
        wallStartX = x;
        wallStartY = y;
        wallEndX = x;
        wallEndY = y;
    } else if (multiplierPlacementMode) {
        // Place a multiplier zone at the click point
        createMultiplierZone(x, y, multiplierFactor);
    } else if (portalMode) {
        // Place a portal zone at the click point (left click = blue, right click = orange)
        if (event.button === 0) { // Left click
            createPortalZone(x, y, 'blue');
        } else if (event.button === 2) { // Right click
            createPortalZone(x, y, 'orange');
        }
    } else if (cashMode) {
        // Place a cash zone at the click point
        createCashZone(x, y);
    } else if (levelUpMode) {
        // Place a level up zone at the click point
        createLevelUpZone(x, y);
    } else if (antiGravityMode) {
        // Place an anti-gravity zone at the click point
        createAntiGravityZone(x, y);
    } else if (currentItemMode === 'wallSquare') {
        // Place a square wall item at the click point
        placeSquareWallItem(x, y);
    } else if (currentItemMode === 'wallCircle') {
        // Place a circle wall item at the click point
        placeCircleWallItem(x, y);
    } else if (currentItemMode === 'wallTriangle') {
        // Place a triangle wall item at the click point
        placeTriangleWallItem(x, y);
    } else if (currentItemMode === 'wallHexagon') {
        // Place a hexagon wall item at the click point
        placeHexagonWallItem(x, y);
    } else if (currentItemMode === 'cash') {
        // Zone items now upgrade existing zones automatically - no click placement needed
    } else if (currentItemMode === 'multiplier') {
        // Zone items now upgrade existing zones automatically - no click placement needed
    } else if (currentItemMode === 'levelUp') {
        // Zone items now upgrade existing zones automatically - no click placement needed
    }
});

// Mouse enter handler
canvas.addEventListener('mouseenter', function() {
    isMouseOnCanvas = true;
});

// Mouse leave handler
canvas.addEventListener('mouseleave', function() {
    // Don't set isMouseOnCanvas to false if we're in placement mode
    // This prevents flickering of red circles during item placement
    if (!isPlacingItem) {
        isMouseOnCanvas = false;
    }
    hoveredWall = null;
    hoveredMultiplierZone = null;
    hoveredPortalZone = null;
    hoveredCashZone = null;
    hoveredLevelUpZone = null;
});

// Mouse move handler for wall drawing preview and cursor tracking
canvas.addEventListener('mousemove', function(event) {
    if (isPaused) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Always track mouse position for cursor preview
    mouseX = x;
    mouseY = y;
    
    // Handle wall dragging
    if (isDraggingWall && draggedWall) {
        // Update wall position
        const newX = x - dragOffsetX;
        const newY = y - dragOffsetY;
        
        // Update the wall's position in Matter.js
        Matter.Body.setPosition(draggedWall, { x: newX, y: newY });
        
        // Update cursor to show dragging
        canvas.style.cursor = 'grabbing';
        return;
    }
    
    // Handle anti-gravity zone resizing
    if (isResizingAntiGravityZone && resizedAntiGravityZone) {
        const zone = resizedAntiGravityZone;
        const minSize = 20; // Minimum zone dimension
        
        let newWidth = zone.width;
        let newHeight = zone.height;
        let newCenterX = zone.centerX;
        let newCenterY = zone.centerY;
        
        const deltaX = x - resizeStartX;
        const deltaY = y - resizeStartY;
        
        // Update dimensions and position based on which edge is being dragged
        if (resizeEdge === 'left') {
            newWidth = Math.max(minSize, resizeStartWidth - deltaX);
            newCenterX = resizeStartCenterX + (resizeStartWidth - newWidth) / 2;
        } else if (resizeEdge === 'right') {
            newWidth = Math.max(minSize, resizeStartWidth + deltaX);
            newCenterX = resizeStartCenterX + (newWidth - resizeStartWidth) / 2;
        } else if (resizeEdge === 'top') {
            newHeight = Math.max(minSize, resizeStartHeight - deltaY);
            newCenterY = resizeStartCenterY + (resizeStartHeight - newHeight) / 2;
        } else if (resizeEdge === 'bottom') {
            newHeight = Math.max(minSize, resizeStartHeight + deltaY);
            newCenterY = resizeStartCenterY + (newHeight - resizeStartHeight) / 2;
        }
        
        // Update zone properties
        zone.width = newWidth;
        zone.height = newHeight;
        zone.centerX = newCenterX;
        zone.centerY = newCenterY;
        zone.x1 = newCenterX - newWidth / 2;
        zone.y1 = newCenterY - newHeight / 2;
        zone.x2 = newCenterX + newWidth / 2;
        zone.y2 = newCenterY + newHeight / 2;
        
        // Update the Matter.js body
        World.remove(world, zone.body);
        const newBody = Bodies.rectangle(newCenterX, newCenterY, newWidth, newHeight, {
            isStatic: true,
            isSensor: true,
            angle: zone.rotation || 0,
            render: {
                visible: false
            }
        });
        zone.body = newBody;
        World.add(world, newBody);
        
        // Set cursor based on resize edge
        if (resizeEdge === 'left' || resizeEdge === 'right') {
            canvas.style.cursor = 'ew-resize';
        } else {
            canvas.style.cursor = 'ns-resize';
        }
        return;
    }
    
    // Handle anti-gravity zone dragging
    if (isDraggingAntiGravityZone && draggedAntiGravityZone) {
        // Update anti-gravity zone position
        const newCenterX = x - antiGravityZoneDragOffsetX;
        const newCenterY = y - antiGravityZoneDragOffsetY;
        
        // Always update the zone's position properties (allow free movement)
        draggedAntiGravityZone.centerX = newCenterX;
        draggedAntiGravityZone.centerY = newCenterY;
        draggedAntiGravityZone.x1 = newCenterX - draggedAntiGravityZone.width / 2;
        draggedAntiGravityZone.y1 = newCenterY - draggedAntiGravityZone.height / 2;
        draggedAntiGravityZone.x2 = newCenterX + draggedAntiGravityZone.width / 2;
        draggedAntiGravityZone.y2 = newCenterY + draggedAntiGravityZone.height / 2;
        
        // Update the Matter.js body position
        Matter.Body.setPosition(draggedAntiGravityZone.body, { x: newCenterX, y: newCenterY });
        
        // Check if the new position is valid and update last valid position
        if (canPlaceDraggedZone(newCenterX, newCenterY, draggedAntiGravityZone, 'antiGravity')) {
            // Update last valid position
            antiGravityZoneLastValidPosition.x = newCenterX;
            antiGravityZoneLastValidPosition.y = newCenterY;
            
            // Update cursor to show dragging
            canvas.style.cursor = 'grabbing';
        } else {
            // Invalid position - show not-allowed cursor
            canvas.style.cursor = 'not-allowed';
        }
        return;
    }
    
    // Handle multiplier zone dragging
    if (isDraggingMultiplierZone && draggedMultiplierZone) {
        // Update multiplier zone position
        const newCenterX = x - multiplierZoneDragOffsetX;
        const newCenterY = y - multiplierZoneDragOffsetY;
        
        // Always update the zone's position properties (allow free movement)
        draggedMultiplierZone.centerX = newCenterX;
        draggedMultiplierZone.centerY = newCenterY;
        draggedMultiplierZone.x1 = newCenterX - draggedMultiplierZone.width / 2;
        draggedMultiplierZone.y1 = newCenterY - draggedMultiplierZone.height / 2;
        draggedMultiplierZone.x2 = newCenterX + draggedMultiplierZone.width / 2;
        draggedMultiplierZone.y2 = newCenterY + draggedMultiplierZone.height / 2;
        
        // Update the Matter.js body position
        Matter.Body.setPosition(draggedMultiplierZone.body, { x: newCenterX, y: newCenterY });
        
        // Check if the new position is valid and update last valid position
        if (canPlaceDraggedZone(newCenterX, newCenterY, draggedMultiplierZone, 'multiplier')) {
            // Update last valid position
            multiplierZoneLastValidPosition.x = newCenterX;
            multiplierZoneLastValidPosition.y = newCenterY;
            
            // Update cursor to show dragging
            canvas.style.cursor = 'grabbing';
        } else {
            // Invalid position - show not-allowed cursor
            canvas.style.cursor = 'not-allowed';
        }
        return;
    }
    
    // Handle portal zone dragging
    if (isDraggingPortalZone && draggedPortalZone) {
        // Update portal zone position
        const newCenterX = x - portalZoneDragOffsetX;
        const newCenterY = y - portalZoneDragOffsetY;
        
        // Always update the zone's position properties (allow free movement)
        draggedPortalZone.centerX = newCenterX;
        draggedPortalZone.centerY = newCenterY;
        draggedPortalZone.x1 = newCenterX - draggedPortalZone.width / 2;
        draggedPortalZone.y1 = newCenterY - draggedPortalZone.height / 2;
        draggedPortalZone.x2 = newCenterX + draggedPortalZone.width / 2;
        draggedPortalZone.y2 = newCenterY + draggedPortalZone.height / 2;
        
        // Update the Matter.js body position
        Matter.Body.setPosition(draggedPortalZone.body, { x: newCenterX, y: newCenterY });
        
        // Check if the new position is valid and update last valid position
        if (canPlaceDraggedZone(newCenterX, newCenterY, draggedPortalZone, 'portal')) {
            // Update last valid position
            portalZoneLastValidPosition.x = newCenterX;
            portalZoneLastValidPosition.y = newCenterY;
            
            // Update cursor to show dragging
            canvas.style.cursor = 'grabbing';
        } else {
            // Invalid position - show not-allowed cursor
            canvas.style.cursor = 'not-allowed';
        }
        return;
    }
    
    // Handle cash zone dragging
    if (isDraggingCashZone && draggedCashZone) {
        // Update cash zone position
        const newCenterX = x - cashZoneDragOffsetX;
        const newCenterY = y - cashZoneDragOffsetY;
        
        // Always update the zone's position properties (allow free movement)
        draggedCashZone.centerX = newCenterX;
        draggedCashZone.centerY = newCenterY;
        draggedCashZone.x1 = newCenterX - draggedCashZone.width / 2;
        draggedCashZone.y1 = newCenterY - draggedCashZone.height / 2;
        draggedCashZone.x2 = newCenterX + draggedCashZone.width / 2;
        draggedCashZone.y2 = newCenterY + draggedCashZone.height / 2;
        
        // Update the Matter.js body position
        Matter.Body.setPosition(draggedCashZone.body, { x: newCenterX, y: newCenterY });
        
        // Check if the new position is valid and update last valid position
        if (canPlaceDraggedZone(newCenterX, newCenterY, draggedCashZone, 'cash')) {
            // Update last valid position
            cashZoneLastValidPosition.x = newCenterX;
            cashZoneLastValidPosition.y = newCenterY;
            
            // Update cursor to show dragging
            canvas.style.cursor = 'grabbing';
        } else {
            // Invalid position - show not-allowed cursor
            canvas.style.cursor = 'not-allowed';
        }
        return;
    }
    
    // Handle level up zone dragging
    if (isDraggingLevelUpZone && draggedLevelUpZone) {
        // Update level up zone position
        const newCenterX = x - levelUpZoneDragOffsetX;
        const newCenterY = y - levelUpZoneDragOffsetY;
        
        // Always update the zone's position properties (allow free movement)
        draggedLevelUpZone.centerX = newCenterX;
        draggedLevelUpZone.centerY = newCenterY;
        draggedLevelUpZone.x1 = newCenterX - draggedLevelUpZone.width / 2;
        draggedLevelUpZone.y1 = newCenterY - draggedLevelUpZone.height / 2;
        draggedLevelUpZone.x2 = newCenterX + draggedLevelUpZone.width / 2;
        draggedLevelUpZone.y2 = newCenterY + draggedLevelUpZone.height / 2;
        
        // Update the Matter.js body position
        Matter.Body.setPosition(draggedLevelUpZone.body, { x: newCenterX, y: newCenterY });
        
        // Check if the new position is valid and update last valid position
        if (canPlaceDraggedZone(newCenterX, newCenterY, draggedLevelUpZone, 'levelUp')) {
            // Update last valid position
            levelUpZoneLastValidPosition.x = newCenterX;
            levelUpZoneLastValidPosition.y = newCenterY;
            
            // Update cursor to show dragging
            canvas.style.cursor = 'grabbing';
        } else {
            // Invalid position - show not-allowed cursor
            canvas.style.cursor = 'not-allowed';
        }
        return;
    }
    
    // Update hover tracking for remover tool
    if (removerMode) {
        const hovered = getHoveredObject(x, y);
        if (hovered) {
            if (hovered.type === 'wall') {
                hoveredWall = hovered.object;
                hoveredMultiplierZone = null;
                hoveredPortalZone = null;
                hoveredCashZone = null;
                hoveredLevelUpZone = null;
            } else if (hovered.type === 'multiplier') {
                hoveredMultiplierZone = hovered.object;
                hoveredWall = null;
                hoveredPortalZone = null;
                hoveredCashZone = null;
                hoveredLevelUpZone = null;
            } else if (hovered.type === 'portal') {
                hoveredPortalZone = hovered.object;
                hoveredWall = null;
                hoveredMultiplierZone = null;
                hoveredCashZone = null;
                hoveredLevelUpZone = null;
            } else if (hovered.type === 'cash') {
                hoveredCashZone = hovered.object;
                hoveredWall = null;
                hoveredMultiplierZone = null;
                hoveredPortalZone = null;
                hoveredLevelUpZone = null;
            } else if (hovered.type === 'levelUp') {
                hoveredLevelUpZone = hovered.object;
                hoveredWall = null;
                hoveredMultiplierZone = null;
                hoveredPortalZone = null;
                hoveredCashZone = null;
            } else if (hovered.type === 'antiGravity') {
                hoveredAntiGravityZone = hovered.object;
                hoveredWall = null;
                hoveredMultiplierZone = null;
                hoveredPortalZone = null;
                hoveredCashZone = null;
                hoveredLevelUpZone = null;
            }
        } else {
            hoveredWall = null;
            hoveredMultiplierZone = null;
            hoveredPortalZone = null;
            hoveredCashZone = null;
            hoveredLevelUpZone = null;
            hoveredAntiGravityZone = null;
        }
    } else {
        hoveredWall = null;
        hoveredMultiplierZone = null;
        hoveredPortalZone = null;
        hoveredCashZone = null;
        hoveredLevelUpZone = null;
        hoveredAntiGravityZone = null;
        
        // Check if hovering over a wall or any zone for potential dragging
        const wall = findWallAt(x, y);
        const antiGravityZone = findAntiGravityZoneAt(x, y);
        const multiplierZone = findMultiplierZoneAt(x, y);
        const portalZone = findPortalZoneAt(x, y);
        const cashZone = findCashZoneAt(x, y);
        const levelUpZone = findLevelUpZoneAt(x, y);
        
        // Check if hovering over an edge for resizing
        const edgeResult = findAntiGravityZoneEdgeAt(x, y);
        if (edgeResult) {
            // Show resize cursor based on edge
            if (edgeResult.edge === 'left' || edgeResult.edge === 'right') {
                canvas.style.cursor = 'ew-resize';
            } else {
                canvas.style.cursor = 'ns-resize';
            }
        } else {
            // Check if any draggable object is found and if player has permission
            let canDrag = false;
            if (wall) {
                canDrag = true; // Walls are always draggable
            } else if (antiGravityZone) {
                canDrag = true;
            } else if (multiplierZone && draggingPermissions.multiplierZone) {
                canDrag = true;
            } else if (portalZone) {
                const hasPermission = (portalZone.color === 'blue' && draggingPermissions.portalIn) || 
                                     (portalZone.color === 'orange' && draggingPermissions.portalOut);
                if (hasPermission) canDrag = true;
            } else if (cashZone && draggingPermissions.cashZone) {
                canDrag = true;
            } else if (levelUpZone && draggingPermissions.levelUpZone) {
                canDrag = true;
            }
            
            canvas.style.cursor = canDrag ? 'grab' : 'crosshair';
        }
    }
    
    if (wallDrawingMode && isDrawingWall) {
        wallEndX = x;
        wallEndY = y;
    }
    
    // Update wall item preview position
    if (currentItemMode === 'wallSquare' || currentItemMode === 'wallCircle' || currentItemMode === 'wallTriangle' || currentItemMode === 'wallHexagon') {
        wallItemPreviewX = x;
        wallItemPreviewY = y;
    }
});

// Mouse up handler for completing wall drawing
canvas.addEventListener('mouseup', function(event) {
    if (isPaused) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Stop wall dragging
    if (isDraggingWall) {
        isDraggingWall = false;
        draggedWall = null;
        dragOffsetX = 0;
        dragOffsetY = 0;
        return;
    }
    
    // Stop anti-gravity zone resizing
    if (isResizingAntiGravityZone) {
        isResizingAntiGravityZone = false;
        resizedAntiGravityZone = null;
        resizeEdge = null;
        resizeStartX = 0;
        resizeStartY = 0;
        resizeStartWidth = 0;
        resizeStartHeight = 0;
        resizeStartCenterX = 0;
        resizeStartCenterY = 0;
        canvas.style.cursor = 'crosshair';
        return;
    }
    
    // Stop anti-gravity zone dragging
    if (isDraggingAntiGravityZone) {
        // Check if final position is valid, if not snap back to last valid position
        if (draggedAntiGravityZone && !canPlaceDraggedZone(draggedAntiGravityZone.centerX, draggedAntiGravityZone.centerY, draggedAntiGravityZone, 'antiGravity')) {
            // Snap back to last valid position
            draggedAntiGravityZone.centerX = antiGravityZoneLastValidPosition.x;
            draggedAntiGravityZone.centerY = antiGravityZoneLastValidPosition.y;
            draggedAntiGravityZone.x1 = antiGravityZoneLastValidPosition.x - draggedAntiGravityZone.width / 2;
            draggedAntiGravityZone.y1 = antiGravityZoneLastValidPosition.y - draggedAntiGravityZone.height / 2;
            draggedAntiGravityZone.x2 = antiGravityZoneLastValidPosition.x + draggedAntiGravityZone.width / 2;
            draggedAntiGravityZone.y2 = antiGravityZoneLastValidPosition.y + draggedAntiGravityZone.height / 2;
            
            // Update the Matter.js body position
            Matter.Body.setPosition(draggedAntiGravityZone.body, { x: antiGravityZoneLastValidPosition.x, y: antiGravityZoneLastValidPosition.y });
        }
        
        isDraggingAntiGravityZone = false;
        draggedAntiGravityZone = null;
        antiGravityZoneDragOffsetX = 0;
        antiGravityZoneDragOffsetY = 0;
        return;
    }
    
    // Stop multiplier zone dragging
    if (isDraggingMultiplierZone) {
        // Check if final position is valid, if not snap back to last valid position
        if (draggedMultiplierZone && !canPlaceDraggedZone(draggedMultiplierZone.centerX, draggedMultiplierZone.centerY, draggedMultiplierZone, 'multiplier')) {
            // Snap back to last valid position
            draggedMultiplierZone.centerX = multiplierZoneLastValidPosition.x;
            draggedMultiplierZone.centerY = multiplierZoneLastValidPosition.y;
            draggedMultiplierZone.x1 = multiplierZoneLastValidPosition.x - draggedMultiplierZone.width / 2;
            draggedMultiplierZone.y1 = multiplierZoneLastValidPosition.y - draggedMultiplierZone.height / 2;
            draggedMultiplierZone.x2 = multiplierZoneLastValidPosition.x + draggedMultiplierZone.width / 2;
            draggedMultiplierZone.y2 = multiplierZoneLastValidPosition.y + draggedMultiplierZone.height / 2;
            
            // Update the Matter.js body position
            Matter.Body.setPosition(draggedMultiplierZone.body, { x: multiplierZoneLastValidPosition.x, y: multiplierZoneLastValidPosition.y });
        }
        
        isDraggingMultiplierZone = false;
        draggedMultiplierZone = null;
        multiplierZoneDragOffsetX = 0;
        multiplierZoneDragOffsetY = 0;
        return;
    }
    
    // Stop portal zone dragging
    if (isDraggingPortalZone) {
        // Check if final position is valid, if not snap back to last valid position
        if (draggedPortalZone && !canPlaceDraggedZone(draggedPortalZone.centerX, draggedPortalZone.centerY, draggedPortalZone, 'portal')) {
            // Snap back to last valid position
            draggedPortalZone.centerX = portalZoneLastValidPosition.x;
            draggedPortalZone.centerY = portalZoneLastValidPosition.y;
            draggedPortalZone.x1 = portalZoneLastValidPosition.x - draggedPortalZone.width / 2;
            draggedPortalZone.y1 = portalZoneLastValidPosition.y - draggedPortalZone.height / 2;
            draggedPortalZone.x2 = portalZoneLastValidPosition.x + draggedPortalZone.width / 2;
            draggedPortalZone.y2 = portalZoneLastValidPosition.y + draggedPortalZone.height / 2;
            
            // Update the Matter.js body position
            Matter.Body.setPosition(draggedPortalZone.body, { x: portalZoneLastValidPosition.x, y: portalZoneLastValidPosition.y });
        }
        
        isDraggingPortalZone = false;
        draggedPortalZone = null;
        portalZoneDragOffsetX = 0;
        portalZoneDragOffsetY = 0;
        return;
    }
    
    // Stop cash zone dragging
    if (isDraggingCashZone) {
        // Check if final position is valid, if not snap back to last valid position
        if (draggedCashZone && !canPlaceDraggedZone(draggedCashZone.centerX, draggedCashZone.centerY, draggedCashZone, 'cash')) {
            // Snap back to last valid position
            draggedCashZone.centerX = cashZoneLastValidPosition.x;
            draggedCashZone.centerY = cashZoneLastValidPosition.y;
            draggedCashZone.x1 = cashZoneLastValidPosition.x - draggedCashZone.width / 2;
            draggedCashZone.y1 = cashZoneLastValidPosition.y - draggedCashZone.height / 2;
            draggedCashZone.x2 = cashZoneLastValidPosition.x + draggedCashZone.width / 2;
            draggedCashZone.y2 = cashZoneLastValidPosition.y + draggedCashZone.height / 2;
            
            // Update the Matter.js body position
            Matter.Body.setPosition(draggedCashZone.body, { x: cashZoneLastValidPosition.x, y: cashZoneLastValidPosition.y });
        }
        
        isDraggingCashZone = false;
        draggedCashZone = null;
        cashZoneDragOffsetX = 0;
        cashZoneDragOffsetY = 0;
        return;
    }
    
    // Stop level up zone dragging
    if (isDraggingLevelUpZone) {
        // Check if final position is valid, if not snap back to last valid position
        if (draggedLevelUpZone && !canPlaceDraggedZone(draggedLevelUpZone.centerX, draggedLevelUpZone.centerY, draggedLevelUpZone, 'levelUp')) {
            // Snap back to last valid position
            draggedLevelUpZone.centerX = levelUpZoneLastValidPosition.x;
            draggedLevelUpZone.centerY = levelUpZoneLastValidPosition.y;
            draggedLevelUpZone.x1 = levelUpZoneLastValidPosition.x - draggedLevelUpZone.width / 2;
            draggedLevelUpZone.y1 = levelUpZoneLastValidPosition.y - draggedLevelUpZone.height / 2;
            draggedLevelUpZone.x2 = levelUpZoneLastValidPosition.x + draggedLevelUpZone.width / 2;
            draggedLevelUpZone.y2 = levelUpZoneLastValidPosition.y + draggedLevelUpZone.height / 2;
            
            // Update the Matter.js body position
            Matter.Body.setPosition(draggedLevelUpZone.body, { x: levelUpZoneLastValidPosition.x, y: levelUpZoneLastValidPosition.y });
        }
        
        isDraggingLevelUpZone = false;
        draggedLevelUpZone = null;
        levelUpZoneDragOffsetX = 0;
        levelUpZoneDragOffsetY = 0;
        return;
    }
    
    if (wallDrawingMode && isDrawingWall) {
        wallEndX = x;
        wallEndY = y;
        
        // Create wall if it's long enough
        const distance = Math.sqrt((wallEndX - wallStartX) ** 2 + (wallEndY - wallStartY) ** 2);
        if (distance > 10) { // Minimum wall length
            createWall(wallStartX, wallStartY, wallEndX, wallEndY);
        }
        
        isDrawingWall = false;
    }
});

// Right-click handler for custom functionality
canvas.addEventListener('mousedown', function(event) {
    if (event.button === 2) { // Right mouse button
        if (isPaused) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Add your right-click functionality here
        // For example, you could spawn a special ball or trigger a special action
        console.log('Right-clicked at:', x, y);
        
        // Example: Create a special ball on right-click
        // createCircle(x, y);
    }
});

// Mouse wheel handler for wall item and zone item rotation
canvas.addEventListener('wheel', function(event) {
    if (isPaused) return;
    
    // Handle wheel events when dragging a wall
    if (isDraggingWall && draggedWall) {
        event.preventDefault();
        
        // Adjust rotation based on wheel direction
        const rotationStep = 0.1; // radians (about 5.7 degrees)
        let newAngle = draggedWall.angle;
        
        if (event.deltaY < 0) {
            // Scroll up - increase rotation
            newAngle += rotationStep;
        } else {
            // Scroll down - decrease rotation
            newAngle -= rotationStep;
        }
        
        // Keep rotation between 0 and 2π
        newAngle = ((newAngle % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
        
        // Update the wall's rotation
        Matter.Body.setAngle(draggedWall, newAngle);
        return;
    }
    
    // Anti-gravity zones cannot be rotated - rotation is locked at 0
    // (Resizing and moving are still allowed)
    
    // Handle wheel events when dragging a multiplier zone
    if (isDraggingMultiplierZone && draggedMultiplierZone) {
        event.preventDefault();
        
        // Adjust rotation based on wheel direction
        const rotationStep = 0.1; // radians (about 5.7 degrees)
        let newAngle = draggedMultiplierZone.rotation;
        
        if (event.deltaY < 0) {
            // Scroll up - increase rotation
            newAngle += rotationStep;
        } else {
            // Scroll down - decrease rotation
            newAngle -= rotationStep;
        }
        
        // Keep rotation between 0 and 2π
        newAngle = ((newAngle % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
        
        // Update the zone's rotation
        draggedMultiplierZone.rotation = newAngle;
        Matter.Body.setAngle(draggedMultiplierZone.body, newAngle);
        return;
    }
    
    // Handle wheel events when dragging a portal zone
    if (isDraggingPortalZone && draggedPortalZone) {
        event.preventDefault();
        
        // Adjust rotation based on wheel direction
        const rotationStep = 0.1; // radians (about 5.7 degrees)
        let newAngle = draggedPortalZone.rotation;
        
        if (event.deltaY < 0) {
            // Scroll up - increase rotation
            newAngle += rotationStep;
        } else {
            // Scroll down - decrease rotation
            newAngle -= rotationStep;
        }
        
        // Keep rotation between 0 and 2π
        newAngle = ((newAngle % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
        
        // Update the zone's rotation
        draggedPortalZone.rotation = newAngle;
        Matter.Body.setAngle(draggedPortalZone.body, newAngle);
        return;
    }
    
    // Handle wheel events when dragging a cash zone
    if (isDraggingCashZone && draggedCashZone) {
        event.preventDefault();
        
        // Adjust rotation based on wheel direction
        const rotationStep = 0.1; // radians (about 5.7 degrees)
        let newAngle = draggedCashZone.rotation;
        
        if (event.deltaY < 0) {
            // Scroll up - increase rotation
            newAngle += rotationStep;
        } else {
            // Scroll down - decrease rotation
            newAngle -= rotationStep;
        }
        
        // Keep rotation between 0 and 2π
        newAngle = ((newAngle % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
        
        // Update the zone's rotation
        draggedCashZone.rotation = newAngle;
        Matter.Body.setAngle(draggedCashZone.body, newAngle);
        return;
    }
    
    // Handle wheel events when dragging a level up zone
    if (isDraggingLevelUpZone && draggedLevelUpZone) {
        event.preventDefault();
        
        // Adjust rotation based on wheel direction
        const rotationStep = 0.1; // radians (about 5.7 degrees)
        let newAngle = draggedLevelUpZone.rotation;
        
        if (event.deltaY < 0) {
            // Scroll up - increase rotation
            newAngle += rotationStep;
        } else {
            // Scroll down - decrease rotation
            newAngle -= rotationStep;
        }
        
        // Keep rotation between 0 and 2π
        newAngle = ((newAngle % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
        
        // Update the zone's rotation
        draggedLevelUpZone.rotation = newAngle;
        Matter.Body.setAngle(draggedLevelUpZone.body, newAngle);
        return;
    }
    
    // Handle wheel events when in wall item mode
    if (currentItemMode === 'wallSquare' || currentItemMode === 'wallTriangle' || currentItemMode === 'wallHexagon') {
        event.preventDefault();
        
        // Adjust rotation based on wheel direction
        const rotationStep = 0.1; // radians (about 5.7 degrees)
        if (event.deltaY < 0) {
            // Scroll up - increase rotation
            wallItemRotation += rotationStep;
        } else {
            // Scroll down - decrease rotation
            wallItemRotation -= rotationStep;
        }
        
        // Keep rotation between 0 and 2π
        wallItemRotation = ((wallItemRotation % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
    }
    // Handle wheel events when in zone item mode
    else if (currentItemMode === 'cash' || currentItemMode === 'multiplier' || currentItemMode === 'levelUp' || currentItemMode === 'antiGravity') {
        event.preventDefault();
        
        // Adjust rotation based on wheel direction
        const rotationStep = 0.1; // radians (about 5.7 degrees)
        if (event.deltaY < 0) {
            // Scroll up - increase rotation
            zoneItemRotation += rotationStep;
        } else {
            // Scroll down - decrease rotation
            zoneItemRotation -= rotationStep;
        }
        
        // Keep rotation between 0 and 2π
        zoneItemRotation = ((zoneItemRotation % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
    }
});

// FPS calculation
function calculateFPS(currentTime) {
    frameCount++;
    if (currentTime - lastTime >= 1000) {
        fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        fpsCounter.textContent = fps;
        frameCount = 0;
        lastTime = currentTime;
    }
}

// Render function
function render() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw first test ball path
    if (firstTestBallPath.length > 1) {
        ctx.strokeStyle = 'rgba(255, 107, 107, 0.6)'; // Semi-transparent red matching test ball color
        ctx.lineWidth = 2;
        
        // Draw path in segments to avoid connecting portal teleportation jumps
        ctx.beginPath();
        ctx.moveTo(firstTestBallPath[0].x, firstTestBallPath[0].y);
        
        for (let i = 1; i < firstTestBallPath.length; i++) {
            const prev = firstTestBallPath[i - 1];
            const curr = firstTestBallPath[i];
            
            // Calculate distance between consecutive points
            const dx = curr.x - prev.x;
            const dy = curr.y - prev.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // If distance is too large (likely a portal jump), start a new segment
            if (distance > 100) {
                // Finish current segment
                ctx.stroke();
                // Start new segment
                ctx.beginPath();
                ctx.moveTo(curr.x, curr.y);
            } else {
                ctx.lineTo(curr.x, curr.y);
            }
        }
        
        ctx.stroke();
    }
    
    // Draw all bodies
    const bodies = Matter.Composite.allBodies(world);
    
    bodies.forEach(body => {
        if (body.render.visible === false) return;
        
        // Skip sensor bodies (zones) - they're drawn manually
        if (body.isSensor) return;
        
        // Check if this wall is being hovered over in remover mode or being dragged
        const isHovered = removerMode && hoveredWall === body;
        const isDragged = isDraggingWall && draggedWall === body;
        
        ctx.beginPath();
        
        if (body.circleRadius) {
            // Draw circle
            ctx.arc(body.position.x, body.position.y, body.circleRadius, 0, 2 * Math.PI);
        } else {
            // Draw rectangle
            const vertices = body.vertices;
            ctx.moveTo(vertices[0].x, vertices[0].y);
            for (let i = 1; i < vertices.length; i++) {
                ctx.lineTo(vertices[i].x, vertices[i].y);
            }
            ctx.closePath();
        }
        
        // Fill with color - red if hovered in remover mode, blue if being dragged, original color otherwise
        if (isHovered) {
            ctx.fillStyle = COLORS.hover; // Red for hovered walls
        } else if (isDragged) {
            ctx.fillStyle = '#007bff'; // Blue for dragged walls
        } else {
            ctx.fillStyle = body.render.fillStyle || COLORS.wall;
        }
        ctx.fill();
        
        // Add border - thicker and colored if hovered or dragged
        if (isHovered) {
            ctx.strokeStyle = COLORS.hover;
            ctx.lineWidth = 4;
        } else if (isDragged) {
            ctx.strokeStyle = '#0056b3'; // Darker blue for dragged walls
            ctx.lineWidth = 4;
        } else {
            ctx.strokeStyle = COLORS.gray;
            ctx.lineWidth = 2;
        }
        ctx.stroke();
    });
    
    // Draw portal zones
    portalZones.forEach(zone => {
        // Calculate center of zone
        const centerX = (zone.x1 + zone.x2) / 2;
        const centerY = (zone.y1 + zone.y2) / 2;
        
        // Check if this zone is being hovered over in remover mode or being dragged
        const isHovered = removerMode && hoveredPortalZone === zone;
        const isDragged = isDraggingPortalZone && draggedPortalZone === zone;
        
        // Draw the zone rectangle
        ctx.beginPath();
        ctx.rect(zone.x1, zone.y1, zone.x2 - zone.x1, zone.y2 - zone.y1);
        
        // Set color based on portal type, hover state, and drag state
        if (isHovered) {
            ctx.fillStyle = `rgba(255, 71, 87, 0.5)`; // Red if hovered
        } else if (isDragged) {
            // Check if current position is valid
            const isValidPosition = canPlaceDraggedZone(centerX, centerY, zone, 'portal');
            if (isValidPosition) {
                ctx.fillStyle = zone.color === 'blue' ? 
                    'rgba(0, 123, 255, 0.6)' : 'rgba(255, 165, 0, 0.6)'; // Brighter when valid
            } else {
                ctx.fillStyle = 'rgba(255, 0, 0, 0.4)'; // Red tint when invalid
            }
        } else if (zone.color === 'blue') {
            ctx.fillStyle = ZONE_CONFIG.portal.colors.blue;
        } else {
            ctx.fillStyle = ZONE_CONFIG.portal.colors.orange;
        }
        ctx.fill();
        
        // Set border color
        if (isHovered) {
            ctx.strokeStyle = COLORS.hover; // Red if hovered
        } else if (isDragged) {
            // Check if current position is valid
            const isValidPosition = canPlaceDraggedZone(centerX, centerY, zone, 'portal');
            if (isValidPosition) {
                ctx.strokeStyle = zone.color === 'blue' ? '#007bff' : '#ffa500'; // Normal colors when valid
            } else {
                ctx.strokeStyle = '#ff0000'; // Red border when invalid
            }
        } else if (zone.color === 'blue') {
            ctx.strokeStyle = ZONE_CONFIG.portal.borders.blue;
        } else {
            ctx.strokeStyle = ZONE_CONFIG.portal.borders.orange;
        }
        ctx.lineWidth = (isHovered || isDragged) ? 3 : ZONE_CONFIG.portal.lineWidth;
        ctx.setLineDash(ZONE_CONFIG.portal.dash);
        ctx.stroke();
        ctx.setLineDash([]); // Reset line dash
        
        // Draw portal label text
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Draw black outline
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        const labelText = zone.color === 'blue' ? 'IN' : 'OUT';
        ctx.strokeText(labelText, centerX, centerY);
        
        // Draw light text
        ctx.fillStyle = '#e0e0e0';
        ctx.fillText(labelText, centerX, centerY);
    });
    
    // Draw multiplier zones
    multiplierZones.forEach(zone => {
        // Calculate center of zone
        const centerX = zone.centerX || (zone.x1 + zone.x2) / 2;
        const centerY = zone.centerY || (zone.y1 + zone.y2) / 2;
        const width = zone.width || (zone.x2 - zone.x1);
        const height = zone.height || (zone.y2 - zone.y1);
        const rotation = zone.rotation || 0;
        
        // Check if this zone is being hovered over in remover mode or being dragged
        const isHovered = removerMode && hoveredMultiplierZone === zone;
        const isDragged = isDraggingMultiplierZone && draggedMultiplierZone === zone;
        
        // Draw the rotated zone rectangle
        if (false) { // Level-up preview removed - zones now upgrade automatically
            // Show upgraded version with breathing effect
            const time = Date.now() * 0.005; // Slow breathing
            const scale = 1 + Math.sin(time) * 0.1; // 10% size variation
            
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(rotation);
            ctx.scale(scale, scale);
            ctx.translate(-width/2, -height/2);
            
            // Draw the zone rectangle with upgrade colors
            ctx.beginPath();
            ctx.rect(0, 0, width, height);
            ctx.fillStyle = 'rgba(0, 255, 0, 0.7)'; // Green for upgrade
            ctx.strokeStyle = '#00ff00';
            ctx.fill();
            ctx.lineWidth = ZONE_CONFIG.multiplier.lineWidth;
            ctx.setLineDash(ZONE_CONFIG.multiplier.dash);
            ctx.stroke();
            ctx.setLineDash([]); // Reset line dash
            ctx.restore();
            
            // Draw upgraded factor text (unrotated)
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            const newFactor = zone.factor + 1; // Show upgraded factor
            const displayText = `×${newFactor}`;
            
            // Draw black outline
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.strokeText(displayText, centerX, centerY);
            
            // Draw text
            ctx.fillStyle = '#e0e0e0';
            ctx.fillText(displayText, centerX, centerY);
        } else {
            // Normal drawing
            let fillColor, borderColor, lineWidth;
            
            if (isHovered) {
                fillColor = `rgba(255, 71, 87, 0.5)`;
                borderColor = COLORS.hover;
                lineWidth = 3;
            } else if (isDragged) {
                // Check if current position is valid
                const isValidPosition = canPlaceDraggedZone(centerX, centerY, zone, 'multiplier');
                if (isValidPosition) {
                    fillColor = 'rgba(156, 136, 255, 0.6)'; // Brighter when valid
                    borderColor = ZONE_CONFIG.multiplier.borderColor;
                } else {
                    fillColor = 'rgba(255, 0, 0, 0.4)'; // Red tint when invalid
                    borderColor = '#ff0000'; // Red border when invalid
                }
                lineWidth = 3;
            } else {
                fillColor = ZONE_CONFIG.multiplier.color;
                borderColor = ZONE_CONFIG.multiplier.borderColor;
                lineWidth = ZONE_CONFIG.multiplier.lineWidth;
            }
            
            drawRotatedRect(
                ctx, 
                centerX, 
                centerY, 
                width, 
                height, 
                rotation,
                fillColor,
                borderColor,
                lineWidth,
                ZONE_CONFIG.multiplier.dash
            );
            
            // Draw multiplier factor text (unrotated)
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Draw black outline
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.strokeText(`×${zone.factor}`, centerX, centerY);
            
            // Draw light text
            ctx.fillStyle = '#e0e0e0';
            ctx.fillText(`×${zone.factor}`, centerX, centerY);
        }
    });
    
    // Draw cash zones
    cashZones.forEach(zone => {
        // Calculate center of zone
        const centerX = zone.centerX || (zone.x1 + zone.x2) / 2;
        const centerY = zone.centerY || (zone.y1 + zone.y2) / 2;
        const width = zone.width || (zone.x2 - zone.x1);
        const height = zone.height || (zone.y2 - zone.y1);
        const rotation = zone.rotation || 0;
        
        // Check if this zone is being leveled up (show upgraded version)
        let isBeingLeveledUp = false;
        if (currentItemMode === 'cash' && isMouseOnCanvas) {
            const placementInfo = checkZonePlacement(mouseX, mouseY, 'cash');
            isBeingLeveledUp = placementInfo.levelUpTarget === zone;
        }
        
        // Check if this zone is being hovered over in remover mode or being dragged
        const isHovered = removerMode && hoveredCashZone === zone;
        const isDragged = isDraggingCashZone && draggedCashZone === zone;
        
        // Draw the rotated zone rectangle
        if (false) { // Level-up preview removed - zones now upgrade automatically
            // Show upgraded version with breathing effect
            const time = Date.now() * 0.005; // Slow breathing
            const scale = 1 + Math.sin(time) * 0.1; // 10% size variation
            
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(rotation);
            ctx.scale(scale, scale);
            ctx.translate(-width/2, -height/2);
            
            // Draw the zone rectangle with upgrade colors
            ctx.beginPath();
            ctx.rect(0, 0, width, height);
            ctx.fillStyle = 'rgba(0, 255, 0, 0.7)'; // Green for upgrade
            ctx.strokeStyle = '#00ff00';
            ctx.fill();
            ctx.lineWidth = ZONE_CONFIG.cash.lineWidth;
            ctx.setLineDash(ZONE_CONFIG.cash.dash);
            ctx.stroke();
            ctx.setLineDash([]); // Reset line dash
            ctx.restore();
            
            // Draw upgraded level text (unrotated)
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            const displayText = `💵${zone.level + 1}`; // Show upgraded level
            
            // Draw black outline
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.strokeText(displayText, centerX, centerY);
            
            // Draw text
            ctx.fillStyle = '#e0e0e0';
            ctx.fillText(displayText, centerX, centerY);
        } else {
            // Normal drawing
            let fillColor, borderColor, lineWidth;
            
            if (isHovered) {
                fillColor = `rgba(255, 71, 87, 0.5)`;
                borderColor = COLORS.hover;
                lineWidth = 3;
            } else if (isDragged) {
                // Check if current position is valid
                const isValidPosition = canPlaceDraggedZone(centerX, centerY, zone, 'cash');
                if (isValidPosition) {
                    fillColor = 'rgba(46, 213, 115, 0.6)'; // Brighter when valid
                    borderColor = ZONE_CONFIG.cash.borderColor;
                } else {
                    fillColor = 'rgba(255, 0, 0, 0.4)'; // Red tint when invalid
                    borderColor = '#ff0000'; // Red border when invalid
                }
                lineWidth = 3;
            } else {
                fillColor = ZONE_CONFIG.cash.color;
                borderColor = ZONE_CONFIG.cash.borderColor;
                lineWidth = ZONE_CONFIG.cash.lineWidth;
            }
            
            drawRotatedRect(
                ctx, 
                centerX, 
                centerY, 
                width, 
                height, 
                rotation,
                fillColor,
                borderColor,
                lineWidth,
                ZONE_CONFIG.cash.dash
            );
            
            // Draw dollar bill emoji with level (unrotated)
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            const displayText = `💵${zone.level}`;
            
            // Draw black outline
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.strokeText(displayText, centerX, centerY);
            
            // Draw emoji
            ctx.fillStyle = '#e0e0e0';
            ctx.fillText(displayText, centerX, centerY);
        }
    });
    
    // Draw level up zones
    levelUpZones.forEach(zone => {
        // Calculate center of zone
        const centerX = zone.centerX || (zone.x1 + zone.x2) / 2;
        const centerY = zone.centerY || (zone.y1 + zone.y2) / 2;
        const width = zone.width || (zone.x2 - zone.x1);
        const height = zone.height || (zone.y2 - zone.y1);
        const rotation = zone.rotation || 0;
        
        // Check if this zone is being leveled up (show upgraded version)
        let isBeingLeveledUp = false;
        if (currentItemMode === 'levelUp' && isMouseOnCanvas) {
            const placementInfo = checkZonePlacement(mouseX, mouseY, 'levelUp');
            isBeingLeveledUp = placementInfo.levelUpTarget === zone;
        }
        
        // Check if this zone is being hovered over in remover mode or being dragged
        const isHovered = removerMode && hoveredLevelUpZone === zone;
        const isDragged = isDraggingLevelUpZone && draggedLevelUpZone === zone;
        
        // Draw the rotated zone rectangle
        if (false) { // Level-up preview removed - zones now upgrade automatically
            // Show upgraded version with breathing effect
            const time = Date.now() * 0.005; // Slow breathing
            const scale = 1 + Math.sin(time) * 0.1; // 10% size variation
            
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(rotation);
            ctx.scale(scale, scale);
            ctx.translate(-width/2, -height/2);
            
            // Draw the zone rectangle with upgrade colors
            ctx.beginPath();
            ctx.rect(0, 0, width, height);
            ctx.fillStyle = 'rgba(0, 255, 0, 0.7)'; // Green for upgrade
            ctx.strokeStyle = '#00ff00';
            ctx.fill();
            ctx.lineWidth = ZONE_CONFIG.levelUp.lineWidth;
            ctx.setLineDash(ZONE_CONFIG.levelUp.dash);
            ctx.stroke();
            ctx.setLineDash([]); // Reset line dash
            ctx.restore();
            
            // Draw upgraded level text (unrotated)
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            const displayText = `+${zone.level + 1}`; // Show upgraded level
            
            // Draw black outline
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.strokeText(displayText, centerX, centerY);
            
            // Draw text
            ctx.fillStyle = '#e0e0e0';
            ctx.fillText(displayText, centerX, centerY);
        } else {
            // Normal drawing
            let fillColor, borderColor, lineWidth;
            
            if (isHovered) {
                fillColor = `rgba(255, 71, 87, 0.5)`;
                borderColor = COLORS.hover;
                lineWidth = 3;
            } else if (isDragged) {
                // Check if current position is valid
                const isValidPosition = canPlaceDraggedZone(centerX, centerY, zone, 'levelUp');
                if (isValidPosition) {
                    fillColor = 'rgba(255, 107, 53, 0.6)'; // Brighter when valid
                    borderColor = ZONE_CONFIG.levelUp.borderColor;
                } else {
                    fillColor = 'rgba(255, 0, 0, 0.4)'; // Red tint when invalid
                    borderColor = '#ff0000'; // Red border when invalid
                }
                lineWidth = 3;
            } else {
                fillColor = ZONE_CONFIG.levelUp.color;
                borderColor = ZONE_CONFIG.levelUp.borderColor;
                lineWidth = ZONE_CONFIG.levelUp.lineWidth;
            }
            
            drawRotatedRect(
                ctx, 
                centerX, 
                centerY, 
                width, 
                height, 
                rotation,
                fillColor,
                borderColor,
                lineWidth,
                ZONE_CONFIG.levelUp.dash
            );
            
            // Draw level up text with level (unrotated)
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            const displayText = `+${zone.level}`;
            
            // Draw black outline
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.strokeText(displayText, centerX, centerY);
            
            // Draw emoji
            ctx.fillStyle = '#e0e0e0';
            ctx.fillText(displayText, centerX, centerY);
        }
    });
    
    // Draw anti-gravity zones
    antiGravityZones.forEach(zone => {
        // Calculate center of zone
        const centerX = zone.centerX || (zone.x1 + zone.x2) / 2;
        const centerY = zone.centerY || (zone.y1 + zone.y2) / 2;
        const width = zone.width || (zone.x2 - zone.x1);
        const height = zone.height || (zone.y2 - zone.y1);
        const rotation = zone.rotation || 0;
        
        // Check if this zone is being hovered over in remover mode or being dragged
        const isHovered = removerMode && hoveredAntiGravityZone === zone;
        const isDragged = isDraggingAntiGravityZone && draggedAntiGravityZone === zone;
        
        // Draw the rotated zone rectangle
        let fillColor, borderColor, lineWidth;
        
        if (isHovered) {
            fillColor = `rgba(255, 71, 87, 0.5)`;
            borderColor = COLORS.hover;
            lineWidth = 3;
        } else if (isDragged) {
            // Check if current position is valid
            const isValidPosition = canPlaceDraggedZone(centerX, centerY, zone, 'antiGravity');
            if (isValidPosition) {
                fillColor = 'rgba(255, 0, 255, 0.6)'; // Brighter when valid
                borderColor = ZONE_CONFIG.antiGravity.borderColor;
            } else {
                fillColor = 'rgba(255, 0, 0, 0.4)'; // Red tint when invalid
                borderColor = '#ff0000'; // Red border when invalid
            }
            lineWidth = 3;
        } else {
            fillColor = ZONE_CONFIG.antiGravity.color;
            borderColor = ZONE_CONFIG.antiGravity.borderColor;
            lineWidth = ZONE_CONFIG.antiGravity.lineWidth;
        }
        
        drawRotatedRect(
            ctx, 
            centerX, 
            centerY, 
            width, 
            height, 
            rotation,
            fillColor,
            borderColor,
            lineWidth,
            ZONE_CONFIG.antiGravity.dash
        );
        
        // Draw anti-gravity text (unrotated)
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const displayText = '↑↓'; // Up-down arrow symbol
        
        // Draw black outline
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.strokeText(displayText, centerX, centerY);
        
        // Draw text
        ctx.fillStyle = '#e0e0e0';
        ctx.fillText(displayText, centerX, centerY);
    });
    
    // Draw permanent bottom cash zone
    if (permanentBottomCashZone) {
        // Calculate center of zone
        const centerX = (permanentBottomCashZone.x1 + permanentBottomCashZone.x2) / 2;
        const centerY = (permanentBottomCashZone.y1 + permanentBottomCashZone.y2) / 2;
        
        // Draw the zone rectangle
        ctx.beginPath();
        ctx.rect(permanentBottomCashZone.x1, permanentBottomCashZone.y1, 
                permanentBottomCashZone.x2 - permanentBottomCashZone.x1, 
                permanentBottomCashZone.y2 - permanentBottomCashZone.y1);
        ctx.fillStyle = 'rgba(46, 213, 115, 0.4)'; // Slightly more transparent than regular cash zones
        ctx.fill();
        ctx.strokeStyle = '#2ed573';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 4]); // Different dash pattern to distinguish it
        ctx.stroke();
        ctx.setLineDash([]); // Reset line dash
        
        // Draw exactly 3 dollar emojis across the width
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Draw black outline
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        
        // Calculate positions for exactly 3 emojis
        const zoneWidth = permanentBottomCashZone.x2 - permanentBottomCashZone.x1;
        const emojiSpacing = zoneWidth / 4; // Divide by 4 to get 3 evenly spaced positions
        const startX = permanentBottomCashZone.x1 + emojiSpacing;
        
        // Draw 3 emojis
        for (let i = 0; i < 3; i++) {
            const x = startX + (i * emojiSpacing);
            ctx.strokeText('💵', x, centerY);
        }
        
        // Draw emojis
        ctx.fillStyle = '#e0e0e0';
        for (let i = 0; i < 3; i++) {
            const x = startX + (i * emojiSpacing);
            ctx.fillText('💵', x, centerY);
        }
    }
    
    // Draw wall preview if drawing
    if (wallDrawingMode && isDrawingWall) {
        const wallThickness = WALL_CONFIG.thickness;
        
        // Calculate the angle to determine orientation (same logic as createWall)
        const angle = Math.atan2(wallEndY - wallStartY, wallEndX - wallStartX);
        const absAngle = Math.abs(angle);
        
        let vertices;
        
        // If more horizontal than vertical (angle closer to 0 or π)
        if (absAngle < Math.PI / 4 || absAngle > 3 * Math.PI / 4) {
            // Vertical sides (left and right edges are vertical)
            vertices = [
                { x: wallStartX, y: wallStartY - wallThickness/2 },
                { x: wallEndX, y: wallEndY - wallThickness/2 },
                { x: wallEndX, y: wallEndY + wallThickness/2 },
                { x: wallStartX, y: wallStartY + wallThickness/2 }
            ];
        } else {
            // Horizontal sides (top and bottom edges are horizontal)
            vertices = [
                { x: wallStartX - wallThickness/2, y: wallStartY },
                { x: wallStartX + wallThickness/2, y: wallStartY },
                { x: wallEndX + wallThickness/2, y: wallEndY },
                { x: wallEndX - wallThickness/2, y: wallEndY }
            ];
        }
        
        // Draw wall preview parallelogram
        ctx.beginPath();
        ctx.moveTo(vertices[0].x, vertices[0].y);
        ctx.lineTo(vertices[1].x, vertices[1].y);
        ctx.lineTo(vertices[2].x, vertices[2].y);
        ctx.lineTo(vertices[3].x, vertices[3].y);
        ctx.closePath();
        
        // Fill with semi-transparent color
        ctx.fillStyle = 'rgba(255, 165, 2, 0.5)'; // Orange for wall preview
        ctx.fill();
        
        // Draw border
        ctx.strokeStyle = '#ffa502'; // Orange for wall preview
        ctx.lineWidth = WALL_CONFIG.previewLineWidth;
        ctx.setLineDash(WALL_CONFIG.previewDash);
        ctx.stroke();
        ctx.setLineDash([]); // Reset line dash
    }
    
    // Draw wall item preview if in wall item mode and mouse is on canvas
    if ((currentItemMode === 'wallSquare' || currentItemMode === 'wallCircle' || currentItemMode === 'wallTriangle' || currentItemMode === 'wallHexagon') && isMouseOnCanvas) {
        ctx.fillStyle = 'rgba(139, 69, 19, 0.5)'; // Brown for wall item preview
        ctx.strokeStyle = '#8B4513'; // Brown for wall item preview
        ctx.lineWidth = WALL_CONFIG.previewLineWidth;
        ctx.setLineDash(WALL_CONFIG.previewDash);
        
        if (currentItemMode === 'wallSquare') {
            // Draw square preview
            const size = 80;
            const halfSize = size / 2;
            const cos = Math.cos(wallItemRotation);
            const sin = Math.sin(wallItemRotation);
            
            // Calculate the four corners of the rotated square
            const vertices = [
                { x: wallItemPreviewX - halfSize * cos - halfSize * sin, y: wallItemPreviewY - halfSize * sin + halfSize * cos },
                { x: wallItemPreviewX + halfSize * cos - halfSize * sin, y: wallItemPreviewY + halfSize * sin + halfSize * cos },
                { x: wallItemPreviewX + halfSize * cos + halfSize * sin, y: wallItemPreviewY + halfSize * sin - halfSize * cos },
                { x: wallItemPreviewX - halfSize * cos + halfSize * sin, y: wallItemPreviewY - halfSize * sin - halfSize * cos }
            ];
            
            ctx.beginPath();
            ctx.moveTo(vertices[0].x, vertices[0].y);
            ctx.lineTo(vertices[1].x, vertices[1].y);
            ctx.lineTo(vertices[2].x, vertices[2].y);
            ctx.lineTo(vertices[3].x, vertices[3].y);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
        } else if (currentItemMode === 'wallCircle') {
            // Draw circle preview
            const radius = 50;
            ctx.beginPath();
            ctx.arc(wallItemPreviewX, wallItemPreviewY, radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
            
        } else if (currentItemMode === 'wallTriangle') {
            // Draw triangle preview
            const size = 120;
            const halfSize = size / 2;
            const cos = Math.cos(wallItemRotation);
            const sin = Math.sin(wallItemRotation);
            
            // Calculate triangle vertices (equilateral triangle)
            const vertices = [
                { x: wallItemPreviewX, y: wallItemPreviewY - halfSize }, // Top vertex
                { x: wallItemPreviewX - halfSize * Math.cos(Math.PI / 6), y: wallItemPreviewY + halfSize * Math.sin(Math.PI / 6) }, // Bottom left
                { x: wallItemPreviewX + halfSize * Math.cos(Math.PI / 6), y: wallItemPreviewY + halfSize * Math.sin(Math.PI / 6) }  // Bottom right
            ];
            
            // Apply rotation to all vertices
            const rotatedVertices = vertices.map(vertex => {
                const dx = vertex.x - wallItemPreviewX;
                const dy = vertex.y - wallItemPreviewY;
                return {
                    x: wallItemPreviewX + dx * cos - dy * sin,
                    y: wallItemPreviewY + dx * sin + dy * cos
                };
            });
            
            ctx.beginPath();
            ctx.moveTo(rotatedVertices[0].x, rotatedVertices[0].y);
            ctx.lineTo(rotatedVertices[1].x, rotatedVertices[1].y);
            ctx.lineTo(rotatedVertices[2].x, rotatedVertices[2].y);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        } else if (currentItemMode === 'wallHexagon') {
            // Draw hexagon preview
            const size = 100;
            const radius = size / 2;
            const vertices = [];
            
            // Create hexagon vertices
            for (let i = 0; i < 6; i++) {
                const angle = (i * Math.PI / 3) + wallItemRotation;
                vertices.push({
                    x: wallItemPreviewX + Math.cos(angle) * radius,
                    y: wallItemPreviewY + Math.sin(angle) * radius
                });
            }
            
            ctx.beginPath();
            ctx.moveTo(vertices[0].x, vertices[0].y);
            for (let i = 1; i < vertices.length; i++) {
                ctx.lineTo(vertices[i].x, vertices[i].y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            
        }
        
        ctx.setLineDash([]); // Reset line dash
    }
    
    // Zone placement restriction circles removed - zones now upgrade existing ones
    
    // Draw multiplier zone cursor preview if in placement mode and mouse is on canvas
    if (multiplierPlacementMode && isMouseOnCanvas) {
        const width = ZONE_CONFIG.multiplier.width;
        const height = ZONE_CONFIG.multiplier.height;
        
        // Calculate preview rectangle centered on cursor
        const previewX = mouseX - width / 2;
        const previewY = mouseY - height / 2;
        
        // Check if placement is valid
        const canPlace = !checkMultiplierZoneCollision(mouseX, mouseY);
        
        ctx.beginPath();
        ctx.rect(previewX, previewY, width, height);
        
        // Use different colors based on placement validity
        if (canPlace) {
            ctx.fillStyle = ZONE_CONFIG.multiplier.color;
            ctx.strokeStyle = ZONE_CONFIG.multiplier.borderColor;
        } else {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'; // Red if cannot place
            ctx.strokeStyle = '#ff0000';
        }
        
        ctx.fill();
        ctx.lineWidth = ZONE_CONFIG.multiplier.lineWidth;
        ctx.setLineDash(ZONE_CONFIG.multiplier.dash);
        ctx.stroke();
        ctx.setLineDash([]); // Reset line dash
        
        // Draw multiplier factor text at center of preview
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Draw black outline
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.strokeText(`×${multiplierFactor}`, mouseX, mouseY);
        
        // Draw light text
        ctx.fillStyle = '#e0e0e0';
        ctx.fillText(`×${multiplierFactor}`, mouseX, mouseY);
    }
    
    // Cash item preview removed - zones now upgrade existing ones automatically
    
    // Multiplier item preview removed - zones now upgrade existing ones automatically
    
    // Level up item preview removed - zones now upgrade existing ones automatically
    
    // Draw portal zone cursor preview if in portal mode and mouse is on canvas
    if (portalMode && isMouseOnCanvas) {
        const width = ZONE_CONFIG.portal.width;
        const height = ZONE_CONFIG.portal.height;
        
        // Calculate preview rectangle centered on cursor
        const previewX = mouseX - width / 2;
        const previewY = mouseY - height / 2;
        
        ctx.beginPath();
        ctx.rect(previewX, previewY, width, height);
        ctx.fillStyle = `rgba(128, 0, 128, 0.3)`; // Purple preview
        ctx.fill();
        ctx.strokeStyle = '#800080'; // Purple border
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]); // Dashed border
        ctx.stroke();
        ctx.setLineDash([]); // Reset line dash
    }
    
    // Draw cash zone cursor preview if in cash mode and mouse is on canvas
    if (cashMode && isMouseOnCanvas) {
        const width = ZONE_CONFIG.cash.width;
        const height = ZONE_CONFIG.cash.height;
        
        // Calculate preview rectangle centered on cursor
        const previewX = mouseX - width / 2;
        const previewY = mouseY - height / 2;
        
        ctx.beginPath();
        ctx.rect(previewX, previewY, width, height);
        ctx.fillStyle = ZONE_CONFIG.cash.color;
        ctx.fill();
        ctx.strokeStyle = ZONE_CONFIG.cash.borderColor;
        ctx.lineWidth = ZONE_CONFIG.cash.lineWidth;
        ctx.setLineDash(ZONE_CONFIG.cash.dash);
        ctx.stroke();
        ctx.setLineDash([]); // Reset line dash
        
        // Draw dollar bill emoji at center of preview
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Draw black outline
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.strokeText('💵', mouseX, mouseY);
        
        // Draw emoji
        ctx.fillStyle = '#e0e0e0';
        ctx.fillText('💵', mouseX, mouseY);
    }
    
    // Draw level up zone cursor preview if in level up mode and mouse is on canvas
    if (levelUpMode && isMouseOnCanvas) {
        // Check if hovering over an existing level up zone
        const placementInfo = checkZonePlacement(mouseX, mouseY, 'levelUp');
        
        // Only show preview if NOT hovering over an existing zone
        if (!placementInfo.levelUpTarget) {
            const width = ZONE_CONFIG.levelUp.width;
            const height = ZONE_CONFIG.levelUp.height;
            
            // Calculate preview rectangle centered on cursor
            const previewX = mouseX - width / 2;
            const previewY = mouseY - height / 2;
            
            ctx.beginPath();
            ctx.rect(previewX, previewY, width, height);
            ctx.fillStyle = ZONE_CONFIG.levelUp.color;
            ctx.fill();
            ctx.strokeStyle = ZONE_CONFIG.levelUp.borderColor;
            ctx.lineWidth = ZONE_CONFIG.levelUp.lineWidth;
            ctx.setLineDash(ZONE_CONFIG.levelUp.dash);
            ctx.stroke();
            ctx.setLineDash([]); // Reset line dash
            
            // Draw level up text at center of preview
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Draw black outline
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.strokeText('+1', mouseX, mouseY);
            
            // Draw text
            ctx.fillStyle = '#e0e0e0';
            ctx.fillText('+1', mouseX, mouseY);
        }
        // When hovering over existing zone, do NOTHING - no preview, no crosshair, nothing
    }
    
    // Draw spawn indicator
    drawSpawnIndicator();
    
    // Draw money animations
    moneyAnimations.forEach(animation => animation.draw(ctx));
    
    // Draw dropping animations
    droppingAnimations.forEach(animation => animation.draw(ctx));
    
}

// Function to apply anti-gravity forces to balls in anti-gravity zones
function applyAntiGravityForces() {
    const bodies = Matter.Composite.allBodies(world);
    
    bodies.forEach(body => {
        // Check if it's a ball (has circleRadius) and is in an anti-gravity zone
        if (body.circleRadius && body.inAntiGravityZone) {
            // Apply anti-gravity by modifying the ball's velocity directly
            const currentVelocity = body.velocity;
            
            // Apply upward force to counteract gravity
            const antiGravityStrength = physicsSettings.gravity * 0.8; // Stronger force
            
            // Reduce downward velocity and add upward velocity
            Body.setVelocity(body, {
                x: currentVelocity.x,
                y: currentVelocity.y - antiGravityStrength // Subtract to go upward
            });
        }
    });
}

// Game loop
function gameLoop(currentTime) {
    // Calculate FPS
    calculateFPS(currentTime);
    
    // Update physics only if not paused
    if (!isPaused) {
        Engine.update(engine);
        
        // Apply anti-gravity forces to balls in anti-gravity zones
        applyAntiGravityForces();
        
        // Track first test ball position
        if (firstTestBall && firstTestBall.position) {
            if (skipPathRecording) {
                // Skip this frame (during portal teleportation) and resume on next frame
                skipPathRecording = false;
            } else {
                // Add current position to path (sample every frame)
                firstTestBallPath.push({
                    x: firstTestBall.position.x,
                    y: firstTestBall.position.y
                });
                
                // Limit path length to prevent memory issues (keep last 5000 points)
                if (firstTestBallPath.length > 5000) {
                    firstTestBallPath.shift();
                }
            }
        }
        
        // Check for balls that have fallen off the bottom of the screen
        checkForFallenBalls();
        
        // Check for stuck balls
        checkForStuckBalls();
    }
    
    // Update money animations
    moneyAnimations = moneyAnimations.filter(animation => animation.update());
    
    // Update dropping animations
    droppingAnimations = droppingAnimations.filter(animation => {
        const isComplete = animation.update();
        if (isComplete) {
            // Animation finished, create the actual item
            createActualItem(animation);
        }
        return !isComplete;
    });
    
    // Render
    render();
    
    // Continue loop
    requestAnimationFrame(gameLoop);
}

// Function to initialize sliders with current physics settings
function initializeSliders() {
    gravitySlider.value = physicsSettings.gravity;
    sizeSlider.value = physicsSettings.circleSize;
    bounceSlider.value = physicsSettings.bounciness;
    frictionSlider.value = physicsSettings.friction;
    densitySlider.value = physicsSettings.density;
    spawnDelaySlider.value = physicsSettings.spawnDelay;
    ballLevelInput.value = physicsSettings.ballLevel;
    multiplierSlider.value = multiplierFactor;
}

// Initialize sliders and display values
initializeSliders();
updatePhysicsSettings();
updateDisplayValues();
updateTestBallDisplay();
updateItemButtonStates();
updateCurrentBallLevelDisplay();
updateDropButtonText();

// Initialize drop button state to reflect default (floor is off)
dropButton.textContent = 'Replace Floor';
dropButton.style.background = '#2ed573';

// Function to generate 3 random walls at game start
function generateRandomWalls() {
    const wallTypes = ['square', 'circle', 'triangle', 'hexagon'];
    const numWalls = 3;
    const canvasWidth = CANVAS_CONFIG.width;
    const canvasHeight = CANVAS_CONFIG.height;
    const margin = 50; // Margin from edges
    const topSpawnArea = 150; // Reserve top 150px for ball spawning
    const minDistance = 80; // Minimum distance between walls and from money zone
    
    // Get money zone bounds (permanent bottom cash zone)
    const moneyZoneBounds = {
        x1: canvasWidth * 0.25, // 25% from left edge
        x2: canvasWidth * 0.75, // 75% from left edge  
        y1: canvasHeight - 30, // Bottom of canvas
        y2: canvasHeight // Bottom edge
    };
    
    const walls = [];
    
    for (let i = 0; i < numWalls; i++) {
        let attempts = 0;
        let placed = false;
        
        while (!placed && attempts < 50) { // Max 50 attempts per wall
            attempts++;
            
            // Random position within canvas bounds (excluding margins and top spawn area)
            const x = margin + Math.random() * (canvasWidth - 2 * margin);
            const y = topSpawnArea + Math.random() * (canvasHeight - topSpawnArea - margin);
            
            // Random wall type
            const wallType = wallTypes[Math.floor(Math.random() * wallTypes.length)];
            
            // Use same sizes as item modal system
            const rotation = Math.random() * Math.PI * 2; // Random rotation
            
            // Check if position conflicts with money zone
            const conflictsWithMoneyZone = 
                x >= moneyZoneBounds.x1 - minDistance &&
                x <= moneyZoneBounds.x2 + minDistance &&
                y >= moneyZoneBounds.y1 - minDistance &&
                y <= moneyZoneBounds.y2 + minDistance;
            
            if (conflictsWithMoneyZone) {
                continue; // Try again
            }
            
            // Check if position conflicts with existing walls
            let conflictsWithWalls = false;
            for (const existingWall of walls) {
                const distance = Math.sqrt(
                    Math.pow(x - existingWall.x, 2) + Math.pow(y - existingWall.y, 2)
                );
                if (distance < minDistance) {
                    conflictsWithWalls = true;
                    break;
                }
            }
            
            // Check if position conflicts with portals
            const conflictsWithPortalZones = conflictsWithPortals(x, y, minDistance);
            
            if (conflictsWithWalls || conflictsWithPortalZones) {
                continue; // Try again
            }
            
            // Create the wall based on type using item modal sizes
            let wall;
            switch (wallType) {
                case 'square':
                    wall = createSquareWall(x, y, 80, rotation); // Same as item modal
                    break;
                case 'circle':
                    wall = createCircleWall(x, y, 50); // Same as item modal
                    break;
                case 'triangle':
                    wall = createTriangleWall(x, y, 120, rotation); // Same as item modal
                    break;
                case 'hexagon':
                    wall = createHexagonWall(x, y, 100, rotation); // Same as item modal
                    break;
            }
            
            // Store wall info for collision checking
            let wallSize;
            switch (wallType) {
                case 'square':
                    wallSize = 80;
                    break;
                case 'circle':
                    wallSize = 50;
                    break;
                case 'triangle':
                    wallSize = 120;
                    break;
                case 'hexagon':
                    wallSize = 100;
                    break;
                default:
                    wallSize = 80;
            }
            
            walls.push({
                x: x,
                y: y,
                size: wallSize,
                wall: wall
            });
            
            placed = true;
        }
        
        if (!placed) {
            console.log(`Failed to place wall ${i + 1} after 50 attempts`);
        }
    }
    
    console.log(`Generated ${walls.length} random walls`);
}

// Function to generate 3 random 2x multipliers at game start
function generateRandomMultipliers() {
    const numMultipliers = 3;
    const canvasWidth = CANVAS_CONFIG.width;
    const canvasHeight = CANVAS_CONFIG.height;
    const margin = 50; // Margin from edges
    const topSpawnArea = 150; // Reserve top 150px for ball spawning
    const minDistance = 100; // Minimum distance between multipliers and walls/zones
    
    // Calculate the spawnable area (excluding top spawn area and bottom margin)
    const spawnableHeight = canvasHeight - topSpawnArea - margin;
    const zoneHeight = spawnableHeight / 3; // Divide into 3 equal vertical zones
    
    // Define the three vertical zones
    const zones = [
        { // Top zone
            name: 'top',
            y1: topSpawnArea,
            y2: topSpawnArea + zoneHeight
        },
        { // Middle zone
            name: 'middle', 
            y1: topSpawnArea + zoneHeight,
            y2: topSpawnArea + 2 * zoneHeight
        },
        { // Bottom zone
            name: 'bottom',
            y1: topSpawnArea + 2 * zoneHeight,
            y2: canvasHeight - margin
        }
    ];
    
    // Get money zone bounds (permanent bottom cash zone)
    const moneyZoneBounds = {
        x1: canvasWidth * 0.25, // 25% from left edge
        x2: canvasWidth * 0.75, // 75% from left edge  
        y1: canvasHeight - 30, // Bottom of canvas
        y2: canvasHeight // Bottom edge
    };
    
    // Get all existing wall positions for collision checking
    const existingWalls = [];
    const bodies = Matter.Composite.allBodies(world);
    for (const body of bodies) {
        if (body.isStatic && body !== permanentBottomCashZone?.body) {
            existingWalls.push({
                x: body.position.x,
                y: body.position.y,
                // Approximate size based on wall type (conservative estimate)
                size: 100 // Use a conservative size for collision checking
            });
        }
    }
    
    // Place exactly one multiplier in each zone
    for (let zoneIndex = 0; zoneIndex < zones.length; zoneIndex++) {
        const zone = zones[zoneIndex];
        let attempts = 0;
        let placed = false;
        
        while (!placed && attempts < 50) { // Max 50 attempts per multiplier
            attempts++;
            
            // Random position within the specific zone bounds
            const x = margin + Math.random() * (canvasWidth - 2 * margin);
            const y = zone.y1 + Math.random() * (zone.y2 - zone.y1);
            
            // Check if position conflicts with money zone
            const conflictsWithMoneyZone = 
                x >= moneyZoneBounds.x1 - minDistance &&
                x <= moneyZoneBounds.x2 + minDistance &&
                y >= moneyZoneBounds.y1 - minDistance &&
                y <= moneyZoneBounds.y2 + minDistance;
            
            if (conflictsWithMoneyZone) {
                continue; // Try again
            }
            
            // Check if position conflicts with existing walls
            let conflictsWithWalls = false;
            for (const existingWall of existingWalls) {
                const distance = Math.sqrt(
                    Math.pow(x - existingWall.x, 2) + Math.pow(y - existingWall.y, 2)
                );
                if (distance < minDistance) {
                    conflictsWithWalls = true;
                    break;
                }
            }
            
            // Check if position conflicts with existing multiplier zones
            let conflictsWithMultipliers = false;
            for (const existingMultiplier of multiplierZones) {
                const distance = Math.sqrt(
                    Math.pow(x - existingMultiplier.centerX, 2) + Math.pow(y - existingMultiplier.centerY, 2)
                );
                if (distance < minDistance) {
                    conflictsWithMultipliers = true;
                    break;
                }
            }
            
            // Check if position conflicts with portals
            const conflictsWithPortalZones = conflictsWithPortals(x, y, minDistance);
            
            // Check if position conflicts with cash zones
            const conflictsWithCashZonesCheck = conflictsWithCashZones(x, y, minDistance);
            
            // Check if position conflicts with level up zones
            const conflictsWithLevelUpZonesCheck = conflictsWithLevelUpZones(x, y, minDistance);
            
            if (conflictsWithWalls || conflictsWithMultipliers || conflictsWithPortalZones || conflictsWithCashZonesCheck || conflictsWithLevelUpZonesCheck) {
                continue; // Try again
            }
            
            // Create the 2x multiplier zone with horizontal orientation (no rotation)
            const rotation = 0; // Horizontal orientation
            const multiplier = createMultiplierZone(x, y, 2, rotation);
            
            // Add to existing walls list for future collision checking
            existingWalls.push({
                x: x,
                y: y,
                size: 100
            });
            
            placed = true;
        }
        
        if (!placed) {
            console.log(`Failed to place multiplier in ${zone.name} zone after 50 attempts`);
        }
    }
    
    console.log(`Generated ${multiplierZones.length} random multipliers (1 in each of the 3 vertical zones)`);
}

// Function to generate 3 random cash zones at game start
function generateRandomCashZones() {
    const numCashZones = 3;
    const canvasWidth = CANVAS_CONFIG.width;
    const canvasHeight = CANVAS_CONFIG.height;
    const margin = 50; // Margin from edges
    const topSpawnArea = 150; // Reserve top 150px for ball spawning
    const minDistance = 100; // Minimum distance between cash zones and walls/zones
    
    // Calculate the spawnable area (excluding top spawn area and bottom margin)
    const spawnableHeight = canvasHeight - topSpawnArea - margin;
    const zoneHeight = spawnableHeight / 3; // Divide into 3 equal vertical zones
    
    // Define the three vertical zones
    const zones = [
        { // Top zone
            name: 'top',
            y1: topSpawnArea,
            y2: topSpawnArea + zoneHeight
        },
        { // Middle zone
            name: 'middle', 
            y1: topSpawnArea + zoneHeight,
            y2: topSpawnArea + 2 * zoneHeight
        },
        { // Bottom zone
            name: 'bottom',
            y1: topSpawnArea + 2 * zoneHeight,
            y2: canvasHeight - margin
        }
    ];
    
    // Get money zone bounds (permanent bottom cash zone)
    const moneyZoneBounds = {
        x1: canvasWidth * 0.25, // 25% from left edge
        x2: canvasWidth * 0.75, // 75% from left edge  
        y1: canvasHeight - 30, // Bottom of canvas
        y2: canvasHeight // Bottom edge
    };
    
    // Get all existing wall positions for collision checking
    const existingWalls = [];
    const bodies = Matter.Composite.allBodies(world);
    for (const body of bodies) {
        if (body.isStatic && body !== permanentBottomCashZone?.body) {
            existingWalls.push({
                x: body.position.x,
                y: body.position.y,
                // Approximate size based on wall type (conservative estimate)
                size: 100 // Use a conservative size for collision checking
            });
        }
    }
    
    // Place exactly one cash zone in each zone
    for (let zoneIndex = 0; zoneIndex < zones.length; zoneIndex++) {
        const zone = zones[zoneIndex];
        let attempts = 0;
        let placed = false;
        
        while (!placed && attempts < 50) { // Max 50 attempts per cash zone
            attempts++;
            
            // Random position within the specific zone bounds
            const x = margin + Math.random() * (canvasWidth - 2 * margin);
            const y = zone.y1 + Math.random() * (zone.y2 - zone.y1);
            
            // Check if position conflicts with money zone
            const conflictsWithMoneyZone = 
                x >= moneyZoneBounds.x1 - minDistance &&
                x <= moneyZoneBounds.x2 + minDistance &&
                y >= moneyZoneBounds.y1 - minDistance &&
                y <= moneyZoneBounds.y2 + minDistance;
            
            if (conflictsWithMoneyZone) {
                continue; // Try again
            }
            
            // Check if position conflicts with existing walls
            let conflictsWithWalls = false;
            for (const existingWall of existingWalls) {
                const distance = Math.sqrt(
                    Math.pow(x - existingWall.x, 2) + Math.pow(y - existingWall.y, 2)
                );
                if (distance < minDistance) {
                    conflictsWithWalls = true;
                    break;
                }
            }
            
            // Check if position conflicts with existing multiplier zones
            let conflictsWithMultipliers = false;
            for (const existingMultiplier of multiplierZones) {
                const distance = Math.sqrt(
                    Math.pow(x - existingMultiplier.centerX, 2) + Math.pow(y - existingMultiplier.centerY, 2)
                );
                if (distance < minDistance) {
                    conflictsWithMultipliers = true;
                    break;
                }
            }
            
            // Check if position conflicts with existing cash zones
            const conflictsWithCashZonesCheck = conflictsWithCashZones(x, y, minDistance);
            
            // Check if position conflicts with level up zones
            const conflictsWithLevelUpZonesCheck = conflictsWithLevelUpZones(x, y, minDistance);
            
            // Check if position conflicts with portals
            const conflictsWithPortalZones = conflictsWithPortals(x, y, minDistance);
            
            if (conflictsWithWalls || conflictsWithMultipliers || conflictsWithCashZonesCheck || conflictsWithLevelUpZonesCheck || conflictsWithPortalZones) {
                continue; // Try again
            }
            
            // Create the cash zone with horizontal orientation (no rotation)
            const rotation = 0; // Horizontal orientation
            const cashZone = createCashZone(x, y, rotation);
            
            // Add to existing walls list for future collision checking
            existingWalls.push({
                x: x,
                y: y,
                size: 100
            });
            
            placed = true;
        }
        
        if (!placed) {
            console.log(`Failed to place cash zone in ${zone.name} zone after 50 attempts`);
        }
    }
    
    console.log(`Generated ${cashZones.length} random cash zones (1 in each of the 3 vertical zones)`);
}

// Function to generate 3 random level up zones at game start
function generateRandomLevelUpZones() {
    const numLevelUpZones = 3;
    const canvasWidth = CANVAS_CONFIG.width;
    const canvasHeight = CANVAS_CONFIG.height;
    const margin = 50; // Margin from edges
    const topSpawnArea = 150; // Reserve top 150px for ball spawning
    const minDistance = 100; // Minimum distance between level up zones and walls/zones
    
    // Calculate the spawnable area (excluding top spawn area and bottom margin)
    const spawnableHeight = canvasHeight - topSpawnArea - margin;
    const zoneHeight = spawnableHeight / 3; // Divide into 3 equal vertical zones
    
    // Define the three vertical zones
    const zones = [
        { // Top zone
            name: 'top',
            y1: topSpawnArea,
            y2: topSpawnArea + zoneHeight
        },
        { // Middle zone
            name: 'middle', 
            y1: topSpawnArea + zoneHeight,
            y2: topSpawnArea + 2 * zoneHeight
        },
        { // Bottom zone
            name: 'bottom',
            y1: topSpawnArea + 2 * zoneHeight,
            y2: canvasHeight - margin
        }
    ];
    
    // Get money zone bounds (permanent bottom cash zone)
    const moneyZoneBounds = {
        x1: canvasWidth * 0.25, // 25% from left edge
        x2: canvasWidth * 0.75, // 75% from left edge  
        y1: canvasHeight - 30, // Bottom of canvas
        y2: canvasHeight // Bottom edge
    };
    
    // Get all existing wall positions for collision checking
    const existingWalls = [];
    const bodies = Matter.Composite.allBodies(world);
    for (const body of bodies) {
        if (body.isStatic && body !== permanentBottomCashZone?.body) {
            existingWalls.push({
                x: body.position.x,
                y: body.position.y,
                // Approximate size based on wall type (conservative estimate)
                size: 100 // Use a conservative size for collision checking
            });
        }
    }
    
    // Place exactly one level up zone in each zone
    for (let zoneIndex = 0; zoneIndex < zones.length; zoneIndex++) {
        const zone = zones[zoneIndex];
        let attempts = 0;
        let placed = false;
        
        while (!placed && attempts < 50) { // Max 50 attempts per level up zone
            attempts++;
            
            // Random position within the specific zone bounds
            const x = margin + Math.random() * (canvasWidth - 2 * margin);
            const y = zone.y1 + Math.random() * (zone.y2 - zone.y1);
            
            // Check if position conflicts with money zone
            const conflictsWithMoneyZone = 
                x >= moneyZoneBounds.x1 - minDistance &&
                x <= moneyZoneBounds.x2 + minDistance &&
                y >= moneyZoneBounds.y1 - minDistance &&
                y <= moneyZoneBounds.y2 + minDistance;
            
            if (conflictsWithMoneyZone) {
                continue; // Try again
            }
            
            // Check if position conflicts with existing walls
            let conflictsWithWalls = false;
            for (const existingWall of existingWalls) {
                const distance = Math.sqrt(
                    Math.pow(x - existingWall.x, 2) + Math.pow(y - existingWall.y, 2)
                );
                if (distance < minDistance) {
                    conflictsWithWalls = true;
                    break;
                }
            }
            
            // Check if position conflicts with existing multiplier zones
            let conflictsWithMultipliers = false;
            for (const existingMultiplier of multiplierZones) {
                const distance = Math.sqrt(
                    Math.pow(x - existingMultiplier.centerX, 2) + Math.pow(y - existingMultiplier.centerY, 2)
                );
                if (distance < minDistance) {
                    conflictsWithMultipliers = true;
                    break;
                }
            }
            
            // Check if position conflicts with existing cash zones
            const conflictsWithCashZonesCheck = conflictsWithCashZones(x, y, minDistance);
            
            // Check if position conflicts with existing level up zones
            const conflictsWithLevelUpZonesCheck = conflictsWithLevelUpZones(x, y, minDistance);
            
            // Check if position conflicts with portals
            const conflictsWithPortalZones = conflictsWithPortals(x, y, minDistance);
            
            if (conflictsWithWalls || conflictsWithMultipliers || conflictsWithCashZonesCheck || conflictsWithLevelUpZonesCheck || conflictsWithPortalZones) {
                continue; // Try again
            }
            
            // Create the level up zone with horizontal orientation (no rotation)
            const rotation = 0; // Horizontal orientation
            const levelUpZone = createLevelUpZone(x, y, rotation);
            
            // Add to existing walls list for future collision checking
            existingWalls.push({
                x: x,
                y: y,
                size: 100
            });
            
            placed = true;
        }
        
        if (!placed) {
            console.log(`Failed to place level up zone in ${zone.name} zone after 50 attempts`);
        }
    }
    
    console.log(`Generated ${levelUpZones.length} random level up zones (1 in each of the 3 vertical zones)`);
}

// Initialize drop 10 button state
updateDropButtonState();
updateDropTestButtonState();

// Helper function to check if a position conflicts with any portal zones
function conflictsWithPortals(x, y, minDistance = 100) {
    for (const portal of portalZones) {
        const distance = Math.sqrt(
            Math.pow(x - portal.centerX, 2) + Math.pow(y - portal.centerY, 2)
        );
        if (distance < minDistance) {
            return true;
        }
    }
    return false;
}

// Helper function to check if a position conflicts with any cash zones
function conflictsWithCashZones(x, y, minDistance = 100) {
    for (const cashZone of cashZones) {
        const distance = Math.sqrt(
            Math.pow(x - cashZone.centerX, 2) + Math.pow(y - cashZone.centerY, 2)
        );
        if (distance < minDistance) {
            return true;
        }
    }
    return false;
}

// Helper function to check if a position conflicts with any level up zones
function conflictsWithLevelUpZones(x, y, minDistance = 100) {
    for (const levelUpZone of levelUpZones) {
        const distance = Math.sqrt(
            Math.pow(x - levelUpZone.centerX, 2) + Math.pow(y - levelUpZone.centerY, 2)
        );
        if (distance < minDistance) {
            return true;
        }
    }
    return false;
}

// Function to generate random portals at game start
function generateRandomPortals() {
    const canvasWidth = CANVAS_CONFIG.width;
    const canvasHeight = CANVAS_CONFIG.height;
    const margin = 50; // Margin from edges
    
    // Randomly choose between bottom-left (0) or bottom-right (1) corner for blue portal
    const bluePortalCorner = Math.random() < 0.5 ? 0 : 1;
    
    let blueCenterX, blueCenterY;
    let orangeCenterX, orangeCenterY;
    
    if (bluePortalCorner === 0) {
        // Blue portal in bottom-left corner
        blueCenterX = margin + ZONE_CONFIG.portal.width / 2;
        blueCenterY = canvasHeight - margin - ZONE_CONFIG.portal.height / 2 - 50; // Raised by 50 pixels
        
        // Orange portal in top-right corner
        orangeCenterX = canvasWidth - margin - ZONE_CONFIG.portal.width / 2;
        orangeCenterY = margin + ZONE_CONFIG.portal.height / 2;
    } else {
        // Blue portal in bottom-right corner
        blueCenterX = canvasWidth - margin - ZONE_CONFIG.portal.width / 2;
        blueCenterY = canvasHeight - margin - ZONE_CONFIG.portal.height / 2 - 50; // Raised by 50 pixels
        
        // Orange portal in top-left corner
        orangeCenterX = margin + ZONE_CONFIG.portal.width / 2;
        orangeCenterY = margin + ZONE_CONFIG.portal.height / 2;
    }
    
    // Create the blue (IN) portal
    createPortalZone(blueCenterX, blueCenterY, 'blue');
    
    // Create the orange (OUT) portal
    createPortalZone(orangeCenterX, orangeCenterY, 'orange');
    
    console.log(`Generated portals: Blue at (${blueCenterX}, ${blueCenterY}), Orange at (${orangeCenterX}, ${orangeCenterY})`);
}

// Create the permanent bottom cash zone
createPermanentBottomCashZone();

// Generate random portals at game start (FIRST)
generateRandomPortals();

// Generate random walls at game start (SECOND - avoids portals)
generateRandomWalls();

// Generate random multipliers at game start (THIRD - avoids portals and walls)
generateRandomMultipliers();

// Generate random cash zones at game start (FOURTH - avoids portals, walls, and multipliers)
generateRandomCashZones();

// Generate random level up zones at game start (FIFTH - avoids portals, walls, multipliers, and cash zones)
generateRandomLevelUpZones();

// Calculate initial spawn position for turn 1
calculateSpawnPosition();

// Start the simulation
requestAnimationFrame(gameLoop);