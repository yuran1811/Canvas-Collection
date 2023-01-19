const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

c.fillStyle = `rgba(3, 10, 25, 1)`;
c.fillRect(0, 0, innerWidth, innerHeight);

const ripples = [];
const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};

class Ripple {
  constructor(x, y, radius, color, timeAppear) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.alpha = 1;
    this.timeAppear = timeAppear;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.strokeStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha})`;
    c.lineWidth = 5;
    c.stroke();
    c.closePath();
  }

  update() {
    this.timeAppear -= 0.1;
    if (this.timeAppear > 0) return;
    this.draw();
    this.radius += 2;
    this.alpha -= 0.01;
  }
}

onmousemove = (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
};

const geneRipples = () => {
  setTimeout(geneRipples, 400);
  const color = {
    r: 130,
    g: 220,
    b: 255,
  };
  for (let i = 0; i < 3; i++) ripples.push(new Ripple(mouse.x, mouse.y, 5, color, i));
};

const animation = () => {
  requestAnimationFrame(animation);
  c.fillStyle = `rgba(3, 8, 20, 0.1)`;
  c.fillRect(0, 0, innerWidth, innerHeight);
  ripples.forEach((item, index) => {
    item.update();
    if (item.alpha <= 0) ripples.splice(index, 1);
  });
};

geneRipples();
animation();
