const ENEMY_OPTIONS = [
	{ name: 'Lv1', color: 'pink', radius: 20, speed: 2 },
	{ name: 'Lv2', color: 'lightgreen', radius: 25, speed: 1.6 },
	{ name: 'Lv3', color: 'orange', radius: 35, speed: 1.2 },
];
const PLAYER_OPTIONS_LTH = PLAYER_OPTIONS.length;
const ENEMY_OPTIONS_LTH = ENEMY_OPTIONS.length;

const playerPanel = document.querySelector('.player-container');
const resultPanel = document.querySelector('.result');

const playerItems = document.querySelectorAll('.player-item');
const startBtn = document.querySelector('.start-game');
const restartBtn = document.querySelector('.restart');

const scoreEle = document.querySelectorAll('.score-cnt');
const cursor = document.querySelector('.cursor');
const canvas = document.querySelector('#app');
const ctx = canvas.getContext('2d');

const middle = { x: innerWidth / 2, y: innerHeight / 2 };
const PROJECTILE_CD = 5;
const friction = 0.98;

const projectiles = [];
const gameControl = {};
const particles = [];
const enemies = [];

const playerPos = {
	x: middle.x,
	y: middle.y,
};

let numProjectile = 0;
let gameStart = 0;
let score = 0;
let PlayerId = 0;
let PlayerSelect;
let player;

canvas.width = innerWidth;
canvas.height = innerHeight;

// <--=== Object
class Player {
	constructor(x, y, radius, color) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
	}

	draw() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.closePath();
	}

	update() {
		this.draw();
		this.x = playerPos.x;
		this.y = playerPos.y;
	}
}

class Particle {
	constructor(x, y, radius, color, velocity) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
		this.velocity = velocity;
		this.alpha = 1;
	}

	draw() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.closePath();
	}

	update() {
		this.draw();
		this.velocity.x *= friction;
		this.velocity.y *= friction;
		this.x += this.velocity.x;
		this.y += this.velocity.y;
		this.alpha -= 0.01;
	}
}

class Projectile {
	constructor(x, y, radius, color, velocity) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
		this.velocity = velocity;
	}

	draw() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.closePath();
	}

	update() {
		this.draw();
		this.x += this.velocity.x;
		this.y += this.velocity.y;
	}
}

class Enemy {
	constructor(x, y, radius, color, velocity, speed) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
		this.velocity = velocity;
		this.speed = speed;
	}

	draw() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.closePath();
	}

	update() {
		this.draw();
		const angle = Math.atan2(player.y - this.y, player.x - this.x);
		this.velocity.x = Math.cos(angle) * this.speed;
		this.velocity.y = Math.sin(angle) * this.speed;
		this.x += this.velocity.x;
		this.y += this.velocity.y;
	}
}
// Object ===-->

