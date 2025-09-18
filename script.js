// Matter.js modules
const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Events = Matter.Events;

// Create engine
const engine = Engine.create();
const world = engine.world;

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
    gravity: 0.5,
    airResistance: 0,
    circleSize: 5,
    bounciness: 0,
    friction: 0,
    density: 0.001,
    spawnDelay: 5,
    maxWallLength: 250, // Half the canvas width (500px)
    multiplierRegionWidth: 60, // Fixed width for multiplier regions
    multiplierRegionHeight: 20, // Fixed height for multiplier regions
    multiplierRegionRadius: 150 // Minimum distance between multiplier regions
};

// Ball inventory system removed - balls are spawned directly via +10 button

// Wallet system
let wallet = 0; // Starting wallet amount

// Drop button state
let isDropped = true; // Track if tank bottom is dropped (starts as dropped/off by default)

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

// Mouse position tracking for cursor preview
let mouseX = 0;
let mouseY = 0;
let isMouseOnCanvas = false;

// Get DOM elements
const gravitySlider = document.getElementById('gravitySlider');
const gravityValue = document.getElementById('gravityValue');
const airResistanceSlider = document.getElementById('airResistanceSlider');
const airResistanceValue = document.getElementById('airResistanceValue');
const sizeSlider = document.getElementById('sizeSlider');
const sizeValue = document.getElementById('sizeValue');
const bounceSlider = document.getElementById('bounceSlider');
const bounceValue = document.getElementById('bounceValue');
const frictionSlider = document.getElementById('frictionSlider');
const frictionValue = document.getElementById('frictionValue');
const densitySlider = document.getElementById('densitySlider');
const densityValue = document.getElementById('densityValue');
// ballInventoryValue removed - no longer needed
const walletValue = document.getElementById('walletValue');
const addBallsButton = document.getElementById('addBallsButton');
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
const multiplierControls = document.getElementById('multiplierControls');
const wallControls = document.getElementById('wallControls');
const maxWallLengthSlider = document.getElementById('maxWallLengthSlider');
const maxWallLengthValue = document.getElementById('maxWallLengthValue');
const multiplierRadiusSlider = document.getElementById('multiplierRadiusSlider');
const multiplierRadiusValue = document.getElementById('multiplierRadiusValue');
const dropButton = document.getElementById('dropButton');

// Create left wall (extended upward beyond canvas)
const leftWall = Bodies.rectangle(10, 200, 20, 1200, { 
    isStatic: true,
    render: { fillStyle: '#8B4513' }
});

// Create right wall (extended upward beyond canvas)
const rightWall = Bodies.rectangle(490, 200, 20, 1200, { 
    isStatic: true,
    render: { fillStyle: '#8B4513' }
});

// Create tank top wall (horizontal wall at the very top)
const tankTopWall = Bodies.rectangle(250, 10, 500, 20, { 
    isStatic: true,
    render: { fillStyle: '#8B4513' }
});

// Create tank bottom wall (horizontal wall across the tank)
const tankWall = Bodies.rectangle(250, 150, 500, 20, { 
    isStatic: true,
    render: { fillStyle: '#8B4513' }
});

// Add walls to world (tank floor is off by default)
World.add(world, [leftWall, rightWall, tankTopWall]);

// Function to create a circle at position
function createCircle(x, y) {
    const circle = Bodies.circle(x, y, physicsSettings.circleSize, {
        restitution: physicsSettings.bounciness,
        friction: physicsSettings.friction,
        density: physicsSettings.density,
        render: {
            fillStyle: `hsl(${Math.random() * 360}, 70%, 50%)` // Random colors
        }
    });
    
    World.add(world, circle);
    objectCount++;
    objectCountElement.textContent = objectCount;
    
    return circle;
}

// Function to create a wall from start to end coordinates
function createWall(startX, startY, endX, endY) {
    const length = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
    
    // Check if wall length exceeds maximum allowed length (with small tolerance for floating point precision)
    if (length > physicsSettings.maxWallLength + 0.1) {
        return null; // Don't create wall if it's too long
    }
    
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;
    const angle = Math.atan2(endY - startY, endX - startX);
    
    const wall = Bodies.rectangle(midX, midY, length, 20, {
        angle: angle,
        isStatic: true,
        render: { fillStyle: '#8B4513' }
    });
    
    World.add(world, wall);
    objectCount++;
    objectCountElement.textContent = objectCount;
    
    return wall;
}

