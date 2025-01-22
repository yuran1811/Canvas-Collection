const GRAVITY = 9.8 / 15;
const NUM_BLOCK = 20;
const NUM_PARTICLE = 400;
const SPACE = 300;
const MARGIN = 400;
const JUMP_H = 16;
const PLATFORM_W = 200;
const PLATFORM_H = 20;
const PARTICLE_GRAVITY = 0.03;
const PARTICLE_FRICTION = 0.99;

const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66', '#0952BD', '#A5BFF0', '#118CD6', '#1AAEE8', '#F2E8C9'];
const colorsLth = colors.length;
const onePiece = (Math.PI * 2) / NUM_PARTICLE;

const winContainer = document.querySelector('.win-container');
const loseContainer = document.querySelector('.lose-container');
const restartBtns = document.querySelectorAll('button.restart');
const scoreEle = document.querySelector('.score');
const canvas = document.querySelector('#app');
const c = canvas.getContext('2d');

const app = {
  particles: [],
  genericObjects: [],
  platforms: [],
  keys: undefined,
  player: undefined,
  scrollOffset: undefined,
  animationID: undefined,
  fireworksAnimate: undefined,
  fireworksInterval: undefined,
  winCondition: undefined,
  isStart: undefined,
  score: undefined,
  scoreInc: undefined,
  scoreIncSpeed: undefined,
  timeStart: undefined,
  tools: {
    randRange: ({ x, y }) => {
      return {
        x: Math.random() * PLATFORM_W + PLATFORM_W + x,
        y: Math.random() * (innerHeight - y - PLATFORM_H) + y / 2 - 2 * JUMP_H,
      };
    },
    rand: ({ x, y, type = 0 }) => ({
      x: type ? Math.random() * PLATFORM_W + PLATFORM_W + x : Math.random() * innerWidth + x,
      y: type ? Math.random() * (innerHeight - y) + y / 2 : Math.random() * innerHeight + y,
    }),
    isInRange: (v, l, r) => l <= v && v <= r,
  },

  initValue() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    cancelAnimationFrame(this.fireworksAnimate);
    clearInterval(this.fireworksInterval);
    this.fireworksAnimate = undefined;
    this.fireworksInterval = undefined;
    this.particles.length = 0;

    this.score = 0;
    this.scoreInc = 5;
    this.scoreIncSpeed = 0.2;
    this.timeStart = new Date().getTime();
    this.isStart = 1;
    this.player = new Player(300, 200);
    this.keys = {
      a: { press: 0, count: 0, maxCount: -1 },
      d: { press: 0, count: 0, maxCount: -1 },
      w: { press: 0, count: 0, maxCount: 2 },
      s: { press: 0, count: 0, maxCount: -1 },
    };
    this.scrollOffset = 0;
    this.genericObjects.length = 0;
    this.platforms.length = 0;
    this.platforms.push(new Platform({ x: 200, y: 350 }));
  },

  scoring() {
    const timeNow = new Date().getTime();
    if (timeNow - this.timeStart > 2e3) {
      this.timeStart = timeNow;
      this.scoreInc *= 1.5;
      this.scoreIncSpeed *= 2;
    }
    this.score += this.scoreIncSpeed * this.scoreInc;

    scoreEle.innerHTML = this.score;

    // console.log('Score: ', this.score);
    // console.log('Score Inc: ', this.scoreInc);
    // console.log('Score Inc Speed: ', this.scoreIncSpeed);
  },

  checkWin() {
    return this.player.position.x + this.scrollOffset >= this.winCondition + PLATFORM_W / 2;
  },
  checkLose() {
    return this.player.position.y + this.player.height > innerHeight;
  },
  checkCondition() {
    if (this.checkWin()) {
      cancelAnimationFrame(this.animationID);
      winContainer.classList.remove('hide');
      this.isStart = 0;
      this.fireworks();
    }
    if (this.checkLose()) {
      cancelAnimationFrame(this.animationID);
      loseContainer.classList.remove('hide');
      this.isStart = 0;
    }
  },

  onPlatform() {
    const { platforms, tools } = this;
    platforms.forEach((_) => {
      if (
        tools.isInRange(
          this.player.position.y + this.player.height,
          _.position.y - this.player.velocity.y,
          _.position.y
        ) &&
        tools.isInRange(this.player.position.x, _.position.x - this.player.width, _.position.x + _.width)
      ) {
        this.keys['w'].count = 0;
        this.player.velocity.y = 0;
      }
    });
  },

  playerKeyPressHandle() {
    const { player, keys, platforms, scrollOffset } = this;
    const conditions = [player.position.x > 100, !scrollOffset && platforms.every((_) => _.position.x > 0)];

    if (keys['d'].press && player.position.x < innerWidth / 2 - 100) this.player.velocity.x = player.speed;
    else if (keys['a'].press && conditions.some((_) => _)) this.player.velocity.x = -player.speed;
    else {
      this.player.velocity.x = 0;

      if (keys['d'].press) {
        this.scrollOffset += player.speed;
        this.platforms.forEach((_) => {
          _.position.x -= player.speed;
        });
        this.genericObjects.forEach((_) => {
          _.position.x -= player.speed * 0.66;
        });
      }

      if (keys['a'].press && this.scrollOffset > 0) {
        this.scrollOffset -= player.speed;
        this.platforms.forEach((_) => {
          _.position.x += player.speed;
        });
        this.genericObjects.forEach((_) => {
          _.position.x += player.speed * 0.66;
        });
      }
    }
  },

  fireworks() {
    const geneNewFireworks = () => {
      const coor = app.tools.rand({ x: 0, y: 0 });
      for (let i = 0; i < NUM_PARTICLE; i++) {
        const { x, y } = coor;
        const color = colors[Math.floor(Math.random() * colorsLth)];
        const radius = 3;
        const velocity = {
          x: Math.cos(onePiece * i) * Math.random() * 7,
          y: Math.sin(onePiece * i) * Math.random() * 7,
        };

        this.particles.push(new Particle(x, y, radius, color, velocity));
      }
    };
    const animate = () => {
      this.fireworksAnimate = requestAnimationFrame(animate);

      c.fillStyle = `rgba(0, 0, 0, 0.1)`;
      c.fillRect(0, 0, canvas.width, canvas.height);

      this.particles.forEach((particle, idx) => {
        if (particle.time > 0) particle.update();
        else this.particles.splice(idx, 1);
      });
    };

    geneNewFireworks();
    this.fireworksInterval = setInterval(geneNewFireworks, 1200);
    animate();
  },

  drawObjs() {
    c.fillStyle = `rgba(0, 0, 0, 0.3)`;
    c.fillRect(0, 0, innerWidth, innerHeight);

    this.genericObjects.forEach((_) => _.draw());
    this.platforms.forEach((_) => _.draw());
    this.player.update();
  },

  run() {
    init();
    animation();
  },
};

