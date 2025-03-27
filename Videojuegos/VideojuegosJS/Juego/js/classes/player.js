/*

    Equipo BitGuardians
    Clase del objeto Jugador 

*/

"use strict";

let playerspeed = 0.005; // Atributo de velocidad del jugador

class Player extends AnimatedObject {
    constructor(color, width, height, x, y, type, hp, weapon, max_hp, shield, max_shield) {
        super("green", width*2, height*3, x, y, "player");
        this.velocity = new Vec(0.0, 0.0);
        this.hp = 100; // Atributo de vida del jugador
        this.max_hp = hp; // Atributo de vida máxima del jugador, la cual podrá ser incrementada con powerups.
        this.shield = 0; // Atributo de escudo del jugador
        this.max_shield = max_hp*0.1; // Atributo de escudo máximo del jugador, el cual podrá ser incrementado con powerups, el escudo será del 10% de la vida del jugador
        

        // Movimientos del jugador
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
                //sprite: '../assets/sprites/cipher_atkLeft2.png',
                status: false,
                repeat: false,
                duration: 100,
                moveFrames: [81, 84],
                idleFrames: [80, 80]
            },
            rightattack: {
                //sprite: '../assets/sprites/cipher_atkRight2.png',
                status: false,
                repeat: false,
                duration: 100,
                moveFrames: [91, 94],
                idleFrames: [90, 90]
            },
            upattack: {
                //sprite: '../assets/sprites/cipher_atkUp2.png',
                status: false,
                repeat: false,
                duration: 100,
                moveFrames: [0, 3],
                idleFrames: [0, 0]
            },
            downattack: {
                //sprite: '../assets/sprites/cipher_atkDown2.png',
                status: false,
                repeat: false,
                duration: 100,
                moveFrames: [70, 73],
                idleFrames: [70, 70]
            }
        };
        
    }

    update(level, deltaTime) {
        // Determinar donde termina el jugador después de que se mueve
        let newPosition = this.position.plus(this.velocity.times(deltaTime));

        // Moverse si el jugador no toca una pared
        if (!level.contact(newPosition, this.size, 'wall')) {
            this.position = newPosition;
        }

        // Si el jugador toca una puerta, pasa a la siguiente sala
        if (!level.contact(newPosition, this.size, 'door')) {
            level.nextRoom();
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
        dirData.status = true;        
        this.setAnimation(...dirData.moveFrames, dirData.repeat, dirData.duration);
    }

    stopAttack(direction) {
        const dirData = this.movement[direction + "attack"];
        if (!dirData || !dirData.status) return;
        dirData.status = false;
        const idleData = this.movement[direction];
        this.setAnimation(...idleData.idleFrames, true, idleData.duration);
    }

    // Método para que el jugador reciba daño
    takeDamage(damage){
        if (this.shield > 0) // Si el jugador tiene escudo, este recibe el daño.
        {
            this.shield -= damage;
            if (this.shield < 0) // Si el daño supera la cantidad de escudo, el daño restante se le aplica a la vida del jugador.
            {
                this.hp += this.shield;
                this.shield = 0;
            }
        }
        else // Si el jugador no tiene escudo, el daño se le aplica directamente a la vida.
        {
            this.hp -= damage;
        }
    }

    // Método para que el jugador pueda hacer daño (temporal aquí hasta definir la clase donde corresponde)
    doDamage(enemy){
        enemy.takeDamage(this.weapon.damage);
    }

}

