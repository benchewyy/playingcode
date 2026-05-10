// Simple Block Jump Game - Original Version
console.log('Simple Block Jump Game loaded!');

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const gameOverDiv = document.getElementById('game-over');
const scoreDiv = document.getElementById('score');

const gravity = 0.6;
const jumpStrength = -15;
const groundY = canvas.height - 50;
const playerWidth = 30;
const playerHeight = 30;
const obstacleWidth = 30;
const obstacleHeight = 40;
const obstacleSpeed = 5;

let player = {
    x: 100,
    y: groundY - playerHeight,
    vy: 0,
    onGround: true
};

let obstacles = [];
let score = 0;
let gameRunning = true;
let gameOver = false;

function drawPlayer() {
    ctx.fillStyle = '#333';
    ctx.fillRect(player.x, player.y, playerWidth, playerHeight);
}

function drawObstacle(obstacle) {
    ctx.fillStyle = '#f00';
    ctx.beginPath();
    ctx.moveTo(obstacle.x, groundY);
    ctx.lineTo(obstacle.x + obstacleWidth / 2, groundY - obstacleHeight);
    ctx.lineTo(obstacle.x + obstacleWidth, groundY);
    ctx.closePath();
    ctx.fill();
}

function updatePlayer() {
    player.vy += gravity;
    player.y += player.vy;

    if (player.y >= groundY - playerHeight) {
        player.y = groundY - playerHeight;
        player.vy = 0;
        player.onGround = true;
    } else {
        player.onGround = false;
    }
}

function updateObstacles() {
    if (Math.random() < 0.01) {
        obstacles.push({
            x: canvas.width,
            y: groundY - obstacleHeight
        });
    }

    obstacles.forEach((obstacle, index) => {
        obstacle.x -= obstacleSpeed;
        if (obstacle.x + obstacleWidth < 0) {
            obstacles.splice(index, 1);
            score++;
        }
    });
}

function checkCollision() {
    obstacles.forEach(obstacle => {
        if (player.x < obstacle.x + obstacleWidth &&
            player.x + playerWidth > obstacle.x &&
            player.y + playerHeight > obstacle.y) {
            gameOver = true;
        }
    });
}

function drawGround() {
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
}

function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGround();
    updatePlayer();
    updateObstacles();
    checkCollision();

    drawPlayer();
    obstacles.forEach(drawObstacle);

    scoreDiv.textContent = `Score: ${score}`;

    if (gameOver) {
        gameRunning = false;
        gameOverDiv.classList.remove('hidden');
        return;
    }

    requestAnimationFrame(gameLoop);
}

function jump() {
    if (player.onGround && gameRunning) {
        player.vy = jumpStrength;
        player.onGround = false;
    }
}

function restart() {
    player.x = 100;
    player.y = groundY - playerHeight;
    player.vy = 0;
    player.onGround = true;
    obstacles = [];
    score = 0;
    gameRunning = true;
    gameOver = false;
    gameOverDiv.classList.add('hidden');
    gameLoop();
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        jump();
    } else if (e.code === 'KeyR' && gameOver) {
        restart();
    }
});

// Start the game
gameLoop();