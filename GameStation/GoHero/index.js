const SPACE = 300;
const NUM_BLOCK = 15;
const MARGIN = 400;
const PLATFORM_WIDTH = 200;
const GRAVITY = 1.5;

const canvas = document.querySelector('#app');
const c = canvas.getContext('2d');

const winContainer = document.querySelector('.win-container');
const loseContainer = document.querySelector('.lose-container');
const restartBtns = document.querySelectorAll('button.restart');

const app = {
	genericObjects: [],
	platforms: [],
	keys: undefined,
	player: undefined,
	scrollOffset: 0,
	animationID: undefined,
	winCondition: undefined,

	tools: {
		randRange: ({ x, y }) => {
			const newX = Math.random() * PLATFORM_WIDTH + PLATFORM_WIDTH + x;
			const newY = Math.random() * (innerHeight - y) + y / 2;
			return { x: newX, y: newY };
		},
	},

	initValue() {
		canvas.width = innerWidth;
		canvas.height = innerHeight;

		this.player = new Player(300, 200);
		this.keys = {
			a: { press: 0, count: 0, maxCount: -1 },
			d: { press: 0, count: 0, maxCount: -1 },
			w: { press: 0, count: 0, maxCount: 1 },
			s: { press: 0, count: 0, maxCount: -1 },
		};
		this.scrollOffset = 0;
		this.genericObjects.length = 0;
		this.platforms.length = 0;
		this.platforms.push(new Platform({ x: 200, y: 350 }));
	},

	checkWin() {
		return this.scrollOffset >= this.winCondition - PLATFORM_WIDTH / 2;
	},
	checkLose() {
		return this.player.position.y + this.player.height > innerHeight;
	},

	drawObjs() {
		c.fillStyle = `rgba(0, 0, 0, 0.3)`;
		c.fillRect(0, 0, innerWidth, innerHeight);

		this.genericObjects.forEach((_) => _.draw());
		this.platforms.forEach((_) => _.draw());
		this.player.update();
	},

	run() {
		init();
		animation();
	},
};

class Player {
	constructor(x = 300, y = 300) {
		this.speed = 10;
		this.width = 30;
		this.height = 30;
		this.position = { x, y };
		this.velocity = { x: 0, y: 0 };

		this.isJump = 0;
		this.jumpHeight = 18;
	}

	draw() {
		c.fillStyle = 'red';
		c.fillRect(this.position.x, this.position.y, this.width, this.height);
	}

	update() {
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		if (this.position.y + this.height + this.velocity.y <= innerHeight)
			this.velocity.y += GRAVITY;
		else this.velocity.y = 0;

		this.draw();
	}
}

class Platform {
	constructor({ x, y }) {
		this.width = PLATFORM_WIDTH;
		this.height = 20;
		this.position = { x, y };
	}

	draw() {
		c.fillStyle = 'lightblue';
		c.fillRect(this.position.x, this.position.y, this.width, this.height);
	}
}

class GenericObject {
	constructor({ x, y }) {
		this.width = 200;
		this.height = 20;
		this.position = { x, y };
	}

	draw() {
		const { x, y } = this.position;

		c.beginPath();
		c.fillStyle = 'lightgreen';
		c.arc(x, y, this.width / 2, 0, Math.PI * 2, false);
		c.fill();
		c.closePath();
	}
}

class Flag {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	draw() {
		c.beginPath();
		c.closePath();
	}
}

const init = () => {
	app.initValue();

	winContainer.classList.add('hide');
	loseContainer.classList.add('hide');

	let lastPlatform = { x: 200, y: 350 };
	let lastGenericObj = { x: 0, y: 0 };
	for (let i = 0; i < NUM_BLOCK; i++) {
		lastGenericObj = app.tools.randRange(lastGenericObj);
		lastPlatform = app.tools.randRange(lastPlatform);

		app.genericObjects.push(new GenericObject(lastGenericObj));
		app.platforms.push(new Platform(lastPlatform));

		app.winCondition = lastPlatform.x;
	}

	app.winCondition -= app.platforms[0].position.x;
};

const animation = () => {
	app.animationID = requestAnimationFrame(animation);
	app.drawObjs();

	const conditions = [
		app.player.position.x > 100,
		!app.scrollOffset && app.platforms.every((_) => _.position.x > 0),
	];

	if (app.keys['d'].press && app.player.position.x < innerWidth / 2 - 100)
		app.player.velocity.x = app.player.speed;
	else if (app.keys['a'].press && conditions.some((_) => _))
		app.player.velocity.x = -app.player.speed;
	else {
		app.player.velocity.x = 0;

		if (app.keys['d'].press) {
			app.scrollOffset += app.player.speed;
			app.platforms.forEach((_) => {
				_.position.x -= app.player.speed;
			});
			app.genericObjects.forEach((_) => {
				_.position.x -= app.player.speed * 0.66;
			});
		}

		if (app.keys['a'].press && app.scrollOffset > 0) {
			app.scrollOffset -= app.player.speed;
			app.platforms.forEach((_) => {
				_.position.x += app.player.speed;
			});
			app.genericObjects.forEach((_) => {
				_.position.x += app.player.speed * 0.66;
			});
		}
	}

	app.platforms.forEach((_) => {
		const isInRange = (v, l, r) => l <= v && v <= r;

		if (
			isInRange(
				app.player.position.y + app.player.height,
				_.position.y - app.player.velocity.y,
				_.position.y
			) &&
			isInRange(
				app.player.position.x,
				_.position.x - app.player.width,
				_.position.x + _.width
			)
		)
			app.player.velocity.y = 0;
	});

	if (app.checkWin()) {
		winContainer.classList.remove('hide');
		cancelAnimationFrame(app.animationID);
	}
	if (app.checkLose()) {
		loseContainer.classList.remove('hide');
		cancelAnimationFrame(app.animationID);
	}
};

app.run();

restartBtns.forEach((_) => (_.onclick = app.run));

oncontextmenu = (e) => e.preventDefault();
onkeydown = ({ key }) => {
	switch (key) {
		case 'a':
		case 'd':
			app.keys[key].press = 1;
			break;
		case 'w':
			// console.log(app.keys[key].count, app.player.position.y);
			app.player.isJump = 1;

			if (app.keys[key].count <= app.keys[key].maxCount) {
				if (app.player.position.y > app.player.height) {
					app.keys[key].count++;
					app.player.velocity.y -= app.player.jumpHeight;

					console.log('Jump');
				}
			} else {
				setTimeout(() => {
					app.keys[key].count = 0;
				}, 200);
			}
			break;
		case 's':
			app.player.velocity.y += 10;
			break;
		default:
			break;
	}
};
onkeyup = ({ key }) => {
	switch (key) {
		case 'a':
		case 'd':
			app.keys[key].press = 0;
			break;
		case 'w':
			if (app.player.isJump) app.keys[key].count = 0;

			break;
		case 's':
			break;
		default:
			break;
	}
};
onresize = () => {
	c.save();
	canvas.width = innerWidth;
	canvas.height = innerHeight;
	c.restore();
};
