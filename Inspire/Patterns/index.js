const numVertexEle = document.querySelector('.tool-item.numVertex input');
const isRotateEle = document.querySelector('.tool-item.isRotate input');
const radiusEle = document.querySelector('.tool-item.radius input');
const lengthEle = document.querySelector('.tool-item.length input');
const canvas = document.querySelector('#app');
const c = canvas.getContext('2d');

canvas.height = innerHeight;
canvas.width = innerWidth;

const mouse = {
	x: innerWidth / 2,
	y: innerHeight / 2,
};

class Centroid {
	constructor(x, y, length, numVertex, color, radius) {
		this.x = x;
		this.y = y;
		this.length = length;
		this.numVertex = numVertex;
		this.color = color;
		this.radius = radius;

		this.vertexs = [];
		this.radian = 0;
	}

	draw() {
		const drawOne = (vertex) => {
			c.beginPath();
			c.arc(vertex.x, vertex.y, this.length * 2, 0, Math.PI * 2, false);
			c.strokeStyle = this.color;
			c.lineWidth = 1;
			c.stroke();
			c.closePath();
		};

		this.vertexs.length = 0;
		this.unitAngle = (Math.PI * 2) / this.numVertex;

		for (let i = 0; i < this.numVertex; i++) {
			const angle = this.unitAngle * i + this.radian;
			const pos = {
				x: this.x + Math.cos(angle) * this.radius,
				y: this.y + Math.sin(angle) * this.radius,
			};
			this.vertexs.push(pos);
		}
		this.vertexs.forEach((vertex) => drawOne(vertex));
	}

	rotate(isRotate) {
		if (!isRotate) {
			return;
		}

		const angle = Math.PI / 720;
		const { x, y } = this;

		this.radian += angle;

		const rotateOne = (vertex) => {
			const newX =
				x +
				(vertex.x - x) * Math.cos(angle) -
				(vertex.y - y) * Math.sin(angle);
			const newY =
				y +
				(vertex.x - x) * Math.sin(angle) +
				(vertex.y - y) * Math.cos(angle);

			vertex.x = newX;
			vertex.y = newY;
		};

		this.vertexs.forEach((vertex) => rotateOne(vertex));
	}
}

const centroid = new Centroid(mouse.x, mouse.y, 100, 6, 'white', 100);

const reset = () => {
	c.fillStyle = `rgba(0, 0, 0, 1)`;
	c.fillRect(0, 0, innerWidth, innerHeight);

	centroid.rotate(isRotateEle.checked);
	centroid.draw();
};
reset();

numVertexEle.oninput = function () {
	centroid.numVertex = +this.value.trim();
	reset();
};
lengthEle.oninput = function () {
	centroid.length = +this.value.trim();
	reset();
};
radiusEle.oninput = function () {
	centroid.radius = +this.value.trim();
	reset();
};

onresize = () => {
	c.save();
	canvas.width = innerWidth;
	canvas.height = innerHeight;
	c.restore();
};

const animation = () => {
	requestAnimationFrame(animation);
	reset();
};
animation();
