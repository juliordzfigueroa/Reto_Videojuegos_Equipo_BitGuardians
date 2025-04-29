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
    
    // Cronómetro 
    let startTime = null; // Tiempo de inicio
    let elapsedTime = 0; // Tiempo transcurrido
    let pauseFrame = null; // Tiempo en el que se pausa el juego
    let pauseTime = 0; // Tiempo de pausa
    
    // Para invertir los controles de ataque y movimiento del jugador
    let invertControls = false; 
    
    let currentMenu = "main"; // Variable que guarda el menú actual
    
    // Para el menú principal
    let mainMenuActive = true;
    let gameimg = new GameObject(); // Crea un objeto para las imagenes que se ocupen en los fondos de los menús
    const mainMenuButtons = [
        new Button(9.5, 12, 8, 2, "Nueva Partida"),
        new Button(4.5, 15, 8, 2, "Opciones"),
        new Button(14.5, 15, 8, 2, "Controles")
    ]; // Arreglo de botones del menú principal
    
    // Para el menú de pausa
    let pauseActive = false; // Booleano creado para pausar el juego
    const pauseOptions = [
        new Button(8.7, 5, 8, 1.5, "Continuar"),
        new Button(8.7, 6.75, 8, 1.5, "Reiniciar"),
        new Button(8.7, 8.5, 8, 1.5, "Controles"),
        new Button(8.7, 10.25, 8, 1.5, "Opciones "),
        new Button(8.7, 12, 8, 1.5, "Salir    ")
    ]; // Arreglo de opciones del menú de pausa
    
    let optionsActive = false; // Booleano creado para pausar el juego
    const optionsButtons = [
        new Button(0.3, 1.5, 8, 2, "<=="),
    ];
    
    let controlsLayout = new GameObject(); // Crea un objeto para el layout de controles
    let controlsActive = false; // Booleano creado para pausar el juego
    const controlsButtons = [
        new Button(0.3, 1.5, 8, 2, "<=="),
        new Button(17.5, 1.5, 8, 2, "Invertir controles"),
    ];
    
    let gameOverActive = false; // Booleano creado para pausar el juego
    const gameOverButtons = [
        new Button(9.5, 12, 8, 2, "Reiniciar"),
        new Button(9.5, 15, 8, 2, "Pantlla de Inicio"),
    ];
    
    const gameClearButtons = [
        new Button(9.5, 12, 8, 2, "Pantlla de Inicio")
    ];
    
    let currentMusic = null; // Variable que guarda la música actual
    
    // Variables usadas para el volúmen de la música y efectos de sonido
    let musicVolume = 0.5;
    let sfxVolume = 0.5;   
    
    // Para debugear las hitboxes de los objetos
    let debugHitBoxes = false; // Variable que indica si se deben dibujar las hitboxes de los objetos

    let statsEnviadas = false; // Variable que indica si se han enviado las estadísticas al servidor
    
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
            this.cLevel = 0; // Variable que guarda los niveles completados de la partida
    
            this.segundosTotales = 0; // Variable que guarda los segundos totales de la partida
            this.minutos = 0; // Variable que guarda los minutos totales de la partida
            this.segundos = 0; // Variable que guarda los segundos totales de la partida
    
            this.enteredBossRoom = false; // Variable que guarda si el jugador ha entrado a la sala del jefe
            this.bossCleared = false; // Variable que guarda si el jefe ha sido derrotado
    
            this.gameEffects = {
                puzzleSuccess: new Audio("../assets/sfx/Sound_Effects/Puzzle_success.wav"),
                puzzleFail: new Audio("../assets/sfx/Sound_Effects/Puzzle_fail.wav"),
                levelComplete: new Audio("../assets/sfx/Sound_Effects/level_cleared.wav"),
                gameOver: new Audio("../assets/sfx/Sound_Effects/game_over.wav"),
                emp: new Audio("../assets/sfx/Sound_Effects/Emp_bomb.wav"),
            };
        }
    
        levelDifficulty() { // Método usado para el aumento de dificultad de los enemigos
            return 1 + (this.cLevel * 0.1); 
        }
        
        moveToLevel(newRoom) {
            // Guarda el nivel previo
            lastRoom = currentRoom; 
            currentRoom = newRoom;
            this.level = new Level(GAME_LEVELS[currentRoom].layout, this.player);
    
            const setEnemiesDif = this.levelDifficulty()
            // Reutilizar el jugador existente
            this.level.player = this.player;
    
            if (!GAME_LEVELS[currentRoom].statusCompleted) {
                this.level = new Level(GAME_LEVELS[currentRoom].layout, this.player);
                this.enemies = this.level.enemies;
                this.actors = this.level.actors;
            } else {
                this.enemies = [];
                this.actors = this.level.actors;
                if (GAME_LEVELS[currentRoom].roomPowerUp) {
                    this.level.levelPowerUps.push(GAME_LEVELS[currentRoom].roomPowerUp);
                }
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
    
        marcarSalaComoCompletada() {
            if (!GAME_LEVELS[currentRoom].statusCompleted) {
                game.player.salasCompletadas += 1;
                GAME_LEVELS[currentRoom].statusCompleted = true;
                console.log("Salas completadas: " + game.player.salasCompletadas);
            }
            this.level.setupDoors();
        }
    
        update(deltaTime) {
            this.player.update(this.level, deltaTime);
    
            if (game.player.isDefeated) { // Si el jugador ha sido derrotado
                if (!this.player.repeat && this.player.frame === this.player.maxFrame) { // Se revisa si ya se terimnó la animación de muerte
                    console.log("Game Over");
                    enviarStats(); // Enviar estadísticas al servidor
                    this.gameEffects.gameOver.play(); // Reproduce el sonido de Game Over
                    gameOverActive = true; // Activa el menú de Game Over
                }
                return;
            }
    
            for (let enemy of this.enemies) {
                enemy.update(this.level, deltaTime);
            }
            for (let actor of this.actors) {
                actor.update(this.level, deltaTime);
            }
    
            let currentActors = this.actors;
    
            // Evitar que los enemigos se sobrepongan entre sí
            overLapEnemies(this.enemies, currentActors);
            // Verificar si el jugador toca un cable, puerta o pared
            overlapPlayer(this.player, currentActors);
    
    
            for (let bullet of this.enemyBullets) {
                bullet.update(this.level, deltaTime);
                if (overlapRectangles(bullet, this.player)){
                    this.player.takeDamage(bullet.damage); // Aplica daño al jugador
                    bullet.destroy = true; // Destruir la bala al impactar con el jugador
                }
                if (this.player.weapon.wtype === "sword" && this.player.currentAttackHitbox){ // Para que la espada pueda romper las balas de los drones
                    if (overlapRectangles(bullet, this.player.currentAttackHitbox))
                    {
                        bullet.destroy = true; // Destruir la bala al impactar con el ataque del jugador
                    }
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
    
            for (let i = this.level.levelPowerUps.length - 1; i >= 0; i--) {
                let powerup = this.level.levelPowerUps[i];
                if (overlapRectangles(powerup, this.player)) {
                    if (powerup.type !== "empBomb" || powerup.type !== "levelPass") { // Si el powerup no es una bomba EMP o un pase de nivel
                        this.player.powerUpsUtilizados += 1; // Aumenta el contador de powerups usados
                    }
                    this.player.powerupEffect(powerup); // Aplica el efecto del powerup al jugador
                    break;
                }
            }
    
            this.segundosTotales = Math.floor(elapsedTime / 1000);
            this.minutos = Math.floor(this.segundosTotales / 60);
            this.segundos = this.segundosTotales % 60;
    
            if (this.minutos < 10) this.minutos = "0" + this.minutos;
            if (this.segundos < 10) this.segundos = "0" + this.segundos;
            
            // El método filter devuelve un nuevo arreglo con las balas que no han sido destruidas. Recuperado de: https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
            this.enemyBullets = this.enemyBullets.filter(bullet => !bullet.destroy); // Función filter para borrar las balas que han sido marcadas como destruidas
            this.playerBullets = this.playerBullets.filter(bullet => !bullet.destroy); // Función filter para borrar las balas que han sido marcadas como destruidas
            //Se quitan del array los enemigos que han sido destruidos
            this.enemies = this.enemies.filter(enemy => !enemy.destroyed);
            this.level.levelPowerUps = this.level.levelPowerUps.filter(powerup => !powerup.isCollected); // Se quitan del array los powerups que han sido recogidos
    
            this.level.enemies = this.enemies; //Actualiza la lista de enemigos en el nivel
            if(currentRoom == "puzzleRoom" && levelPuzzle.puzzleCompleated == true && this.enemies.length == 0) {
                if (!GAME_LEVELS[currentRoom].puzzleCounted) {
                    game.player.puzzlesResueltos += 1; // Se aumenta en uno la cuenta de puzzles resueltos
                    console.log("puzzles resueltos: " + game.player.puzzlesResueltos);
                    GAME_LEVELS[currentRoom].puzzleCounted = true;
                }
                this.marcarSalaComoCompletada(); // Marca la sala como completada si el puzzle se ha completado y no hay enemigos
            }
            
            if (this.enemies.length == 0 && currentRoom != "main" && currentRoom != "puzzleRoom") {
                this.marcarSalaComoCompletada(); // Marca la sala como completada si no hay enemigos
            }
            
    
            if (GAME_LEVELS[currentRoom].statusCompleted == true && currentRoom != "BossRoom" && currentRoom != "secondLevel") {
                if (!GAME_LEVELS[currentRoom].powerupSpawned) { 
                    let powerup = getRandomPowerUp();
                    powerup.position = new Vec(Math.floor(levelWidth / 2), Math.floor(levelHeight / 2));
                    this.level.levelPowerUps.push(powerup);
                    GAME_LEVELS[currentRoom].powerupSpawned = true;
                    GAME_LEVELS[currentRoom].roomPowerUp = powerup; // Guarda el powerup en el nivel
                }
            }
    
            if (currentRoom == "BossRoom") {
                if (!this.enteredBossRoom){
                    currentMusic.pause(); // Pausa la música actual
                    currentMusic = new Audio("../assets/sfx/music/UndertaleOST_009_Enemy_Approaching.mp3"); // Cambia la música al entrar a la sala del jefe
                    currentMusic.loop = true; // Repite la música
                    currentMusic.play(); // Reproduce la música
                    this.enteredBossRoom = true; // Cambia el estado de la sala del jefe a verdadero
                }
                if (GAME_LEVELS[currentRoom].statusCompleted === true) {
                    currentMusic.pause(); // Pausa la música actual
                    if (!this.bossCleared){
                        this.gameEffects.levelComplete.play(); // Reproduce el sonido de nivel completado
                        game.player.jefesDerrotados++; // Se aumenta en uno la cuenta
                        let passLevel = new LevelPass("orange", 30, 30, 0, 0, "levelPass", "NONE") // Crea un objeto para el nivel completado
                        passLevel.position = new Vec(Math.floor(levelWidth / 2), Math.floor(levelHeight / 2))
                        this.level.levelPowerUps.push(passLevel); // Agrega el objeto al nivel
                        this.bossCleared = true; 
                        GAME_LEVELS[currentRoom].powerupSpawned = true;
                        GAME_LEVELS[currentRoom].roomPowerUp = passLevel; // Guarda el powerup en el nivel
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
                //console.log(enemy.hp, enemy.damage); // Imprime la vida y el daño del enemigo
                if (debugHitBoxes) {
                    enemy.hitBox.drawHitBox(ctx,scale);
                }
            }
            for (let bullet of this.enemyBullets) {
                bullet.draw(ctx, scale);
            }
            for (let bullet of this.playerBullets) {
                bullet.draw(ctx, scale);
            }
            for (let powerUp of this.level.levelPowerUps) {
                powerUp.draw(ctx, scale);
            }
            this.player.draw(ctx, scale);
            if (debugHitBoxes) {
                this.player.hitBox.drawHitBox(ctx, scale); // Dibuja el hitbox del jugador
                this.player.footHB.drawHitBox(ctx, scale); // Dibuja el hitbox de los pies del jugador
            }
            drawHUD(ctx, this.player, scale); // Dibuja el HUD del jugador
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
    
    
    // Object with the characters that appear in the level description strings and their corresponding objects
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
            rectParams: [0, 0, 39.6, 42], // Valores para las animaciones del enemigo cuerpo a cuerpo
            sheetCols: 10,
            startFrame: [0, 0]
        },
        "B": {
            objClass: Boss,
            label: "boss",
            sprite: '../assets/sprites/enemigos/robot_assets1.png',
            rectParams: [0, 0, 39.6, 42], // Valores para las animaciones del enemigo cuerpo a cuerpo
            sheetCols: 10,
            startFrame: [0, 0]
        },
        "D": {
            objClass: Dron,
            label: "dron",
            sprite: '../assets/sprites/enemigos/dron_assets1.png',
            rectParams: [0, 0, 17.6, 19], // Valores para las animaciones del enemigo cuerpo a cuerpo
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
        window.onload = init;
    }
    
    function activarMusica() {
        if (currentMusic) { // Si hay música actual o el menú es el principal
            currentMusic.pause(); // Pausa la música actual
            currentMusic.currentTime = 0; // Reinicia el tiempo de la música
        }
        const gameBGMusic = [// Objeto que contiene la música de fondo del juego
            new Audio("../assets/sfx/music/UndertaleOST_051_AnotherMedium.mp3"),
            new Audio("../assets/sfx/music/UndertaleOST_065_CORE.mp3"),
        ]
    
        const randomIndex = Math.floor(Math.random() * gameBGMusic.length);
        currentMusic = gameBGMusic[randomIndex];
        currentMusic.loop = true;
        currentMusic.volume = 0.2;
        currentMusic.play();
    }
    
    function init() {
        const canvas = document.getElementById('canvas');
        //const canvas = document.querySelector('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        ctx = canvas.getContext('2d');
        setEventListeners();
    
        requestAnimationFrame(updateCanvas);
    }
    
    function gameStart() {
        activarMusica(); // Activa la música de fondo
        game = new Game('playing', new Level(GAME_LEVELS[currentRoom].layout));
        startTime = performance.now(); // Guarda el tiempo de inicio
        updateCanvas(document.timeline.currentTime);
    }
    
    function restartGame() {
        currentRoom = "main";
        lastRoom = null;
        lastDoorChar = null;
        // Reiniciamos los cuartos de cada nivel
        resetRoomStats();
        activarMusica(); // Reinicia la musica
        if (game.gameEffects.levelPass){
            game.gameEffects.levelPass.pause(); // Pausa la música actual
            game.gameEffects.levelPass.currentTime = 0; // Reinicia el tiempo de la música
        }
        // Reiniciamos el juego creando un objeto nuevo de la clase GAME
        game = new Game('playing', new Level(GAME_LEVELS[currentRoom].layout));
        // Reiniciamos el tiempo
        startTime = performance.now(); // Guarda el tiempo de inicio
        elapsedTime = 0; // Reinicia el tiempo transcurrido
    }
    
    function setEventListeners() {
        window.addEventListener("keydown", event => {
            // Teclado
    
            if (event.key === "Escape") {
                if (puzzleActive){ // Si el puzzle está activo
                    puzzleActive = false;
                }
                else if (pauseActive){
                    pauseActive = false; // Desactiva el menú de pausa
                }
                else if (optionsActive){
                    optionsActive = false; // Desactiva el menú de opciones
                    if (currentMenu === "main") {
                        mainMenuActive = true; // Activa el menú principal
                        drawMainMenu(ctx); // Dibuja el menú principal
                    }
                    else if (currentMenu === "pause") {
                        pauseActive = true; // Activa el menú de pausa
                        drawPauseMenu(ctx); // Dibuja el menú de pausa
                    }
                }
                else if (controlsActive){
                    controlsActive = false; // Desactiva el menú de controles
                    if (currentMenu === "main") {
                        mainMenuActive = true; // Activa el menú principal
                        drawMainMenu(ctx); // Dibuja el menú principal
                    }
                    else if (currentMenu === "pause") {
                        pauseActive = true; // Activa el menú de pausa
                        drawPauseMenu(ctx); // Dibuja el menú de pausa
                    }
                }
                else {
                    pauseActive = true; // Activa el menú de pausa
                }
                return;
            }
    
            if (puzzleActive) return;
                    
            if (event.key === 'f' || event.key === 'F') { // Si el jugador esta cerca del objeto que activa el puzzle.
                if (isPuzzleNear()) {
                    if (!puzzleActive){ // Si el puzzle no está activo
                        puzzleActive = true; // Activa el puzzle
                        levelPuzzle.init(); // Inicializa el puzzle
                    }
                }
            }
        
            if (event.key === 'r' || event.key === 'R') { // Tecla de reinicio de puzzle o Partida
                if (puzzleActive && levelPuzzle.timeLimit <= 0) {
                    levelPuzzle.restart(); // Reinicia el puzzle
                }
                else{
                    restartGame(); // Reinicia el juego
                }
            }
    
            if (event.key === 'h' || event.key === 'H') { // Tecla que hace que se muestren las hitboxes de los objetos
                debugHitBoxes = !debugHitBoxes; // Cambia el estado de la variable
            }
    
            if (event.key === 'e' || event.key === 'E') {
                if (game.player.hasEMP) {
                    game.gameEffects.emp.currentTime = 0; // Reinicia el tiempo de la música}
                    game.gameEffects.emp.play(); // Reproduce el sonido
                    for (let enemy of game.enemies) {
                        enemy.stunTime = stunDuration;
                        enemy.state = "stunned"; // Cambia el estado del enemigo a aturdido
                    }
                    game.player.hasEMP = false; // Marca como usado la bombaEMP
                    //Solo se aumenta el contador hasta que se use
                    game.player.powerUpsUtilizados += 1; // Aumenta el contador de powerups usados
                }
            }
            if (invertControls) { // Si los controles están invertidos
                if (event.key === 'w' || event.key === 'W') game.player.startAttack("up");
                if (event.key === 'a' || event.key === 'A') game.player.startAttack("left");
                if (event.key === 's' || event.key === 'S') game.player.startAttack("down");
                if (event.key === 'd' || event.key === 'D') game.player.startAttack("right");
                if (event.key === 'ArrowUp') game.player.startMovement("up");
                if (event.key === 'ArrowLeft') game.player.startMovement("left");
                if (event.key === 'ArrowDown') game.player.startMovement("down");
                if (event.key === 'ArrowRight') game.player.startMovement("right");
            }
            else{
                if (event.key === 'w' || event.key === 'W') game.player.startMovement("up");
                if (event.key === 'a' || event.key === 'A') game.player.startMovement("left");
                if (event.key === 's' || event.key === 'S') game.player.startMovement("down");
                if (event.key === 'd' || event.key === 'D') game.player.startMovement("right");
                if (event.key === 'ArrowUp') game.player.startAttack("up");
                if (event.key === 'ArrowLeft') game.player.startAttack("left");
                if (event.key === 'ArrowDown') game.player.startAttack("down");
                if (event.key === 'ArrowRight') game.player.startAttack("right");
            }
        });
    
        window.addEventListener("keyup", event => {
            if (invertControls){ // Si los controles están invertidos
                if (event.key === 'w' || event.key === 'W') game.player.stopAttack("up");
                if (event.key === 'a' || event.key === 'A') game.player.stopAttack("left");
                if (event.key === 's' || event.key === 'S') game.player.stopAttack("down");
                if (event.key === 'd' || event.key === 'D') game.player.stopAttack("right");
                if (event.key === 'ArrowUp') game.player.stopMovement("up");
                if (event.key === 'ArrowLeft') game.player.stopMovement("left");
                if (event.key === 'ArrowDown') game.player.stopMovement("down");
                if (event.key === 'ArrowRight') game.player.stopMovement("right");
            }
            else{
                if (event.key === 'w' || event.key === 'W') game.player.stopMovement("up");
                if (event.key === 'a' || event.key === 'A') game.player.stopMovement("left");
                if (event.key === 's' || event.key === 'S') game.player.stopMovement("down");
                if (event.key === 'd' || event.key === 'D') game.player.stopMovement("right");
                if (event.key === 'ArrowUp') game.player.stopAttack("up");
                if (event.key === 'ArrowLeft') game.player.stopAttack("left");
                if (event.key === 'ArrowDown') game.player.stopAttack("down");
                if (event.key === 'ArrowRight') game.player.stopAttack("right");
            }
        });
      
        const canvas = document.getElementById('canvas');
        canvas.addEventListener("mousemove", event => {
            // Aspecto visual para cuando el mouse está sobre el botón
            const rect = canvas.getBoundingClientRect();
            const mx = (event.clientX - rect.left) / scale;
            const my = (event.clientY - rect.top) / scale;
            
            if (mainMenuActive) {
                for (let boton of mainMenuButtons) {
                    boton.isOnButton(mx, my); // Verifica si el mouse está sobre el botón
                }
            }
            if (pauseActive) {
                for (let boton of pauseOptions) {
                    boton.isOnButton(mx, my); // Verifica si el mouse está sobre el botón
                }
            }
            if (optionsActive) {
                for (let boton of optionsButtons) {
                    boton.isOnButton(mx, my); // Verifica si el mouse está sobre el botón
                }
            }
            if (controlsActive) {
                for (let boton of controlsButtons) {
                    boton.isOnButton(mx, my); // Verifica si el mouse está sobre el botón
                }
            }
            if (gameOverActive) {
                for (let boton of gameOverButtons) {
                    boton.isOnButton(mx, my); // Verifica si el mouse está sobre el botón
                }
            }

            if (game.cLevel === 1){
                for (let boton of gameClearButtons) {
                    boton.isOnButton(mx, my); // Verifica si el mouse está sobre el botón
                }
            }
          });
        canvas.addEventListener("click", (event) => {
            // Obtener las coordenadas del clic en el canvas para el manejo de los menus y del overlay del puzzle
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
    
            const mXScale = mouseX / scale; // Coordenada X del mouse escalada
            const mYScale = mouseY / scale; // Coordenada Y del mouse escalada
    
            if (mainMenuActive) {
                for (let boton of mainMenuButtons) {
                    if (boton.click(mXScale, mYScale)) { // Verifica si el mouse está sobre el botón
                        if (boton.textString === "Nueva Partida") {
                            mainMenuActive = false;
                            currentMenu = "pause";
                            gameStart();
                        }
                        if (boton.textString === "Opciones") {
                            mainMenuActive = false; // Desactiva el menú principal
                            optionsActive = true; // Activa el menú de opciones
                            drawOptionsMenu(ctx);
                        }
                        if (boton.textString === "Controles") {
                            mainMenuActive = false; // Desactiva el menú principal
                            controlsActive = true; // Activa el menú de controles
                            drawControlsLayout(ctx); // Dibuja el layout de controles
                        }
                      break;
                    }
                }
            }
            if (pauseActive){
                for (let boton of pauseOptions) {
                    if (boton.click(mXScale, mYScale)) {
                        if (boton.textString === "Continuar") {
                            pauseActive = false; // Desactiva el menú de pausa
                        }
                        if (boton.textString === "Reiniciar") {
                            pauseActive = false; // Desactiva el menú de pausa
                            restartGame(); // Reinicia el juego
                        }
                        if (boton.textString === "Controles") {
                            pauseActive = false; // Desactiva el menú de pausa
                            controlsActive = true; // Activa el menú de controles
                            drawControlsLayout(ctx); // Dibuja el layout de controles
                        }
                        if (boton.textString === "Opciones ") {
                            pauseActive = false; // Desactiva el menú de pausa
                            optionsActive = true; // Activa el menú de opciones
                            drawOptionsMenu(ctx);
                        }
                        if (boton.textString === "Salir    ") {
                            currentMusic.pause(); // Pausa la música actual
                            mainMenuActive = true; // Activa el menú principal
                            pauseActive = false; // Desactiva el menú de pausa
                            currentMenu = "main"; // Cambia el menú actual a "main"
                            drawMainMenu(ctx); // Dibuja el menú principal
                        }
                        break;
                    }
                }
            }
    
            if (optionsActive) {
                for (let boton of optionsButtons) {
                    if (boton.click(mXScale, mYScale)) {
                        if (boton.textString === "<==") {
                            optionsActive = false; // Desactiva el menú de opciones
                            if (currentMenu === "main") {
                                mainMenuActive = true; // Activa el menú principal
                                drawMainMenu(ctx); // Dibuja el menú principal
                            }
                            if (currentMenu === "pause") {
                                pauseActive = true; // Activa el menú de pausa
                                drawPauseMenu(ctx); // Dibuja el menú de pausa
                            }
                        }
                        break;
                    }
                }
                musicVolumeC(mouseX, mouseY); // Llama a la función para cambiar el volumen de la música
                sfxVolumeC(mouseX, mouseY); // Llama a la función para cambiar el volumen de los efectos de sonido
            }
    
            if (controlsActive) {
                for (let boton of controlsButtons) {
                    if (boton.click(mXScale, mYScale)) {
                        if (boton.textString === "<==") {
                            controlsActive = false; // Desactiva el menú de controles
                            if (currentMenu === "main") {
                                mainMenuActive = true; // Activa el menú principal
                                drawMainMenu(ctx); // Dibuja el menú principal
                            }
                            if (currentMenu === "pause") {
                                pauseActive = true; // Activa el menú de pausa
                                drawPauseMenu(ctx); // Dibuja el menú de pausa
                            }
                        }
                        if (boton.textString === "Invertir controles") {
                            invertControls = !invertControls; // Cambia el estado de los controles invertidos
                        }
                        break;
                    }
                }
            }
            if (gameOverActive) {
                for (let boton of gameOverButtons) {
                    if (boton.click(mXScale, mYScale)) {
                        if (boton.textString === "Reiniciar") {
                            gameOverActive = false; // Desactiva el menú de Game Over
                            restartGame(); // Reinicia el juego
                        }
                        if (boton.textString === "Pantlla de Inicio") {
                            currentMusic.pause(); // Pausa la música actual
                            gameOverActive = false; // Desactiva el menú de Game Over
                            mainMenuActive = true; // Activa el menú principal
                            currentMenu = "main"; // Cambia el menú actual a "main"
                            drawMainMenu(ctx); // Dibuja el menú principal
                        }
                        restartGame(); // Reinicia el juego
                        break;
                    }
                }
            }
            if (game.cLevel === 1){
                for (let boton of gameClearButtons) {
                    if (boton.click(mXScale, mYScale)) {
                        if (boton.textString === "Pantlla de Inicio") {
                            currentMusic.pause(); // Pausa la música actual
                            gameOverActive = false; // Desactiva el menú de Game Over
                            mainMenuActive = true; // Activa el menú principal
                            currentMenu = "main"; // Cambia el menú actual a "main"
                            drawMainMenu(ctx); // Dibuja el menú principal
                        }
                        break;
                    }
                }
            }
    
            if (puzzleActive == true && levelPuzzle != null) { // Si el puzzle está activo y existe
                levelPuzzle.mouseControl(event, canvas, mouseX, mouseY); // Llama a la función de control del mouse del puzzle
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
    
    function drawHUD(ctx, player, scale) { // Función que dibuja el las armas y las estadiscas del jugador en tiempo real.
        const currentWeaponX = canvasWidth - 270;
        const currentWeaponY = 470;
        // Variables usadas para los marcos de las armas y la bomba EMP
        ctx.lineWidth = 3;
        ctx.strokeStyle = "grey";
        ctx.strokeRect(currentWeaponX, currentWeaponY, 100, 100);
        ctx.strokeRect(currentWeaponX + 120, currentWeaponY, 100, 100);
        drawBar(game.player.hp, game.player.max_hp, 'green', 60, 500);
        drawBar(game.player.shield, game.player.max_shield, 'blue', 60, 530);
        if (player.weapon) {
          if (player.weapon.spriteImage && player.weapon.spriteRect) {
            ctx.drawImage(player.weapon.spriteImage, currentWeaponX, currentWeaponY, 100, 100);
          } 
        }
        if (player.hasEMP && player.emp) {
            ctx.drawImage(player.emp.spriteImage, currentWeaponX + 120, currentWeaponY, 100, 100);
        }
    
        ctx.font = "30px monospace";
        ctx.fillStyle = "#00ff1B";
        ctx.textAlign = "center";
        ctx.fillText("Tiempo", canvasWidth / 2, 500); 
        ctx.fillText(`${game.minutos}:${game.segundos}`, canvasWidth / 2, 540); // Muestra el tiempo transcurrido en el juego
    }
    
    function drawPuzzleOverlay(ctx) { // Dibuja el overlay del puzzle cuando sea activado 
       ctx.fillStyle = "rgba(0, 0, 0, 0.8)"; // Dibuja un overlay semitransparente 
       ctx.fillRect(0, 0, canvasWidth, canvasHeight);
       if (puzzleActive) { // Si el puzzle está activo
            levelPuzzle.draw(ctx);
       }
    }
    
    function drawPauseMenu(ctx) { // Dibuja el menú de pausa
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)"; // Dibuja un overlay semitransparente 
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
        gameimg.position = new Vec(6, 2.5);
        gameimg.size     = new Vec(15, 15);
        gameimg.setSprite('../images/computadorapausa.png');
        
        gameimg.draw(ctx, scale); 
    
        ctx.font = "32px monospace";
        ctx.fillStyle = "#00ff1B";
        ctx.textAlign = "center";
        ctx.fillText("PAUSA", canvasWidth / 2, 60);
    
        ctx.font = "24px monospace";
        for (let boton of pauseOptions) {
            boton.bg = "rgba(0, 0, 0, 0.1)";
            boton.textLabel.font = "24px monospace";
            boton.textLabel.color = "#00ff1B";
            boton.draw(ctx, scale, boton.textLabel.color, "#222", "right"); // Dibuja los botones del menú de pausa
        }
    }
    
    let backgroundMenu = document.createElement("video");
    backgroundMenu.src = "../images/hackercode.mp4";
    
    function drawMainMenu(ctx) { // Dibuja el menú principal
        ctx.drawImage(backgroundMenu, 0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
        backgroundMenu.muted = true;
        backgroundMenu.loop = true;
        backgroundMenu.play();
        
        gameimg.position = new Vec(9.3, 2);
        gameimg.size     = new Vec(9, 9);
        gameimg.setSprite('../images/logopantallainicio.png');
        
        gameimg.draw(ctx, scale); // Dibuja el logo del juego
        for (let boton of mainMenuButtons) {
            boton.bg = "#222";
            boton.textLabel.font = "bold 27px monospace";
            boton.textLabel.color = "cyan";
            boton.draw(ctx, scale, boton.textLabel.color, "#222"); // Dibuja los botones del menú principal
        }
    }
    
    function drawVolumeBar(ctx, x, y, width, value) {
        ctx.fillStyle = "gray";
        ctx.fillRect(x, y, width, 10);
    
        let cuadrito = x + value * width - 5;
    
        ctx.fillStyle = "white";
        ctx.fillRect(cuadrito, y - 5, 10, 20);
    }
    
    function drawOptionsMenu(ctx) { // Dibuja el menú de opciones
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
        gameimg.position = new Vec(6, 3.1);
        gameimg.size     = new Vec(16, 16);
        gameimg.setSprite('../images/computadorapausa.png');
        
        gameimg.draw(ctx, scale); 
    
        ctx.font = "32px monospace";
        if (currentMenu === "main"){
            ctx.fillStyle = "cyan";
        }
        else if (currentMenu === "pause"){
            ctx.fillStyle = "#00ff1B";
        }
        ctx.textAlign = "center";
        ctx.fillText("Música", 425, 200); 
        ctx.fillText("Efectos de sonido", 425, 375); 
        ctx.fillText("Opciones", canvasWidth / 2, 60); // Muestra el texto de opciones
    
        drawVolumeBar(ctx, 275, 250, 300, musicVolume)
        drawVolumeBar(ctx, 275, 425, 300, sfxVolume)
    
        ctx.font = "24px monospace";
        for (let boton of optionsButtons) {
            boton.bg = "rgba(0, 0, 0, 0.1)";
            boton.textLabel.font = "24px monospace";
            if (currentMenu === "main"){
                boton.textLabel.color = "cyan";
            }
            else if (currentMenu === "pause"){
                boton.textLabel.color = "#00ff1B";
            }
            boton.draw(ctx, scale, boton.textLabel.color, "#222"); // Dibuja los botones del menú de opciones
        }
    }
    
    function musicVolumeC(mX, mY){ // Cambia el volumen de la música
        if (mY >= 220 && mY <= 260) { 
            musicVolume = (mX - 275) / 300; // Calcula el volumen de la música en función del tamaño completo del canvas
            if (musicVolume < 0) {
                musicVolume = 0;
            }
            if (musicVolume > 1) {
                musicVolume = 1;
            }
            if (currentMusic) {
                currentMusic.volume = musicVolume;
            }
        }
    }
    
    function sfxVolumeC(mX, mY){
        if (mY >= 395 && mY <= 435) { 
            sfxVolume = (mX - 275) / 300; // Calcula el volumen de los efectos de sonido en función del tamaño completo del canvas
            if (sfxVolume < 0) {
                sfxVolume = 0;
            }    
            if (sfxVolume > 1) {
                sfxVolume = 1;
            }
        }
        for (let psound in game.player.sfx) {
            game.player.sfx[psound].volume = sfxVolume;
        }
         for (let effect in game.gameEffects) {
            game.gameEffects[effect].volume = sfxVolume;
        }
        for (let enemy of game.enemies) {
            for (let sound in enemy.sfx) {
                enemy.sfx[sound].volume = sfxVolume;
            }
        }
    }
    
    function drawControlsLayout(ctx) { // Dibuja el menú de controles
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)"; // Dibuja un overlay semitransparente
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
        controlsLayout.position = new Vec(-4, 0);
        controlsLayout.size     = new Vec(35, 25);
        controlsLayout.setSprite('../assets/sprites/escenarios/ControlesLayOut.png');
        controlsLayout.draw(ctx, scale); // Dibuja el layout de controles
    
        ctx.font = "32px monospace";
        if (currentMenu === "main"){
            ctx.fillStyle = "cyan";
        }
        else if (currentMenu === "pause"){
            ctx.fillStyle = "#00ff1B";
        }
        ctx.textAlign = "center";
        ctx.fillText("CONTROLES", canvasWidth / 2, 60);
    
        if (invertControls) {
            ctx.fillText("Atacar", 225, 165); // Muestra el texto de controles invertidos
            ctx.fillText("Moverse", 600, 165); // Muestra el texto de controles invertidos
        }
        else {
            ctx.fillText("Moverse", 225, 165); // Muestra el texto de controles normales
            ctx.fillText("Atacar", 600, 165); // Muestra el texto de controles invertidos
        }
        ctx.fillText("Interactuar", 215, 450); // Muestra el texto de controles invertidos
        ctx.fillText("Reiniciar", 415, 450); // Muestra el texto de controles invertidos
        ctx.fillText("Bomba EMP", 600, 450); // Muestra el texto de controles invertidos
    
        for (let boton of controlsButtons) {
            boton.bg = "rgba(0, 0, 0, 0.1)";
            boton.textLabel.font = "24px monospace";
            if (currentMenu === "main"){
                boton.textLabel.color = "cyan";
            }
            else if (currentMenu === "pause"){
                boton.textLabel.color = "#00ff1B";
            }
            boton.draw(ctx, scale, boton.textLabel.color, "#222"); // Dibuja los botones del menú de controles
        }
    }
    
    function drawGameOver(ctx){
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)"; // Dibuja un overlay semitransparente
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
        ctx.font = "32px monospace";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvasWidth / 2, 220);
    
        for (let boton of gameOverButtons) {
            boton.bg = "rgba(0, 0, 0, 0.1)";
            boton.textLabel.font = "24px monospace";
            boton.textLabel.color = "cyan";
            boton.draw(ctx, scale, boton.textLabel.color, "#222"); // Dibuja los botones del menú de controles
        }
    }
    
    function drawWinMenu(ctx) { // Dibuja el menú de victoria
        //enviarStats();
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)"; // Dibuja un overlay semitransparente
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
        ctx.font = "32px monospace";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("WINNER", canvasWidth / 2, 60);
        for (let boton of gameClearButtons) {
            boton.bg = "rgba(0, 0, 0, 0.1)";
            boton.textLabel.font = "24px monospace";
            boton.textLabel.color = "cyan";
            boton.draw(ctx, scale, boton.textLabel.color, "#222"); // Dibuja los botones del menú de controles
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
        if (pauseActive) {
            if (pauseFrame === null) {
                pauseFrame = frameTime; // Tiempo en el que se inicia la pausa
            }
        } else {
            if (pauseFrame !== null) {
                pauseTime += frameTime - pauseFrame;
                pauseFrame = null;
            }
        }
        elapsedTime = frameTime - startTime - pauseTime; // Calcula el tiempo transcurrido desde el inicio del juego
        if (mainMenuActive) {
            drawMainMenu(ctx);
        }
        else if (optionsActive) {
            if  (currentMenu === "pause") {
                game.draw(ctx, scale); // Dibuja el juego en pausa
            }
            drawOptionsMenu(ctx);
        }
        else if (controlsActive) {
            if  (currentMenu === "pause") {
                game.draw(ctx, scale); // Dibuja el juego en pausa
            }
            drawControlsLayout(ctx);
        }
        else if (gameOverActive) { // Si el jugador ha muerto
            currentMusic.pause(); // Pausa la música actual
            drawGameOver(ctx); // Dibuja el menú de Game Over
        }
        else if (game.cLevel === 1){ //Cuando acabe el tercer nivel
            drawWinMenu(ctx); // Dibuja el menú de victoria
            if (!statsEnviadas) {
                game.player.partidasGanadas += 1; // Se aumenta en uno la cuenta de partidas ganadas
                game.player.partidasJugadas += 1; // Se aumenta en uno la cuenta de partidas jugadas
                enviarStats(); // Enviar estadísticas al servidor
                statsEnviadas = true; // Cambia el estado de las estadísticas enviadas a verdadero
            }
        }
        else{
            if (frameStart === undefined) {
                frameStart = frameTime;
            }
            let deltaTime = frameTime - frameStart;
        
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        
            if (puzzleActive) {
                // Mientras el puzzle esté activo, se muestra el overlay y se desactivan otros controles
                game.draw(ctx, scale);
                drawPuzzleOverlay(ctx);
            } 
            else if (pauseActive) { // Si el juego está en pausa
                game.draw(ctx, scale);
                drawPauseMenu(ctx);
            }
            else {  
                game.draw(ctx, scale);  
                game.update(deltaTime);
            }
        
            // Update time for the next frame
            frameStart = frameTime;
        }
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
                    if (enemyA.type === "dron") { // Si los enemigos tienen velocidad, se invierte la dirección
                        enemyA.direction *= -1;
                    }
                    if (enemyB.type === "dron") { // Si los enemigos tienen velocidad, se invierte la dirección
                        enemyB.direction *= -1;
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
                    if (actor.type === 'door') { // Si los enemigos chocan con una puerta
                        enemyA.velocity.x *= -1;
                        enemyA.velocity.y *= -1;
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
            }
            if (actor.type === 'cable' && overlapRectangles(game.player.footHB, actor)) { // Si el jugador toca el cable con los pies
                isTouchingCable = true;
                if (!player.touchedCable) {
                    player.takeDamage(5); 
                    player.cableDamageTimer = 0;
                    player.touchedCable = true;
                } else if (player.cableDamageTimer >= 3000) {
                    player.takeDamage(5);
                    player.cableDamageTimer = 0;
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
            if (level !== "main" && level !== "BossRoom" && !GAME_LEVELS[level].statusCompleted && level != "secondLevel") {
                return false;
            }
        }
        return true;
    }
    
    function resetRoomStats(){ // Función que reinicia los stats de las habitaciones del juego para reutilizarlas en el futuro
        for (let room in GAME_LEVELS) {
            GAME_LEVELS[room].statusCompleted = false;
            GAME_LEVELS[room].roomPowerUp = null;
            GAME_LEVELS[room].powerupSpawned = false;
            GAME_LEVELS[room].puzzleCounted = false; // Reinicia el contador de puzzles
        }
        levelPuzzle = new Puzzle(canvasWidth, canvasHeight);; // Reinicia el puzzle
        levelPuzzle.puzzleCompleated == true;
    }

    function enviarStats() {
        const stats = {
            id_jugador: localStorage.getItem('jugador_id'),
            enemigos_derrotados: game.player.enemigosDerrotados,
            dano_total_recibido: game.player.danoTotalRecibido,
            power_ups_utilizados: game.player.powerUpsUtilizados,
            salas_completadas: game.player.salasCompletadas,
            jefes_derrotados: game.player.jefesDerrotados,
            puzzles_resueltos: game.player.puzzlesResueltos,
            partidas_jugadas: game.player.partidasJugadas,
            partidas_ganadas: game.player.partidasGanadas,
        };
        console.log(stats);
        console.log("Enviando estadísticas:", stats);

        // Enviar las estadísticas al servidor
        fetch('http://localhost:3000/api/jugador/stats/partida/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(stats),
        })
            .then(response => {
                if (response.ok) {
                    console.log("Estadísticas enviadas correctamente.");
                } else {
                    console.error("Error al enviar estadísticas:", response.status);
                }
            })
            .catch(error => {
                console.error("Error en la solicitud:", error);
            });
    }
    
    // Call the start function to initiate the game
    main();  