const canvas = document.querySelector('#app');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const animation = () => {
	requestAnimationFrame(animation);
	ctx.fillStyle = `rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.g}, ${bgColor.a})`;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
};
animation();
