/*
    topDown.js
    Main file for the top-down game
    BitGuardians
 */

"use strict";

// Global variables
const canvasWidth = 810;
const canvasHeight = 600;

let ctx;

let frameStart;

let game;
let player;
let level;
let enemy;
let currentRoom = "main";

let playerSpeed = 0.005;

// Scale of the whole world, to be applied to all objects
// Each unit in the level file will be drawn as these many square pixels
const scale = 30;


class Game {
    constructor(state, level) {
        this.state = state;
        this.level = level;
        this.player = level.player;
        this.enemies = level.enemies;
        this.actors = level.actors;
        //console.log(level);
    }

    update(deltaTime) {
        this.player.update(this.level, deltaTime);
        for (let enemy of this.enemies) {
            enemy.update(this.level, deltaTime);
        }        
        for (let actor of this.actors) {
            actor.update(this.level, deltaTime);
        }

        let currentActors = this.actors;
        // Detect collisions
        for (let actor of currentActors) {
            if (actor.type != 'floor' && overlapRectangles(this.player, actor)) {
                //console.log(`Collision of ${this.player.type} with ${actor.type}`);
                if (actor.type == 'wall') {
                    console.log("Hit a wall");
                }
                if (actor.type == 'door') {
                    console.log("Hit a door");
                    currentRoom = "robotRoom";
                    gameStart();
                }
            }
        }
    }

    draw(ctx, scale) {
        for (let actor of this.actors) {
            actor.draw(ctx, scale);
        }
        for (let enemy of this.enemies) {
            enemy.draw(ctx, scale);
            enemy.drawHitBox(ctx, scale); // Draw hitbox for debugging
        }
        this.player.draw(ctx, scale);
        this.player.drawHitBox(ctx, scale);
    }
}

function createWallTile(x) {
    //Function to create a wall tile with the specified sprite
    return {
        objClass: GameObject,
        label: "wall",
        sprite: '../assets/sprites/escenarios/wall_tileset.png',
        rect: new Rect(x, 0, 16, 16)
    };
}

function createDoorTile(x, y) {
    //Function to create a wall tile with the specified sprite
    return {
        objClass: GameObject,
        label: "door",
        sprite: '../assets/sprites/escenarios/door_tileset.png',
        rect: new Rect(x, y, 16, 16)
    };
}


// Object with the characters that appear in the level description strings
// and their corresponding objects
const levelChars = {
    // Rect defined as offset from the first tile, and size of the tiles
    ".": {
        objClass: GameObject,
        label: "floor",
        sprite: '../assets/sprites/escenarios/floor_tiles.png',
        rect: new Rect(0, 0, 16, 16)
    },

    //WALLS
    "*": createWallTile(0), // Upper left corner wall
    ":": createWallTile(1), // Upper right
    "#": createWallTile(2), // Vertical
    "/": createWallTile(3), // Lower left
    "$": createWallTile(4), // Lower right
    "&": createWallTile(5), // Horizontal

    //DOORS
    //Upper
    "1": createDoorTile(0, 0),
    "2": createDoorTile(1, 0), 
    "3": createDoorTile(2, 0), 
    //Down
    "4": createDoorTile(0, 5),
    "5": createDoorTile(1, 5),
    "6": createDoorTile(2, 5),
    //Right
    "7": createDoorTile(0, 6),
    "8": createDoorTile(1, 6),
    "9": createDoorTile(2, 6),
    //Left
    ">": createDoorTile(0, 7),
    "=": createDoorTile(1, 7), 
    "<": createDoorTile(2, 7),

    //PLAYER
    "@": {
        objClass: Player,
        label: "player",
        sprite: '../assets/sprites/cipher/cipher_spritesheet2.png',
        rect: new Rect(0, 0, 32, 57), // Valores para las animaciones de caminar de cipher.
        sheetCols: 10,
        startFrame: [0, 0]
    },
    "E": {
        objClass: Enemy,
        label: "enemy",
        sprite: '../assets/sprites/enemigos/robot_assets.png',
        rect: new Rect(0, 0, 41, 61), // Valores para las animaciones de caminar de cipher.
        sheetCols: 10,
        startFrame: [0, 0]
    },
};


function main() {
    // Set a callback for when the page is loaded,
    // so that the canvas can be found
    window.onload = init;
}

function init() {
    const canvas = document.getElementById('canvas');
    //const canvas = document.querySelector('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext('2d');

    gameStart();
}

function gameStart() {
    game = new Game('playing', new Level(GAME_LEVELS[currentRoom]));
    setEventListeners();
    updateCanvas(document.timeline.currentTime);

}

function setEventListeners() {
    window.addEventListener("keydown", event => {
        if (event.key == 'w') game.player.startMovement("up");
        if (event.key == 'a') game.player.startMovement("left");
        if (event.key == 's') game.player.startMovement("down");
        if (event.key == 'd') game.player.startMovement("right");
        if (event.key === 'ArrowUp') game.player.startAttack("up");
        if (event.key === 'ArrowLeft') game.player.startAttack("left");
        if (event.key === 'ArrowDown') game.player.startAttack("down");
        if (event.key === 'ArrowRight') game.player.startAttack("right");
    });

    window.addEventListener("keyup", event => {
        if (event.key == 'w') game.player.stopMovement("up");
        if (event.key == 'a') game.player.stopMovement("left");
        if (event.key == 's') game.player.stopMovement("down");
        if (event.key == 'd') game.player.stopMovement("right");
        if (event.key === 'ArrowUp') game.player.stopAttack("up");
        if (event.key === 'ArrowLeft') game.player.stopAttack("left");
        if (event.key === 'ArrowDown') game.player.stopAttack("down");
        if (event.key === 'ArrowRight') game.player.stopAttack("right");
    });
}

function drawHB() {
    
    const barX = 40;
    const barY = 480 ; // Si tu canvas mide 600 px de alto, esto la coloca cerca del borde
    const barWidth = 200;
    const barHeight = 20;
  
    // Calcula el porcentaje de vida del jugador
    let ratio = game.player.hp / game.player.max_hp;
  
    // Dibuja el fondo de la barra (zona de vida "perdida")
    ctx.fillStyle = "red";
    ctx.fillRect(barX, barY, barWidth, barHeight);
  
    // Dibuja la parte que representa la vida actual
    ctx.fillStyle = "green";
    ctx.fillRect(barX, barY, barWidth * ratio, barHeight);
  
    // Dibuja el borde de la barra
    ctx.strokeStyle = "black";
    ctx.strokeRect(barX, barY, barWidth, barHeight);

    // Pinta el texto de vida
    ctx.font = "16px Arial";       // Ajusta el tipo y tamaño de letra
    ctx.fillStyle = "white";       // Color del texto
    ctx.textAlign = "center";      // Centrado horizontal
    ctx.textBaseline = "middle";   // Centrado vertical
    const textX = barX + barWidth / 2;      // Mitad de la barra
    const textY = barY + barHeight / 2;     // Mitad de la altura de la barra
    ctx.fillText(`${game.player.hp} / ${game.player.max_hp}`, textX, textY);
}

// Function that will be called for the game loop
function updateCanvas(frameTime) {
    if (frameStart === undefined) {
        frameStart = frameTime;
    }
    let deltaTime = frameTime - frameStart;
    //console.log(`Delta Time: ${deltaTime}`);

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    game.update(deltaTime);
    game.draw(ctx, scale);

    drawHB(); // Draw the health bar of the player in the canvas

    // Update time for the next frame
    frameStart = frameTime;
    requestAnimationFrame(updateCanvas);
}

// Call the start function to initiate the game
main();