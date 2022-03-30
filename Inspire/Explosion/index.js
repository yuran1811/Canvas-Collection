// Goal - Create particles that travel based on angle of line
// Plan:
	// 1x - Create particles that animate randomly outwards with a time to live (ttl)
	// 2x - Create what are known as 'explosion points', points that create a line that particles will emanate from
	// 3x - Create function that takes 2 points as input and creates 10 explosion points at intervals along the line created between the two

"use strict";
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const mouse = {
	x: window.innerWidth / 2,
	y: 0 
};

window.addEventListener("mousemove", function(event) {
	mouse.x = event.clientX;
	mouse.y = event.clientY;
});

canvas.addEventListener("touchmove", function(event) {
	event.preventDefault();
	mouse.x = event.touches[0].pageX;
	mouse.y = event.touches[0].pageY;
});

window.addEventListener("resize", function() {
	canvas.width = window.innerWidth;	
	canvas.height = window.innerHeight;
});

function Particle(x, y, radius, color) {
	this.x = x;
	this.y = y;
	this.dx = (Math.random() - 0.5) * 1;
	this.dy = (Math.random() - 0.5) * 1;
	this.radius = radius;
	this.color = color;
	this.ttl = 0.45; 
	this.opacity = 1;

	this.update = function() {

    var diffX = mouse.x - (canvas.width / 2) - this.x;
    var diffY = mouse.y - (canvas.height / 2) - this.y;
    var dist2 = diffX * diffX + diffY * diffY + 1;
    var ddx = 0.1 * Math.abs(diffX) * diffX / dist2;
    var ddy = 0.1 * Math.abs(diffY) *diffY / dist2;
    this.dx += ddx;
    this.dy += ddy;

		this.x += this.dx;
		this.y += this.dy;

		c.fillStyle = "rgba(120, 107, 215," + this.opacity + ")";
		c.fill();

		this.draw();
		this.radius -= this.radius / (this.ttl / 0.005);
		this.ttl -= 0.01;
	};

	this.draw = function() {
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);	
		c.fillStyle = this.color;
		c.fill();
		c.closePath();
	};
}

function ExplosionPoint(x, y) {
	this.x = x;
	this.y = y;
	this.particles = [];
	this.timer = 0;

	this.update = function() {
		this.timer += 1;

		if (this.timer % 4 === 0) {
			let radius = 4; 
			this.particles.push(new Particle(this.x, this.y, radius));
		}

		for (let i = 0; i < this.particles.length; i++) {

			if (this.particles[i].ttl < 0) {
				this.particles.splice[i, 1];
			} else {
        this.particles[i].update();
			} 
      
		}
	}
}

/**
 * Creates 8 explosion points across a line
 *
 *
 * @return Void | Creates 8 points, returns nothing
*/
function drawLine(x1, y1, x2, y2) {
	// y = mx + b
	let x, y;
	let m = (y2 - y1) / (x2 - x1);
	let explosionAmount = 10;
	let travelInterval = (x2 - x1) / explosionAmount;
	
	for (let i = 1; i <= explosionAmount; i++) {

		// Determine where the y intercept lies
		// b = y intercept
		let b;
		if (x1 === 0)
			b = y1;

		if (x2 === 0)
			b = y2;

		// Get even interval x coordinate should change at 
		x = (i * travelInterval) + x1;
		y = (m * x) + b; 

		// If vertical or horizontal line
		if (!isFinite(m)) {
			let yTravelInterval = (y2 - y1) / explosionAmount;
			y = (i * yTravelInterval) + y1;
		}

		explosionPoints.push(new ExplosionPoint(x, y));
	}
}



var webpackImage = new Image();
webpackImage.src = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/448917/webpack.png';

let explosionPoints = [];


c.save();
c.translate(canvas.width / 2, canvas.height / 2);

// Top box
drawLine(-115, -64, 0, -127);
drawLine(115, -64, 0, -127);
drawLine(0, 0, 115, -64);
drawLine(0, 0, -115, -64);

// Bottom box
drawLine(0, 135, 120, 70);
drawLine(0, 135, -120, 70);

// Outside lines that make up box height
drawLine(-120, -64, -120, 70);
drawLine(120, -64, 120, 70);

// Middle lines
drawLine(0, -10, 0, 135);

c.restore();


function animate() {
	window.requestAnimationFrame(animate);
	c.clearRect(0, 0, canvas.width, canvas.height);

  c.save();
	c.translate(canvas.width / 2, canvas.height / 2);
	c.drawImage(webpackImage, - 175, - 130, 350, 391);
	for (let i = 0; i < explosionPoints.length; i++)
	    explosionPoints[i].update();  
	c.restore();
}

animate();