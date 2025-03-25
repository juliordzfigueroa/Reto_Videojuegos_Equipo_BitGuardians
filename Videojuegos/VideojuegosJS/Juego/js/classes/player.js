/*

    BitGuardians
    Object Class forthe object Player

*/

let playerspeed = 0.005; // Speed atribute for all players

class Player extends AnimatedObject {
    constructor(color, width, height, x, y, type) {
        super("green", width*2, height*3, x, y, "player");
        this.velocity = new Vec(0.0, 0.0);

        // Movement variables to define directions and animations
        this.movement = {
            right: {
                status: false,
                axis: "x",
                sign: 1,
                repeat: true,
                duration: 100,
                moveFrames: [30, 36],
                idleFrames: [30, 30]
            },
            left: {
                status: false,
                axis: "x",
                sign: -1,
                repeat: true,
                duration: 100,
                moveFrames: [40, 46], 
                idleFrames: [40, 40]
            },
            up: {
                status: false,
                axis: "y",
                sign: -1,
                repeat: true,
                duration: 100,
                moveFrames: [20, 26],
                idleFrames: [20, 20]
            },
            down: {
                status: false,
                axis: "y",
                sign: 1,
                repeat: true,
                duration: 100,
                moveFrames: [10, 16],
                idleFrames: [10, 10]
            },
            leftattack: {
                sprite: '../assets/sprites/cipher_atkLeft2.png',
                status: false,
                repeat: false,
                duration: 100,
                moveFrames: [0, 3],
                idleFrames: [0, 0]
            },
            rightattack: {
                sprite: '../assets/sprites/cipher_atkRight2.png',
                status: false,
                repeat: false,
                duration: 100,
                moveFrames: [0, 3],
                idleFrames: [0, 0]
            },
            upattack: {
                sprite: '../assets/sprites/cipher_atkUp2.png',
                status: false,
                repeat: false,
                duration: 100,
                moveFrames: [0, 3],
                idleFrames: [0, 0]
            },
            downattack: {
                sprite: '../assets/sprites/cipher_atkDown2.png',
                status: false,
                repeat: false,
                duration: 100,
                moveFrames: [0, 2],
                idleFrames: [0, 0]
            }
        };

        this.defaultSprite = '../assets/sprites/cipher_spritesheet.png';
        this.defaultRect = new Rect(0, 0, 32, 56);
        this.defaultSheetCols = 10;

        
    }

    update(level, deltaTime) {
        // Find out where the player should end if it moves
        let newPosition = this.position.plus(this.velocity.times(deltaTime));

        // Move only if the player does not move inside a wall
        if (!level.contact(newPosition, this.size, 'wall')) {
            this.position = newPosition;
        }

        this.updateFrame(deltaTime);
    }

    startMovement(direction) {
        const dirData = this.movement[direction];
        if (!dirData.status) {
            dirData.status = true;
            this.velocity[dirData.axis] = dirData.sign * playerSpeed;
            this.setAnimation(...dirData.moveFrames, dirData.repeat, dirData.duration);
        }
    }

    stopMovement(direction) {
        const dirData = this.movement[direction];
        dirData.status = false;
        this.velocity[dirData.axis] = 0;
        this.setAnimation(...dirData.idleFrames, dirData.repeat, dirData.duration);
    }

    // Para ataque
    startAttack(direction) {
        const dirData = this.movement[direction + "attack"];
        if (!dirData || dirData.status) return;

        // Detener animacion
        dirData.status = true;

        // Cambiar sprite al de ataque
        this.setSprite(dirData.sprite, dirData.rect);
        this.sheetCols = 10;
        this.setAnimation(...dirData.moveFrames, dirData.repeat, dirData.duration);
    }



    stopAttack(direction) {
        const dirData = this.movement[direction + "attack"];
        if (!dirData || !dirData.status) return;

        dirData.status = false;

        // Volver al sprite original e idle
        this.setSprite(this.defaultSprite, this.defaultRect);
        this.sheetCols = this.defaultSheetCols;

        const idleData = this.movement[direction];
        this.setAnimation(...idleData.idleFrames, true, idleData.duration);
    }
}
