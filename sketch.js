// Game Core Management States
let gameState = "MENU"; // States: "MENU", "PLAYING", "PAUSED", "GAMEOVER"
let gameMode = "STRIKE"; // Modes: "STRIKE" (Player Shoots), "EVASION" (No Shoot Mode + Extra Speed)
let difficulty = "NORMAL"; // Difficulties: "EASY", "NORMAL", "HARD"

// Game Element Inventories
let player;
let spaceships = [];
let projectiles = [];
let powerUps = [];

// Grid Tracking Arrays
let menuGrid = [[], [], []]; 
let activeRowIndex = 0;   
let activeColIndex = 0;   

let pauseButtons = [];
let activePauseIndex = 0;

// Global Baseline Speed Limits
const BASE_PLAYER_SPEED = 5;
let globalEnemySpeed = 3;

// Game Calibration Parameters
let score = 0;
let spawnRate = 90;
let enemyFireRate = 60;

// Textures Management
let assets = {};
let projectileSpriteSheet; 
let projectileFrames = []; 

function preload() {
  assets.player = loadImage('assets/player.png');
  assets.playerAccel = loadImage('assets/player_accelerating.png');
  assets.shipCircle = loadImage('assets/spaceship_circle.png');
  assets.shipSquare = loadImage('assets/spaceship_square.png');
  assets.shipTriangle = loadImage('assets/spaceship_triangle.png');
  projectileSpriteSheet = loadImage('assets/projectile_spritesheet.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Crop 5x9 matrix grid frames from spritesheet texture dynamically
  let cols = 5;
  let rows = 9;
  if (projectileSpriteSheet) {
    let frameWidth = projectileSpriteSheet.width / cols;
    let frameHeight = projectileSpriteSheet.height / rows; 
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let targetX = c * frameWidth;
        let targetY = r * frameHeight;
        if (targetX + frameWidth <= projectileSpriteSheet.width && targetY + frameHeight <= projectileSpriteSheet.height) {
          projectileFrames.push(projectileSpriteSheet.get(targetX, targetY, frameWidth, frameHeight));
        }
      }
    }
  }

  buildMenuGrid();
  buildPauseButtons();
}

