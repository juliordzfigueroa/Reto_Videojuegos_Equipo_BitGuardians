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
let lastRoom = null;
let lastDoorChar = null;

let playerSpeed = 0.005;

// Scale of the whole world, to be applied to all objects
// Each unit in the level file will be drawn as these many square pixels
const scale = 30;

let puzzleActive = false;
let levelPuzzle; // Puzzle no definido para el nivel

class Game {
    constructor(state, level) {
        this.state = state;
        this.level = level;
        this.player = level.player;
        this.enemies = level.enemies;
        this.actors = level.actors;
        this.enemyBullets = level.enemyBullets;
        this.playerbullets = level.playerbullets;
        levelPuzzle = new Puzzle(canvasWidth, canvasHeight);
        //console.log(level);
    }
    
    moveToLevel(newRoom) {
        lastRoom = currentRoom;
        currentRoom = newRoom;
        this.level = new Level(GAME_LEVELS[currentRoom]);

        // Reutilizar el jugador existente
        this.level.player = this.player;

        // Actualizar enemigos y actores del nuevo nivel
        this.enemies = this.level.enemies;
        this.actors = this.level.actors;

        if (this.level.enemies.length > 0) {
            for (let actor of this.level.actors) {
                if (actor instanceof Door) {
                    actor.close();
                }
            }
        }
        //gameStart();
    }

    update(deltaTime) {
        this.player.update(this.level, deltaTime);
        for (let enemy of this.enemies) {
            enemy.update(this.level, deltaTime);
        }
        for (let actor of this.actors) {
            actor.update(this.level, deltaTime);
        }
        for (let bullet of this.enemyBullets) {
            bullet.update(this.level, deltaTime);
        }

        let currentActors = this.actors;

        // Evitar que los enemigos se sobrepongan entre sí
        overLapEnemies(this.enemies);

        // Detect collisions
        for (let actor of currentActors) {
            if (actor.type != 'floor' && overlapRectangles(this.player, actor)) {
                if (actor.type == 'wall') {
                    console.log("Hit a wall");
                }
                if (actor.type == 'door') {
                    if (!actor.isOpen) {
                        console.log("Puerta cerrada. No puedes salir.");
                        return;
                    }

                    const doorChar = actor.char;

                    // Guardar la posición de la puerta antes de cambiar de nivel
                    this.lastDoorPosition = { x: actor.position.x, y: actor.position.y };

                    if (currentRoom === "main") {
                        if (["<", "=", ">"].includes(doorChar)) {
                            lastDoorChar = doorChar;
                            this.moveToLevel("robotRoom");
                        } else if (["4", "5", "6"].includes(doorChar)) {
                            lastDoorChar = doorChar;
                            this.moveToLevel("dronRoom");
                        } else if (["7", "8", "9"].includes(doorChar)) {
                            lastDoorChar = doorChar;
                            this.moveToLevel("puzzleRoom");
                        }
                    } else {
                        this.player.setExitPosition();
                        lastDoorChar = doorChar;
                        this.moveToLevel("main");
                    }
                }
            }
        }


        // Update player stats bars
        drawBar(game.player.hp, game.player.max_hp, 'green', 40, 480);
        drawBar(game.player.shield, game.player.max_shield, 'blue', 40, 510);
        // El método filter devuelve un nuevo arreglo con las balas que no han sido destruidas. Recuperado de: https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
        game.enemyBullets = game.enemyBullets.filter(bullet => !bullet.destroy); // Función filter para borrar las balas que han sido marcadas como destruidas

        if (game.player.hp <= 0) {
            console.log("Game Over");
            restartGame();
        }
    }