class Player {
  constructor(x = 300, y = 300) {
    this.speed = 5;
    this.width = 30;
    this.height = 30;
    this.position = { x, y };
    this.velocity = { x: 0, y: 0 };

    this.isJump = 0;
    this.jumpHeight = JUMP_H;
  }

  draw() {
    c.fillStyle = 'red';
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.isJump) {
      this.velocity.y = -this.jumpHeight;
      this.isJump = 0;
    }

    if (this.position.y + this.height + this.velocity.y <= innerHeight) this.velocity.y += GRAVITY;
    else this.velocity.y = 0;

    this.draw();
  }
}

class Platform {
  constructor({ x, y }) {
    this.width = PLATFORM_W;
    this.height = PLATFORM_H;
    this.position = { x, y };
  }

  draw() {
    c.fillStyle = 'lightblue';
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

class GenericObject {
  constructor({ x, y }) {
    this.width = 200;
    this.height = 20;
    this.position = { x, y };
  }

  draw() {
    const { x, y } = this.position;

    c.beginPath();
    c.fillStyle = 'lightgreen';
    c.arc(x, y, this.width / 2, 0, Math.PI * 2, false);
    c.fill();
    c.closePath();
  }
}

class Flag {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw() {
    c.beginPath();
    c.closePath();
  }
}

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
    c.beginPath();
    c.globalAlpha = this.time;
    c.fillStyle = this.color;
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fill();
    c.closePath();
  }

  update() {
    this.draw();
    this.velocity.x *= PARTICLE_FRICTION;
    this.velocity.y *= PARTICLE_FRICTION;
    this.velocity.y += PARTICLE_GRAVITY;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.time -= 0.005;
  }
}

const init = () => {
  app.initValue();

  winContainer.classList.add('hide');
  loseContainer.classList.add('hide');

  let lastPlatform = { x: 200, y: 350 };
  let lastGenericObj = { x: 100, y: 100 };
  for (let i = 1; i <= NUM_BLOCK; i++) {
    lastGenericObj = app.tools.rand({ ...lastGenericObj, type: 1 });
    lastPlatform = app.tools.randRange(lastPlatform);

    app.winCondition = lastPlatform.x;
    app.genericObjects.push(new GenericObject(lastGenericObj));
    app.platforms.push(new Platform(lastPlatform));
  }
};

const animation = () => {
  app.animationID = requestAnimationFrame(animation);
  app.scoring();
  app.drawObjs();
  app.playerKeyPressHandle();
  app.onPlatform();
  app.checkCondition();
};

oncontextmenu = (e) => e.preventDefault();
onkeydown = ({ key }) => {
  switch (key) {
    case 'a':
    case 'd':
      app.keys[key].press = 1;
      break;
    case 'w':
      if (app.keys[key].count < app.keys[key].maxCount) {
        app.keys[key].count++;
        app.player.isJump = 1;
      }
      break;
    case 's':
      app.player.velocity.y += 10;
      break;
    default:
      break;
  }
};
onkeyup = ({ key }) => {
  switch (key) {
    case 'a':
    case 'd':
      app.keys[key].press = 0;
      break;
    case 'w':
    case 's':
    default:
      break;
  }
};
onresize = () => {
  c.save();
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  c.restore();
};

restartBtns.forEach((_) => (_.onclick = app.run));
app.run();
