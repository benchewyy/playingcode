// Full Block Jump Game
console.log('Block Jump Game script loaded successfully!');

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const gameOverDiv = document.getElementById('game-over');
const scoreDiv = document.getElementById('score');

if (!canvas) {
    console.error('Canvas element not found!');
    alert('Canvas not found!');
} else {
    console.log('Canvas found, starting game...');
}

const gravity = 0.6;
const minJumpStrength = -15; // Increased from -8 for higher single-tap jumps
const maxJumpStrength = -25; // Also increased for even higher double-tap jumps
const jumpChargeRate = 0.8;
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
let lastSpacePress = 0;
let isDoublePress = false;

function drawPlayer() {
    // Simple player color - changes briefly for double jump feedback
    let color = isDoublePress ? '#ff4444' : '#333';
    ctx.fillStyle = color;
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
        isDoublePress = false; // Reset double press indicator when landing
    } else {
        player.onGround = false;
    }
}

function updateObstacles() {
    if (Math.random() < 0.008) {
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
        console.log('Game Over! Final score:', score);
        return;
    }

    requestAnimationFrame(gameLoop);
}

function jump(powerJump = false) {
    if (player.onGround && gameRunning) {
        player.vy = powerJump ? maxJumpStrength : minJumpStrength;
        player.onGround = false;
        if (powerJump) {
            isDoublePress = true;
            console.log('Power jump activated!');
        }
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
    lastSpacePress = 0;
    isDoublePress = false;
    gameOverDiv.classList.add('hidden');
    gameLoop();
}

document.addEventListener('keydown', (e) => {
    console.log('Key pressed:', e.code);
    if (e.code === 'Space') {
        e.preventDefault();
        if (!player.onGround || !gameRunning) return;

        const currentTime = Date.now();
        const timeDiff = currentTime - lastSpacePress;

        if (timeDiff < 300) { // Double press within 300ms
            jump(true); // Power jump
            lastSpacePress = 0; // Reset
        } else {
            // First press - set timer for potential double press
            lastSpacePress = currentTime;
            // Set a timeout to trigger normal jump if no second press
            setTimeout(() => {
                if (lastSpacePress === currentTime && player.onGround && gameRunning) {
                    jump(false); // Normal jump
                    lastSpacePress = 0;
                }
            }, 310); // Slightly longer than double-press window
        }
    } else if (e.code === 'KeyR' && gameOver) {
        restart();
    }
});

// Start the game
console.log('Starting Block Jump game...');
gameLoop();