let intern = document.getElementById("intern");
let gameContainer = document.getElementById("game-container");
let ground = document.getElementById("ground");
let scoreDisplay = document.getElementById("score");
let message = document.getElementById("message");
let retryBtn = document.getElementById("retry-btn");
let finishLine = document.getElementById("finish-line");

let isJumping = false;
let isGameOver = false;
let score = 0;
let speed = 5;
let gravity = 0.9;
let jumpHeight = 150;
let obstacles = [];
let interval;
let totalTPBoxes = 15;

document.addEventListener("keydown", function(event) {
    if (event.code === "Space" && !isJumping && !isGameOver) {
        jump();
    }
});

gameContainer.addEventListener("click", function() {
    if (!isJumping && !isGameOver) {
        jump();
    }
});

function jump() {
    isJumping = true;
    let position = 0;

    let upInterval = setInterval(() => {
        if (position >= jumpHeight) {
            clearInterval(upInterval);

            let downInterval = setInterval(() => {
                if (position <= 0) {
                    clearInterval(downInterval);
                    isJumping = false;
                } else {
                    position -= 5;
                    intern.style.bottom = (0 + position) + "px";
                }
            }, 20);
        } else {
            position += 5;
            intern.style.bottom = (0 + position) + "px";
        }
    }, 20);
}

function createObstacle() {
    if (score >= totalTPBoxes) {
        createFinishLine();
        return;
    }
    let obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");
    obstacle.innerText = "TP";
    obstacle.style.left = gameContainer.offsetWidth + "px";
    gameContainer.appendChild(obstacle);
    obstacles.push(obstacle);
}

function createFinishLine() {
    finishLine.style.display = "block";
}

function moveObstacles() {
    let moveInterval = setInterval(() => {
        if (isGameOver) {
            clearInterval(moveInterval);
            return;
        }
        obstacles.forEach((obstacle, index) => {
            obstacle.style.left = (obstacle.offsetLeft - speed) + "px";

            if (obstacle.offsetLeft <= 0) {
                gameContainer.removeChild(obstacle);
                obstacles.splice(index, 1);
                score++;
                scoreDisplay.innerText = "Score: " + score;

                if (score >= totalTPBoxes) {
                    finishLine.style.display = "block";
                    finishLine.style.right = gameContainer.offsetLeft + gameContainer.offsetWidth + "px";
                    if (intern.offsetLeft + intern.offsetWidth > finishLine.offsetLeft) {
                        endGame("Congrats! You are eligible for your next internship!");
                    }
                }
            }

            if (
                obstacle.offsetLeft < intern.offsetLeft + intern.offsetWidth &&
                obstacle.offsetLeft + obstacle.offsetWidth > intern.offsetLeft &&
                intern.offsetTop + intern.offsetHeight > obstacle.offsetTop
            ) {
                endGame("Mission Failed. Try Again.");
            }
        });
    }, 20);
}

function endGame(messageText) {
    isGameOver = true;
    clearInterval(interval);
    message.innerText = messageText;
    message.style.display = "block";
    retryBtn.style.display = "block";
}

function retryGame() {
    isGameOver = false;
    score = 0;
    speed = 5;
    scoreDisplay.innerText = "Score: 0";
    message.style.display = "none";
    retryBtn.style.display = "none";
    finishLine.style.display = "none";
    obstacles.forEach(obstacle => gameContainer.removeChild(obstacle));
    obstacles = [];
    startGame();
}

function startGame() {
    document.getElementById("cover-page").style.display = "none";
    gameContainer.style.display = "block";
    createObstacle();
    interval = setInterval(createObstacle, 2000);
    moveObstacles();
}

document.getElementById("retry-btn").onclick = retryGame;
