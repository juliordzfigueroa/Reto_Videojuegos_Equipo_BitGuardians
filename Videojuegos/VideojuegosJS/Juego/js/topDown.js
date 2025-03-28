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

        // A copy of the full list to iterate over all of them
        // DOES THIS WORK?
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
        }
        this.player.draw(ctx, scale);
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

    // Update time for the next frame
    frameStart = frameTime;
    requestAnimationFrame(updateCanvas);
}

// Call the start function to initiate the game
main();