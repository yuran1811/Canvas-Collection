class CSTRUCTURE {
	constructor({
		name,
		radius,
		color,
		shootCD,
		speedRun,
		speedShot,
		boostSpeedRun,
		maxBoostSpeedRun,
		boostSpeedShot,
		boostSpeedShotCD,
		attackDamage,
	}) {
		this.name = name;
		this.radius = radius;
		this.color = color;
		this.shootCD = shootCD;
		this.speedRun = speedRun;
		this.speedShot = speedShot;
		this.boostSpeedRun = boostSpeedRun;
		this.maxBoostSpeedRun = maxBoostSpeedRun;
		this.boostSpeedShot = boostSpeedShot;
		this.boostSpeedShotCD = boostSpeedShotCD;
		this.attackDamage = attackDamage;
	}
}

const PLAYER_OPTIONS = [
	{
		prop: {
			name: 'Red',
			radius: 15,
			color: 'red',
			shootCD: 600,
			speedRun: 2,
			speedShot: 0,
			boostSpeedRun: 0,
			maxBoostSpeedRun: 8,
			boostSpeedShot: 10,
			boostSpeedShotCD: 3,
			attackDamage: 20,
		},
	},
	{
		prop: {
			name: 'Blue',
			radius: 8,
			color: 'lightblue',
			shootCD: 400,
			speedRun: 5,
			speedShot: 0,
			boostSpeedRun: 0,
			maxBoostSpeedRun: 8,
			boostSpeedShot: 20,
			boostSpeedShotCD: 4,
			attackDamage: 15,
		},
	},
	{
		prop: {
			name: 'pink',
			radius: 10,
			color: 'pink',
			shootCD: 275,
			speedRun: 3,
			speedShot: 0,
			boostSpeedRun: 0,
			maxBoostSpeedRun: 8,
			boostSpeedShot: 30,
			boostSpeedShotCD: 5,
			attackDamage: 10,
		},
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
		<button class="start-game">Start</button>
		<div class="player-info"></div>`;
})();
