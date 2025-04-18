/*

    Equipo BitGuardians
    Object Class forthe object Player

*/

class Level {
    constructor(plan, existingPlayer = null) { // Constructor de la clase Level con el jugador inicial vacío
        // Split the plan string into a matrix of strings
        this.existingPlayer = existingPlayer; // Guardar el jugador existente si se proporciona
        let rows = plan.trim().split('\n').map(l => [...l]);
        this.height = rows.length;
        this.width = rows[0].length;
        this.actors = [];
        this.enemies = [];
        this.doors = []; // Nueva lista para almacenar puertas temporalmente
        this.enemyBullets = []; // Arreglo de balas de los enemigos
        this.playerBullets = []; // Arreglo de balas del jugador
        this.levelPowerUps = []; // Arreglo de powerups del nivel

        // Fill the rows array with a label for the type of element in the cell
        this.rows = rows.map((row, y) => {
            return row.map((ch, x) => {
                let item = levelChars[ch] || {};
                let cellType = this.setupActor(item, x, y);
                return cellType;
            });
        });

        // Configurar las puertas después de procesar todos los actores
        this.setupDoors();
    }

    setupActor(item, x, y) {
        let objClass = item.objClass;
        let actor = new item.objClass("grey", 1, 1, x, y, item.label);
        let cellType = item.label;

        if (actor.type === "player") {
            if (this.existingPlayer !== null) {
                this.addBackgroundFloor(x, y);
                this.player = this.existingPlayer;
                this.player.position.x = x;
                this.player.position.y = y;
            } else {
                this.addBackgroundFloor(x, y);
                actor.setSprite(item.sprite, item.rect);
                actor.sheetCols = item.sheetCols;
                actor.setAnimation(...item.startFrame, true, 100);
                this.player = actor;
            }
            cellType = "empty";
        } else if (actor.type === "robot" || actor.type === "dron" || actor.type === "boss") {
            this.addBackgroundFloor(x, y);
            let instanceRect = new Rect(...item.rectParams);
            actor.setSprite(item.sprite, instanceRect);
            actor.sheetCols = item.sheetCols;
            actor.setAnimation(...item.startFrame, true, 100);
            this.enemies.push(actor);
            cellType = "empty";
        } else if (actor.type == "cable") {
            this.addBackgroundFloor(x, y);
            actor.setSprite(item.sprite, item.rect);
            actor.sheetCols = item.sheetCols;
            actor.setAnimation(...item.startFrame, true, 100);
            this.actors.push(actor);
            cellType = "empty";
        } else if (actor.type === "floor") {
            item.rect = this.randomTile(0, 3, 0, 16, 16);
            actor.setSprite(item.sprite, item.rect);
            this.actors.push(actor);
        } else if (actor.type === "wall") {
            actor.setSprite(item.sprite, item.rect);
            this.actors.push(actor);
        } else if (actor.type === "cable") {
            this.addBackgroundFloor(x, y);
            actor.setSprite(item.sprite, item.rect);
            this.actors.push(actor);
        } else if (actor.type === "door") {
            this.doors.push(actor); // Almacenar la puerta para configurarla después
            actor.baseRect = item.rect; 
            if (item.char !== undefined) actor.char = item.char;
            this.actors.push(actor);
        } else if (actor.type === "puzzle") {
            this.addBackgroundFloor(x, y);
            actor.setSprite(item.sprite, item.rect);
            this.actors.push(actor);
            cellType = "empty";
        }
        return cellType;
    }

    //Función para configurar las puertas después de procesar todos los actores
    setupDoors() {
        const allRoomsCompleted = areAllRoomsCompleted();

        this.doors.forEach(door => {
            if (currentRoom === "main" && ["1", "2", "3"].includes(door.char) && !allRoomsCompleted) {
                door.close(); //Cerrar puertas si no se han completado todas las habitaciones
            } else if (currentRoom === "BossRoom" && this.enemies.length > 0) {
                door.close(); //Cerrar puertas si hay enemigos en la habitación del jefe
            } else if (this.enemies.length > 0) {
                door.close(); //Cerrar puertas si hay enemigos en la habitación
            } else {
                door.open(); //Abrir puertas si no hay enemigos
            }

            if (door.baseRect && door.spritePath) {
                door.setSprite(door.spritePath, door.baseRect);
            }
        });
    }







    addBackgroundFloor(x, y) {
        let floor = levelChars['.'];
        let floorActor = new GameObject("grey", 1, 1, x, y, floor.label);
        floor.rect = this.randomTile(0, 3, 0, 16, 16);     //(0, 6, 25, 32, 32) //(0, 25, 10, 32, 32)
        floorActor.setSprite(floor.sprite, floor.rect);
        this.actors.push(floorActor);
    }

    // Randomize sprites for each wall tile
    randomTile(xStart, xRange, y, xSize, ySize) {
        let tile = Math.floor(Math.random() * xRange + xStart);
        return new Rect(tile, y, xSize, ySize);
    }


    // Detect when the player touches a wall
    contact(playerPos, playerSize, type) {
        // Determine which cells the player is occupying
        let xStart = Math.floor(playerPos.x);
        let xEnd = Math.ceil(playerPos.x + playerSize.x);
        let yStart = Math.floor(playerPos.y);
        let yEnd = Math.ceil(playerPos.y + playerSize.y);

        // Check each of those cells
        for (let y = yStart; y < yEnd; y++) {
            for (let x = xStart; x < xEnd; x++) {
                // Anything outside of the bounds of the canvas is considered
                // to be a wall, so it blocks the player's movement
                let isOutside = x < 0 || x >= this.width ||
                    y < 0 || y >= this.height;
                let here = isOutside ? 'wall' : this.rows[y][x];
                // Detect if an object of type specified is being touched
                if (here == type) return true;
            }
        }
        return false;
    }

}