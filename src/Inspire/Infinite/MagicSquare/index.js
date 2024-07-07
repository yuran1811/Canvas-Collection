const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.height = innerHeight;
canvas.width = innerWidth;

const NUM_SQUARES = 30;
const MAX_SQUARE_SIZE = 30;
const UNIT_RADIAN = Math.PI / 7200;
const CENTER = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};

class Square {
  constructor(
    x,
    y,
    radius,
    color,
    opts = {
      radian: 0,
      direct: 2,
    }
  ) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;

    this.radian = opts.radian;
    this.direct = opts.direct;
  }

  draw() {
    c.beginPath();
    c.rect(this.x - MAX_SQUARE_SIZE / 2, this.y - MAX_SQUARE_SIZE / 2, MAX_SQUARE_SIZE, MAX_SQUARE_SIZE);
    c.strokeStyle = this.color;
    c.stroke();
    c.closePath();
  }

  update() {
    this.draw();

    if (this.radian > Math.PI / 120 || this.radian < -Math.PI / 120) this.direct *= -1;
    this.radian += UNIT_RADIAN * this.direct;

    const newX = CENTER.x + (this.x - CENTER.x) * Math.cos(this.radian) - (this.y - CENTER.y) * Math.sin(this.radian);
    const newY = CENTER.y + (this.x - CENTER.x) * Math.sin(this.radian) + (this.y - CENTER.y) * Math.cos(this.radian);

    this.x = newX;
    this.y = newY;
  }
}

const squares = [];

const squareGenerate = (opts) => {
  for (let i = 0; i < NUM_SQUARES; i++) {
    const x = CENTER.x + i * (innerHeight / 2 / NUM_SQUARES);
    const y = CENTER.y + i * (innerHeight / 2 / NUM_SQUARES);
    const color = `hsl(${i * (255 / NUM_SQUARES)}, ${50}%, ${50}%)`;
    const radius = (i + 1) * (MAX_SQUARE_SIZE / NUM_SQUARES) * 2;

    squares.push(new Square(x, y, radius, color, opts));
  }
};

const init = () => {
  let order = 0;
  for (let i = 0; i < Math.PI * 2; i += Math.PI / 4, order++)
    squareGenerate({
      direct: order & 2 ? -1 : 1,
      radian: i,
    });
};

const animation = () => {
  requestAnimationFrame(animation);

  c.fillStyle = `rgba(0, 0, 0, 0.05)`;
  c.fillRect(0, 0, canvas.width, canvas.height);

  squares.forEach((_) => _.update());
};

init();
animation();

canvas.oncontextmenu = (e) => e.preventDefault();

onresize = () => {
  c.save();
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  c.restore();
};