    draw(ctx, scale) {
        for (let actor of this.actors) {
            actor.draw(ctx, scale);
        }
        for (let enemy of this.enemies) {
            enemy.draw(ctx, scale);
            enemy.hitBox.drawHitBox(ctx,scale);
        }
        for (let bullet of this.enemyBullets) {
            bullet.draw(ctx, scale);
        }
        this.player.draw(ctx, scale);
        this.player.hitBox.drawHitBox(ctx, scale);
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

function createDoorTile(x, y, char) {
    //Function to create a wall tile with the specified sprite
    return {
        objClass: Door,
        label: "door",
        rect: new Rect(x, y, 16, 16),
        char: char
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
    "1": createDoorTile(0, 0, "1"),
    "2": createDoorTile(1, 0, "2"),
    "3": createDoorTile(2, 0, "3"),
    //Down
    "4": createDoorTile(0, 1, "4"),
    "5": createDoorTile(1, 1, "5"),
    "6": createDoorTile(2, 1, "6"),
    //Right
    "7": createDoorTile(0, 2, "7"),
    "8": createDoorTile(1, 2, "8"),
    "9": createDoorTile(2, 2, "9"),
    //Left
    ">": createDoorTile(0, 3, ">"),
    "=": createDoorTile(1, 3, "="), 
    "<": createDoorTile(2, 3, "<"),
    //Cables
    "C": {
        objClass: AnimatedObject,
        label: "cable",
        sprite: '../assets/sprites/escenarios/cable_suelo.png',
        rect: new Rect(0, 0, 16, 32)
    },

    //PLAYER
    "@": {
        objClass: Player,
        label: "player",
        sprite: '../assets/sprites/cipher/cipher_spritesheet2.png',
        rect: new Rect(0, 0, 32, 57), // Valores para las animaciones de caminar de cipher.
        sheetCols: 10,
        startFrame: [0, 0]
    },
    //ENEMIES
    "R": {
        objClass: Robot,
        label: "robot",
        sprite: '../assets/sprites/enemigos/robot_assets1.png',
        rect: new Rect(0, 0, 39.6, 42), // Valores para las animaciones del enemigo cuerpo a cuerpo
        sheetCols: 10,
        startFrame: [0, 0]
    },
    "D": {
        objClass: Dron,
        label: "dron",
        sprite: '../assets/sprites/enemigos/dron_assets1.png',
        rect: new Rect(0, 0, 17.6, 19), // Valores para las animaciones del enemigo cuerpo a cuerpo
        sheetCols: 10,
        startFrame: [0, 0]
    },
    "p": {
        objClass: GameObject,
        label: 'puzzle',
        sprite: '../assets/sprites/escenarios/computer_spritesheet.png',  // Valores para el asset de la computadora donde estará el puzzle.
        rect: new Rect(0, 0, 16, 16),
        sheetCols: 2,
        startFrame: [0, 0]
    }
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
    setEventListeners();
    gameStart();
}

function gameStart() {
    game = new Game('playing', new Level(GAME_LEVELS[currentRoom]));
    updateCanvas(document.timeline.currentTime);
}

function restartGame() { // Función para reiniciar el juego tras un gameover
    currentRoom = "main"; // Reinicia el nivel a la sala principal
    lastRoom = null; // Reinicia la sala anterior a null
    game = new Game('playing', new Level(GAME_LEVELS[currentRoom]));
}

function setEventListeners() {
  
    window.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            if (puzzleActive) { // Si el puzzle está activo
                puzzleActive = false;
            }
            return;
        }
        else {
            //pausa el juego si el puzzle no está activo
        }
                
                
        if (event.key === 'f') { // Si el jugador esta cerca del objeto que activa el puzzle.
            if (isPuzzleNear()) {
                if (!puzzleActive){ // Si el puzzle no está activo
                    puzzleActive = true; // Activa el puzzle
                    levelPuzzle.init(); // Inicializa el puzzle
                }
            }
        }
    
        if (event.key === 'r') { // Tecla de reinicio de puzzle o Partida
            if (puzzleActive && levelPuzzle.timeLimit <= 0) {
                levelPuzzle.restart(); // Reinicia el puzzle
            }
            else{
                restartGame(); // Reinicia el juego
            }
        }

        if (event.key === 'w') game.player.startMovement("up");
        if (event.key === 'a') game.player.startMovement("left");
        if (event.key === 's') game.player.startMovement("down");
        if (event.key === 'd') game.player.startMovement("right");
        if (event.key === 'ArrowUp') game.player.startAttack("up");
        if (event.key === 'ArrowLeft') game.player.startAttack("left");
        if (event.key === 'ArrowDown') game.player.startAttack("down");
        if (event.key === 'ArrowRight') game.player.startAttack("right");
        if (event.key === 'e') game.player.takeDamage(20); // Usado para las pruebas de daño
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
  
    const canvas = document.getElementById('canvas');
    canvas.addEventListener("click", (event) => {
        if (puzzleActive == true && levelPuzzle != null) {
            levelPuzzle.mouseControl(event, canvas);
        }
    });
}

function drawBar(stat, max_stat, color, barX, barY){ // Función para dibujar las barras de vida y escudo del jugador.
    
    const barWidth = 200;
    const barHeight = 20;

    if (stat > max_stat)  stat = max_stat;
  
    // Calcula el porcentaje de vida del jugador, usado para saber hasta donde se tiene que llegar la barra de vida.
    let ratio = stat / max_stat;
  
    // Dibuja el fondo de la barra (zona de vida "perdida")
    ctx.fillStyle = "red";
    ctx.fillRect(barX, barY, barWidth, barHeight);

    // Dibuja el borde de la barra
    ctx.strokeStyle = "black";
    ctx.strokeRect(barX, barY, barWidth, barHeight);
  
    // Dibuja la parte que representa la vida actual
    if (stat >= 0 && stat <= max_stat)
    {
        ctx.fillStyle = color;
        ctx.fillRect(barX, barY, barWidth * ratio, barHeight);
        // Pinta el texto de la estadistica
        ctx.font = "16px Arial";       // Ajusta el tipo y tamaño de letra
        ctx.fillStyle = "white";     
        ctx.textAlign = "center";      // Centrado horizontal
        ctx.textBaseline = "middle";   // Centrado vertical
        // Coordenadas X y Y de los números de la barra que se quiera dibujar
        const textX = barX + barWidth / 2;     
        const textY = barY + barHeight / 2;     
        ctx.fillText(`${stat} / ${max_stat}`, textX, textY);
    }
    
}

function drawPuzzleOverlay(ctx) {
   ctx.fillStyle = "rgba(0,0,0,0.8)"; // Dibuja un overlay semitransparente 
   ctx.fillRect(0, 0, canvasWidth, canvasHeight);
   if (puzzleActive) { // Si el puzzle está activo
        levelPuzzle.draw(ctx);
   }
}

function isPuzzleNear() { // Función que verifica si el puzzle está cerca del jugador
  const max_d = 2; // Variable usada como umbral como máxima distancia al puzzle
  for (let actor of game.actors) {
    if (actor.type === "puzzle") {
      let distance = game.player.hitBox.position.distanceTo(actor.position);
      if (distance < max_d) {
        return true;
      }
    }
  }
  return false;
}

// Function that will be called for the game loop
function updateCanvas(frameTime) {
    if (frameStart === undefined) {
        frameStart = frameTime;
    }
    let deltaTime = frameTime - frameStart;
    //console.log(`Delta Time: ${deltaTime}`);

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    if (puzzleActive == true) {
        // Mientras el puzzle esté activo, se muestra el overlay y se desactivan otros controles
        game.draw(ctx, scale);
        drawPuzzleOverlay(ctx);
    } else {  
        game.draw(ctx, scale);  
        game.update(deltaTime);
    }

    // Update time for the next frame
    frameStart = frameTime;
    requestAnimationFrame(updateCanvas);
}

function overLapEnemies(enemies) {
    for (let i = 0; i < enemies.length; i++) {
        const enemyA = enemies[i];

        for (let j = i + 1; j < enemies.length; j++) {
            const enemyB = enemies[j];

            if (overlapRectangles(enemyA, enemyB)) {
                const distanciaX = enemyA.position.x - enemyB.position.x;
                const distanciaY = enemyA.position.y - enemyB.position.y;

                const overlapX = (enemyA.size.x + enemyB.size.x) / 2 - Math.abs(distanciaX);
                const overlapY = (enemyA.size.y + enemyB.size.y) / 2 - Math.abs(distanciaY);

                if (overlapX < overlapY) {
                    const separation = overlapX / 2;
                    if (distanciaX < 0) {
                        enemyA.position.x -= separation;
                        enemyB.position.x += separation;
                    } else {
                        enemyA.position.x += separation;
                        enemyB.position.x -= separation;
                    }
                } else {
                    const separation = overlapY / 2;
                    if (distanciaY < 0) {
                        enemyA.position.y -= separation;
                        enemyB.position.y += separation;
                    } else {
                        enemyA.position.y += separation;
                        enemyB.position.y -= separation;
                    }
                }
            }
        }
    }
}


// Call the start function to initiate the game
main();

    
    

    