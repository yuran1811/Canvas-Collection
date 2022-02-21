const canvas = document.querySelector('#app');
const c = canvas.getContext('2d');

canvas.height = innerHeight;
canvas.width = innerWidth;

class Particle {
	constructor(x, y, radius) {
		const idx = Math.floor(Math.random() * 4);
		const direct = Math.floor(Math.random() * 2);

		this.x = x;
		this.y = y;
		this.radius = radius;
		this.originalRadius = radius;
		this.color = colorArray[idx];
		this.velocity = {
			x: Math.random() * (direct ? 1 : -1),
			y: Math.random() * (direct ? 1 : -1),
		};
	}

	draw() {
		c.beginPath();
		c.arc(this.x, this.y, Math.abs(this.radius), 0, Math.PI * 2, false);
		c.fillStyle = this.color;
		c.fill();
		c.closePath();
	}

	update() {
		this.x += this.velocity.x;
		const xDistance = mouse.x - this.x;
		const yDistance = mouse.y - this.y;
		const originalRadius = this.originalRadius;
		this.y += this.velocity.y;

		if (this.x + this.radius > canvas.width || this.x - this.radius < 0)
			this.velocity.x *= -1;

		if (this.y + this.radius > canvas.height || this.y - this.radius < 0)
			this.velocity.y *= -1;

		if (
			xDistance < 50 &&
			xDistance > -50 &&
			this.radius < maxRadius &&
			yDistance < 50 &&
			yDistance > -50
		) {
			this.radius += 2;
		} else if (
			(xDistance >= 50 && originalRadius < this.radius) ||
			(xDistance <= -50 && originalRadius < this.radius) ||
			(yDistance >= 50 && originalRadius < this.radius) ||
			(yDistance <= -50 && originalRadius < this.radius)
		) {
			this.radius -= 2;
		}

		this.draw();
	}
}

const colorArray = ['#272F32', '#9DBDC6', '#FF3D2E', '#DAEAEF'];
const myCircle = new Particle(30, 80, 10);
const particles = [];
const maxRadius = 35;
const mouse = {
	x: undefined,
	y: undefined,
};

window.onmousemove = (e) => {
	mouse.x = e.clientX;
	mouse.y = e.clientY;
};

window.onresize = () => {
	c.save();
	canvas.width = innerWidth;
	canvas.height = innerHeight;
	c.restore();
};

const init = () => {
	for (let i = 0; i < 800; i++) {
		const x = Math.random() * innerWidth;
		const y = Math.random() * innerHeight;
		const radius = Math.random() * 5;
		particles.push(new Particle(x, y, radius));
	}
};

const animation = () => {
	requestAnimationFrame(animation);
	c.fillStyle = `rgba(255, 255, 255, 0.4)`;
	c.fillRect(0, 0, innerWidth, innerHeight);
	myCircle.update();
	particles.forEach((item) => item.update());
};

init();
animation();