// Function to check if a new multiplier region placement conflicts with existing regions
function checkMultiplierRegionCollision(centerX, centerY) {
    const radius = physicsSettings.multiplierRegionRadius;
    
    for (let region of multiplierRegions) {
        // Calculate center of existing region
        const existingCenterX = (region.x1 + region.x2) / 2;
        const existingCenterY = (region.y1 + region.y2) / 2;
        
        // Calculate distance between centers
        const distance = Math.sqrt(
            Math.pow(centerX - existingCenterX, 2) + 
            Math.pow(centerY - existingCenterY, 2)
        );
        
        // If distance is less than required radius, there's a collision
        if (distance < radius) {
            return true;
        }
    }
    
    return false;
}

// Function to create a multiplier region at the specified position
function createMultiplierRegion(centerX, centerY, factor) {
    // Check for collision with existing regions
    if (checkMultiplierRegionCollision(centerX, centerY)) {
        return null; // Cannot place region due to collision
    }
    
    // Use fixed dimensions
    const width = physicsSettings.multiplierRegionWidth;
    const height = physicsSettings.multiplierRegionHeight;
    
    // Create region centered on the click point
    const region = {
        x1: centerX - width / 2,
        y1: centerY - height / 2,
        x2: centerX + width / 2,
        y2: centerY + height / 2,
        factor: factor,
        id: Date.now() + Math.random() // Unique ID for tracking
    };
    
    multiplierRegions.push(region);
    return region;
}

// Function to clear all objects except walls
function clearAllObjects() {
    const bodies = Matter.Composite.allBodies(world);
    bodies.forEach(body => {
        if (body !== leftWall && body !== rightWall && body !== tankWall && body !== tankTopWall) {
            World.remove(world, body);
        }
    });
    // Clear multiplier regions
    multiplierRegions = [];
    objectCount = 0;
    objectCountElement.textContent = objectCount;
    
    // Reset drop button state and restore floor to default state (dropped/off)
    if (!isDropped) {
        isDropped = true;
        World.remove(world, tankWall);
        dropButton.textContent = 'Replace Floor';
        dropButton.style.background = '#2ed573';
    }
}

// Function to check for balls that have fallen off the bottom of the screen
function checkForFallenBalls() {
    const bodies = Matter.Composite.allBodies(world);
    const fallenBalls = [];
    
    bodies.forEach(body => {
        // Check if it's a ball (has circleRadius) and not a wall
        if (body.circleRadius && body !== leftWall && body !== rightWall && body !== tankWall && body !== tankTopWall) {
            // Check if ball has fallen below the canvas height
            if (body.position.y > canvas.height + 50) { // 50px buffer below canvas
                fallenBalls.push(body);
            }
        }
    });
    
    // Remove fallen balls and add $1 to wallet for each
    fallenBalls.forEach(ball => {
        World.remove(world, ball);
        wallet += 1; // Add $1 to wallet
        objectCount--;
    });
    
    // Check if all balls have fallen off (no balls left in world)
    const remainingBalls = bodies.filter(body => 
        body.circleRadius && body !== leftWall && body !== rightWall && body !== tankWall && body !== tankTopWall
    );
    
    // Ball inventory system removed - no need to reset inventory
    
    // Update display if any balls fell off
    if (fallenBalls.length > 0) {
        objectCountElement.textContent = objectCount;
        updateDisplayValues();
    }
}

