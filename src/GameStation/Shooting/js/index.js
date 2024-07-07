const ENEMY_OPTIONS = [
  {
    name: 'Lv1',
    color: 'pink',
    radius: 20,
    speed: 3,
    speedShot: 1,
    attackCD: 3,
  },
  {
    name: 'Lv2',
    color: 'lightgreen',
    radius: 25,
    speed: 2.2,
    speedShot: 2,
    attackCD: 2,
  },
  {
    name: 'Lv3',
    color: 'orange',
    radius: 35,
    speed: 1.5,
    speedShot: 3,
    attackCD: 1,
  },
];
const PLAYER_OPTIONS_LTH = PLAYER_OPTIONS.length;
const ENEMY_OPTIONS_LTH = ENEMY_OPTIONS.length;

const playerPanel = document.querySelector('.player-container');
const resultPanel = document.querySelector('.result');

const playerItems = document.querySelectorAll('.player-item');
const startBtn = document.querySelector('.start-game');
const restartBtn = document.querySelector('.restart');

const scoreEle = document.querySelectorAll('.score-cnt');
const cursor = document.querySelector('.cursor');
const canvas = document.querySelector('#app');
const ctx = canvas.getContext('2d');

const middle = { x: innerWidth / 2, y: innerHeight / 2 };
const PROJECTILE_CD = 5;
const friction = 0.98;

const projectilesEnemies = [];
const projectiles = [];
const gameControl = {};
const particles = [];
const enemies = [];

let numProjectile = 0;
let gameStart = 0;
let score = 0;
let PlayerId = 0;
let PlayerSelect;
let player;

canvas.width = innerWidth;
canvas.height = innerHeight;

// <--=== Object
class FlashShield {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.maxRadius = radius * 5;
    this.radius = radius;
    this.color = color;
    this.speed = 2;
  }

  draw() {
    c.beginPath();
    c.fillStyle = this.color;
    c.strokeStyle = this.color;
    c.lineWidth = 5;
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.stroke();
    c.closePath();
  }

  update() {
    this.draw();
    if (this.maxRadius > this.radius) this.radius += this.speed;
  }
}

class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  keyHandle(control) {
    if (!control) return;

    const delta = PlayerSelect.speedRun + PlayerSelect.boostSpeedRun;
    if (control['a']) {
      if (this.x - delta > this.radius) this.x -= delta;
    }
    if (control['d']) {
      if (this.x + delta < innerWidth - this.radius) this.x += delta;
    }
    if (control['s']) {
      if (this.y + delta < innerHeight - this.radius) this.y += delta;
    }
    if (control['w']) {
      if (this.y - delta > this.radius) this.y -= delta;
    }
  }

  update() {
    this.draw();
    this.keyHandle(gameControl);
  }
}

class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  update() {
    this.draw();
    this.velocity.x *= friction;
    this.velocity.y *= friction;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 0.01;
  }
}

class Projectile {
  constructor(x, y, radius, color, velocity, isEnemy) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.isEnemy = isEnemy;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

class Enemy {
  constructor(x, y, radius, color, velocity, speed, speedShot, attackCD) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.speed = speed;
    this.speedShot = speedShot;
    this.attackCD = attackCD;
    this.attackCDCount = attackCD;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  attack() {
    const angle = Math.atan2(player.y - this.y, player.x - this.x);
    const x = this.x + Math.cos(angle) * (this.radius * 2);
    const y = this.y + Math.sin(angle) * (this.radius * 2);
    projectiles.push(
      new Projectile(
        x,
        y,
        this.radius / 3,
        'red',
        {
          x: Math.cos(angle) * (5 + this.speedShot),
          y: Math.sin(angle) * (5 + this.speedShot),
        },
        1
      )
    );
  }

