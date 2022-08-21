const openRules = document.getElementById("open-btn");
const closeRules = document.getElementById("close-btn");
const canvas = document.getElementById("canvas");
const modalBox = document.querySelector(".rules");
const start = document.querySelector(".start-game");
const startContainer = document.querySelector(".start-container");
const ctx = canvas.getContext("2d");

openRules.addEventListener("click", openModal);
closeRules.addEventListener("click", closeModal);
start.addEventListener("click", startGame);
document.addEventListener("keyup", KeyUp);
document.addEventListener("keydown", KeyDown);

let score = 0;
const brickRowCount = 9;
const brickColCount = 5;

//Creating the ball on the canvas
const ball = {
	x: canvas.width / 2,
	y: canvas.height / 2 + 10,
	size: 7,
	speed: 2,
	dx: 4,
	dy: -4,
};

//Creating the Paddle
const paddle = {
	x: canvas.width / 2 - 40,
	y: canvas.height - 20,
	w: 75,
	h: 8,
	speed: 10,
	dx: 0,
};

//Creating the bricks data
const bricksData = {
	w: 63,
	h: 13,
	padding: 12,
	offsetX: 40,
	offsetY: 45,
	visible: true,
};

//Creating the bricks
const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
	bricks[i] = [];
	for (let k = 0; k < brickColCount; k++) {
		const x = i * (bricksData.w + bricksData.padding) + bricksData.offsetX;
		const y = k * (bricksData.h + bricksData.padding) + bricksData.offsetY;
		bricks[i][k] = {x, y, ...bricksData};
	}
}

//Drawing the balls
function drawBall() {
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2, true);
	ctx.fillStyle = "#A47EDD";
	ctx.fill();
	ctx.closePath();
}

//Drawing the paddle
function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
	ctx.fillStyle = "#A47EDD";
	ctx.fill();
	ctx.closePath();
}

//Drawing the Score
function drawScore() {
	ctx.font = "1.4rem sans-serif";
	ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

//Drawing the bricks
function drawBricks() {
	bricks.forEach((column) => {
		column.forEach((brick) => {
			ctx.beginPath();
			ctx.rect(brick.x, brick.y, brick.w, brick.h);
			ctx.fillStyle = brick.visible ? "#A47EDD" : "transparent";
			ctx.fill();
			ctx.closePath();
		});
	});
}

//Moving the Paddle on the x-axis
function movePaddle() {
	paddle.x += paddle.dx;

	//Wall detection in the canvas
	if (paddle.x + paddle.w > canvas.width) {
		paddle.x = canvas.width - paddle.w;
	}
	if (paddle.x < 0) {
		paddle.x = 0;
	}
}

//Moving the ball inside the canvas
function moveBall() {
	ball.x += ball.dx;
	ball.y += ball.dy;

	//Wall detection in the canvas
	if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
		ball.dx *= -1;
	}

	if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
		ball.dy *= -1;
	}

	if (
		ball.x - ball.size > paddle.x &&
		ball.x + ball.size < paddle.x + paddle.w &&
		ball.y + ball.size > paddle.y
	) {
		ball.dy = -ball.speed;
	}

	//Hitting the balls on the bricks to smash it
	bricks.forEach((column) => {
		column.forEach((brick) => {
			if (brick.visible) {
				if (
					ball.x - ball.size > brick.x &&
					ball.x + ball.size < brick.x + brick.w &&
					ball.y + ball.size > brick.y &&
					ball.y - ball.size < brick.y + brick.h
				) {
					ball.dy *= -1;
					brick.visible = false;

					increaseScore();
				}
			}
		});
	});

	//Hitting the score on ground to lose
	if (ball.y + ball.size > canvas.height) {
		displayAllBricks();
		score = 0;
	}
}

function increaseScore() {
	score++;

	if (score % (brickRowCount * brickRowCount) === 0) {
		displayAllBricks();
	}
}

function displayAllBricks() {
	bricks.forEach((column) => {
		column.forEach((brick) => (brick.visible = true));
	});
}

function openModal(e) {
	modalBox.classList.toggle("display");
}

function closeModal(e) {
	modalBox.classList.toggle("display");
}

function startGame(e) {
	startContainer.style.display = "none";

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	drawBall();
	drawPaddle();
	drawScore();
	drawBricks();
	movePaddle();
	moveBall();
	requestAnimationFrame(startGame);
}

function KeyUp(e) {
	if (
		e.key === "Right" ||
		e.key === "ArrowRight" ||
		e.key === "Left" ||
		e.key === "ArrowLeft"
	) {
		paddle.dx = 0;
	}
}

function KeyDown(e) {
	if (e.key === "Right" || e.key === "ArrowRight") {
		paddle.dx = paddle.speed;
	} else if (e.key === "Left" || e.key === "ArrowLeft") {
		paddle.dx = -paddle.speed;
	}
}
