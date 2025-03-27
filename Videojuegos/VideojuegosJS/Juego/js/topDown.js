/*
 * Simple top down adventure game
 *
 * Gilberto Echeverria
 * 2025-02-05
 */

"use strict";

// Global variables
const canvasWidth = 800;
const canvasHeight = 600;

let ctx;

let frameStart;

let game;
let player;
let level;

let playerSpeed = 0.005;

// Scale of the whole world, to be applied to all objects
// Each unit in the level file will be drawn as these many square pixels
const scale = 29;

class Game {
    constructor(state, level) {
        this.state = state;
        this.level = level;
        this.player = level.player;
        this.actors = level.actors;
        //console.log(level);
    }

    update(deltaTime) {
        this.player.update(this.level, deltaTime);

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
            }
        }
    }

    draw(ctx, scale) {
        for (let actor of this.actors) {
            actor.draw(ctx, scale);
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


// Object with the characters that appear in the level description strings
// and their corresponding objects
const levelChars = {
    // Rect defined as offset from the first tile, and size of the tiles
    ".": {
        objClass: GameObject,
        label: "floor",
        // sprite: '../assets/sprites/ProjectUtumno_full.png',
        // rect: new Rect(12, 17, 32, 32)
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
    "@": {
        objClass: Player,
        label: "player",
        //sprite: '../assets/sprites/blordrough_quartermaster-NESW.png',
        //rect: new Rect(0, 0, 48, 64),
        //sheetCols: 3,
        //startFrame: [7, 7]},
        sprite: '../assets/sprites/cipher/cipher_spritesheet1.png',
        rect: new Rect(0, 0, 32, 57), // Valores para las animaciones de caminar de cipher.
        sheetCols: 10,
        startFrame: [0, 0],
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
    // Register the game object, which creates all other objects
    game = new Game('playing', new Level(GAME_LEVELS[1]));

    setEventListeners();

    // Call the first frame with the current time
    updateCanvas(document.timeline.currentTime);
}

function setEventListeners() {
    window.addEventListener("keydown", event => {
        if (event.key == 'w') {
            game.player.startMovement("up");
        }
        if (event.key == 'a') {
            game.player.startMovement("left");
        }
        if (event.key == 's') {
            game.player.startMovement("down");
        }
        if (event.key == 'd') {
            game.player.startMovement("right");
        }
        if (event.key === 'ArrowUp') {
            game.player.startAttack("up");
        }
        if (event.key === 'ArrowLeft') {
            game.player.startAttack("left");
        }
        if (event.key === 'ArrowDown') {
            game.player.startAttack("down");
        }
        if (event.key === 'ArrowRight') {
            game.player.startAttack("right");
        }
    });

    window.addEventListener("keyup", event => {
        if (event.key == 'w') {
            game.player.stopMovement("up");
        }
        if (event.key == 'a') {
            game.player.stopMovement("left");
        }
        if (event.key == 's') {
            game.player.stopMovement("down");
        }
        if (event.key == 'd') {
            game.player.stopMovement("right");
        }
        if (event.key === 'ArrowUp') {
            game.player.stopAttack("up");
        }
        if (event.key === 'ArrowLeft') {
            game.player.stopAttack("left");
        }
        if (event.key === 'ArrowDown') {
            game.player.stopAttack("down");
        }
        if (event.key === 'ArrowRight') {
            game.player.stopAttack("right");
        }
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
