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

let currentRoom = "main";
let lastRoom = null;
let lastDoorChar = null;

let playerSpeed = 0.005;

// Scale of the whole world, to be applied to all objects
// Each unit in the level file will be drawn as these many square pixels
const scale = 30;
const levelWidth = Math.floor(canvasWidth / scale);
const levelHeight = Math.floor(canvasHeight / scale);

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
        this.playerBullets = level.playerBullets;
        levelPuzzle = new Puzzle(canvasWidth, canvasHeight);
    }
    
    moveToLevel(newRoom) {
        lastRoom = currentRoom;
        currentRoom = newRoom;
        this.level = new Level(GAME_LEVELS[currentRoom].layout);

        // Reutilizar el jugador existente
        this.level.player = this.player;

        if (!GAME_LEVELS[currentRoom].statusCompleted) {
            this.level = new Level(GAME_LEVELS[currentRoom].layout);
            this.enemies = this.level.enemies;
            this.actors = this.level.actors;
        } else {
            this.enemies = [];
            this.actors = this.level.actors;
        }

        //Acomodar al enemigo dependiendo de la dirección de entrada
        if (lastRoom && lastDoorChar) { //De donde viene el jugador y la dirección de entrada
            for (let actor of this.level.actors) {
                if (actor.type === "door" && actor.char === lastDoorChar) {
                    //Determina la posición basada en la dirección de entrada
                    if (["<", "=", ">"].includes(lastDoorChar)) { //Puerta derecha en MAIN
                        this.player.position.x = levelWidth -3;
                        this.player.position.y = actor.position.y;
                    } else if (["7", "8", "9"].includes(lastDoorChar)) { //Puerta izquierda en MAIN
                        this.player.position.x = 1;
                        this.player.position.y = actor.position.y;
                    } else if (["1", "2", "3"].includes(lastDoorChar)) { //Puerta arriba en MAIN
                        this.player.position.x = actor.position.x;
                        this.player.position.y = levelHeight - 9;
                    } else if (["4", "5", "6"].includes(lastDoorChar)) { //Puerta abajo en MAIN
                        this.player.position.x = actor.position.x;
                        this.player.position.y = 1;
                    } 
                } 
            } 
        } if (lastRoom !== "main") { //Para regresar al main usamos las coordenadas de entrada ajustadas para que el jugador no se quede pegado a la pared
            this.player.position.x = this.player.entryPoint.x;
            this.player.position.y = this.player.entryPoint.y;
        }
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

        // Evitar que los enemigos se sobrepongan entre sí
        overLapEnemies(this.enemies, currentActors);
        //Verificar si el jugador toca un cable, puerta o pared
        overlapPlayer(this.player, currentActors);


        for (let bullet of this.enemyBullets) {
            bullet.update(this.level, deltaTime);
            if (overlapRectangles(bullet, game.player)){
                game.player.takeDamage(bullet.damage); // Aplica daño al jugador
                bullet.destroy = true; // Destruir la bala al impactar con el jugador
            }
        }

        for (let bullet of this.playerBullets) {
            bullet.update(this.level, deltaTime);
            for (let enemy of this.enemies) {
                if(overlapRectangles(bullet, enemy.hitBox)){
                    enemy.takeDamage(bullet.damage); // Aplica daño al enemigo
                    bullet.destroy = true;
                }
            }
        }

        // Update player stats bars
        drawBar(game.player.hp, game.player.max_hp, 'green', 40, 480);
        drawBar(game.player.shield, game.player.max_shield, 'blue', 40, 510);
        // El método filter devuelve un nuevo arreglo con las balas que no han sido destruidas. Recuperado de: https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
        game.enemyBullets = game.enemyBullets.filter(bullet => !bullet.destroy); // Función filter para borrar las balas que han sido marcadas como destruidas
        game.playerBullets = game.playerBullets.filter(bullet => !bullet.destroy); // Función filter para borrar las balas que han sido marcadas como destruidas
        //Se quitan del array los enemigos que han sido destruidos
        this.enemies = this.enemies.filter(enemy => !enemy.destroyed);
        this.level.enemies = this.enemies; //Actualiza la lista de enemigos en el nivel
        if(currentRoom == "puzzleRoom" && levelPuzzle.puzzleCompleated == true && this.enemies.length == 0) {
            GAME_LEVELS[currentRoom].statusCompleted = true; // Marca el nivel como completado
            this.level.setupDoors(); // Actualiza la puerta
        }
        if (this.enemies.length == 0 && currentRoom != "main" && currentRoom != "puzzleRoom") {
            GAME_LEVELS[currentRoom].statusCompleted = true; // Marca el nivel como completado
            this.level.setupDoors(); // Actualiza la puerta
        }
        
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
        for (let bullet of this.playerBullets) {
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
        objClass: Cable,
        label: "cable",
        sprite: '../assets/sprites/escenarios/cable_suelo.png',
        rect: new Rect(0, 0, 16, 32),
        sheetCols: 2,
        startFrame: [0, 1]
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
    "B": {
        objClass: Boss,
        label: "boss",
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
    game = new Game('playing', new Level(GAME_LEVELS[currentRoom].layout));
    updateCanvas(document.timeline.currentTime);
}

function restartGame() { // Función para reiniciar el juego tras un gameover
    currentRoom = "main"; // Reinicia el nivel a la sala principal
    lastRoom = null; // Reinicia la sala anterior
    for (let level in GAME_LEVELS) {
        GAME_LEVELS[level].statusCompleted = false; // Reinicia el estado de los niveles
    }
    gameStart();    
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
        if (event.key === 'e') game.player.hp+=20; // Usado para las pruebas de daño
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

function overLapEnemies(enemies, actors) {
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
        for (let actor of actors) {
            if (actor.type !== 'floor' && overlapRectangles(enemyA, actor)) {
                if (actor.type === 'wall') {
                    if (enemyA.velocity) { //Si chocca con una pared entonces su velocidad se revierte
                        enemyA.velocity.x *= -1;
                        enemyA.velocity.y *= -1;
                    }
                }
            }
        }
    }
}

function overlapPlayer(player, actors) {
    let isTouchingCable = false;

    for (let actor of actors) {
        if (actor.type !== 'floor' && overlapRectangles(player, actor)) {
            if (actor.type === 'wall') {
                console.log("Hit a wall");
            }

            if (actor.type === 'door') {
                if (!actor.isOpen) {
                    console.log("Puerta cerrada.");
                    return false; // Prevents passing through the door
                }

                const doorChar = actor.char;

                if (currentRoom === "main") {
                    if (["<", "=", ">"].includes(doorChar)) {
                        lastDoorChar = doorChar;
                        player.entryPoint = { x: actor.position.x + 1, y: actor.position.y };
                        game.moveToLevel("robotRoom");
                    } else if (["4", "5", "6"].includes(doorChar)) {
                        lastDoorChar = doorChar;
                        player.entryPoint = { x: actor.position.x, y: actor.position.y - player.size.y };
                        game.moveToLevel("dronRoom");
                    } else if (["7", "8", "9"].includes(doorChar)) {
                        lastDoorChar = doorChar;
                        player.entryPoint = { x: actor.position.x - player.size.x, y: actor.position.y };
                        game.moveToLevel("puzzleRoom");
                    } if (["1", "2", "3"].includes(doorChar)) {
                        if (!areAllRoomsCompleted()) {
                            actor.close();
                            return false;
                        } else {
                            lastDoorChar = doorChar;
                            player.entryPoint = { x: actor.position.x, y: actor.position.y + 1 };
                            game.moveToLevel("BossRoom");
                        }
                    }
                } else {
                    game.moveToLevel("main");
                }
            }

            if (actor.type === 'cable') {
                isTouchingCable = true;

                if (!player.touchedCable) {
                    player.hp -= 5;
                    player.cableDamageTimer = 0;
                    player.touchedCable = true;
                } else if (player.cableDamageTimer >= 3000) {
                    player.hp -= 5;
                    player.cableDamageTimer = 0;
                }
            }
        }
    }

    if (!isTouchingCable) {
        player.touchedCable = false;
    }

    return true;
}

function areAllRoomsCompleted() {
    for (let level in GAME_LEVELS) {
        if (level !== "main" && level !== "BossRoom" && !GAME_LEVELS[level].statusCompleted) {
            return false;
        }
    }
    return true;
}

// Call the start function to initiate the game
main();

    
    

    