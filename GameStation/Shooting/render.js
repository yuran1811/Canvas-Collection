const CSTRUCTURE = function ({
	name,
	radius,
	color,
	shootCD,
	speedRun,
	speedShot,
	boostSpeedRun,
	boostSpeedShot,
	attackDamage,
}) {
	this.name = name;
	this.radius = radius;
	this.color = color;
	this.shootCD = shootCD;
	this.speedRun = speedRun;
	this.speedShot = speedShot;
	this.boostSpeedRun = boostSpeedRun;
	this.boostSpeedShot = boostSpeedShot;
	this.attackDamage = attackDamage;
};

const PLAYER_OPTIONS = [
	{
		prop: {
			name: 'Red',
			radius: 15,
			color: 'red',
			shootCD: 500,
			speedRun: 3,
			speedShot: 0,
			boostSpeedRun: 0,
			boostSpeedShot: 10,
			attackDamage: 25,
		},
		constructure: CSTRUCTURE,
	},
	{
		prop: {
			name: 'Blue',
			radius: 10,
			color: 'lightblue',
			shootCD: 250,
			speedRun: 6,
			speedShot: 0,
			boostSpeedRun: 0,
			boostSpeedShot: 20,
			attackDamage: 10,
		},
		constructure: CSTRUCTURE,
	},
	{
		prop: {
			name: 'Chumeodiia',
			radius: 10,
			color: 'pink',
			shootCD: 150,
			speedRun: 3,
			speedShot: 0,
			boostSpeedRun: 0,
			boostSpeedShot: 30,
			attackDamage: 7,
		},
		constructure: CSTRUCTURE,
	},
];

(() => {
	const playerContainer = document.querySelector('.player-container');
	playerContainer.innerHTML = `
		<div class="player-panel-title">Select Hero</div>
		<div class="player-selects">
			${PLAYER_OPTIONS.map(
				(item, index) => `
			<div
				class="player-item"
				style="
					width: ${item.prop.radius * 3}px;
					height: ${item.prop.radius * 3}px;
					background-color: ${item.prop.color};
					border-radius: 50%;
				">
				<input
					type="radio"
					id="${item.prop.name}"
					name="playerSelect"
					data-index="${index}">
			</div>`
			).join('')}
		</div>
		<button class="start-game">Start</button>`;
})();
