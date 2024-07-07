const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.height = innerHeight;
canvas.width = innerWidth;

const NUM_PARTICLES = 30;
const MAX_PARTICLE_RADIUS = 30;
const UNIT_RADIAN = Math.PI / 7200;
const CENTER = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};

class Particle {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;

    this.radian = 0;
    this.direct = Math.random() - 0.5 > 0 ? 1 : -1;
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

    this.radian += UNIT_RADIAN * this.direct;

    const newX = CENTER.x + (this.x - CENTER.x) * Math.cos(this.radian) - (this.y - CENTER.y) * Math.sin(this.radian);
    const newY = CENTER.y + (this.x - CENTER.x) * Math.sin(this.radian) + (this.y - CENTER.y) * Math.cos(this.radian);

    this.x = newX;
    this.y = newY;
  }
}

const particles = [];

const init = () => {
  for (let i = 0; i < NUM_PARTICLES; i++) {
    const x = CENTER.x + i * (innerHeight / 2 / NUM_PARTICLES);
    const y = CENTER.y + i * (innerHeight / 2 / NUM_PARTICLES);
    const color = `hsl(${i * (255 / NUM_PARTICLES)}, ${50}%, ${50}%)`;
    const radius = (i + 1) * (MAX_PARTICLE_RADIUS / NUM_PARTICLES) * 2;

    particles.push(new Particle(x, y, radius, color));
  }
};

const animation = () => {
  requestAnimationFrame(animation);

  c.fillStyle = `rgba(0, 0, 0, 0.05)`;
  c.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach((item) => item.update());
};

init();
animation();

canvas.onclick = () => {};
canvas.oncontextmenu = (e) => e.preventDefault();

onresize = () => {
  c.save();
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  c.restore();
};
