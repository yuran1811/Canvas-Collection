const canvas = document.querySelector('#app');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const mouse = {
	x: innerWidth / 2,
	y: innerHeight / 2,
};
const colors = [
	'#2185C5',
	'#7ECEFD',
	'#FFF6E5',
	'#FF7F66',
	'#0952BD',
	'#A5BFF0',
	'#118CD6',
	'#1AAEE8',
	'#F2E8C9',
];
const colorsLth = colors.length;
const numParticles = 400;
const onePiece = (Math.PI * 2) / numParticles;

const gravity = 0.03;
const friction = 0.99;

// Objects
class Particle {
	constructor(x, y, radius, color, velocity) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
		this.time = 1;
		this.velocity = velocity;
	}

	draw() {
		c.save();
		c.globalAlpha = this.time;
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		c.fillStyle = this.color;
		c.fill();
		c.closePath();
		c.restore();
	}

	update() {
		this.draw();
		this.velocity.x *= friction;
		this.velocity.y *= friction;
		this.velocity.y += gravity;
		this.x += this.velocity.x;
		this.y += this.velocity.y;
		this.time -= 0.005;
	}
}

let particles = [];

const animate = () => {
	requestAnimationFrame(animate);

	c.fillStyle = `rgba(0, 0, 0, 0.05)`;
	c.fillRect(0, 0, canvas.width, canvas.height);

	particles.forEach((particle, index) => {
		if (particle.time > 0) particle.update();
		else particles.splice(index, 1);
	});
};
animate();

// Event Handle
window.onclick = (e) => {
	mouse.x = e.clientX;
	mouse.y = e.clientY;

	for (let i = 0; i < numParticles; i++) {
		const { x, y } = mouse;
		const color = colors[Math.floor(Math.random() * colorsLth)];
		const radius = 5;

		const velocity = {
			x: Math.cos(onePiece * i) * Math.random() * 10,
			y: Math.sin(onePiece * i) * Math.random() * 10,
		};

		particles.push(new Particle(x, y, radius, color, velocity));
	}
};
window.onresize = () => {
	canvas.width = innerWidth;
	canvas.height = innerHeight;
	c.restore();
};