const cursorRender = (x, y) =>
	(cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`);

const keyHandle = () => {
	if (!gameControl) return;

	const delta = PlayerSelect.speedRun + PlayerSelect.boostSpeedRun;
	if (gameControl['a']) playerPos.x -= delta;
	if (gameControl['d']) playerPos.x += delta;
	if (gameControl['s']) playerPos.y += delta;
	if (gameControl['w']) playerPos.y -= delta;
};

const increaseScore = (amount) => {
	score += amount;
	scoreEle.forEach((item) => (item.innerHTML = score));
};

let spawnEnemiesID;
const spawnEnemies = () =>
	(spawnEnemiesID = setInterval(() => {
		const enemyIndex = Math.floor(Math.random() * ENEMY_OPTIONS_LTH);
		const enemyInfo = ENEMY_OPTIONS[enemyIndex];
		const { radius, color, speed } = enemyInfo;

		let x = 0;
		let y = 0;
		if (Math.random() < 0.5) {
			x = Math.random() < 0.5 ? 0 - radius : innerWidth + radius;
			y = Math.floor(Math.random() * innerHeight);
		} else {
			x = Math.floor(Math.random() * innerWidth);
			y = Math.random() < 0.5 ? 0 - radius : innerHeight + radius;
		}

		const angle = Math.atan2(player.y - y, player.x - x);
		const velocity = {
			x: Math.cos(angle) * speed,
			y: Math.sin(angle) * speed,
		};
		enemies.push(new Enemy(x, y, radius, color, velocity, speed));
	}, 3000));

const removeFromEdge = (list, index) => {
	const item = list[index];
	if (
		item.x + item.radius < 0 ||
		item.x - item.radius > innerWidth ||
		item.y + item.radius < 0 ||
		item.y - item.radius > innerHeight
	)
		list.splice(index, 1);
};

let animationID;
const animation = () => {
	animationID = requestAnimationFrame(animation);
	ctx.fillStyle = `rgba(0, 0, 0, 0.12)`;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	keyHandle();
	player.update();

	particles.forEach((item, index) => {
		if (item.alpha <= 0) particles.splice(index, 1);
		else item.update();
	});

	projectiles.forEach((item, index) => {
		item.update();
		removeFromEdge(projectiles, index);
	});

	enemies.forEach((enemy, index) => {
		enemy.update();
		removeFromEdge(enemies, index, enemy.x, enemy.y);

		const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);

		// End Game
		if (dist - enemy.radius - player.radius < 1) {
			cancelAnimationFrame(animationID);
			clearInterval(spawnEnemiesID);
			resultPanel.style.display = 'flex';
		}

		projectiles.forEach((pjtile, pjIndex) => {
			const dist = Math.hypot(pjtile.x - enemy.x, pjtile.y - enemy.y);
			if (dist - enemy.radius - pjtile.radius < 1) {
				for (let i = 0; i < 8; i++) {
					particles.push(
						new Particle(pjtile.x, pjtile.y, 3, enemy.color, {
							x: (Math.random() - 0.5) * (Math.random() * 6),
							y: (Math.random() - 0.5) * (Math.random() * 6),
						})
					);
				}

				enemy.speed *= 2;
				if (enemy.radius > 15) {
					increaseScore(10);
					gsap.to(enemy, {
						radius: enemy.radius - 10,
					});
					projectiles.splice(pjIndex, 1);
				} else {
					increaseScore(30);
					enemies.splice(index, 1);
					projectiles.splice(pjIndex, 1);
				}
			}
		});
	});
};

const runApp = () => {
	score = 0;
	scoreEle.forEach((item) => (item.innerHTML = score));

	PlayerId = playerPanel.querySelector('input:checked')?.dataset.index || 0;
	PlayerSelect = new PLAYER_OPTIONS[PlayerId].constructure(
		PLAYER_OPTIONS[PlayerId].prop
	);
	playerPos.x = middle.x;
	playerPos.y = middle.y;
	player = new Player(
		playerPos.x,
		playerPos.y,
		PlayerSelect.radius,
		PlayerSelect.color
	);

	projectiles.length = 0;
	gameControl.length = 0;
	particles.length = 0;
	enemies.length = 0;
	numProjectile = 0;

	resultPanel.style.display = 'none';
	playerPanel.style.display = 'none';

	animation();
	spawnEnemies();
};

// <--=== Event Handle
onmousemove = (e) => {
	const { clientX, clientY } = e;
	// cursorRender(clientX, clientY);
};
onclick = (e) => {
	PlayerSelect.boostSpeedRun = 0;
	const { clientX, clientY } = e;
	const angle = Math.atan2(clientY - player.y, clientX - player.x);
	PlayerSelect.speedShot = gameControl[' '] ? PlayerSelect.boostSpeedShot : 0;
	if (numProjectile >= 1) return;
	++numProjectile;
	projectiles.push(
		new Projectile(player.x, player.y, 5, 'white', {
			x: Math.cos(angle) * (5 + PlayerSelect.speedShot),
			y: Math.sin(angle) * (5 + PlayerSelect.speedShot),
		})
	);
	setTimeout(() => (numProjectile = 0), PlayerSelect.shootCD);
};
oncontextmenu = (e) => {
	e.preventDefault();
	PlayerSelect.boostSpeedRun += 1;
};
onkeydown = (e) => (gameControl[e.key] = true);
onkeyup = (e) => (gameControl[e.key] = false);
onresize = () => {
	ctx.save();
	canvas.width = innerWidth;
	canvas.height = innerHeight;
	ctx.restore();
};

resultPanel.onclick = (e) => e.stopPropagation();
playerPanel.onclick = (e) => e.stopPropagation();
startBtn.onclick = (e) => {
	e.stopPropagation();
	runApp();
};
restartBtn.onclick = (e) => {
	e.stopPropagation();
	playerPanel.style.display = 'flex';
	resultPanel.style.display = 'none';
};

playerItems.forEach((item) => {
	item.onclick = () => {
		const input = item.querySelector('input');
		input.checked = 1;
	};
});
// Event Handle ===-->