// Function to check for balls passing through multiplier regions
function checkMultiplierRegions() {
    const bodies = Matter.Composite.allBodies(world);
    const ballsToMultiply = [];
    
    bodies.forEach(body => {
        // Check if it's a ball (has circleRadius) and not a wall
        if (body.circleRadius && body !== leftWall && body !== rightWall && body !== tankWall && body !== tankTopWall) {
            const ballX = body.position.x;
            const ballY = body.position.y;
            const ballRadius = body.circleRadius;
            
            // Check if ball is inside any multiplier region
            multiplierRegions.forEach(region => {
                if (ballX - ballRadius >= region.x1 && 
                    ballX + ballRadius <= region.x2 && 
                    ballY - ballRadius >= region.y1 && 
                    ballY + ballRadius <= region.y2) {
                    
                    // Check if this ball hasn't been multiplied by this region yet
                    if (!body.multipliedBy) {
                        body.multipliedBy = new Set();
                    }
                    
                    if (!body.multipliedBy.has(region.id)) {
                        ballsToMultiply.push({
                            ball: body,
                            region: region
                        });
                        body.multipliedBy.add(region.id);
                    }
                }
            });
        }
    });
    
    // Create new balls for each ball that passed through a multiplier region
    ballsToMultiply.forEach(({ ball, region }) => {
        const newBallCount = region.factor - 1; // -1 because the original ball already exists
        const ballX = ball.position.x;
        const ballY = ball.position.y;
        const ballRadius = ball.circleRadius;
        
        for (let i = 0; i < newBallCount; i++) {
            // Create new ball with slight offset to avoid overlap
            const offsetX = (Math.random() - 0.5) * ballRadius * 2;
            const offsetY = (Math.random() - 0.5) * ballRadius * 2;
            const newBall = createCircle(ballX + offsetX, ballY + offsetY);
            
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
        }
    });
}

// Function to update physics settings
function updatePhysicsSettings() {
    // Update gravity
    engine.world.gravity.y = physicsSettings.gravity;
    
    // Update air resistance for all bodies
    const bodies = Matter.Composite.allBodies(world);
    bodies.forEach(body => {
        if (body !== leftWall && body !== rightWall && body !== tankWall && body !== tankTopWall) {
            body.frictionAir = physicsSettings.airResistance;
        }
    });
}

// Function to update display values
function updateDisplayValues() {
    gravityValue.textContent = physicsSettings.gravity.toFixed(1);
    airResistanceValue.textContent = physicsSettings.airResistance.toFixed(3);
    sizeValue.textContent = physicsSettings.circleSize;
    bounceValue.textContent = physicsSettings.bounciness.toFixed(1);
    frictionValue.textContent = physicsSettings.friction.toFixed(1);
    densityValue.textContent = physicsSettings.density.toFixed(3);
    // Ball inventory display removed
    walletValue.textContent = `$${wallet}`;
    spawnDelayValue.textContent = physicsSettings.spawnDelay;
    maxWallLengthValue.textContent = physicsSettings.maxWallLength;
    multiplierRadiusValue.textContent = physicsSettings.multiplierRegionRadius;
}

// Event listeners for sliders
gravitySlider.addEventListener('input', (e) => {
    physicsSettings.gravity = parseFloat(e.target.value);
    updatePhysicsSettings();
    updateDisplayValues();
});

airResistanceSlider.addEventListener('input', (e) => {
    physicsSettings.airResistance = parseFloat(e.target.value);
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

maxWallLengthSlider.addEventListener('input', (e) => {
    physicsSettings.maxWallLength = parseInt(e.target.value);
    updateDisplayValues();
});

multiplierRadiusSlider.addEventListener('input', (e) => {
    physicsSettings.multiplierRegionRadius = parseInt(e.target.value);
    updateDisplayValues();
});


// Button event listeners
clearButton.addEventListener('click', clearAllObjects);

pauseButton.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
    pauseButton.style.background = isPaused ? '#2ed573' : '#3742fa';
});

