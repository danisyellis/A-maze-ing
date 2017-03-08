//player
var player = {x: 60, y: 110, w: 50, h: 50};
var up = 0;
var down = 0;
var left = 0;
var right = 0;

//walls
var wallArray = [
//outline
	{x: 0, y: 0, w: 1000, h: 1}, 
	{x: 0, y: 0, w: 1, h: 600}, 
	{x: 1000, y: 0, w: 1, h: 600},
	{x: 0, y: 600, w: 1000, h: 1},
	//walls 1000, 600
	{x: 0, y: 80, w: 300, h: 15}, 
	{x: 450, y: 100, w: 500, h: 15},
	{x: 100, y: 250, w: 300, h: 15},
	{x: 900, y: 5, w: 15, h: 200},
	//goalbox
	{x: 420, y: 440, w: 20, h: 90}, //left
	{x: 560, y: 440, w: 20, h: 90}, //right
	{x: 440, y: 510, w: 120, h: 20} //bottom
];

//enemies
var enemies = [
	{x: 300, y: 20, w: 45, h: 30, spd: 5, movement: "hor"},
	{x: 20, y: 350, w: 45,h: 30, spd: 5, movement: "vert"},
	{x: 250, y: 425, w: 45, h: 30, spd: 5, movement: "hor"},
	{x: 360, y: 400, w: 45, h:30, spd: 10, movement: "aroundGoalbox"},
	{x: 800, y: 400, w: 45, h: 30, spd: 1, movement: "followPlayer"}
];

//pickups
var collectibleCodes = [
	{x: 200, y: 310, w: 25, h: 25, show: 1},
	{x: 805, y: 465, w: 25, h: 25, show: 1},
	{x: 220, y: 60, w: 25, h:25, show: 1}
];
var codePoints = 0;

var goal = {x: 490, y: 475, w: 20, h:20};

