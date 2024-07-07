'use strict';
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const GRAVITY = 35;
const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};

onresize = () => {
  c.save();
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  c.restore();
};

oncontextmenu = (e) => {
  e.preventDefault();
};

onmousemove = (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
};

class Ball {
  constructor(x, y, color, radius) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = radius;
    this.originRadius = radius;
    this.direct = 0;
    this.speed = 7;
    this.v = {
      x: 0,
      y: 0,
    };
  }

  draw() {
    c.beginPath();
    c.fillStyle = this.color;
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, 0);
    c.fill();
    c.closePath();
  }

  update() {
    this.draw();

    const _this = this;

    this.v = {
      x: mouse.x - _this.x,
      y: mouse.y - _this.y,
    };

    this.x += this.v.x;

    if (!this.direct) {
      this.y -= this.speed;
      this.radius -= this.speed / GRAVITY;

      if (this.radius <= this.originRadius - (this.speed / GRAVITY) * 10) {
        this.direct = !this.direct;
      }
    } else {
      this.y += this.speed;
      this.radius += this.speed / GRAVITY;
      if (this.radius >= this.originRadius + (this.speed / GRAVITY) * 10) {
        this.direct = !this.direct;
      }
    }
  }
}

class Obstacle {
  constructor(x, y, color, radius) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = radius;
  }

  draw() {
    c.beginPath();
    c.fillStyle = this.color;
    c.fillRect(this.x, this.y, this.x + 100, this.y + 100);
    c.closePath();
  }

  update() {
    this.draw();
  }
}

const balls = [];
const obstacles = [];

const init = () => {
  balls.push(new Ball(mouse.x, mouse.y, 'red', 20));
};

const animation = () => {
  requestAnimationFrame(animation);
  c.fillStyle = `rgba(0, 0, 0, 0.1)`;
  c.fillRect(0, 0, innerWidth, innerHeight);

  balls.forEach((_) => _.update());
  obstacles.forEach((_) => _.update());
};

init();
animation();
