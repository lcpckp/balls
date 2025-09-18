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
            
            if (multiplierRegion) {
                handleMultiplierCollision(ball, multiplierRegion);
            } else if (portalRegion) {
                handlePortalCollision(ball, portalRegion);
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
    airResistance: 0,
    circleSize: 5,
    bounciness: 0,
    friction: 0,
    density: 0.001,
    spawnDelay: 5,
    multiplierRegionWidth: 60, // Fixed width for multiplier regions
    multiplierRegionHeight: 20 // Fixed height for multiplier regions
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

// Remover tool state
let removerMode = false;

// Portal tool state
let portalMode = false;
let portalRegions = []; // Array to store portal regions

// Mouse position tracking for cursor preview
let mouseX = 0;
let mouseY = 0;
let isMouseOnCanvas = false;

// Hover tracking for remover tool
let hoveredWall = null;
let hoveredMultiplierRegion = null;
let hoveredPortalRegion = null;

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
const multiplierFactorDisplay = document.getElementById('multiplierFactorDisplay');
const wallControls = document.getElementById('wallControls');
const removerToolButton = document.getElementById('removerToolButton');
const portalToolButton = document.getElementById('portalToolButton');
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
            fillStyle: '#ffffff' // Start as white
        }
    });
    
    // Add portal status tracking
    circle.hasUsedPortal = false;
    
    World.add(world, circle);
    objectCount++;
    objectCountElement.textContent = objectCount;
    
    return circle;
}

// Function to create a wall from start to end coordinates
function createWall(startX, startY, endX, endY) {
    const length = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
    const wallThickness = 20;
    
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
            render: { fillStyle: '#8B4513' }
        }
    );
    
    World.add(world, wall);
    objectCount++;
    objectCountElement.textContent = objectCount;
    
    return wall;
}

// Function to check if a new multiplier region placement conflicts with existing regions
function checkMultiplierRegionCollision(centerX, centerY) {
    // No minimum distance requirement - regions can be placed anywhere
    return false;
}

// Function to create a multiplier region at the specified position
function createMultiplierRegion(centerX, centerY, factor) {
    // Use fixed dimensions
    const width = physicsSettings.multiplierRegionWidth;
    const height = physicsSettings.multiplierRegionHeight;
    
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
        factor: factor,
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
    
    // Use same dimensions as multiplier regions
    const width = physicsSettings.multiplierRegionWidth;
    const height = physicsSettings.multiplierRegionHeight;
    
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

// Function to check if a point is inside a wall body
function isPointInWall(x, y, wall) {
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

// Function to check what object is being hovered over
function getHoveredObject(x, y) {
    // First check portal regions (they're drawn on top)
    for (let i = portalRegions.length - 1; i >= 0; i--) {
        const region = portalRegions[i];
        if (isPointInPortalRegion(x, y, region)) {
            return { type: 'portal', object: region };
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
        if (body === leftWall || body === rightWall || body === tankWall || body === tankTopWall || body.circleRadius) {
            continue;
        }
        
        if (isPointInWall(x, y, body)) {
            return { type: 'wall', object: body };
        }
    }
    
    return null;
}

// Function to remove wall, multiplier region, or portal region at click point
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
        if (body === leftWall || body === rightWall || body === tankWall || body === tankTopWall || body.circleRadius || body.isSensor) {
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
        if (body !== leftWall && body !== rightWall && body !== tankWall && body !== tankTopWall) {
            World.remove(world, body);
        }
    });
    // Clear multiplier regions and portal regions arrays
    multiplierRegions = [];
    portalRegions = [];
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
            
            // Inherit portal status from parent ball
            newBall.hasUsedPortal = ball.hasUsedPortal;
            newBall.render.fillStyle = ball.render.fillStyle;
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
            ball.render.fillStyle = '#000000';
            
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
    
    // Exit other modes if wall mode is activated
    if (wallDrawingMode) {
        multiplierPlacementMode = false;
        multiplierToolButton.textContent = 'Multiplier Region Tool';
        multiplierToolButton.style.background = '#9c88ff';
        multiplierFactorDisplay.style.display = 'none';
        removerMode = false;
        removerToolButton.textContent = 'Remover Tool';
        removerToolButton.style.background = '#ff4757';
        portalMode = false;
        portalToolButton.textContent = 'Portal Tool';
        portalToolButton.style.background = '#00b894';
    } else {
        // Reset cursor when deactivating wall tool
        canvas.style.cursor = 'crosshair';
    }
});

