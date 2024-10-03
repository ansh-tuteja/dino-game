let dinoX = 50;
let dinoY;
let dinoSize = 60;
let dinoVelocity = 0;
const gravity = 0.6;
let isGameOver = false;
let score = 0;

let dinoImg;
let cactusImg;

let obstacles = [];
const obstacleSize = 55;
const minObstacleSpacing = 300;

let gameSpeed = 5;

function preload() {
  dinoImg = loadImage('dino1.png');
  cactusImg = loadImage('cactus.png');
}

function setup() {
  createCanvas(800, 450);
  dinoY = height - dinoSize;
}

function addObstacle() {
  const lastObstacle = obstacles[obstacles.length - 1];
  if (!lastObstacle || width - lastObstacle.x >= minObstacleSpacing) {
    const obstacle = {
      x: width,
      y: height - obstacleSize
    };
    obstacles.push(obstacle);
  }
}

function updateObstacles() {
  for (let obstacle of obstacles) {
    obstacle.x -= gameSpeed;
  }
  obstacles = obstacles.filter(obstacle => obstacle.x > -obstacleSize);
}

function drawObstacles() {
  for (let obstacle of obstacles) {
    image(cactusImg, obstacle.x, obstacle.y, obstacleSize, obstacleSize);
  }
}

function checkCollisions() {
  for (let obstacle of obstacles) {
    const dx = (dinoX + dinoSize/2) - (obstacle.x + obstacleSize/2);
    const dy = (dinoY + dinoSize/2) - (obstacle.y + obstacleSize/2);
    const distance = sqrt(dx * dx + dy * dy);
    
    if (distance < (dinoSize/3 + obstacleSize/3)) {
      return true;
    }
  }
  return false;
}

function jumpDino() {
  if (dinoY >= height - dinoSize) {
    dinoVelocity = -10;
  }
}

function updateDino() {
  dinoY += dinoVelocity;
  dinoVelocity += gravity;
  dinoY = constrain(dinoY, 0, height - dinoSize);
}

function drawDino() {
  image(dinoImg, dinoX, dinoY, dinoSize, dinoSize);
}

function drawScore() {
  textSize(20);
  textAlign(LEFT);
  fill(0);
  text('Score: ' + score, 10, 30);
}

function drawGameOver() {
  textSize(64);
  textAlign(CENTER, CENTER);
  fill(0);
  text('Game Over', width/2, height/2);
  textSize(32);
  text('Press R to restart', width/2, height/2 + 50);
}

function resetGame() {
  obstacles = [];
  dinoY = height - dinoSize;
  dinoVelocity = 0;
  gameSpeed = 5;
  score = 0;
  isGameOver = false;
  loop();
}

function draw() {
  background(220);
  
  if (!isGameOver) {
    updateDino();
    updateObstacles();
    
    if (random(1) < 0.02) {
      addObstacle();
    }
    
    if (checkCollisions()) {
      isGameOver = true;
    }
    
    score++;
    if (score % 500 === 0) {
      gameSpeed = min(gameSpeed + 0.5, 12);
    }
  }
  
  drawObstacles();
  drawDino();
  drawScore();
  
  if (isGameOver) {
    drawGameOver();
    noLoop();
  }
}

function keyPressed() {
  if (key == " ") {
    jumpDino();
  }
  if (key == "r" && isGameOver) {
    resetGame();
  }
}