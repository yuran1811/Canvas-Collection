'use strict';

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const BACKGROUND = `rgba(10, 10, 10, 1)`;
const BLACK = {
  r: 0,
  g: 0,
  b: 0,
};
const WHITE = {
  r: 255,
  g: 255,
  b: 255,
};
const UNIT_RADIAN = Math.PI / 60;
const MAIN_YY_RADIUS = 170;
const YY_RADIUS = 20;

const particles = [];
const yinyangs = [];
const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};

const calcDist = (a, b) => Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);

c.fillStyle = BACKGROUND;
c.fillRect(0, 0, innerWidth, innerHeight);

// OBJECTS
class YinYang {
  constructor(x, y, radius, remove = 1) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = 'lightgreen';
    this.radian = 0;
    this.alpha = 1;
    this.remove = remove;

    this.yin = {
      x: x + radius / 2,
      y,
      radius: radius / 2,
      color: BLACK,
      yang: {
        x: x + radius / 2,
        y,
        radius: radius / 6,
        color: WHITE,
        remove,
        alpha: 1,
      },
      remove,
      alpha: 1,
    };

    this.yang = {
      x: x - radius / 2,
      y,
      radius: radius / 2,
      color: WHITE,
      yin: {
        x: x - radius / 2,
        y,
        radius: radius / 6,
        color: BLACK,
        remove,
        alpha: 1,
      },
      remove,
      alpha: 1,
    };
  }

  drawPoint({ x, y, radius, color, remove, alpha }, { start, end }) {
    const { r, g, b } = color;
    const ap = remove ? alpha : 1;
    c.beginPath();
    c.arc(x, y, radius, start + this.radian, end + this.radian, false);
    c.fillStyle = `rgba(${r}, ${g}, ${b}, ${ap})`;
    c.shadowColor = `rgba(${r}, ${g}, ${b}, 1)`;
    c.shadowBlur = 10;
    c.fill();
    c.closePath();
  }

  drawBG() {
    this.drawPoint({ ...this, color: WHITE }, { start: 0, end: Math.PI });
    this.drawPoint({ ...this, color: BLACK }, { start: Math.PI, end: Math.PI * 2 });
  }

  drawPattern(...list) {
    list.forEach((item) => {
      this.drawPoint(item, { start: 0, end: Math.PI * 2 });
      item?.yin && this.drawPoint(item.yin, { start: 0, end: Math.PI * 2 });
      item?.yang && this.drawPoint(item.yang, { start: 0, end: Math.PI * 2 });
    });
  }

  update() {
    this.drawBG(this);
    this.drawPattern(this.yin, this.yang);
    this.radian += UNIT_RADIAN;

    const process = (pat) => {
      const { x, y } = this;
      const newX = x + (pat.x - x) * Math.cos(UNIT_RADIAN) - (pat.y - y) * Math.sin(UNIT_RADIAN);
      const newY = y + (pat.x - x) * Math.sin(UNIT_RADIAN) + (pat.y - y) * Math.cos(UNIT_RADIAN);
      pat.x = newX;
      pat.y = newY;
    };
    process(this.yin);
    process(this.yang);
    process(this.yin.yang);
    process(this.yang.yin);

    if (!this.remove) return;
    const removeDec = (pat) => (pat.alpha -= 0.012);
    removeDec(this);
    removeDec(this.yin);
    removeDec(this.yang);
    removeDec(this.yin.yang);
    removeDec(this.yang.yin);
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
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    const { r, g, b } = this.color;
    c.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.alpha})`;
    c.fill();
    c.closePath();
  }

  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    this.alpha -= 0.03;
  }
}
// OBJECTS

const init = () => {
  yinyangs.push(new YinYang(mouse.x, mouse.y, MAIN_YY_RADIUS, 0));
};

const animation = () => {
  requestAnimationFrame(animation);
  c.fillStyle = BACKGROUND;
  c.fillRect(0, 0, innerWidth, innerHeight);

  const updateFunc = (item, index, arr) => {
    item.update();
    if (item.alpha <= 0) arr.splice(index, 1);
  };

  yinyangs.forEach(updateFunc);
  particles.forEach(updateFunc);
};

init();
animation();

onresize = () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
};
onclick = (e) => {
  const nowActive = document.querySelector('.theme-ico.active');
  if (nowActive && nowActive.id !== 'yin-yang') return;
  const newYY = { x: e.clientX, y: e.clientY };
  const OK =
    yinyangs.every((item) => calcDist(newYY, item) > 2 * YY_RADIUS) &&
    calcDist(newYY, yinyangs[0]) > MAIN_YY_RADIUS + YY_RADIUS;
  OK && yinyangs.push(new YinYang(e.clientX, e.clientY, YY_RADIUS));

  for (let i = 0; i < 20; i++) {
    const mouse = {
      x: e.clientX,
      y: e.clientY,
    };
    const color = {
      r: 200,
      g: 200,
      b: 200,
    };
    const velocity = {
      x: Math.random() * 4 - 2,
      y: Math.random() * 4 - 2,
    };
    particles.push(new Particle(mouse.x, mouse.y, 5, color, velocity));
  }
};
oncontextmenu = (e) => {
  e.preventDefault();
  const newYY = { x: e.clientX, y: e.clientY };
  yinyangs.filter((item, index) => {
    if (index === 0) return;
    if (calcDist(newYY, item) <= YY_RADIUS) {
      yinyangs.splice(index, 1);
      return true;
    }
  });
};
// YIN YANG

let isStarted = false;
const renderCell = () => {
  if (isStarted) return;
  isStarted = 1;
  const mainContainer = $('.container .main');
  for (let i = 0; i < 9; i++) mainContainer.innerHTML += `<div cell-index="${i}" class="cell"></div>`;
};

let gameState = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isActive = true;

const playerTurn = () => `${currentPlayer}'s turn`;
const winLog = () => `${currentPlayer} has won!`;
const drawLog = () => `Game ended in a draw!`;