// Multiplier tool button event listener
multiplierToolButton.addEventListener('click', () => {
    multiplierPlacementMode = !multiplierPlacementMode;
    multiplierToolButton.textContent = multiplierPlacementMode ? 'Exit Multiplier Tool' : 'Multiplier Region Tool';
    multiplierToolButton.style.background = multiplierPlacementMode ? '#ff6b6b' : '#9c88ff';
    multiplierFactorDisplay.style.display = multiplierPlacementMode ? 'block' : 'none';
    canvas.style.cursor = multiplierPlacementMode ? 'none' : 'crosshair';
    
    // Exit other modes if multiplier mode is activated
    if (multiplierPlacementMode) {
        wallDrawingMode = false;
        wallToolButton.textContent = 'Wall Drawing Tool';
        wallToolButton.style.background = '#ffa502';
        removerMode = false;
        removerToolButton.textContent = 'Remover Tool';
        removerToolButton.style.background = '#ff4757';
        portalMode = false;
        portalToolButton.textContent = 'Portal Tool';
        portalToolButton.style.background = '#00b894';
    } else {
        // Reset cursor when deactivating multiplier tool
        canvas.style.cursor = 'crosshair';
    }
});

// Remover tool button event listener
removerToolButton.addEventListener('click', () => {
    removerMode = !removerMode;
    removerToolButton.textContent = removerMode ? 'Exit Remover Tool' : 'Remover Tool';
    removerToolButton.style.background = removerMode ? '#ff6b6b' : '#ff4757';
    canvas.style.cursor = removerMode ? 'crosshair' : 'crosshair';
    
    // Exit other modes if remover mode is activated
    if (removerMode) {
        wallDrawingMode = false;
        wallToolButton.textContent = 'Wall Drawing Tool';
        wallToolButton.style.background = '#ffa502';
        multiplierPlacementMode = false;
        multiplierToolButton.textContent = 'Multiplier Region Tool';
        multiplierToolButton.style.background = '#9c88ff';
        multiplierFactorDisplay.style.display = 'none';
        portalMode = false;
        portalToolButton.textContent = 'Portal Tool';
        portalToolButton.style.background = '#00b894';
    } else {
        // Reset cursor when deactivating remover tool
        canvas.style.cursor = 'crosshair';
    }
});

