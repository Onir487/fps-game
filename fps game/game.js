const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  angle: 0,
  health: 100,
  score: 0,
  speed: 5
};

let bullets = [];
let enemies = [];
let lastShotTime = 0;
const shootCooldown = 500; // milliseconds

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleInput();
  updateBullets();
  updateEnemies();
  drawScene();
  requestAnimationFrame(gameLoop);
}

// Handle player input
function handleInput() {
  // Movement
  if (keys['ArrowUp']) {
    player.x += player.speed * Math.cos(player.angle);
    player.y += player.speed * Math.sin(player.angle);
  }
  if (keys['ArrowDown']) {
    player.x -= player.speed * Math.cos(player.angle);
    player.y -= player.speed * Math.sin(player.angle);
  }
  if (keys['ArrowLeft']) {
    player.angle -= 0.05;
  }
  if (keys['ArrowRight']) {
    player.angle += 0.05;
  }

  // Shooting
  if (keys['Space'] && Date.now() - lastShotTime > shootCooldown) {
    shootBullet();
    lastShotTime = Date.now();
  }
}

// Shoot a bullet
function shootBullet() {
  bullets.push({
    x: player.x,
    y: player.y,
    angle: player.angle,
    speed: 10
  });
}

// Update bullets
function updateBullets() {
  bullets.forEach((bullet, index) => {
    bullet.x += bullet.speed * Math.cos(bullet.angle);
    bullet.y += bullet.speed * Math.sin(bullet.angle);

    // Check for collisions
    enemies.forEach((enemy, eIndex) => {
      if (Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y) < 20) {
        enemies.splice(eIndex, 1);
        bullets.splice(index, 1);
        player.score += 10;
      }
    });

    // Remove bullet if out of bounds
    if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
      bullets.splice(index, 1);
    }
  });
}

// Update enemies
function updateEnemies() {
  if (Math.random() < 0.01) {
    enemies.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      health: 50
    });
  }

  enemies.forEach((enemy, index) => {
    // Simple AI: move towards player
    let angleToPlayer = Math.atan2(player.y - enemy.y, player.x - enemy.x);
    enemy.x += Math.cos(angleToPlayer) * 2;
    enemy.y += Math.sin(angleToPlayer) * 2;

    // Check if enemy collides with player
    if (Math.hypot(enemy.x - player.x, enemy.y - player.y) < 30) {
      player.health -= 1;
      enemies.splice(index, 1);
    }
  });
}

// Draw the scene
function drawScene() {
  // Draw player
  ctx.beginPath();
  ctx.arc(player.x, player.y, 20, 0, Math.PI * 2);
  ctx.fillStyle = 'blue';
  ctx.fill();

  // Draw bullets
  bullets.forEach(bullet => {
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
  });

  // Draw enemies
  enemies.forEach(enemy => {
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, 20, 0, Math.PI * 2);
    ctx.fillStyle = 'green';
    ctx.fill();
  });

  // Draw UI
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText(`Health: ${player.health}`, 10, 30);
  ctx.fillText(`Score: ${player.score}`, canvas.width - 100, 30);
}

// Key handling
let keys = {};
document.addEventListener('keydown', e => {
  keys[e.key] = true;
});
document.addEventListener('keyup', e => {
  keys[e.key] = false;
});

gameLoop();