  update() {
    this.draw();

    const angle = Math.atan2(player.y - this.y, player.x - this.x);
    this.velocity.x = Math.cos(angle) * this.speed;
    this.velocity.y = Math.sin(angle) * this.speed;
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    this.attackCDCount += 0.01;
    if (this.attackCDCount >= this.attackCD) {
      this.attackCDCount = 0;
      this.attack();
    }
  }
}
// Object ===-->

const endGame = () => {
  cancelAnimationFrame(animationID);
  clearInterval(spawnEnemiesID);
  resultPanel.style.display = 'flex';
};

const cursorRender = (x, y) => (cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`);

const increaseScore = (amount) => {
  score += amount;
  scoreEle.forEach((item) => (item.innerHTML = score));
};

let spawnEnemiesID;
const spawnEnemies = () =>
  (spawnEnemiesID = setInterval(() => {
    const enemyIndex = Math.floor(Math.random() * ENEMY_OPTIONS_LTH);
    const enemyInfo = ENEMY_OPTIONS[enemyIndex];
    const { radius, color, speed, speedShot, attackCD } = enemyInfo;

    let x = 0;
    let y = 0;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : innerWidth + radius;
      y = Math.floor(Math.random() * innerHeight);
    } else {
      x = Math.floor(Math.random() * innerWidth);
      y = Math.random() < 0.5 ? 0 - radius : innerHeight + radius;
    }

    const angle = Math.atan2(player.y - y, player.x - x);
    const velocity = {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed,
    };
    enemies.push(new Enemy(x, y, radius, color, velocity, speed, speedShot, attackCD));
  }, 2000));

const removeFromEdge = (list, index) => {
  const item = list[index];
  if (
    item.x + item.radius < 0 ||
    item.x - item.radius > innerWidth ||
    item.y + item.radius < 0 ||
    item.y - item.radius > innerHeight
  )
    list.splice(index, 1);
};

let animationID;
const animation = () => {
  animationID = requestAnimationFrame(animation);
  ctx.fillStyle = `rgba(0, 0, 0, 0.12)`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  player.update();

  particles.forEach((item, index) => {
    if (item.alpha <= 0) particles.splice(index, 1);
    else item.update();
  });

  projectiles.forEach((item, index, arr) => {
    item.update();
    removeFromEdge(arr, index);
  });

  enemies.forEach((enemy, index) => {
    enemy.update();
    // removeFromEdge(enemies, index, enemy.x, enemy.y);

    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    if (dist - enemy.radius - player.radius <= 0.5) endGame();

    projectiles.forEach((pjtile, pjIndex) => {
      if (pjtile.isEnemy) {
        const dist = Math.hypot(pjtile.x - player.x, pjtile.y - player.y);

        // End Game
        if (dist - pjtile.radius - player.radius <= 0) endGame();

        projectiles.slice(pjIndex).forEach((item, idx) => {
          if (item.isEnemy) return;
          const dist = Math.hypot(pjtile.x - item.x, pjtile.y - item.y);
          if (dist <= 5 * 2) {
            projectiles.splice(idx, 1);
            projectiles.splice(pjIndex, 1);
          }
        });
        return;
      }

      const dist = Math.hypot(pjtile.x - enemy.x, pjtile.y - enemy.y);
      if (dist - enemy.radius - pjtile.radius <= 0.5) {
        for (let i = 0; i < 8; i++) {
          particles.push(
            new Particle(pjtile.x, pjtile.y, 3, enemy.color, {
              x: (Math.random() - 0.5) * (Math.random() * 6),
              y: (Math.random() - 0.5) * (Math.random() * 6),
            })
          );
        }

        if (enemy.speed < 8) enemy.speed *= 2;
        if (enemy.radius > 15) {
          increaseScore(10);
          const newRadius = enemy.radius - PlayerSelect.attackDamage;
          if (newRadius < 5) enemies.splice(index, 1);
          else
            gsap.to(enemy, {
              radius: newRadius,
            });
          projectiles.splice(pjIndex, 1);
        } else {
          increaseScore(30);
          enemies.splice(index, 1);
          projectiles.splice(pjIndex, 1);
        }
      }
    });
  });
};

const runApp = () => {
  score = 0;
  gameStart = 1;
  scoreEle.forEach((item) => (item.innerHTML = score));

  PlayerId = playerPanel.querySelector('input:checked')?.dataset.index || 0;
  PlayerSelect = new CSTRUCTURE(PLAYER_OPTIONS[PlayerId].prop);
  player = new Player(middle.x, middle.y, PlayerSelect.radius, PlayerSelect.color);

  projectiles.length = 0;
  gameControl.length = 0;
  particles.length = 0;
  enemies.length = 0;
  numProjectile = 0;

  resultPanel.style.display = 'none';
  playerPanel.style.display = 'none';

  animation();
  spawnEnemies();
};

// <--=== Event Handle
const boostSpeedRunHandle = (e) => {
  e.preventDefault();
  if (!gameStart) return;

  if (PlayerSelect.boostSpeedRun < PlayerSelect.maxBoostSpeedRun) PlayerSelect.boostSpeedRun++;
};

onmousemove = (e) => {
  const { clientX, clientY } = e;
  // cursorRender(clientX, clientY);
};
onclick = (e) => {
  const { clientX, clientY } = e;
  const angle = Math.atan2(clientY - player.y, clientX - player.x);

  PlayerSelect.boostSpeedRun = 0;
  PlayerSelect.speedShot = gameControl[' '] ? PlayerSelect.boostSpeedShot : 0;

  if (numProjectile >= 1) return;

  ++numProjectile;
  projectiles.push(
    new Projectile(
      player.x,
      player.y,
      5,
      'white',
      {
        x: Math.cos(angle) * (5 + PlayerSelect.speedShot),
        y: Math.sin(angle) * (5 + PlayerSelect.speedShot),
      },
      0
    )
  );
  setTimeout(() => (numProjectile = 0), PlayerSelect.shootCD);
};
oncontextmenu = boostSpeedRunHandle;
onkeydown = (e) => (gameControl[e.key] = true);
onkeyup = (e) => (gameControl[e.key] = false);
onresize = () => {
  ctx.save();
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  ctx.restore();
};

resultPanel.onclick = (e) => e.stopPropagation();
playerPanel.onclick = (e) => e.stopPropagation();
startBtn.onclick = (e) => {
  e.stopPropagation();
  runApp();
};
restartBtn.onclick = (e) => {
  e.stopPropagation();
  playerPanel.style.display = 'flex';
  resultPanel.style.display = 'none';
};

playerItems.forEach((item, index) => {
  if (!index) item.classList.add('player-select');

  item.onclick = () => {
    const input = item.querySelector('input');
    input.checked = 1;

    const lastSelect = document.querySelector('.player-select');
    if (lastSelect) lastSelect.className = lastSelect.className.replace('player-select', '');
    item.classList.add('player-select');
  };
});
// Event Handle ===-->

/* 
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2,
}

const flashShields = [];
const projectiles = [];

const calcDist = (a, b) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;

class Projectile {
    constructor(x, y, radius, color, v) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.v = v;
    }

    draw() {
        c.beginPath();
        c.fillStyle = this.color;
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fill();
        c.closePath();
    }

    update() {
        this.draw();
        this.x += this.v.x;
        this.y += this.v.y;
    }
}

class FlashShield {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.maxRadius = radius * 5;
        this.radius = radius;
        this.color = color;
        this.speed = 2;
    }

    draw() {
        c.beginPath();
        c.fillStyle = this.color;
        c.strokeStyle = this.color;
        c.lineWidth = 5;
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.stroke();
        c.closePath();
    }

    update() {
        this.draw();
        if (this.maxRadius > this.radius)
            this.radius += this.speed;
    }
}

class User {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.fixedRadius = radius;
        this.newRadius = 0;
        this.radius = radius;
        this.color = color;
        this.v = {x: 0, y: 0}
        this.speedTele = 1;

        this.cd = {
            flashShield: {
                cdTime: 2,
                nowCd: 0,
                speedDec: 0.05,
            },
        }
    }

    draw() {
        c.beginPath();
        c.fillStyle = this.color;
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fill();
        c.closePath();
    }

    moveToXY({x, y}) {
        this.move = 1;
        this.radius -= this.speedTele;
        this.newRadius += this.speedTele;

        this.draw();

        c.beginPath();
        c.fillStyle = this.color;
        c.arc(x, y, this.newRadius, 0, Math.PI * 2, false);
        c.fill();
        c.closePath();
    }

    dashing() {
        if (calcDist(this.dashPos, this) <= 5 ** 2) {
            this.x = this.dashPos.x;
            this.y = this.dashPos.y;
            this.isDash = 0;
        } else {
            this.x += this.dash.x;
            this.y += this.dash.y;
        }
    }

    update() {
        this.draw();
        if (this.isDash)
            this.dashing();
        else {
            this.x += this.v.x;
            this.y += this.v.y;
        }

        if (this.cd.flashShield.nowCd >= 0)
            this.cd.flashShield.nowCd -= this.cd.flashShield.speedDec;

        if (this.move) {
            if (this.radius <= 0) {
                this.radius = this.fixedRadius;
                this.newRadius = 0;
                this.move = 0;

                this.x = this.movePos.x;
                this.y = this.movePos.y;

                flashShields.push(new FlashShield(this.x, this.y, this.radius, 'lightblue'));
            } else {
                this.moveToXY(this.movePos);
            }
        }
    }
}

const hero = new User(mouse.x, mouse.y, 15, 'pink');

const animation = () => {
    requestAnimationFrame(animation);
    c.fillStyle = 'rgba(0, 0, 0, 0.1)';
    c.fillRect(0, 0, innerWidth, innerHeight);
    hero.update();

    flashShields.forEach((item, idx) => {
        item.update();
        if (item.maxRadius <= item.radius)
            flashShields.splice(idx, 1);
    })

    projectiles.forEach((item, idx) => {
        item.update();
        if (item.x < 0 || item.x > innerWidth || item.y < 0 || item.y > innerHeight)
            projectiles.splice(idx, 1);

        projectiles.forEach((other, idx2) => {
            if (other !== item && calcDist(item, other) <= 5 ** 2) {
                projectiles.splice(idx2, 1);
                projectiles.splice(idx, 1);
            }
        })
    })
}
animation();

oncontextmenu = (e) => {
    e.preventDefault();
    if (hero.cd.flashShield.nowCd <= 0) {
        hero.move = 1;
        hero.isDash = 0;
        hero.cd.flashShield.nowCd = hero.cd.flashShield.cdTime;

        hero.movePos = {
            x: e.clientX,
            y: e.clientY,
        }
    }
}

onclick = (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    const angle = Math.atan2(e.clientY - hero.y, e.clientX - hero.x);
    const v = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5,
    }
    projectiles.push(new Projectile(hero.x, hero.y, 5, 'white', v));
}

onkeydown = (e) => {
    if (e.key === ' ') {
        const angle = Math.atan2(mouse.y - hero.y, mouse.x- hero.x);
        hero.isDash = 1;
        hero.dashPos = {
            x: mouse.x,
            y: mouse.y,
        }
        hero.dash = {
            x: Math.cos(angle) * 10,
            y: Math.sin(angle) * 10,
        }
    }
}
*/
