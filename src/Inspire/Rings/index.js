const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const colors = [
  { r: 255, g: 71, b: 71 },
  { r: 0, g: 206, b: 237 },
  { r: 255, g: 255, b: 255 },
];
const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};
const explosions = [];

class Particle {
  constructor(x, y, radius, velocity, liveTime) {
    this.x = x;
    this.y = y;
    this.velocity = velocity;
    this.radius = radius;
    this.liveTime = liveTime;

    this.opacity = 1;
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  draw() {
    const { r, g, b } = this.color;

    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.strokeStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity})`;
    c.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity})`;
    c.stroke();
    c.closePath();
  }

  remove() {
    return this.liveTime <= 0;
  }

  updatePosition(key, limit) {
    this[key] += this.velocity[key];

    if (this[key] + this.radius >= limit || this[key] - this.radius <= 0) this.velocity[key] *= -1;

    this[key] = Math.min(Math.max(this[key], this.radius), limit - this.radius);
  }

  update() {
    this.updatePosition('x', innerWidth);
    this.updatePosition('y', innerHeight);

    this.draw();

    this.radius -= this.radius / (this.liveTime / 0.1);
    if (this.radius < 0) this.radius = 0;

    this.liveTime -= 0.1;
    this.opacity -= 1 / (this.liveTime / 0.1);
  }
}

class Explosion {
  constructor(x, y) {
    this.particles = [];

    this.init(x, y);
  }

  init(x, y) {
    for (let i = 1; i <= 1; i++) {
      const velocity = {
        x: (Math.random() - 0.5) * 3.5,
        y: (Math.random() - 0.5) * 3.5,
      };

      this.particles.push(new Particle(x, y, 30, velocity, 8));
    }
  }

  update() {
    this.particles.forEach((_, idx) => {
      _.update();

      if (_.remove()) this.particles.splice(idx, 1);
    });
  }
}

const animate = () => {
  requestAnimationFrame(animate);

  c.fillStyle = '#1e1e1e';
  c.fillRect(0, 0, innerWidth, innerHeight);

  explosions.push(new Explosion(mouse.x, mouse.y));
  explosions.forEach((_) => _.update());
};

onresize = () => {
  c.save();
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  c.restore();
};

onmousemove = (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
};

animate();