const statusDisplay = $('.turn');

$('.restart').addEventListener('click', () => {
  renderCell();
  $('.restart').innerHTML = '<i class="fas fa-redo redo"></i> Restart';
  statusDisplay.innerHTML = playerTurn();
  $$('.cell').forEach((cell) => cell.addEventListener('click', handleCellClick));
});
$('.restart').addEventListener('click', handleRestartGame);

function handleCellPlayed(clickedCell, clickedCellIndex) {
  gameState[clickedCellIndex] = currentPlayer;
  clickedCell.innerHTML = currentPlayer;
}

function handlePlayerChange() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusDisplay.innerHTML = playerTurn();
}

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function handleResultValidation() {
  let roundWon = false;
  for (let i = 0; i <= 7; i++) {
    const winCondition = winningConditions[i];
    let a = gameState[winCondition[0]];
    let b = gameState[winCondition[1]];
    let c = gameState[winCondition[2]];
    if (a === '' || b === '' || c === '') continue;
    if (a === b && b === c) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    statusDisplay.innerHTML = winLog();
    isActive = false;
    return;
  }

  let roundDraw = !gameState.includes('');
  if (roundDraw) {
    statusDisplay.innerHTML = drawLog();
    isActive = false;
    return;
  }
  handlePlayerChange();
}

function handleCellClick(clickedCellEvent) {
  const clickedCell = clickedCellEvent.target;
  const clickedCellIndex = parseInt(clickedCell.getAttribute('cell-index'));

  if (gameState[clickedCellIndex] !== '' || !isActive) return;

  handleCellPlayed(clickedCell, clickedCellIndex);
  handleResultValidation();
}

function handleRestartGame() {
  gameState = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  isActive = true;
  statusDisplay.innerHTML = playerTurn();
  $$('.cell').forEach((cell) => (cell.innerHTML = ''));
}

const listTheme = ['light', 'dark', 'spring', 'summer', 'autumn', 'winter', 'noel', 'yin-yang'];
const listThemeHTML = ['Light', 'Dark', 'Spring', 'Summer', 'Autumn', 'Winter', 'Noel', 'YinYang'];

$('.theme-list').innerHTML = listThemeHTML
  .map((item, index) => `<div id="${listTheme[index]}" class="theme-ico">${item}</div>`)
  .join('');

$$('.theme-ico').forEach((item) => {
  item.onclick = (e) => {
    if (item.id !== 'yin-yang') canvas.style.display = 'none';
    else canvas.style.display = 'block';
    listTheme.forEach((themeItem) => {
      $('body').classList.remove(`${themeItem}-theme`);
      $(`#${themeItem}`).classList.remove('active');
    });
    $('body').classList.add(`${e.target.getAttribute('id')}-theme`);
    $(`#${e.target.getAttribute('id')}`).classList.add('active');
  };
});

$$('.cell').forEach((cell) => {
  cell.onclick = (e) => {
    for (let i = 0; i < 10; i++) {
      const mouse = {
        x: e.clientX,
        y: e.clientY,
      };
      const color = {
        r: 30,
        g: 30,
        b: 30,
      };
      const velocity = {
        x: Math.random() * 2 + 1,
        y: Math.random() * 2 + 1,
      };
      particles.push(new Particle(mouse.x, mouse.y, 10, color, velocity));
    }
  };
});
