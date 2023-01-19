const gui = new dat.GUI();
const canvas = document.querySelector('#app');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const wave = {
  y: canvas.height / 2,
  length: 0.01,
  amplitude: 170,
  frequency: 0.02,
};

const strokeColor = {
  h: 200,
  s: 50,
  l: 50,
};

const bgColor = {
  r: 0,
  g: 0,
  b: 0,
  a: 0.01,
};

const waveFolder = gui.addFolder('wave');
waveFolder.add(wave, 'y', 0, canvas.height);
waveFolder.add(wave, 'length', -0.1, 0.1);
waveFolder.add(wave, 'amplitude', 0, 350);
waveFolder.add(wave, 'frequency', -1, 1);
waveFolder.open();

const strokeFolder = gui.addFolder('stroke');
strokeFolder.add(strokeColor, 'h', 0, 255);
strokeFolder.add(strokeColor, 's', 0, 100);
strokeFolder.add(strokeColor, 'l', 0, 100);

const bgFolder = gui.addFolder('background');
bgFolder.add(bgColor, 'r', 0, 255);
bgFolder.add(bgColor, 'g', 0, 255);
bgFolder.add(bgColor, 'b', 0, 255);
bgFolder.add(bgColor, 'a', 0, 1);

let increment = wave.frequency;

const animation = () => {
  requestAnimationFrame(animation);

  ctx.save();
  ctx.fillStyle = `rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.g}, ${bgColor.a})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.moveTo(-5, canvas.height / 2);
  for (let i = 0; i < canvas.width; i++)
    ctx.lineTo(i, wave.y + Math.sin(i * wave.length + increment) * wave.amplitude * Math.sin(increment));

  ctx.strokeStyle = `hsl(
    ${Math.abs(strokeColor.h * Math.sin(increment))},
    ${strokeColor.s}%,
    ${strokeColor.l}%
  )`;
  ctx.stroke();

  increment += wave.frequency;
};

animation();

onresize = () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  ctx.restore();
};
