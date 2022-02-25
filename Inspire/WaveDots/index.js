const container = document.getElementById('container');
const circles = [];
const ROW = 15;
const COL = 15;

const genBoard = () => {
	for (let i = 0; i < COL; i++) {
		circles[i] = [];
		for (let j = 0; j < ROW; j++) {
			const circle = document.createElement('div');
			circle.classList.add('circle');
			container.appendChild(circle);
			circles[i].push(circle);
		}
	}
};

const dotEventHandle = () => {
	circles.forEach((col, i) =>
		col.forEach((circle, j) => (circle.onclick = () => growCircles(i, j)))
	);
};

const growCircles = (i, j) => {
	if (circles[i] && circles[i][j]) {
		if (!circles[i][j].classList.contains('grow')) {
			circles[i][j].classList.add('grow');
			setTimeout(() => {
				growCircles(i - 1, j);
				growCircles(i + 1, j);
				growCircles(i, j - 1);
				growCircles(i, j + 1);
			}, 100);

			setTimeout(() => {
				circles[i][j].classList.remove('grow');
			}, 300);
		}
	}
};

const run = () => {
	genBoard();
	dotEventHandle();
};
run();