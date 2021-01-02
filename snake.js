window.addEventListener('load', () => {
	const c = document.getElementById("canvas");
	const ctx = c.getContext("2d");
	const size = 15
	const rows = Math.floor(c.width / size)
	const cols = Math.floor(c.height / size)

	let dx;
	let dy;
	let isStarted;
	let snake;
	let food;
	let speed;

	drawRect = (x, y, s = size) => {
		ctx.beginPath();
		ctx.fillRect(x * s, y * s, s - 1, s - 1);
		return { x, y }
	}

	clearRect = (x, y, s = size) => {
		ctx.clearRect(x * s, y * s, s - 1, s - 1)
	}

	drawSnake = (positions, nextPositions) => {
		ctx.fillStyle = 'blue';
		return nextPositions.map((pos, idx) => {
			clearRect(positions[idx].x, positions[idx].y)
			return drawRect(pos.x, pos.y)
		})
	}

	generateRandom = (excluded, xmax, ymax) => {
		x = Math.floor(Math.random() * Math.floor(xmax));
		y = Math.floor(Math.random() * Math.floor(ymax));
		if (excluded.some(s => s.x == x && s.y == y)) {
			generateRandom(excluded, xmax, ymax);
		}
		return { x, y }
	}

	drawFood = () => {
		ctx.fillStyle = 'green';
		randoms = generateRandom(snake, rows - 1, cols - 1)
		food.push(drawRect(randoms.x, randoms.y));
	}

	calculateNextPosition = (pos, idx, arr) => {
			let x, y;
			if (idx === 0) {
				if (pos.x === rows - 1 && dx === 1) {
					x = 0;
					y = pos.y + dy;
				}
				else if (pos.x === 0 && dx === -1) {
					x = rows - 1;
					y = pos.y + dy;
				}
				else if (pos.y === cols - 1 && dy === 1) {
					x = pos.x + dx;
					y = 0;
				}
				else if (pos.y === 0 && dy === -1) {
					x = pos.x + dx;
					y = cols - 1;
				}
				else {
					x = pos.x + dx;
					y = pos.y + dy;
				}
			}
			else {
				let nextPos = arr[idx - 1];
				x = nextPos.x;
				y = nextPos.y;
			}
			return { x, y }
	}

	handleIntersectionWithFood = () => {
		food.forEach(f => {
			if (f.x === snake[0].x && f.y === snake[0].y) {
				food = food.filter(ff => ff.x !== f.x && ff.y !== f.y)
				let tail = snake[snake.length - 1]
				snake.push(drawRect(tail.x - dx, tail.y - dy))
				speed = speed * 0.99
			}
		})
	}

	handleIntersection = () => {
		for (let idx = 1; idx < snake.length; idx++) {
			if (snake[0].x === snake[idx].x && snake[0].y === snake[idx].y) {
				isStarted = false
				clearInterval(foodInterval);
			}
		}
	}

	loop = () => {
		if (isStarted) {
			snake = drawSnake(snake, snake.map(calculateNextPosition))
			handleIntersectionWithFood()
			handleIntersection()
		}
		setTimeout(loop, speed);
	}
	loop();

	init = () => {
		dx = 1;
		dy = 0;
		isStarted = true
		snake = [drawRect(28, 10), drawRect(27, 10), drawRect(26, 10)]
		food = []
		speed = 100;
		drawFood();

		foodInterval = setInterval(() => {
			drawFood();
		}, 3000)
	}
	init();

	document.addEventListener("keydown", event => {
		switch (event.keyCode) {
			case 65:
			case 37:
			case 72:
				dx = -1;
				dy = 0;
				break;
			case 83:
			case 40:
			case 74:
				dy = 1;
				dx = 0;
				break;
			case 87:
			case 38:
			case 75:
				dy = -1;
				dx = 0;
				break;
			case 68:
			case 39:
			case 76:
				dx = 1;
				dy = 0;
				break;
			default:
				break;
		}
	});

	document.getElementById("restart").addEventListener("click", () => {
		clearInterval(foodInterval);
		ctx.clearRect(0, 0, c.width, c.height)
		init();
	})
})
