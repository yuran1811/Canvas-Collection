const PLAYER_OPTIONS = [
	{
		prop: {
			name: 'Admin',
			radius: 15,
			color: 'red',
			shootCD: 500,
			speedRun: 3,
			speedShot: 0,
			boostSpeedRun: 0,
			boostSpeedShot: 10,
		},
		constructure: function ({
			name,
			radius,
			color,
			shootCD,
			speedRun,
			speedShot,
			boostSpeedRun,
			boostSpeedShot,
		}) {
			this.name = name;
			this.radius = radius;
			this.color = color;
			this.shootCD = shootCD;
			this.speedRun = speedRun;
			this.speedShot = speedShot;
			this.boostSpeedRun = boostSpeedRun;
			this.boostSpeedShot = boostSpeedShot;
		},
	},
	{
		prop: {
			name: 'G9',
			radius: 10,
			color: 'lightblue',
			shootCD: 250,
			speedRun: 6,
			speedShot: 0,
			boostSpeedRun: 0,
			boostSpeedShot: 20,
		},
		constructure: function ({
			name,
			radius,
			color,
			shootCD,
			speedRun,
			speedShot,
			boostSpeedRun,
			boostSpeedShot,
		}) {
			this.name = name;
			this.radius = radius;
			this.color = color;
			this.shootCD = shootCD;
			this.speedRun = speedRun;
			this.speedShot = speedShot;
			this.boostSpeedRun = boostSpeedRun;
			this.boostSpeedShot = boostSpeedShot;
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
		<button class="start-game">Start</button>`;
})();