addBallsButton.addEventListener('click', () => {
    // Spawn 10 balls directly into the canvas
    spawnBallsDirectly(10);
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

// Wall tool button event listener
wallToolButton.addEventListener('click', () => {
    wallDrawingMode = !wallDrawingMode;
    wallToolButton.textContent = wallDrawingMode ? 'Exit Wall Tool' : 'Wall Drawing Tool';
    wallToolButton.style.background = wallDrawingMode ? '#ff6b6b' : '#ffa502';
    canvas.style.cursor = wallDrawingMode ? 'crosshair' : 'crosshair';
    wallControls.style.display = wallDrawingMode ? 'block' : 'none';
    
    // Exit multiplier mode if wall mode is activated
    if (wallDrawingMode) {
        multiplierPlacementMode = false;
        multiplierToolButton.textContent = 'Multiplier Region Tool';
        multiplierToolButton.style.background = '#9c88ff';
        multiplierControls.style.display = 'none';
    }
});

// Multiplier tool button event listener
multiplierToolButton.addEventListener('click', () => {
    multiplierPlacementMode = !multiplierPlacementMode;
    multiplierToolButton.textContent = multiplierPlacementMode ? 'Exit Multiplier Tool' : 'Multiplier Region Tool';
    multiplierToolButton.style.background = multiplierPlacementMode ? '#ff6b6b' : '#9c88ff';
    multiplierControls.style.display = multiplierPlacementMode ? 'block' : 'none';
    canvas.style.cursor = multiplierPlacementMode ? 'none' : 'crosshair';
    
    // Exit wall mode if multiplier mode is activated
    if (multiplierPlacementMode) {
        wallDrawingMode = false;
        wallToolButton.textContent = 'Wall Drawing Tool';
        wallToolButton.style.background = '#ffa502';
    }
});

// Multiplier factor slider event listener
multiplierSlider.addEventListener('input', (e) => {
    multiplierFactor = parseInt(e.target.value);
    multiplierValue.textContent = multiplierFactor;
});

// Function to spawn balls directly into the canvas
function spawnBallsDirectly(ballCount) {
    const spawnDelay = physicsSettings.spawnDelay;
    
    for (let i = 0; i < ballCount; i++) {
        setTimeout(() => {
            if (!isPaused) {
                // Generate random X coordinate within tank bounds
                // Leave some margin from the walls (20px on each side)
                const minX = 30; // Left margin
                const maxX = canvas.width - 30; // Right margin
                const randomX = Math.random() * (maxX - minX) + minX;
                
                // Generate random Y coordinate within tank bounds (between top and bottom walls)
                const minY = 30; // Below top wall (y=0 + 20px wall height + 10px margin)
                const maxY = 50; // Above bottom wall (y=150 - 20px wall height - 10px margin)
                const randomY = Math.random() * (maxY - minY) + minY;
                
                createCircle(randomX, randomY);
            }
        }, i * spawnDelay);
    }
}

// Click handler for spawning circles or starting wall/multiplier drawing
canvas.addEventListener('mousedown', function(event) {
    if (isPaused) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    if (wallDrawingMode) {
        // Start drawing a wall
        isDrawingWall = true;
        wallStartX = x;
        wallStartY = y;
        wallEndX = x;
        wallEndY = y;
    } else if (multiplierPlacementMode) {
        // Place a multiplier region at the click point
        const region = createMultiplierRegion(x, y, multiplierFactor);
        if (!region) {
            // Region placement failed due to collision - could show user feedback here
            console.log('Cannot place multiplier region: too close to existing region');
        }
    } else {
        // Canvas click no longer spawns balls - only +10 button does
        // This section is kept for wall/multiplier tool functionality
    }
});

// Mouse enter handler
canvas.addEventListener('mouseenter', function() {
    isMouseOnCanvas = true;
});

// Mouse leave handler
canvas.addEventListener('mouseleave', function() {
    isMouseOnCanvas = false;
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
    
    if (wallDrawingMode && isDrawingWall) {
        wallEndX = x;
        wallEndY = y;
    }
});

// Mouse up handler for completing wall drawing
canvas.addEventListener('mouseup', function(event) {
    if (isPaused) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    if (wallDrawingMode && isDrawingWall) {
        wallEndX = x;
        wallEndY = y;
        
        // Create wall if it's long enough and within maximum length
        const distance = Math.sqrt((wallEndX - wallStartX) ** 2 + (wallEndY - wallStartY) ** 2);
        if (distance > 10) { // Minimum wall length
            const wall = createWall(wallStartX, wallStartY, wallEndX, wallEndY);
            if (!wall) {
                // Wall was too long, could show a message to user here
                console.log('Wall too long! Maximum length is ' + physicsSettings.maxWallLength + ' pixels');
            }
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
        
        // Fill with color
        ctx.fillStyle = body.render.fillStyle || '#FF6B6B';
        ctx.fill();
        
        // Add border
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
    
    // Draw multiplier regions
    multiplierRegions.forEach(region => {
        // Calculate center of region
        const centerX = (region.x1 + region.x2) / 2;
        const centerY = (region.y1 + region.y2) / 2;
        
        // Draw radius circle around existing region only when multiplier placement mode is active
        if (multiplierPlacementMode) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, physicsSettings.multiplierRegionRadius, 0, 2 * Math.PI);
            ctx.strokeStyle = '#9c88ff';
            ctx.lineWidth = 1;
            ctx.setLineDash([2, 4]); // Dotted line for radius
            ctx.stroke();
            ctx.setLineDash([]); // Reset line dash
        }
        
        // Draw the region rectangle
        ctx.beginPath();
        ctx.rect(region.x1, region.y1, region.x2 - region.x1, region.y2 - region.y1);
        ctx.fillStyle = `rgba(156, 136, 255, 0.3)`; // Semi-transparent purple
        ctx.fill();
        ctx.strokeStyle = '#9c88ff';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]); // Dashed border
        ctx.stroke();
        ctx.setLineDash([]); // Reset line dash
        
        // Draw multiplier factor text
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Draw black outline
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.strokeText(`×${region.factor}`, centerX, centerY);
        
        // Draw white text
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`×${region.factor}`, centerX, centerY);
    });
    
    // Draw wall preview if drawing
    if (wallDrawingMode && isDrawingWall) {
        const currentLength = Math.sqrt((wallEndX - wallStartX) ** 2 + (wallEndY - wallStartY) ** 2);
        const isTooLong = currentLength > physicsSettings.maxWallLength + 0.1;
        
        // Calculate wall properties (same as createWall function)
        const midX = (wallStartX + wallEndX) / 2;
        const midY = (wallStartY + wallEndY) / 2;
        const angle = Math.atan2(wallEndY - wallStartY, wallEndX - wallStartX);
        
        // Save current context state
        ctx.save();
        
        // Translate to wall center and rotate
        ctx.translate(midX, midY);
        ctx.rotate(angle);
        
        // Draw wall preview rectangle
        ctx.beginPath();
        ctx.rect(-currentLength / 2, -10, currentLength, 20); // 20px height, centered
        
        // Fill with semi-transparent color
        ctx.fillStyle = isTooLong ? 'rgba(255, 71, 87, 0.5)' : 'rgba(255, 165, 2, 0.5)'; // Red if too long, orange if OK
        ctx.fill();
        
        // Draw border
        ctx.strokeStyle = isTooLong ? '#ff4757' : '#ffa502'; // Red if too long, orange if OK
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 4]); // Dashed border for preview
        ctx.stroke();
        ctx.setLineDash([]); // Reset line dash
        
        // Restore context state
        ctx.restore();
    }
    
    // Draw multiplier region cursor preview if in placement mode and mouse is on canvas
    if (multiplierPlacementMode && isMouseOnCanvas) {
        const width = physicsSettings.multiplierRegionWidth;
        const height = physicsSettings.multiplierRegionHeight;
        
        // Calculate preview rectangle centered on cursor
        const previewX = mouseX - width / 2;
        const previewY = mouseY - height / 2;
        
        // Check for collision with existing regions
        const hasCollision = checkMultiplierRegionCollision(mouseX, mouseY);
        
        ctx.beginPath();
        ctx.rect(previewX, previewY, width, height);
        ctx.fillStyle = hasCollision ? `rgba(255, 71, 87, 0.3)` : `rgba(156, 136, 255, 0.3)`; // Red if collision, purple if OK
        ctx.fill();
        ctx.strokeStyle = hasCollision ? '#ff4757' : '#9c88ff'; // Red if collision, purple if OK
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]); // Dashed border
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
        
        // Draw white text
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`×${multiplierFactor}`, mouseX, mouseY);
    }
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
        
        // Check for balls passing through multiplier regions
        checkMultiplierRegions();
    }
    
    // Render
    render();
    
    // Continue loop
    requestAnimationFrame(gameLoop);
}

// Function to initialize sliders with current physics settings
function initializeSliders() {
    gravitySlider.value = physicsSettings.gravity;
    airResistanceSlider.value = physicsSettings.airResistance;
    sizeSlider.value = physicsSettings.circleSize;
    bounceSlider.value = physicsSettings.bounciness;
    frictionSlider.value = physicsSettings.friction;
    densitySlider.value = physicsSettings.density;
    spawnDelaySlider.value = physicsSettings.spawnDelay;
    maxWallLengthSlider.value = physicsSettings.maxWallLength;
    multiplierSlider.value = multiplierFactor;
    multiplierRadiusSlider.value = physicsSettings.multiplierRegionRadius;
}

// Initialize sliders and display values
initializeSliders();
updateDisplayValues();

// Initialize drop button state to reflect default (floor is off)
dropButton.textContent = 'Replace Floor';
dropButton.style.background = '#2ed573';

// Start the simulation
requestAnimationFrame(gameLoop);