//start Processing
function sketchProc(processing) {
processing.size(1000, 600)
processing.draw = function() {
	processing.background(188, 180, 255);
	processing.noStroke();

	//draw player
	processing.fill(20, 150, 150);
	processing.rect(player.x, player.y, player.w, player.h);
	playerMove(4);

//draw codePickups
	processing.fill(250, 200, 0);
	for (var i = 0; i < collectibleCodes.length; i++) {
		if (collectibleCodes[i].show === 1) {
			processing.ellipse(collectibleCodes[i].x, collectibleCodes[i].y, collectibleCodes[i].h, collectibleCodes[i].w);
		}
	}
	// processing.textSize(18);
	// processing.text("Code Collected: " + codePoints, 10, 490);

//draw Walls
	processing.fill(180, 0, 160);
	for (var i = 0; i < wallArray.length; i++) {
		processing.rect(wallArray[i].x, wallArray[i].y, wallArray[i].w, wallArray[i].h);
	}

//draw Enemies
	processing.fill(230, 20, 20);
	enemyMove();
	for (var i = 0;i < enemies.length;i++) {
		processing.rect(enemies[i].x, enemies[i].y, enemies[i].w, enemies[i].h);
	}

//draw goal
	processing.fill(150, 100, 150);
	processing.rect(goal.x, goal.y, goal.w, goal.h);

}
//end draw



var playerMove = function(speed) {
	if (up === 1) {
		player.y = player.y - speed;
		for (var i = 0; i < wallArray.length; i++) {
			while (collision(player, wallArray[i])) {
				player.y = player.y + 1;
			}
		}
	}
	if (down === 1) {
		player.y = player.y + speed;
		for (var i = 0; i < wallArray.length; i++) {
			while (collision(player, wallArray[i])) {
				player.y = player.y - 1;
			}
		}
	}
	if (left === 1) {
		player.x = player.x - speed;
		for (var i = 0; i < wallArray.length; i++) {
			while (collision(player, wallArray[i])) {
				player.x = player.x + 1;
			}
		}
	}
	if (right === 1) {
		player.x = player.x + speed;
		for (var i = 0; i < wallArray.length; i++) {
			while (collision(player, wallArray[i])) {
				player.x = player.x - 1;
			}
		}
	}
	//collect codePickup
	for (var i = 0; i < collectibleCodes.length; i++) {
		if (collision(player, collectibleCodes[i]) && collectibleCodes[i].show === 1) {
			collectibleCodes[i].show = 0;
			codePoints += 1;
		}
	}
	//did we win?
	if (collision(player, goal) && codePoints === 3) {
		alert("You Win! Great job!");
		reset();
	}
};


var collision = function(obj1, obj2) {
	if (obj1.x + obj1.w > obj2.x &&
	obj1.x < obj2.x + obj2.w &&
	obj2.y + obj2.h > obj1.y &&
	obj2.y < obj1.y + obj1.h) {
		return true;
	} else {
		return false;
	}
};



var enemyMove = function() {
	for (var i = 0; i < enemies.length; i++) {
		if (enemies[i].movement === "hor") {
			enemies[i].x = enemies[i].x + enemies[i].spd;
		} else if (enemies[i].movement === "vert") {
			enemies[i].y = enemies[i].y + enemies[i].spd;
		} else if (enemies[i].movement === "aroundGoalbox") {
			aroundGoalbox(enemies[i]);
		} else if (enemies[i].movement === "followPlayer") {
			followPlayer(enemies[i]);
		}
		//check wall collision
		if (enemies[i].movement !== "followPlayer") {
			for (var j = 0; j < wallArray.length; j++) {
				if (collision(enemies[i], wallArray[j])) {
						enemies[i].spd  *= -1;
				}
			}
		}

		//check player collision
		if (collision(enemies[i], player)) {
				reset();
		}
	}
};

var followPlayer = function(enemy) {
			if (enemy.x < player.x) {
				enemy.x += enemy.spd;
			} else {
				enemy.x -= enemy.spd;
			}
			if (enemy.y < player.y) {
				enemy.y += enemy.spd;
			} else {
				enemy.y -= enemy.spd;
			}
}
var aroundGoalbox = function(enemy) {
	
}

var reset = function() {
	player.x = 60; player.y = 110;
	codePoints = 0;
	for (var i = 0; i < collectibleCodes.length; i++) {
		collectibleCodes[i].show = 1;
	}
	enemies[4].x = 800;
	enemies[4].y = 400;
}

processing.keyPressed = function() {
	if (processing.keyCode === processing.LEFT) {
		left = 1;
	}
	if (processing.keyCode === processing.RIGHT) {
		right = 1;
	}
	if (processing.keyCode === processing.UP) {
		up = 1;
	}
	if (processing.keyCode === processing.DOWN) {
		down = 1;
	}
};
processing.keyReleased = function() {
	if (processing.keyCode === processing.LEFT) {
		left = 0;
	}
	if (processing.keyCode === processing.RIGHT) {
		right = 0;
	}
	if (processing.keyCode === processing.UP) {
		up = 0;
	}
	if (processing.keyCode === processing.DOWN) {
		down = 0
	}
};

//end sketchProc
}

var canvas = document.getElementById("myCanvas");
	// attaching the sketchProc function to the canvas
	var processingInstance = new Processing(canvas, sketchProc);
	canvas.focus()


//Potential things to add to this game
//make ghost enemy ghost-like
//add images
//add goalbox enemy movement

		// //check wall collision
		// 	for (var j = 0; j < wallArray.length; j++) {
		// 		if (collision(enemies[i], wallArray[j])) {
		// 			if (enemies[i].movement !== "followPlayer") {
		// 				enemies[i].spd  *= -1;
		// 			}
		// 			if (enemies[i].movement === "followPlayer") {
		// 	if (enemies[i].x < player.x) {
		// 		enemies[i].x -= 100;
		// 	} else {
		// 		enemies[i].x += 100;
		// 	}
		// 	if (enemies[i].y < player.y) {
		// 		enemies[i].y -= 100;
		// 	} else {
		// 		enemies[i].y += 100;
		// 	}
		// 			}
		// 		}
		// 	}
