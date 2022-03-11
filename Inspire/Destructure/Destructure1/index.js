const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const mouse = {
	x: innerWidth / 2,
	y: innerHeight / 2,
};

onmousemove = (e) => {
	mouse.x = e.clientX;
	mouse.y = e.clientY;
};
