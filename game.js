// this was definetly the most fun yet frustrating thing ive ever made. this is a game made to stand out during my internship application...

const player = document.getElementById('player');
const game = document.getElementById('game');
const startButton = document.getElementById('start-btn');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highscore');
const gameOverMessage = document.createElement('div');

let playerX = 180;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let gameInterval, objectInterval, velocity = 0;
let isGameActive = false;  

let acceleration = 0.2;
let friction = 0.05;
let maxSpeed = 5;

let leftKeyPressed = false;
let rightKeyPressed = false;

highScoreDisplay.textContent = highScore;

function updatePlayerPosition() {
    if (!isGameActive) return;  

    if (leftKeyPressed && !rightKeyPressed) {
        velocity -= acceleration;
    } else if (rightKeyPressed && !leftKeyPressed) {
        velocity += acceleration;
    } else {
        if (velocity > 0) {
            velocity -= friction;
            if (velocity < 0) velocity = 0;
        } else if (velocity < 0) {
            velocity += friction;
            if (velocity > 0) velocity = 0;
        }
    }

    if (velocity > maxSpeed) velocity = maxSpeed;
    if (velocity < -maxSpeed) velocity = -maxSpeed;

    playerX += velocity;
    
    if (playerX < 0) {
        playerX = 0;
        velocity = 0;
    } else if (playerX > 360) {
        playerX = 360;
        velocity = 0;
    }

    player.style.left = playerX + 'px';

    requestAnimationFrame(updatePlayerPosition);
}

document.addEventListener('keydown', (e) => {
    if (!isGameActive) return;  

    if (e.key === 'ArrowLeft') {
        leftKeyPressed = true;
    } else if (e.key === 'ArrowRight') {
        rightKeyPressed = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (!isGameActive) return;

    if (e.key === 'ArrowLeft') {
        leftKeyPressed = false;
    } else if (e.key === 'ArrowRight') {
        rightKeyPressed = false;
    }
});

function createFallingObject() {
    if (!isGameActive) return;  

    const fallingObject = document.createElement('div');
    fallingObject.classList.add('falling-object');
    fallingObject.style.left = Math.random() * 380 + 'px';
    game.appendChild(fallingObject);

    let fallingObjectY = 0;
    const objectSpeed = Math.random() * 2 + 2;

    const fallInterval = setInterval(() => {
        if (!isGameActive) {
            clearInterval(fallInterval);
            fallingObject.remove();  
            return;
        }

        fallingObjectY += objectSpeed;
        fallingObject.style.top = fallingObjectY + 'px';

        const playerRect = player.getBoundingClientRect();
        const objectRect = fallingObject.getBoundingClientRect();

        if (
            objectRect.bottom >= playerRect.top &&
            objectRect.top <= playerRect.bottom &&
            objectRect.left < playerRect.right &&
            objectRect.right > playerRect.left
        ) {
            gameOver();
            clearInterval(fallInterval);
        }

        if (fallingObjectY > 620) {
            fallingObject.remove();
            clearInterval(fallInterval);
            score++;
            scoreDisplay.textContent = score;
        }
    }, 20);
}

function startGame() {
    score = 0;
    scoreDisplay.textContent = score;
    startButton.style.display = 'none';
    game.style.display = 'block';

    isGameActive = true;  

    gameInterval = setInterval(createFallingObject, 1000);

    objectInterval = setInterval(() => {
        clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            createFallingObject();
        }, Math.max(200, 1000 - score * 10));
    }, 5000);

    updatePlayerPosition();
}

function gameOver() {
    isGameActive = false;  

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        highScoreDisplay.textContent = highScore;
    }

    clearInterval(gameInterval);
    clearInterval(objectInterval);
    document.querySelectorAll('.falling-object').forEach((obj) => obj.remove());

    gameOverMessage.innerHTML = `Game Over! Your Score: ${score}. <button id="restart-btn">Play Again</button>`;
    gameOverMessage.style.position = 'absolute';
    gameOverMessage.style.top = '50%';
    gameOverMessage.style.left = '50%';
    gameOverMessage.style.transform = 'translate(-50%, -50%)';
    gameOverMessage.style.padding = '20px';
    gameOverMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    gameOverMessage.style.color = 'white';
    gameOverMessage.style.borderRadius = '10px';
    game.appendChild(gameOverMessage);

    setTimeout(() => {
        const restartButton = document.getElementById('restart-btn');
        restartButton.addEventListener('click', restartGame);
    }, 0);
}

function restartGame() {
    gameOverMessage.remove();
    startGame();
}

startButton.addEventListener('click', startGame);
