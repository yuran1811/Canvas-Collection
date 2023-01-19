const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};
const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66', '#0952BD', '#A5BFF0', '#118CD6', '#1AAEE8', '#F2E8C9'];
const colorsLth = colors.length;
const numParticles = 400;
const onePiece = (Math.PI * 2) / numParticles;

const GRAVITY = 0.03;
const FRICTION = 0.99;

const particles = [];

// Objects
class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.time = 1;
    this.velocity = velocity;
  }

  draw() {
    c.save();
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.globalAlpha = this.time;
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
    c.restore();
  }

  update() {
    this.draw();
    this.velocity.x *= FRICTION;
    this.velocity.y *= FRICTION;
    this.velocity.y += GRAVITY;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.time -= 0.005;
  }
}

const animate = () => {
  requestAnimationFrame(animate);

  c.fillStyle = `rgba(0, 0, 0, 0.08)`;
  c.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle, idx) => {
    if (particle.time > 0) particle.update();
    else particles.splice(idx, 1);
  });
};
animate();

// Event Handle
onclick = (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;

  if (particles.length > numParticles * 2) return;

  for (let i = 0; i < numParticles; i++) {
    const { x, y } = mouse;
    const color = colors[Math.floor(Math.random() * colorsLth)];
    const radius = 3;
    const velocity = {
      x: Math.cos(onePiece * i) * Math.random() * 7,
      y: Math.sin(onePiece * i) * Math.random() * 7,
    };

    particles.push(new Particle(x, y, radius, color, velocity));
  }
};

onresize = () => {
  c.save();
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  c.restore();
};
