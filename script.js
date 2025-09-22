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

// Region placement configuration
const REGION_PLACEMENT = {
    minDistance: 75 // Minimum distance between region centers
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
    
    // Region Colors
    multiplierRegion: 'rgba(156, 136, 255, 0.3)',
    multiplierRegionBorder: '#9c88ff',
    portalBlue: 'rgba(0, 123, 255, 0.3)',
    portalBlueBorder: '#007bff',
    portalOrange: 'rgba(255, 165, 0, 0.3)',
    portalOrangeBorder: '#ffa500',
    cashRegion: 'rgba(46, 213, 115, 0.3)',
    cashRegionBorder: '#2ed573',
    levelUpRegion: 'rgba(255, 107, 53, 0.3)',
    levelUpRegionBorder: '#ff6b35',
    
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

// Region configuration
const REGION_CONFIG = {
    multiplier: {
        width: 90,
        height: 20,
        color: COLORS.multiplierRegion,
        borderColor: COLORS.multiplierRegionBorder,
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
        color: COLORS.cashRegion,
        borderColor: COLORS.cashRegionBorder,
        dash: [5, 5],
        lineWidth: 2
    },
    levelUp: {
        width: 90,
        height: 20,
        color: COLORS.levelUpRegion,
        borderColor: COLORS.levelUpRegionBorder,
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
        name: 'Multiplier Region Tool',
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
        name: 'Cash Region Tool',
        activeName: 'Exit Cash Tool',
        color: COLORS.cashTool,
        activeColor: COLORS.cashToolActive,
        cursor: 'crosshair'
    },
    levelUp: {
        name: 'Level Up Region Tool',
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

// Add collision event listener for regions
Events.on(engine, 'collisionStart', function(event) {
    const pairs = event.pairs;
    
    for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];
        const bodyA = pair.bodyA;
        const bodyB = pair.bodyB;
        
        // Check if one is a ball and the other is a region
        let ball = null;
        let region = null;
        
        if (bodyA.circleRadius && bodyB.isSensor) {
            ball = bodyA;
            region = bodyB;
        } else if (bodyB.circleRadius && bodyA.isSensor) {
            ball = bodyB;
            region = bodyA;
        }
        
        if (ball && region) {
            // Find which region this body belongs to
            const multiplierRegion = multiplierRegions.find(r => r.body === region);
            const portalRegion = portalRegions.find(r => r.body === region);
            const cashRegion = cashRegions.find(r => r.body === region);
            const levelUpRegion = levelUpRegions.find(r => r.body === region);
            const permanentCashRegion = permanentBottomCashRegion && permanentBottomCashRegion.body === region;
            
            if (multiplierRegion) {
                handleMultiplierCollision(ball, multiplierRegion);
            } else if (portalRegion) {
                handlePortalCollision(ball, portalRegion);
            } else if (cashRegion) {
                handleCashCollision(ball, cashRegion);
            } else if (levelUpRegion) {
                handleLevelUpCollision(ball, levelUpRegion);
            } else if (permanentCashRegion) {
                handleCashCollision(ball, permanentBottomCashRegion);
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
    multiplierRegionWidth: 60, // Fixed width for multiplier regions
    multiplierRegionHeight: 20, // Fixed height for multiplier regions
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

// Ball upgrade system state
let currentBallLevel = 1; // Current level of balls dropped by drop button
let currentBallCount = 10; // Current number of balls dropped by drop button

// Ball spawn position for current turn
let currentSpawnX = null; // X position where balls will spawn this turn

// Test ball system
let testBallCount = 0;
let hadTestBallsInPreviousState = false;

// Stuck ball detection state
let lastBallDeletionTime = 0;
let stuckThreshold = 5000; // 5 seconds in milliseconds (kept for fallback)
let velocityThreshold = 0.5; // Minimum total velocity to consider balls as moving
let velocityDebounceTime = 1000; // 1 second debounce for velocity-based stuck detection
let lastVelocityCheckTime = 0;
let isStuck = false;

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

// Multiplier region state
let multiplierPlacementMode = false;
let multiplierFactor = 2;
let multiplierRegions = []; // Array to store multiplier regions

// Remover tool state
let removerMode = false;

// Portal tool state
let portalMode = false;
let portalRegions = []; // Array to store portal regions

// Cash tool state
let cashMode = false;
let cashRegions = []; // Array to store cash regions

// Level up tool state
let levelUpMode = false;
let levelUpRegions = []; // Array to store level up regions

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
        ctx.fillStyle = '#2ed573'; // Green color to match cash regions
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

// Item system state
let items = {
    wallSquare: { available: true, used: false },
    wallCircle: { available: true, used: false },
    wallTriangle: { available: true, used: false },
    wallHexagon: { available: true, used: false },
    cash: { available: true, used: false },
    multiplier: { available: true, used: false },
    levelUp: { available: true, used: false },
    ballLevel: { available: true, used: false },
    ballCount: { available: true, used: false }
};
let currentItemMode = null; // 'wallSquare', 'wallCircle', 'wallTriangle', 'wallHexagon', 'cash', 'multiplier', 'levelUp', or null

// Modal system state
let isModalOpen = false;
let isPlacingItem = false; // True when user is in placement mode for walls/regions

// Wall item preview state
let wallItemPreviewX = 0;
let wallItemPreviewY = 0;
let wallItemRotation = Math.PI / 4; // Default to 45 degrees
let regionItemRotation = 0; // Default to 0 degrees for region items

// Wall dragging state
let isDraggingWall = false;
let draggedWall = null;
let dragOffsetX = 0;
let dragOffsetY = 0;


// Permanent bottom cash region
let permanentBottomCashRegion = null;



// Function to exit all tool modes (but not item modes)
function exitAllToolModes() {
    // Reset all tool mode flags
    wallDrawingMode = false;
    multiplierPlacementMode = false;
    removerMode = false;
    portalMode = false;
    cashMode = false;
    levelUpMode = false;
    
    // Reset tool button text and colors
    wallToolButton.textContent = 'Wall Drawing Tool';
    wallToolButton.style.background = '#ffa502';
    multiplierToolButton.textContent = 'Multiplier Region Tool';
    multiplierToolButton.style.background = '#9c88ff';
    removerToolButton.textContent = 'Remover Tool';
    removerToolButton.style.background = '#ff4757';
    portalToolButton.textContent = 'Portal Tool';
    portalToolButton.style.background = '#00b894';
    cashToolButton.textContent = 'Cash Region Tool';
    cashToolButton.style.background = '#2ed573';
    levelUpToolButton.textContent = 'Level Up Region Tool';
    levelUpToolButton.style.background = '#ff6b35';
    
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
    
    // Reset cursor to pointer
    canvas.style.cursor = 'pointer';
}



// Mouse position tracking for cursor preview
let mouseX = 0;
let mouseY = 0;
let isMouseOnCanvas = false;

// Hover tracking for remover tool
let hoveredWall = null;
let hoveredMultiplierRegion = null;
let hoveredPortalRegion = null;
let hoveredCashRegion = null;
let hoveredLevelUpRegion = null;

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
const portalToolButton = document.getElementById('portalToolButton');
const cashToolButton = document.getElementById('cashToolButton');
const levelUpToolButton = document.getElementById('levelUpToolButton');
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
function createCircle(x, y, isTestBall = false, level = 1) {
    // Determine ball color based on level
    let ballColor;
    if (isTestBall) {
        ballColor = COLORS.testBall;
    } else {
        ballColor = getBallColorForLevel(level);
    }
    
    const circle = Bodies.circle(x, y, physicsSettings.circleSize, {
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
    
    // Reset test ball counter
    testBallCount = currentBallCount;
    updateTestBallDisplay();
    
    // Drop test balls from the pre-calculated position with spawn delay
    for (let i = 0; i < currentBallCount; i++) {
        setTimeout(() => {
            createCircle(currentSpawnX, spawnY, true, 1); // Test balls are always level 1
        }, i * physicsSettings.spawnDelay);
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

// Function to draw placement restriction circles around existing regions
function drawPlacementRestrictionCircles(regionType) {
    const minDistance = REGION_PLACEMENT.minDistance;
    
    // Draw circles around all existing regions
    const allRegions = [
        ...multiplierRegions.map(r => ({...r, type: 'multiplier'})),
        ...cashRegions.map(r => ({...r, type: 'cash'})),
        ...levelUpRegions.map(r => ({...r, type: 'levelUp'})),
        ...portalRegions.map(r => ({...r, type: 'portal'}))
    ];
    
    // Add permanent bottom cash region if it exists
    if (permanentBottomCashRegion) {
        allRegions.push({
            ...permanentBottomCashRegion,
            type: 'permanent_cash'
        });
    }
    
    allRegions.forEach(region => {
        // Use different colors based on region type
        if (region.type === regionType) {
            // Green for same type (level up opportunity)
            ctx.fillStyle = 'rgba(0, 255, 0, 0.3)'; // Semi-transparent green
        } else if (regionType === 'cash' && region.type === 'portal') {
            // Red for portal regions when placing cash regions (hard conflict)
            ctx.fillStyle = 'rgba(255, 0, 0, 0.3)'; // Semi-transparent red
        } else if (regionType === 'cash' && region.type === 'permanent_cash') {
            // Special handling for permanent cash region - draw the actual region bounds
            ctx.fillStyle = 'rgba(255, 0, 0, 0.3)'; // Semi-transparent red
            ctx.fillRect(region.x1, region.y1, region.x2 - region.x1, region.y2 - region.y1);
            return; // Skip the circle drawing for permanent cash region
        } else {
            // Red for different type (conflict)
            ctx.fillStyle = 'rgba(255, 0, 0, 0.3)'; // Semi-transparent red
        }
        
        // Draw circle for regular regions
        const centerX = (region.x1 + region.x2) / 2;
        const centerY = (region.y1 + region.y2) / 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, minDistance, 0, 2 * Math.PI);
        ctx.fill();
    });
}

// Function to check region placement and return collision info
function checkRegionPlacement(centerX, centerY, regionType) {
    const minDistance = REGION_PLACEMENT.minDistance;
    const result = {
        canPlace: true,
        levelUpTarget: null,
        hasConflict: false
    };
    
    // Check all existing regions
    const allRegions = [
        ...multiplierRegions.map(r => ({...r, type: 'multiplier', original: r})),
        ...cashRegions.map(r => ({...r, type: 'cash', original: r})),
        ...levelUpRegions.map(r => ({...r, type: 'levelUp', original: r})),
        ...portalRegions.map(r => ({...r, type: 'portal', original: r}))
    ];
    
    // Add permanent bottom cash region if it exists
    if (permanentBottomCashRegion) {
        allRegions.push({
            ...permanentBottomCashRegion,
            type: 'permanent_cash',
            original: permanentBottomCashRegion
        });
    }
    
    // First pass: check for same-type regions (upgrade opportunities)
    for (const region of allRegions) {
        if (region.type === regionType) {
            // Check if the new region would overlap with the buffer area around the existing same-type region
            if (checkRegionOverlapWithBuffer(centerX, centerY, regionType, region, minDistance)) {
                // Found a same-type region nearby - this is an upgrade opportunity
                result.levelUpTarget = region.original; // Return reference to original region
                result.canPlace = true; // Can place for level up
                return result; // Return immediately - upgrade overrides all other conflicts
            }
        }
    }
    
    // Second pass: check for conflicts with different-type regions
    for (const region of allRegions) {
        // Special handling for permanent cash region - always check for overlap regardless of distance
        if (regionType === 'cash' && region.type === 'permanent_cash') {
            if (checkRectangularOverlap(centerX, centerY, regionType, region)) {
                result.canPlace = false;
                result.hasConflict = true;
                return result; // Return immediately - this is a hard conflict
            }
            continue; // Skip the distance-based check for permanent cash region
        }
        
        // Check for geometric overlap with the restricted area (minDistance buffer around existing regions)
        if (checkRegionOverlapWithBuffer(centerX, centerY, regionType, region, minDistance)) {
            // Check if this is a special case where cash regions cannot overlap
            if (regionType === 'cash' && region.type === 'portal') {
                // Cash regions cannot overlap with portal regions
                result.canPlace = false;
                result.hasConflict = true;
                return result; // Return immediately - this is a hard conflict
            } else if (region.type !== regionType) {
                // Found a different-type region nearby - this is a conflict
                result.canPlace = false;
                result.hasConflict = true;
            }
        }
    }
    
    return result;
}

// Function to check for rectangular overlap between a new region and an existing region
function checkRectangularOverlap(centerX, centerY, regionType, existingRegion) {
    // Get dimensions for the new region based on type
    let newWidth, newHeight;
    if (regionType === 'cash') {
        newWidth = REGION_CONFIG.cash.width;
        newHeight = REGION_CONFIG.cash.height;
    } else {
        // Default dimensions for other region types
        newWidth = 100;
        newHeight = 50;
    }
    
    // Calculate bounds for the new region
    const newLeft = centerX - newWidth / 2;
    const newRight = centerX + newWidth / 2;
    const newTop = centerY - newHeight / 2;
    const newBottom = centerY + newHeight / 2;
    
    // Get bounds for the existing region
    const existingLeft = existingRegion.x1;
    const existingRight = existingRegion.x2;
    const existingTop = existingRegion.y1;
    const existingBottom = existingRegion.y2;
    
    // Check for overlap using standard rectangle overlap algorithm
    return !(newRight < existingLeft || 
             newLeft > existingRight || 
             newBottom < existingTop || 
             newTop > existingBottom);
}

// Function to check if a new region would overlap with the circular buffer area around an existing region
function checkRegionOverlapWithBuffer(centerX, centerY, regionType, existingRegion, bufferDistance) {
    // Get dimensions for the new region based on type
    let newWidth, newHeight;
    if (regionType === 'cash') {
        newWidth = REGION_CONFIG.cash.width;
        newHeight = REGION_CONFIG.cash.height;
    } else if (regionType === 'multiplier') {
        newWidth = REGION_CONFIG.multiplier.width;
        newHeight = REGION_CONFIG.multiplier.height;
    } else if (regionType === 'levelUp') {
        newWidth = REGION_CONFIG.levelUp.width;
        newHeight = REGION_CONFIG.levelUp.height;
    } else {
        // Default dimensions for other region types
        newWidth = 100;
        newHeight = 50;
    }
    
    // Get the center of the existing region
    const existingCenterX = (existingRegion.x1 + existingRegion.x2) / 2;
    const existingCenterY = (existingRegion.y1 + existingRegion.y2) / 2;
    
    // Calculate bounds for the new region
    const newLeft = centerX - newWidth / 2;
    const newRight = centerX + newWidth / 2;
    const newTop = centerY - newHeight / 2;
    const newBottom = centerY + newHeight / 2;
    
    // Check if any corner of the new region is within the circular buffer area
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
    
    // Also check if the existing region's center is within the new region
    // (in case the new region is large enough to contain the existing region's center)
    if (existingCenterX >= newLeft && existingCenterX <= newRight &&
        existingCenterY >= newTop && existingCenterY <= newBottom) {
        return true;
    }
    
    return false;
}

// Function to check if a new multiplier region placement conflicts with existing regions
function checkMultiplierRegionCollision(centerX, centerY) {
    const result = checkRegionPlacement(centerX, centerY, 'multiplier');
    return !result.canPlace;
}

// Function to create a multiplier region at the specified position
function createMultiplierRegion(centerX, centerY, factor, rotation = 0) {
    // Use centralized dimensions
    const width = REGION_CONFIG.multiplier.width;
    const height = REGION_CONFIG.multiplier.height;
    
    // Create Matter.js body for collision detection
    const body = Bodies.rectangle(centerX, centerY, width, height, {
        isStatic: true,
        isSensor: true, // Sensor bodies don't have physical collision response
        angle: rotation, // Apply rotation to the body
        render: {
            visible: false // We'll draw it manually in the render function
        }
    });
    
    // Create region object with Matter.js body reference
    const region = {
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
    
    multiplierRegions.push(region);
    return region;
}

// Function to create a portal region at the specified position
function createPortalRegion(centerX, centerY, color) {
    // Remove any existing portal of the same color
    for (let i = portalRegions.length - 1; i >= 0; i--) {
        if (portalRegions[i].color === color) {
            // Remove the old body from world
            World.remove(world, portalRegions[i].body);
            objectCount--;
            portalRegions.splice(i, 1);
        }
    }
    
    // Use centralized dimensions
    const width = REGION_CONFIG.portal.width;
    const height = REGION_CONFIG.portal.height;
    
    // Create Matter.js body for collision detection
    const body = Bodies.rectangle(centerX, centerY, width, height, {
        isStatic: true,
        isSensor: true, // Sensor bodies don't have physical collision response
        render: {
            visible: false // We'll draw it manually in the render function
        }
    });
    
    // Create region object with Matter.js body reference
    const region = {
        x1: centerX - width / 2,
        y1: centerY - height / 2,
        x2: centerX + width / 2,
        y2: centerY + height / 2,
        color: color, // 'blue' or 'orange'
        id: Date.now() + Math.random(), // Unique ID for tracking
        body: body // Reference to Matter.js body
    };
    
    // Add body to world
    World.add(world, body);
    objectCount++;
    objectCountElement.textContent = objectCount;
    
    portalRegions.push(region);
    return region;
}

// Function to check if a new cash region placement conflicts with existing regions
function checkCashRegionCollision(centerX, centerY) {
    const result = checkRegionPlacement(centerX, centerY, 'cash');
    return !result.canPlace;
}

// Function to create a cash region at the specified position
function createCashRegion(centerX, centerY, rotation = 0) {
    // Use centralized dimensions
    const width = REGION_CONFIG.cash.width;
    const height = REGION_CONFIG.cash.height;
    
    // Create Matter.js body for collision detection
    const body = Bodies.rectangle(centerX, centerY, width, height, {
        isStatic: true,
        isSensor: true, // Sensor bodies don't have physical collision response
        angle: rotation, // Apply rotation to the body
        render: {
            visible: false // We'll draw it manually in the render function
        }
    });
    
    // Create region object with Matter.js body reference
    const region = {
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
    
    cashRegions.push(region);
    return region;
}

// Function to check if a new level up region placement conflicts with existing regions
function checkLevelUpRegionCollision(centerX, centerY) {
    const result = checkRegionPlacement(centerX, centerY, 'levelUp');
    return !result.canPlace;
}

// Function to create a level up region at the specified position
function createLevelUpRegion(centerX, centerY, rotation = 0) {
    // Use centralized dimensions
    const width = REGION_CONFIG.levelUp.width;
    const height = REGION_CONFIG.levelUp.height;
    
    // Create Matter.js body for collision detection
    const body = Bodies.rectangle(centerX, centerY, width, height, {
        isStatic: true,
        isSensor: true, // Sensor bodies don't have physical collision response
        angle: rotation, // Apply rotation to the body
        render: {
            visible: false // We'll draw it manually in the render function
        }
    });
    
    // Create region object with Matter.js body reference
    const region = {
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
    
    levelUpRegions.push(region);
    return region;
}

// Function to create the permanent bottom cash region
function createPermanentBottomCashRegion() {
    // Create a region that occupies only the middle 50% of the canvas width
    const canvasWidth = CANVAS_CONFIG.width;
    const width = canvasWidth * 0.5; // 50% of canvas width
    const height = 30; // Make it a bit taller than regular cash regions
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
    
    // Create region object with Matter.js body reference
    const region = {
        x1: centerX - width / 2,
        y1: centerY - height / 2,
        x2: centerX + width / 2,
        y2: centerY + height / 2,
        level: 1, // Start at level 1
        id: 'permanent_bottom_cash', // Special ID for the permanent region
        body: body, // Reference to Matter.js body
        isPermanent: true // Flag to identify this as the permanent region
    };
    
    // Add body to world
    World.add(world, body);
    objectCount++;
    objectCountElement.textContent = objectCount;
    
    permanentBottomCashRegion = region;
    return region;
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

// Function to check if a point is inside a multiplier region
function isPointInMultiplierRegion(x, y, region) {
    return x >= region.x1 && x <= region.x2 && y >= region.y1 && y <= region.y2;
}

// Function to check if a point is inside a portal region
function isPointInPortalRegion(x, y, region) {
    return x >= region.x1 && x <= region.x2 && y >= region.y1 && y <= region.y2;
}

// Function to check if a point is inside a cash region
function isPointInCashRegion(x, y, region) {
    return x >= region.x1 && x <= region.x2 && y >= region.y1 && y <= region.y2;
}

// Function to check if a point is inside a level up region
function isPointInLevelUpRegion(x, y, region) {
    return x >= region.x1 && x <= region.x2 && y >= region.y1 && y <= region.y2;
}

// Function to check what object is being hovered over
function getHoveredObject(x, y) {
    // First check portal regions (they're drawn on top)
    for (let i = portalRegions.length - 1; i >= 0; i--) {
        const region = portalRegions[i];
        if (isPointInPortalRegion(x, y, region)) {
            return { type: 'portal', object: region };
        }
    }
    
    // Then check level up regions
    for (let i = levelUpRegions.length - 1; i >= 0; i--) {
        const region = levelUpRegions[i];
        if (isPointInLevelUpRegion(x, y, region)) {
            return { type: 'levelUp', object: region };
        }
    }
    
    // Then check cash regions
    for (let i = cashRegions.length - 1; i >= 0; i--) {
        const region = cashRegions[i];
        if (isPointInCashRegion(x, y, region)) {
            return { type: 'cash', object: region };
        }
    }
    
    // Then check multiplier regions
    for (let i = multiplierRegions.length - 1; i >= 0; i--) {
        const region = multiplierRegions[i];
        if (isPointInMultiplierRegion(x, y, region)) {
            return { type: 'multiplier', object: region };
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
        // Skip main tank walls, balls, and region bodies
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

// Function to remove wall, multiplier region, portal region, cash region, or level up region at click point
function removeObjectAt(x, y) {
    // First check portal regions (they're drawn on top)
    for (let i = portalRegions.length - 1; i >= 0; i--) {
        const region = portalRegions[i];
        if (isPointInPortalRegion(x, y, region)) {
            // Remove the Matter.js body
            World.remove(world, region.body);
            objectCount--;
            objectCountElement.textContent = objectCount;
            portalRegions.splice(i, 1);
            console.log('Removed portal region');
            return true;
        }
    }
    
    // Then check level up regions
    for (let i = levelUpRegions.length - 1; i >= 0; i--) {
        const region = levelUpRegions[i];
        if (isPointInLevelUpRegion(x, y, region)) {
            // Remove the Matter.js body
            World.remove(world, region.body);
            objectCount--;
            objectCountElement.textContent = objectCount;
            levelUpRegions.splice(i, 1);
            console.log('Removed level up region');
            return true;
        }
    }
    
    // Then check cash regions
    for (let i = cashRegions.length - 1; i >= 0; i--) {
        const region = cashRegions[i];
        if (isPointInCashRegion(x, y, region)) {
            // Remove the Matter.js body
            World.remove(world, region.body);
            objectCount--;
            objectCountElement.textContent = objectCount;
            cashRegions.splice(i, 1);
            console.log('Removed cash region');
            return true;
        }
    }
    
    // Then check multiplier regions
    for (let i = multiplierRegions.length - 1; i >= 0; i--) {
        const region = multiplierRegions[i];
        if (isPointInMultiplierRegion(x, y, region)) {
            // Remove the Matter.js body
            World.remove(world, region.body);
            objectCount--;
            objectCountElement.textContent = objectCount;
            multiplierRegions.splice(i, 1);
            console.log('Removed multiplier region');
            return true;
        }
    }
    
    // Then check walls (excluding the main tank walls)
    const bodies = Matter.Composite.allBodies(world);
    for (let i = bodies.length - 1; i >= 0; i--) {
        const body = bodies[i];
        // Skip main tank walls, balls, and region bodies
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
            body !== permanentBottomCashRegion?.body) {
            World.remove(world, body);
        }
    });
    // Clear multiplier regions, portal regions, cash regions, and level up regions arrays
    multiplierRegions = [];
    portalRegions = [];
    cashRegions = [];
    levelUpRegions = [];
    objectCount = 1; // Keep count of 1 for the permanent bottom cash region
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
    updateTestBallDisplay();
    
    // Reset test ball tracking state
    hadTestBallsInPreviousState = false;
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

// Function to force clear all balls (for stuck ball recovery)
function forceClearBalls() {
    const bodies = Matter.Composite.allBodies(world);
    let regularBallCount = 0;
    
    bodies.forEach(body => {
        // Only remove balls, keep walls and regions
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
    
    // Update button state (this will handle turn increment if appropriate)
    updateDropButtonState();
    
    // Reset test ball state
    testBallCount = 0;
    updateTestBallDisplay();
    
    // Reset test ball tracking state
    hadTestBallsInPreviousState = false;
}

// Function to update drop test button state
function updateDropTestButtonState() {
    const hasTestBalls = hasTestBallsOnCanvas();
    
    // Check if modal is open or if we're in placement mode
    if (isModalOpen || isPlacingItem) {
        // Modal is open or placing item - disable drop test button
        dropTestButton.disabled = true;
        dropTestButton.style.background = '#cccccc';
        dropTestButton.style.cursor = 'not-allowed';
        dropTestButton.textContent = 'Drop Test';
        return;
    }
    
    if (hasTestBalls) {
        // Test balls are active - disable button
        dropTestButton.disabled = true;
        dropTestButton.style.background = '#cccccc';
        dropTestButton.style.cursor = 'not-allowed';
        dropTestButton.textContent = 'Test Active...';
    } else {
        // No test balls - ready to drop test balls
        dropTestButton.disabled = false;
        dropTestButton.style.background = '#ff6b6b';
        dropTestButton.style.cursor = 'pointer';
        dropTestButton.textContent = 'Drop Test';
    }
}

// Function to update drop button state based on whether balls are present
function updateDropButtonState() {
    const hasBalls = hasBallsOnCanvas();
    const hasTestBalls = hasTestBallsOnCanvas();
    const wasEnabled = isDropButtonEnabled;
    isDropButtonEnabled = !hasBalls;
    
    // Check if modal is open or if we're in placement mode
    if (isModalOpen || isPlacingItem) {
        // Modal is open or placing item - disable drop button
        drop10Button.disabled = true;
        drop10Button.style.background = '#cccccc';
        drop10Button.style.cursor = 'not-allowed';
        if (isModalOpen) {
            drop10Button.textContent = 'Placing item...';
        } else if (isPlacingItem) {
            drop10Button.textContent = 'Place Item...';
        }
        return; // Don't proceed with normal logic
    }
    
    if (isStuck) {
        // Stuck state - show force clear option
        drop10Button.disabled = false;
        drop10Button.style.background = '#ff4757'; // Red for force clear
        drop10Button.style.cursor = 'pointer';
        // Show "Stop Test" if there are test balls, otherwise "Force Next Turn"
        drop10Button.textContent = hasTestBalls ? 'Stop Test' : 'Force Next Turn';
    } else if (hasBalls) {
        // Normal active state - balls are moving
        drop10Button.disabled = true;
        drop10Button.style.background = '#cccccc';
        drop10Button.style.cursor = 'not-allowed';
        drop10Button.textContent = 'Balls Active...';
        
        // Track whether we currently have test balls for the next state transition
        hadTestBallsInPreviousState = hasTestBalls;
    } else {
        // No balls - ready for next turn
        drop10Button.disabled = false;
        drop10Button.style.background = '#ff6b35';
        drop10Button.style.cursor = 'pointer';
        updateDropButtonText(); // Use the function to get current ball count
        
        // Increment turn when button becomes ready (transition from disabled to enabled)
        // Only increment if we were just doing a regular ball drop, not a test ball
        if (!wasEnabled && isDropButtonEnabled) {
            // Only increment turn if the previous state had regular balls (not test balls)
            if (!hadTestBallsInPreviousState) {
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
    
    // Remove fallen balls (no longer gives money - handled by cash region)
    fallenBalls.forEach(ball => {
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
                }
            }
        } else {
            // Reset debounce timer and stuck state when velocity is above threshold
            lastVelocityCheckTime = 0;
            if (isStuck) {
                isStuck = false;
                updateDropButtonState();
            }
        }
    } else {
        // Reset stuck state and debounce timer when no balls are present
        isStuck = false;
        lastVelocityCheckTime = 0;
    }
}

// Function to handle multiplier region collision
function handleMultiplierCollision(ball, region) {
    // Check if this ball hasn't been multiplied by this region yet
    if (!ball.multipliedBy) {
        ball.multipliedBy = new Set();
    }
    
    if (!ball.multipliedBy.has(region.id)) {
        const newBallCount = region.factor - 1; // -1 because the original ball already exists
        const ballX = ball.position.x;
        const ballY = ball.position.y;
        const ballRadius = ball.circleRadius;
        
        for (let i = 0; i < newBallCount; i++) {
            // Create new ball with slight offset to avoid overlap
            const offsetX = (Math.random() - 0.5) * ballRadius * 2;
            const offsetY = (Math.random() - 0.5) * ballRadius * 2;
            const newBall = createCircle(ballX + offsetX, ballY + offsetY, ball.isTestBall, ball.level);
            
            // Give the new ball some velocity similar to the original
            const velocityMultiplier = 0.5 + Math.random() * 0.5; // 0.5 to 1.0
            Body.setVelocity(newBall, {
                x: ball.velocity.x * velocityMultiplier,
                y: ball.velocity.y * velocityMultiplier
            });
            
            // Mark the new ball as multiplied by this region
            if (!newBall.multipliedBy) {
                newBall.multipliedBy = new Set();
            }
            newBall.multipliedBy.add(region.id);
            
            // Inherit portal status from parent ball
            newBall.hasUsedPortal = ball.hasUsedPortal;
            newBall.render.fillStyle = ball.render.fillStyle;
            
            // If this is a test ball, increment the counter
            if (ball.isTestBall) {
                testBallCount++;
                updateTestBallDisplay();
            }
        }
        
        // Mark the original ball as multiplied by this region
        ball.multipliedBy.add(region.id);
    }
}

// Function to handle portal region collision
function handlePortalCollision(ball, region) {
    if (region.color === 'blue' && !ball.hasUsedPortal) {
        // Find the corresponding orange portal
        const orangePortal = portalRegions.find(p => p.color === 'orange');
        
        if (orangePortal) {
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
            
            // Reset the ball's multiplier status so it can go through regions again
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

// Function to play a random pop sound
function playRandomPopSound() {
    try {
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

// Function to handle cash region collision
function handleCashCollision(ball, region) {
    // Skip cash regions for test balls
    if (ball.isTestBall) {
        return;
    }
    
    // Check if this ball hasn't triggered this cash region yet
    if (!ball.cashTriggeredBy) {
        ball.cashTriggeredBy = new Set();
    }
    
    if (!ball.cashTriggeredBy.has(region.id)) {
        // Add money equal to ball level * region level (e.g., level 2 ball in level 3 region = 6 dollars)
        
        // Safety check to prevent NaN values
        const ballLevel = ball.level || 1;
        const regionLevel = region.level || 1;
        const moneyToAdd = ballLevel * regionLevel;
        
        wallet.money += moneyToAdd;
        
        // Play random pop sound when money is earned
        playRandomPopSound();
        
        // Create money animation at ball position
        const ballPos = ball.position;
        moneyAnimations.push(new MoneyAnimation(ballPos.x, ballPos.y, moneyToAdd));
        
        // Mark this ball as having triggered this cash region
        ball.cashTriggeredBy.add(region.id);
        
        // Update display
        updateDisplayValues();
    }
}

// Function to handle level up region collision
function handleLevelUpCollision(ball, region) {
    // Skip level up regions for test balls
    if (ball.isTestBall) {
        return;
    }
    
    // Check if this ball hasn't been leveled up by this region yet
    if (!ball.leveledUpBy) {
        ball.leveledUpBy = new Set();
    }
    
    if (!ball.leveledUpBy.has(region.id)) {
        // Level up the ball by the region's level amount
        ball.level += region.level;
        
        // Update the ball's color to reflect the new level
        ball.render.fillStyle = getBallColorForLevel(ball.level);
        
        // Mark this ball as having been leveled up by this region
        ball.leveledUpBy.add(region.id);
        
        // Update display
        updateDisplayValues();
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
    
    // Select 4 random items: 2 wall items + 1 other item + 1 ball count
    const selectedItems = selectRandomItemsForTurn();
    updateModalWithSelectedItems(selectedItems);
    
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

// Function to handle item selection from modal
function selectItemFromModal(itemType) {
    if (!items[itemType].available) return;
    
    // Close modal first
    hideItemModal();
    
    // Categorize items into immediate effects vs placement items
    const immediateEffectItems = ['ballLevel', 'ballCount'];
    const placementItems = ['wallSquare', 'wallCircle', 'wallTriangle', 'wallHexagon', 'cash', 'multiplier', 'levelUp'];
    
    if (immediateEffectItems.includes(itemType)) {
        // Apply immediate effect and mark as used
        if (itemType === 'ballLevel') {
            useBallLevelItem();
        } else if (itemType === 'ballCount') {
            useBallCountItem();
        }
    } else if (placementItems.includes(itemType)) {
        // Enter placement mode
        enterItemPlacementMode(itemType);
    }
}

// Helper function to get all wall items
function getWallItems() {
    return ['wallSquare', 'wallCircle', 'wallTriangle', 'wallHexagon'];
}

// Helper function to get all non-wall items
function getNonWallItems() {
    return ['cash', 'ballCount'];
}

// Function to select 4 random items for the turn (2 wall + 1 other + 1 ball count)
function selectRandomItemsForTurn() {
    const wallItems = getWallItems();
    const nonWallItems = getNonWallItems();
    
    // Select 2 random wall items
    const selectedWallItems = [];
    const availableWallItems = [...wallItems];
    for (let i = 0; i < 2; i++) {
        const randomIndex = Math.floor(Math.random() * availableWallItems.length);
        selectedWallItems.push(availableWallItems.splice(randomIndex, 1)[0]);
    }
    
    // Select 1 random non-wall item (excluding ballCount since it's always included)
    const nonWallItemsWithoutBallCount = nonWallItems.filter(item => item !== 'ballCount');
    const randomNonWallIndex = Math.floor(Math.random() * nonWallItemsWithoutBallCount.length);
    const selectedNonWallItem = nonWallItemsWithoutBallCount[randomNonWallIndex];
    
    // Always include ballCount as the 4th option
    const selectedItems = [...selectedWallItems, selectedNonWallItem, 'ballCount'];
    console.log('Selected items for turn:', selectedItems);
    
    return selectedItems;
}

// Function to update modal with selected items
function updateModalWithSelectedItems(selectedItems) {
    const itemOptions = document.querySelectorAll('.item-option');
    
    // Hide all items first
    itemOptions.forEach(option => {
        option.style.display = 'none';
    });
    
    // Show only selected items
    selectedItems.forEach(itemType => {
        const option = document.querySelector(`[data-item="${itemType}"]`);
        if (option) {
            option.style.display = 'flex';
        }
    });
}


// Function to enter item placement mode
function enterItemPlacementMode(itemType) {
    isPlacingItem = true;
    currentItemMode = itemType;
    
    // Ensure mouse is considered on canvas when entering placement mode
    // This prevents flickering of red circles when transitioning from modal
    isMouseOnCanvas = true;
    
    // Update cursor
    canvas.style.cursor = 'none';
    
    // Update drop button state to reflect placement mode
    updateDropButtonState();
    
    // Force a render update to immediately show the placement circles
    // This ensures smooth transition from modal to placement mode
    render();
}

// Function to exit item placement mode
function exitItemPlacementMode() {
    isPlacingItem = false;
    currentItemMode = null;
    canvas.style.cursor = 'pointer';
    
    // Reset mouse state when exiting placement mode
    // This ensures proper state management for future interactions
    isMouseOnCanvas = false;
    
    // Re-enable drop button
    updateDropButtonState();
}

// Function to exit item mode
function exitItemMode() {
    currentItemMode = null;
    canvas.style.cursor = 'pointer';
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

// Function to place a cash region item
function placeCashRegionItem(x, y) {
    if (!items.cash.available) return false;
    
    // Check placement info
    const placementInfo = checkRegionPlacement(x, y, 'cash');
    
    if (!placementInfo.canPlace) {
        return false; // Cannot place here
    }
    
    if (placementInfo.levelUpTarget) {
        // Level up existing region
        placementInfo.levelUpTarget.level++;
    } else {
        // Create a new cash region
        const region = createCashRegion(x, y, regionItemRotation);
    }
    
    // Mark ALL items as used for this turn
    markAllItemsAsUsed();
    
    // Exit item mode
    exitItemMode();
    
    return true;
}

// Function to place a multiplier region item
function placeMultiplierRegionItem(x, y) {
    if (!items.multiplier.available) return false;
    
    // Check placement info
    const placementInfo = checkRegionPlacement(x, y, 'multiplier');
    
    if (!placementInfo.canPlace) {
        return false; // Cannot place here
    }
    
    if (placementInfo.levelUpTarget) {
        // Level up existing region
        placementInfo.levelUpTarget.level++;
        placementInfo.levelUpTarget.factor = placementInfo.levelUpTarget.level + 1; // factor = level + 1
    } else {
        // Create a new multiplier region with x2 multiplier
        const region = createMultiplierRegion(x, y, 2, regionItemRotation);
    }
    
    // Mark ALL items as used for this turn
    markAllItemsAsUsed();
    
    // Exit item mode
    exitItemMode();
    
    return true;
}

// Function to place a level up region item
function placeLevelUpRegionItem(x, y) {
    if (!items.levelUp.available) return false;
    
    // Check placement info
    const placementInfo = checkRegionPlacement(x, y, 'levelUp');
    
    if (!placementInfo.canPlace) {
        return false; // Cannot place here
    }
    
    if (placementInfo.levelUpTarget) {
        // Level up existing region
        placementInfo.levelUpTarget.level++;
    } else {
        // Create a new level up region
        const region = createLevelUpRegion(x, y, regionItemRotation);
    }
    
    // Mark ALL items as used for this turn
    markAllItemsAsUsed();
    
    // Exit item mode
    exitItemMode();
    
    return true;
}

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
    testBallCountElement.textContent = '🔴 ' + testBallCount;
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
    currentBallLevelValue.textContent = `Level: ${currentBallLevel}`;
    currentBallLevelValue.style.color = color;
    currentBallLevelValue.style.fontWeight = 'bold';
}

// Function to update display values
function updateDisplayValues() {
    gravityValue.textContent = physicsSettings.gravity.toFixed(1);
    sizeValue.textContent = physicsSettings.circleSize;
    bounceValue.textContent = physicsSettings.bounciness.toFixed(1);
    frictionValue.textContent = physicsSettings.friction.toFixed(1);
    densityValue.textContent = physicsSettings.density.toFixed(3);
    // Ball inventory display removed
    moneyValue.textContent = '💵 $' + numberFormatShort(wallet.money);
    diamondsValue.textContent = '💎 ' + numberFormatShort(wallet.diamonds);
    keysValue.textContent = '🗝️ ' + numberFormatShort(wallet.keys);
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
    
    // Add click listeners to all item options
    itemOptions.forEach(option => {
        option.addEventListener('click', function() {
            const itemType = this.getAttribute('data-item');
            selectItemFromModal(itemType);
        });
    });
    
    // Close modal when clicking backdrop
    itemModalBackdrop.addEventListener('click', function() {
        // Don't close modal on backdrop click - user must select an item
    });
    
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
    
    // Don't allow dropping test balls if there are already test balls on the canvas
    if (hasTestBallsOnCanvas()) {
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
        canvas.style.cursor = 'pointer';
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
        multiplierToolButton.textContent = 'Multiplier Region Tool';
        multiplierToolButton.style.background = '#9c88ff';
        multiplierFactorDisplay.style.display = 'none';
        canvas.style.cursor = 'pointer';
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
        canvas.style.cursor = 'pointer';
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
        canvas.style.cursor = 'pointer';
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
        cashToolButton.textContent = 'Cash Region Tool';
        cashToolButton.style.background = '#2ed573';
        canvas.style.cursor = 'pointer';
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
        levelUpToolButton.textContent = 'Level Up Region Tool';
        levelUpToolButton.style.background = '#ff6b35';
        canvas.style.cursor = 'pointer';
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
//         canvas.style.cursor = 'pointer';
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
//         canvas.style.cursor = 'pointer';
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
    
    // Check if clicking on a wall for dragging (only when not in any tool mode)
    if (!removerMode && !wallDrawingMode && !multiplierPlacementMode && !portalMode && !cashMode && !levelUpMode && !currentItemMode) {
        const wall = findWallAt(x, y);
        if (wall) {
            // Start dragging the wall
            isDraggingWall = true;
            draggedWall = wall;
            dragOffsetX = x - wall.position.x;
            dragOffsetY = y - wall.position.y;
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
        // Place a multiplier region at the click point
        createMultiplierRegion(x, y, multiplierFactor);
    } else if (portalMode) {
        // Place a portal region at the click point (left click = blue, right click = orange)
        if (event.button === 0) { // Left click
            createPortalRegion(x, y, 'blue');
        } else if (event.button === 2) { // Right click
            createPortalRegion(x, y, 'orange');
        }
    } else if (cashMode) {
        // Place a cash region at the click point
        createCashRegion(x, y);
    } else if (levelUpMode) {
        // Place a level up region at the click point
        createLevelUpRegion(x, y);
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
        // Place a cash region item at the click point
        placeCashRegionItem(x, y);
    } else if (currentItemMode === 'multiplier') {
        // Place a multiplier region item at the click point
        placeMultiplierRegionItem(x, y);
    } else if (currentItemMode === 'levelUp') {
        // Place a level up region item at the click point
        placeLevelUpRegionItem(x, y);
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
    hoveredMultiplierRegion = null;
    hoveredPortalRegion = null;
    hoveredCashRegion = null;
    hoveredLevelUpRegion = null;
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
    
    // Update hover tracking for remover tool
    if (removerMode) {
        const hovered = getHoveredObject(x, y);
        if (hovered) {
            if (hovered.type === 'wall') {
                hoveredWall = hovered.object;
                hoveredMultiplierRegion = null;
                hoveredPortalRegion = null;
                hoveredCashRegion = null;
                hoveredLevelUpRegion = null;
            } else if (hovered.type === 'multiplier') {
                hoveredMultiplierRegion = hovered.object;
                hoveredWall = null;
                hoveredPortalRegion = null;
                hoveredCashRegion = null;
                hoveredLevelUpRegion = null;
            } else if (hovered.type === 'portal') {
                hoveredPortalRegion = hovered.object;
                hoveredWall = null;
                hoveredMultiplierRegion = null;
                hoveredCashRegion = null;
                hoveredLevelUpRegion = null;
            } else if (hovered.type === 'cash') {
                hoveredCashRegion = hovered.object;
                hoveredWall = null;
                hoveredMultiplierRegion = null;
                hoveredPortalRegion = null;
                hoveredLevelUpRegion = null;
            } else if (hovered.type === 'levelUp') {
                hoveredLevelUpRegion = hovered.object;
                hoveredWall = null;
                hoveredMultiplierRegion = null;
                hoveredPortalRegion = null;
                hoveredCashRegion = null;
            }
        } else {
            hoveredWall = null;
            hoveredMultiplierRegion = null;
            hoveredPortalRegion = null;
            hoveredCashRegion = null;
            hoveredLevelUpRegion = null;
        }
    } else {
        hoveredWall = null;
        hoveredMultiplierRegion = null;
        hoveredPortalRegion = null;
        hoveredCashRegion = null;
        hoveredLevelUpRegion = null;
        
        // Check if hovering over a wall for potential dragging
        const wall = findWallAt(x, y);
        canvas.style.cursor = wall ? 'grab' : 'pointer';
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

// Mouse wheel handler for wall item and region item rotation
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
    // Handle wheel events when in region item mode
    else if (currentItemMode === 'cash' || currentItemMode === 'multiplier' || currentItemMode === 'levelUp') {
        event.preventDefault();
        
        // Adjust rotation based on wheel direction
        const rotationStep = 0.1; // radians (about 5.7 degrees)
        if (event.deltaY < 0) {
            // Scroll up - increase rotation
            regionItemRotation += rotationStep;
        } else {
            // Scroll down - decrease rotation
            regionItemRotation -= rotationStep;
        }
        
        // Keep rotation between 0 and 2π
        regionItemRotation = ((regionItemRotation % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
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
    
    // Draw all bodies
    const bodies = Matter.Composite.allBodies(world);
    
    bodies.forEach(body => {
        if (body.render.visible === false) return;
        
        // Skip sensor bodies (regions) - they're drawn manually
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
    
    // Draw portal regions
    portalRegions.forEach(region => {
        // Calculate center of region
        const centerX = (region.x1 + region.x2) / 2;
        const centerY = (region.y1 + region.y2) / 2;
        
        // Check if this region is being hovered over in remover mode
        const isHovered = removerMode && hoveredPortalRegion === region;
        
        // Draw the region rectangle
        ctx.beginPath();
        ctx.rect(region.x1, region.y1, region.x2 - region.x1, region.y2 - region.y1);
        
        // Set color based on portal type and hover state
        if (isHovered) {
            ctx.fillStyle = `rgba(255, 71, 87, 0.5)`; // Red if hovered
        } else if (region.color === 'blue') {
            ctx.fillStyle = REGION_CONFIG.portal.colors.blue;
        } else {
            ctx.fillStyle = REGION_CONFIG.portal.colors.orange;
        }
        ctx.fill();
        
        // Set border color
        if (isHovered) {
            ctx.strokeStyle = COLORS.hover; // Red if hovered
        } else if (region.color === 'blue') {
            ctx.strokeStyle = REGION_CONFIG.portal.borders.blue;
        } else {
            ctx.strokeStyle = REGION_CONFIG.portal.borders.orange;
        }
        ctx.lineWidth = isHovered ? 3 : REGION_CONFIG.portal.lineWidth;
        ctx.setLineDash(REGION_CONFIG.portal.dash);
        ctx.stroke();
        ctx.setLineDash([]); // Reset line dash
        
        // Draw portal label text
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Draw black outline
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        const labelText = region.color === 'blue' ? 'IN' : 'OUT';
        ctx.strokeText(labelText, centerX, centerY);
        
        // Draw light text
        ctx.fillStyle = '#e0e0e0';
        ctx.fillText(labelText, centerX, centerY);
    });
    
    // Draw multiplier regions
    multiplierRegions.forEach(region => {
        // Calculate center of region
        const centerX = region.centerX || (region.x1 + region.x2) / 2;
        const centerY = region.centerY || (region.y1 + region.y2) / 2;
        const width = region.width || (region.x2 - region.x1);
        const height = region.height || (region.y2 - region.y1);
        const rotation = region.rotation || 0;
        
        // Check if this region is being leveled up (show upgraded version)
        let isBeingLeveledUp = false;
        if (currentItemMode === 'multiplier' && isMouseOnCanvas) {
            const placementInfo = checkRegionPlacement(mouseX, mouseY, 'multiplier');
            isBeingLeveledUp = placementInfo.levelUpTarget === region;
        }
        
        // Check if this region is being hovered over in remover mode
        const isHovered = removerMode && hoveredMultiplierRegion === region;
        
        // Draw the rotated region rectangle
        if (isBeingLeveledUp) {
            // Show upgraded version with breathing effect
            const time = Date.now() * 0.005; // Slow breathing
            const scale = 1 + Math.sin(time) * 0.1; // 10% size variation
            
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(rotation);
            ctx.scale(scale, scale);
            ctx.translate(-width/2, -height/2);
            
            // Draw the region rectangle with upgrade colors
            ctx.beginPath();
            ctx.rect(0, 0, width, height);
            ctx.fillStyle = 'rgba(0, 255, 0, 0.7)'; // Green for upgrade
            ctx.strokeStyle = '#00ff00';
            ctx.fill();
            ctx.lineWidth = REGION_CONFIG.multiplier.lineWidth;
            ctx.setLineDash(REGION_CONFIG.multiplier.dash);
            ctx.stroke();
            ctx.setLineDash([]); // Reset line dash
            ctx.restore();
            
            // Draw upgraded factor text (unrotated)
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            const newFactor = region.factor + 1; // Show upgraded factor
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
            drawRotatedRect(
                ctx, 
                centerX, 
                centerY, 
                width, 
                height, 
                rotation,
                isHovered ? `rgba(255, 71, 87, 0.5)` : REGION_CONFIG.multiplier.color,
                isHovered ? COLORS.hover : REGION_CONFIG.multiplier.borderColor,
                isHovered ? 3 : REGION_CONFIG.multiplier.lineWidth,
                REGION_CONFIG.multiplier.dash
            );
            
            // Draw multiplier factor text (unrotated)
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Draw black outline
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.strokeText(`×${region.factor}`, centerX, centerY);
            
            // Draw light text
            ctx.fillStyle = '#e0e0e0';
            ctx.fillText(`×${region.factor}`, centerX, centerY);
        }
    });
    
    // Draw cash regions
    cashRegions.forEach(region => {
        // Calculate center of region
        const centerX = region.centerX || (region.x1 + region.x2) / 2;
        const centerY = region.centerY || (region.y1 + region.y2) / 2;
        const width = region.width || (region.x2 - region.x1);
        const height = region.height || (region.y2 - region.y1);
        const rotation = region.rotation || 0;
        
        // Check if this region is being leveled up (show upgraded version)
        let isBeingLeveledUp = false;
        if (currentItemMode === 'cash' && isMouseOnCanvas) {
            const placementInfo = checkRegionPlacement(mouseX, mouseY, 'cash');
            isBeingLeveledUp = placementInfo.levelUpTarget === region;
        }
        
        // Check if this region is being hovered over in remover mode
        const isHovered = removerMode && hoveredCashRegion === region;
        
        // Draw the rotated region rectangle
        if (isBeingLeveledUp) {
            // Show upgraded version with breathing effect
            const time = Date.now() * 0.005; // Slow breathing
            const scale = 1 + Math.sin(time) * 0.1; // 10% size variation
            
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(rotation);
            ctx.scale(scale, scale);
            ctx.translate(-width/2, -height/2);
            
            // Draw the region rectangle with upgrade colors
            ctx.beginPath();
            ctx.rect(0, 0, width, height);
            ctx.fillStyle = 'rgba(0, 255, 0, 0.7)'; // Green for upgrade
            ctx.strokeStyle = '#00ff00';
            ctx.fill();
            ctx.lineWidth = REGION_CONFIG.cash.lineWidth;
            ctx.setLineDash(REGION_CONFIG.cash.dash);
            ctx.stroke();
            ctx.setLineDash([]); // Reset line dash
            ctx.restore();
            
            // Draw upgraded level text (unrotated)
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            const displayText = `💵${region.level + 1}`; // Show upgraded level
            
            // Draw black outline
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.strokeText(displayText, centerX, centerY);
            
            // Draw text
            ctx.fillStyle = '#e0e0e0';
            ctx.fillText(displayText, centerX, centerY);
        } else {
            // Normal drawing
            drawRotatedRect(
                ctx, 
                centerX, 
                centerY, 
                width, 
                height, 
                rotation,
                isHovered ? `rgba(255, 71, 87, 0.5)` : REGION_CONFIG.cash.color,
                isHovered ? COLORS.hover : REGION_CONFIG.cash.borderColor,
                isHovered ? 3 : REGION_CONFIG.cash.lineWidth,
                REGION_CONFIG.cash.dash
            );
            
            // Draw dollar bill emoji with level (unrotated)
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            const displayText = `💵${region.level}`;
            
            // Draw black outline
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.strokeText(displayText, centerX, centerY);
            
            // Draw emoji
            ctx.fillStyle = '#e0e0e0';
            ctx.fillText(displayText, centerX, centerY);
        }
    });
    
    // Draw level up regions
    levelUpRegions.forEach(region => {
        // Calculate center of region
        const centerX = region.centerX || (region.x1 + region.x2) / 2;
        const centerY = region.centerY || (region.y1 + region.y2) / 2;
        const width = region.width || (region.x2 - region.x1);
        const height = region.height || (region.y2 - region.y1);
        const rotation = region.rotation || 0;
        
        // Check if this region is being leveled up (show upgraded version)
        let isBeingLeveledUp = false;
        if (currentItemMode === 'levelUp' && isMouseOnCanvas) {
            const placementInfo = checkRegionPlacement(mouseX, mouseY, 'levelUp');
            isBeingLeveledUp = placementInfo.levelUpTarget === region;
        }
        
        // Check if this region is being hovered over in remover mode
        const isHovered = removerMode && hoveredLevelUpRegion === region;
        
        // Draw the rotated region rectangle
        if (isBeingLeveledUp) {
            // Show upgraded version with breathing effect
            const time = Date.now() * 0.005; // Slow breathing
            const scale = 1 + Math.sin(time) * 0.1; // 10% size variation
            
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(rotation);
            ctx.scale(scale, scale);
            ctx.translate(-width/2, -height/2);
            
            // Draw the region rectangle with upgrade colors
            ctx.beginPath();
            ctx.rect(0, 0, width, height);
            ctx.fillStyle = 'rgba(0, 255, 0, 0.7)'; // Green for upgrade
            ctx.strokeStyle = '#00ff00';
            ctx.fill();
            ctx.lineWidth = REGION_CONFIG.levelUp.lineWidth;
            ctx.setLineDash(REGION_CONFIG.levelUp.dash);
            ctx.stroke();
            ctx.setLineDash([]); // Reset line dash
            ctx.restore();
            
            // Draw upgraded level text (unrotated)
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            const displayText = `+${region.level + 1}`; // Show upgraded level
            
            // Draw black outline
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.strokeText(displayText, centerX, centerY);
            
            // Draw text
            ctx.fillStyle = '#e0e0e0';
            ctx.fillText(displayText, centerX, centerY);
        } else {
            // Normal drawing
            drawRotatedRect(
                ctx, 
                centerX, 
                centerY, 
                width, 
                height, 
                rotation,
                isHovered ? `rgba(255, 71, 87, 0.5)` : REGION_CONFIG.levelUp.color,
                isHovered ? COLORS.hover : REGION_CONFIG.levelUp.borderColor,
                isHovered ? 3 : REGION_CONFIG.levelUp.lineWidth,
                REGION_CONFIG.levelUp.dash
            );
            
            // Draw level up text with level (unrotated)
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            const displayText = `+${region.level}`;
            
            // Draw black outline
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.strokeText(displayText, centerX, centerY);
            
            // Draw emoji
            ctx.fillStyle = '#e0e0e0';
            ctx.fillText(displayText, centerX, centerY);
        }
    });
    
    // Draw permanent bottom cash region
    if (permanentBottomCashRegion) {
        // Calculate center of region
        const centerX = (permanentBottomCashRegion.x1 + permanentBottomCashRegion.x2) / 2;
        const centerY = (permanentBottomCashRegion.y1 + permanentBottomCashRegion.y2) / 2;
        
        // Draw the region rectangle
        ctx.beginPath();
        ctx.rect(permanentBottomCashRegion.x1, permanentBottomCashRegion.y1, 
                permanentBottomCashRegion.x2 - permanentBottomCashRegion.x1, 
                permanentBottomCashRegion.y2 - permanentBottomCashRegion.y1);
        ctx.fillStyle = 'rgba(46, 213, 115, 0.4)'; // Slightly more transparent than regular cash regions
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
        const regionWidth = permanentBottomCashRegion.x2 - permanentBottomCashRegion.x1;
        const emojiSpacing = regionWidth / 4; // Divide by 4 to get 3 evenly spaced positions
        const startX = permanentBottomCashRegion.x1 + emojiSpacing;
        
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
    
    // Draw placement restriction circles if in any region item mode
    if (currentItemMode === 'multiplier' && isMouseOnCanvas) {
        drawPlacementRestrictionCircles('multiplier');
    } else if (currentItemMode === 'cash' && isMouseOnCanvas) {
        drawPlacementRestrictionCircles('cash');
    } else if (currentItemMode === 'levelUp' && isMouseOnCanvas) {
        drawPlacementRestrictionCircles('levelUp');
    }
    
    // Draw multiplier region cursor preview if in placement mode and mouse is on canvas
    if (multiplierPlacementMode && isMouseOnCanvas) {
        const width = REGION_CONFIG.multiplier.width;
        const height = REGION_CONFIG.multiplier.height;
        
        // Calculate preview rectangle centered on cursor
        const previewX = mouseX - width / 2;
        const previewY = mouseY - height / 2;
        
        // Check if placement is valid
        const canPlace = !checkMultiplierRegionCollision(mouseX, mouseY);
        
        ctx.beginPath();
        ctx.rect(previewX, previewY, width, height);
        
        // Use different colors based on placement validity
        if (canPlace) {
            ctx.fillStyle = REGION_CONFIG.multiplier.color;
            ctx.strokeStyle = REGION_CONFIG.multiplier.borderColor;
        } else {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'; // Red if cannot place
            ctx.strokeStyle = '#ff0000';
        }
        
        ctx.fill();
        ctx.lineWidth = REGION_CONFIG.multiplier.lineWidth;
        ctx.setLineDash(REGION_CONFIG.multiplier.dash);
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
    
    // Draw cash item preview if in cash item mode and mouse is on canvas
    if (currentItemMode === 'cash' && isMouseOnCanvas) {
        const width = REGION_CONFIG.cash.width;
        const height = REGION_CONFIG.cash.height;
        
        // Check placement info
        const placementInfo = checkRegionPlacement(mouseX, mouseY, 'cash');
        
        // Only show preview if NOT hovering over an existing region
        if (!placementInfo.levelUpTarget) {
            // Show normal preview for new placement
            const previewX = mouseX - width / 2;
            const previewY = mouseY - height / 2;
            
            ctx.save();
            ctx.translate(previewX + width/2, previewY + height/2);
            ctx.rotate(regionItemRotation);
            ctx.translate(-width/2, -height/2);
            
            ctx.beginPath();
            ctx.rect(0, 0, width, height);
            
            // Use different colors based on placement validity
            if (placementInfo.canPlace) {
                // Normal colors for new placement
                ctx.fillStyle = REGION_CONFIG.cash.color;
                ctx.strokeStyle = REGION_CONFIG.cash.borderColor;
            } else {
                // Red if cannot place
                ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
                ctx.strokeStyle = '#ff0000';
            }
            
            ctx.fill();
            ctx.lineWidth = REGION_CONFIG.cash.lineWidth;
            ctx.setLineDash(REGION_CONFIG.cash.dash);
            ctx.stroke();
            ctx.setLineDash([]); // Reset line dash
            ctx.restore();
            
            // Draw dollar bill emoji at center of preview (unrotated)
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            const displayText = '💵1'; // Default to level 1 for new placements
            
            // Draw black outline
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.strokeText(displayText, previewX + width/2, previewY + height/2);
            
            // Draw emoji
            ctx.fillStyle = '#e0e0e0';
            ctx.fillText(displayText, previewX + width/2, previewY + height/2);
        }
        // When hovering over existing region, do NOTHING - no preview, no crosshair, nothing
    }
    
    // Draw multiplier item preview if in multiplier item mode and mouse is on canvas
    if (currentItemMode === 'multiplier' && isMouseOnCanvas) {
        const width = REGION_CONFIG.multiplier.width;
        const height = REGION_CONFIG.multiplier.height;
        
        // Check placement info
        const placementInfo = checkRegionPlacement(mouseX, mouseY, 'multiplier');
        
        // Only show preview if NOT hovering over an existing region
        if (!placementInfo.levelUpTarget) {
            // Show normal preview for new placement
            const previewX = mouseX - width / 2;
            const previewY = mouseY - height / 2;
            
            ctx.save();
            ctx.translate(previewX + width/2, previewY + height/2);
            ctx.rotate(regionItemRotation);
            ctx.translate(-width/2, -height/2);
            
            ctx.beginPath();
            ctx.rect(0, 0, width, height);
            
            // Use different colors based on placement validity
            if (placementInfo.canPlace) {
                // Normal colors for new placement
                ctx.fillStyle = REGION_CONFIG.multiplier.color;
                ctx.strokeStyle = REGION_CONFIG.multiplier.borderColor;
            } else {
                // Red if cannot place
                ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
                ctx.strokeStyle = '#ff0000';
            }
            
            ctx.fill();
            ctx.lineWidth = REGION_CONFIG.multiplier.lineWidth;
            ctx.setLineDash(REGION_CONFIG.multiplier.dash);
            ctx.stroke();
            ctx.setLineDash([]); // Reset line dash
            ctx.restore();
            
            // Draw multiplier text at center of preview (unrotated)
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            const multiplierText = 'x2'; // Default for new placement
            
            // Draw black outline
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.strokeText(multiplierText, previewX + width/2, previewY + height/2);
            
            // Draw text
            ctx.fillStyle = '#e0e0e0';
            ctx.fillText(multiplierText, previewX + width/2, previewY + height/2);
        }
        // When hovering over existing region, do NOTHING - no preview, no crosshair, nothing
    }
    
    // Draw level up item preview if in level up item mode and mouse is on canvas
    if (currentItemMode === 'levelUp' && isMouseOnCanvas) {
        // Check placement info
        const placementInfo = checkRegionPlacement(mouseX, mouseY, 'levelUp');
        
        // Only show preview if NOT hovering over an existing region
        if (!placementInfo.levelUpTarget) {
            const width = REGION_CONFIG.levelUp.width;
            const height = REGION_CONFIG.levelUp.height;
            
            // Show normal preview for new placement
            const previewX = mouseX - width / 2;
            const previewY = mouseY - height / 2;
            
            ctx.save();
            ctx.translate(previewX + width/2, previewY + height/2);
            ctx.rotate(regionItemRotation);
            ctx.translate(-width/2, -height/2);
            
            ctx.beginPath();
            ctx.rect(0, 0, width, height);
            
            // Use different colors based on placement validity
            if (placementInfo.canPlace) {
                // Normal colors for new placement
                ctx.fillStyle = REGION_CONFIG.levelUp.color;
                ctx.strokeStyle = REGION_CONFIG.levelUp.borderColor;
            } else {
                // Red if cannot place
                ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
                ctx.strokeStyle = '#ff0000';
            }
            
            ctx.fill();
            ctx.lineWidth = REGION_CONFIG.levelUp.lineWidth;
            ctx.setLineDash(REGION_CONFIG.levelUp.dash);
            ctx.stroke();
            ctx.setLineDash([]); // Reset line dash
            ctx.restore();
            
            // Draw level up text at center of preview (unrotated)
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            const displayText = '+1'; // Default to level 1 for new placements
            
            // Draw black outline
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.strokeText(displayText, previewX + width/2, previewY + height/2);
            
            // Draw text
            ctx.fillStyle = '#e0e0e0';
            ctx.fillText(displayText, previewX + width/2, previewY + height/2);
        }
        // When hovering over existing region, do NOTHING - no preview, no crosshair, nothing
    }
    
    // Draw portal region cursor preview if in portal mode and mouse is on canvas
    if (portalMode && isMouseOnCanvas) {
        const width = REGION_CONFIG.portal.width;
        const height = REGION_CONFIG.portal.height;
        
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
    
    // Draw cash region cursor preview if in cash mode and mouse is on canvas
    if (cashMode && isMouseOnCanvas) {
        const width = REGION_CONFIG.cash.width;
        const height = REGION_CONFIG.cash.height;
        
        // Calculate preview rectangle centered on cursor
        const previewX = mouseX - width / 2;
        const previewY = mouseY - height / 2;
        
        ctx.beginPath();
        ctx.rect(previewX, previewY, width, height);
        ctx.fillStyle = REGION_CONFIG.cash.color;
        ctx.fill();
        ctx.strokeStyle = REGION_CONFIG.cash.borderColor;
        ctx.lineWidth = REGION_CONFIG.cash.lineWidth;
        ctx.setLineDash(REGION_CONFIG.cash.dash);
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
    
    // Draw level up region cursor preview if in level up mode and mouse is on canvas
    if (levelUpMode && isMouseOnCanvas) {
        // Check if hovering over an existing level up region
        const placementInfo = checkRegionPlacement(mouseX, mouseY, 'levelUp');
        
        // Only show preview if NOT hovering over an existing region
        if (!placementInfo.levelUpTarget) {
            const width = REGION_CONFIG.levelUp.width;
            const height = REGION_CONFIG.levelUp.height;
            
            // Calculate preview rectangle centered on cursor
            const previewX = mouseX - width / 2;
            const previewY = mouseY - height / 2;
            
            ctx.beginPath();
            ctx.rect(previewX, previewY, width, height);
            ctx.fillStyle = REGION_CONFIG.levelUp.color;
            ctx.fill();
            ctx.strokeStyle = REGION_CONFIG.levelUp.borderColor;
            ctx.lineWidth = REGION_CONFIG.levelUp.lineWidth;
            ctx.setLineDash(REGION_CONFIG.levelUp.dash);
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
        // When hovering over existing region, do NOTHING - no preview, no crosshair, nothing
    }
    
    // Draw spawn indicator
    drawSpawnIndicator();
    
    // Draw money animations
    moneyAnimations.forEach(animation => animation.draw(ctx));
    
}

// Game loop
function gameLoop(currentTime) {
    // Calculate FPS
    calculateFPS(currentTime);
    
    // Update physics only if not paused
    if (!isPaused) {
        Engine.update(engine);
        
        
        // Check for balls that have fallen off the bottom of the screen
        checkForFallenBalls();
        
        // Check for stuck balls
        checkForStuckBalls();
    }
    
    // Update money animations
    moneyAnimations = moneyAnimations.filter(animation => animation.update());
    
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
    const minDistance = 80; // Minimum distance between walls and from money region
    
    // Get money region bounds (permanent bottom cash region)
    const moneyRegionBounds = {
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
            
            // Check if position conflicts with money region
            const conflictsWithMoneyRegion = 
                x >= moneyRegionBounds.x1 - minDistance &&
                x <= moneyRegionBounds.x2 + minDistance &&
                y >= moneyRegionBounds.y1 - minDistance &&
                y <= moneyRegionBounds.y2 + minDistance;
            
            if (conflictsWithMoneyRegion) {
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
            const conflictsWithPortalRegions = conflictsWithPortals(x, y, minDistance);
            
            if (conflictsWithWalls || conflictsWithPortalRegions) {
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
    const minDistance = 100; // Minimum distance between multipliers and walls/regions
    
    // Calculate the spawnable area (excluding top spawn area and bottom margin)
    const spawnableHeight = canvasHeight - topSpawnArea - margin;
    const regionHeight = spawnableHeight / 3; // Divide into 3 equal vertical regions
    
    // Define the three vertical regions
    const regions = [
        { // Top region
            name: 'top',
            y1: topSpawnArea,
            y2: topSpawnArea + regionHeight
        },
        { // Middle region
            name: 'middle', 
            y1: topSpawnArea + regionHeight,
            y2: topSpawnArea + 2 * regionHeight
        },
        { // Bottom region
            name: 'bottom',
            y1: topSpawnArea + 2 * regionHeight,
            y2: canvasHeight - margin
        }
    ];
    
    // Get money region bounds (permanent bottom cash region)
    const moneyRegionBounds = {
        x1: canvasWidth * 0.25, // 25% from left edge
        x2: canvasWidth * 0.75, // 75% from left edge  
        y1: canvasHeight - 30, // Bottom of canvas
        y2: canvasHeight // Bottom edge
    };
    
    // Get all existing wall positions for collision checking
    const existingWalls = [];
    const bodies = Matter.Composite.allBodies(world);
    for (const body of bodies) {
        if (body.isStatic && body !== permanentBottomCashRegion?.body) {
            existingWalls.push({
                x: body.position.x,
                y: body.position.y,
                // Approximate size based on wall type (conservative estimate)
                size: 100 // Use a conservative size for collision checking
            });
        }
    }
    
    // Place exactly one multiplier in each region
    for (let regionIndex = 0; regionIndex < regions.length; regionIndex++) {
        const region = regions[regionIndex];
        let attempts = 0;
        let placed = false;
        
        while (!placed && attempts < 50) { // Max 50 attempts per multiplier
            attempts++;
            
            // Random position within the specific region bounds
            const x = margin + Math.random() * (canvasWidth - 2 * margin);
            const y = region.y1 + Math.random() * (region.y2 - region.y1);
            
            // Check if position conflicts with money region
            const conflictsWithMoneyRegion = 
                x >= moneyRegionBounds.x1 - minDistance &&
                x <= moneyRegionBounds.x2 + minDistance &&
                y >= moneyRegionBounds.y1 - minDistance &&
                y <= moneyRegionBounds.y2 + minDistance;
            
            if (conflictsWithMoneyRegion) {
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
            
            // Check if position conflicts with existing multiplier regions
            let conflictsWithMultipliers = false;
            for (const existingMultiplier of multiplierRegions) {
                const distance = Math.sqrt(
                    Math.pow(x - existingMultiplier.x, 2) + Math.pow(y - existingMultiplier.y, 2)
                );
                if (distance < minDistance) {
                    conflictsWithMultipliers = true;
                    break;
                }
            }
            
            // Check if position conflicts with portals
            const conflictsWithPortalRegions = conflictsWithPortals(x, y, minDistance);
            
            if (conflictsWithWalls || conflictsWithMultipliers || conflictsWithPortalRegions) {
                continue; // Try again
            }
            
            // Create the 2x multiplier region with horizontal orientation (no rotation)
            const rotation = 0; // Horizontal orientation
            const multiplier = createMultiplierRegion(x, y, 2, rotation);
            
            // Add to existing walls list for future collision checking
            existingWalls.push({
                x: x,
                y: y,
                size: 100
            });
            
            placed = true;
        }
        
        if (!placed) {
            console.log(`Failed to place multiplier in ${region.name} region after 50 attempts`);
        }
    }
    
    console.log(`Generated ${multiplierRegions.length} random multipliers (1 in each of the 3 vertical regions)`);
}

// Initialize drop 10 button state
updateDropButtonState();
updateDropTestButtonState();

// Helper function to check if a position conflicts with any portal regions
function conflictsWithPortals(x, y, minDistance = 100) {
    for (const portal of portalRegions) {
        const portalCenterX = (portal.x1 + portal.x2) / 2;
        const portalCenterY = (portal.y1 + portal.y2) / 2;
        const distance = Math.sqrt(
            Math.pow(x - portalCenterX, 2) + Math.pow(y - portalCenterY, 2)
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
        blueCenterX = margin + REGION_CONFIG.portal.width / 2;
        blueCenterY = canvasHeight - margin - REGION_CONFIG.portal.height / 2 - 50; // Raised by 50 pixels
        
        // Orange portal in top-right corner
        orangeCenterX = canvasWidth - margin - REGION_CONFIG.portal.width / 2;
        orangeCenterY = margin + REGION_CONFIG.portal.height / 2;
    } else {
        // Blue portal in bottom-right corner
        blueCenterX = canvasWidth - margin - REGION_CONFIG.portal.width / 2;
        blueCenterY = canvasHeight - margin - REGION_CONFIG.portal.height / 2 - 50; // Raised by 50 pixels
        
        // Orange portal in top-left corner
        orangeCenterX = margin + REGION_CONFIG.portal.width / 2;
        orangeCenterY = margin + REGION_CONFIG.portal.height / 2;
    }
    
    // Create the blue (IN) portal
    createPortalRegion(blueCenterX, blueCenterY, 'blue');
    
    // Create the orange (OUT) portal
    createPortalRegion(orangeCenterX, orangeCenterY, 'orange');
    
    console.log(`Generated portals: Blue at (${blueCenterX}, ${blueCenterY}), Orange at (${orangeCenterX}, ${orangeCenterY})`);
}

// Create the permanent bottom cash region
createPermanentBottomCashRegion();

// Generate random portals at game start (FIRST)
generateRandomPortals();

// Generate random walls at game start (SECOND - avoids portals)
generateRandomWalls();

// Generate random multipliers at game start (THIRD - avoids portals and walls)
generateRandomMultipliers();

// Calculate initial spawn position for turn 1
calculateSpawnPosition();

// Start the simulation
requestAnimationFrame(gameLoop);