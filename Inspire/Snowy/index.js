const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

const MAX_SNOW_BALL = 400;
const MAX_SNOW_BALL_RADIUS = 5;
const MAX_ACCELERATION = 3;
const MAX_ACCELERATION_INC = 1;

const DELAY_DEC = 0.05;
const ACCELERATION_DEC = 0.5;

const snowBalls = [];
const mouse = { x: undefined, y: undefined };

let numSnowBall = 100;
let screenAngle = 0;

class SnowBall {
	constructor({ x, y, velocity, radius, color, delay }) {
		this.x = x;
		this.y = y;
		this.velocity = velocity;
		this.radius = radius;
		this.color = color;
		this.delay = delay;

		this.acceleration = { x: 0, y: 0 };
		this.density = Math.random() + 0.5;
	}

	draw() {
		c.beginPath();
		c.fillStyle = this.color;
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		c.fill();
		c.closePath();
	}

	inView() {
		const inViewWidth =
			this.x + this.radius <= innerWidth && this.x - this.radius >= 0;
		const inViewHeight =
			this.y + this.radius <= innerHeight && this.y - this.radius >= 0;

		return inViewWidth && inViewHeight;
	}

	isFallen() {
		return this.y - this.radius >= innerHeight;
	}

	updatePosition(key) {
		this[key] += this.velocity[key] + this.acceleration[key];

		key === 'y' && (this[key] += Math.pow(this.density, 2));
	}

	increaseAcceleration(key, value) {
		if (value >= MAX_ACCELERATION_INC) value = MAX_ACCELERATION_INC;
		else if (value <= -MAX_ACCELERATION_INC) value = -MAX_ACCELERATION_INC;

		if (
			this.acceleration[key] + value <= MAX_ACCELERATION ||
			this.acceleration[key] + value >= -MAX_ACCELERATION
		)
			this.acceleration[key] += value;
		else {
			if (this.acceleration[key] + value > MAX_ACCELERATION)
				this.acceleration[key] = MAX_ACCELERATION;
			else if (this.acceleration[key] + value < -MAX_ACCELERATION)
				this.acceleration[key] = -MAX_ACCELERATION;
		}
	}

	decreaseAcceleration(key) {
		if (this.acceleration[key] < 0) {
			this.acceleration[key] += ACCELERATION_DEC;

			if (this.acceleration[key] > 0) {
				this.acceleration[key] = 0;
			}
		} else if (this.acceleration[key] > 0) {
			this.acceleration[key] -= ACCELERATION_DEC;

			if (this.acceleration[key] < 0) {
				this.acceleration[key] = 0;
			}
		}
	}

	update() {
		if (this.delay > 0) {
			this.delay -= DELAY_DEC;
			return;
		}

		this.draw();

		this.updatePosition('x');
		this.updatePosition('y');

		this.decreaseAcceleration('x');
		this.decreaseAcceleration('y');
	}
}

const getNewSnowBall = (color = 'white') => {
	const x = Math.random() * innerWidth;
	const y = 0; // Math.random() * innerHeight;
	const velocity = {
		x: 0,
		y: Math.random() + 0.5,
	};
	const radius =
		Math.random() * MAX_SNOW_BALL_RADIUS + MAX_SNOW_BALL_RADIUS / 2;
	const delay = Math.random() * 10;

	return { x, y, velocity, radius, color, delay };
};

const init = () => {
	canvas.width = innerWidth;
	canvas.height = innerHeight;

	for (let i = 0; i < numSnowBall; i++)
		snowBalls.push(new SnowBall(getNewSnowBall()));
};

const animation = () => {
	requestAnimationFrame(animation);

	c.fillStyle = `rgba(0, 0, 40, 0.4)`;
	c.fillRect(0, 0, innerWidth, innerHeight);

	snowBalls.forEach((_, idx) => {
		_.update();

		if (_.isFallen()) {
			snowBalls.splice(idx, 1, new SnowBall(getNewSnowBall()));
			return;
		}
	});
};

init();
animation();

onmousedown = ({ clientX, clientY }) => {
	mouse.x = clientX;
	mouse.y = clientY;
};
onmousemove = ({ clientX, clientY }) => {
	if (!mouse.x || !mouse.y) return;

	const angle = Math.atan2(clientY - mouse.y, clientX - mouse.x);
	const move = {
		x: Math.cos(angle),
		y: Math.sin(angle) / 4,
	};

	snowBalls.forEach((_) => {
		if (!_.inView()) return;

		_.increaseAcceleration('x', move.x);
		_.increaseAcceleration('y', Math.abs(move.x) / 4 + move.y);
	});
};
onmouseup = () => {
	mouse.x = undefined;
	mouse.y = undefined;
};

oncontextmenu = (e) => {
	e.preventDefault();

	if (numSnowBall > MAX_SNOW_BALL) return;

	numSnowBall++;
	snowBalls.push(new SnowBall(getNewSnowBall()));
};

onresize = () => {
	c.save();
	canvas.width = innerWidth;
	canvas.height = innerHeight;
	c.restore();
};
