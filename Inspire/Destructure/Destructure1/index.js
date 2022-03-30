const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const mouse = {
	x: innerWidth / 2,
	y: innerHeight / 2,
};

class Tree {
	constructor(x, y, color) {
		this.x = x;
		this.y = y;
		this.color = color;

		this.branch = {
			x: 200,
			y: 200,
			width: 1,
			length: 30,
			angle: Math.PI / 2,
		};
		this.lastMouse = {
			x: mouse.x,
			y: mouse.y,
		};

		this.loop = false;
		this.hue = 255;
	}

	init() {
		TweenLite.to(tree.branch, 1.5, {
			x: 0,
			y: 0,
			ease: Power4.easeInOut,
		});

		setTimeout(() => {
			tree.loop = true;
		}, 1900);
	}

	draw() {
		c.save();
		c.translate(this.x, this.y);
		this.drawBranch(this.branch.length);
		c.restore();
	}

	drawBranch(l) {
		const { width, angle, x, y } = this.branch;

		c.fillStyle = `hsl(${this.hue}, 76%, 81%)`;
		c.fillRect(x, y, width, -l);

		c.save();
		c.translate(0, -l);

		if (l > 1) {
			// Start at -80 degrees
			let newAngle = (-Math.PI * 4) / 9;

			for (let i = 0; i < 3; i++) {
				let newLth = l * 0.47;

				// Make the middle branch bigger
				if (i == 1) newLth = newLth + 0.3 * l;

				c.save();
				c.rotate(newAngle);
				this.drawBranch(newLth);
				c.restore();

				// Add 90 degrees for the next branch
				newAngle = newAngle + angle;
			}
		}
		c.restore();
	}

	update(ticker) {
		this.draw();

		if (this.loop) {
			this.branch.x += Math.cos(ticker);
			this.branch.y += Math.sin(ticker);
		}

		this.hue = Math.abs(255 * Math.sin(ticker * 0.5));

		this.lastMouse.x += (mouse.x - this.lastMouse.x) * 0.01;
		this.lastMouse.y += (mouse.y - this.lastMouse.y) * 0.01;
		this.x = this.lastMouse.x;
		this.y = this.lastMouse.y + 55;
	}
}

let ticker = 0;
const tree = new Tree(innerWidth / 2, innerHeight / 2 + 40, 'green');
tree.init();

onmousedown = () => {
	tree.loop = false;
	TweenLite.to(tree.branch, 1, {
		x: 0,
		y: 0,
		ease: Power4.easeInOut,
	});
};
onmouseup = () => {
	tree.loop = true;
};
onmousemove = (e) => {
	mouse.x = e.clientX;
	mouse.y = e.clientY;
};
onresize = () => {
	c.save();
	canvas.width = innerWidth;
	canvas.height = innerHeight;
	c.restore();
};

const animate = () => {
	requestAnimationFrame(animate);

	c.fillStyle = 'black';
	c.fillRect(0, 0, innerWidth, innerHeight);

	tree.update(ticker);
	ticker += 0.01;
};

animate();