function draw() {
  // Clear layout tracking loops
  clear(); 
  
  if (gameState === "MENU") {
    drawMenu();
  } else if (gameState === "PLAYING") {
    runGameEngine();
  } else if (gameState === "PAUSED") {
    drawPauseScreen();
  } else if (gameState === "GAMEOVER") {
    displayGameOver();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildMenuGrid();  
  buildPauseButtons(); 
}

function buildMenuGrid() {
  textAlign(LEFT, TOP);
  menuGrid = [[], [], []];
  let centerX = width / 2;
  let centerY = height / 2;

  menuGrid[0].push(new Button(centerX - 160, centerY - 40, 140, 45, "Strike Mode", () => { gameMode = "STRIKE"; }, 0, 0));
  menuGrid[0].push(new Button(centerX + 20, centerY - 40, 140, 45, "Evasion Mode", () => { gameMode = "EVASION"; }, 0, 1));

  menuGrid[1].push(new Button(centerX - 170, centerY + 60, 100, 40, "Easy", () => { setDifficulty("EASY"); }, 1, 0));
  menuGrid[1].push(new Button(centerX - 50, centerY + 60, 100, 40, "Normal", () => { setDifficulty("NORMAL"); }, 1, 1));
  menuGrid[1].push(new Button(centerX + 70, centerY + 60, 100, 40, "Hard", () => { setDifficulty("HARD"); }, 1, 2));

  menuGrid[2].push(new Button(centerX - 100, centerY + 160, 200, 50, "LAUNCH SIMULATION", () => { startGame(); }, 2, 0));
}

function buildPauseButtons() {
  textAlign(LEFT, TOP);
  pauseButtons = [];
  let centerX = width / 2;
  let centerY = height / 2;

  pauseButtons.push(new Button(centerX - 100, centerY - 20, 200, 45, "RESUME GAME", () => { gameState = "PLAYING"; }, 0, 0));
  pauseButtons.push(new Button(centerX - 100, centerY + 40, 200, 45, "RESTART MATCH", () => { startGame(); }, 1, 0));
  pauseButtons.push(new Button(centerX - 100, centerY + 100, 200, 45, "MAIN MENU", () => { buildMenuGrid(); gameState = "MENU"; }, 2, 0));
}

function setDifficulty(level) {
  difficulty = level;
  if (level === "EASY") {
    spawnRate = 120; enemyFireRate = 90; globalEnemySpeed = 2;
  } else if (level === "NORMAL") {
    spawnRate = 90;  enemyFireRate = 60; globalEnemySpeed = 3.5;
  } else if (level === "HARD") {
    spawnRate = 50;  enemyFireRate = 35; globalEnemySpeed = 5.5; 
  }
}

function startGame() {
  spaceships = []; projectiles = []; powerUps = []; score = 0;
  player = new Player(width / 4, height / 2);
  gameState = "PLAYING";
}

function drawMenu() {
  textAlign(CENTER, CENTER);
  fill(0, 200, 255);
  textSize(min(44, width * 0.05));
  text("ARCADE SPACE ODYSSEY", width / 2, height / 2 - 170);
  
  textSize(16);
  fill(255, 180, 0);
  text(`[ Active Weapon Profile: ${gameMode === "STRIKE" ? "Tactical Laser Strike Mode" : "Overdrive Speed Evasion Mode"} ]`, width / 2, height / 2 - 110);
  text(`[ Selected Threat Level: ${difficulty} ]`, width / 2, height / 2 - 85);

  for (let row = 0; row < menuGrid.length; row++) {
    for (let btn of menuGrid[row]) {
      if (btn.isMouseOver()) {
        activeRowIndex = btn.rIndex;
        activeColIndex = btn.cIndex;
      }
      btn.display2D(activeRowIndex, activeColIndex);
    }
  }
}

function drawPauseScreen() {
  runGameEngineGraphicsOnly();
  fill(0, 0, 0, 150);
  rectMode(CORNER);
  rect(0, 0, width, height);

  textAlign(CENTER, CENTER);
  fill(0, 230, 255);
  textSize(40);
  text("SYSTEM PAUSED", width / 2, height / 2 - 100);

  for (let btn of pauseButtons) {
    if (btn.isMouseOver()) activePauseIndex = btn.rIndex;
    btn.display1D(activePauseIndex);
  }
}

function runGameEngineGraphicsOnly() {
  player.display();
  for (let ship of spaceships) ship.display();
  for (let proj of projectiles) proj.display();
  for (let p of powerUps) p.display();
  displayHeadsUpDisplay();
}

function runGameEngine() {
  handleSpawning();
  player.update();
  player.display();

  for (let i = projectiles.length - 1; i >= 0; i--) {
    projectiles[i].update();
    projectiles[i].display();
    
    if (projectiles[i].isEnemy && projectiles[i].hits(player)) {
      player.health -= (difficulty === "HARD" ? 20 : 10); 
      projectiles.splice(i, 1);
      if (player.health <= 0) { player.health = 0; gameState = "GAMEOVER"; }
      continue;
    }

    if (!projectiles[i].isEnemy) {
      for (let j = spaceships.length - 1; j >= 0; j--) {
        if (projectiles[i] && projectiles[i].hits(spaceships[j])) {
          score += (difficulty === "HARD" ? 30 : 10);
          spaceships.splice(j, 1); projectiles.splice(i, 1);
          break;
        }
      }
    }

    if (projectiles[i] && projectiles[i].isOffScreen()) projectiles.splice(i, 1);
  }

  for (let i = spaceships.length - 1; i >= 0; i--) {
    spaceships[i].update(); spaceships[i].display();
    if (spaceships[i].hits(player)) gameState = "GAMEOVER";
    if (spaceships[i].x < -spaceships[i].w) spaceships.splice(i, 1);
  }

  for (let i = powerUps.length - 1; i >= 0; i--) {
    powerUps[i].update(); powerUps[i].display();
    if (powerUps[i].hits(player)) { player.applyPowerUp(); powerUps.splice(i, 1); } 
    else if (powerUps[i].x < -powerUps[i].w) powerUps.splice(i, 1);
  }

  displayHeadsUpDisplay();
}

function handleSpawning() {
  if (frameCount % spawnRate === 0) {
    spaceships.push(new Spaceship(width + 50, random(60, height - 60), random(['circle', 'square', 'triangle'])));
  }
  if (frameCount % enemyFireRate === 0 && spaceships.length > 0) {
    let targetShip = random(spaceships);
    projectiles.push(new Projectile(targetShip.x, targetShip.y, -globalEnemySpeed * 1.6, 0, true));
  }
  if (frameCount % 400 === 0) powerUps.push(new PowerUp(width + 30, random(60, height - 60)));
}

function displayHeadsUpDisplay() {
  fill(255); noStroke(); textSize(20); textAlign(LEFT, TOP);
  text(`Score: ${score}`, 24, 24);
  text(`Shield Integrity: ${player.health}%`, 24, 54);
  
  textAlign(RIGHT, TOP); textSize(14); fill(255, 255, 255, 150);
  text("Press ESC or 'P' to Pause", width - 24, 24);
}

function displayGameOver() {
  background(40, 10, 10, 220);
  fill(255); noStroke(); textAlign(CENTER, CENTER);
  textSize(48); text("SIMULATION OVER", width / 2, height / 2 - 40);
  textSize(20); text(`Final Score Matrix achieved: ${score}`, width / 2, height / 2 + 20);
  text("Press Escape or Spacebar to return to Menu", width / 2, height / 2 + 70);
}

function mousePressed() {
  if (gameState === "MENU") {
    for (let r = 0; r < menuGrid.length; r++) {
      for (let btn of menuGrid[r]) btn.checkClick(mouseX, mouseY);
    }
  } else if (gameState === "PAUSED") {
    for (let btn of pauseButtons) btn.checkClick(mouseX, mouseY);
  }
}

function keyPressed() {
  if (gameState === "MENU") {
    if (keyCode === DOWN_ARROW || key === 's' || key === 'S') {
      activeRowIndex = (activeRowIndex + 1) % menuGrid.length;
      if (activeColIndex >= menuGrid[activeRowIndex].length) activeColIndex = menuGrid[activeRowIndex].length - 1;
    }
    if (keyCode === UP_ARROW || key === 'w' || key === 'W') {
      activeRowIndex = (activeRowIndex - 1 + menuGrid.length) % menuGrid.length;
      if (activeColIndex >= menuGrid[activeRowIndex].length) activeColIndex = menuGrid[activeRowIndex].length - 1;
    }
    if (keyCode === RIGHT_ARROW || key === 'd' || key === 'D') activeColIndex = (activeColIndex + 1) % menuGrid[activeRowIndex].length;
    if (keyCode === LEFT_ARROW || key === 'a' || key === 'A') activeColIndex = (activeColIndex - 1 + menuGrid[activeRowIndex].length) % menuGrid[activeRowIndex].length;
    if (keyCode === ENTER || keyCode === RETURN || key === ' ') menuGrid[activeRowIndex][activeColIndex].callback();
    return;
  }

  if (gameState === "PAUSED") {
    if (keyCode === DOWN_ARROW || key === 's' || key === 'S') activePauseIndex = (activePauseIndex + 1) % pauseButtons.length;
    if (keyCode === UP_ARROW || key === 'w' || key === 'W') activePauseIndex = (activePauseIndex - 1 + pauseButtons.length) % pauseButtons.length;
    if (keyCode === ENTER || keyCode === RETURN) pauseButtons[activePauseIndex].callback();
  }

  if ((gameState === "PLAYING" || gameState === "PAUSED") && (key === 'p' || key === 'P' || keyCode === ESCAPE)) {
    gameState = (gameState === "PLAYING") ? "PAUSED" : "PLAYING";
    return;
  }

  if (gameState === "PLAYING" && gameMode === "STRIKE" && key === ' ') {
    projectiles.push(new Projectile(player.x + player.w/2, player.y, 8, 0, false));
  }
  
  if (gameState === "GAMEOVER" && (key === ' ' || keyCode === ESCAPE)) {
    activeRowIndex = 0; activeColIndex = 0; activePauseIndex = 0;
    buildMenuGrid(); gameState = "MENU";
  }
}