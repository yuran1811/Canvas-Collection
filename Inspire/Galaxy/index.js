const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

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
const numParticles = 1500;
const particles = [];

let mouseDown = false;
let speed = 0.0005;
let radians = 0;
let opacity = 1;
let alpha = 1;

// Objects
class Particle {
	constructor(x, y, radius, color) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
	}

	draw() {
		c.save();
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		c.shadowColor = this.color;
		c.shadowBlur = 15;
		c.fillStyle = this.color;
		c.fill();
		c.closePath();
		c.restore();
	}

	update() {
		this.draw();
	}
}

const init = () => {
	const newWidth = canvas.width + 500;
	const newHeight = canvas.height + 1000;
	
	for (let i = 0; i < numParticles; i++) {
		const x = Math.random() * newWidth - newWidth / 2;
		const y = Math.random() * newHeight - newHeight / 2;
		const radius = 2 * Math.random();
		const color = colors[Math.floor(Math.random() * colorsLth)];

		particles.push(new Particle(x, y, radius, color));
	}
};

const animate = () => {
	requestAnimationFrame(animate);

	const updateAnimation = (reqOpacity, reqOpacityMulti, reqSpeed) => {
		opacity += (reqOpacity - opacity) * reqOpacityMulti;
		opacity = Math.max(opacity, 0.04);
		c.fillStyle = `rgba(0, 0, 0, ${opacity})`;

		// if (speed < 0.01)
		speed += (reqSpeed - speed) * 0.01;
		radians += speed;
	};

	c.save();
	if (mouseDown) updateAnimation(0.01, 0.05, 0.02);
	else updateAnimation(1, 0.01, 0.001);

	c.fillRect(0, 0, canvas.width, canvas.height);
	c.translate(canvas.width / 2, canvas.height / 2);
	c.rotate(radians);
	particles.forEach((particle) => particle.update());
	c.restore();
};

init();
animate();

// Event Handle
onkeydown = (e) => (mouseDown = e.key === ' ');
onkeyup = () => (mouseDown = false);
onmousedown = () => (mouseDown = true);
onmouseup = () => (mouseDown = false);
onresize = () => {
	canvas.width = innerWidth;
	canvas.height = innerHeight;
	c.restore();
};
