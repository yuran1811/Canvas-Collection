const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const guiConfig = {
  mode: { defaultValue: 'de' },
  color: { defaultValue: 350, min: 0, max: 360, step: 1 },
  colorRange: { defaultValue: 7, min: 1, max: 20 },
  pixelSize: { defaultValue: 5, min: 2, max: 15, step: 1 },
  gap: { defaultValue: 0, min: 0, max: 10, step: 1 },
  noiseSpeed: { defaultValue: 0.08, min: 0.0, max: 0.15 },
  ySpeed: { defaultValue: 6.0, min: 0.0, max: 15.0 },
  xScale: { defaultValue: 30, min: 10, max: 100, step: 1 },
  yScale: { defaultValue: 100, min: 10, max: 150, step: 1 },
};

const config = Object.entries(guiConfig).reduce((acc, [key, value]) => {
  acc[key] = value.defaultValue;
  return acc;
}, {});

let w = (ctx.canvas.width = 200);
let h = (ctx.canvas.height = w);
let nt = 0;
let yt = 0;
let yn = 0;

const resizeFrame = () => {
  const size = Math.min(window.innerWidth, window.innerHeight) / 2;
  ctx.canvas.width = ctx.canvas.height = size;
  w = h = size;
};

const lerp = (x1, x2, n) => (1 - n) * x1 + n * x2;

const draw = () => {
  ctx.clearRect(0, 0, w, h);

  nt += config.noiseSpeed;
  yt += config.ySpeed;

  for (let y = 0; y < h; y += config.pixelSize + config.gap) {
    for (let x = 0; x < w; x += config.pixelSize + config.gap) {
      if (config.mode == 'fs') {
        yn = noise.simplex3((y + yt) / config.yScale, (x / config.xScale) * (y / 100), nt) * 40 + y / (w / 23);
      } else if (config.mode == 'wa') {
        yn =
          noise.simplex3((y + yt) / config.yScale - Math.sin(y / 22) / 10, x / config.xScale - Math.sin(y / 23), nt) *
          20;
      } else {
        yn = noise.simplex3((y + yt) / config.yScale, x / config.xScale, nt) * 20 + y / (w / 23);
      }
      let cn = lerp(y / 10, yn * config.colorRange, 0.2);

      ctx.beginPath();
      ctx.fillStyle = 'hsla(' + (config.color + cn) + ', 50%, 50%,' + yn + ')';
      ctx.fillRect(x, y, config.pixelSize, config.pixelSize);
      ctx.closePath();
    }
  }
};

(function setup() {
  resizeFrame();

  const gui = new dat.GUI();
  gui.close();

  Object.entries(guiConfig).forEach(([key, value]) => {
    if (key === 'mode') {
      gui.add(config, key, { Default: 'de', Firestream: 'fs', Waves: 'wa' });
      return;
    }

    let controller = gui.add(config, key, value.min, value.max);
    if (value.hasOwnProperty('step')) controller.step(value.step);
  });
})();

(function render() {
  draw();
  requestAnimationFrame(render);
})();

(function eventHandler() {
  window.addEventListener('resize', resizeFrame);
})();
