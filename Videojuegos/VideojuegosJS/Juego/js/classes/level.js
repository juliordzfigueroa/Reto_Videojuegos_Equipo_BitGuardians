/*

    Equipo BitGuardians
    Object Class forthe object Player

*/

class Level {
    constructor(plan) {
        // Split the plan string into a matrix of strings
        let rows = plan.trim().split('\n').map(l => [...l]);
        this.height = rows.length;
        this.width = rows[0].length;
        this.actors = [];
        this.enemies = [];

        // Fill the rows array with a label for the type of element in the cell
        this.rows = rows.map((row, y) => {
            return row.map((ch, x) => {
                let item = levelChars[ch];
                let cellType = this.setupActor(item, x, y);
                return cellType;
            });
        });
    }

    setupActor(item, x, y) {
        let objClass = item.objClass;
        let actor = new objClass("grey", 1, 1, x, y, item.label);
        let enemy = new objClass("red", 1, 1, x, y, item.label);
        let cellType = item.label;

        if (actor.type === "player") {
            this.addBackgroundFloor(x, y);
            actor.setSprite(item.sprite, item.rect);
            actor.sheetCols = item.sheetCols;
            actor.setAnimation(...item.startFrame, true, 100);
            this.player = actor;
            cellType = "empty";
        } else if (actor.type === "robot" || actor.type === "dron") {
            this.addBackgroundFloor(x, y);
            actor.setSprite(item.sprite, item.rect);
            actor.sheetCols = item.sheetCols;
            this.enemies.push(actor);
            cellType = "empty";
        } else if (actor.type === "floor") {
            item.rect = this.randomTile(0, 3, 0, 16, 16);
            actor.setSprite(item.sprite, item.rect);
            this.actors.push(actor);
        } else if (actor.type === "wall") {
            actor.setSprite(item.sprite, item.rect);
            this.actors.push(actor);
        } else if (actor.type === "door") {
            actor.setSprite(item.sprite, item.rect);
            this.actors.push(actor);
        } else if (actor.type === "powerup") {
            actor.setSprite(item.sprite, item.rect);
            this.actors.push(actor);
            cellType = "empty";
        } else if (actor.type === "puzzle") {
            actor.setSprite(item.sprite, item.rect);
            this.actors.push(actor);
            cellType = "empty";
        }
        return cellType;
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