// Portal tool button event listener
portalToolButton.addEventListener('click', () => {
    portalMode = !portalMode;
    portalToolButton.textContent = portalMode ? 'Exit Portal Tool' : 'Portal Tool';
    portalToolButton.style.background = portalMode ? '#ff6b6b' : '#00b894';
    canvas.style.cursor = portalMode ? 'crosshair' : 'crosshair';
    
    // Exit other modes if portal mode is activated
    if (portalMode) {
        wallDrawingMode = false;
        wallToolButton.textContent = 'Wall Drawing Tool';
        wallToolButton.style.background = '#ffa502';
        multiplierPlacementMode = false;
        multiplierToolButton.textContent = 'Multiplier Region Tool';
        multiplierToolButton.style.background = '#9c88ff';
        multiplierFactorDisplay.style.display = 'none';
        removerMode = false;
        removerToolButton.textContent = 'Remover Tool';
        removerToolButton.style.background = '#ff4757';
    } else {
        // Reset cursor when deactivating portal tool
        canvas.style.cursor = 'crosshair';
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

// Click handler for spawning circles or starting wall/multiplier/portal drawing
canvas.addEventListener('mousedown', function(event) {
    if (isPaused) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
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
    } else {
        // Canvas click no longer spawns balls - only +10 button does
        // This section is kept for wall/multiplier/portal tool functionality
    }
});

// Mouse enter handler
canvas.addEventListener('mouseenter', function() {
    isMouseOnCanvas = true;
});

// Mouse leave handler
canvas.addEventListener('mouseleave', function() {
    isMouseOnCanvas = false;
    hoveredWall = null;
    hoveredMultiplierRegion = null;
    hoveredPortalRegion = null;
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
    
    // Update hover tracking for remover tool
    if (removerMode) {
        const hovered = getHoveredObject(x, y);
        if (hovered) {
            if (hovered.type === 'wall') {
                hoveredWall = hovered.object;
                hoveredMultiplierRegion = null;
                hoveredPortalRegion = null;
            } else if (hovered.type === 'multiplier') {
                hoveredMultiplierRegion = hovered.object;
                hoveredWall = null;
                hoveredPortalRegion = null;
            } else if (hovered.type === 'portal') {
                hoveredPortalRegion = hovered.object;
                hoveredWall = null;
                hoveredMultiplierRegion = null;
            }
        } else {
            hoveredWall = null;
            hoveredMultiplierRegion = null;
            hoveredPortalRegion = null;
        }
    } else {
        hoveredWall = null;
        hoveredMultiplierRegion = null;
        hoveredPortalRegion = null;
    }
    
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
        
        // Check if this wall is being hovered over in remover mode
        const isHovered = removerMode && hoveredWall === body;
        
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
        
        // Fill with color - red if hovered in remover mode, original color otherwise
        if (isHovered) {
            ctx.fillStyle = '#ff4757'; // Red for hovered walls
        } else {
            ctx.fillStyle = body.render.fillStyle || '#FF6B6B';
        }
        ctx.fill();
        
        // Add border - thicker and red if hovered
        if (isHovered) {
            ctx.strokeStyle = '#ff4757';
            ctx.lineWidth = 4;
        } else {
            ctx.strokeStyle = '#333';
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
            ctx.fillStyle = `rgba(0, 123, 255, 0.3)`; // Blue portal
        } else {
            ctx.fillStyle = `rgba(255, 165, 0, 0.3)`; // Orange portal
        }
        ctx.fill();
        
        // Set border color
        if (isHovered) {
            ctx.strokeStyle = '#ff4757'; // Red if hovered
        } else if (region.color === 'blue') {
            ctx.strokeStyle = '#007bff'; // Blue border
        } else {
            ctx.strokeStyle = '#ffa500'; // Orange border
        }
        ctx.lineWidth = isHovered ? 3 : 2; // Thicker border if hovered
        ctx.setLineDash([5, 5]); // Dashed border
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
        
        // Draw white text
        ctx.fillStyle = '#ffffff';
        ctx.fillText(labelText, centerX, centerY);
    });
    
    // Draw multiplier regions
    multiplierRegions.forEach(region => {
        // Calculate center of region
        const centerX = (region.x1 + region.x2) / 2;
        const centerY = (region.y1 + region.y2) / 2;
        
        // Check if this region is being hovered over in remover mode
        const isHovered = removerMode && hoveredMultiplierRegion === region;
        
        
        // Draw the region rectangle
        ctx.beginPath();
        ctx.rect(region.x1, region.y1, region.x2 - region.x1, region.y2 - region.y1);
        ctx.fillStyle = isHovered ? `rgba(255, 71, 87, 0.5)` : `rgba(156, 136, 255, 0.3)`; // Red if hovered, purple if not
        ctx.fill();
        ctx.strokeStyle = isHovered ? '#ff4757' : '#9c88ff'; // Red if hovered, purple if not
        ctx.lineWidth = isHovered ? 3 : 2; // Thicker border if hovered
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
        const wallThickness = 20;
        
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
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 4]); // Dashed border for preview
        ctx.stroke();
        ctx.setLineDash([]); // Reset line dash
    }
    
    // Draw multiplier region cursor preview if in placement mode and mouse is on canvas
    if (multiplierPlacementMode && isMouseOnCanvas) {
        const width = physicsSettings.multiplierRegionWidth;
        const height = physicsSettings.multiplierRegionHeight;
        
        // Calculate preview rectangle centered on cursor
        const previewX = mouseX - width / 2;
        const previewY = mouseY - height / 2;
        
        ctx.beginPath();
        ctx.rect(previewX, previewY, width, height);
        ctx.fillStyle = `rgba(156, 136, 255, 0.3)`; // Purple preview
        ctx.fill();
        ctx.strokeStyle = '#9c88ff'; // Purple border
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
    
    // Draw portal region cursor preview if in portal mode and mouse is on canvas
    if (portalMode && isMouseOnCanvas) {
        const width = physicsSettings.multiplierRegionWidth;
        const height = physicsSettings.multiplierRegionHeight;
        
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
    multiplierSlider.value = multiplierFactor;
}

// Initialize sliders and display values
initializeSliders();
updatePhysicsSettings();
updateDisplayValues();

// Initialize drop button state to reflect default (floor is off)
dropButton.textContent = 'Replace Floor';
dropButton.style.background = '#2ed573';

// Start the simulation
requestAnimationFrame(gameLoop);