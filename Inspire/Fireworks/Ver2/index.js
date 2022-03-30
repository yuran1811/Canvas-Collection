const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const colors = ['#ffa400', '#3D6EF7', '#ff6bcb', '#e74c3c', '#20E3B2'];
const mouse = {
	x: innerWidth / 2,
	y: innerHeight / 2,
};
const numParticles = 30;
const particles = [];

onmousemove = (e) => {
	mouse.x = e.clientX;
	mouse.y = e.clientY;
};

class Particle {
	constructor(x, y, radius, color, velocity) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
		this.velocity = velocity;
		this.ttl = 200;
	}

	draw() {
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		c.fillStyle = this.color;
		c.fill();
		c.closePath();
	}

	update() {
		this.draw();
		this.x += this.velocity.x;
		this.y += this.velocity.y;
		this.ttl--;
	}
}

const getRandColor = (colors) =>
	colors[Math.floor(Math.random() * colors.length)];

const init = () => {
	for (let idx = 0; idx < numParticles; idx++) {
		const radians = (Math.PI * 2) / numParticles;
		const x = innerWidth / 2;
		const y = innerHeight / 2;
		const velocity = {
			x: Math.cos(radians * idx),
			y: Math.sin(radians * idx),
		};
		particles.push(new Particle(x, y, 5, getRandColor(colors), velocity));
	}
};

const generate = () => {
	setTimeout(generate, 200);
	for (let idx = 0; idx < numParticles; idx++) {
		const radians = (Math.PI * 2) / numParticles;
		const x = mouse.x;
		const y = mouse.y;
		const velocity = {
			x: Math.cos(radians * idx),
			y: Math.sin(radians * idx),
		};
		particles.push(new Particle(x, y, 5, getRandColor(colors), velocity));
	}
};

const animate = () => {
	requestAnimationFrame(animate);

	c.fillStyle = 'rgba(0, 0, 0, 0.05)';
	c.fillRect(0, 0, canvas.width, canvas.height);

	particles.forEach((item, index) => {
		item.ttl === 0 && particles.splice(index, 1);
		item.update();
	});
};

init();
animate();
generate();
